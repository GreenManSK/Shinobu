define(function (require) {
    var Synchronized = require("Base/Synchronized");
    var NAMESPACE = "Shinobu/Types";
    var Shinobu = new Synchronized("Shinobu");

    class Tab extends Synchronized {
        static create(name, icon, img = false) {
            return super.create().then((obj) => {
                return obj.set({
                    name: name,
                    icon: icon,
                    img: img,
                    icons: []
                }).then(() => {
                    return Shinobu.set("tabs", Synchronized.arrayAdder(obj.id));
                }).then(() => {
                    return obj;
                });
            });
        }

        static attributes() {
            return ["icons", "name", "icon", "img"];
        }
    }

    Synchronized._registerClass(Tab);

    return Tab;
});