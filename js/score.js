window.onload = function () {

    let score = document.getElementById("score-results");
    let motivation = document.getElementById("score-motivation");

    let wellScored = [
        "You have proven that hard work pays off!",
        "You have fully utilized your potential and performed excellently!",
        "Your dedication and commitment have led to an impressive performance!",
        "Through your success, you have shown that you can handle any challenge!",
        "Your achievement is an inspiration for others to also strive for their goals!"
    ];
    
    let poorlyScored = [
        "This is an opportunity to learn and grow from this experience.",
        "Failure is a temporary setback, not a permanent defeat.",
        "See this as a challenge to improve yourself and come back stronger.",
        "Even in tough times, remain focused on your goals and do not get discouraged.",
        "You are more than your results; do not let this setback define you, but motivate you to keep going and continue to strive for success!"
    ];
    

      let random1 =  Math.floor(Math.random() * wellScored.length);
      let random2 =  Math.floor(Math.random() * poorlyScored.length);


      let results = JSON.parse(localStorage.getItem("correctAnswers"));
      let total = JSON.parse(localStorage.getItem("totalQuestions"));
      let btn = document.getElementById("btn");

      btn.addEventListener("click", function () {
          window.location.href = "quizPagina.html";
      });

      // laat de gebruiker zien hoeveel vragen hij/zij goed heeft beantwoord en geeft een motivatie.
      if(results >= 7){
          motivation.textContent = wellScored[random1];
      }
        else{
            motivation.textContent = poorlyScored[random2];
        }
        score.textContent = `Score: ${results}/${total}`;
};