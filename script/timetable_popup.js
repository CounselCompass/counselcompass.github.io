// === popup.js ===

document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");

  // Select all timetable buttons
  const buttons = document.querySelectorAll(".timetable button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // ✅ Only open popup if the button has an ID
      if (button.id && button.id.trim() !== "") {
        popupOverlay.style.display = "flex";

        // Optional: dynamically show which ID was clicked
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = `
          <h2>Slot Info</h2>
          <p>You clicked on: <strong>${button.id}</strong></p>
          <p>Edit this popup content in timetable.html or popup.js.</p>
        `;
      }
    });
  });

  // ✅ Close popup when clicking outside the popup box
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
});
