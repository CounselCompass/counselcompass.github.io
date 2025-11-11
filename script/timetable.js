// === 🗂️ Timetable Storage System ===
const storageKey = "timetable_schedule";

// --- Load from localStorage ---
function loadScheduleFromStorage() {
  const data = localStorage.getItem(storageKey);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    console.log("✅ Loaded schedule from storage:", parsed);
    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse stored schedule:", err);
    return null;
  }
}

// --- Save to localStorage ---
function saveScheduleToStorage(schedule) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(schedule));
    console.log("✅ Saved schedule to storage:", schedule);
  } catch (err) {
    console.error("❌ Failed to save schedule:", err);
  }
}

// --- Initialize default schedule if none exists ---
function initSchedule() {
  console.log("🆕 Initializing default timetable schedule...");

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const times = ["0900", "0940", "1020", "1040", "1120", "1200", "1240", "1320", "1400", "1440", "1520"];

  const schedule = {};
  for (const day of days) {
    schedule[day] = {};
    for (const time of times) {
      schedule[day][time] = {
        subject: "NON",
        room: "",
        teacher: "",
        colour: "NON"
      };
    }
  }
  console.log("✅ Default schedule created.");
  return schedule;
}

// --- Apply schedule to timetable buttons ---
function applySchedule(schedule) {
  const buttons = document.querySelectorAll(".timetable button[id]");
  buttons.forEach(button => {
    const id = button.id;
    if (!id) return;
    const time = id.substring(0, 4);
    const day = id.substring(4);
    const slot = schedule?.[day]?.[time];

    if (slot) {
      button.textContent = slot.subject !== "NON" ? slot.subject : "-";
      if (slot.colour && slot.colour !== "NON") {
        const colour = slot.colour.toLowerCase();
        button.style.backgroundColor = colour;

        // Use black text for light background colours
        if (["white", "yellow", "cyan", "#ffffff", "#ffff00", "#00ffff"].includes(colour)) {
          button.style.color = "black";
        } else {
          button.style.color = "white";
        }
      } else {
        button.style.backgroundColor = "";
        button.style.color = "";
      }
    }
  });
}


// --- Load external JSON ---
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

// --- Sort teachers by last name ---
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

// === 🧠 Main App Logic ===
document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popup-overlay");
  const buttons = document.querySelectorAll(".timetable button");
  const dayNames = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };

  let schedule = loadScheduleFromStorage();
  if (!schedule) {
    console.log("⚠️ No existing schedule found. Creating new one...");
    schedule = initSchedule();
    saveScheduleToStorage(schedule);
  }
  applySchedule(schedule);

  // 🖱️ Click handler for each timetable slot
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

        <button id="save-slot" class="button-79 submit-button" role="button">Submit</button>
      `;

      // 💾 Save slot when submitted
document.getElementById("save-slot").addEventListener("click", () => {
  const selectedSlot = {
    subject: document.getElementById("class-select").value,
    room: document.getElementById("room-select").value,
    teacher: document.getElementById("teacher-select").value,
    colour: document.getElementById("colour-select").value
  };

  schedule[dayCode][time] = selectedSlot;
  saveScheduleToStorage(schedule);

  // Update button immediately
  const colour = selectedSlot.colour.toLowerCase();
  button.textContent = selectedSlot.subject;
  button.style.backgroundColor = colour;
  if (["white", "yellow", "cyan", "#ffffff", "#ffff00", "#00ffff"].includes(colour)) {
    button.style.color = "black";
  } else {
    button.style.color = "white";
  }

  popupOverlay.style.display = "none";
});

// ✨ Make dropdowns searchable
new Choices("#class-select", { searchEnabled: true, itemSelectText: "" });
new Choices("#room-select", { searchEnabled: true, itemSelectText: "" });
new Choices("#teacher-select", { searchEnabled: true, itemSelectText: "" });
new Choices("#colour-select", { searchEnabled: true, itemSelectText: "" });

    });
  });

  // ❌ Close popup on outside click
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) popupOverlay.style.display = "none";
  });
});
