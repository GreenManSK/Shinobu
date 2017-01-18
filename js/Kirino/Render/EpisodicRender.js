//namespace Kirino/Render
define(function (require) {
    return class EpisodicRender extends require("Kirino/Render/BasicRender") {
        render(elements) {
            var newElements = [];
            for (var k in elements) {
                var show = elements[k];
                if (show.episodes.length === 0) {
                    newElements.push(show);
                } else {
                    for (var i in show.episodes) {
                        var epi = show.episodes[i];
                        if (!epi.seen) {
                            newElements.push(epi);
                        }
                    }
                }
            }
            super.render(newElements);
        }

        updateTitle($elementTag, element) {
            var title;
            if (element.thing) {
                title = element.thing.name + " " + element.thing.decodeEpisodNumber(element.number);
            } else {
                title = element.name;
            }
            $elementTag.find(".title").text(title);
        }
    };
});