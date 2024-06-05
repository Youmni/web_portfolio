const btnExit = document.getElementById('btn-exit');
const btnSend = document.getElementById('btn-send');
if(window.matchMedia("(max-width: 925px)").matches){
    btnExit.innerHTML = "x";
    btnSend.innerHTML = ">";
}
