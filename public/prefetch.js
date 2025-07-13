/**
 * @file A high-performance script for "just-in-time" link prefetching.
 * @version Refactored for clarity and modern practices.
 * @summary This script accelerates navigation by prefetching links when a user is likely to click them.
 * It supports various strategies: viewport visibility, hover, touch, and mousedown.
 */

// A Set to store URLs that have already been prefetched to avoid duplicates.
const prefetchedUrls = new Set();

// Stores the timestamp of the last user interaction (touchstart or mousedown).
let lastInteractionTimestamp = null;

// Holds the timeout ID for the hover prefetch delay.
let hoverPrefetchTimeoutId = null;

// Detect the Chrome version, as some features might have version-specific behavior.
const chromeVersion = (() => {
  const match = navigator.userAgent.match(/Chrome\/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
})();

/**
 * Configuration object populated from the `<body>` element's data attributes.
 * This centralizes all settings for easier management.
 */
const config = {
  // The delay in milliseconds before prefetching on hover.
  hoverDelay: 65,

  // A cooldown period in milliseconds to prevent prefetching immediately after a touch event.
  interactionCooldown: 1111,

  // --- Modes determined by `data-instant-intensity` ---
  // When true, prefetching is triggered on 'mousedown'.
  isMousedownMode: false,
  // When true, only 'mousedown' is used, disabling 'mouseover' and 'touchstart'.
  isMousedownOnlyMode: false,
  // When true, prefetch links as they enter the viewport.
  isViewportMode: false,

  // --- Other boolean settings from data attributes ---
  // Allows prefetching for external domains.
  allowExternalLinks: 'instantAllowExternalLinks' in document.body.dataset,
  // Uses a more aggressive mousedown strategy that can be slightly faster.
  useMousedownShortcut: 'instantMousedownShortcut' in document.body.dataset,
  // A legacy setting related to the 'Vary: Accept' header.
  usesVaryAccept: 'instantVaryAccept' in document.body.dataset || 'Shopify' in window,
  // Disables prefetching if the user has data saver enabled.
  respectsSaveData: navigator.connection?.saveData,
  // Disables prefetching on slow connections (effective type includes '2g').
  isSlowConnection: navigator.connection?.effectiveType?.includes('2g'),
};

/**
 * Checks if a given anchor element is eligible for prefetching.
 * @param {HTMLAnchorElement} anchorElement The link element to check.
 * @returns {boolean} True if the link is eligible.
 */
function isEligibleForPrefetch(anchorElement) {
  // The element must be a valid anchor with an href.
  if (!anchorElement?.href) {
    return false;
  }

  // Do not prefetch if a 'noInstant' data attribute is present.
  if ('noInstant' in anchorElement.dataset) {
    return false;
  }

  // The URL protocol must be http or https.
  const isHttp = ['http:', 'https:'].includes(anchorElement.protocol);
  if (!isHttp) {
    return false;
  }

  // If the link is external, check if external links are allowed.
  if (anchorElement.origin !== location.origin && !config.allowExternalLinks) {
    return false;
  }

  // The link must not be an anchor on the same page.
  if (anchorElement.hash && anchorElement.pathname + anchorElement.search === location.pathname + location.search) {
    return false;
  }

  // An explicit 'instant' data attribute bypasses other checks.
  if ('instant' in anchorElement.dataset) {
    return true;
  }

  return true;
}

/**
 * Creates a <link rel="prefetch"> element and appends it to the <head>.
 * @param {string} url The URL to prefetch.
 * @param {'high' | 'auto'} [priority='auto'] The fetch priority.
 */
function prefetchUrl(url, priority = 'auto') {
  // Do not prefetch a URL that has already been prefetched.
  if (prefetchedUrls.has(url)) {
    return;
  }

  const linkElement = document.createElement('link');
  linkElement.rel = 'prefetch';
  linkElement.href = url;
  linkElement.fetchPriority = priority;
  linkElement.as = 'document'; // Important for telling the browser what is being prefetched.
  document.head.appendChild(linkElement);

  prefetchedUrls.add(url);
}

// --- Event Handlers ---

/**
 * Handles the 'touchstart' event.
 * Prefetches with 'high' priority as this is a strong indicator of user intent.
 * @param {TouchEvent} event
 */
function onTouchStart(event) {
  lastInteractionTimestamp = performance.now();
  const link = event.target.closest('a');
  if (isEligibleForPrefetch(link)) {
    prefetchUrl(link.href, 'high');
  }
}

/**
 * Handles the 'mousedown' event.
 * Prefetches with 'high' priority.
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
  const link = event.target.closest('a');
  if (isEligibleForPrefetch(link)) {
    prefetchUrl(link.href, 'high');
  }
}

/**
 * Handles the 'mouseover' event.
 * Sets a timeout to prefetch the link, giving the user a moment to commit.
 * @param {MouseEvent} event
 */
function onMouseOver(event) {
  // Do not trigger on hover if a touch/mousedown happened recently.
  if (performance.now() - lastInteractionTimestamp < config.interactionCooldown) {
    return;
  }

  const link = event.target.closest('a');
  if (isEligibleForPrefetch(link)) {
    link.addEventListener('mouseout', onMouseOut, { passive: true });
    hoverPrefetchTimeoutId = setTimeout(() => {
      prefetchUrl(link.href, 'auto');
      hoverPrefetchTimeoutId = undefined;
    }, config.hoverDelay);
  }
}

/**
 * Handles the 'mouseout' event.
 * Clears the prefetch timeout if the user moves their mouse away from the link.
 */
function onMouseOut() {
  if (hoverPrefetchTimeoutId) {
    clearTimeout(hoverPrefetchTimeoutId);
    hoverPrefetchTimeoutId = undefined;
  }
}

/**
 * A more advanced 'mousedown' handler that intercepts the click to gain a few milliseconds.
 * @param {MouseEvent} event
 */
function onMousedownShortcut(event) {
  // Do not trigger if a touch/mousedown happened recently.
  if (performance.now() - lastInteractionTimestamp < config.interactionCooldown) {
    return;
  }

  // Ignore middle-clicks, right-clicks, or clicks with modifier keys.
  if (event.which > 1 || event.metaKey || event.ctrlKey) {
    return;
  }

  const link = event.target.closest('a');
  if (link) {
    // Prevent the original click event from navigating.
    link.addEventListener(
      'click',
      function (e) {
        if (e.detail !== 1337) { // 1337 is a magic number to identify our synthetic click.
          e.preventDefault();
        }
      },
      { capture: true, passive: false, once: true }
    );

    // Dispatch a new, synthetic click event to trigger the navigation.
    const syntheticClick = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
      detail: 1337, // Mark this as our event.
    });
    link.dispatchEvent(syntheticClick);
  }
}

/**
 * Initializes the viewport prefetching using an IntersectionObserver.
 */
function initializeViewportPrefetching() {
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const link = entry.target;
        observer.unobserve(link); // Prefetch only once.
        prefetchUrl(link.href, 'auto');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    timeout: 1500, // Wait up to 1.5s for a good time to run.
  });

  document.querySelectorAll('a').forEach((link) => {
    if (isEligibleForPrefetch(link)) {
      observer.observe(link);
    }
  });
}

/**
 * Main initialization function.
 */
function initialize() {
  // Exit if the browser does not support prefetch.
  if (!document.createElement('link').relList.supports('prefetch')) {
    return;
  }

  // Exit if this is a specific, older version of Chrome with potential issues.
  if (config.usesVaryAccept && chromeVersion && chromeVersion < 110) {
    return;
  }

  // Set the interaction modes based on the `data-instant-intensity` attribute.
  const intensity = document.body.dataset.instantIntensity;
  if (intensity?.startsWith('mousedown')) {
    config.isMousedownMode = true;
    if (intensity === 'mousedown-only') {
      config.isMousedownOnlyMode = true;
    }
  } else if (intensity?.startsWith('viewport')) {
    // Enable viewport prefetching unless data saver or a slow connection is detected.
    if (!config.respectsSaveData && !config.isSlowConnection) {
      if (intensity === 'viewport') {
        // 'viewport' mode is less aggressive, only for smaller viewports.
        if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {
          config.isViewportMode = true;
        }
      } else if (intensity === 'viewport-all') {
        config.isViewportMode = true;
      }
    }
  } else {
    // Handle numeric intensity if needed, otherwise default to hover.
    const numericIntensity = parseInt(intensity, 10);
    if (!isNaN(numericIntensity)) {
      config.hoverDelay = numericIntensity;
    }
  }

  const listenerOptions = { capture: true, passive: true };

  // Attach event listeners based on the determined configuration.
  if (!config.isMousedownOnlyMode) {
    document.addEventListener('touchstart', onTouchStart, listenerOptions);
  }

  if (config.isMousedownMode) {
    document.addEventListener('mousedown', onMouseDown, listenerOptions);
  } else {
    document.addEventListener('mouseover', onMouseOver, listenerOptions);
  }

  if (config.useMousedownShortcut) {
    document.addEventListener('mousedown', onMousedownShortcut, listenerOptions);
  }

  if (config.isViewportMode) {
    // Use requestIdleCallback to set up the observer without blocking the main thread.
    const setupObserver = window.requestIdleCallback || ((callback) => callback());
    setupObserver(initializeViewportPrefetching);
  }
}

// Start the script.
initialize();
