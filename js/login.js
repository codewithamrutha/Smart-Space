// Show / Hide Password

const password = document.getElementById("password");
const showPassword = document.getElementById("showPassword");

showPassword.addEventListener("click", function(){

    if(password.type === "password"){

        password.type = "text";
        showPassword.innerHTML = "🙈";

    }
    else{

        password.type = "password";
        showPassword.innerHTML = "👁";

    }

});


// Login

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value;

    localStorage.setItem("smartspaceUser", email);

    window.location.href = "dashboard.html";

});