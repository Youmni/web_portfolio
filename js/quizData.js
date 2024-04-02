window.onload = function(){

    let radioInputs = document.querySelectorAll(".sidebar input[type='radio']");
    let accessKey = "zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg";
    let cards = document.getElementById("cards");
    let reset = document.getElementById("reset-categorie");
    let geselecteerd; 
    let geselecteerdeCategorie;
    let dataQuestion;


    let urlBegin = `https://opentdb.com/api.php?amount=50`;
    let urlEinde = `&type=multiple`;

    radioInputs.forEach(function(input) {
        input.addEventListener('change', () => {
            if (input.checked) {
                geselecteerd = input.value;
                geselecteerdeCategorie = input.getAttribute('key'); 
                console.log(geselecteerd);

                cards.innerHTML = "";
                fetchImages(`https://api.unsplash.com/search/photos?query=${geselecteerd}&client_id=${accessKey}&width=400&height=400`)
                .then(imagesData => {
                    let aantalKaarten = 5;
                    fetchQuestions(urlBegin, urlEinde, geselecteerdeCategorie)
                    .then(dataQ =>{
                        dataQuestion = dataQ;
                        let aantalKaarten;
                        
                        if(dataQuestion.results && dataQuestion.results.length >10){
                            aantalKaarten = 5;
                        }
                        else if(dataQuestion.results && dataQuestion.results.length <=10){
                            aantalKaarten = 1;
                        }
                        else{
                            geenKaarten = true;
                        }
                        let randomType = Math.random() < 0.5 ? "medium" : "hard";

                        for(let i = 0; i < aantalKaarten; i++){
                            createCard(imagesData.results[i].urls.full,`Quiz: ${categorie[geselecteerdeCategorie]+(i+1)}`, i);
                        }
                    })
                    .catch(error => {
                        console.error('Er is een fout opgetreden bij het ophalen van vragen:', error);
                    });
                })
            }
        });
    });

    reset.addEventListener('click', function() {
        cards.innerHTML = "<h2>Kies een categorie om te kunnen quizen!! </h2>";
    });


    async function fetchQuestions(urlBegin, urlEinde, geselecteerdeCategorie){
         let response = await fetch(`${urlBegin}&category=${geselecteerdeCategorie}${urlEinde}`);
         let data = await response.json();

         return data;
    }


    async function fetchImages(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Er is een laadfout");
                }
                return response.json();
            })
            .catch(error => {
                throw error;
            });
    }

    function createCard(imageUrl, title, id){ 
   
        let kaart = document.createElement('figure');
    
        let image = document.createElement('img');
        image.src = imageUrl;
    
        let figcaption = document.createElement('figcaption');
        figcaption.textContent = `${title}`;
    
        kaart.appendChild(image);
        kaart.appendChild(figcaption);
        kaart.classList.add("individueleKaart");
        kaart.setAttribute('key', id);
    
        kaart.addEventListener('click', function() {
            let kaartId = kaart.getAttribute('key');
            let start = kaartId * 10;
            let einde = start + 10;
    
            fetchQuestions(urlBegin, urlEinde, geselecteerdeCategorie)
            .then( data => {
                if (data.results && data.results.length > 0) {
                    localStorage.clear();
                    
                    let vraagnr = 0;
                    for(let i = start; i < einde; i++){
                        localStorage.setItem(`quizvraag${vraagnr}`, JSON.stringify(data.results[i])); 
                        console.log(data.results[i])
                        vraagnr++;
                    }
                } else {
                    console.error('Geen gegevens ontvangen van de API.');
                }
            })
            .catch(error => {
                console.error('Er is een fout opgetreden bij het ophalen van vragen:', error);
            });
        });
    
        document.querySelector('.cards').appendChild(kaart);
    }
}
