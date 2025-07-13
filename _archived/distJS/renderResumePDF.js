(function () {
    const imageUrls = [];
    const backgroundImage = window.getComputedStyle(document.getElementById("pdf-container")).getPropertyValue("background-image");
    const regex = /url\("(https:\/\/.*?\.\w+)"/g;
    let match;

    // Extract image URLs from background image
    while ((match = regex.exec(backgroundImage)) !== null) {
        imageUrls.push(match[1]);
    }

    function preloadImages(urls, callback) {
        let loadedCount = 0;

        // Preload images
        urls.forEach(url => {
            const img = new Image();
            img.onload = img.onerror = function () {
                loadedCount++;
                if (loadedCount === urls.length) {
                    callback();
                }
            };
            img.src = url;
        });
    }

    // Preload images and execute code after all images are loaded
    preloadImages(imageUrls, function () {
        javascript:void(0)
    });
})();

const cachedResumeURL = "https://cache.matthewpenkala.com/MTP_RESUME_2024.pdf";

// Webflow initialization
var Webflow = Webflow || [];
Webflow.push(function () {
    // Function to round a number
    function roundNumber(number) {
        return Math.round(number);
    }

    const mobileDetect = new MobileDetect(window.navigator.userAgent);

    if (mobileDetect.mobile() || mobileDetect.phone() || 478 >= window.innerWidth) {
        if (mobileDetect.is("iPhone") || mobileDetect.is("iPod") || mobileDetect.is("iPad") || 991 >= window.innerWidth) {
            // Handle click event for specific devices or window width
            $("#OPEN-RESUME-HD, #OPEN-RESUME-FT").attr("href", "javascript:void(0)").click(function () {
                const newWindow = window.open("/RESUME.pdf", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100");
                newWindow.focus();
            });
        }
    } else if (mobileDetect.ua.toLowerCase().includes("applewebkit") && mobileDetect.ua.toLowerCase().includes("safari") && mobileDetect.ua.toLowerCase().includes("macintosh") && !mobileDetect.ua.toLowerCase().includes("chrome")) {
        // Handle click event for specific Safari browser
        $("#OPEN-RESUME-HD, #OPEN-RESUME-FT").find("*").addBack().css("cursor", "pointer").attr("href", "javascript:void(0)");
        document.querySelectorAll("#OPEN-RESUME-HD, #OPEN-RESUME-FT").forEach(element => {
            element.addEventListener("click", function () {
                window.open("/RESUME.pdf", "_blank");
            });
        });
    } else {
        // Handle other cases
        const containerWidth = `${roundNumber(1.02308 * (100 * parseFloat(17 / 11)))}vh`;
        const openResumeHD = document.getElementById("OPEN-RESUME-HD");
        const openResumeFT = document.getElementById("OPEN-RESUME-FT");
        const pdfContainer = document.getElementById("pdf-container");
        const pdfLightbox = document.getElementById("pdf-lightbox");

        // Init pdfjs web worker
        function waitForPdfjsLib() {
            if (typeof pdfjsLib !== 'undefined') {
                fetch("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js")
                    .then(response => response.blob())
                    .then(blob => {
                        var workerScript = URL.createObjectURL(blob);
                        pdfjsLib.GlobalWorkerOptions.workerSrc = workerScript;
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                setTimeout(waitForPdfjsLib, 50); // Check again after 50 milliseconds
            }
        }
        waitForPdfjsLib();

        // Click event for opening resume
        $(openResumeHD).add($(openResumeFT)).click(function () {
            // Manipulate PDF container and load PDF document
            $("#DOWNLOAD-RESUME").closest("div[class*='wrapper']").css("display", "none").children("div:not(a)").css("opacity", "0%");
            pdfContainer.innerHTML = "";
            $(pdfContainer).width(containerWidth).css({
                display: "block",
                position: "absolute",
                opacity: "100%"
            }).height("100vh");

            pdfjsLib.getDocument(cachedResumeURL).promise.then(function (pdf) {
                const promises = [];

                // Render pages of the PDF document
                for (let i = 1; i <= pdf.numPages; i++) {
                    const promise = pdf.getPage(i).then(function (page) {
                        // Manipulate PDF container, render pages, and handle scrolling
                        bodyScrollLock.disableBodyScroll("#pdf-lightbox");
                        bodyScrollLock.disableBodyScroll("#pdf-container");

                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        const viewport = page.getViewport({
                            scale: 1
                        });

                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        pdfContainer.appendChild(canvas);

                        return page.render({
                            canvasContext: context,
                            viewport: viewport
                        }).promise;
                    });

                    promises.push(promise);
                }

                // Handle actions after all pages are rendered
                Promise.all(promises).then(function () {
                    $("#DOWNLOAD-RESUME").closest("div[class*='wrapper']").css("display", "").children("div:not(a)").fadeOut("fast", function () {
                        $(this).css("opacity", "").fadeIn().css("opacity", "");
                    });
                    $(pdfContainer).css({width: "", display: "", position: "", opacity: "", height: ""});
                    $("div.certifications").closest("[class*='wrapper']").fadeOut();

                    pdfLightbox.style.display = "flex";
                }).catch(function () {
                    window.open("/RESUME.pdf", "_blank").focus();
                });
            }).catch(function () {
                window.open("/RESUME.pdf", "_blank").focus();
            });
            pdfLightbox.style.display = "flex";
            $("div.certifications").closest("[class*='wrapper']").fadeOut();
        });

        // Fetch and store the PDF in browser cache
        $.get(cachedResumeURL);
    }
});
