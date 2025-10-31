// === popup.js ===

document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const popupClose = document.getElementById("popup-close");

  // Select all timetable buttons
  const buttons = document.querySelectorAll(".timetable button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      // ✅ Only open popup if the button has an ID
      if (button.id && button.id.trim() !== "") {
        popupOverlay.style.display = "flex";

        // (Optional) update popup content dynamically
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = `
          <h2>Slot Info</h2>
          <p>You clicked on: <strong>${button.id}</strong></p>
          <p>Edit this popup content in popup.js or timetable.html.</p>
        `;
      }
    });
  });

  // Close popup when clicking X
  popupClose.addEventListener("click", () => {
    popupOverlay.style.display = "none";
  });

  // Optional: close when clicking outside popup box
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
});
