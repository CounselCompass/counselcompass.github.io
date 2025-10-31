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

function formatToCookie(cookie) {
  let cookie_string = "";
  for (let slot = 0; slot < cookie.length; slot++) {
    // Add colour (3 letters) at the end of each slot
    const colour = cookie[slot].colour || "NON"; // default "NON" if not set
    const slot_string = `${cookie[slot].id}${cookie[slot].subject}${cookie[slot].teacher}${cookie[slot].class}${colour}`;
    cookie_string += slot_string;
  }
  return cookie_string;
}

function formatToJSON(cookie) {
  let cookie_json = [];
  const slotLength = 19; // updated slot length (7+3+3+3+3)
  const into_classes = cookie.match(new RegExp(`.{1,${slotLength}}`, "g")) || [];

  for (let current_class = 0; current_class < into_classes.length; current_class++) {
    const slot = into_classes[current_class];
    cookie_json[current_class] = {
      id: slot.substring(0, 7),
      subject: slot.substring(7, 10),
      teacher: slot.substring(10, 13),
      class: slot.substring(13, 16),
      colour: slot.substring(16, 19) || "NON" // default "NON" if missing
    };
  }

  return cookie_json;
}
