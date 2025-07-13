// src/main.js
// import './styles/base.css';
import './styles/textGlitch.css';

// main.js – the single entry file Vite starts with
import { initGlitch, switchToPlay } from './textGlitch.js';

initGlitch();

window.switchToPlay = switchToPlay;
