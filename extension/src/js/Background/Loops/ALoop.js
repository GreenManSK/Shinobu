define(function (require) {
    var NAMESPACE = "Background/Loops";
    let DEFAULT_ICON = "icons/kirino/128.png";
    var dispatcher = require("Background/Messages/Dispatcher");
    var Data = require("Base/Data");

    return class ALoop {
        static get TODAY() {
            let d = new Date();
            d.setHours(23);
            d.setMinutes(59);
            d.setSeconds(59);
            d.setMilliseconds(59);
            return d.getTime();
        }

        static get NOW() {
            return  Data.timestamp();
        }

        constructor() {

        }

        start(ids, forced = false) {
            console.error(this.constructor.name + " loop need to implement start(ids, forced) method.");
        }

        _notify(text, link = "kirino.html", icon = null) {
            dispatcher._dispatchMessage({
                name: "extensionNotifications.add",
                "text": text,
                "img": icon === null,
                "icon": icon !== null ? icon : DEFAULT_ICON,
                "link": link
            }, null);
        }

        _timeToMs(time) {
            let parts = time.split(":");
            return 1000 * 60 * (parseInt(parts[1] + 60 * parseInt(parts[0])));
        }
    };
});