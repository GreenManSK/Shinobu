let ANISON_REGEXP = new RegExp(/^https?:\/\/anison\.info\/data\/song\/(\d+)\.html/, 'i');
let ANIDB_ANIME_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/perl-bin\/animedb\.pl\?show=anime&aid=(\d+)/, 'i');
let ANIDB_SONG_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/perl-bin\/animedb\.pl\?show=song&songid=(\d+)/, 'i');
let ANIDB_EPISODE_REGEXP = new RegExp(/^https?:\/\/anidb\.net\/perl-bin\/animedb\.pl\?show=ep&eid=(\d+)/, 'i');
let THETVDB_REGEXP = new RegExp(/^https?:\/\/(?:www\.)?thetvdb\.com\/series\/([^/]+)\/seasons\/all/, 'i');

let regexs = [
    ANISON_REGEXP,
    ANIDB_ANIME_REGEXP,
    ANIDB_SONG_REGEXP,
    ANIDB_EPISODE_REGEXP,
    THETVDB_REGEXP
];

let url = window.location.toString();
for (let i in regexs) {
    if (url.match(regexs[i]) !== null) {
        chrome.runtime.sendMessage({
            name: "badge.text",
            "text": "+",
            tabId: true
        }, null);
        break;
    }
}