/**
 * fitty v2.2.6 (ESM Conversion)
 * fitty.esm.js - A modern, refactored version of the original fitty library as an ES module.
 * Snugly resizes text to fit its parent container
 * 
 * Original Author: Rik Schennink (https://github.com/rikschennink/fitty)
 * UMD => ESM Conversion: Matthew Penkala (https://matthewpenkala.com/about)
 * 
 * This code is released under the MIT license.
 */

const w = typeof window !== 'undefined' ? window : null;

// If there's no window, export a no-op function to avoid errors in SSR or similar.
if (!w) {
  const fittyNoOp = () => [];
  fittyNoOp.fitAll = () => {};
  fittyNoOp.observeWindow = false;
  fittyNoOp.observeWindowDelay = 100;
  export default fittyNoOp;
  export const fitAll = fittyNoOp.fitAll;
  return;
}

/* =============================
   Constants and Utilities
   ============================= */

const toArray = (nl) => Array.prototype.slice.call(nl);

/** Enum-like object for tracking how "dirty" a FittyInstance is. */
const DrawState = {
  IDLE: 0,
  DIRTY_CONTENT: 1,
  DIRTY_LAYOUT: 2,
  DIRTY: 3
};

/** Default mutation observer settings, used if observeMutations is `true`. */
const mutationObserverDefaultSetting = {
  subtree: true,
  childList: true,
  characterData: true
};

/** Default options for new Fitty instances. */
const defaultOptions = {
  minSize: 16,
  maxSize: 512,
  multiLine: true,
  observeMutations: 'MutationObserver' in w ? mutationObserverDefaultSetting : false
};

/* =============================
   Internal State and Scheduling
   ============================= */

let instances = [];
let redrawFrame = null;

/**
 * Request a redraw for all dirty instances.
 */
const requestRedraw = (() => {
  if ('requestAnimationFrame' in w) {
    return () => {
      w.cancelAnimationFrame(redrawFrame);
      redrawFrame = w.requestAnimationFrame(() => {
        // Only redraw those instances marked dirty
        redraw(instances.filter((f) => f.dirty !== DrawState.IDLE));
      });
    };
  }
  // Fallback if requestAnimationFrame not available
  return () => {};
})();

/**
 * Returns a function that marks all instances as dirty for the given `type` and schedules a redraw.
 */
const redrawAll = (type) => () => {
  instances.forEach((f) => {
    f.dirty = type;
  });
  requestRedraw();
};

/* =============================
   FittyInstance Class
   ============================= */

class FittyInstance {
  constructor(element, options) {
    // Merge user options with defaults
    Object.assign(this, defaultOptions, options);

    this.element = element;
    this.dirty = DrawState.DIRTY; // new instance => force a redraw
    this.newbie = true;
    this.preStyleTestCompleted = false;

    this.originalStyle = '';
    this.styleComputed = false;

    // For tracking sizes
    this.currentFontSize = null;
    this.previousFontSize = null;
    this.availableWidth = null;
    this.currentWidth = null;
    this.display = null;
    this.whiteSpace = null;

    this.observer = null;

    // If we need to observe changes inside the element (i.e., content changes)
    if (this.observeMutations) {
      this.observe();
    }
  }

  /**
   * Start the mutation observer if applicable.
   */
  observe() {
    if (!this.observeMutations) return;
    this.observer = new MutationObserver(() => {
      this.dirty = DrawState.DIRTY_CONTENT;
      requestRedraw();
    });
    this.observer.observe(this.element, this.observeMutations);
  }

  /**
   * Stop observing the element for mutation changes.
   */
  disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * Compute and store the initial CSS styles needed for sizing.
   */
  computeStyle() {
    if (this.styleComputed) return;
    const style = w.getComputedStyle(this.element);
    this.currentFontSize = parseInt(style.getPropertyValue('font-size'), 10);
    this.display = style.getPropertyValue('display');
    this.whiteSpace = style.getPropertyValue('white-space');
    this.styleComputed = true;
  }

  /**
   * Check if we need to adjust the inline styles (from e.g. `display: block` => `inline-block`, etc.)
   */
  shouldPreStyle() {
    if (this.preStyleTestCompleted) return false;
    let needsPreStyle = false;

    // Convert any non-inline display to inline-block
    if (!/inline-/.test(this.display)) {
      this.display = 'inline-block';
      needsPreStyle = true;
    }

    // Force white-space to nowrap unless we explicitly want multiLine at min size
    if (this.whiteSpace !== 'nowrap') {
      this.whiteSpace = 'nowrap';
      needsPreStyle = true;
    }

    this.preStyleTestCompleted = true;
    return needsPreStyle;
  }

  /**
   * Apply the computed display, white-space, and font-size to the element.
   */
  applyStyle() {
    if (!this.originalStyle) {
      this.originalStyle = this.element.getAttribute('style') || '';
    }
    this.element.style.cssText = [
      this.originalStyle,
      `white-space:${this.whiteSpace}`,
      `display:${this.display}`,
      `font-size:${this.currentFontSize}px`
    ].join(';');
  }

  /**
   * Calculate the new font size based on the parent container width and current scroll width.
   */
  calculateStyles() {
    this.availableWidth = this.element.parentNode.clientWidth;
    this.currentWidth = this.element.scrollWidth;
    this.previousFontSize = this.currentFontSize;

    const ratio = this.availableWidth / this.currentWidth;
    const newSize = this.previousFontSize * ratio;
    this.currentFontSize = Math.min(Math.max(this.minSize, newSize), this.maxSize);

    // If multiLine is `true` but we had to clamp to minSize, we allow wrapping
    this.whiteSpace = this.multiLine && this.currentFontSize === this.minSize
      ? 'normal'
      : 'nowrap';
  }

  /**
   * Whether we should redraw based on layout changes.
   */
  needsRedraw() {
    // Redraw if not layout-dirty, or
    // if layout-dirty and the parent container width changed
    if (this.dirty !== DrawState.DIRTY_LAYOUT) return true;
    return this.element.parentNode.clientWidth !== this.availableWidth;
  }

  /**
   * After we apply the new style, mark as clean.
   */
  markAsClean() {
    this.dirty = DrawState.IDLE;
  }

  /**
   * Dispatch a "fit" event from the element with info on the scale factor, etc.
   */
  dispatchFitEvent() {
    this.element.dispatchEvent(
      new CustomEvent('fit', {
        detail: {
          oldValue: this.previousFontSize,
          newValue: this.currentFontSize,
          scaleFactor: this.currentFontSize / this.previousFontSize
        }
      })
    );
  }

  /**
   * Unsubscribe / remove this instance from the global tracking array
   * and stop mutation observer. Also revert the style to the original.
   */
  unsubscribe() {
    instances = instances.filter((inst) => inst !== this);
    this.disconnectObserver();
    this.element.style.cssText = this.originalStyle;
  }
}

/* =============================
   Redraw Logic
   ============================= */

/**
 * The main redraw logic:
 * 1. Ensure initial style is computed.
 * 2. Apply pre-styles if needed.
 * 3. Filter those that need redraw (layout changes, content changes).
 * 4. Calculate new sizes, apply them, mark clean, and dispatch events.
 */
function redraw(dirtyInstances) {
  // Compute style for any not-yet-computed
  dirtyInstances.forEach((inst) => inst.computeStyle());

  // Pre-style if needed
  const toPreStyle = dirtyInstances.filter((inst) => inst.shouldPreStyle());
  toPreStyle.forEach((inst) => inst.applyStyle());

  // Final subset: those that truly need a recalculation
  const toRedraw = dirtyInstances.filter((inst) => inst.needsRedraw());

  // Calculate new styles
  toRedraw.forEach((inst) => inst.calculateStyles());

  // Apply new styles, mark as clean, fire events
  toRedraw.forEach((inst) => {
    inst.applyStyle();
    inst.markAsClean();
    inst.dispatchFitEvent();
  });
}

/* =============================
   fittyMain API
   ============================= */

/**
 * Creates one or more FittyInstance objects for the provided elements,
 * returns public API objects so the user can `.fit()` or `.unsubscribe()`.
 */
function fittyCreate(elements, options) {
  const publicFitties = elements.map((element) => {
    const instance = new FittyInstance(element, options);
    instances.push(instance);

    return {
      element,
      fit: () => {
        instance.dirty = DrawState.DIRTY;
        requestRedraw();
      },
      unsubscribe: () => {
        instance.unsubscribe();
      }
    };
  });

  // Schedule an initial redraw
  requestRedraw();

  return publicFitties;
}

/**
 * Main entry point:
 *    fittyMain('.some-selector', { options })
 *    or
 *    fittyMain(singleElement, { options })
 */
function fittyMain(target, options = {}) {
  if (typeof target === 'string') {
    const nodeList = w.document.querySelectorAll(target);
    return fittyCreate(toArray(nodeList), options);
  }
  return fittyCreate([target], options)[0];
}

/* =============================
   Window Resize Handler
   ============================= */

let resizeDebounce = null;

/**
 * Called when window resizes or orientation changes.
 * We debounce with `fittyMain.observeWindowDelay`.
 */
const onWindowResized = () => {
  w.clearTimeout(resizeDebounce);
  resizeDebounce = w.setTimeout(redrawAll(DrawState.DIRTY_LAYOUT), fittyMain.observeWindowDelay);
};

/**
 * By default, we attach listeners to handle window changes.
 * `fittyMain.observeWindow = false` can remove them.
 */
const events = ['resize', 'orientationchange'];
Object.defineProperty(fittyMain, 'observeWindow', {
  set: (enabled) => {
    const method = `${enabled ? 'add' : 'remove'}EventListener`;
    events.forEach((e) => {
      w[method](e, onWindowResized);
    });
  }
});

/* =============================
   Augment fittyMain
   ============================= */

/** Delay (ms) for the debounced window resize event. */
fittyMain.observeWindowDelay = 100;

/** Immediately mark all known instances as dirty and request redraw. */
fittyMain.fitAll = redrawAll(DrawState.DIRTY);

/** Turn on by default the global window observing. */
fittyMain.observeWindow = true;

/* =============================
   Exports
   ============================= */

export default fittyMain;
export const fitAll = fittyMain.fitAll;
