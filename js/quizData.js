//import van de data.
import data from "../data.js";

window.onload = function () {
  //waarden ophalen.
  let radioInputs = document.querySelectorAll(".sidebar input[type='radio']");
  let accessKey = "zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg";
  let cards = document.getElementById("cards");
  let reset = document.getElementById("reset-categorie");
  let geselecteerdInput;
  let geselecteerdeCategorie;

  //als er niets geselcteerd is maken we regen.
  cards.innerHTML =
    "<p class='rain1'></p> <p class='rain2'></p> <p class='rain3'></p> <p class='rain4'></p><p class='rain5'></p><h1 class='first-message'>Kies een categorie om te kunnen quizen!! </h1>";

    //luisteren naar het change event voor als we van categorie veranderen.
  radioInputs.forEach(function (input) {
    input.addEventListener("change", () => {
      if (input.checked) {
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
            for (let i = 0;i < Math.min(nodigeKaarten, imagesData.results.length);i++) {
              console.log(nodigeKaarten);
              createCard(
                imagesData.results[i].urls.regular,
                `${geselecteerdInput}: ${i + 1}`,
                i + 1,
                geselecteerdeCategorie
              );
            }
          })
          .catch((error) => {
            console.error(
              "Er is een fout opgetreden bij het ophalen van de foto's:" + error
            );
          });
        }
        // let firstKaart = document.querySelector(".individueleKaart");
        // if (firstKaart) {
        //   let categorie = firstKaart.getAttribute("key");
        //   let lengte1 = Object.keys(data[categorie].easy).length;
        //   let lengte2 = Object.keys(data[categorie].medium).length;
        //   let lengte3 = Object.keys(data[categorie].hard).length;
          
        //   console.log(lengte1);
        //   let difficulty = document.querySelectorAll(".difficulty");
        //   console.log(difficulty[1].textContent = "easy")
        
        //   for (let i = 1; i <= lengte1 / 10; i++) {
        //     difficulty[1].textContent = "easy";
        //   }
        //   for (let i = lengte1 / 10 + 1; i <= lengte2 / 10; i++) {
        //     difficulty[i].textContent = "medium";
        //   }
        //   for (let i = lengte2 / 10 + 1; i <= lengte3 / 10; i++) {
        //     difficulty[i].textContent = "hard";
        //   }
        // }
    });
  });



  reset.addEventListener("click", function () {
    cards.innerHTML = "<h2>Kies een categorie om te kunnen quizen!! </h2>";
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
    let kaart = document.createElement("figure");
    kaart.classList.add("individueleKaart");

    let image = document.createElement("img");
    image.src = `${imageUrl}`;

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = `${title}`;

    let difficulty = document.createElement("div");

    difficulty.classList.add("difficulty");

    kaart.appendChild(image);
    kaart.appendChild(figcaption);
    kaart.appendChild(difficulty);
    kaart.setAttribute("key2", categorie);

    difficulty.textContent = "medium";

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
      localStorage.clear();

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
      //we zullen dus nu de juiste kaarten in de localStorage steken.
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

    // function getDifficulty(categorie, cardID) {
    //   let som1 = Object.keys(data[categorie].easy).length;
    //   let som2 = Object.keys(data[categorie].medium).length;
    //   let som3 = Object.keys(data[categorie].hard).length;

    //   let totaalAantalVragen = som1 + som2 + som3;

    //   let questionsPerDifficulty = Math.ceil(totaalAantalVragen / 3);

    //   if (cardID <= questionsPerDifficulty) {
    //     return "easy";
    //   } else if (cardID <= 2 * questionsPerDifficulty) {
    //     return "medium";
    //   } else {
    //     return "hard";
    //   }
    // }





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
  
};