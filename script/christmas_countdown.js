function updateCountdown() {
  const countdownText = document.getElementById('countdown-text');

  const now = new Date();
  const currentYear = now.getFullYear();

  // Target: December 20th, 00:00:00 of current year
  let targetDate = new Date(currentYear, 11, 20, 0, 0, 0); // Month 11 = December

  // If December 20th has already passed this year, use next year
  if (now > targetDate) {
    targetDate = new Date(currentYear + 1, 11, 20, 0, 0, 0);
  }

  const totalSeconds = Math.floor((targetDate - now) / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownText.textContent = `Days until December 20: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Run immediately
updateCountdown();
// Update every second
setInterval(updateCountdown, 1000);
