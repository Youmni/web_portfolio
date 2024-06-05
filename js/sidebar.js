console.log("sidebar.js is connected");
if (window.matchMedia("(max-width: 750px)").matches) {
  let radioInputs = document.querySelectorAll(
    "#categorie-form input[type='radio']"
  );
  let sidebar = document.getElementById("sidebar");
  let cards = document.getElementById("cards");

  radioInputs.forEach(function (input) {
    input.addEventListener("change", () => {
      cards.style.display = "initial";
      sidebar.style.display = "none";

      cards.style.justifyContent = "center";
      cards.style.alignItems = "center";

      let button = document.createElement("button");
      button.textContent = "Categories";
      button.style.position = "fixed";
      button.style.bottom = "0px";
      button.style.left = "0px";
      button.style.right = "0px";
      button.style.backgroundColor = "#333333";
      button.style.color = "#ffffff";
      button.style.border = "none";
      button.style.padding = "20px 40px";
      button.style.fontSize = "16px";
      button.style.borderRadius = "5px";
      button.style.cursor = "pointer";
      document.body.appendChild(button);

      button.addEventListener("click", () => {
        cards.style.display = "none";
        sidebar.style.display = "initial";
        document.body.removeChild(button);
      });

      console.log("button", button);
    });
  });



}