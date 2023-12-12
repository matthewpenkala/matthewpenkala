(function () {
    const assetUrls = [];
    const regex = /url\("(https:\/\/.*?\.\w+)"/g;
    const match = window.getComputedStyle(document.getElementById('pdf-container')).getPropertyValue('background-image').matchAll(regex);
    for (const m of match) {
        assetUrls.push(m[1]);
    }
    function preloadAssets(assetUrls, callback) {
        let loadedCount = 0;
        assetUrls.forEach(url => {
            const image = new Image();
            image.onload = image.onerror = function () {
                loadedCount++;
                if (loadedCount === assetUrls.length) {
                    callback();
                }
            };
            image.src = url;
        });
    }
    preloadAssets(assetUrls, function () {
        console.log(assetUrls);
    });
}());

var Webflow = Webflow || [];
Webflow.push(function () {
    function round(number) {
        return Math.round(number);
    }

    const mobileDetect = new MobileDetect(window.navigator.userAgent);

    if (mobileDetect.mobile() || mobileDetect.phone() || 478 >= window.innerWidth) {
        if (mobileDetect.is("iPhone") || mobileDetect.is("iPod") || mobileDetect.is("iPad") || 991 >= window.innerWidth) {
            $("#OPEN-RESUME-HD, #OPEN-RESUME-FT").attr("href", "javascript:void(0)").click(function () {
                const newWindow = window.open("/RESUME.pdf", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100");
                newWindow.focus();
            });
        }
    } else if (mobileDetect.ua.toLowerCase().includes("applewebkit") && mobileDetect.ua.toLowerCase().includes("safari") && mobileDetect.ua.toLowerCase().includes("macintosh") && !mobileDetect.ua.toLowerCase().includes("chrome")) {
		$("#OPEN-RESUME-HD, #OPEN-RESUME-FT").find("*").addBack().css("cursor","pointer").filter("a").attr("href", "javascript:void(0)").click(function () {
            const newWindow = window.open("/RESUME.pdf", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=100");
            newWindow.focus();
        });
    } else {
        const containerWidth = `${round(1.02308 * (100 * parseFloat(17 / 11)))}vh`;
        const openResumeHD = document.getElementById("OPEN-RESUME-HD");
        const openResumeFT = document.getElementById("OPEN-RESUME-FT");
        const pdfContainer = document.getElementById("pdf-container");
        const pdfLightbox = document.getElementById("pdf-lightbox");

        $(openResumeHD).add($(openResumeFT)).click(function () {
            $("#DOWNLOAD-RESUME").closest("div[class*='wrapper']").css("display", "none").children("div:not(a)").css("opacity", "0%");
            pdfContainer.innerHTML = "";
            $(pdfContainer).width(containerWidth).css({
                display: "block",
                position: "absolute",
                opacity: "100%"
            }).height("100vh");

            pdfjsLib.getDocument("https://cache.matthewpenkala.com/MTP_RESUME_2024.pdf").promise.then(function (pdf) {
                const pagePromises = [];

                for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                    const pagePromise = pdf.getPage(pageNumber).then(function (page) {
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

                    pagePromises.push(pagePromise);
                }

                Promise.all(pagePromises).then(function () {
                    $("#DOWNLOAD-RESUME").closest("div[class*='wrapper']").css("display", "").children("div:not(a)").fadeOut("fast", function () {
                        $(this).css("opacity", "").fadeIn().css("opacity", "");
                    });

                    $(pdfContainer).css({
                        width: "",
                        display: "",
                        position: "",
                        opacity: "",
                        height: ""
                    });

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
    }
});
