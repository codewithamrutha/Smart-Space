// ========================================
// SMART SPACE - DESIGN RESULTS
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    loadUser();
    loadDesignResults();
});


// ========================================
// USER PROFILE
// ========================================

function loadUser() {
    const savedUser = localStorage.getItem("smartspaceUser");

    if (!savedUser) return;

    const name = savedUser.split("@")[0];

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileAvatar").textContent =
        savedUser.charAt(0).toUpperCase();
}


// ========================================
// LOAD SAVED INFORMATION
// ========================================

function loadDesignResults() {
    const room = localStorage.getItem("selectedRoom") || "Living Room";

    const preferences = JSON.parse(
        localStorage.getItem("designPreferences") || "{}"
    );

    const measurements = JSON.parse(
        localStorage.getItem("roomMeasurements") || "{}"
    );

    const style = preferences.style || "Modern";
    const color = preferences.color || "Warm Neutrals";
    const lighting = preferences.lighting || "Warm";
    const budget = preferences.budget || "Not selected";
    const furniture = preferences.furniture || [];
    const requirements = preferences.specialRequirements || "";

    // Main heading
    document.getElementById("resultTitle").textContent =
        style + " " + room;

    document.getElementById("resultSubtitle").textContent =
        "A " + style.toLowerCase() + " concept using " +
        color.toLowerCase() + " colors and " +
        lighting.toLowerCase() + " lighting.";

    // Preference summary
    document.getElementById("summaryRoom").textContent = room;
    document.getElementById("summaryStyle").textContent = style;
    document.getElementById("summaryColor").textContent = color;
    document.getElementById("summaryLighting").textContent = lighting;
    document.getElementById("summaryBudget").textContent = budget;
    document.getElementById("budgetTotal").textContent = budget;

    document.getElementById("previewStyle").textContent =
        style + " " + room.toLowerCase();

    document.getElementById("previewPalette").textContent =
        color + " · " + lighting + " lighting";

    // Measurements
    const length = Number(measurements.length);
    const width = Number(measurements.width);
    const height = Number(measurements.height);

    if (length > 0 && width > 0) {
        const area = length * width;

        document.getElementById("roomDimensions").textContent =
            length + " × " + width + " ft";

        document.getElementById("summaryArea").textContent =
            area.toFixed(1) + " sq ft";

    } else {
        document.getElementById("roomDimensions").textContent =
            "Measurements not provided";

        document.getElementById("summaryArea").textContent =
            "Not provided";
    }

    // Original room photo
    showOriginalPhoto();

    // Personalized suggestions
    showFurniture(room, furniture);

    // Budget estimate
    showBudgetBreakdown(budget);

    // Recommendation text
    showRecommendation(room, style, color, lighting);

    // Additional requirements
    document.getElementById("specialSummary").textContent =
        requirements.trim() || "No additional requirements provided.";
}


// ========================================
// ORIGINAL PHOTO PREVIEW
// ========================================

function showOriginalPhoto() {
    const imageData = localStorage.getItem("roomImage");

    if (!imageData) return;

    const preview = document.getElementById("originalPreview");
    const placeholder = document.getElementById("originalPlaceholder");

    const image = document.createElement("img");

    image.src = imageData;
    image.alt = "Uploaded room";

    image.style.width = "100%";
    image.style.height = "100%";
    image.style.objectFit = "cover";

    preview.insertBefore(image, placeholder);
    placeholder.style.display = "none";
}


// ========================================
// FURNITURE SUGGESTIONS
// ========================================

function showFurniture(room, selectedFurniture) {
    const container = document.getElementById("furnitureList");

    const suggestions = {
        "Living Room": [
            ["🛋️", "Comfortable sofa", "Choose a size that preserves walking space."],
            ["🪑", "Coffee table", "Allow comfortable clearance around seating."],
            ["💡", "Layered lighting", "Combine general and task lighting."],
            ["🌿", "Indoor plants", "Choose plants suited to available daylight."],
            ["🗄️", "Storage unit", "Use storage that fits the room dimensions."]
        ],

        "Kitchen": [
            ["🗄️", "Storage cabinets", "Plan storage around the available wall space."],
            ["💡", "Task lighting", "Light counters and food preparation areas."],
            ["🪑", "Dining stools", "Choose sizes that do not block circulation."],
            ["🧺", "Organizers", "Use practical organizers for frequently used items."],
            ["🪴", "Small plants", "Add greenery where it is safe and practical."]
        ],

        "Bedroom": [
            ["🛏️", "Bed", "Choose a bed size that leaves walking clearance."],
            ["🗄️", "Wardrobe", "Match storage capacity to available space."],
            ["💡", "Bedside lighting", "Consider comfortable reading lights."],
            ["🪞", "Mirror", "Place it where it is practical and convenient."],
            ["🧺", "Storage baskets", "Keep everyday items organized."]
        ],

        "Dining Room": [
            ["🍽️", "Dining table", "Select a size suited to the room and household."],
            ["🪑", "Dining chairs", "Leave space to pull chairs out comfortably."],
            ["💡", "Pendant light", "Position lighting over the dining surface."],
            ["🗄️", "Sideboard", "Add storage if sufficient wall space is available."],
            ["🖼️", "Wall decor", "Use artwork to complement the palette."]
        ],

        "Bathroom": [
            ["🪞", "Mirror", "Choose a suitable size and moisture-resistant finish."],
            ["💡", "Mirror lighting", "Use bathroom-appropriate lighting fixtures."],
            ["🗄️", "Storage cabinet", "Choose moisture-resistant storage."],
            ["🧺", "Laundry basket", "Keep laundry organized without blocking access."],
            ["🧴", "Organizers", "Arrange daily-use items neatly."]
        ],

        "Study Room": [
            ["🪑", "Study chair", "Prioritize comfort and appropriate desk height."],
            ["🖥️", "Work desk", "Allow space for your equipment and work surface."],
            ["💡", "Task lamp", "Position light to reduce shadows on your work."],
            ["📚", "Bookshelf", "Use vertical storage when suitable."],
            ["🔌", "Cable management", "Keep cables organized and away from walkways."]
        ]
    };

    const roomItems = suggestions[room] || suggestions["Living Room"];

    const items = [...new Set([
        ...selectedFurniture,
        ...roomItems.map(item => item[1])
    ])];

    container.innerHTML = "";

    items.forEach(itemName => {
        const matching = roomItems.find(item => item[1] === itemName);

        const icon = matching ? matching[0] : "✦";
        const description = matching
            ? matching[2]
            : "Consider this item if it suits your room and budget.";

        const row = document.createElement("div");
        row.className = "furniture-item";

        const iconBox = document.createElement("span");
        iconBox.className = "furniture-item-icon";
        iconBox.textContent = icon;

        const textBox = document.createElement("div");

        const title = document.createElement("strong");
        title.textContent = itemName;

        const descriptionText = document.createElement("p");
        descriptionText.textContent = description;

        textBox.append(title, descriptionText);
        row.append(iconBox, textBox);
        container.appendChild(row);
    });
}


// ========================================
// BUDGET BREAKDOWN
// ========================================

function showBudgetBreakdown(budget) {
    const container = document.getElementById("budgetBreakdown");

    const allocations = [
        { name: "Furniture", percentage: 45 },
        { name: "Lighting", percentage: 15 },
        { name: "Decor", percentage: 15 },
        { name: "Storage & finishing", percentage: 25 }
    ];

    container.innerHTML = "";

    allocations.forEach(item => {
        const row = document.createElement("div");
        row.className = "budget-allocation";

        const heading = document.createElement("div");
        heading.className = "allocation-heading";

        const name = document.createElement("strong");
        name.textContent = item.name;

        const percentage = document.createElement("span");
        percentage.textContent = item.percentage + "%";

        heading.append(name, percentage);

        const track = document.createElement("div");
        track.className = "allocation-track";

        const fill = document.createElement("div");
        fill.className = "allocation-fill";
        fill.style.width = item.percentage + "%";

        track.appendChild(fill);
        row.append(heading, track);
        container.appendChild(row);
    });

    const note = document.createElement("p");
    note.className = "budget-footnote";
    note.textContent = budget === "Not selected"
        ? "Select a budget to personalize your plan."
        : "Illustrative percentages only. No actual prices have been retrieved.";

    container.appendChild(note);
}


// ========================================
// PERSONALIZED RECOMMENDATION
// ========================================

function showRecommendation(room, style, color, lighting) {
    const container = document.getElementById("recommendationCopy");

    container.textContent =
        "For your " + room.toLowerCase() +
        ", consider a " + style.toLowerCase() +
        " approach with a " + color.toLowerCase() +
        " palette and " + lighting.toLowerCase() +
        " lighting. Prioritize practical furniture sizes, comfortable movement, " +
        "useful storage and a layout suited to the room's actual dimensions.";
}


// ========================================
// START ANOTHER DESIGN
// ========================================

function startNewDesign() {
    localStorage.removeItem("selectedRoom");
    localStorage.removeItem("roomMeasurements");
    localStorage.removeItem("roomImage");
    localStorage.removeItem("designPreferences");

    window.location.href = "dashboard.html";
}