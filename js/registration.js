window.onload = function () {
    // Zorg ervoor dat er maar 3 interesses geselecteerd kunnen worden.
    let checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (box) {
        box.addEventListener("change", function () {
            let checkedCount = Array.from(checkboxes).filter(i => i.checked).length;
            if (checkedCount > 3) {
                this.checked = false;
                alert("You can only select up to 3 interests.");
            }
        });
    });

    const form = document.getElementById("form");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordRepeat = document.getElementById("password-repeat");
    let succes = true;

    const userParagraf = document.getElementById("username-check");
    const emailParagraf = document.getElementById("email-check");
    const passwordParagraf = document.getElementById("password-check");
    const passwordRepeatParagraf = document.getElementById("password-repeat-check");
    const interestsParagraf = document.getElementById("form-intresest");
    const Onsucces = document.getElementById("form-succesfull");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let gender = document.querySelector("input[type=radio]:checked");
        let test = "";

        test = checkGebruikersnaam();
        updateResult(userParagraf, test);
        if (test !== "") succes = false;

        test = checkEmail();
        updateResult(emailParagraf, test);
        if (test !== "") succes = false;

        test = checkWachtwoord();
        updateResult(passwordRepeatParagraf, test);
        if (test !== "") succes = false;

        test = checkInterest();
        updateResult(interestsParagraf, test);
        if (test !== "") succes = false;


        if(checkForTest() === false){
            succes = true;
        }
        if (succes == true) {
            removeOnSuccess(userParagraf, emailParagraf, passwordParagraf, passwordRepeatParagraf, interestsParagraf);
            createUser(username, email, gender);
            Onsucces.classList.add("succes");
            Onsucces.textContent = "Successfully registered!";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    });

    function checkForTest() {
        let tests = [
            checkGebruikersnaam(),
            checkEmail(),
            checkWachtwoord(),
            checkInterest(),
        ];
    
        for (let i = 0; i < tests.length; i++) {
            if (tests[i] !== "") {
                return true;
            }
        }
    
        return false;
    }

    function checkGebruikersnaam() {
        if (username.value.length < 4 || username.value.length > 20) {
            return "Your username must be between 4 and 20 characters long.";
        } else {
            return "";
        }
    }

    function checkEmail() {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            return "Please enter a valid email address.";
        } else {
            return "";
        }
    }

    function checkWachtwoord() {
        if (password.value.length < 4 || password.value.length > 20 || passwordRepeat.value !== password.value) {
            return "Your password must be between 4 and 20 characters long and match the confirmation.";
        } else {
            return "";
        }
    }

    function checkInterest() {
        let checkedInterests = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checkedInterests.length === 0) {
            return "Please select at least one interest.";
        } else {
            return "";
        }
    }

    function updateResult(element, message) {
        if (message) {
            element.textContent = message;
            element.style.color = "red";
        } else {
            element.textContent = "Correct!";
            element.style.color = "green";
        }
    }

    function removeOnSuccess(userParagraf, emailParagraf, passwordRepeatParagraf, interestsParagraf) {
        userParagraf.textContent = "";
        emailParagraf.textContent = "";
        passwordRepeatParagraf.textContent = "";
        interestsParagraf.textContent = "";
    }

    async function createUser(username, email) {
        let selectedInterests = document.querySelectorAll('input[type="checkbox"]:checked');
        let interestsArray = [];
        selectedInterests.forEach(function (interest) {
            interestsArray.push(interest.value);
        });
        let user = new User(username.value, email.value, interestsArray);
        generateHash(password.value).then(hash => {
            user.setPassword(hash);
            localStorage.setItem("user", JSON.stringify(user));
        }).catch(error => console.error(error));
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

    function User(username, email, interests) {
        this.username = username;
        this.email = email;
        this.interests = interests;
        this.setPassword = function (password) {
            this.password = password;
        };
        //this.setPersonalDetails = function(details){
        //  [this.username,this.email,this.interests] = details;
        //};
        this.showUser = function () {
            let txt = `Username: ${this.username}, email: ${this.email}, interests: ${this.interests.join(', ')}.`;
            return txt;
        }
    }
};
