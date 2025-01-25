/**
 * fitty v2.2.6 (ESM Conversion)
 * Snugly resizes text to fit its parent container
 * 
 * Original Author: Rik Schennink (https://github.com/rikschennink/fitty)
 * UMD => ESM Conversion: Matthew Penkala (https://matthewpenkala.com/about)
 * 
 * This code is released under the MIT license.
 */

"use strict";

/**
 * Polyfill for `_extends`, used by original Fitty code.
 * In modern browsers, this is just `Object.assign(...)`.
 */
var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

/**
 * The core Fitty logic, originally wrapped in UMD. We’ve extracted
 * it into a single function (fittyModule) that accepts a `window`
 * object (or `null`) and returns the Fitty API.
 */
function fittyModule(n) {
  // If `n` is null/undefined, we can’t do anything.
  // Return a no-op function so we don’t break.
  if (!n) {
    return function () {
      console.warn("Fitty: window is not defined");
    };
  }

  // The "states" that track whether an element’s layout or content is dirty.
  var r = {
    IDLE: 0,
    DIRTY_CONTENT: 1,
    DIRTY_LAYOUT: 2,
    DIRTY: 3
  };

  // Internal references
  var i = []; // holds all fitty elements
  var e = null; // requestAnimationFrame id

  // Throttled resize loop using `requestAnimationFrame` if available
  var o =
    "requestAnimationFrame" in n
      ? function () {
          n.cancelAnimationFrame(e);
          e = n.requestAnimationFrame(function () {
            u(i.filter(function (el) {
              return el.dirty;
            }));
          });
        }
      : function () {
          // If RAF not available, no-op (or you could do setTimeout).
        };

  /**
   * Mark all items as `t` (some dirty state), then schedule a re-check.
   */
  var t = function (dirtyState) {
    return function () {
      i.forEach(function (item) {
        item.dirty = dirtyState;
      });
      o();
    };
  };

  /**
   * The main update loop that:
   * 1) Applies any needed initial styles (like inline-block)
   * 2) Calculates the new font sizes
   * 3) Applies them to each element
   */
  var u = function (list) {
    // 1) For items that haven't computed style, do so now
    list
      .filter(function (item) {
        return !item.styleComputed;
      })
      .forEach(function (item) {
        item.styleComputed = s(item);
      });

    // 2) For items needing inline-block or white-space tweaks
    list.filter(f).forEach(d);

    // 3) For items needing new measurements
    var changed = list.filter(c);
    changed.forEach(l);
    changed.forEach(function (item) {
      d(item);
      a(item);
    });
    changed.forEach(p);
  };

  /**
   * Reset an element's `dirty` state to IDLE
   */
  var a = function (item) {
    return (item.dirty = r.IDLE);
  };

  /**
   * Calculate the new font size based on parent container width
   */
  var l = function (item) {
    item.availableWidth = item.element.parentNode.clientWidth;
    item.currentWidth = item.element.scrollWidth;
    item.previousFontSize = item.currentFontSize;

    // scale
    item.currentFontSize = Math.min(
      Math.max(
        item.minSize,
        (item.availableWidth / item.currentWidth) * item.previousFontSize
      ),
      item.maxSize
    );

    // If multiLine is true but we got clamped at minSize, allow wrapping
    item.whiteSpace =
      item.multiLine && item.currentFontSize === item.minSize
        ? "normal"
        : "nowrap";
  };

  /**
   * Return true if this element needs re-measuring
   */
  var c = function (item) {
    // DIRTY_LAYOUT means we know the parent's width changed
    if (item.dirty !== r.DIRTY_LAYOUT) return item.dirty === r.DIRTY;
    return (
      item.dirty === r.DIRTY_LAYOUT &&
      item.element.parentNode.clientWidth !== item.availableWidth
    );
  };

  /**
   * Compute and store the element's current inline styles
   */
  var s = function (item) {
    var style = n.getComputedStyle(item.element, null);
    item.currentFontSize = parseInt(style.getPropertyValue("font-size"), 10);
    item.display = style.getPropertyValue("display");
    item.whiteSpace = style.getPropertyValue("white-space");
  };

  /**
   * For new elements, or those that need an inline-block / nowrap fix
   */
  var f = function (item) {
    var changedSomething = false;
    if (!item.preStyleTestCompleted) {
      if (/inline-/.test(item.display)) {
        changedSomething = true;
        item.display = "inline-block";
      }
      if ("nowrap" !== item.whiteSpace) {
        changedSomething = true;
        item.whiteSpace = "nowrap";
      }
      item.preStyleTestCompleted = true;
    }
    return changedSomething;
  };

  /**
   * Apply the updated inline styles to the element
   */
  var d = function (item) {
    if (!item.originalStyle) {
      item.originalStyle = item.element.getAttribute("style") || "";
    }
    item.element.style.cssText =
      item.originalStyle +
      ";white-space:" +
      item.whiteSpace +
      ";display:" +
      item.display +
      ";font-size:" +
      item.currentFontSize +
      "px";
  };

  /**
   * Dispatch a custom "fit" event on the element after changing its size
   */
  var p = function (item) {
    item.element.dispatchEvent(
      new CustomEvent("fit", {
        detail: {
          oldValue: item.previousFontSize,
          newValue: item.currentFontSize,
          scaleFactor: item.currentFontSize / item.previousFontSize
        }
      })
    );
  };

  /**
   * Mark one element as dirty of a certain type (content vs layout),
   * then schedule the main loop.
   */
  var m = function (item, dirtyType) {
    return function () {
      item.dirty = dirtyType;
      o();
    };
  };

  /**
   * Add a brand new fitty element to the internal array
   */
  var v = function (item) {
    item.newbie = true;
    item.dirty = true;
    i.push(item);
  };

  /**
   * Unsubscribe function used by each fitty element if needed
   */
  var y = function (item) {
    return function () {
      i = i.filter(function (el) {
        return el.element !== item.element;
      });
      if (item.observeMutations) {
        item.observer.disconnect();
      }
      item.element.style.cssText = item.originalStyle;
    };
  };

  /**
   * Observe DOM mutations if config.observeMutations is set
   */
  var h = function (item) {
    if (item.observeMutations) {
      item.observer = new MutationObserver(m(item, r.DIRTY_CONTENT));
      item.observer.observe(item.element, item.observeMutations);
    }
  };

  // Default config for each fitty element
  var S = {
    minSize: 16,
    maxSize: 512,
    multiLine: true,
    observeMutations:
      "MutationObserver" in n && {
        subtree: true,
        childList: true,
        characterData: true
      }
  };

  // For window-resize event throttling
  var b = null;
  var w = function () {
    n.clearTimeout(b);
    b = n.setTimeout(t(r.DIRTY_LAYOUT), F.observeWindowDelay);
  };

  // The events we'll watch on the window
  var T = ["resize", "orientationchange"];

  /**
   * Combine an array of DOM elements with user config, create
   * the internal objects, and trigger the first fit pass.
   */
  function z(elements, options) {
    var config = _extends({}, S, options);

    // Convert each DOM element into an object with config and watchers
    var items = elements.map(function (element) {
      var itemConfig = _extends({}, config, { element: element });
      v(itemConfig);
      h(itemConfig);
      return {
        element: element,
        fit: m(itemConfig, r.DIRTY),
        unsubscribe: y(itemConfig)
      };
    });

    // Kick off measuring once
    o();
    return items;
  }

  /**
   * The top-level function that the user actually calls:
   *   fitty('.some-selector', { maxSize: 200, multiLine: false, ... })
   * or
   *   fitty(someDOMElement, { ... })
   *
   * Returns an array (if multiple elements matched) or a single object.
   */
  function F(e) {
    var t;
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof e === "string") {
      // e is a selector
      var nodeList = document.querySelectorAll(e);
      t = [].slice.call(nodeList);
      return z(t, n);
    } else {
      // e is already a DOM element
      return z([e], n)[0];
    }
  }

  /**
   * Additional static properties on F
   */
  // Let us toggle window observation on/off
  Object.defineProperty(F, "observeWindow", {
    set: function (shouldObserve) {
      var action = (shouldObserve ? "add" : "remove") + "EventListener";
      T.forEach(function (evt) {
        n[action](evt, w);
      });
    }
  });

  // By default, Fitty listens to window resizes
  F.observeWindow = true;

  // How long after a resize do we wait before re-measuring
  F.observeWindowDelay = 100;

  // This triggers a re-fit for *all* known elements
  F.fitAll = t(r.DIRTY);

  // Finally, return the main function so the user can call it
  return F;
}

/**
 * Actually instantiate the module by passing in the browser's window object
 * (if available). If `window` doesn’t exist, we pass null and return a no-op.
 */
const fitty = fittyModule(typeof window !== "undefined" ? window : null);

/**
 * Export the final fitty() function as the default export.
 * 
 * Example usage in your HTML/JS:
 * 
 *   // Dynamic import:
 *   (async () => {
 *     const { default: fitty } = await import('./fitty.esm.js');
 *     fitty('.fix-stroke');
 *   })();
 * 
 *   // or static import in a <script type="module">:
 *   import fitty from './fitty.esm.js';
 *   fitty('.fix-stroke');
 */
export default fitty;
