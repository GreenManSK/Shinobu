var NAMESPACE = "Kirino/Render";
define(function (require) {
    var KIRINO_SPACE = "Kirino.";
    var Data = require("Base/Data");
    var Notifications = require("Base/Notifications");
    var Synchronized = require("Base/Synchronized");
    var FormLinker = require("Form/Linker");

    var BOX_TEMPLATE = "#template .box";
    var ITEM_TEMPLATE = "#template .box li";
    var COLUMN_SELECTOR = ".half";

    var ACTUAL_ITEM_CLASS = "actual";
    var UNKNOWN_DATE_CLASS = "unknown";

    let WINDOW_HEIGHT = 500;
    let WINDOW_WIDTH = 600;

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
    };

    var placePicker = function (item, opt, root) {
        var html = '<ul class="place-picker">';
        html += '<li class="up"><i class="fa fa-chevron-up" aria-hidden="true"></i></li>';
        html += '<li class="left"><i class="fa fa-chevron-left" aria-hidden="true"></i></li>';
        html += '<li class="right"><i class="fa fa-chevron-right" aria-hidden="true"></i></li>';
        html += '<li class="down"><i class="fa fa-chevron-down" aria-hidden="true"></i></li>';
        html += '</ul>';

        $(html)
            .appendTo(this)
            .on('click', 'li', function () {
                item.box.move($(this).attr('class'));
                root.$menu.trigger('contextmenu:hide');
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
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(59);
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
            this.kirino = new Synchronized(settings.namespace);

            let THIS = this;
            console.log(settings.namespace + '.' + elementId + '.render');
            chrome.extension.onMessage.addListener(function (request) {
                if (request.name && request.name === settings.namespace + '.' + elementId + '.render') {
                    THIS.render();
                }
            });
        }

        _create() {
            console.log("Creating #" + this.elementId + "[" +
                this.boxColor + ", " +
                this.boxColumn +
                "]...");
            var $box = $(BOX_TEMPLATE).clone();
            $box.addClass(this.boxColor).attr("id", this.elementId);
            this.editBox($box);
            this.$box = $box;
            $(COLUMN_SELECTOR).get(this.boxColumn).append($box.get(0));

            $.contextMenu.types.colorPicker = colorPicker;
            $.contextMenu.types.placePicker = placePicker;
            $.contextMenu({
                selector: '#' + this.elementId + ' .head',
                callback: function (key, options) {
                },
                items: {
                    colorPicker: {type: "colorPicker", customName: "", box: this},
                    "sep1": "---------",
                    placePicker: {type: "placePicker", customName: "", box: this}

                }
            });
        }

        editBox($box) {
            $box.find("h2").text(this.elementId);
            $box.find(".head").prepend(this.icon.html);
        }

        render() {
            var THIS = this;
            this._cleanUp();
            this.kirino.get(this.elementId).then((ids) => {
                THIS.elementClass.getAll(ids).then((elements) => {
                    elements = Object.values(elements);
                    THIS._render(elements);
                    THIS._finished();
                });
            });
        }

        _startLoading() {
            this.$box.addClass("loading");
        }

        _endLoading() {
            this.$box.removeClass("loading");
        }

        _cleanUp() {
            this._startLoading();
            this.$mainElement.empty();
        }

        _finished() {
            this._endLoading();
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

        static elementIdFromSelector(selector) {
            return selector.replace(/^e/, "").replace(/-/g, "#");
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
            let THIS = this;

            let $info = $elementTag.find('.info');

            // #Edit
            let editLink = FormLinker.createLink(FormLinker.FORM_MODULE + THIS.elementId, element.id);
            let $edit = $('<a href="' + editLink + '"  class="edit" title="' + _('edit') + '"><i class="fa fa-pencil"></i></a>');
            $edit.on('click', function (e) {
                e.preventDefault();
                BasicRender._popItUp(this.getAttribute("href"), _('edit'));
            });


            // #Delete
            let $delete = $('<a href="#delete"  class="delete" title="' + _('delete') + '"><i class="fa fa-trash-o"></i></a>');
            $delete.on('click', function (e) {
                e.preventDefault();
                THIS._delete(element);
            });

            $info.append($edit);
            $info.append("&nbsp;/&nbsp;");
            $info.append($delete);
        }

        static _popItUp(url, windowName) {
            var dualScreenLeft = typeof window.screenLeft !== 'undefined' ? window.screenLeft : screen.left;
            var dualScreenTop = typeof window.screenTop !== 'undefined' ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (WINDOW_HEIGHT / 2)) + dualScreenLeft;
            var top = ((height / 2) - (WINDOW_WIDTH / 2)) + dualScreenTop;

            let newwindow = window.open(url, windowName, 'height=' + WINDOW_HEIGHT + ',width=' + WINDOW_WIDTH + ', top=' + top + ', left=' + left);
            if (window.focus) {
                newwindow.focus();
            }
            return false;
        }

        _createBadge(text, link) {
            return '<a title="' + text + '" href="' + link + '" class="badge" target="_blank">' + text + '</a>';
        }

        changeColor(color) {
            this.boxColor = color;
            this.$box.removeClass(Object.values(BasicRender.Color).join(" ")).addClass(color);
            this.settings.updateColor(this.elementId, color);
        }

        _delete(element) {
            let THIS = this;
            let obj = new THIS.elementClass(element.id);
            THIS._startLoading();
            obj.delete().then(() => {
                THIS.kirino.set(this.elementId, Synchronized.arrayDeleter(element.id)).then(() => {
                    Notifications.notify(_("deleteSuccess"), Notifications.Type.SUCCESS);
                    THIS.render();
                });
            });
        }

        move(direction) {
            if (direction === 'left' && this.boxColumn != BasicRender.Column.FIRST) {
                this.boxColumn = BasicRender.Column.FIRST;
                $(COLUMN_SELECTOR).get(BasicRender.Column.FIRST).append(this.$box.get(0));
            } else if (direction === 'right' && this.boxColumn != BasicRender.Column.SECOND) {
                this.boxColumn = BasicRender.Column.SECOND;
                $(COLUMN_SELECTOR).get(BasicRender.Column.SECOND).append(this.$box.get(0));
            } else if (direction === 'up') {
                var $prev = this.$box.prev();
                if ($prev.length) {
                    $prev.insertAfter(this.$box);
                }
            } else if (direction === 'down') {
                var $next = this.$box.next();
                if ($next.length) {
                    $next.insertBefore(this.$box);
                }
            }
            this.settings.updatePlace(this.elementId, direction);
        }

        static dateCompare(a, b) {
            if (a.date == false || a.date == null) {
                return 1;
            }
            if (b.date == false || b.date == null) {
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