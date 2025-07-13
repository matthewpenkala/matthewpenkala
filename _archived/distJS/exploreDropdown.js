if (window.innerWidth > 991) {
    var Webflow = Webflow || [];
    Webflow.push(function () {
        $(function () {
            // Configuration
            const DROPDOWN_LIST_SELECTOR = '#w-dropdown-list-0';
            const OPEN_CLASS = 'w--open';
            const ROTATION_DURATION = 250; // ms
            const RECHECK_DELAY = 500; // ms

            let isArrowOpen = false;

            // Elements
            const $hoverable = $("[class*='navbar-menu-item']")
                .filter(":contains('Explore')")
                .closest("[data-hover]")
                .find("*:not(path)");
            const $toggleElement = $hoverable.filter(".w-dropdown-toggle").first();
            const $arrowElement = $hoverable.find("svg").parent().first();
            const $dropdownList = $(DROPDOWN_LIST_SELECTOR);

            // Initialize arrow state
            $arrowElement.css("transform", "rotate(0deg)");

            // Easing Function
            const ease = t =>
                t < 0.5
                    ? 4 * t * t * t
                    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

            // Rotate arrow from one angle to another
            const rotateArrow = (el, duration, open) =>
                new Promise(resolve => {
                    const [startAngle, endAngle] = open ? [0, 180] : [180, 0];
                    const startTime = performance.now();

                    const animate = now => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const currentAngle =
                            startAngle + (endAngle - startAngle) * ease(progress);
                        el.style.transform = `rotate(${currentAngle}deg)`;
                        progress < 1 ? requestAnimationFrame(animate) : resolve();
                    };

                    requestAnimationFrame(animate);
                });

            const setArrowState = async open => {
                if (isArrowOpen !== open && $arrowElement.length) {
                    if (open) $toggleElement.addClass("w-hover");
                    else $toggleElement.removeClass("w-hover");
                    await rotateArrow($arrowElement[0], ROTATION_DURATION, open);
                    isArrowOpen = open;
                }
            };

            // Hover events
            $toggleElement
                .on('mouseenter', () => setArrowState(true))
                .on('mouseleave', () => {
                    // Do nothing on hover out; closing handled by observer
                });

            // Click event
            $toggleElement.on('click', () => setArrowState(true));

            // Observe dropdown class changes
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (
                        mutation.type === 'attributes' &&
                        mutation.attributeName === 'class'
                    ) {
                        const currentlyOpen = $dropdownList.hasClass(OPEN_CLASS);
                        if (!currentlyOpen && isArrowOpen) {
                            // Immediately close arrow
                            setArrowState(false);

                            // Re-check after a delay, ensuring it stays closed if still needed
                            setTimeout(() => {
                                if (
                                    !$dropdownList.hasClass(OPEN_CLASS) &&
                                    isArrowOpen
                                ) {
                                    setArrowState(false);
                                }
                            }, RECHECK_DELAY);
                        }
                    }
                });
            }).observe($dropdownList[0], { attributes: true });
        });
    });
}
