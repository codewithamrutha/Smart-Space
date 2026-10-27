// ========================================
// SMART SPACE - ROOM ANALYSIS
// ========================================


// Get room from URL
const urlParams = new URLSearchParams(window.location.search);

const roomFromURL = urlParams.get("room");


// Room information
const roomData = {

    "Living Room": {
        icon: "🛋️"
    },

    "Kitchen": {
        icon: "🍳"
    },

    "Bedroom": {
        icon: "🛏️"
    },

    "Dining Room": {
        icon: "🍽️"
    },

    "Bathroom": {
        icon: "🛁"
    },

    "Study Room": {
        icon: "📚"
    }

};


// Load selected room
function loadRoom() {

    let room = roomFromURL || localStorage.getItem("selectedRoom");

    if (!room) {
        room = "Living Room";
    }

    localStorage.setItem("selectedRoom", room);

    const roomInfo = roomData[room] || {
        icon: "🏠"
    };


    const selectedRoom = document.getElementById("selectedRoom");
    const breadcrumbRoom = document.getElementById("breadcrumbRoom");
    const roomIcon = document.getElementById("roomIcon");


    if (selectedRoom) {
        selectedRoom.textContent = room;
    }

    if (breadcrumbRoom) {
        breadcrumbRoom.textContent = room;
    }

    if (roomIcon) {
        roomIcon.textContent = roomInfo.icon;
    }

}


// ========================================
// USER PROFILE
// ========================================

function loadProfile() {

    const savedUser =
        localStorage.getItem("smartspaceUser");

    if (!savedUser) {
        return;
    }

    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");


    if (profileName) {

        profileName.textContent =
            savedUser.split("@")[0];

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            savedUser.charAt(0).toUpperCase();

    }

}


// ========================================
// IMAGE UPLOAD
// ========================================

const roomImage =
    document.getElementById("roomImage");

const uploadArea =
    document.getElementById("uploadArea");


if (roomImage) {

    roomImage.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }


        // Check file type
        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image file.");

            this.value = "";

            return;
        }


        // Check file size
        if (file.size > 10 * 1024 * 1024) {

            alert("Image size must be less than 10 MB.");

            this.value = "";

            return;
        }


        showImagePreview(file);

    });

}


// Show image preview
function showImagePreview(file) {

    const reader = new FileReader();


    reader.onload = function (event) {

        const previewImage =
            document.getElementById("previewImage");

        const imagePreview =
            document.getElementById("imagePreview");

        const uploadContent =
            document.getElementById("uploadContent");

        const fileName =
            document.getElementById("fileName");

        const fileSize =
            document.getElementById("fileSize");


        previewImage.src = event.target.result;

        fileName.textContent = file.name;

        fileSize.textContent =
            formatFileSize(file.size);


        uploadContent.classList.add("hidden");

        imagePreview.classList.remove("hidden");

    };


    reader.readAsDataURL(file);

}


// Format file size
function formatFileSize(bytes) {

    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }

    return (
        (bytes / (1024 * 1024)).toFixed(1) +
        " MB"
    );

}


// Remove selected image
function removeImage(event) {

    event.stopPropagation();


    const roomImage =
        document.getElementById("roomImage");

    const imagePreview =
        document.getElementById("imagePreview");

    const uploadContent =
        document.getElementById("uploadContent");


    roomImage.value = "";

    imagePreview.classList.add("hidden");

    uploadContent.classList.remove("hidden");

}


// ========================================
// DRAG & DROP
// ========================================

if (uploadArea) {

    uploadArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            uploadArea.classList.add("dragging");

        }
    );


    uploadArea.addEventListener(
        "dragleave",
        function () {

            uploadArea.classList.remove("dragging");

        }
    );


    uploadArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            uploadArea.classList.remove("dragging");


            const files = event.dataTransfer.files;


            if (files.length > 0) {

                const file = files[0];

                if (!file.type.startsWith("image/")) {

                    alert("Please drop an image file.");

                    return;

                }


                if (file.size > 10 * 1024 * 1024) {

                    alert("Image must be less than 10 MB.");

                    return;

                }


                // Put dropped file into input
                const dataTransfer =
                    new DataTransfer();

                dataTransfer.items.add(file);

                roomImage.files =
                    dataTransfer.files;


                showImagePreview(file);

            }

        }
    );

}


// ========================================
// NUMBER INPUT
// ========================================

function changeNumber(
    inputId,
    amount
) {

    const input =
        document.getElementById(inputId);

    if (!input) {
        return;
    }


    let value =
        parseInt(input.value) || 0;

    value += amount;


    const min =
        parseInt(input.min);

    const max =
        parseInt(input.max);


    if (value < min) {
        value = min;
    }

    if (value > max) {
        value = max;
    }


    input.value = value;

}


// ========================================
// CONTINUE
// ========================================

function continueToPreferences() {

    const image =
        document.getElementById("roomImage").files[0];


    const length =
        document.getElementById("length").value;

    const width =
        document.getElementById("width").value;

    const height =
        document.getElementById("height").value;

    const windows =
        document.getElementById("windows").value;

    const doors =
        document.getElementById("doors").value;

    const floorType =
        document.getElementById("floorType").value;


    // Require either image or measurements
    if (
        !image &&
        (!length || !width || !height)
    ) {

        alert(
            "Please upload a room photo or enter the room measurements."
        );

        return;

    }


    // Save measurements
    const measurements = {

        length: length,
        width: width,
        height: height,
        windows: windows,
        doors: doors,
        floorType: floorType

    };


    localStorage.setItem(
        "roomMeasurements",
        JSON.stringify(measurements)
    );


    // Save image temporarily
    if (image) {

        const reader =
            new FileReader();


        reader.onload = function (event) {

            localStorage.setItem(
                "roomImage",
                event.target.result
            );

            window.location.href =
                "preferences.html";

        };


        reader.readAsDataURL(image);

    } else {

        localStorage.removeItem(
            "roomImage"
        );

        window.location.href =
            "preferences.html";

    }

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