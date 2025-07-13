var waitForGlobal = function(key, callback) {
    if (window[key]) {
        callback();
    } else {
        setTimeout(function() {
            waitForGlobal(key, callback);
        }, 100);
    }
};

function loadScript(a,b){var c=document.createElement("script");c.type="text/javascript",c.src=a,c.onload=b,document.head.appendChild(c)}

function navServicesTippy() {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.8/umd/popper.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/tippy.js/6.3.7/tippy-bundle.umd.min.js', function() {
            waitForGlobal('tippy', function() {
                tippy('#NAV-SERVICES > div', {
                    content: 'Finalizing development!',
                    allowHTML: false,
                    placement: 'bottom',
                    hideOnClick: false
                });
                tippy("div.footer .nav > a[href*='/services'] > div:not(.nav-item-line)", {
                    content: 'Finalizing development!',
                    allowHTML: false,
                    placement: 'right',
                    hideOnClick: false
                });
                tippy(".navbar-dropdown-column a[href*='/services'] > div", {
                    content: '<span id="services-right-tippy" style="text-shadow:0 0 10px rgb(0 0 0/50%);color:#E1E1E1;">Finalizing development!</span>',
                    allowHTML: true,
                    placement: 'right',
                    hideOnClick: false,
                    onTrigger(instance, event) {
                        setTimeout(() => {
                            $("div[id^='tippy']").find('*').filter(function() {
                                var n = $(this);
                                return n.is('#services-right-tippy') || n.is('span') && /finalizing development/i.test(n.text());
                            }).closest('.tippy-box').css('background-color', '#292929').find('.tippy-arrow').addBack().css('color', '#292929'), $('#services-right-tippy').closest('.tippy-box').css({
                                'transition-property': 'transform, all',
                                'transition-duration': '0ms, 300ms',
                                'transition-timing-function': 'linear, ease'
                            }).css('transform', 'translateX(5px)');
                        }, 9);
                    }
                });
            });
        });
    });

    $(document).ready(function() {
        $(".navbar-dropdown-column a[href*='/services'],div.footer .nav>a[href*='/services']").closest('.nav').addBack().parent('div').addBack().add($('header').closest("div[class*='wrapper']").find('.navbar-menu').parent('div').addBack().add('#NAV-SERVICES')).each(function() {
            var $element = $(this);
            $element.on('click', function(event) {
                var navServicesElm = $($element).parent().find('*').addBack().filter("a[href*='/services'],#NAV-SERVICES").first();
                function shakeAndRemoveClass() {
                    $(navServicesElm).addClass('error-shake');
                    setTimeout(function() {
                        $(navServicesElm).removeClass('error-shake');
                    }, 1000);
                }
                var rect = navServicesElm[0].getBoundingClientRect();
                var mouseX = event.clientX;
                var mouseY = event.clientY;
                if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                    shakeAndRemoveClass();
                }
            });
        });

        $('#NAV-SERVICES').click(false).css({
            'pointer-events': 'none',
            'cursor': 'not-allowed'
        }).children('div').css({
            'pointer-events': 'auto',
            'cursor': 'not-allowed'
        }).parent('*').find('.navbar-menu-item-line').css({
            'pointer-events': 'none',
            'opacity': '0%',
            'display': 'none'
        }).closest('#NAV-SERVICES').bind('contextmenu', function(e) {
            return false;
        });
        $(".navbar-dropdown-column a[href*='/services']").add("div.footer .nav > a[href*='/services']").click(false).css({
            'pointer-events': 'none',
            'cursor': 'not-allowed'
        }).children('div').css({
            'pointer-events': 'auto',
            'cursor': 'not-allowed'
        }).parent('*').find('.nav-item-line').css({
            'pointer-events': 'none',
            'opacity': '0%',
            'display': 'none'
        }).closest("a[href*='/services']").bind('contextmenu', function(e) {
            return false;
        });
    });
}

(function() {
    if (!(window.innerWidth >= 768 && window.innerWidth <= 972 || window.innerWidth < 768)) {
        navServicesTippy();
    }
    $(window).on('resize', function() {
        if (!(window.innerWidth >= 768 && window.innerWidth <= 972 || window.innerWidth < 768)) {
            navServicesTippy();
        }
    });
}());
