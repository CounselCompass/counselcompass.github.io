function updateCountdown() {
      const countdownText = document.getElementById('countdown-text');
      const progressBar = document.getElementById('progress-bar');
      const progressText = document.getElementById('progress-text');

      const now = new Date();
      const currentYear = now.getUTCFullYear();

      // Target: Dec 20, 1:20 PM GMT
      let targetDate = new Date(Date.UTC(currentYear, 11, 20, 13, 20, 0));
      // Start date for progress bar: Nov 3, 00:00 GMT of current year
      const startDate = new Date(); // Month 10 = Nov

      if (now > targetDate) {
        targetDate = new Date(Date.UTC(currentYear + 1, 11, 20, 13, 20, 0));
      }

      const totalSeconds = Math.floor((targetDate - now) / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      countdownText.textContent =
        `Days until Christmas Break: ${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Calculate progress % based on time elapsed since startDate
      let totalDuration = targetDate - startDate;
      let elapsed = now - startDate;
      let progressPercent = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

      progressBar.style.width = progressPercent + '%';
      progressText.textContent = progressPercent.toFixed(1) + '%';
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);