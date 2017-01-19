var NAMESPACE = "Kirino/Render";
define(function (require) {
    var Episode = require("Kirino/Types/Episode");

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

        updateTitle($elementTag, element) {
            var title;
            if (element.thing) {
                title = element.thing.name + " " + element.thing.class.decodeEpisodeNumber(element.number);
            } else {
                title = element.name;
            }
            $elementTag.find(".title").text(title);
        }
    };
});