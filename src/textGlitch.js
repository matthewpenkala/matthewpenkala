/* ─────────────────────────  src/glitch.js  ──────────────────────────
   ES-module version – pairs with main.js
--------------------------------------------------------------------- */

// ── private state ───────────────────────────────────────────────────
let glitchText;               // will be filled in by initGlitch()
let currentMode = 'WORK';

// ── core helpers (logic unchanged) ──────────────────────────────────
function applyGlitchAndChangeText(text) {
  glitchText.classList.add('glitch');

  const useCharGlitch = Math.random() < 0.5;
  if (useCharGlitch) {
    const html = [...text]
      .map(c => `<span style="display:inline-block;">${c}</span>`).join('');
    glitchText.innerHTML = html;
    glitchText.dataset.text = text;

    const spans     = glitchText.querySelectorAll('span');
    const interval  = setInterval(() => {
      spans.forEach(s => (s.style.visibility = Math.random() < 0.3 ? 'hidden' : 'visible'));
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      glitchText.textContent = text;
      glitchText.dataset.text = text;
      glitchText.classList.remove('glitch');
    }, 150);
  } else {
    glitchText.textContent = text;
    glitchText.dataset.text = text;
    setTimeout(() => glitchText.classList.remove('glitch'), 150);
  }
}

function getRandomPunctuation()      { return Math.random() < 0.75 ? '?' : '!'; }
export function switchToWork()       { applyGlitchAndChangeText('WORK.'); currentMode = 'WORK'; }
export function switchToPlay() {
  currentMode = 'PLAY';
  applyGlitchAndChangeText(`PLAY${getRandomPunctuation()}`);

  const revertAfter = Math.random() < 0.5 ? 225 : 450;
  setTimeout(() => currentMode === 'PLAY' && switchToWork(), revertAfter);
}

// ── background loops ────────────────────────────────────────────────
function scheduleAmbientGlitch() {
  const delay = Math.random() * 10_000 + 10_000;
  setTimeout(() => { applyGlitchAndChangeText(glitchText.textContent); scheduleAmbientGlitch(); }, delay);
}
function checkAndSwitchToPlay() {
  if (currentMode === 'WORK' && Math.random() < 0.5) switchToPlay();
}

// ── public bootstrap — called once from main.js ────────────────────
export function initGlitch(selector = '#glitchText') {
  glitchText = document.querySelector(selector);
  if (!glitchText) return console.warn(`[glitch] element ${selector} not found`);

  scheduleAmbientGlitch();
  setInterval(checkAndSwitchToPlay, 2_000);
}