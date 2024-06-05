window.onload = async () => {


const message = document.getElementById("onSubmit");
let user =JSON.parse(localStorage.getItem("user"));
console.log(user);

let { username: usernameCorrect, password: passwordCorrect } = user;

document.getElementById("login").addEventListener("click", async (e) => {
e.preventDefault();


let username = document.getElementById("username").value;
let password = document.getElementById("password").value;
password = await generateHash(password);

compareLoginData(username, password, usernameCorrect, passwordCorrect)
.then((succes) => {
  message.classList.remove("error");  
    message.classList.add("succes");
    message.textContent = succes;
    setTimeout(() => {
        window.location.href = "quizPagina.html";
    }, 2000);
})
.catch((error) => {
  message.classList.remove("succes");
    message.classList.add("error");
    message.textContent = error;
})});

function compareLoginData(username, password, usernameCorrect, passwordCorrect) {
    return new Promise((resolve, reject) => {
      if (username === usernameCorrect && password === passwordCorrect) {
        resolve("Login succesfull!");
        userObject.login = true;
      } else {
        console.log("user"+username);
        console.log("user"+password);
        reject("Try again!");

      }
    });
  }

  async function generateHash(message) {
    const utf8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }
};