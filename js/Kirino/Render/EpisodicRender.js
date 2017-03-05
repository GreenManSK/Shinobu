define(function (require) {
    var NAMESPACE = "Kirino/Render";
    var AEpisodic = require("Kirino/Types/AEpisodic");
    var Episode = require("Kirino/Types/Episode");
    var Synchronized = require("Base/Synchronized");
    var FormLinker = require("Form/Linker");
    var BasicRender = require("Kirino/Render/BasicRender");

    var SHOW_MORE_CLASS = "show-more";

    return class EpisodicRender extends require("Kirino/Render/BasicRender") {
        constructor(elementId, color, column, icon, settings) {
            super(elementId, color, column, icon, settings);
            this.shinobu = new Synchronized("Shinobu");

            let THIS = this;
            this.shinobu.get("developerMode", false).then((val) => {
                THIS.developerMode = val;
            });
        }

        _render(elements) {
            let episodes = [];
            for (let k in elements) {
                episodes = episodes.concat(elements[k].episodes);
            }
            Episode.getAll(episodes).then((episodes) => {
                let newElements = [];
                for (let k in elements) {
                    let show = elements[k];
                    show.epObj = {};
                    if (show.episodes.length === 0) {
                        newElements.push(show);
                    } else {
                        for (let i in show.episodes) {
                            let epi = episodes[show.episodes[i]];
                            show.epObj[epi.id] = epi;
                            epi.thing = show;
                            if (!epi.seen) {
                                newElements.push(epi);
                            }
                        }
                    }
                }

                super._render(newElements);
            });
        }

        _cleanUp() {
            super._cleanUp();
        }

        updateTitle($elementTag, element) {
            var title;
            if (element.thing) {
                title = element.thing.name + " " + element.thing.class.decodeEpisodeNumber(element.number);
            } else {
                title = element.name;
            }
            $elementTag.find(".title").text(title);
        }

        updateOther($elementTag, element) {
            super.updateOther($elementTag, element);
            let THIS = this;
            let main = element.thing ? element.thing : element;
            $elementTag.attr("thing-id", this.elementSelector(main));

            if (main.episodes.length > 0) {
                if (!main.unseen) {
                    main.unseen = "";
                    let first = true;
                    for (let i in main.episodes) {
                        if (first) {
                            first = false;
                            continue;
                        }
                        let epi = main.epObj[main.episodes[i]];
                        main.unseen += main.name + " " + main.class.decodeEpisodeNumber(epi.number) + "\n";
                    }
                }
                $elementTag.append($('<div title="' + main.unseen + '" class="' + SHOW_MORE_CLASS + ' ' +
                    (main.showAll === false ? '' : 'hide') +
                    '"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></div>'));
                if (main.showAll === false) {
                    if (main.shownFirst) {
                        $elementTag.addClass("hide");
                    } else {
                        main.shownFirst = true;
                    }
                }
                $elementTag.on('click', '.' + SHOW_MORE_CLASS, this.toggleVisibility);
                $elementTag.addClass($elementTag.attr('id'));
                THIS.contextMenus = THIS.contextMenus ? THIS.contextMenus : {};
                if (!THIS.contextMenus[$elementTag.attr('id')])
                    $.contextMenu({
                        selector: '.' + $elementTag.attr('id'),
                        callback: function (key, options) {
                            if (key === 'showAll') {
                                THIS.toggleVisibility.call($elementTag);
                            }
                        },
                        items: {
                            showAll: {name: _("toggleOnlyFirst"), icon: "fa-eye-slash"}
                        }
                    });
                THIS.contextMenus[$elementTag.attr('id')] = true;

                // #Seen
                if (element.date && element.date <= BasicRender.TODAY) {
                    let $seen = $('<a href="#seen"  class="seen" title="' + _('seen') + '"><i class="fa fa-eye"></i></a>');
                    $seen.on('click', function (e) {
                        e.preventDefault();
                        THIS._seen(element);
                    });

                    let $date = $elementTag.find('.info .date');
                    $seen.insertAfter($date);
                    $("<span>&nbsp;/&nbsp;</span>").insertAfter($seen);
                } else if (THIS.developerMode) { // #Delete episode
					let $deleteEpisode = $('<a href="#deleteEpisode"  class="deleteEpisode" title="' + _('deleteEpisode') + '"><i class="fa fa-minus-square-o"></i></a>');
					
                   $deleteEpisode.on('click', function (e) {
                        e.preventDefault();
                        THIS._seen(element);
                    });
					
                    let $edit = $elementTag.find('.info .edit');
                    $deleteEpisode.insertBefore($edit);
                    $("<span>&nbsp;/&nbsp;</span>").insertAfter($deleteEpisode);
                }

                // #Edit
                let editLink = FormLinker.createLink(FormLinker.FORM_MODULE + THIS.elementId, main.id);
                let $edit = $elementTag.find('.edit');
                $edit.attr("href", editLink);

                // #Delete
                let $delete = $elementTag.find('.delete');
                $delete.off('click');
                $delete.on('click', function (e) {
                    e.preventDefault();
                    THIS._delete(main);
                });
            }
        }

        toggleVisibility(event) {
            if (event)
                event.preventDefault();
            let thingSelector = $(this).parent('li').attr('thing-id');
            if (!thingSelector)
                thingSelector = $(this).attr('thing-id');

            let thingId = EpisodicRender.elementIdFromSelector(thingSelector);

            $("li[thing-id='" + thingSelector + "'], li[thing-id='" + thingSelector + "'] ." + SHOW_MORE_CLASS).toggleClass("hide").first().removeClass("hide");
            new AEpisodic(thingId).set("showAll", (v) => !v);
        }

        _seen(element) {
            let THIS = this;
            let obj = new THIS.elementClass(element.id);
            let main = new THIS.elementClass(element.thing.id);
            THIS._startLoading();
            obj.delete().then(() => {
                main.set("episodes", Synchronized.arrayDeleter(element.id)).then(() => {
                    THIS.render();
                });
                // THIS.kirino.set(this.elementId, Synchronized.arrayDeleter(element.id)).then(() => {
                //     Notifications.notify(_("deleteSuccess"), Notifications.Type.SUCCESS);
                //     THIS.render();
                // });
            });
        }

        _delete(element) {
            super._delete(element);
            var THIS = this;
            for (let i in element.episodes) {
                let obj = new Episode(element.episodes[i]);
                obj.delete();
            }
        }

    };
});