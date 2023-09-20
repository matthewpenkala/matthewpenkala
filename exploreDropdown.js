var Webflow = Webflow || [];
Webflow.push(function () {
    let shouldContinueAnimation = true;
    Defer(function () {
        setTimeout(() => {
            const navExplore = $("[class*='navbar-menu-item']").deepest('*:not(path)').filter("*:contains('Explore')").closest('[data-hover]').contents('div:not(nav)').find('*:not(path)').addBack();
            function animateRotation(a, b, isHoverIn) {
                const c = t => 0.5 > t ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                return new Promise(resolve => {
                    function animate(g) {
                        if (!shouldContinueAnimation) {
                            resolve();
                            return;
                        }
                        const elapsed = g - startTime;
                        const progress = Math.min(elapsed / b, 1);
                        const easingProgress = isHoverIn ? c(progress) : 1 - c(progress);
                        a.style.transform = 'rotate(' + (isHoverIn ? -180 * easingProgress : 180 * easingProgress) + 'deg)';
                        if (elapsed < b && shouldContinueAnimation) {
                            requestAnimationFrame(animate);
                        } else {
                            resolve();
                        }
                    }
                    const startTime = performance.now();
                    requestAnimationFrame(animate);
                });
            }
            const dropdownToggle = $(navExplore).filter('.w-dropdown-toggle').closest('[data-hover]').get(0);
            const wfTriggerElement = $(dropdownToggle).find('div.navbar-menu-item-inner').get(0);
            const arrowIcon = $(navExplore).filter('svg').parent('div').get(0);
            function triggerHover() {
                if (wfTriggerElement) {
                    wfTriggerElement.classList.add('w-hover');
                    const event = new MouseEvent('mouseover', {
                        view: window,
                        bubbles: false,
                        cancelable: true
                    });
                    wfTriggerElement.dispatchEvent(event);
                }
            }
            $(dropdownToggle).hover(function () {
                triggerHover();
                animateRotation(arrowIcon, 250, true).then(() => {
                    $(dropdownToggle).contents('div,nav').addClass('w--open');
                    $(this).click(function () {
                        $(wfTriggerElement).removeClass('w-hover');
                        animateRotation(arrowIcon, 250, false).then(() => {
                            shouldContinueAnimation = true;
                        });
                        $(dropdownToggle).click(function () {
                            animateRotation(arrowIcon, 250, true).then(() => {
                                shouldContinueAnimation = true;
                            });
                        });
                    });
                });
            }, function () {
                $(wfTriggerElement).removeClass('w-hover');
                animateRotation(arrowIcon, 250, false).then(() => {
                    shouldContinueAnimation = true;
                    setTimeout(() => {
                        $(arrowIcon).removeAttr('style').css('will-change', 'transform');
                        $(dropdownToggle).contents('div,nav').removeClass('w--open');
                    }, 100);
                });
            });
        }, 1000);
    });
});