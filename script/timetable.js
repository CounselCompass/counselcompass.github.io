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
    "class": "T14"
}
*/

function formatToCookie(cookie) {
  var cookie_string = "";
  for (var slot = 0; slot < cookie.length; slot++) {
    var slot_string = `${cookie[slot].id}${cookie[slot].subject}${cookie[slot].teacher}${cookie[slot].class}`;
    cookie_string = `${cookie_string}${slot_string}`;
  }
  return cookie_string;
}

function formatToJSON(cookie) {
  var cookie_json = [];
  into_classes = cookie.match(/.{16}/g);

  for (var current_class = 0; current_class < into_classes.length; current_class++) {
    cookie_json[current_class] = {};
  }

  for (var current_class = 0; current_class < into_classes.length; current_class++) {
    cookie_json[current_class].id = into_classes[current_class].substring(0,7);
    cookie_json[current_class].subject = into_classes[current_class].substring(7,10);
    cookie_json[current_class].teacher = into_classes[current_class].substring(10,13);
    cookie_json[current_class].class = into_classes[current_class].substring(13,16);
  }
  return cookie_json;
}
