define(function (require) {
    var NAMESPACE = "Kirino/Render";
    var Anime = require("Kirino/Types/Anime");
    var ID = "anime";
    var ICON_NAME = "anidb.ico";
    var Icon = require("Kirino/Render/Icon");
    let AnidbAnime = require("Parsers/AnidbAnime");
    var SearchGenerator = require("Kirino/Helpers/SearchGenerator");
    var Nyaaeu = require("Parsers/Nyaaeu");

    return class AnimeRender extends require("Kirino/Render/EpisodicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, AnimeRender.ICON, settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("animeTitle"));
        }

        updateText($elementTag, element) {
            var content = "";
            if (element.thing && element.thing.searchText) {
                let search = SearchGenerator.generate(element.number, element.thing.searchText, AnimeRender.elementClass);
                content += "<a target='_blank' href='" + Nyaaeu.getSearchUrl(search) + "'>[" + search + "]</a>";
            }
            $elementTag.find(".text").html(content);
        }

        updateOther($elementTag, element) {
            super.updateOther($elementTag, element);
            if (element.anidbId || (element.thing && element.thing.anidbId)) {
                $elementTag.find(".top").append(this._createBadge("aniDB.net", AnidbAnime.getUrl(element.anidbId ? element.anidbId : element.thing.anidbId)));
            }
        }

        static get ID() {
            return ID;
        }

        static get ICON() {
            return new Icon(Icon.Type.IMG, ICON_NAME);
        }

        get elementClass() {
            return Anime;
        }
    };
});