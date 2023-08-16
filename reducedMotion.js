// Cancel Webflow animations for users who prefer reduced motion
if (window.matchMedia("(prefers-reduced-motion)").matches) {
    const cancelAnimationsInterval = setInterval(function() {
        if (typeof Webflow == "undefined" || typeof Webflow.require == "undefined") {
            return;
        }

        clearInterval(cancelAnimationsInterval);

        // Get the interactions data from Webflow's state
        const interactionsData = Webflow.require('ix2').store.getState().ixData;
        // Filter out all non-click events from the interactions
        interactionsData.events = Object.fromEntries(
            Object.entries(interactionsData.events).filter(eventEntry => {
                return /^MOUSE_.*CLICK$/.test(eventEntry[1].eventTypeId);
            })
        );
        // Put the data in the format that Webflow expects it
        interactionsData.site = {
            mediaQueries: interactionsData.mediaQueries
        };

        // Stop Webflow's handling of animations
        Webflow.require("ix2").destroy();

        // Reset the inline styles for every element that has already been initialized
        const animatedElementsSelector = "[style*='will-change'], [style*='opacity: 0']";
        for (const animatedEl of document.querySelectorAll(animatedElementsSelector)) {
            animatedEl.style = "";
        }

        // Re-initialize Webflow interactions for click-related events only
        Webflow.require('ix2').init(interactionsData);
    }, 10);
}
