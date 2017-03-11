function translate(name, subs) {
    let translation = chrome.i18n.getMessage(name, subs);
    if (!translation) {
        console.warn("Translator: Unknown text - " + name);
    }
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
    let translate = [
        document.getElementsByTagName('body')[0],
        document.getElementsByTagName('title')[0]
    ];
    for (let k in translate) {
        translate[k].innerHTML = translateHtml(translate[k].innerHTML);
    }
}