var NAMESPACE = "Kirino/Render";
define(function (require) {
    var Show = require("Kirino/Types/Show");
    var ID = "show";
    var ICON_NAME = "tv";
    var Icon = require("Kirino/Render/Icon");

    return class ShowRender extends require("Kirino/Render/EpisodicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, new Icon(Icon.Type.ICON, ICON_NAME), settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("showsTitle"));
        }

        updateOther($elementTag, element) {
            if (element.nextEpisodeId || (element.thing && element.thing.nextEpisodeId)) {
                $elementTag.find(".top").append(this._createBadge("next.net", element.nextEpisodeId));
            }
        }

        static get ID() {
            return ID;
        }

        static get ICON() {
            return ICON;
        }

        get elementClass() {
            return Show;
        }
    };
});