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
function initCookie() {
  console.log("🆕 Initializing default timetable schedule...");

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const times = ["0900", "0940", "1020", "1040", "1120", "1200", "1240", "1320", "1400", "1440", "1520"];

  const schedule = {};
  for (const day of days) {
    schedule[day] = {};
    for (const time of times) {
      schedule[day][time] = {
        subject: "NON",
        teacher: "NON",
        class: "NON",
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
      // Change text and background if available
      button.textContent = slot.subject !== "NON" ? slot.subject : "-";
      if (slot.colour && slot.colour !== "NON") {
        button.style.backgroundColor = slot.colour.toLowerCase();
        button.style.color = "white";
      } else {
        button.style.backgroundColor = "";
        button.style.color = "";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let schedule = loadScheduleFromStorage();

  if (!schedule) {
    console.log("⚠️ No existing schedule found. Creating new one...");
    schedule = initCookie();  // still fine to call it that
    saveScheduleToStorage(schedule);
  }

  applySchedule(schedule);
});
