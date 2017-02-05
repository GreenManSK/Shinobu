define(function (require) {
    var NAMESPACE = "Kirino/Render";
    var OVA = require("Kirino/Types/OVA");
    var ID = "ova";
    var ICON_NAME = "anidb.ico";
    var Icon = require("Kirino/Render/Icon");
    var FormLinker = require("Form/Linker");
    var AnidbEpisode = require("Parsers/AnidbEpisode");

    return class OvaRender extends require("Kirino/Render/BasicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, OvaRender.ICON, settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("ovaTitle"));

            let addLink = FormLinker.createLink(FormLinker.FORM_MODULE + this.elementId);
            let $addButton = $('<a href="' + addLink + '" class="add" title="' + _('add') + '"><i class="fa fa-plus" aria-hidden="true"></i></a>');
            $addButton.on('click', function (e) {
                e.preventDefault();
                OvaRender._popItUp(this.getAttribute("href"), _('add'));
            });
            $box.find('.tools').append($addButton);
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
            super.updateOther($elementTag, element);
            if (element.anidbEpisodeId) {
                $elementTag.find(".top").append(this._createBadge("aniDB.net", AnidbEpisode.getUrl(element.anidbEpisodeId)));
            }
        }

        static get ID() {
            return ID;
        }

        static get ICON() {
            return new Icon(Icon.Type.IMG, ICON_NAME);
        }

        get elementClass() {
            return OVA;
        }
    };
});