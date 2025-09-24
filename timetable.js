document.getElementById("test").onclick = testFunc;

function testFunc() {
  var text = prompt("Whats your name? ")
  alert(text)
  document.cookie = `username=${text}; expires=Wed, 1 Jul 2026 12:00:00 UTC`;
}
