window.addEventListener('load', () => {
    function checkTrackerAndPlayer() {
        const variablesToCheck = ["BunnyStreamSessionTracker", "Plyr"];
        while (variablesToCheck.some(variable => typeof variable === 'undefined')) {
            setTimeout(checkTrackerAndPlayer, 100);
        }
        console.log('BunnyStreamSessionTracker and Plyr are now defined');
        if (!(typeof jQuery === 'undefined')) {
            console.log('jQuery is loaded and ready!');
            $(document).ready(function () {
                setTimeout(function () {
                    $('div.plyr__controls .plyr__controls__item>button[data-plyr=settings]').dblclick(function () {
                        $(this).attr('id', 'resolution-button');
                    });
                    let check = (e, m, t, c) => {
                            //(element, max, timeout, callback)
                            let i = +m, loop = () => {
                                    $(e).length ? c() : --i && setTimeout(() => {
                                        loop();
                                    }, t);
                                };
                            loop();
                        }, resFunc = () => {
                            console.log('QUALITY FOUND!');
                            var qualityMenu = $("div.plyr__controls__item div > div[id^='plyr-settings'][id$='quality']");
                            var autoQuality = $(qualityMenu).find('div[role=menu]').first().children("button[data-plyr=quality]:contains('Auto')").first();
                            let resMatch = $(autoQuality).find("span:contains('Auto (')").text().match(/\d+(?=p)/);
                            if ((resMatch && resMatch.length > 0) == true) {
                                resMatch = parseInt(resMatch[0]);
                                if (resMatch < 720) {
                                    console.log('BELOW 720p');
                                    $(qualityMenu).find("span:not(.plyr__badge):contains('720')").parent('button').prop('checked', true);
                                } else {
                                    console.log('720p or ABOVE');
                                }
                            } else {
                                console.log("Quality is NOT on 'Auto'");
                            }
                            $('.plyr__video-wrapper > video').on('play', function () {
                                setTimeout(() => {
                                    console.log("Back to 'Auto'");
                                    $(autoQuality).prop('checked', true);
                                }, 5000);
                            });
                        };
                    check($("button.plyr__control[data-plyr='settings'] > span:contains('Quality')"), 75, 250, resFunc);
                }, 2000);
            });
        }
    }
    checkTrackerAndPlayer();
});