/**
 * fitty v2.2.6 (ESM Conversion)
 * Snugly resizes text to fit its parent container
 * 
 * Original Author: Rik Schennink (https://github.com/rikschennink/fitty)
 * UMD => ESM Conversion: Matthew Penkala (https://matthewpenkala.com/about)
 * 
 * This code is released under the MIT license.
 */

const fitty = (function (w) {
  if (!w) return;

  const toArray = (nl) => [].slice.call(nl);

  const DrawState = {
    IDLE: 0,
    DIRTY_CONTENT: 1,
    DIRTY_LAYOUT: 2,
    DIRTY: 3
  };

  let fitties = [];

  let redrawFrame = null;
  const requestRedraw = 'requestAnimationFrame' in w ? () => {
    w.cancelAnimationFrame(redrawFrame);
    redrawFrame = w.requestAnimationFrame(() => {
      redraw(fitties.filter(f => f.dirty));
    });
  } : () => {};

  const redrawAll = (type) => () => {
    fitties.forEach(f => {
      f.dirty = type;
    });
    requestRedraw();
  };

  const redraw = (fitties) => {
    fitties.filter(f => !f.styleComputed).forEach(f => {
      f.styleComputed = computeStyle(f);
    });

    fitties.filter(shouldPreStyle).forEach(applyStyle);

    const fittiesToRedraw = fitties.filter(shouldRedraw);

    fittiesToRedraw.forEach(calculateStyles);

    fittiesToRedraw.forEach(f => {
      applyStyle(f);
      markAsClean(f);
    });

    fittiesToRedraw.forEach(dispatchFitEvent);
  };

  const markAsClean = (f) => f.dirty = DrawState.IDLE;

  const calculateStyles = (f) => {
    f.availableWidth = f.element.parentNode.clientWidth;
    f.currentWidth = f.element.scrollWidth;
    f.previousFontSize = f.currentFontSize;
    f.currentFontSize = Math.min(Math.max(f.minSize, f.availableWidth / f.currentWidth * f.previousFontSize), f.maxSize);
    f.whiteSpace = f.multiLine && f.currentFontSize === f.minSize ? 'normal' : 'nowrap';
  };

  const shouldRedraw = (f) => f.dirty !== DrawState.DIRTY_LAYOUT || (f.dirty === DrawState.DIRTY_LAYOUT && f.element.parentNode.clientWidth !== f.availableWidth);

  const computeStyle = (f) => {
    const style = w.getComputedStyle(f.element, null);
    f.currentFontSize = parseInt(style.getPropertyValue('font-size'), 10);
    f.display = style.getPropertyValue('display');
    f.whiteSpace = style.getPropertyValue('white-space');
  };

  const shouldPreStyle = (f) => {
    if (f.preStyleTestCompleted) return false;

    let preStyle = false;

    if (!/inline-/.test(f.display)) {
      preStyle = true;
      f.display = 'inline-block';
    }

    if (f.whiteSpace !== 'nowrap') {
      preStyle = true;
      f.whiteSpace = 'nowrap';
    }

    f.preStyleTestCompleted = true;

    return preStyle;
  };

  const applyStyle = (f) => {
    if (!f.originalStyle) {
      f.originalStyle = f.element.getAttribute('style') || '';
    }

    f.element.style.cssText = f.originalStyle + ';white-space:' + f.whiteSpace + ';display:' + f.display + ';font-size:' + f.currentFontSize + 'px';
  };

  const dispatchFitEvent = (f) => {
    f.element.dispatchEvent(new CustomEvent('fit', {
      detail: {
        oldValue: f.previousFontSize,
        newValue: f.currentFontSize,
        scaleFactor: f.currentFontSize / f.previousFontSize
      }
    }));
  };

  const fit = (f, type) => () => {
    f.dirty = type;
    requestRedraw();
  };

  const subscribe = (f) => {
    f.newbie = true;
    f.dirty = true;
    fitties.push(f);
  };

  const unsubscribe = (f) => () => {
    fitties = fitties.filter(_ => _.element !== f.element);
    if (f.observeMutations) {
      f.observer.disconnect();
    }
    f.element.style.cssText = f.originalStyle;
  };

  const observeMutations = (f) => {
    if (!f.observeMutations) return;

    f.observer = new MutationObserver(fit(f, DrawState.DIRTY_CONTENT));
    f.observer.observe(f.element, f.observeMutations);
  };

  const mutationObserverDefaultSetting = {
    subtree: true,
    childList: true,
    characterData: true
  };

  const defaultOptions = {
    minSize: 16,
    maxSize: 512,
    multiLine: true,
    observeMutations: 'MutationObserver' in w ? mutationObserverDefaultSetting : false
  };

  function fittyCreate(elements, options) {
    const fittyOptions = Object.assign({}, defaultOptions, options);

    const publicFitties = elements.map(element => {
      const f = Object.assign({}, fittyOptions, { element });

      subscribe(f);
      observeMutations(f);

      return {
        element,
        fit: fit(f, DrawState.DIRTY),
        unsubscribe: unsubscribe(f)
      };
    });

    requestRedraw();

    return publicFitties;
  }

  function fittyMain(target, options = {}) {
    return typeof target === 'string'
      ? fittyCreate(toArray(document.querySelectorAll(target)), options)
      : fittyCreate([target], options)[0];
  }

  let resizeDebounce = null;
  const onWindowResized = () => {
    w.clearTimeout(resizeDebounce);
    resizeDebounce = w.setTimeout(redrawAll(DrawState.DIRTY_LAYOUT), fittyMain.observeWindowDelay);
  };

  const events = ['resize', 'orientationchange'];
  Object.defineProperty(fittyMain, 'observeWindow', {
    set: (enabled) => {
      const method = `${enabled ? 'add' : 'remove'}EventListener`;
      events.forEach(e => {
        w[method](e, onWindowResized);
      });
    }
  });

  fittyMain.observeWindow = true;
  fittyMain.observeWindowDelay = 100;

  fittyMain.fitAll = redrawAll(DrawState.DIRTY);

  return fittyMain;
})(typeof window === 'undefined' ? null : window);

export default fitty;
