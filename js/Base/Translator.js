function translate(name, subs) {
    return chrome.i18n.getMessage(name, subs);
}

function _() {
    return translate.apply(null, arguments);
}

function translateHtml(html) {
    return html.replace(/{_([^;}]*)(.*?)}/g, function (m, $1, $2) {
        return _($1,
                $2.replace(/^;'|'$/g, '').split("';'")
                );
    });
}

$(function () {
    var html = document.getElementsByTagName('html')[0];
    html.innerHTML = translateHtml(html.innerHTML);
});