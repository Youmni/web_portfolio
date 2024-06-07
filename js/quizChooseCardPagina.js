//import van de data.
import data from "../data.js";

window.onload = function () {

  // self executing functie
  (function(naam) {
    console.log("De " + naam + " is geladen!");
  })("javascript");


  //waarden ophalen.
  const radioInputs = document.querySelectorAll(".sidebar input[type='radio']");
  const cards = document.getElementById("cards");
  const reset = document.getElementById("reset-categorie");
  const profile = document.getElementById("profile");
  const accessKey = "zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg";
  let geselecteerdInput;
  let geselecteerdeCategorie;

  //als er niets geselcteerd is maken we regen.
  cards.innerHTML =
    "<h1 class='first-message'><span></span></h1>";

  profile.addEventListener("click", function () { 
    if(localStorage.getItem("user") === null){
     alert("You need to be logged in to see your profile!");
    }
    else{
      window.location.href = "profile.html";
    }
  });
    //luisteren naar het change event voor als we van categorie veranderen.
  radioInputs.forEach(function (input) {
    input.addEventListener("change", function () {
      if(localStorage.getItem("user") === null){
       cards.innerHTML = "<div class='first-message-noLogin'><h3>You need to be logged in to play a quiz!</h3><button id='btn-noLogin'>Login / Registrate</button></div>";
        let btnNoLogin = document.getElementById("btn-noLogin");
        btnNoLogin.addEventListener("click", function () {  
          window.location.href = "login.html";
        });
      }
      else if(input.checked) {
        geselecteerdInput = input.value;
        geselecteerdeCategorie = input.getAttribute("key");
        console.log(geselecteerdInput);
        console.log(geselecteerdeCategorie);
        console.log(
          data[geselecteerdeCategorie.toLowerCase()].easy[`question${1}`]
        );

        //zeker zijn dat er geen kaarten zijn.
        cards.innerHTML = "";
        // api om de afbeeldingen op te halen.
        let url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          geselecteerdInput
        )}&client_id=${accessKey}&width=400&height=400`;
        fetchImages(url)
          .then((imagesData) => {

            //checken hoeveel kaarten we zullen nodig hebben en dus ook hoeveel afbeeldingen.
            let nodigeKaarten = 0;
            let categorieData = data[geselecteerdeCategorie.toLowerCase()]; 
            if (
              categorieData.easy &&
              Object.keys(categorieData.easy).length > 0
            ) {
              nodigeKaarten += Math.ceil(
                Object.keys(categorieData.easy).length / 10
              );
            }
            if (
              categorieData.medium &&
              Object.keys(categorieData.medium).length > 0
            ) {
              nodigeKaarten += Math.ceil(
                Object.keys(categorieData.medium).length / 10
              );
            }
            if (
              categorieData.hard &&
              Object.keys(categorieData.hard).length > 0
            ) {
              nodigeKaarten += Math.ceil(
                Object.keys(categorieData.hard).length / 10
              );
            }

            // nadat we weten hoeveel kaarten we nodig hebben gaan we de kaarten maken.
            for (let i = 0;i < nodigeKaarten;i++) {
              console.log(nodigeKaarten);
              createCard(
                imagesData.results[i].urls.regular,
                `${geselecteerdInput}: ${i + 1}`,
                i + 1,
                geselecteerdeCategorie
              );
              console.log("id:"+(i + 1));
            }
          })
          .catch((error) => {
            console.error(
              "Er is een fout opgetreden bij het ophalen van de foto's:" + error
            );
          });
        }
    });
  });



  reset.addEventListener("click", function () {
    cards.innerHTML = "<h2 class='first-message'>Choose a category to start quizzing!! </h2>";
  });

  // wordt gebruikt om de afbeeldingen op te halen.
  async function fetchImages(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Er is een laadfout");
        }
        return response.json();
      })
      .catch((error) => {
        throw error;
      });
  }


  //wordt aangeroepen om een kaart te maken.
  function createCard(imageUrl, title, id, categorie) {
    console.log(id)
    let kaart = document.createElement("figure");
    kaart.classList.add("individueleKaart");

    let image = document.createElement("img");
    image.src = `${imageUrl}`;

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = `${title}`;

    let difficulty = document.createElement("div");

    difficulty.classList.add("difficulty");

    // Kijken welke difficulty we moeten zeggen
    let vragen1 = Object.keys(data[categorie.toLowerCase()].easy).length;
    let vragen2 = Object.keys(data[categorie.toLowerCase()].medium).length;
    let vragen3 = Object.keys(data[categorie.toLowerCase()].hard).length;
    console.log(vragen3);

    let difficultyReeks = checkForDifficulty(vragen1, vragen2, vragen3);
    console.log(difficultyReeks);
    let difficultyContent = "";
    if(difficultyReeks.hasOwnProperty("easy") && difficultyReeks["easy"] >= id) {
      difficultyContent= "easy";
    }
    else if(difficultyReeks.hasOwnProperty("medium") && difficultyReeks["medium"] >= id) {
      difficultyContent = "medium";
    }
    else if(difficultyReeks.hasOwnProperty("hard") && difficultyReeks["hard"] >= id) {
      difficultyContent = "hard";  
    }

    if (difficultyContent !== "") {
      difficulty.textContent = difficultyContent;
    }

    kaart.appendChild(image);
    kaart.appendChild(figcaption);
    kaart.appendChild(difficulty);
    kaart.setAttribute("key2", categorie);



    kaart.setAttribute("key", id);
    document.querySelector(".cards").appendChild(kaart);

    //we vangen alle clicks op.
    kaart.addEventListener("click", function () {
      sessionStorage.clear();
      let kaartId = kaart.getAttribute("key");

      //lengte van de vragen ophalen om het later de juiste vragen in de juiste kaarten te kunnen steken.
      let som1 = Object.keys(data[categorie.toLowerCase()].easy).length;
      let som2 = Object.keys(data[categorie.toLowerCase()].medium).length;
      let som3 = Object.keys(data[categorie.toLowerCase()].hard).length;
      sessionStorage.setItem("som1", som1);
      sessionStorage.setItem("som2", som2);
      sessionStorage.setItem("som3", som3);
      //localStorage.clear();

      let vragenReeks = checkForWhichQuestions(som1, som2, som3, kaartId);

      //startpunt van de vragen + 1.
      const keyToQuestion = {
        1: "0",
        2: "10",
        3: "20",
        4: "30",
        5: "40",
      };
      
      //we hebben het antwoord van de checkForWhichQuestions() functie terug,
      //we zullen dus nu de juiste vragen in de localStorage steken.
      let j = 1;
      if (vragenReeks.hasOwnProperty("easy")) {
        for (let i = 1;i <= 10;i++) {
            localStorage.setItem(
              `question${i}`,
              JSON.stringify(data[categorie.toLowerCase()].easy[`question${parseInt(keyToQuestion[vragenReeks["easy"]]) + j}`])
            );//de kaart wordt in de localStorage gestoken.
            j++;
          }
          localStorage.setItem(
            `difficulty`,
            JSON.stringify(data[categorie.toLowerCase()].easy[`question1`].difficulty)); //de difuculty wordt in de localStorage gestoken.
            
      } else if (vragenReeks.hasOwnProperty("medium")) {
        for (let i = 1;i <=10;i++){
            localStorage.setItem(
              `question${i}`,
              JSON.stringify(
                data[categorie.toLowerCase()].medium[`question${parseInt(keyToQuestion[vragenReeks["medium"]]) + j}`])            
            );//de kaart wordt in de localStorage gestoken.
            j++;
        }
        localStorage.setItem(
          `difficulty`,
          JSON.stringify(data[categorie.toLowerCase()].medium[`question1`].difficulty)); //de difuculty wordt in de localStorage gestoken.
      } else {
        for (let i = 1;i <= 10;i++) {
          if (i <= som3) {
            localStorage.setItem(
              `question${i}`,
              JSON.stringify(
                data[categorie.toLowerCase()].hard[`question${parseInt(keyToQuestion[vragenReeks["hard"]]) + j}`]
            ));//de kaart wordt in de localStorage gestoken.
            j++;
          }
        }
        localStorage.setItem(
          `difficulty`,
          JSON.stringify(data[categorie.toLowerCase()].hard[`question1`].difficulty)); //de difuculty wordt in de localStorage gestoken.
      }
      localStorage.setItem(
        `titel`,
        JSON.stringify(title));

      localStorage.setItem(`category`, categorie);


      //als de gebruiker op een klaart klikt zal deze naar de loadQuiz pagina worden geleid.
      window.location.href = "loadQuizGame.html"
    });

  }





    //deze functie bepaalt de hoeveelste kaart de momentele kaart is in de difficulty van zijn categorie.
    const checkForWhichQuestions = (som1, som2, som3, key) => {
      if (som1 < 10) {
          som1 = 10;
      }
      if (som2 < 10) {
          som2 = 10;
      }
      if (som3 < 10) {
          som3 = 10;
      }
  
      let vraagReeks = {};
  
      if (som1 >= key * 10) {
          vraagReeks["easy"] = key;
      } else if (som1 + som2 >= key * 10) {
          vraagReeks["medium"] = (key-(som1/10));
      } else {
          vraagReeks["hard"] = (key-(som1/10)-(som2/10));
      }
      return vraagReeks;
  }

  // Deze onderstaande functie geeft de difficulty van de categorie terug.

  const checkForDifficulty = (som1, som2, som3) => {
    if (som1 < 10) {
        som1 = 10;
    }
    if (som2 < 10) {
        som2 = 10;
    }
    if (som3 < 10) {
        som3 = 10;
    }

    let difficultyReeks = {};

    difficultyReeks["easy"] = som1 / 10;
    difficultyReeks["medium"] = (som2+som1) / 10;
    difficultyReeks["hard"] =  (som2+som1+som3) / 10;
    return difficultyReeks;
}


  let color = JSON.parse(localStorage.getItem("user")).backgroundColor;
  document.body.style.backgroundColor = color;
};