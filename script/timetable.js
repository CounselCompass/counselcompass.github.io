document.getElementById("test").onclick = testFunc;

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
