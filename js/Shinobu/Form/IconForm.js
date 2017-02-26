define(function (require) {
    var NAMESPACE = "Shinobu/Form";
    var Form = require("Base/Form");
    var SiteParser = require("Parsers/SiteParser");
    var Synchronized = require("Base/Synchronized");
    var Icon = require("Shinobu/Types/Icon");

    let MODAL_CLASS = "modal-bg";
    let HIDE_CLASS = "hide";
    let PREVIEW_SELECTOR = ".preview";

    let ITEMS = {
        "link": {
            type: Form.TYPE.TEXT,
            label: 'url',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"],
                [Form.VALIDATION.URL, "invalidUrl"],
            ]
        },
        "title": {
            type: Form.TYPE.TEXT,
            label: 'title',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ]
        },
        "icon": {
            type: Form.TYPE.TEXT,
            label: 'icon',
            validators: [
                [Form.VALIDATION.REQUIERED, "needToFill"]
            ],
            help: "http://fontawesome.io/"
        },
        "submit": {
            type: Form.TYPE.SUBMIT,
            label: "save"
        },
        "cancel": {
            type: Form.TYPE.CB_BUTTON,
            label: "cancel",
            callback: function () {
                IconForm.closeModal();
            }
        }
    };

    class IconForm extends require("Base/EntityForm") {
        constructor(id, tab, callback, quickAccess) {
            super(id, ITEMS, null);
            this.userCallback = callback;
            this.callback = this._callback;
            this.quickAccess = quickAccess;
            this.eventsSet = false;
            this.tab = tab;
        }

        get _getDataObject() {
            return Icon;
        }

        render() {
            let $modal = $("." + MODAL_CLASS);
            $modal.on('click', (e) => {
                if ($(e.target).hasClass(MODAL_CLASS)) {
                    IconForm.closeModal();
                }
            });
            $modal.removeClass(HIDE_CLASS);

            this.prepareEvents();
            super.render("." + MODAL_CLASS + " .box");
            this.promise.then(() => {
                $($modal.find("input").get(1)).trigger("change.icon");
            });
        }

        prepareEvents() {
            if (this.eventsSet)
                return;
            this.eventsSet = true;
            let $modal = $("." + MODAL_CLASS);
            let THIS = this;
            $modal.on("change.icon", "input:not([name=link])", function () {
                let icon = $modal.find('input[name=icon]').val();
                $modal.find(PREVIEW_SELECTOR).html(THIS.quickAccess.createIcon({
                    title: $modal.find('input[name=title]').val(),
                    icon: icon,
                    img: Form.VALIDATION.URL.validator(icon)
                }));
            });
            $modal.onTyping('input:not([name=link])', {
                stop: function (event, $elem) {
                    $elem.trigger("change.icon");
                },
                delay: 400
            });
            $modal.on("change.icon", "input[name=link]", function () {
                let $icon = $modal.find('input[name=icon]');
                let $title = $modal.find('input[name=title]');
                let link = $modal.find('input[name=link]').val();
                if (Form.VALIDATION.URL.validator(link) && ($icon.val() === "" || $title.val() === "")) {
                    SiteParser.getData(link).then((data) => {
                        if ($icon.val() === "")
                            $icon.val(data.icon);
                        if ($title.val() === "")
                            $title.val(data.title);
                        $($modal.find("input").get(1)).trigger("change.icon");
                    });
                }
            });

            $modal.on("paste.icon", "input[name=link]", function() {
                setTimeout(() => {$(this).trigger('change');}, 100);
            });
        }

        _harvestValues() {
            return super._harvestValues().then((values) => {
                values.img = Form.VALIDATION.URL.validator(values.icon);
                return values
            });
        }

        _callback(values) {
            let THIS = this;
            let end = () => {
                if (THIS.userCallback) {
                    THIS.userCallback(values);
                }
                IconForm.closeModal();
            };
            if (this.adding) {
                this.tab.set({
                    icons: Synchronized.arrayAdder(values.id)
                }).then(end);
            } else {
                end();
            }
        }

        static closeModal() {
            let $modal = $("." + MODAL_CLASS);
            $modal.find("form").remove();
            $modal.addClass(HIDE_CLASS);
        }
    }

    return IconForm;
});