define(function (require) {
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

    var data = {
        music: [],
        ova: [],
        shows: [],
        anime: []
    };

    //Music
    {
        var musicElements = [
            new Music("Fuuka", "END"), //4
            new Music("Fuuka", "OP"), //1
            new Music("Bungou Stray Dogs", "OST"), //3
            new Music("Test", "Test") //2
        ];

        musicElements[0].title = "Watashi no Sekai";
        musicElements[0].author = "Nakajima Megumi";
        musicElements[0].anisonId = 12345;
        musicElements[0].vgmdbId = 6453;
        musicElements[3].searchText = "Nyaa Nyaa Nyaa";
        musicElements[3].date = Date.parse("March 25, 2012");
        musicElements[1].date = Date.parse("March 21, 2012");
        musicElements[2].date = Date.parse("March 21, 2018");
        shuffle(musicElements);

        data.music = musicElements;
    }
    
    //OVA
    {
        var ovaData = [
            new OVA("Code Geass: Boukoku no Akito"),
            new OVA("Volume 1 - 1 - Gintama (2016) - Episode - AniDB"),
            new OVA("Cold-Blooded Arc - 3 - Kizumonogatari ")
        ];
        
        ovaData[0].anidbEpisodeId = 12345;
        ovaData[0].date = Date.parse("March 25, 2012");
        ovaData[0].searchText = "yolo 23";
        
        ovaData[1].anidbEpisodeId = 1234455;
        ovaData[1].date = Date.parse("March 25, 2018");
        
        shuffle(ovaData);
        data.ova = ovaData;
    }
    
    //Show
    {
        var showData = [
            new Show("bravest-warriors", "Bravest Warriors"),
            new Show("adventure-time", "Adventure Time"),
            new Show("star-vs.-the-forces-of-evil", "Star vs. the Forces of Evil")
        ];
        
        new Episode(showData[0], 3001, Date.now());
        new Episode(showData[0], 3002, Date.now()+500000000);
        new Episode(showData[2], 8002, Date.now()+60000000);
        new Episode(showData[2], 8003, Date.now()+70000000);
        new Episode(showData[2], 7001, Date.now()-500000000);
        
        shuffle(showData);
        data.shows = showData;
    }
    
    //Anime
    {
        var animeData = [
            new Anime(123456, "Naruto Shippuuden"),
            new Anime(123457, "One Room"),
            new Anime(123458, "Gintama (2017)"),
            new Anime(123459, "3-gatsu no Lion")
        ];
        new Episode(animeData[0], 301, Date.now());
        new Episode(animeData[0], 302, Date.now()+500000000);
        new Episode(animeData[0], 303, Date.now()+50000002*3);
        new Episode(animeData[2], 82, Date.now()+60000000);
        new Episode(animeData[2], 83, Date.now()+70000000);
        new Episode(animeData[2], 71, Date.now()-500000000);
        for (var i = 1; i <= 5; i++) {
        new Episode(animeData[3], i, Date.now()+50000000*i);
        }
        
        animeData[2].searchText = "hsfa hskaf fhska sfhk a";
        animeData[0].searchText = "Naruto Shippuuden 720p HorribleSubs";
        animeData[1].searchText = "Naruto Shippuuden 720p HorribleSubs";
        
        shuffle(animeData);
        data.anime = animeData;
    }
    
    return data;
});