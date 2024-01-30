// Define a throttle function to limit the rate at which a function can fire.
function throttle(func, delay) {
    let timeoutId; // Declare a variable for storing the timeout.
    let lastExecTime = 0; // Store the last execution time of the function.

    // Return a throttled version of the passed function.
    return function () {
        const context = this; // Preserve 'this' context from the original call.
        const args = arguments; // Preserve arguments passed to the function.

        if (timeoutId) {
            clearTimeout(timeoutId); // Clear the previous timeout if it exists.
        }

        const elapsedTime = Date.now() - lastExecTime; // Calculate elapsed time since last execution.

        if (elapsedTime >= delay) {
            // If the elapsed time is greater than or equal to the delay, execute the function.
            func.apply(context, args);
            lastExecTime = Date.now(); // Update the last execution time.
        } else {
            // Otherwise, set a new timeout to execute the function after the remaining delay.
            timeoutId = setTimeout(function () {
                func.apply(context, args);
                lastExecTime = Date.now(); // Update the last execution time when the function is actually executed.
            }, delay - elapsedTime);
        }
    };
}


// IIFE to reset the scrollLeft property of all elements.
(function () {
    document.querySelectorAll("*").forEach(function (element) {
        element.scrollLeft = 0; // Set the scrollLeft property to 0 for each element.
    });
})();

// Utilize jQuery to reset the scrollLeft property for all elements upon document ready.
$(document).ready(function () {
    $("*").scrollLeft(0); // Reset scroll position for all elements.

    // Apply a throttled scroll event listener to the document.
    $(document).on("scroll", throttle(function () {
        $(this).scrollLeft(0); // Reset scroll position on scroll event.

        // Set a timeout to further ensure the scrollLeft property is reset.
        setTimeout(function () {
            $("html:root").add(".body,body").scrollLeft(0); // Reset scroll position for specific elements.
        }, 250); // Timeout delay of 250ms.
    }, 75)); // Throttle delay of 75ms to limit scroll event handling.
});
