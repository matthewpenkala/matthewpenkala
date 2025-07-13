/**
 * Defer.js: A lightweight, dependency-free script and content deferral library.
 *
 * This script improves page performance by delaying the loading of non-critical
 * resources (JavaScript, CSS, images) until the page is interactive or the
 * user begins to interact with it.
 */
(function (window, globalName) {
  // Polyfill `requestIdleCallback` if not available for smoother task scheduling.
  const requestIdleCallback = window.requestIdleCallback || function (handler) {
    const startTime = Date.now();
    return setTimeout(() => {
      handler({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - startTime)),
      });
    }, 1);
  };

  const document = window.document;
  const isDocumentReady = /p/.test(document.readyState); // 'interactive' or 'complete'

  // --- Queues for deferred tasks ---
  const interactionQueue = []; // Tasks that can wait for user interaction.
  const criticalQueue = []; // Tasks that should run as soon as possible after initial load.

  let isTriggered = isDocumentReady; // Becomes true after first interaction or page load.

  /**
   * Schedules a function for deferred execution.
   * @param {Function} task - The function to execute.
   * @param {number} [delay=0] - A minimum delay in milliseconds.
   * @param {boolean} [isLazy=true] - If true, waits for user interaction. Otherwise, runs after page load.
   */
  function defer(task, delay = 0, isLazy = true) {
    if (isDocumentReady) {
      setTimeout(task, delay);
    } else {
      const queue = isLazy ? interactionQueue : criticalQueue;
      queue.push(task, delay);
    }
  }

  /**
   * Creates and appends a preloader link to the head.
   * @param {HTMLScriptElement} originalScript - The script to preload.
   */
  function preloadScript(originalScript) {
    const preloadLink = document.createElement('link');
    // Copy all attributes except 'type' from the original script tag.
    // 'href' is used for <link>, so we map 'src' to it.
    for (const { name, value } of [...originalScript.attributes]) {
      if (name !== 'type') {
        preloadLink.setAttribute(name === 'src' ? 'href' : name, value);
      }
    }
    preloadLink.rel = 'preload';
    preloadLink.as = 'script';
    document.head.appendChild(preloadLink);
  }

  /**
   * Processes the task queues. Executes tasks with their specified delays.
   * This is the main trigger function.
   */
  function processQueues() {
    // Run critical tasks first (e.g., scripts that were not marked as lazy).
    while (criticalQueue.length > 0) {
      const task = criticalQueue.shift();
      const delay = criticalQueue.shift();
      setTimeout(task, delay);
    }
    // Now run tasks that were waiting for interaction.
    while (interactionQueue.length > 0) {
      const task = interactionQueue.shift();
      const delay = interactionQueue.shift();
      setTimeout(task, delay);
    }
  }

  /**
   * The initial trigger handler. Fires once on user interaction or page load.
   */
  function onInteractionOrLoad() {
    isTriggered = true;
    // Unregister all interaction listeners to run only once.
    unregisterInteractionListeners();
    // Process the critical queue on 'load', but wait for idle time for interaction-based triggers.
    requestIdleCallback(processQueues);
  }

  // --- Event Listener Management ---
  const interactionEvents = ['touchstart', 'mousemove', 'mousedown', 'keydown', 'wheel'];
  const pageLoadEvent = 'onpageshow' in window ? 'pageshow' : 'load';

  function registerInteractionListeners() {
    interactionEvents.forEach(event => document.addEventListener(event, onInteractionOrLoad, { once: true, passive: true }));
  }

  function unregisterInteractionListeners() {
    interactionEvents.forEach(event => document.removeEventListener(event, onInteractionOrLoad));
  }


  /**
   * "Reveals" a lazy-loaded element by swapping data attributes to real attributes.
   * e.g., `data-src` becomes `src`, `data-srcset` becomes `srcset`.
   * @param {HTMLElement} element - The element to reveal.
   * @param {string} [cssClass] - An optional CSS class to add upon reveal.
   */
  function revealElement(element, cssClass) {
    // Reveal nested images and sources first (e.g., inside a <picture> tag).
    findAll('source, img', element).forEach(child => revealElement(child));

    for (const { name, value } of [...element.attributes]) {
      const match = /^data-(.+)/.exec(name);
      if (match) {
        element.setAttribute(match[1], value);
        element.removeAttribute(name); // Clean up the data-* attribute.
      }
    }

    if (cssClass) {
      element.classList.add(cssClass);
    }

    // If the element has an `onload` handler defined via `data-onload`, trigger it.
    if (typeof element.onload === 'function') {
      element.onload();
    }
  }

  // --- Helper Functions ---
  const findAll = (selector, context = document) => [...context.querySelectorAll(selector)];
  const createEl = (tag, id) => id ? (document.getElementById(id) || document.createElement(tag)) : document.createElement(tag);

  // --- Public API ---

  /**
   * Finds and defers all scripts matching a selector.
   * @param {string} [selector='script[type="deferjs"]'] - The CSS selector for scripts to defer.
   * @param {number} [delay=0] - Delay for execution.
   * @param {boolean} [isLazy=true] - If true, waits for user interaction.
   */
  defer.all = function (selector = 'script[type="deferjs"]', delay = 0, isLazy = true) {
    defer(() => {
      const scriptsToLoad = findAll(selector);
      scriptsToLoad.forEach(preloadScript);

      // Sequentially execute the scripts to maintain order.
      (function executeNextScript() {
        const originalScript = scriptsToLoad.shift();
        if (!originalScript) return;

        const newScript = createEl('script');
        for (const { name, value } of [...originalScript.attributes]) {
            if (name !== 'type') {
                newScript.setAttribute(name, value);
            }
        }
        newScript.textContent = originalScript.textContent; // Copy inline script content.

        // If the script has a `src` and is not async, wait for it to load
        // before executing the next one.
        if (newScript.src && !newScript.hasAttribute('async')) {
          newScript.onload = newScript.onerror = executeNextScript;
        } else {
          // For async scripts or inline scripts, continue immediately.
          requestIdleCallback(executeNextScript);
        }
        originalScript.parentNode.replaceChild(newScript, originalScript);
      })();
    }, delay, isLazy);
  };

  /**
   * Defers the loading of DOM elements (e.g., images, iframes).
   * @param {string} [selector='[data-src]'] - CSS selector for elements to lazy-load.
   * @param {number} [delay=0] - Delay before starting to observe.
   * @param {string} [cssClass] - A class to add to elements when they are revealed.
   * @param {Function} [onReveal] - A callback to run when an element is revealed.
   * @param {object} [observerOptions] - Options for the IntersectionObserver.
   */
  defer.dom = function (selector = '[data-src]', delay = 0, cssClass, onReveal, observerOptions) {
    defer(() => {
      const elements = findAll(selector);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const target = entry.target;
              obs.unobserve(target); // Stop observing once revealed.
              if (!onReveal || onReveal(target) !== false) {
                  revealElement(target, cssClass);
              }
            }
          });
        }, observerOptions);
        elements.forEach(el => observer.observe(el));
      } else {
        // Fallback for older browsers: reveal all immediately.
        elements.forEach(el => {
            if (!onReveal || onReveal(el) !== false) {
                revealElement(el, cssClass);
            }
        });
      }
    }, delay, true); // DOM elements are always lazy.
  };

  /**
   * Dynamically loads a JavaScript file.
   * @param {string} src - The URL of the script.
   * @param {string} [id] - The ID to give the script element.
   * @param {number} [delay=0] - Delay for execution.
   * @param {boolean} [isLazy=true] - If true, waits for user interaction.
   * @param {Function} [onload] - A callback for the 'load' event.
   */
  defer.js = function (src, id, delay, isLazy, onload) {
    defer(() => {
      const script = createEl('script', id);
      script.src = src;
      if (onload) script.onload = onload;
      document.head.appendChild(script);
    }, delay, isLazy);
  };

  /**
   * Dynamically loads a CSS file.
   * @param {string} href - The URL of the stylesheet.
   * @param {string} [id] - The ID to give the link element.
   * @param {number} [delay=0] - Delay for execution.
   * @param {boolean} [isLazy=true] - If true, waits for user interaction.
   * @param {Function} [onload] - A callback for the 'load' event.
   */
  defer.css = function (href, id, delay, isLazy, onload) {
    defer(() => {
      const link = createEl('link', id);
      link.rel = 'stylesheet';
      link.href = href;
      if (onload) link.onload = onload;
      document.head.appendChild(link);
    }, delay, isLazy);
  };

  // Expose the revealElement function publicly.
  defer.reveal = revealElement;

  // --- Start the engine ---
  // Expose the main function to the global scope.
  window[globalName] = defer;

  // If the document isn't ready, set up the initial event listeners.
  if (!isDocumentReady) {
    document.addEventListener(pageLoadEvent, onInteractionOrLoad, { once: true });
    registerInteractionListeners();
  }

  // Automatically defer scripts with type="deferjs".
  defer.all();
  
  // Automatically defer elements with `data-src`
  defer.dom();

})(this, 'Defer');