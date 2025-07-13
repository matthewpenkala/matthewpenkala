// src/main.js
import './styles/textGlitch.css';

import { initGlitch } from './textGlitch.js';
import { elevateFetchPriority }     from './priorityFetch.js';

// ── initialise the glitch headline ─────────────────────────────────────
const glitchTarget = document.querySelector('#glitchText');
initGlitch(glitchTarget);

// expose to Webflow or console if needed
window.elevateFetchPriority = elevateFetchPriority;

// example dynamic priority bump (optional)
elevateFetchPriority([
  'https://assets.matthewpenkala.com/resume/magazine-loader.html',
  'https://assets.matthewpenkala.com/resume/1.svg',
  'https://assets.matthewpenkala.com/resume/2.svg',
  'https://assets.matthewpenkala.com/resume/annotations.json'
], 10_000);