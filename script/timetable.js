// ====== Timetable Cookie Management ======
const cookieName = "timetable_schedule";

// --- Load and decode saved schedule ---
function loadScheduleFromCookie() {
  const nameEQ = cookieName + "=";
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.indexOf(nameEQ) === 0) {
      const value = c.substring(nameEQ.length);
      try {
        const decoded = decodeURIComponent(escape(atob(value)));
        const parsed = JSON.parse(decoded);
        console.log("✅ Loaded schedule from cookie:", parsed);
        return parsed;
      } catch (err) {
        console.error("❌ Failed to decode or parse cookie:", err);
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

    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(schedule))));

    // Try without Secure, use SameSite=Lax for local + GitHub compatibility
    document.cookie = `${cookieName}=${encoded}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`;

    console.log("✅ Saved schedule to cookie:", schedule);
  } catch (err) {
    console.error("❌ Failed to save cookie:", err);
  }

  console.log("🍪 Raw document.cookie:", document.cookie);
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

// --- Run on page load ---
document.addEventListener("DOMContentLoaded", () => {
  let schedule = loadScheduleFromCookie();

  if (!schedule) {
    console.log("⚠️ No existing cookie found. Creating new schedule...");
    schedule = initCookie();
    saveScheduleToCookie(schedule);
  }

  applySchedule(schedule);
});
