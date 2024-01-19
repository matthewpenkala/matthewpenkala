(function () {
    /********************************************************************
     ************************** MAIN VARIABLES ***************************
     *********************************************************************/
    const youtube = document.querySelectorAll('.yt-lazyload');
    const settings_observer_rootMargin = '200px 0px'; //Intersection Observer API option - rootMargin (Y, X)
    const settings_thumb_base_url = 'https://i.ytimg.com/vi/'; //Base URL where thumbnails are stored
    const settings_thumb_extension = 'jpg'; //Thumbnail extension

    /********************************************************************
     ************************ IF ELEMENTS EXIST **************************
     *********************************************************************/
    if (youtube.length > 0) {
        /********************************************************************
         ********************* INTERSECTION OBSERVER API *********************
         *********************************************************************/
        const youtube_observer = new IntersectionObserver((elements) => {
            elements.forEach((e) => {
                //VARIABLES
                const this_element = e.target;
                const this_data_id = this_element.dataset.id;
                const this_data_thumb = this_element.dataset.thumb;
                const this_data_logo = this_element.dataset.logo;

                //if element appears in viewport
                if (e.isIntersecting === true) {
                    //create elements
                    const template_wrap = document.createElement('div');
                    const template_content = document.createElement('div');
                    const template_playbtn = document.createElement('div');
                    const template_logo = document.createElement('a');
                    const template_iframe = document.createElement('iframe');

                    //set attributes
                    template_wrap.classList.add('yt-lazyload-wrap');
                    template_content.classList.add('yt-lazyload-content');
                    template_playbtn.classList.add('yt-lazyload-playbtn');
                    template_logo.classList.add('yt-lazyload-logo');
                    template_logo.target = '_blank';
                    template_logo.rel = 'noreferrer';
                    template_iframe.setAttribute('allow', 'accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture');
                    template_iframe.setAttribute('allowfullscreen', '');

                    //wrap
                    const this_wrap = template_wrap.cloneNode();
                    this_element.append(this_wrap);

                    //content
                    const this_content = template_content.cloneNode();
                    this_wrap.append(this_content);

                    //background-image
                    this_content.style.setProperty('--yt-lazyload-img', `url("${settings_thumb_base_url}${this_data_thumb}.${settings_thumb_extension}")`);

                    //play btn
                    const this_playbtn = template_playbtn.cloneNode();
                    this_content.append(this_playbtn);

                    //logo link
                    if (this_data_logo !== '0') {
                        const urlYT = `https://penka.la/?GO=${encodeURIComponent(`https://youtu.be/${this_data_id}`)}`;

                        // Create the anchor element
                        const anchorElement = document.createElement('a');
                        anchorElement.target = '_blank';
                        anchorElement.href = urlYT.toString();
                        anchorElement.rel = 'external';
                        anchorElement.style.cssText = 'z-index:2;pointer-events:all;aspect-ratio:43/13;object-fit:cover;display:block;position:absolute;top:auto;bottom:0;left:0;right:auto;overflow:visible;cursor:alias;';
						anchorElement.setAttribute("onclick", "var otherWindow = window.open(); otherWindow.opener = null; otherWindow.location = this.href; return false;");

                        // Create the image element
                        const imgElement = document.createElement('img');
                        imgElement.src = 'https://cache.' + location.host + '/assets/watch-on-yt_gfx.png';
                        imgElement.height = '52';
                        imgElement.alt = 'Watch on YouTube [EXT.]';

                        // Append the image element to the anchor element
                        anchorElement.appendChild(imgElement);

                        // Append the anchor element to the body
                        this_content.appendChild(anchorElement);

                        const this_logo = template_logo.cloneNode();
                        this_logo.href = urlYT.toString();
						this_logo.rel = 'external';
						this_logo.setAttribute("onclick", "var otherWindow = window.open(); otherWindow.opener = null; otherWindow.location = this.href; return false;");
                        this_content.append(this_logo);
                    }

                    //onclick create iframe
                    this_playbtn.addEventListener('click', () => {
                        this_playbtn.parentElement.querySelectorAll('*:not(iframe)').forEach((childElement) => {
                            childElement.style.opacity = '0%';
                            childElement.remove();
                        });
                        (function () {
                            const styleElement = document.createElement('style');
                            styleElement.id = 'tempPlayerCSS';
                            styleElement.innerHTML = '.yt-lazyload-content a:not(iframe),a.yt-lazyload-logo,a[href*="penka.la"]:not([href*=visit]){opacity:0!important;display:none!important;overflow:hidden!important;pointer-events:none!important;cursor:default!important;}';
                            document.body.appendChild(styleElement);
                        }());

                        const this_iframe = template_iframe.cloneNode();
                        this_iframe.src = `https://www.youtube.com/embed/${this_data_id}?autoplay=1`;
                        this_content.append(this_iframe);

                        setTimeout(() => {
                            const tempStyleElement = document.getElementById('tempPlayerCSS');
                            if (tempStyleElement) {
                                tempStyleElement.parentNode.removeChild(tempStyleElement);
                            }
                        }, 2000);
                    });

                    //Unobserve after image lazyloaded
                    youtube_observer.unobserve(this_element);

                    //LOG
                    //console.log('DONE - ' + this_data_id);
                }
            });
        }, {
            rootMargin: settings_observer_rootMargin,
        });

        /********************************************************************
         ********************* ITERATE THROUGH ELEMENTS **********************
         *********************************************************************/
        youtube.forEach((e) => {
            //Intersection Observer API - observe elements
            youtube_observer.observe(e);
        });
    }
})();