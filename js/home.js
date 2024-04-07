window.onload = () => { 

    const btn = document.getElementById("btn-login");
    const linkElement = document.querySelector('a[href="login.html"]');
    
    if(localStorage.getItem("user") !== null){
        btn.textContent = "Start Quizzing!";
        linkElement.href = "quizPagina.html";
    }
};