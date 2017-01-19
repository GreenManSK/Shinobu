function translate(name, subs) {
    let translation = chrome.i18n.getMessage(name, subs);
    return translation ? translation : name;
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

function translateWholeDom() {
    var html = document.getElementsByTagName('html')[0];
    html.innerHTML = translateHtml(html.innerHTML);
}

// $(function () {
//     var html = document.getElementsByTagName('html')[0];
//     html.innerHTML = translateHtml(html.innerHTML);
// });