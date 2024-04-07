window.onload = () => { 


    let backgroundColors  = document.querySelectorAll(".color-option");
    backgroundColors.forEach((color) => {
        color.addEventListener("click", function(){

            backgroundColors.forEach((otherColor) => {
                otherColor.classList.remove("selected");
            });

            color.classList.add("selected");
            let user = JSON.parse(localStorage.getItem("user"));
            user.backgroundColor = color.getAttribute("data-color");
            localStorage.setItem("user", JSON.stringify(user));
        });
    });
    document.getElementById("color-selected").addEventListener("click", function(){ 
            window.location.href = "quizPagina.html";
    });

};