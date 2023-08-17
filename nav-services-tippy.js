var waitForGlobal = function(key, callback) {
    if (window[key]) {
        callback();
    } else {
        setTimeout(function() {
            waitForGlobal(key, callback);
        }, 100);
    }
};
function loadScript(t, o) {
    var a = document.createElement('script');
    a.type = 'text/javascript', a.src = t, a.onload = o, document.head.appendChild(a);
}
if (!(window.innerWidth >= 768 && window.innerWidth <= 972 || window.innerWidth < 768)) {
    loadScript('https://unpkg.com/@popperjs/core@2', function() {
        loadScript('https://unpkg.com/tippy.js@6', function() {
            waitForGlobal('tippy', function() {
                tippy('#NAV-SERVICES > div', {
                    content: 'Finalizing development!',
                    allowHTML: false,
                    placement: 'bottom',
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
        $(".navbar-dropdown-column a[href*='/services']").click(false).css({
            'pointer-events': 'none',
            'cursor': 'not-allowed'
        }).children('div').css({
            'pointer-events': 'auto',
            'cursor': 'not-allowed'
        }).parent('*').find('.nav-item-line').css({
            'pointer-events': 'none',
            'opacity': '0%',
            'display': 'none'
        }).closest(".navbar-dropdown-column a[href*='/services']").bind('contextmenu', function(e) {
            return false;
        });
    });
}
