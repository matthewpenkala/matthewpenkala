// src/priorityFetch.js

// ── private state ───────────────────────────────────────────────────────
let glitchEl;                 // HTMLElement supplied by initGlitch()
let currentMode = 'WORK';

// ── helpers ─────────────────────────────────────────────────────────────
function applyGlitchAndChangeText(text) {
  glitchEl.classList.add('glitch');

  if (Math.random() < 0.5) {
    const html = [...text].map(
      c => `<span style="display:inline-block;">${c}</span>`
    ).join('');
    glitchEl.innerHTML  = html;
    glitchEl.dataset.text = text;

    const spans = glitchEl.querySelectorAll('span');
    const interval = setInterval(() => {
      spans.forEach(s =>
        (s.style.visibility = Math.random() < 0.3 ? 'hidden' : 'visible')
      );
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      glitchEl.textContent = text;
      glitchEl.dataset.text = text;
      glitchEl.classList.remove('glitch');
    }, 150);
  } else {
    glitchEl.textContent = text;
    glitchEl.dataset.text = text;
    setTimeout(() => glitchEl.classList.remove('glitch'), 150);
  }
}

const getRandomPunctuation = () => (Math.random() < 0.75 ? '?' : '!');

export function switchToWork() {
  applyGlitchAndChangeText('WORK.');
  currentMode = 'WORK';
}

export function switchToPlay() {
  currentMode = 'PLAY';
  applyGlitchAndChangeText(`PLAY${getRandomPunctuation()}`);
  const revertAfter = Math.random() < 0.5 ? 225 : 450;
  setTimeout(() => currentMode === 'PLAY' && switchToWork(), revertAfter);
}

// ── ambient loops ───────────────────────────────────────────────────────
function scheduleAmbientGlitch() {
  const delay = Math.random() * 10_000 + 10_000;
  setTimeout(() => {
    applyGlitchAndChangeText(glitchEl.textContent);
    scheduleAmbientGlitch();
  }, delay);
}
function checkAndSwitchToPlay() {
  if (currentMode === 'WORK' && Math.random() < 0.5) switchToPlay();
}

// ── public bootstrap ────────────────────────────────────────────────────
/**
 * @param {HTMLElement} el − the element to animate
 */
export function initGlitch(el) {
  if (!(el instanceof HTMLElement)) {
    console.warn('[glitch] initGlitch expected an HTMLElement, got', el);
    return;
  }
  glitchEl = el;
  scheduleAmbientGlitch();
  setInterval(checkAndSwitchToPlay, 2_000);
}