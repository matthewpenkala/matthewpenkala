// src/priorityFetch.js
const DEFAULT_DELAY = 10_000;

/**
 * Promote one or many already-prefetched assets to high priority.
 *
 * @param {string|string[]|Record<string,number>} urls   – see usage above
 * @param {number} [sharedDelay=DEFAULT_DELAY]           – used only when 1st arg is string|array
 */
export function elevateFetchPriority(urls, sharedDelay = DEFAULT_DELAY) {
  // Normalise into [url, delay] tuples
  let tasks;

  if (typeof urls === 'string') {
    tasks = [[urls, sharedDelay]];
  } else if (Array.isArray(urls)) {
    tasks = urls.map(u => [u, sharedDelay]);
  } else if (urls && typeof urls === 'object') {
    tasks = Object.entries(urls);                // { url: delay }
  } else {
    console.warn('[elevateFetchPriority] bad input', urls);
    return;
  }

  window.addEventListener('load', () => {
    tasks.forEach(([url, delay]) => {
      setTimeout(async () => {
        try {
          // Skip if already in HTTP cache (optional; remove if not using Service Workers)
          if (await caches.match?.(url)) return;

          // Duplicate fetch bumps priority in Chromium; harmless elsewhere
          await fetch(url, { priority: 'high' });
          console.log(`[priorityFetch] ↑high ${url}`);
        } catch { /* ignore */ }
      }, delay);
    });
  });
}

// Expose for inline scripts (Webflow, etc.)
window.elevateFetchPriority ??= elevateFetchPriority;
