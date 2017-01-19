var NAMESPACE = "Kirino/Render";
define(function (require) {
    var Music = require("Kirino/Types/Music");
    var ID = "music";
    var ICON_NAME = "music";
    var Icon = require("Kirino/Render/Icon");

    return class MusicRender extends require("Kirino/Render/BasicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, new Icon(Icon.Type.ICON, ICON_NAME), settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("musicTitle"));
        }

        updateTitle($elementTag, element) {
            $elementTag.find(".title").text(element.show + " - " + element.type);
        }

        updateText($elementTag, element) {
            var content = "";
            if (element.title)
                content += element.title + (element.author ? " - " : " ");
            if (element.author)
                content += element.author;
            if (element.searchText) {
                if (element.title || element.author) {
                    content += "<br>";
                }
                content += "<a href='#seach'>[" + element.searchText + "]</a>";
            }
            $elementTag.find(".text").html(content);
        }

        updateOther($elementTag, element) {
            if (element.anisonId) {
                $elementTag.find(".top").append(this._createBadge("Anison", element.anisonId));
            }
            if (element.vgmdbId) {
                $elementTag.find(".top").append(this._createBadge("VGMdb.net", element.vgmdbId));
            }
        }

        static get ID() {
            return ID;
        }

        static get ICON() {
            return ICON;
        }

        get elementClass() {
            return Music;
        }
    };
});