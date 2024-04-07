window.onload = async () => {


const message = document.getElementById("onSubmit");
let user =JSON.parse(localStorage.getItem("user"));
console.log(user);
document.getElementById("login").addEventListener("click", async (e) => {
e.preventDefault();


let username = document.getElementById("username").value;
let password = document.getElementById("password").value;
password = await generateHash(password);

compareLoginData(username, password, user)
.then((succes) => {
    message.classList.add("succes");
    message.textContent = succes;
    setTimeout(() => {
        window.location.href = "quizPagina.html";
    }, 2000);
})
.catch((error) => {
    message.classList.add("error");
    message.textContent = error;
})});

function compareLoginData(username, password, userObject) {
    return new Promise((resolve, reject) => {
        let usernameCorrect = userObject.username;
        let passwordCorrect = userObject.password;
        console.log("good:"+usernameCorrect);
        console.log("good:"+passwordCorrect);
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
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
};