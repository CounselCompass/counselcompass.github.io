document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const buttons = document.querySelectorAll(".timetable button");

  const cookieName = "timetable_schedule";

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const times = ["0900","0940","1020","1040","1120","1200","1240","1320","1400","1440","1520"];
  const dayNames = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };

  function loadScheduleFromCookie() {
  const nameEQ = cookieName + "=";
  const ca = document.cookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length, c.length);
      try {
        return JSON.parse(decodeURIComponent(escape(atob(value))));
      } catch (err) {
        console.error("❌ Failed to decode cookie:", err);
        return null;
      }
    }
  }
  return null;
}

function saveScheduleToCookie(schedule) {
  try {
    const now = new Date();
    const thisYear = now.getFullYear();
    let expireDate = new Date(`${thisYear}-08-01T00:00:00`);
    if (now > expireDate) expireDate = new Date(`${thisYear + 1}-08-01T00:00:00`);

    // Compress + encode (base64)
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(schedule))));

    document.cookie = `${cookieName}=${encoded}; expires=${expireDate.toUTCString()}; path=/; Secure; SameSite=None`;
    console.log("✅ Saved schedule to cookie:", schedule);
  } catch (err) {
    console.error("❌ Failed to save cookie:", err);
  }
}

  // 🧩 Initialize or read schedule cookie
  function initCookie() {
    let schedule = {};
    const cookie = document.cookie.split("; ").find(row => row.startsWith(cookieName + "="));
    if (cookie) {
      try {
        schedule = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        console.log("✅ Schedule loaded from cookie");
      } catch (e) {
        console.error("⚠️ Failed to parse cookie, starting fresh:", e);
      }
    }

    // Ensure all days/times exist
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

  // 🎨 Apply schedule to buttons
  function applySchedule(schedule) {
    buttons.forEach(button => {
      if (!button.id) return;
      const time = button.id.substring(0, 4);
      const dayCode = button.id.slice(4);
      const slot = schedule[dayCode]?.[time];
      if (slot) {
        button.textContent = slot.subject || "-";
        button.style.backgroundColor = slot.colour?.toLowerCase() || "";
      }
    });
  }

  // 📄 Load JSON data
  async function loadData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      return Object.values(json).sort();
    } catch (err) {
      console.error("Failed to load JSON from", url, err);
      return ["Error loading data"];
    }
  }

  // 🧑‍🏫 Sort teacher names by last word
  function sortTeachers(teacherList) {
    return teacherList.sort((a, b) => {
      const aParts = a.split(" ").reverse();
      const bParts = b.split(" ").reverse();
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        if ((aParts[i] || "") < (bParts[i] || "")) return -1;
        if ((aParts[i] || "") > (bParts[i] || "")) return 1;
      }
      return 0;
    });
  }

  // 🚀 Load initial schedule
  let schedule = initCookie();
  applySchedule(schedule);

  // 🖱️ Add click listeners
  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      if (!button.id || button.id.trim() === "") return;

      popupOverlay.style.display = "flex";

      const time = button.id.substring(0, 4);
      const dayCode = button.id.slice(4);
      const dayName = dayNames[dayCode] || dayCode;

      const [classList, roomList, teacherListRaw] = await Promise.all([
        loadData("data/subject.json"),
        loadData("data/room.json"),
        loadData("data/teacher.json")
      ]);

      const teacherList = sortTeachers(teacherListRaw);
      const colours = ["Red","Blue","Green","Yellow","Orange","Black","White","Brown","Grey","Cyan","Pink","Purple"];

      const prevSlot = schedule[dayCode][time] || { subject: "-", room: "", teacher: "", colour: "" };

      const popupContent = document.getElementById("popup-content");
      popupContent.innerHTML = `
  <h2>${dayName} ${time.substring(0,2)}:${time.substring(2)}</h2>

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

  <button id="save-slot" class="button-79" role="button">Submit</button>
`;


      // 💾 Save slot when submitted
      document.getElementById("save-slot").addEventListener("click", () => {
        const selectedSlot = {
          subject: document.getElementById("class-select").value,
          room: document.getElementById("room-select").value,
          teacher: document.getElementById("teacher-select").value,
          colour: document.getElementById("colour-select").value
        };

        // Save to schedule and cookie
        schedule[dayCode][time] = selectedSlot;
        saveScheduleToCookie(schedule);

        // Update button immediately
        button.textContent = selectedSlot.subject;
        button.style.backgroundColor = selectedSlot.colour.toLowerCase();

        popupOverlay.style.display = "none";
      });
    });
  });

  // ❌ Close popup on outside click
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
  });
});
