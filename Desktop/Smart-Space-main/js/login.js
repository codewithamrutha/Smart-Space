
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

// Firebase configuration from your Smart Space project
const firebaseConfig = {
  apiKey: "AIzaSyAmiygtyM9nFnFDMWuogAZE-EaZsEHtT38",
  authDomain: "smart-space-36685.firebaseapp.com",
  projectId: "smart-space-36685",
  storageBucket: "smart-space-36685.firebasestorage.app",
  messagingSenderId: "755386005500",
  appId: "1:755386005500:web:8692490c69a054d99d2479",
  measurementId: "G-MBXX9DYB7L"
};

// Initialize Firebase ONCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Show / Hide Password
const passwordInput = document.getElementById("password");
const showPassword = document.getElementById("showPassword");

if (showPassword && passwordInput) {
  showPassword.addEventListener("click", function () {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    showPassword.textContent = isHidden ? "🙈" : "👁";
  });
}

// Existing email/password demo login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email")
      .value.trim().toLowerCase();
    const password = passwordInput.value;

    const users = JSON.parse(
      localStorage.getItem("smartspaceUsers") || "[]"
    );

    const matchingUser = users.find(
      user => user.email === email && user.password === password
    );

    let message = document.getElementById("loginMessage");

    if (!message) {
      message = document.createElement("p");
      message.id = "loginMessage";
      message.setAttribute("role", "status");
      message.style.cssText =
        "font-size:13px;line-height:1.5;margin:12px 0;color:#b42318;";
      loginForm.appendChild(message);
    }

    if (!matchingUser) {
      message.textContent =
        "Email or password is incorrect. Create an account first if you are new.";
      return;
    }

    localStorage.setItem("smartspaceUser", matchingUser.email);
    window.location.href = "dashboard.html";
  });
}

// Google Sign-In
const googleButton = document.getElementById("googleSignIn");

if (googleButton) {
  googleButton.addEventListener("click", async function () {
    googleButton.disabled = true;
    googleButton.textContent = "Connecting to Google...";

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      localStorage.setItem("smartspaceUser", user.email || "");
      localStorage.setItem("smartspaceName", user.displayName || "");
      localStorage.setItem("smartspacePhoto", user.photoURL || "");

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Google sign-in error:", error);

      let message = error.message;

      if (error.code === "auth/unauthorized-domain") {
        message =
          "This website address is not authorized in Firebase. Add 127.0.0.1 under Authentication > Settings > Authorized domains.";
      } else if (error.code === "auth/operation-not-allowed") {
        message =
          "Google sign-in is disabled. Enable Google in Firebase Authentication > Sign-in method.";
      } else if (error.code === "auth/popup-blocked") {
        message =
          "The browser blocked the Google login popup. Allow popups and try again.";
      }

      alert("Google sign-in failed:\n" + message);

    } finally {
      googleButton.disabled = false;
      googleButton.innerHTML =
        '<span class="google">G</span> Continue with Google';
    }
  });
}
