(function () {

    function onDocumentReady(callback) {
        // Check if document is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // Call the callback function immediately if the document is ready
            callback();
        } else {
            // Otherwise, listen for the DOMContentLoaded event
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function processChunk(elements, index, chunkSize) {
        return new Promise(resolve => {
            setTimeout(() => {
                const chunk = Array.prototype.slice.call(elements, index, index + chunkSize);
                chunk.forEach(function (element) {
                    var style = window.getComputedStyle(element);
                    if (style.getPropertyValue('text-rendering') === 'optimizeLegibility' || style.getPropertyValue('text-rendering') === 'geometricPrecision' || style.getPropertyValue('text-rendering') === 'optimizelegibility') {
                        // Set the text-rendering property to optimizeSpeed
                        element.style.textRendering = 'optimizeSpeed';
                    }
                });
                resolve();
            }, 0); // setTimeout with 0 to allow task to run asynchronously
        });
    }
    async function findElementsWithCSSAsync() {
        const allElements = document.querySelectorAll('*');
        const chunkSize = 50; // Adjust based on performance needs
        for (let index = 0; index < allElements.length; index += chunkSize) {
            await processChunk(allElements, index, chunkSize);
        }
    }

    // Check if user is on MacOS or iOS to continue function execution
    if (navigator.platform.toLowerCase().includes('mac') || (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream)) {
        // Change CSS 'text-rendering' values for better speed
        findElementsWithCSSAsync();
        // Set an interval to check for & restyle hero heading element
        var checkExist = setInterval(function () {
            var heroHeading = document.querySelector('main .home-hero-heading-wrapper');
            // If the hero heading element exists, force-remove any applied filters
            if (heroHeading) {
                heroHeading.style.cssText = 'filter: none !important;';
                clearInterval(checkExist);
            }
        }, 500);
        // Ensure that the user is NOT on any mobile device
        if (window.innerWidth > 991) {
            // Ensure that DOMready has fired and jQuery is available
            onDocumentReady(function () {
                Defer(function () {
                    // Replace the navbar logo's SVG with new inline SVG code (i.e., stopping Lottie)
                    $('a>.navbar-logo-lottie').find('svg').replaceWith(`<svg xmlns="http://www.w3.org/2000/svg" width="3044" height="148" viewBox="0 0 3044 148" preserveAspectRatio="xMidYMid meet" fill="#FFF" style="width:100%!important;height:100%!important;transform:translate3d(0,0,0)!important;transition:none!important;animation:none 0s 1;content-visibility:visible;will-change:unset;shape-rendering:geometricprecision;"><path d="M376.7-.2h-50l-76.4 146.4h41.5l15.8-32.3h88.6l15.5 32.3h42L376.7-.2zm-57.1 89 30.7-63 1.4-3.4h.4l1.6 3.4 30.5 63h-64.6zm219.1 57.4v-119h68.8V-.2h-175v27.4h68.7v119h37.5zm185.1 0v-119h68.7V-.2h-175v27.4h68.7v119h37.6zm237.65-90.3h-106.9V-.2h-37.6v146.4h37.6V83.5h107v62.7h37.5V-.2h-37.6v56.1zm235.15 90.3v-27.4h-117.5V83.5h107.7V58.3H1079V27.2h116V-.2h-153.6v146.4h155.2zm113.1 0 38-109.6 1-3.3h.3l1 3.1 38.2 109.8h45.9l56-146.4h-39.9l-39.3 112.7-1.2 4.7h-.2l-1.4-4.9-40-112.5h-38.6l-39.7 112.5-1.4 5h-.4l-1.2-4.8L1247.4-.2h-39.5l55.9 146.4h45.9zm697.8 0v-27.4h-117.6V83.5h107.7V58.3H1890V27.2h116V-.2h-153.6v146.4h155.2-.1zm65.75 0V40.6l1 1 112.4 104.6h39.8V-.2h-35.9v106l-1.2-1.4-112-104.6h-39.8v146.4h35.7zm233.3 0V85.5h36.6l55.4 60.7h44.5l-68.5-74v-1.3l60.2-71.1h-44.7l-46.9 58.1h-36.6V-.2h-37.6v146.4h37.6zM2575.7-.2h-50l-76.4 146.4h41.5l15.8-32.3h88.6l15.5 32.3h42l-77-146.4zm-57.1 89 30.7-63 1.4-3.4h.4l1.6 3.4 30.5 63h-64.6zm297.75 57.4v-27.4h-103.1V-.2h-37.6v146.4h140.7zM2953.7-.2h-50l-76.4 146.4h41.5l15.8-32.3h88.6l15.6 32.3h41.9l-77-146.4zm-57.1 89 30.7-63 1.4-3.4h.4l1.6 3.4 30.5 63h-64.6zM1755.35-.2h-100.7v146.4h37.6v-44.3h63.4c45.7 0 69.7-20.7 69.7-52.5s-24.6-49.6-70-49.6zm1.5 65h-64.6V27.2h64.4c21.6 0 30.7 8.3 30.7 18.1 0 11.3-9 19.5-30.5 19.5zM37.05 146.2V43.3l-.2-2.5 1.2 2 59.9 80.8h32.3l59.8-80.9 1.2-2-.2 2.6v103h35.6V-.3h-44.6l-66.2 92.4-1.8 3-1.7-3L45.85-.2H1.35v146.4h35.7z"/></svg>`);
                    // Remove the enitre SVG parent if said element exists
                    (function () {
                        var targetElement = document.querySelector('#naturalShadowTitle');
                        if (targetElement && targetElement.parentNode.tagName.toLowerCase() === 'svg') {
                            targetElement.parentNode.remove();
                        }
                    }());
                    $("section[class*='home-awards']").remove();
                });
                // Remove the cursor blur and the cursor wrapper FX
                $('body div.cursor-wrapper').find('.cursor-blur').addBack().hide().remove();
                (function () {
                    var style = document.createElement('style');
                    style.textContent = `#PROJ-NAV .project-pagination-center *,#contact-form .form-input,.blur-button-text,.button-inner,.footer-left-grid .text-meta,.form-label:not(span),.home-about-matt-grid .text-meta:not(h2) span,.ms-clarity-embed:hover *,.post-author-grid .text-meta-small,.post-categories-item>.label-link,.post-preview-image-wrapper .clip>h2,.project-about-client-grid div>.text-meta,.projects-categories-item a>.label-inner *,.text-meta:not(.text-color-muted,.project-meta-item *),.text-rich-text,.text-size-medium.text-color-muted,.w-richtext *,[class*=ms-clarity]:not(div):hover,div.footer a>.nav-item-text:not(.disabled):hover,div.text-outline:not(.home-hero-heading,.explore-text,.explore-outline,.bolder),div>.home-testimonials-item-inner .text-color-muted:not(.text-meta),h3.heading-h6,input[type*=submit],nav .navbar-dropdown-grid-right-inner a>.nav-item-text:not(.disabled):hover{-webkit-font-smoothing:subpixel-antialiased!important;text-rendering:auto;}`;
                    document.head.appendChild(style);
                })();
                // Remove the gradient matte from the client logos element
                (function () {
                    const clientLogos = document.querySelector('#HOMEPAGE-CLIENTS > .home-clients-logos');
                    if (clientLogos) {
                        clientLogos.style.webkitMaskBoxImageSource = 'none';
                        clientLogos.style.maskType = 'unset';
                        clientLogos.style.mixBlendMode = 'normal';
                    }
                }());

            });
        }
        // Set an interval to check for & remove CF element ("corner-ribbon")
        var checkExist = setInterval(function () {
            var element = document.querySelector('[app*="corner-ribbon"]');
            if (element) {
                element.style.display = 'none';
                element.style.cssText = 'display: none !important;';
                element.remove();
                clearInterval(checkExist);
                document.getElementById("scroll-to-top")?.remove();
            }
        }, 500);
        // Remove all excess CSS effects from "project-pagination" element
        (function () {
            var style = document.createElement('style');
            style.textContent = `#PROJ-NAV{opacity:100%!important;filter:none!important;backdrop-filter:none!important;background:#014d90!important;} #svg-shadow-glow{animation-play-state:paused!important;}`;
            document.head.appendChild(style);
        })();
        onDocumentReady(function () {
            // Remove the marquee element if it exists, using optional chaining for safety
            document.getElementById("TOPBAR-MARQUEE")?.remove();
        });
    }

})();