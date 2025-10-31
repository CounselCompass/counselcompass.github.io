document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const buttons = document.querySelectorAll(".timetable button");

  const cookieName = "timetable_schedule";

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const times = ["0900","0940","1020","1040","1120","1200","1240","1320","1400","1440","1520"];

  // Initialize or read schedule cookie
  function initCookie() {
    let schedule = {};
    const cookie = document.cookie.split("; ").find(row => row.startsWith(cookieName + "="));
    if (cookie) {
      try {
        schedule = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        console.log("Schedule loaded from cookie:", schedule);
      } catch (e) {
        console.error("Failed to parse cookie, starting fresh.", e);
      }
    }

    // Ensure every slot exists
    days.forEach(day => {
      if (!schedule[day]) schedule[day] = {};
      times.forEach(time => {
        if (!schedule[day][time]) {
          schedule[day][time] = { subject: "-", room: "", teacher: "", colour: "" };
        }
      });
    });

    return schedule;
  }

  // Save schedule to cookie (expires 1st August)
  function saveScheduleToCookie(schedule) {
    const now = new Date();
    const thisYear = now.getFullYear();
    const expireDate = new Date(`${thisYear}-08-01T00:00:00`);
    document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(schedule))}; expires=${expireDate.toUTCString()}; path=/`;
  }

  // Apply schedule to buttons
  function applySchedule(schedule) {
    buttons.forEach(button => {
      if (!button.id) return;

      const time = button.id.substring(0, 4);
      const day = button.id.slice(4);

      const slot = schedule[day]?.[time];
      if (slot) {
        button.textContent = slot.subject || "-";
        button.style.backgroundColor = slot.colour?.toLowerCase() || "";
      }
    });
  }

  // Load JSON data
async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return Object.values(json).sort();
  } catch (err) {
    console.error("Failed to load JSON from", url, err);
    return ["Error loading data"]; // fallback so popup isn’t empty
  }
}


  // Sort teacher names by last word, then second-last, etc.
  function sortTeachers(teacherList) {
    return teacherList.sort((a, b) => {
      const aParts = a.split(" ").reverse();
      const bParts = b.split(" ").reverse();
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

  let schedule = initCookie();
  applySchedule(schedule);

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      if (!button.id || button.id.trim() === "") return;

      popupOverlay.style.display = "flex";

      const time = button.id.substring(0, 4);
      const dayMap = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };
      const day = dayMap[button.id.slice(4)] || button.id.slice(4);

      const [classList, roomList, teacherListRaw] = await Promise.all([
        loadData("data/subject.json"),
        loadData("data/room.json"),
        loadData("data/teacher.json")
      ]);

      const teacherList = sortTeachers(teacherListRaw);
      const colours = ["Red","Blue","Green","Yellow","Orange","Black","White","Brown","Grey","Cyan","Pink","Purple"];

      const prevSlot = schedule[day][time] || { subject: "-", room: "", teacher: "", colour: "" };

      console.log("classList:", classList);
      console.log("roomList:", roomList);
      console.log("teacherList:", teacherList);


      const popupContent = document.getElementById("popup-content");
      popupContent.innerHTML = `
        <h2>${day} ${time.substring(0,2)}:${time.substring(2)}</h2>

        <label for="class-select">Class:</label>
        <select id="class-select">
          ${classList.map(c => `<option ${prevSlot.subject === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>

        <label for="room-select">Room:</label>
        <select id="room-select">
          ${roomList.map(r => `<option ${prevSlot.room === r ? "selected" : ""}>${r}</option>`).join("")}
        </select>

        <label for="teacher-select">Teacher:</label>
        <select id="teacher-select">
          ${teacherList.map(t => `<option ${prevSlot.teacher === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>

        <label for="colour-select">Colour:</label>
        <select id="colour-select">
          ${colours.map(col => `<option ${prevSlot.colour === col ? "selected" : ""}>${col}</option>`).join("")}
        </select>

        <button id="save-slot">Submit</button>
      `;

      document.getElementById("save-slot").addEventListener("click", () => {
        const selectedSlot = {
          subject: document.getElementById("class-select").value,
          room: document.getElementById("room-select").value,
          teacher: document.getElementById("teacher-select").value,
          colour: document.getElementById("colour-select").value
        };

        // Save to schedule
        schedule[day][time] = selectedSlot;

        // Save cookie
        saveScheduleToCookie(schedule);

        // Update button immediately
        button.textContent = selectedSlot.subject;
        button.style.backgroundColor = selectedSlot.colour.toLowerCase();

        popupOverlay.style.display = "none";
      });
    });
  });

  // Close popup on clicking outside
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
  });
});
