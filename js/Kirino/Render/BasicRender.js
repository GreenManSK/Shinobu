//namespace Kirino/Render
define(function (require) {
    var BOX_TEMPLATE = "#template .box";
    var ITEM_TEMPLATE = "#template .box li";
    var COLUMN_SELECTOR = ".half";

    var ACTUAL_ITEM_CLASS = "actual";
    var UNKNOWN_DATE_CLASS = "unknown";

    return class BasicRender {
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

        constructor(elementId, color, column, icon) {
            this.elementId = elementId;
            this.boxColor = color;
            this.boxColumn = column;
            this.icon = icon;
            this._create();
            this.itemTemplate = $(ITEM_TEMPLATE);
            this.$mainElement = $("#" + this.elementId + " ul");
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
        }

        editBox($box) {
            $box.find("h2").text(this.elementId);
            $box.find(".head").prepend(this.icon.html);
        }

        render(elements) {
            this.$mainElement.empty();
            elements = elements.sort(BasicRender.dateCompare);
            for (var key in elements) {
                this.renderOne(elements[key]);
            }
        }

        renderOne(element) {
            var selector = this.elementSelector(element);

            var elementTag = this.$mainElement.find(selector).get(0);
            if (!elementTag) {
                this.createElement(element);
                elementTag = this.$mainElement.find(selector).get(0);
            }
            var $elementTag = $(elementTag);
            this.updateTitle($elementTag, element);
            this.updateDate($elementTag, element);
            this.updateButtons($elementTag, element);
            this.updateText($elementTag, element);
            this.updateOther($elementTag, element);
        }

        elementSelector(element) {
            return "li.e" + element.id;
        }

        createElement(element) {
            var $item = this.itemTemplate.clone();
            $item.addClass("e" + element.id);
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
            $date.text(element.date ? date.toLocaleDateString() : "Unknown");
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
    };
});