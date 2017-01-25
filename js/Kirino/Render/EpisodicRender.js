define(function (require) {
var NAMESPACE = "Kirino/Render";
    var AEpisodic = require("Kirino/Types/AEpisodic");
    var Episode = require("Kirino/Types/Episode");

    var SHOW_MORE_CLASS = "show-more";

    return class EpisodicRender extends require("Kirino/Render/BasicRender") {
        _render(elements) {
            let episodes = [];
            for (let k in elements) {
                episodes = episodes.concat(elements[k].episodes);
            }
            Episode.getAll(episodes).then((episodes) => {
                let newElements = [];
                for (let k in elements) {
                    let show = elements[k];
                    if (show.episodes.length === 0) {
                        newElements.push(show);
                    } else {
                        for (let i in show.episodes) {
                            let epi = episodes[show.episodes[i]];
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
            $('.context-menu' + this.elementId).remove();
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
            let main = element.thing ? element.thing : element
            $elementTag.attr("thing-id", this.elementSelector(main));

            if (main.episodes.length > 0) {
                $elementTag.append($('<div class="' + SHOW_MORE_CLASS + ' ' +
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

                $.contextMenu({
                    selector: '#' + $elementTag.attr('id'),
                    className: 'context-menu' + this.elementId,
                    callback: function (key, options) {
                        if (key === 'showAll') {
                            THIS.toggleVisibility.call($elementTag);
                        }
                    },
                    items: {
                        showAll: {name: _("toggleOnlyFirst"), icon: "fa-eye-slash"}
                    }
                });

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