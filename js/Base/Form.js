define(function (require) {
    var NAMESPACE = "Base";
    var Data = require("Base/Data");
    var Notifications = require("Base/Notifications");

    class Form {
        static get TYPE() {
            return {
                TEXT: 'text',
                PASSWORD: 'password',
                NUMBER: 'number',
                EMAIL: 'email',
                TEXTAREA: 'textarea',
                DATE: 'date',
                TIME: 'time',
                CHECKBOX: 'checkbox',
                SELECT: 'select',
                SUBMIT: 'submit',
                RESET: 'reset',
                LINK_BUTTON: 'link_button',
                CB_BUTTON: 'cb_button'
            }
        }

        static get VALIDATION() {
            return {
                REQUIERED: {
                    name: 'requierd',
                    validator: function (value) {
                        return value.match(/^\s*$/) === null;
                    }
                },
                URL: {
                    name: 'url',
                    validator: function (url) {
                        return url.match(/^(https?|ftp):\/\/[a-z0-9-]+(\.[a-z0-9-]+)+\/?([\/?].+)?$/) !== null;
                    }
                },
                NUMERIC: {
                    name: 'numeric',
                    validator: function (value) {
                        return value.match(/^\d*$/) !== null;
                    }
                }
            }
        }

        constructor(items, callback) {
            this._showLabels = false;
            this.nonValue = [
                Form.TYPE.SUBMIT,
                Form.TYPE.RESET,
                Form.TYPE.LINK_BUTTON,
                Form.TYPE.CB_BUTTON
            ];

            this.items = items;
            this.callback = callback;
            this.promise = this._getData(items);
        }

        showLabels(show) {
            this._showLabels = show;
        }

        render(selector) {
            var THIS = this;

            THIS.promise.then(() => {
                var $form = $('<form></form>');

                if (this._showLabels)
                    $form.addClass("show-labels");

                $form.on('submit', function (e) {
                    e.preventDefault();
                    THIS._harvestValues()
                        .then((values) => THIS._saveData(values))
                        .then(() => {
                            Notifications.notify(_("formSubmitSuccess"), Notifications.Type.SUCCESS);
                            if (THIS.callback) {
                                THIS.callback();
                            }
                        });
                }).on('reset', function (e) {
                    $(this).find('input, select, textarea').trigger('change');
                });

                let buttons = {};

                for (let key in THIS.items) {
                    if (THIS.items[key].type === Form.TYPE.SUBMIT ||
                        THIS.items[key].type === Form.TYPE.RESET ||
                        THIS.items[key].type === Form.TYPE.LINK_BUTTON ||
                        THIS.items[key].type === Form.TYPE.CB_BUTTON) {
                        buttons[key] = THIS.items[key];
                    } else {
                        $form.append(THIS._creates(key, THIS.items[key]));
                    }
                }

                $form.append(THIS._createButtons(buttons));

                $(selector).append($form);
            });
        }

        _createButtons(buttons) {
            let $field = $("<div class='buttons'></div>");
            for (let key in buttons) {
                let button = buttons[key];
                if (button.type === Form.TYPE.LINK_BUTTON) {
                    $field.append(
                        $('<a class="second" target="_blank" href="' + _(button.url) + '" title="' + _(button.label) + '">' + _(button.label) + '</a>')
                    );
                } else if (button.type === Form.TYPE.CB_BUTTON) {
                    let $button = $('<button class="second">' + _(button.label) + '</button>');
                    $button.on('click', function (e) {
                        e.preventDefault();
                        button.callback()
                    });
                    $field.append($button);
                } else {
                    $field.append(
                        $('<input type="' + button.type + '" value="' + _(button.label) + '">')
                    );
                }
            }
            return $field;
        }

        _creates(key, item) {
            var THIS = this;
            let $field = $("<div class='field'></div>");

            var $label = $('<label for="' + this._nameToId(key) + '">' + _(item.label) + '</label>');
            $field.append($label);

            var base = 'id="' + this._nameToId(key) + '" placeholder="' + _(item.label) + '" title="' + _(item.label) + '" name="' + key + '"';
            if (item.attrs) {
                for (let i in item.attrs) {
                    base += " " + i + "='" + item.attrs[i] + "'";
                }
            }

            let validator = function (e) {
                let key = $(this).attr('name');
                let error = THIS._validate(key);
                if (error === true) {
                    $field.removeClass("error");
                    $field.find('span:not(.help)').remove();
                } else {
                    $field.addClass("error");
                    let $span = $field.find('span:not(.help)');
                    if ($span.length) {
                        $span.text(_(error));
                    } else {
                        $field.append("<span>" + _(error) + "</span>");
                    }
                }
            };
            let $input;

            if (item.type === Form.TYPE.CHECKBOX) {
                $field.addClass('checkbox');
                $input = $("<input " + base + " type='checkbox' " + (this.data[key] ? 'checked' : '') + ">");
                $label.text('');
                $label.append($input);
                $label.append(_(item.label));
            } else if (item.type === Form.TYPE.SELECT) {
                $input = $("<select " + base + "></select>");
                for (let i in item.items) {
                    $input.append(
                        $('<option value="' + i + '"' + (i == this.data[key] ? ' selected' : '') + '>' + _(item.items[i]) + '</option>')
                    );
                }

                $field.append($input);
            } else {
                if (item.type === Form.TYPE.DATE && this.data[key]) {
                    let date = new Date(this.data[key]);
                    this.data[key] = date.toString("yyyy-MM-dd");
                }
                if (item.type === Form.TYPE.TEXTAREA) {
                    $input = $('<textarea ' + base + (item.rows ? ' rows="' + item.rows + '"' : '') + '>' + (this.data[key] ? this.data[key] : '') + '</textarea>');
                } else {
                    $input = $('<input type="' + item.type + '" ' + base + ' value="' + (this.data[key] ? this.data[key] : '') + '">');
                }

                $field.append($input);
                $input.on('keyup', validator);
            }

            $input.on('change', validator);

            if (item.help) {
                $field.addClass('group');
                $field.append(this._createHelp(item.help));
            }

            return $field;
        }

        _createHelp(text) {
            let url = Form.VALIDATION.URL.validator(text);
            var html = '';
            if (url) {
                html += '<a target="_blank" class="help" href="' + text + '">';
            } else {
                html += '<span class="help" title="' + _(text) + '">';
            }
            html += '<i class="fa fa-question"></i>';
            if (url) {
                html += '</a>';
            } else {
                html += '</span>';
            }

            return $(html);
        }

        _nameToId(name) {
            return "form-" + name.replace('.', '-');
        }

        _validate(key) {
            let validators = this.items[key].validators;
            if (validators) {
                let value = $("#" + this._nameToId(key)).val();
                for (let i in validators) {
                    if (!validators[i][0].validator(value)) {
                        return validators[i][1];
                    }
                }
            }
            return true;
        }

        _getData(items) {
            var get = {};
            for (let key in items) {
                get[key] = items[key].default ? items[key].default : null;
            }
            let THIS = this;
            return new Promise((cb) => {
                Data.get(get, function (items) {
                    THIS.data = items;
                    cb();
                });
            });
        }

        _harvestValues() {
            let values = {};
            let THIS = this;
            for (let key in THIS.items) {
                let item = THIS.items[key];
                if (THIS.nonValue.indexOf(item.type) !== -1 || item.noSync)
                    continue;
                let $input = $("#" + THIS._nameToId(key));
                if (THIS._validate(key) !== true) {
                    $input.trigger('change');
                    return;
                }
                if (item.type === Form.TYPE.CHECKBOX) {
                    values[key] = $input.is(':checked');
                } else {
                    values[key] = $input.val();
                }
                if (item.type === Form.TYPE.DATE && values[key]) {
                    let date = new Date(values[key]);
                    values[key] = date.getTime();
                }
            }
            return Promise.resolve(values);
        }

        _saveData(harvestedValues) {
            return new Promise((cb) => {
                Data.set(harvestedValues, function () {
                    cb();
                });
            });
        }
    }

    // var EXAMPLE = {
    //     "test": {
    //         type: Form.TYPE.TEXT,
    //         label: 'testLabel',
    //         default: 'testValue',
    //     },
    //     "test2": {
    //         type: Form.TYPE.TEXT,
    //         label: 'testLabel2',
    //         default: 'testValue2',
    //         help: 'somHelp'
    //     },
    //     "test3": {
    //         type: Form.TYPE.TEXT,
    //         label: 'testLabel3',
    //         help: 'http://www.w3schools.com/html/html_form_input_types.asp'
    //     },
    //     "test4": {
    //         type: Form.TYPE.TEXTAREA,
    //         label: 'testLabel3',
    //         validators: [
    //             [Form.VALIDATION.REQUIERED, "needToFill"]
    //         ],
    //         rows: 10
    //     },
    //     "email": {
    //         type: Form.TYPE.EMAIL,
    //         label: 'email',
    //     },
    //     "time": {
    //         type: Form.TYPE.TIME,
    //         label: 'time',
    //         default: '08:32'
    //     },
    //     "checkbox": {
    //         type: Form.TYPE.CHECKBOX,
    //         label: "zaskrtni to"
    //     },
    //     "select": {
    //         type: Form.TYPE.SELECT,
    //         label: "vyber",
    //         items: {
    //             abc: "AB CD",
    //             xxx: "XxX"
    //         }
    //     },
    //     "submit": {
    //         type: Form.TYPE.SUBMIT,
    //         label: "Submit"
    //     },
    //     "reset": {
    //         type: Form.TYPE.RESET,
    //         label: "Reste"
    //     },
    //     "link": {
    //         type: Form.TYPE.LINK_BUTTON,
    //         label: "Link",
    //         url: "https://mail.google.com/mail/u/0/#inbox"
    //     },
    //     "cb": {
    //         type: Form.TYPE.CB_BUTTON,
    //         label: "CallMe",
    //         callback: function () {
    //             console.error("Nezavolam");
    //         }
    //     }
    // };

    return Form;
});