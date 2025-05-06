let aura = 0;
let lastClickTime = 0;

const auraDisplay = document.getElementById('auraScore');
const auraBtn = document.getElementById('auraBtn');

auraBtn.addEventListener('click', () => {
  const now = Date.now();
  const timeDiff = now - lastClickTime;

  if (timeDiff < 30) {
    // Too fast, still likely an auto-clicker
    alert("You're clicking too fast! ⛔");
    return;
  }

  aura++;
  auraDisplay.textContent = aura;
  lastClickTime = now;
});
