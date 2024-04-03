import data from "../data.js";

window.onload = function () {
  let radioInputs = document.querySelectorAll(".sidebar input[type='radio']");
  let accessKey = "zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg";
  let cards = document.getElementById("cards");
  let reset = document.getElementById("reset-categorie");
  let geselecteerdInput;
  let geselecteerdeCategorie;
  let begin = document

  radioInputs.forEach(function (input) {
    input.addEventListener("change", () => {
      if (input.checked) {
        geselecteerdInput = input.value;
        geselecteerdeCategorie = input.getAttribute("key");
        console.log(geselecteerdInput);
        console.log(geselecteerdeCategorie); 
        console.log(data[geselecteerdeCategorie.toLowerCase()].easy[`question${1}`]);  

        cards.innerHTML = "";
        let apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(geselecteerdInput)}&client_id=${accessKey}&width=400&height=400`;
        console.log(apiUrl); // Controleren of de URL correct is opgebouwd
        fetchImages(apiUrl)
          .then((imagesData) => {
            let nodigeKaarten = 0;
            let categorieData = data[geselecteerdeCategorie.toLowerCase()]; // Haal de categoriegegevens op
            if (categorieData.easy && Object.keys(categorieData.easy).length > 0) {
              nodigeKaarten += Math.ceil(Object.keys(categorieData.easy).length / 10);
            }
            if (categorieData.medium && Object.keys(categorieData.medium).length > 0) {
              nodigeKaarten += Math.ceil(Object.keys(categorieData.medium).length / 10);
            }
            if (categorieData.hard && Object.keys(categorieData.hard).length > 0) {
              nodigeKaarten += Math.ceil(Object.keys(categorieData.hard).length / 10);
            }
              
            console.log(Object.keys(imagesData.results).length);
            for (let i = 0; i < Math.min(nodigeKaarten, imagesData.results.length); i++) {
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
    });
  });

  reset.addEventListener("click", function () {
    cards.innerHTML = "<h2>Kies een categorie om te kunnen quizen!! </h2>";
  });

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

  function createCard(imageUrl, title, id, categorie) {

    let kaart = document.createElement("figure");
    kaart.classList.add("kaart");

    let image = document.createElement("img");
    image.src = `${imageUrl}`;

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = `${title}`;

    let difficulty = document.createElement("div");

    difficulty.textContent = `easy`;
    difficulty.classList.add("difficulty");

    kaart.appendChild(image);
    kaart.appendChild(figcaption);
    kaart.appendChild(difficulty);
    kaart.classList.add("individueleKaart");
    kaart.setAttribute("key", id);


    document.querySelector(".cards").appendChild(kaart);
    kaart.addEventListener("click", function () {
        let kaartId = kaart.getAttribute("key");
      
        let som1 = Object.keys(data[categorie.toLowerCase()].easy).length;
        let som2 = Object.keys(data[categorie.toLowerCase()].medium).length;
        let som3 = Object.keys(data[categorie.toLowerCase()].hard).length;
      
        localStorage.clear();
        let vragenReeks = checkForWhichQuestions(som1, som2, som3, kaartId);
      
        let j = 1;
        let limiet = 10;
        if (vragenReeks.hasOwnProperty("easy")) {
          for (let i = vragenReeks["easy"]; i < vragenReeks["easy"] + limiet; i++) {
            if (i <= som1) {
              localStorage.setItem(
                `question${j}`,
                JSON.stringify(data[categorie.toLowerCase()].easy[`question${i}`])
              );
              j++;
            }
          }
        } else if (vragenReeks.hasOwnProperty("medium")) {
          for (let i = vragenReeks["medium"]; i < vragenReeks["medium"] + limiet; i++) {
            if (i <= som2) {
              localStorage.setItem(
                `question${j}`,
                JSON.stringify(data[categorie.toLowerCase()].medium[`question${i}`])
              );
              j++;
            }
          }
        } else {
          for (let i = vragenReeks["hard"]; i < vragenReeks["hard"] + limiet; i++) {
            if (i <= som3) {
              localStorage.setItem(
                `question${j}`,
                JSON.stringify(data[categorie.toLowerCase()].hard[`question${i}`])
              );
              j++;
            }
          }
        }
      });
      
      
      function getDifficulty(categorie, cardID) {
        let som1 = Object.keys(data[categorie].easy).length;
        let som2 = Object.keys(data[categorie].medium).length;
        let som3 = Object.keys(data[categorie].hard).length;

        let totaalAantalVragen = som1 + som2 + som3;
    
        let questionsPerDifficulty = Math.ceil(totaalAantalVragen / 3);

        if (cardID <= questionsPerDifficulty) {
            return "easy";
        } else if (cardID <= 2 * questionsPerDifficulty) {
            return "medium";
        } else {
            return "hard";
        }
    }     
      
  }    
  const checkForWhichQuestions = (som1, som2, som3, key) => {

    if (som1 <= 10) {
        som1 = 10;
      } else if (som2 <= 10) {
        som2 = 10;
      } else if (som3 <= 10) {
        som3 = 10;
      } else {
        //doe niets
      }

    let vraagReeks = {};

    if (som1 >= key * 10) {
        vraagReeks["easy"] = Math.min(Math.ceil(key / 10), som1 / 10);
    } else if (som1 + som2 >= key * 10) {
        vraagReeks["medium"] = Math.min(Math.ceil((key * 10 - som1) / 10), som2 / 10);
    } else {
        vraagReeks["hard"] = Math.min(Math.ceil((key * 10 - som1 - som2) / 10), som3 / 10);
    }

    return vraagReeks;
};
};
