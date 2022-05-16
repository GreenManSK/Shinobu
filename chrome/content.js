let ANISON_REGEXP = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');
let ANIDB_ANIME_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/anime\/(\d+)/, 'i');
let ANIDB_SONG_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/song\/(\d+)/, 'i');
let ANIDB_EPISODE_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/episode\/(\d+)/, 'i');
let THETVDB_REGEXP = new RegExp(/^https?:\/\/(?:www\.)?thetvdb\.com\/series\/([^/]+)\/allseasons\/official/, 'i');
let AMAZON_REGEXP = new RegExp(/^https?:\/\/(?:www\.)?amazon(?:\.co)?\.jp\/gp\/product\/(.*)(\?.*)?/, 'i');

let regexs = [
    ANISON_REGEXP,
    ANIDB_ANIME_REGEXP,
    ANIDB_SONG_REGEXP,
    ANIDB_EPISODE_REGEXP,
    THETVDB_REGEXP,
    AMAZON_REGEXP
];

function updateBadge() {
    chrome.runtime.sendMessage({
        address: 'BadgeManipulator',
        text: '+',
        tabId: true
    }, null);
}

let url = window.location.toString();
for (let i in regexs) {
    if (url.match(regexs[i]) !== null) {
        updateBadge();
        break;
    }
}
