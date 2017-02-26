define(function (require) {
    var NAMESPACE = "Shinobu/Render";
    var SHINOBU_SPACE = "Shinobu.";

    var Data = require("Base/Data");
    var Synchronized = require("Base/Synchronized");
    var Note = require("Shinobu/Types/Note");
    var Tab = require("Shinobu/Types/Tab");
    var Icon = require("Shinobu/Types/Icon");
    var IconForm = require("Shinobu/Form/IconForm");
    var IconRender = require("Kirino/Render/Icon");

    var ACTIVE_TAB_CLASS = "active";
    var ICON_ADD_BUTTON = '<a title="' + _("add") + '" href="#add" class="placeholder"><i class="fa fa-plus" aria-hidden="true"></i></a>';
    var NO_SORTABLE_CLASS = "nono";
    var ICON_CLASS = "grid-icon";
    var HIDE_CLASS = "hide";

    class QuickAccess {
        constructor(panelNote) {
            this.iconGridSelector = ".iconGrid";
            this.tabsSelector = ".tabs";
            this.shinobu = new Synchronized("Shinobu");

            this.panelNote = panelNote;
            this.panelNote.onDelete(this.onNoteDelete.bind(this));

            this.tabs = [];
            this.tabsObjs = {};
            this.defaultTab = null;
            this.activeTab = null;

            this.$tabs = $(this.tabsSelector);
            this.$iconGrid = $(this.iconGridSelector);
        }

        render() {
            this.shinobu.get({
                tabs: [],
                defaultTab: null
            }).then(this._prepareData.bind(this)).then(this._renderAll.bind(this));
        }

        _prepareData(items) {
            let THIS = this;
            return new Promise((cb) => {
                if (items.tabs.length === 0) {
                    return Tab.create(_("quickAccess"), "th-large").then((tab) => {
                        items['tabs'].push(tab.id);
                        cb(items);
                    });
                }
                cb(items);
            }).then((items) => {
                THIS.tabs = items.tabs;
                THIS.defaultTab = items['defaultTab'];
                if (THIS.defaultTab === null) {
                    THIS.defaultTab = items['tabs'][0];
                }
                return Tab.getAll(items.tabs);
            }).then((tabs) => {
                THIS.tabsObjs = tabs;
            });
        }

        _renderAll() {
            this.renderTabs();
            if (this.activeTab === null)
                this.activeTab = this.defaultTab;
            this.renderIcons(this.activeTab);
        }

        renderTabs() {
            let $ul = $("<ul></ul>");
            for (let i in this.tabs) {
                let tab = this.tabsObjs[this.tabs[i]];
                let $li = $("<li></li>");
                let $a = $("<a></a>");

                $a.attr({
                    href: "#" + tab.id,
                    title: tab.name
                });
                $a.html((new IconRender(
                    tab.img ? IconRender.Type.IMG : IconRender.Type.ICON,
                    tab.icon,
                    false)).html);

                if (tab.id === this.defaultTab) {
                    $a.addClass(ACTIVE_TAB_CLASS);
                }

                $li.append($a);
                $ul.append($li);
            }
            this.$tabs.empty();
            this.$tabs.append($ul);
        }

        renderIcons(id) {
            this.$iconGrid.empty().data('tab-id', id);
            this._prepareContextMenu();
            this._prepareSortable();
            this._prepareEvents();

            let icons = this.tabsObjs[id].icons;
            let THIS = this;
            if (icons.length > 0) {
                Icon.getAllInconsistent(icons).then((iconsObj) => {
                    for (let i in iconsObj) {
                        if (iconsObj[i].class instanceof Icon) {
                            this.$iconGrid.append(THIS.createIcon(iconsObj[i]));
                        } else {
                            let $note = THIS.panelNote.createNote(iconsObj[i]);
                            $note.addClass(NO_SORTABLE_CLASS);
                            $note.append($("<div class='text " + HIDE_CLASS + "'></div>"));
                            THIS.panelNote._prepareMenu(iconsObj[i]);
                            $note.addClass(ICON_CLASS);
                            this.$iconGrid.append($note);
                            $note.trigger("dblclick");
                        }
                    }
                });
            } else {
                let addButton = $(ICON_ADD_BUTTON);
                addButton.on('click', function (e) {
                    e.preventDefault();
                    THIS._openModal(id);
                });
                this.$iconGrid.append(addButton);
            }
        }

        _openModal(tabId, iconId = null) {
            let THIS = this;
            (new IconForm(iconId, THIS.tabsObjs[tabId].class, function (values) {
                if (THIS.tabsObjs[tabId].icons.indexOf(values.id) === -1) {
                    THIS.tabsObjs[tabId].icons.push(values.id);
                }
                THIS.renderIcons(tabId);
            }, THIS)).render();
        }

        _prepareSortable() {
            if (this.sortablePrepared)
                return;
            this.sortablePrepared = true;

            let THIS = this;
            this.$iconGrid.sortable({
                placeholder: "placeholder",
                cancel: "." + NO_SORTABLE_CLASS,
                tolerance: "pointer",
                stop: function (event, ui) {
                    if (ui.position.left === ui.originalPosition.left && ui.position.top === ui.originalPosition.top)
                        return;
                    let tabId = THIS.$iconGrid.data("tab-id");
                    let order = [];
                    THIS.$iconGrid.find("." + ICON_CLASS).each(function () {
                        let id = $(this).data("icon-id");
                        if (!id)
                            id = $(this).data("note-id");
                        order.push(id);
                    });
                    THIS.tabsObjs[tabId].icons = order;
                    THIS.tabsObjs[tabId].class.set("icons", order);
                }
            });
        }

        _prepareEvents() {
            if (this.eventsPrepared)
                return;
            this.eventsPrepared = true;
            this.$iconGrid.on("dblclick", ".note", function (event) {
                event.preventDefault();
                let $this = $(this);
                let $textarea = $this.find("textarea");
                $this.toggleClass(NO_SORTABLE_CLASS);
                $this.toggleClass("noMenu");
                $textarea.toggleClass(HIDE_CLASS);
                $this.find(".text").text($textarea.val()).css('font-size', $textarea.css('font-size')).toggleClass(HIDE_CLASS);
            });
        }

        _prepareContextMenu() {
            if (this.contextMenuPrepared)
                return;
            this.contextMenuPrepared = true;
            let THIS = this;
            $.contextMenu({
                selector: this.iconGridSelector + ' a, ' + this.iconGridSelector + ' .note.noMenu',
                callback: function (key, options) {
                    let tabId = THIS.$iconGrid.data('tab-id');
                    let iconId = $(this).data("icon-id");
                    let noteId = $(this).data("note-id");
                    switch (key) {
                        case "add":
                            THIS._openModal(tabId);
                            break;
                        case "addNote":
                            THIS._addNote(tabId);
                            break;
                        case "edit":
                            THIS._openModal(tabId, iconId);
                            break;
                        case "delete":
                            THIS._deleteIcon(tabId, iconId);
                            break;
                        case "editNote":
                            $(this).trigger("dblclick");
                            break;
                        case "deleteNote":
                            THIS._deleteNote(tabId, noteId);
                            break;
                    }
                },
                build: function ($elem) {
                    let iconId = $elem.data("icon-id");
                    let noteId = $elem.data("note-id");
                    let items = {
                        add: {name: _("addIcon"), icon: "fa-plus"},
                        addNote: {name: _("addNote"), icon: "fa-plus"},
                    };
                    if (iconId) {
                        items.edit = {name: _("edit"), icon: "fa-pencil"};
                        items.delete = {name: _("delete"), icon: "fa-trash"};
                    }
                    if (noteId) {
                        items.editNote = {name: _("enableEdit"), icon: "fa-pencil"};
                        items.deleteNote = {name: _("delete"), icon: "fa-trash"};
                    }
                    return {
                        items: items
                    };
                }
            });
        }

        _addNote(tabId) {
            let THIS = this;
            this.panelNote.add().then((note) => {
                THIS.tabsObjs[tabId].icons.push(note.id);
                THIS.renderIcons(tabId);
                THIS.tabsObjs[tabId].class.set({
                    icons: Synchronized.arrayAdder(note.id)
                });
            });
        }

        _deleteNote(tabId, noteId) {
            this.panelNote.delete(noteId);
        }

        onNoteDelete(noteId, replacement) {
            let activeTab = this.$iconGrid.data("tab-id");
            for (let i in this.tabsObjs) {
                let index = this.tabsObjs[i].icons.indexOf(noteId);
                if (index !== -1) {
                    this.tabsObjs[i].icons.splice(index, 1);
                    if (activeTab === i)
                        this.renderIcons(i);
                    this.tabsObjs[i].class.set({
                        icons: Synchronized.arrayDeleter(noteId)
                    });
                }
            }

        }

        _deleteIcon(tabId, iconId) {
            let THIS = this;
            (new Icon(iconId)).delete().then(() => {
                THIS.tabsObjs[tabId].class.set({
                    icons: Synchronized.arrayDeleter(iconId)
                }).then(() => {
                    THIS.tabsObjs[tabId].icons.splice(THIS.tabsObjs[tabId].icons.indexOf(iconId), 1);
                    THIS.renderIcons(tabId);
                });
            });
        }

        createIcon(icon) {
            let $a = $("<a></a>");

            $a.addClass(ICON_CLASS);

            $a.attr({
                href: icon.link,
                title: icon.title
            });

            $a.data("icon-id", icon.id);

            $a.html((new IconRender(icon.img ? IconRender.Type.IMG : IconRender.Type.ICON, icon.icon, false)).html);

            return $a;
        }
    }

    return QuickAccess;
});