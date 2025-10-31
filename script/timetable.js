document.getElementById("test").onclick = testFunc;

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


function testFunc() {
  alert(formatToCookie([
    {
      "id": "0900MON",
      "subject": "MAT",
      "teacher": "EXA",
      "class": "T14"
    },
    {
      "id": "0940MON",
      "subject": "ENG",
      "teacher": "EXP",
      "class": "H05"
    }
  ]));
  // document.cookie = `username=${text}; expires=Wed, 1 Jul 2026 12:00:00 UTC`;
}

/*
Cookie json format
{
    "id": "0900MON",
    "subject": "MAT",
    "teacher": "EXA",
    "class": "T14",
    "colour": "BLU"  // new 3-letter colour code
}
*/

// --- Cookie helpers ---
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// --- Format functions ---
function formatToJSON(cookie) {
    let cookie_json = [];
    const slotLength = 19; // 7+3+3+3+3
    const into_classes = cookie.match(new RegExp(`.{1,${slotLength}}`, "g")) || [];

    for (let current_class = 0; current_class < into_classes.length; current_class++) {
        const slot = into_classes[current_class];
        cookie_json[current_class] = {
            id: slot.substring(0, 7) || "NON",
            subject: slot.substring(7, 10) || "NON",
            teacher: slot.substring(10, 13) || "NON",
            class: slot.substring(13, 16) || "NON",
            colour: slot.substring(16, 19) || "NON"
        };
    }

    return cookie_json;
}

function formatToCookie(cookie) {
    let cookie_string = "";
    for (let slot = 0; slot < cookie.length; slot++) {
        const colour = cookie[slot].colour || "NON";
        const slot_string = `${cookie[slot].id}${cookie[slot].subject}${cookie[slot].teacher}${cookie[slot].class}${colour}`;
        cookie_string += slot_string;
    }
    return cookie_string;
}

// --- Initialize cookie ---
function initCookie() {
    const cookieName = "class_schedule";
    let cookieValue = getCookie(cookieName);

    if (!cookieValue || cookieValue === "") {
        const days = ["MON", "TUE", "WED", "THU", "FRI"];
        const times = ["0900", "0940", "1040", "1120", "1200", "1240", "1320", "1400", "1440", "1520"];
        let initialValue = "";

        for (let day of days) {
            for (let time of times) {
                // Default slot: time + day + subject+teacher+class+colour all "NON"
                const slot = `${time}${day}NONNONNONNON`; 
                initialValue += slot;
            }
        }

        setCookie(cookieName, initialValue);
        cookieValue = initialValue;
        console.log("Cookie initialized:", cookieValue);
    } else {
        console.log("Cookie already exists:", cookieValue);
    }

    // Convert cookie string to JSON immediately
    const scheduleJSON = formatToJSON(cookieValue);
    console.log("Schedule JSON:", scheduleJSON);

    return scheduleJSON;
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
    const schedule = initCookie();
    // Now `schedule` is a JSON array ready to use
});
