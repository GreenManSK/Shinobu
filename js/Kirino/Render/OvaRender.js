var NAMESPACE = "Kirino/Render";
define(function (require) {
    var OVA = require("Kirino/Types/OVA");
    var ID = "ova";
    var ICON_NAME = "anidb.ico";
    var Icon = require("Kirino/Render/Icon");

    return class OvaRender extends require("Kirino/Render/BasicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, new Icon(Icon.Type.IMG, ICON_NAME), settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("ovaTitle"));
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

        static get ID() {
            return ID;
        }

        static get ICON() {
            return ICON;
        }

        get elementClass() {
            return OVA;
        }
    };
});