var NAMESPACE = "Kirino/Render";
define(function (require) {
    var Anime = require("Kirino/Types/Anime");
    var ID = "anime";
    var ICON_NAME = "anidb.ico";
    var Icon = require("Kirino/Render/Icon");
    
    return class AnimeRender extends require("Kirino/Render/EpisodicRender") {
        constructor(color, column) {
            super(ID, color, column, new Icon(Icon.Type.IMG, ICON_NAME));
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("animeTitle"));
        }

        updateText($elementTag, element) {
            var content = "";
            if (element.thing && element.thing.searchText) {
                content += "<a href='#seach'>[" + element.thing.searchText + "]</a>";
            }
            $elementTag.find(".text").html(content);
        }
        
        updateOther($elementTag, element) {
            if (element.anidbId || (element.thing && element.thing.anidbId)) {
                $elementTag.find(".top").append(this._createBadge("aniDB.net", element.anidbId));
            }
        }
        
        static get ID() {return ID;}
        static get ICON() {return ICON;}

        get elementClass() {
            return Anime;
        }
    };
});