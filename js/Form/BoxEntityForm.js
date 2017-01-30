define(function (require) {
    var NAMESPACE = "Form";
    var BasicRender = require("Kirino/Render/BasicRender");

    return class BoxEntityForm extends require("Base/EntityForm") {
        constructor(title, color, icon, id, items, callback) {
            super(id, items, callback);
            this.title = title;
            this.color = color ? color : BasicRender.Color.GRAY;
            this.icon = icon;
        }

        render(selector) {
            let $box = $(selector);
            $box.addClass(this.color);
            if (this.title) {
                $box.find("h2").text(_(this.title));
            }
            if (this.icon) {
                $box.find(".head").prepend(this.icon.html);
            }
            let $closeButton = $('<a href="#close" class="close" title="' + _('close') + '"><i class="fa fa-times" aria-hidden="true"></i></a>');
            $closeButton.on('click', function (e) {
                e.preventDefault();
                window.close();
            });
            $box.find('.tools').append($closeButton);
            super.render(selector);
        }
    }
});
