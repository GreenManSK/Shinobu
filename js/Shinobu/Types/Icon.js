define(function (require) {
    var Synchronized = require("Base/Synchronized");
    var NAMESPACE = "Shinobu/Types";
    var Shinobu = new Synchronized("Shinobu");

    class Icon extends Synchronized {
        static create(title, link, icon, img = false) {
            return super.create().then((obj) => {
                return obj.set({
                    title: title,
                    link: link,
                    icon: icon,
                    img: img
                }).then(() => {
                    return obj;
                });
            });
        }

        static attributes() {
            return ["title", "link", "icon", "img"];
        }
    }

    Synchronized._registerClass(Icon);

    return Icon;
});