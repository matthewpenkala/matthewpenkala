var e=function(a,b){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,b){a.__proto__=b}||function(a,b){for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c])},e(a,b)};function n(b,c,d,f){return new(d||(d=Promise))(function(g,e){function h(a){try{i(f.next(a))}catch(a){e(a)}}function a(a){try{i(f.throw(a))}catch(a){e(a)}}function i(b){var c;b.done?g(b.value):(c=b.value,c instanceof d?c:new d(function(a){a(c)})).then(h,a)}i((f=f.apply(b,c||[])).next())})}function t(b,c){function d(a){return function(d){return function(a){if(e)throw new TypeError("Generator is already executing.");for(;h&&(h=0,a[0]&&(j=0)),j;)try{if(e=1,f&&(g=2&a[0]?f.return:a[0]?f.throw||((g=f.return)&&g.call(f),0):f.next)&&!(g=g.call(f,a[1])).done)return g;switch(f=0,g&&(a=[2&a[0],g.value]),a[0]){case 0:case 1:g=a;break;case 4:return j.label++,{value:a[1],done:!1};case 5:j.label++,f=a[1],a=[0];continue;case 7:a=j.ops.pop(),j.trys.pop();continue;default:if(g=j.trys,!((g=0<g.length&&g[g.length-1])||6!==a[0]&&2!==a[0])){j=0;continue}if(3===a[0]&&(!g||a[1]>g[0]&&a[1]<g[3])){j.label=a[1];break}if(6===a[0]&&j.label<g[1]){j.label=g[1],g=a;break}if(g&&j.label<g[2]){j.label=g[2],j.ops.push(a);break}g[2]&&j.ops.pop(),j.trys.pop();continue;}a=c.call(b,j)}catch(b){a=[6,b],f=0}finally{e=g=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,d])}}var e,f,g,h,j={label:0,sent:function(){if(1&g[0])throw g[1];return g[1]},trys:[],ops:[]};return h={next:d(0),throw:d(1),return:d(2)},"function"==typeof Symbol&&(h[Symbol.iterator]=function(){return this}),h}function r(a,b,c){if(c||2===arguments.length)for(var d,e=0,f=b.length;e<f;e++)!d&&e in b||(d||(d=Array.prototype.slice.call(b,0,e)),d[e]=b[e]);return a.concat(d||Array.prototype.slice.call(b))}var i={Awesomium:"awesomium",Cef:"cef",CefSharp:"cefsharp",CoachJS:"coachjs",Electron:"electron",FMiner:"fminer",Geb:"geb",NightmareJS:"nightmarejs",Phantomas:"phantomas",PhantomJS:"phantomjs",Rhino:"rhino",Selenium:"selenium",Sequentum:"sequentum",SlimerJS:"slimerjs",WebDriverIO:"webdriverio",WebDriver:"webdriver",HeadlessChrome:"headless_chrome",Unknown:"unknown"},o=function(a){function b(c,d){var e=a.call(this,d)||this;return e.state=c,e.name="BotdError",Object.setPrototypeOf(e,b.prototype),e}return function(a,b){function c(){this.constructor=a}if("function"!=typeof b&&null!==b)throw new TypeError("Class extends value "+(b+"")+" is not a constructor or null");e(a,b),a.prototype=null===b?Object.create(b):(c.prototype=b.prototype,new c)}(b,a),b}(Error);function a(b,c){var d={},e={bot:!1};for(var f in c){var g=(0,c[f])(b),a={bot:!1};"string"==typeof g?a={bot:!0,botKind:g}:g&&(a={bot:!0,botKind:i.Unknown}),d[f]=a,a.bot&&(e=a)}return[d,e]}function u(b){return n(this,void 0,void 0,function(){var d,c,e=this;return t(this,function(a){switch(a.label){case 0:return d={},c=Object.keys(b),[4,Promise.all(c.map(function(f){return n(e,void 0,void 0,function(){var e,g,h,i,j;return t(this,function(a){switch(a.label){case 0:e=b[f],a.label=1;case 1:return a.trys.push([1,3,,4]),g=d,h=f,j={},[4,e()];case 2:return g[h]=(j.value=a.sent(),j.state=0,j),[3,4];case 3:return i=a.sent(),d[f]=i instanceof o?{state:i.state,error:"".concat(i.name,": ").concat(i.message)}:{state:-3,error:i instanceof Error?"".concat(i.name,": ").concat(i.message):i+""},[3,4];case 4:return[2];}})})}))];case 1:return a.sent(),[2,d];}})})}function s(a,b){return-1!==a.indexOf(b)}function c(a,b){return-1!==a.indexOf(b)}function d(a,b){if("find"in a)return a.find(b);for(var c=0;c<a.length;c++)if(b(a[c],c,a))return a[c]}function l(a){return Object.getOwnPropertyNames(a)}function f(b){for(var c=[],e=1;e<arguments.length;e++)c[e-1]=arguments[e];for(var f=function(a){if("string"==typeof a){if(s(b,a))return{value:!0};}else if(null!=d(b,function(b){return a.test(b)}))return{value:!0}},g=0,h=c;g<h.length;g++){var j=h[g],a=f(j);if("object"==typeof a)return a.value}return!1}function v(a){return a.reduce(function(a,b){return a+(b?1:0)},0)}var w={detectAppVersion:function(a){var b=a.appVersion;return 0===b.state&&(/headless/i.test(b.value)?i.HeadlessChrome:/electron/i.test(b.value)?i.Electron:/slimerjs/i.test(b.value)?i.SlimerJS:void 0)},detectDocumentAttributes:function(a){var b=a.documentElementKeys;return 0===b.state&&(f(b.value,"selenium","webdriver","driver")?i.Selenium:void 0)},detectErrorTrace:function(a){var b=a.errorTrace;return 0===b.state&&(/PhantomJS/i.test(b.value)?i.PhantomJS:void 0)},detectEvalLengthInconsistency:function(a){var b=a.evalLength,c=a.browserKind,d=a.browserEngineKind;if(0===b.state&&0===c.state&&0===d.state){var e=b.value;return"unknown"!==d.value&&(37===e&&!s(["webkit","gecko"],d.value)||39===e&&!s(["internet_explorer"],c.value)||33===e&&!s(["chromium"],d.value))}},detectFunctionBind:function(a){if(-2===a.functionBind.state)return i.PhantomJS},detectLanguagesLengthInconsistency:function(a){var b=a.languages;if(0===b.state&&0===b.value.length)return i.HeadlessChrome},detectNotificationPermissions:function(a){var b=a.notificationPermissions,c=a.browserKind;return 0===c.state&&"chrome"===c.value&&(0===b.state&&b.value?i.HeadlessChrome:void 0)},detectPluginsArray:function(a){var b=a.pluginsArray;if(0===b.state&&!b.value)return i.HeadlessChrome},detectPluginsLengthInconsistency:function(a){var b=a.pluginsLength,c=a.android,d=a.browserKind,e=a.browserEngineKind;if(0===b.state&&0===c.state&&0===d.state&&0===e.state&&"chrome"===d.value&&!c.value&&"chromium"===e.value)return 0===b.value?i.HeadlessChrome:void 0},detectProcess:function(a){var b,c=a.process;return 0===c.state&&("renderer"===c.value.type||null!=(null===(b=c.value.versions)||void 0===b?void 0:b.electron)?i.Electron:void 0)},detectUserAgent:function(a){var b=a.userAgent;return 0===b.state&&(/PhantomJS/i.test(b.value)?i.PhantomJS:/Headless/i.test(b.value)?i.HeadlessChrome:/Electron/i.test(b.value)?i.Electron:/slimerjs/i.test(b.value)?i.SlimerJS:void 0)},detectWebDriver:function(a){var b=a.webDriver;if(0===b.state&&b.value)return i.HeadlessChrome},detectWebGL:function(a){var b=a.webGL;if(0===b.state){var c=b.value,d=c.vendor,e=c.renderer;if("Brian Paul"==d&&"Mesa OffScreen"==e)return i.HeadlessChrome}},detectWindowExternal:function(a){var b=a.windowExternal;return 0===b.state&&(/Sequentum/i.test(b.value)?i.Sequentum:void 0)},detectWindowSize:function(b){var c=b.windowSize,d=b.documentFocus;if(0!==c.state||0!==d.state)return!1;var e=c.value,f=e.outerWidth,g=e.outerHeight;return d.value&&0===f&&0===g?i.HeadlessChrome:void 0},detectMimeTypesConsistent:function(a){var b=a.mimeTypesConsistent;if(0===b.state&&!b.value)return i.Unknown},detectProductSub:function(a){var b=a.productSub,c=a.browserKind;return 0===b.state&&0===c.state&&("chrome"!==c.value&&"safari"!==c.value&&"opera"!==c.value&&"wechat"!==c.value||"20030107"===b.value?void 0:i.Unknown)},detectDistinctiveProperties:function(a){var b=a.distinctiveProps;if(0!==b.state)return!1;var c,d=b.value;for(c in d)if(d[c])return c}};function m(){var a,b,c=window,d=navigator;return 5<=v(["webkitPersistentStorage"in d,"webkitTemporaryStorage"in d,0===d.vendor.indexOf("Google"),"webkitResolveLocalFileSystemURL"in c,"BatteryManager"in c,"webkitMediaStream"in c,"webkitSpeechGrammar"in c])?"chromium":4<=v(["ApplePayError"in c,"CSSPrimitiveValue"in c,"Counter"in c,0===d.vendor.indexOf("Apple"),"getStorageUpdates"in d,"WebKitMediaKeys"in c])?"webkit":4<=v(["buildID"in navigator,"MozAppearance"in(null!==(b=null===(a=document.documentElement)||void 0===a?void 0:a.style)&&void 0!==b?b:{}),"onmozfullscreenchange"in c,"mozInnerScreenX"in c,"CSSMozDocumentRule"in c,"CanvasCaptureMediaStream"in c])?"gecko":"unknown"}var p={android:function(){var a=m(),b="chromium"===a,c="gecko"===a;if(!b&&!c)return!1;var d=window;return 2<=v(["onorientationchange"in d,"orientation"in d,b&&!("SharedWorker"in d),c&&/android/i.test(navigator.appVersion)])},browserKind:function(){var a,b=null===(a=navigator.userAgent)||void 0===a?void 0:a.toLowerCase();return c(b,"edg/")?"edge":c(b,"safari")?"safari":c(b,"trident")||c(b,"msie")?"internet_explorer":c(b,"wechat")?"wechat":c(b,"firefox")?"firefox":c(b,"opera")||c(b,"opr")?"opera":c(b,"chrome")?"chrome":"unknown"},browserEngineKind:m,documentFocus:function(){return void 0!==document.hasFocus&&document.hasFocus()},userAgent:function(){return navigator.userAgent},appVersion:function(){var a=navigator.appVersion;if(null==a)throw new o(-1,"navigator.appVersion is undefined");return a},rtt:function(){if(void 0===navigator.connection)throw new o(-1,"navigator.connection is undefined");if(void 0===navigator.connection.rtt)throw new o(-1,"navigator.connection.rtt is undefined");return navigator.connection.rtt},windowSize:function(){return{outerWidth:window.outerWidth,outerHeight:window.outerHeight,innerWidth:window.innerWidth,innerHeight:window.innerHeight}},pluginsLength:function(){if(void 0===navigator.plugins)throw new o(-1,"navigator.plugins is undefined");if(void 0===navigator.plugins.length)throw new o(-3,"navigator.plugins.length is undefined");return navigator.plugins.length},pluginsArray:function(){if(void 0===navigator.plugins)throw new o(-1,"navigator.plugins is undefined");if(void 0===window.PluginArray)throw new o(-1,"window.PluginArray is undefined");return navigator.plugins instanceof PluginArray},errorTrace:function(){try{null[0]()}catch(a){if(a instanceof Error&&null!=a.stack)return a.stack.toString()}throw new o(-3,"errorTrace signal unexpected behaviour")},productSub:function(){var a=navigator.productSub;if(void 0===a)throw new o(-1,"navigator.productSub is undefined");return a},windowExternal:function(){if(void 0===window.external)throw new o(-1,"window.external is undefined");var a=window.external;if("function"!=typeof a.toString)throw new o(-2,"window.external.toString is not a function");return a.toString()},mimeTypesConsistent:function(){if(void 0===navigator.mimeTypes)throw new o(-1,"navigator.mimeTypes is undefined");for(var a=navigator.mimeTypes,b=Object.getPrototypeOf(a)===MimeTypeArray.prototype,c=0;c<a.length;c++)b&&(b=Object.getPrototypeOf(a[c])===MimeType.prototype);return b},evalLength:function(){return eval.toString().length},webGL:function(){var a=document.createElement("canvas");if("function"!=typeof a.getContext)throw new o(-2,"HTMLCanvasElement.getContext is not a function");var b=a.getContext("webgl");if(null===b)throw new o(-4,"WebGLRenderingContext is null");if("function"!=typeof b.getParameter)throw new o(-2,"WebGLRenderingContext.getParameter is not a function");return{vendor:b.getParameter(b.VENDOR),renderer:b.getParameter(b.RENDERER)}},webDriver:function(){if(null==navigator.webdriver)throw new o(-1,"navigator.webdriver is undefined");return navigator.webdriver},languages:function(){var a,b=navigator,c=[],d=b.language||b.userLanguage||b.browserLanguage||b.systemLanguage;if(void 0!==d&&c.push([d]),Array.isArray(b.languages))"chromium"===m()&&3<=v([!("MediaSettingsRange"in(a=window)),"RTCEncodedAudioFrame"in a,"[object Intl]"==""+a.Intl,"[object Reflect]"==""+a.Reflect])||c.push(b.languages);else if("string"==typeof b.languages){var f=b.languages;f&&c.push(f.split(","))}return c},notificationPermissions:function(){return n(this,void 0,void 0,function(){var a,b;return t(this,function(c){switch(c.label){case 0:if(void 0===window.Notification)throw new o(-1,"window.Notification is undefined");if(void 0===navigator.permissions)throw new o(-1,"navigator.permissions is undefined");if("function"!=typeof(a=navigator.permissions).query)throw new o(-2,"navigator.permissions.query is not a function");c.label=1;case 1:return c.trys.push([1,3,,4]),[4,a.query({name:"notifications"})];case 2:return b=c.sent(),[2,"denied"===window.Notification.permission&&"prompt"===b.state];case 3:throw c.sent(),new o(-3,"notificationPermissions signal unexpected behaviour");case 4:return[2];}})})},documentElementKeys:function(){if(void 0===document.documentElement)throw new o(-1,"document.documentElement is undefined");var a=document.documentElement;if("function"!=typeof a.getAttributeNames)throw new o(-2,"document.documentElement.getAttributeNames is not a function");return a.getAttributeNames()},functionBind:function(){if(void 0===Function.prototype.bind)throw new o(-2,"Function.prototype.bind is undefined");return Function.prototype.bind.toString()},process:function(){if(void 0===window.process)throw new o(-1,"window.process is undefined");return window.process},distinctiveProps:function(){var b,g,h=((b={})[i.Awesomium]={window:["awesomium"]},b[i.Cef]={window:["RunPerfTest"]},b[i.CefSharp]={window:["CefSharp"]},b[i.CoachJS]={window:["emit"]},b[i.FMiner]={window:["fmget_targets"]},b[i.Geb]={window:["geb"]},b[i.NightmareJS]={window:["__nightmare","nightmare"]},b[i.Phantomas]={window:["__phantomas"]},b[i.PhantomJS]={window:["callPhantom","_phantom"]},b[i.Rhino]={window:["spawn"]},b[i.Selenium]={window:["_Selenium_IDE_Recorder","_selenium","calledSelenium",/^([a-z]){3}_.*_(Array|Promise|Symbol)$/],document:["__selenium_evaluate","selenium-evaluate","__selenium_unwrapped"]},b[i.WebDriverIO]={window:["wdioElectron"]},b[i.WebDriver]={window:["webdriver","__webdriverFunc","__lastWatirAlert","__lastWatirConfirm","__lastWatirPrompt","_WEBDRIVER_ELEM_CACHE","ChromeDriverw"],document:["__webdriver_script_fn","__driver_evaluate","__webdriver_evaluate","__fxdriver_evaluate","__driver_unwrapped","__webdriver_unwrapped","__fxdriver_unwrapped","__webdriver_script_fn","__webdriver_script_func","__webdriver_script_function","$cdc_asdjflasutopfhvcZLmcf","$cdc_asdjflasutopfhvcZLmcfl_","$chrome_asyncScriptInfo","__$webdriverAsyncExecutor"]},b[i.HeadlessChrome]={window:["domAutomation","domAutomationController"]},b),j={},k=l(window),a=[];for(g in void 0!==window.document&&(a=l(window.document)),h){var m=h[g];if(void 0!==m){var o=void 0!==m.window&&f.apply(void 0,r([k],m.window,!1)),c=void 0!==m.document&&a.length&&f.apply(void 0,r([a],m.document,!1));j[g]=o||c}}return j}},h=function(){function b(){this.components=void 0,this.detections=void 0}return b.prototype.getComponents=function(){return this.components},b.prototype.getDetections=function(){return this.detections},b.prototype.detect=function(){if(void 0===this.components)throw new Error("BotDetector.detect can't be called before BotDetector.collect");var b=a(this.components,w),c=b[0],d=b[1];return this.detections=c,d},b.prototype.collect=function(){return n(this,void 0,void 0,function(){var a;return t(this,function(b){switch(b.label){case 0:return a=this,[4,u(p)];case 1:return a.components=b.sent(),[2,this.components];}})})},b}();function g(a){return n(this,void 0,void 0,function(){var b;return t(this,function(c){switch(c.label){case 0:return null==a?void 0:a.monitoring,[4,(b=new h).collect()];case 1:return c.sent(),[2,b];}})})}var b={load:g};export{i as BotKind,o as BotdError,u as collect,b as default,a as detect,w as detectors,g as load,p as sources};