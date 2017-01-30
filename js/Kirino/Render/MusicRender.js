var NAMESPACE = "Kirino/Render";
define(function (require) {
    var Music = require("Kirino/Types/Music");
    var ID = "music";
    var ICON_NAME = "music";
    var Icon = require("Kirino/Render/Icon");
    var FormLinker = require("Form/Linker");

    return class MusicRender extends require("Kirino/Render/BasicRender") {
        constructor(color, column, settings) {
            super(ID, color, column, MusicRender.ICON, settings);
        }

        editBox($box) {
            super.editBox($box);
            $box.find("h2").text(_("musicTitle"));

            let addLink = FormLinker.createLink(FormLinker.FORM_MODULE + this.elementId);
            let $addButton = $('<a href="' + addLink + '" class="add" title="' + _('add') + '"><i class="fa fa-plus" aria-hidden="true"></i></a>');
            $addButton.on('click', function (e) {
                e.preventDefault();
                MusicRender._popItUp(this.getAttribute("href"), _('add'));
            });
            $box.find('.tools').append($addButton);
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
            super.updateOther($elementTag, element);
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
            return new Icon(Icon.Type.ICON, ICON_NAME);
        }

        get elementClass() {
            return Music;
        }
    };
});