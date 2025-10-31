// === popup.js ===

// Wait until the page is ready
document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const popupClose = document.getElementById("popup-close");

  // Attach event listeners to all timetable buttons
  const buttons = document.querySelectorAll(".timetable button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      popupOverlay.style.display = "flex";
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
