var NAMESPACE = "Kirino/Render";
define(function (require) {
    var KIRINO_SPACE = "Kirino.";
    var Data = require("Base/Data");

    var BOX_TEMPLATE = "#template .box";
    var ITEM_TEMPLATE = "#template .box li";
    var COLUMN_SELECTOR = ".half";

    var ACTUAL_ITEM_CLASS = "actual";
    var UNKNOWN_DATE_CLASS = "unknown";

    var colorPicker = function (item, opt, root) {
        var html = '<ul class="color-picker">';
        for (var c in BasicRender.Color) {
            html += '<li class="' + BasicRender.Color[c] + '"></li>';
        }
        html += '</ul>';

        $(html)
            .appendTo(this)
            .on('click', 'li', function () {
                item.box.changeColor($(this).attr('class'));
                root.$menu.trigger('contextmenu:hide');
            });

        this.addClass('labels').on('contextmenu:focus', function (e) {
            // setup some awesome stuff
        });
    };

    class BasicRender {
        static get Color() {
            return {
                RED: "red",
                BLUE: "blue",
                GREEN: "green",
                YELLOW: "yellow",
                PINK: "pink",
                PURPLE: "purple",
                GRAY: "gray"
            };
        }

        static get Column() {
            return {FIRST: 0, SECOND: 1};
        }

        static get TODAY() {
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return d.getTime();
        }

        constructor(elementId, color, column, icon, settings) {
            this.elementId = elementId;
            this.boxColor = color;
            this.boxColumn = column;
            this.icon = icon;
            this._create();
            this.itemTemplate = $(ITEM_TEMPLATE);
            this.$mainElement = $("#" + this.elementId + " ul");
            this.settings = settings;
        }

        _create() {
            console.log("Creating #" + this.elementId + "[" +
                this.boxColor + ", " +
                this.boxColumn +
                "]...");
            var $box = $(BOX_TEMPLATE).clone();
            $box.addClass(this.boxColor).attr("id", this.elementId);
            this.editBox($box);
            $(COLUMN_SELECTOR).get(this.boxColumn).append($box.get(0));

            $.contextMenu.types.colorPicker = colorPicker;
            $.contextMenu({
                selector: '#' + this.elementId + ' .head',
                callback: function (key, options) {
                    // var m = "clicked: " + key;
                    // window.console && console.log(m) || alert(m);
                },
                items: {
                    colorPicker: {type: "colorPicker", customName: "", box: this},
                    "sep1": "---------",
                    "move": {name: _("move"), icon: "fa-arrows"},

                }
            });
        }

        editBox($box) {
            $box.find("h2").text(this.elementId);
            $box.find(".head").prepend(this.icon.html);
        }

        render() {
            var THIS = this;
            var STORAGE_PLACE = KIRINO_SPACE + this.elementId;
            this.$mainElement.empty(); //@TODO: Add nice loading shit
            Data.get(STORAGE_PLACE, function (ids) {
                if (ids[STORAGE_PLACE] && ids[STORAGE_PLACE].length > 0) {
                    THIS.elementClass.getAll(ids[STORAGE_PLACE]).then((elements) => {
                        elements = Object.values(elements);
                        THIS._render(elements);
                    });
                }
            });
        }

        _render(elements) {
            elements.sort(BasicRender.dateCompare);
            for (let key in elements) {
                this.renderOne(elements[key]);
            }
        }

        renderOne(element) {
            var selector = this.elementSelector(element);

            var elementTag = this.$mainElement.find("#" + selector).get(0);
            if (!elementTag) {
                this.createElement(element);
                elementTag = this.$mainElement.find("#" + selector).get(0);
            }
            var $elementTag = $(elementTag);
            this.updateTitle($elementTag, element);
            this.updateDate($elementTag, element);
            this.updateButtons($elementTag, element);
            this.updateText($elementTag, element);
            this.updateOther($elementTag, element);
        }

        elementSelector(element) {
            return "e" + element.id.replace(/#/g, "-");
        }

        createElement(element) {
            var $item = this.itemTemplate.clone();
            $item.attr('id', this.elementSelector(element));
            this.$mainElement.append($item.get(0));
        }

        updateTitle($elementTag, element) {
            $elementTag.find(".title").text(element.id);
        }

        updateDate($elementTag, element) {
            var date = new Date(element.date);
            var $date = $elementTag.find(".date");
            if (!element.date) {
                $date.addClass(UNKNOWN_DATE_CLASS);
            }
            if (element.date && element.date <= BasicRender.TODAY) {
                $elementTag.addClass(ACTUAL_ITEM_CLASS);
            }
            $date.text(element.date ? date.toLocaleDateString() : _("unknown"));
        }

        updateButtons($elementTag, element) {

        }

        updateText($elementTag, element) {

        }

        updateOther($elementTag, element) {

        }

        _createBadge(text, link) {
            return '<a title="' + text + '" href="' + link + '" class="badge" target="_blank">' + text + '</a>';
        }

        changeColor(color) {
            this.boxColor = color;
            this.$mainElement.parent('.box').removeClass(Object.values(BasicRender.Color).join(" ")).addClass(color);
            this.settings.updateColor(this.elementId, color);
        }

        static dateCompare(a, b) {
            if (a.date == null) {
                return 1;
            }
            if (b.date == null) {
                return -1;
            }
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        }

        get elementClass() {
            console.error(this.constructor.name + " need to implement elementClass() method.");
        }
    }

    return BasicRender;
});