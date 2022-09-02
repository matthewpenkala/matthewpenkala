var $closestSharedAncestor, ancestorsArray, longestAncestorBranch, ancestorsArrayLength, ancestorDiffers, i, j;
for ($els = $("*").not("html").find("*").addBack().not("head, script").filter("div"), ancestorsArray = [], longestAncestorBranch = 0, $els.each(function () {
        var t = $(this).parents(),
            e = t.length;
        longestAncestorBranch < e && (longestAncestorBranch = e), ancestorsArray.push(t.get().reverse())
    }), ancestorsArrayLength = ancestorsArray.length, $closestSharedAncestor = ancestorsArray[0][0], ancestorDiffers = !1, i = 0; i < longestAncestorBranch; i++) {
    for (j = 0; j < ancestorsArrayLength - 1; j++)
        if (ancestorsArray[j][i] !== ancestorsArray[j + 1][i]) {
            ancestorDiffers = !0;
            break
        } if (ancestorDiffers) break;
    $closestSharedAncestor = ancestorsArray[0][i]
}
var articleHeroIMG = $("div.container.blog-middle>div:not(.blog-title-container)>img").first().get(0),
    articleTitleH2 = $("div.section").find("div.blog-details > div[class*='richtext']").contents("h1, h2").first().get(0);

function isAnyPartOfElementInViewport(t) {
    var e = (t = t.getBoundingClientRect()).left <= (window.innerWidth || document.documentElement.clientWidth) && 0 <= t.left + t.width;
    return t.top <= (window.innerHeight || document.documentElement.clientHeight) && 0 <= t.top + t.height && e
}

function isElementInViewport(t) {
    return 0 <= (t = t.getBoundingClientRect()).top && 0 <= t.left && t.bottom <= (window.innerHeight || document.documentElement.clientHeight) && t.right <= (window.innerWidth || document.documentElement.clientWidth)
}
var articleEndSUGG = $(".blog-collection-grid>[role|=listitem]>a[href*=post]>div").filter("[class*='insight'][class*='container']"),
    txtDetailsSUGG = $(articleEndSUGG).filter("[class*=details]:not(.insight-image-container)").children("*").addBack().get(0),
    imgThumbnailSUGG = $(articleEndSUGG).filter("[class*=image]:not(.insight-details-container)").find("img[class^='blog-item']").get(0),
    Webflow = Webflow || [];
Webflow.push(function () {
    $("*>div>div.blog-details>div[class*=richtext], h1").find("*:not(div)").addBack().not("img,video,svg").add(articleTitleH2).css("text-rendering", "optimizeLegibility"), $("*[data-wf-domain]>body").css("will-change", "background, background-position, background-origin").not("head").contents("div.wrapper").css("will-change", "auto").addBack().not("style,script").not("body,div").add("*:root,html").css("will-change", "filter").add("div.footer-section>div.heading-title-container").filter("div").css("will-change", "scroll-position").add("head>link[type*=icon]").filter("link").css("will-change", "contents"), $(document).ready(function () {
        try {
            $($closestSharedAncestor = $($closestSharedAncestor)).contents("div.wrapper").attr("id", "below-body")
        } catch (t) {
            setTimeout(() => {
                $("*:root").add("body").css("filter", "unset").filter("html").css("filter", "")
            }, 1e3)
        } finally {
            setTimeout(() => {
                $("html").contents("*").addBack().not(document).filter("body").append($.parseHTML('<svg xmlns="http://www.w3.org/2000/svg" style="position: fixed;"><filter id="lighter-bg"><feColorMatrix type="saturate" values="0"></feColorMatrix><feComponentTransfer color-interpolation-filters="sRGB"><feFuncR type="table" tableValues="' + lightBG_tableValues + '"/><feFuncG type="table" tableValues="' + lightBG_tableValues + '"/><feFuncB type="table" tableValues="' + lightBG_tableValues + '"/></feComponentTransfer></filter></svg>'))
            }, 500)
        }
    })
}), d = function (e) {
    function t(t) {
        return e.apply(this, arguments)
    }
    return t.toString = function () {
        return e.toString()
    }, t
}(function (t) {
    for (a = e = {}, d = t.split(""), c = f = d[0], g = [c], h = o = 256, t = 1; t < d.length; t++) a = d[t].charCodeAt(0), a = h > a ? d[t] : e[a] || f + c, g.push(a), c = a.charAt(0), e[o] = f + c, o++, f = a;
    return g.join("")
});
const lightBG_tableValues = d(".07,ĀĂĄăāćąĈĆČċĎĊ8ć9ă1Ĕĕ.12Ĕ3Ĕ4Ĕ5Ĕ6Ĕą1đĘē.Ěĩė2Ī2ĜĩĞĩĠĳă2Ģĩą2Ħ2Ĩİ3ė3Ī3ĿĲ3Ĵ3ĸ3ą3Ħ3ĨĲ4ė4Ī4İ4őőĴ4ĸ4ą4Ħ4ĨĴ5Ī5İ5Ĳ5ĸ5ą5Ĩĸ6Ī6İ6Ĳ6űą6Ĩą7Ī7İ7Ĳ7ĸ7ŽĨĦ8Ī8İ8Ĳ8ĸ8ą8Ĩƕė9İ9Ĳ9ĸ9ą9ēĕƢ,ƣƥƤƤ");


$(window).scroll(function () {
    if ((10 - ($(window).scrollTop() + 1)) == 9) {
        $('#below-body:not(body)').filter('div').css('filter', 'unset');
        $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', '');
    } else if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
        $('#below-body:not(body)').filter('div').css('filter', 'unset');
        $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', '');
    }
});

$(window).on('DOMContentLoaded load resize scroll', function () {
    if (isAnyPartOfElementInViewport(articleHeroIMG) == false) {
        if (isElementInViewport(articleTitleH2) == true) {
            $('#below-body:not(body)').filter('div').css('filter', 'blur(0.1px) brightness(0.9) saturate(0.9) contrast(1.2)');
            $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', 'url(#lighter-bg) blur(0.1px)');
        } else if (isAnyPartOfElementInViewport(txtDetailsSUGG) == true || isAnyPartOfElementInViewport($('div.footer-section').not('*.section').get(0)) == true || isElementInViewport(imgThumbnailSUGG) == true) {
            $('#below-body:not(body)').filter('div').css('filter', 'unset');
            $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', '');
        }
    } else if ((isAnyPartOfElementInViewport(articleTitleH2) == true) || isElementInViewport(articleHeroIMG) == true) {
        $('#below-body:not(body)').filter('div').css('filter', 'unset');
        $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', '');
    }
    if (isAnyPartOfElementInViewport($("div.heading-container h3").get(0)) == true) {
        if ($("div.heading-container h3").filter("*:contains('Read more...')").offset().top < ($(window).scrollTop() + ($(window).height() / 1.5))) {
            $('#below-body:not(body)').filter('div').css('filter', 'unset');
            $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', '');
        } else {
            $('#below-body:not(body)').filter('div').css('filter', 'blur(0.1px) brightness(0.9) saturate(0.9) contrast(1.2)');
            $('*:root').not('body').add('html').not('div.wrapper').first().css('filter', 'url(#lighter-bg) blur(0.1px)');
        }
        
    }
});