window.onload = function () {

  //gegevens ophalen.
  let timeLeft = 30;
  let musicBtn = document.getElementById("music");
  let showVolume = false;
  const exit = document.getElementById("btn-exit");
  const timerElement = document.getElementById("timer");
  const sendBtn = document.getElementById("btn-send");
  const popup = document.getElementById("end-quiz");
  let timerInterval = setInterval(updateTimer, 1000);


  //haal het aantal vragen op dat er zich in de localStorage bevinden.
  const getNumberOfQuestions = () => {
    let numberOfQuestions = 0;

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
      
        if (key.startsWith("question")) {
            numberOfQuestions++;
        }
    }

    return numberOfQuestions;
};


  // voorzie plaats.
  localStorage.setItem("correctAnswers", null);
  localStorage.setItem("totalQuestions", null);

  const audios = [
    "../music/music1.mp3",
    "../music/music2.mp3",
    "../music/music3.mp3",
    "../music/music4.mp3",
    "../music/music5.mp3",
    "../music/music6.mp3",
    "../music/music7.mp3",
    "../music/music8.mp3",
    "../music/music9.mp3",
    "../music/music10.mp3",
    "../music/music11.mp3",
  ];
  
const [audio1, audio2, ...resterendeAudios] = [...audios];

console.log(`Deze file bevat jazz muziek: ${audio1}`);
console.log(`Deze file bevat country muziek: ${audio2}`);
  //random kiezen uit de verschillende audio bestanden.
  const r = Math.floor(Math.random() * resterendeAudios.length);
  const audio = new Audio(audios[r]);
  let options = document.querySelectorAll(".options");

  //alles wordt gestart op index 1.
  let index = 1;
  let correctAnswers = 0;

  //toont hoeveel vragen er zijn in de localStorage.
  let showStreak = getNumberOfQuestions();

  //maakt streaks om aan te tonen of je juist of fout was.
  let scoreButtons = document.getElementById("score");
  for (let i = 1; i <= showStreak; i++) {
    let p = document.createElement("p");
    p.classList.add("streak");
    p.id = `streak${i}`;
    p.style.padding = "10px";
    p.style.height = "10px";
    p.style.width = "10px";
    p.setAttribute("key", `streak${i}`);
    if(window.matchMedia("(max-width: 768px)").matches){
      p.style.padding = "10px";
      p.style.height = "5px";
      p.style.width = "5px";
    }
    scoreButtons.appendChild(p);
  }

  //als de audio gedaan is willen we deze opnieuw beginnen.
  audio.addEventListener("ended", function () {
    audio.currentTime = 0;
    audio.play();
  });

  //audio aan en uit zetten + van foto veranderen.
  musicBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    showVolume = !showVolume;
    if (showVolume == true) {
      musicBtn.src = "photos/volume_727269.png";
    } else {
      musicBtn.src = "photos/mute_727240.png";
    }
  });

//functie om de timer te updaten.
  function updateTimer() {
    timerElement.textContent = timeLeft + "sec";
    timeLeft--;
    updateBackgroundInput();

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      handleTimeUp(options);
      sessionStorage.clear(); 
    }
  }

  // Dit is om te voorkomen dat er waarden blijven staan nadat er gereload wordt. 
  //De gebruiker begint opnieuw, met een schone sessionStorage.
  window.addEventListener("beforeunload", function () {
    sessionStorage.clear();
  });


  //als de tijd gedaan is zal deze functie nakijken welke vraag correct was zodat de gebruiker visueel kan zien welke vraag juist was.
  function handleTimeUp(options) {
    let correctAnswerIndex = findCorrectAnswerIndex();
    if (correctAnswerIndex !== -1) {
      options[correctAnswerIndex].classList.add("correct-answer");
    }
    for (let i = 0; i <= 3; i++) {
      if (options[i].textContent == JSON.parse(localStorage.getItem(`question${index}`)).correct_answer) {
        options[i].style.backgroundColor = "green";
      } else {
        options[i].style.backgroundColor = "red";
      }
    }

    //zorgt ervoor dat er niet te snel kan verzonden worden.
    checkAnswer();
    setTimeout(function () {
      showNextQuestion();
    }, 3000);
  }


  function findCorrectAnswerIndex() {
    //indien niet gevonden -1.
    let correctAnswerIndex = -1;
    options.forEach((option, index) => {
      if (option.getAttribute("key") === "correct") {
        correctAnswerIndex = index;
      }
    });
    return correctAnswerIndex;
  }


  //wordt gebruikt om naar de volgende vraag te gaan.
  function showNextQuestion() {
    if (index < getNumberOfQuestions()) {
      for (let i = 0; i <= 3; i++) {
        options[i].style.backgroundColor = "#4d6985";
      }
      index++;
      quizInput(index); 
      resetTimer();
    } else {
      finale(quizCompleted);
    }
  }
  //indien de laaste vraag beantwoord is zal deze functie aangeroepen worden/ het spel stopt.
  function finale(callback) {
    localStorage.setItem("correctAnswers", correctAnswers);
    localStorage.setItem("totalQuestions", getNumberOfQuestions());

    callback();
  }

  function quizCompleted(){

    popup.style.display = "block";
    document.getElementById("btn-results").addEventListener("click", function () {
      window.location.href = "scorePagina.html";
    });
    document.getElementById("btn-back").addEventListener("click", function () {
      window.location.href = "quizPagina.html";
    });

    setTimeout(function () {
      window.location.href = "scorePagina.html";
    }, 10000);
  }

  //zal luisteren naar het antwoord van de gebruiker.
  options.forEach((option) => {
    option.addEventListener("click", function () {
      sessionStorage.setItem("inputAnswer", option.textContent);
    });
  });

  //als de tijd gedaan is zal deze functie de streak rood of groen maken.
  function checkAnswer() {
    let correctAnswer = JSON.parse(localStorage.getItem(`question${index}`)).correct_answer;
    let inputAnswer = sessionStorage.getItem("inputAnswer");
    let streak = document.getElementById(`streak${index}`);
    if (inputAnswer === correctAnswer) {
      streak.style.backgroundColor = "green";
      correctAnswers++;
    }
    else {
      streak.style.backgroundColor = "red";
    }
  }

  //als de gebruiker klikt zal het blauw een beetje donkerder worden.
  function updateBackgroundInput(){
    options.forEach((option) => {
      option.addEventListener("click", function () {
        options.forEach((NotClickedoption) => {
          if(NotClickedoption !== option){
            NotClickedoption.style.backgroundColor = "#4d6985";
          }});
        option.style.backgroundColor = "#4c6d9e";
      });
    });
  }

  //dit is om naar de volgende vraag te gaan.
  sendBtn.addEventListener("click", function () { 
    
    sendBtn.disabled = true;

    setTimeout(function () {
      sendBtn.disabled = false;
    }, 3000);
    clearInterval(timerInterval);
    handleTimeUp(options);
  })

  //als de gebruiker op exit klikt zal deze terug naar de quizPagina gaan.
  exit.addEventListener("click", function () {
    window.location.href = "quizPagina.html";
  });

  //deze functie zal zorgen dat er een vraag en opties beschikbaar worden gemaakt elke ronde.
  function quizInput(index) {
    let answersTotal = [];
    let incorrectAnswers = JSON.parse(localStorage.getItem(`question${index}`)).incorrect_answers;
    let correctAnswer = JSON.parse(localStorage.getItem(`question${index}`)).correct_answer;

    answersTotal = incorrectAnswers.concat(correctAnswer);
    answersTotal.sort(() => Math.random() - 0.5);

    let question = document.getElementById("question");
    question.innerHTML = JSON.parse(localStorage.getItem(`question${index}`)).question;

    for (let j = 0; j <= 3; j++) {
      options[j].innerHTML = answersTotal[j];
    }
  }


  function resetTimer() {
    timeLeft = 30;
    timerElement.textContent = timeLeft + "sec";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }
  

  quizInput(index);
  let color = JSON.parse(localStorage.getItem("user")).backgroundColor;
  document.body.style.backgroundColor = color;
  document.getElementById("main").style.backgroundColor = color;
  
};
