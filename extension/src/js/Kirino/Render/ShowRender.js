define(function (require) {
var NAMESPACE = "Kirino/Render";
    var Show = require("Kirino/Types/Show");
    var ID = "show";
    var ICON_NAME = "tv";
    var Icon = require("Kirino/Render/Icon");
    var TheTVDB = require("Parsers/TheTVDB");

    return class ShowRender extends require("Kirino/Render/EpisodicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, ShowRender.ICON, settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("showsTitle"));
        }

        updateOther($elementTag, element) {
            super.updateOther($elementTag, element);
            if (element.thetvdbId || (element.thing && element.thing.thetvdbId)) {
                $elementTag.find(".top").append(this._createBadge("TheTVDB.com", TheTVDB.getUrl((element.thing ? element.thing : element).thetvdbId)));
            }
        }

        static get ID() {
            return ID;
        }

        static get ICON() {
            return new Icon(Icon.Type.ICON, ICON_NAME);
        }

        get elementClass() {
            return Show;
        }
    };
});