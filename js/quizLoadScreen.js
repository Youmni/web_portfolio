window.onload = function () {

    let titel = document.getElementById("titel-in-container");
    let difficulty = document.getElementById("paragraaf-in-container");

    let titelLocalStorage = JSON.parse(localStorage.getItem("titel"));
    let difficultyLocalStorage = JSON.parse(localStorage.getItem("difficulty"));

    let button = document.getElementById("btn");

    titel.textContent = titelLocalStorage;
    difficulty.textContent = `Difficulty:${difficultyLocalStorage}`;
    
    button.addEventListener("click", function () {
        window.location.href = "quizGamePagina.html";
    });

    let color = JSON.parse(localStorage.getItem("user")).backgroundColor;
    document.getElementById("main").style.backgroundColor = color;
    document.body.style.backgroundColor = color;
};