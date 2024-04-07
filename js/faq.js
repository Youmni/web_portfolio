window.onload = () => {

    let answers = document.querySelectorAll(".answer");
    let questions = document.querySelectorAll(".faq-container");

    questions.forEach((question, index) => {
        question.addEventListener("click", function () {
            answers[index].classList.toggle("show-answer");
        });
    });    
    
    let color = JSON.parse(localStorage.getItem("user")).backgroundColor;
    document.body.style.backgroundColor = color;
    
}