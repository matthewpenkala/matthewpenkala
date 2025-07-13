// src/main.js
import './styles/textGlitch.css';

import { initGlitch, switchToPlay } from './textGlitch.js';
import { elevateFetchPriority }     from './priorityFetch.js';

initGlitch();
window.switchToPlay        = switchToPlay;        // Webflow interactions
window.elevateFetchPriority = elevateFetchPriority;
