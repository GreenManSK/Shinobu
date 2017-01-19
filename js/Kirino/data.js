define(function (require) {
    var Data = require("Base/Data");
    var Anime = require("Kirino/Types/Anime");
    var Show = require("Kirino/Types/Show");
    var OVA = require("Kirino/Types/OVA");
    var Music = require("Kirino/Types/Music");
    var Episode = require("Kirino/Types/Episode");

    function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }

    return new Promise((cb) => {
        Data.storage.get(["dataInserted"], function (items) {
            if (items["dataInserted"]) {
                cb(false);
            } else {
                var musicElements = [];
                var ovaData = [];
                var showData = [];
                var animeData = [];

                Music.create("Fuuka", "END", "Watashi no Sekai", "Nakajima Megumi", null, 12345, 6453).then((obj) => {
                    musicElements.push(obj.id);
                    return Music.create("Fuuka", "OP", null, null, Date.parse("March 21, 2012"));
                }).then((obj) => {
                    musicElements.push(obj.id);
                    return Music.create("Bungou Stray Dogs", "OST", null, null, Date.parse("March 21, 2012"));
                }).then((obj) => {
                    musicElements.push(obj.id);
                    return Music.create("Test", "Test", null, null, Date.parse("March 21, 2018"));
                }).then((obj) => {
                    musicElements.push(obj.id);
                    return OVA.create("Code Geass: Boukoku no Akito", 12345, Date.parse("March 25, 2012"), "yolo 23")
                }).then((obj) => {
                    ovaData.push(obj.id);
                    return OVA.create("Volume 1 - 1 - Gintama (2016) - Episode - AniDB", 1234455, Date.parse("March 25, 2018"), "yolo 23")
                }).then((obj) => {
                    ovaData.push(obj.id);
                    return OVA.create("Cold-Blooded Arc - 3 - Kizumonogatari")
                }).then((obj) => {
                    ovaData.push(obj.id);
                    return Show.create("bravest-warriors", "Bravest Warriors");
                }).then((obj) => {
                    showData.push(obj.id);
                    return Show.create("adventure-time", "Adventure Time");
                }).then((obj) => {
                    showData.push(obj.id);
                    return Show.create("star-vs.-the-forces-of-evil", "Star vs. the Forces of Evil");
                }).then((obj) => {
                    showData.push(obj.id);
                    return Episode.create(new Show(showData[0]), 3001, Date.now());
                }).then((obj) => {
                    return Episode.create(new Show(showData[0]), 3002, Date.now() + 500000000);
                }).then((obj) => {
                    return Episode.create(new Show(showData[2]), 8002, Date.now() + 60000000);
                }).then((obj) => {
                    return Episode.create(new Show(showData[2]), 8003, Date.now() + 70000000);
                }).then((obj) => {
                    return Episode.create(new Show(showData[2]), 7001, Date.now() - 500000000);
                }).then((obj) => {
                    return Anime.create(123456, "Naruto Shippuuden", "Naruto Shippuuden 720p HorribleSubs");
                }).then((obj) => {
                    animeData.push(obj.id);
                    return Anime.create(123457, "One Room", "Naruto Shippuuden 720p HorribleSubs");
                }).then((obj) => {
                    animeData.push(obj.id);
                    return Anime.create(123458, "Gintama (2017)", "hsfa hskaf fhska sfhk a");
                }).then((obj) => {
                    animeData.push(obj.id);
                    return Anime.create(123459, "3-gatsu no Lion");
                }).then((obj) => {
                    animeData.push(obj.id);
                    return Episode.create(new Anime(animeData[0]), 301, Date.now());
                }).then((obj) => {
                    return Episode.create(new Anime(animeData[0]), 302, Date.now() + 500000000);
                }).then((obj) => {
                    return Episode.create(new Anime(animeData[0]), 303, Date.now() + 50000002 * 3);
                }).then((obj) => {
                    return Episode.create(new Anime(animeData[2]), 82, Date.now() + 60000000);
                }).then((obj) => {
                    return Episode.create(new Anime(animeData[2]), 83, Date.now() + 70000000);
                }).then((obj) => {
                    return Episode.create(new Anime(animeData[2]), 71, Date.now() - 500000000);
                }).then(() => {
                    Data.storage.set({
                        "Kirino.music": musicElements,
                        "Kirino.ova": ovaData,
                        "Kirino.show": showData,
                        "Kirino.anime": animeData,
                        dataInserted: true
                    }, function () {
                        cb(true);
                    });
                });
            }
        });
    });
});