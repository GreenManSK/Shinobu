define(function (require) {
    var NAMESPACE = "Shinobu/Render";
    var SHINOBU_SPACE = "Shinobu.";

    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var Note = require("Shinobu/Types/Note");

    var colorPicker = function (item, opt, root) {
        var html = '<ul class="color-picker">';
        for (var c in Note.Color) {
            html += '<li class="' + Note.Color[c] + '"></li>';
        }
        html += '</ul>';

        $(html)
            .appendTo(this)
            .on('click', 'li', function () {
                item.panel.changeColor(item.note, $(this).attr('class'));
                root.$menu.trigger('contextmenu:hide');
            });
    };

    class PanelNote {
        constructor() {
            this.divClass = ".notes";
            this.shinobu = new Synchronized("Shinobu");

            this.noteObjs = {};
            this.notes = [];
            this.panelNotes = [];
            this.contextMenus = {};

            this._onDelete = [];

            this.$mainElement = $(this.divClass);
            $.contextMenu.types.colorPicker = colorPicker;
        }

        render() {
            var THIS = this;
            this.shinobu.get({
                notes: [],
                panelNotes: []
            }).then((items) => {
                if (items['notes'].length === 0) {
                    return Note.create().then((note) => {
                        items['notes'].push(note.id);
                        return items;
                    });
                }
                return items;
            }).then((items) => {
                if (items['panelNotes'].length === 0) {
                    return THIS.shinobu.set("panelNotes", Synchronized.arrayAdder(items['notes'][0])).then(() => {
                        items['panelNotes'].push(items['notes'][0]);
                        return items;
                    });
                }
                return items;
            }).then((items) => {
                this.notes = items['notes'];
                this.panelNotes = items['panelNotes'];
                Note.getAll(items['notes']).then((elements) => {
                    THIS.noteObjs = elements;
                    THIS._prepareEvents();
                    THIS._renderAll();
                });
            });
        }

        _renderAll() {
            this.$mainElement.empty();
            for (let i in this.panelNotes) {
                let id = this.panelNotes[i];
                this._renderOne(i, this.noteObjs[id]);
            }
        }

        addPanel(id, index) {
            this.panelNotes.splice(index, 0, id);
            this.shinobu.set("panelNotes", this.panelNotes);
            this._renderAll();
        }

        removePanel(index) {
            this.panelNotes.splice(index, 1);
            this.shinobu.set("panelNotes", this.panelNotes);
            this._renderAll();
        }

        changeColor(id, color) {
            this.noteObjs[id].color = color;
            $("[note-id=" + this.elementSelector({id: id}) + "]").removeClass(Object.values(Note.Color).join(" ")).addClass(color);
            (new Note(id)).set("color", color);
        }

        changeTitle(id, title) {
            this.noteObjs[id].title = title;
            (new Note(id)).set("title", title);
        }

        changeFontSize(id, size, adding = false) {
            let $elem = $("[note-id=" + this.elementSelector({id: id}) + "]");
            let data = $elem.data("note");
            if (adding) {
                size = (data.fontSize ? $elem.data("note").fontSize : 14) + size;
            }
            $elem.find("textarea").css("fontSize", size + "px");
            (new Note(id)).set("fontSize", size);
            data.fontSize = size;
            $elem.data("note", data);
        }

        changePanelNote(index, id) {
            this.panelNotes[index] = id;
            this.shinobu.set("panelNotes", this.panelNotes);
        }

        add(index = null) {
            let THIS = this;
            return Note.create().then((note) => {
                THIS.noteObjs[note.id] = {
                    id: note.id,
                    title: note.id
                };
                THIS.notes.push(note.id);
                if (index !== null) {
                    THIS.panelNotes[index] = note.id;
                    THIS.shinobu.set("panelNotes", THIS.panelNotes);
                }
                return Note.getAll(note.id).then((note) => {
                    THIS.noteObjs[note.id] = note;
                    if (index !== null) {
                        THIS._renderOne(index, note);
                    }
                    return note;
                });
            });
        }

        onDelete(callback) {
            this._onDelete.push(callback);
        }

        delete(id) {
            if (this.notes.length <= 1) {
                return;
            }
            let replace = this.notes[0];
            if (id === replace) {
                replace = this.notes[1]
            }
            for (let i in this.panelNotes) {
                if (this.panelNotes[i] === id) {
                    this.panelNotes[i] = replace;
                    this._renderOne(i, this.noteObjs[replace])
                }
            }
            delete this.noteObjs[id];

            for (let i in this._onDelete) {
                this._onDelete[i](id, replace);
            }

            this.notes.splice(this.notes.indexOf(id), 1);
            (new Note(id)).delete().then(() => {
                this.shinobu.set({
                    panelNotes: this.panelNotes,
                    notes: Synchronized.arrayDeleter(id)
                });
            });
        }

        _prepareMenu(note) {
            let THIS = this;
            if (!this.contextMenus[note.id]) {
                $.contextMenu({
                    selector: "[note-id=" + this.elementSelector(note) + "]:not(.noMenu)",
                    build: function ($elem) {
                        let index = $elem.data('index');
                        return {
                            items: {
                                title: {
                                    type: "text",
                                    value: note.title,
                                    className: "titleText",
                                    events: {
                                        change: function (e) {
                                            let val = $(this).val();
                                            if (e.data.items.title.value !== val) {
                                                e.data.items.title.value = val;
                                                THIS.changeTitle(note.id, val);
                                            }
                                        },
                                        keyup: function (e) {
                                            if (e.keyCode === 13) {
                                                $(this).trigger("change");
                                            }
                                        }
                                    }
                                },
                                fontSize: {
                                    name: _("fontSize"),
                                    type: "text",
                                    value: note.fontSize ? note.fontSize : 14,
                                    className: "fontSize",
                                    events: {
                                        change: function (e) {
                                            let val = parseFloat($(this).val());
                                            if (e.data.items.fontSize.value !== val) {
                                                e.data.items.fontSize.value = val;
                                                THIS.changeFontSize(note.id, val);
                                            }
                                        },
                                        keyup: function (e) {
                                            let $this = $(this);
                                            switch (e.keyCode) {
                                                case 38: //Up arrow
                                                    $this.val(parseFloat($this.val()) + 1);
                                                    $this.trigger("change");
                                                    break;
                                                case 40: //Down arrow
                                                    $this.val(parseFloat($this.val()) - 1);
                                                    $this.trigger("change");
                                                    break;
                                                case 13: //Enter
                                                    $this.trigger("change");
                                                    break;
                                            }
                                        }
                                    }
                                },
                                "sep1": "---------",
                                colorPicker: {type: "colorPicker", customName: "", panel: THIS, note: note.id},
                                split: {
                                    name: _("split"),
                                    icon: "fa-columns",
                                    className: "joining",
                                    callback: (key, options) => {
                                        THIS.addPanel(note.id, index);
                                    }
                                },
                                join: {
                                    name: _("join"),
                                    icon: "fa-window-maximize",
                                    disabled: THIS.panelNotes.length <= 1,
                                    className: "joining",
                                    callback: (key, options) => {
                                        THIS.removePanel(index);
                                    }
                                },
                                "sep2": "---------",
                                "add": {
                                    name: _("add"),
                                    icon: "fa-plus",
                                    callback: (key, options) => {
                                        THIS.add(index, note.id);
                                    }
                                },
                                "change": {
                                    name: _("change"),
                                    "items": THIS._changeItems(index, note.id),
                                    disabled: THIS.notes.length <= 1,
                                },
                                delete: {
                                    name: _("delete"),
                                    icon: "fa-trash",
                                    disabled: THIS.notes.length <= 1,
                                    callback: (key, options) => {
                                        THIS.delete(note.id);
                                    }
                                }
                            }
                        };
                    }
                });
                this.contextMenus[note.id] = true;
            }
        }

        _changeItems(index, activeId) {
            let THIS = this;
            let callback = function (id) {
                THIS.changePanelNote(index, id);
                THIS._renderOne(index, THIS.noteObjs[id]);
            };
            let items = {};
            for (let i in this.noteObjs) {
                items[i] = {
                    name: this.noteObjs[i].title
                };
                if (i === activeId) {
                    items[i].className = "active";
                } else {
                    items[i].callback = callback;
                }
            }
            return items;
        }

        _prepareEvents() {
            let THIS = this;
            this.$mainElement.onTyping('textarea', {
                stop: function (event, $elem) {
                    let id = THIS.elementIdFromSelector($elem.parent(".note").attr('note-id'));
                    THIS.noteObjs[id].text = $elem.val();
                    $("[note-id=" + THIS.elementSelector({id: id}) + "] textarea").val(THIS.noteObjs[id].text);
                    (new Note(id)).set("text", THIS.noteObjs[id].text);
                },
                delay: 400
            });
            $(window).on("keydown", function (e) {
                if (e.target.tagName.toLowerCase() == "textarea" && $(e.target).parents(THIS.divClass).length > 0) {
                    if (e.ctrlKey && (e.keyCode == 107 || e.keyCode == 109)) {
                        e.preventDefault();
                        let id = THIS.elementIdFromSelector($(e.target).parent(".note").attr('note-id'));
                        THIS.changeFontSize(id, e.keyCode == 107 ? 1 : -1, true);
                    }
                }
            });
        }

        _renderOne(index, note) {
            let $note = $("#note" + index);
            this._prepareMenu(note);
            if ($note.length <= 0) {
                $note = this.createNote(note);
                $note.data("index", index);
                $note.attr('id', "note" + index);

                this.$mainElement.append($note);
            } else {
                $note.removeClass(Object.values(Note.Color).join(" ")).addClass(note.color);
                $note.attr('note-id', this.elementSelector(note));
                $note.data("note", note);
                this._prepareTextarea($note.find("textarea"), note);
            }
        }

        createNote(note) {
            let $note = $("<div class='note'></div>");

            $note.addClass(note.color);
            $note.attr('note-id', this.elementSelector(note));
            $note.data('note-id', note.id);

            $note.data("note", note);

            let $textarea = $("<textarea></textarea>");
            this._prepareTextarea($textarea, note);

            $note.append($textarea);
            return $note;
        }

        _prepareTextarea($textarea, note) {
            if (note.fontSize) {
                $textarea.css("font-size", note.fontSize + "px");
            }
            $textarea.val(note.text);
        }

        elementSelector(element) {
            return "e" + element.id.replace(/#/g, "-");
        }

        elementIdFromSelector(selector) {
            return selector.replace(/^e/, "").replace(/-/g, "#");
        }
    }

    return PanelNote;
});