const host = process.argv.length > 3 ? process.argv[3] : "127.0.0.1";
const port = process.argv.length > 2 ? process.argv[2] : "6446";

const allowedUrls = [
    "anison.info/data/song/",
    "anidb.net/anime/",
    "anidb.net/song/",
    "anidb.net/episode/",
    "www.thetvdb.com/series/",
    "thetvdb.com/series/",
    "www.amazon.co.jp/gp/product/",
    "www.amazon.co.jp/kindle-dbs/productPage/ajax/",
    "api.anidb.net:9001"
]

const cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
    handleInitialRequest: (req, res, location) => {
        if (!location) {
            return false;
        }
        const url = `${location.host}${location.path}`;
        for (const allowed of allowedUrls) {
            if (url.startsWith(allowed)) {
                return false;
            }
        }
        return true;
    }
}).listen(port, host, () => {
    console.log(`Running CORS aAnywhere on ${host}:${port}`);
});
