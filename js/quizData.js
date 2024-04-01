window.onload = function(){

    let radioInputs = document.querySelectorAll(".sidebar input[type='radio']");
    let accessKey = "zj8ISMmd3gz5xJRIin98bhscoGqn1iFsO21vvTF4Zlg";
    let cards = document.getElementById("cards");
    
    radioInputs.forEach(function(input) {
    input.addEventListener('change', function() {
          if (input.checked) {
            geselecteerd = input.value;
            console.log(geselecteerd);

            cards.innerHTML = "";
            fetchData(`https://api.unsplash.com/search/photos?query=${geselecteerd}&client_id=${accessKey}&width=400&height=400`)
            .then(data => {
                
                console.log('Data opgehaald:', data);
                for(let i = 0; i<10; i++){
                    createCard( data.results[i].urls.full,'vul text');
                 }
            })
            .catch(error => {
        
                console.error('Er is een fout opgetreden:', error);
            });
         }

      });
    });

    async function fetchData(url) {
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

    }

    function createCard(imageUrl, title){
       
        let kaart = document.createElement('figure');

        let image = document.createElement('img');
        image.src = imageUrl;

        let figcaption = document.createElement('figcaption');
        figcaption.textContent = title;

        kaart.appendChild(image);
        kaart.appendChild(figcaption);
        kaart.classList.add("individueleKaart")

        kaart.addEventListener('click', function() {
            window.location.href = 'quizSpelPagina';
        });

        document.querySelector('.cards').appendChild(kaart);
    }