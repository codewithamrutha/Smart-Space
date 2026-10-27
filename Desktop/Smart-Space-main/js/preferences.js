// ========================================
// SMART SPACE - PREFERENCES
// ========================================


// Load selected room
function loadRoom() {

    const room =
        localStorage.getItem("selectedRoom")
        || "Living Room";

    const roomElement =
        document.getElementById("preferenceRoom");

    if (roomElement) {
        roomElement.textContent = room;
    }

}


// ========================================
// LOAD USER
// ========================================

function loadProfile() {

    const savedUser =
        localStorage.getItem("smartspaceUser");

    if (!savedUser) {
        return;
    }

    const name =
        savedUser.split("@")[0];

    const profileName =
        document.getElementById("profileName");

    const avatar =
        document.getElementById("profileAvatar");


    if (profileName) {
        profileName.textContent = name;
    }

    if (avatar) {
        avatar.textContent =
            savedUser.charAt(0).toUpperCase();
    }

}


// ========================================
// SELECT STYLE
// ========================================

document.querySelectorAll(".style-card")
    .forEach(card => {

        card.addEventListener("click", function () {

            document
                .querySelectorAll(".style-card")
                .forEach(item =>
                    item.classList.remove("selected")
                );

            this.classList.add("selected");

        });

    });


// ========================================
// SELECT COLORS
// ========================================

document.querySelectorAll(".color-option")
    .forEach(option => {

        option.addEventListener("click", function () {

            document
                .querySelectorAll(".color-option")
                .forEach(item =>
                    item.classList.remove("selected")
                );

            this.classList.add("selected");

        });

    });


// ========================================
// SELECT LIGHTING
// ========================================

document.querySelectorAll(".lighting-option")
    .forEach(option => {

        option.addEventListener("click", function () {

            document
                .querySelectorAll(".lighting-option")
                .forEach(item =>
                    item.classList.remove("selected")
                );

            this.classList.add("selected");

        });

    });


// ========================================
// SELECT BUDGET
// ========================================

document.querySelectorAll(".budget-card")
    .forEach(card => {

        card.addEventListener("click", function () {

            document
                .querySelectorAll(".budget-card")
                .forEach(item =>
                    item.classList.remove("selected")
                );

            this.classList.add("selected");

        });

    });


// ========================================
// CHARACTER COUNTER
// ========================================

const requirements =
    document.getElementById("specialRequirements");

const characterCount =
    document.getElementById("characterCount");


if (requirements) {

    requirements.addEventListener(
        "input",
        function () {

            characterCount.textContent =
                this.value.length;

        }
    );

}


// ========================================
// GET SELECTED VALUE
// ========================================

function getSelected(name) {

    const selected =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return selected
        ? selected.value
        : "";

}


// ========================================
// GET FURNITURE
// ========================================

function getFurniture() {

    const selected =
        document.querySelectorAll(
            'input[name="furniture"]:checked'
        );

    return Array.from(selected)
        .map(item => item.value);

}


// ========================================
// GENERATE DESIGN
// ========================================

function generateDesign() {

    const style =
        getSelected("style");

    const color =
        getSelected("color");

    const lighting =
        getSelected("lighting");

    const budget =
        getSelected("budget");

    const furniture =
        getFurniture();

    const specialRequirements =
        document.getElementById(
            "specialRequirements"
        ).value;


    // Save preferences
    const preferences = {

        style: style,

        color: color,

        furniture: furniture,

        lighting: lighting,

        budget: budget,

        specialRequirements:
            specialRequirements

    };


    localStorage.setItem(
        "designPreferences",
        JSON.stringify(preferences)
    );


    // Go to result page
    window.location.href =
        "result.html";

}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRoom();

        loadProfile();

    }
);