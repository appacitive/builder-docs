;

(function () {
    if (document.location.protocol == 'http:' && window.location.hostname == "portal.appacitive.com") window.location = window.location.href.replace("http://", "https://");
})();
WebFontConfig = {
    google: { families: ['Open+Sans+Condensed:300:latin', 'Open+Sans:400italic,400,300,700:latin'] }
};
(function () {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'false';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
})();