document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");

  const buttons = document.querySelectorAll(".timetable button");

  // Function to fetch JSON and extract sorted values
  async function loadData(url) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      // Extract values and sort alphabetically
      return Object.values(json).sort();
    } catch (err) {
      console.error("Failed to load JSON from", url, err);
      return [];
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      if (button.id && button.id.trim() !== "") {
        popupOverlay.style.display = "flex";

        // Extract day and time from ID (example: 0900MON)
        const time = button.id.substring(0, 4);
        const dayMap = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };
        const day = dayMap[button.id.slice(4)] || button.id.slice(4);

        // Load external JSON data
        const [classList, roomList, teacherList] = await Promise.all([
          loadData("data/subject.json"),
          loadData("data/rooms.json"),
          loadData("data/teacher.json")
        ]);

        // Static colours
        const colours = ["Red", "Blue", "Green", "Yellow", "Orange", "Black", "White", "Brown", "Grey", "Cyan", "Pink", "Purple"];

        // Populate popup content
        const popupContent = document.getElementById("popup-content");
        popupContent.innerHTML = `
          <!-- [header]Monday 09:00[/header] -->
          <h2>${day} ${time.substring(0,2)}:${time.substring(2)}</h2>

          <label for="class-select">Class:</label>
          <select id="class-select">
            ${classList.map(c => `<option>${c}</option>`).join("")}
          </select>

          <label for="room-select">Room:</label>
          <select id="room-select">
            ${roomList.map(r => `<option>${r}</option>`).join("")}
          </select>

          <label for="teacher-select">Teacher:</label>
          <select id="teacher-select">
            ${teacherList.map(t => `<option>${t}</option>`).join("")}
          </select>

          <label for="colour-select">Colour:</label>
          <select id="colour-select">
            ${colours.map(col => `<option>${col}</option>`).join("")}
          </select>
        `;
      }
    });
  });

  // Close popup when clicking outside popup box
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
});
