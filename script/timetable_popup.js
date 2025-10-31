document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const buttons = document.querySelectorAll(".timetable button");

  // Function to fetch JSON and extract values
  async function loadData(url) {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return Object.entries(json).map(([key, value]) => ({ key, value }));
    } catch (err) {
      console.error("Failed to load JSON from", url, err);
      return [];
    }
  }

  // Sort teacher names by last word, then second-last
  function sortTeachers(teacherList) {
    return teacherList.sort((a, b) => {
      const aParts = a.value.split(" ").reverse();
      const bParts = b.value.split(" ").reverse();
      const len = Math.max(aParts.length, bParts.length);
      for (let i = 0; i < len; i++) {
        const aPart = aParts[i] || "";
        const bPart = bParts[i] || "";
        if (aPart < bPart) return -1;
        if (aPart > bPart) return 1;
      }
      return 0;
    });
  }

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      if (button.id && button.id.trim() !== "") {
        popupOverlay.style.display = "flex";

        const time = button.id.substring(0, 4);
        const dayMap = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };
        const day = dayMap[button.id.slice(4)] || button.id.slice(4);

        // Load external JSON data
        const [classList, roomList, teacherListRaw] = await Promise.all([
          loadData("data/subject.json"),
          loadData("data/room.json"),
          loadData("data/teacher.json")
        ]);

        const teacherList = sortTeachers(teacherListRaw);
        const colours = ["Red", "Blue", "Green", "Yellow", "Orange", "Black", "White", "Brown", "Grey", "Cyan", "Pink", "Purple"];

        const popupContent = document.getElementById("popup-content");

        popupContent.innerHTML = `
          <h2>${day} ${time.substring(0,2)}:${time.substring(2)}</h2>

          <label for="class-select">Class:</label>
          <select id="class-select">
            ${classList.map(c => `<option value="${c.key}">${c.value}</option>`).join("")}
          </select>

          <label for="room-select">Room:</label>
          <select id="room-select">
            ${roomList.map(r => `<option value="${r.key}">${r.value}</option>`).join("")}
          </select>

          <label for="teacher-select">Teacher:</label>
          <select id="teacher-select">
            ${teacherList.map(t => `<option value="${t.key}">${t.value}</option>`).join("")}
          </select>

          <label for="colour-select">Colour:</label>
          <select id="colour-select">
            ${colours.map(col => `<option value="${col}">${col}</option>`).join("")}
          </select>

          <button id="popup-submit" class="button-79">Save</button>
        `;

        // Handle submit
        document.getElementById("popup-submit").addEventListener("click", () => {
          const classValue = document.getElementById("class-select").value;
          const roomValue = document.getElementById("room-select").value;
          const teacherValue = document.getElementById("teacher-select").value;
          const colourValue = document.getElementById("colour-select").value;

          // Get schedule JSON from cookie
          const schedule = initCookie();

          // Update slot
          setSlot(schedule, button.id.slice(4), time, {
            id: button.id,
            subject: classValue,
            teacher: teacherValue,
            class: roomValue,
            colour: colourValue
          });

          // Save back to cookie
          saveScheduleToCookie(schedule);

          // Update button appearance
          button.textContent = classValue;
          button.style.backgroundColor = colourValue.toLowerCase();

          popupOverlay.style.display = "none";
        });
      }
    });
  });

  // Close popup when clicking outside
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = "none";
    }
  });
});
