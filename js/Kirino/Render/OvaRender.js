//namespace Kirino/Render
define(function (require) {
    var ID = "ova";
    var ICON_NAME = "anidb.ico";
    var Icon = require("Kirino/Render/Icon");
    
    return class MusicRender extends require("Kirino/Render/BasicRender") {
        constructor(color, column) {
            super(ID, color, column, new Icon(Icon.Type.IMG, ICON_NAME));
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text("OVA");
        }

        updateTitle($elementTag, element) {
            $elementTag.find(".title").text(element.name);
        }

        updateText($elementTag, element) {
            var content = "";
            if (element.searchText) {
                content += "<a href='#seach'>[" + element.searchText + "]</a>";
            }
            $elementTag.find(".text").html(content);
        }
        
        updateOther($elementTag, element) {
            if (element.anidbEpisodeId) {
                $elementTag.find(".top").append(this._createBadge("aniDB.net", element.anidbEpisodeId));
            }
        }
        
        static get ID() {return ID;}
        static get ICON() {return ICON;}
    };
});