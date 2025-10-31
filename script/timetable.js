// Chat GPT start
function updateCountdown() {
  const countdownEl = document.getElementById('countdown');
  const now = new Date();
  
  // Target date: December 25th (Christmas)
  const year = now.getFullYear();
  const target = new Date(year, 11, 25); // Dec 25
  
  // If today is past Dec 25, countdown to next year's Dec 25
  if (now > target) {
    target.setFullYear(year + 1);
  }
  
  const diff = target - now; // difference in ms
  
  // Calculate days left (rounded down)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  countdownEl.textContent = `${days} day${days !== 1 ? 's' : ''} to Christmas`;
}

// Update every 1 hour (since days don’t change every second)
setInterval(updateCountdown, 3600000);
updateCountdown();

// Chat GPT end


// ------------------------------
// Class Schedule Cookie Handler
// ------------------------------

// --- Cookie helpers ---
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

// --- Format functions ---
function formatToJSON(cookieString) {
    const cookieJSON = [];
    const slotLength = 19; // 7+3+3+3+3
    const slots = cookieString.match(new RegExp(`.{1,${slotLength}}`, "g")) || [];

    for (let slot of slots) {
        cookieJSON.push({
            id: slot.substring(0, 7) || "NON",
            subject: slot.substring(7, 10) || "NON",
            teacher: slot.substring(10, 13) || "NON",
            class: slot.substring(13, 16) || "NON",
            colour: slot.substring(16, 19) || "NON"
        });
    }

    return cookieJSON;
}

function formatToCookie(cookieJSON) {
    return cookieJSON.map(slot => 
        `${slot.id || "NON"}${slot.subject || "NON"}${slot.teacher || "NON"}${slot.class || "NON"}${slot.colour || "NON"}`
    ).join('');
}

// --- Initialize cookie ---
function initCookie() {
    try {
        console.log("initCookie started");
        const cookieName = "class_schedule";
        let cookieValue = getCookie(cookieName);

        if (!cookieValue || cookieValue === "") {
            console.log("Cookie is empty, initializing...");

            const days = ["MON", "TUE", "WED", "THU", "FRI"];
            const times = ["0900", "0940", "1040", "1120", "1200", "1240", "1320", "1400", "1440", "1520"];
            let initialValue = "";

            for (let day of days) {
                for (let time of times) {
                    initialValue += `${time}${day}NONNONNONNON`;
                }
            }

            setCookie(cookieName, initialValue);
            cookieValue = initialValue;
            console.log("Cookie initialized:", cookieValue);
        } else {
            console.log("Cookie already exists:", cookieValue);
        }

        const scheduleJSON = formatToJSON(cookieValue);
        console.log("Schedule JSON:", scheduleJSON);
        return scheduleJSON;

    } catch (err) {
        console.error("Error in initCookie:", err);
    }
}

// --- Save JSON back to cookie ---
function saveScheduleToCookie(scheduleJSON) {
    try {
        const cookieName = "class_schedule";
        const cookieString = formatToCookie(scheduleJSON);
        setCookie(cookieName, cookieString);
        console.log("Schedule saved to cookie:", cookieString);
    } catch (err) {
        console.error("Error saving schedule:", err);
    }
}

// --- Run on page load ---
(function() {
    console.log("Script loaded, initializing schedule...");
    const schedule = initCookie();

    // Example: modify the first slot and save
    // schedule[0].colour = "RED";
    // saveScheduleToCookie(schedule);
})();
