define(function (require) {
    var Synchronized = require("Base/Synchronized");
    var NAMESPACE = "Shinobu/Types";
    var Shinobu = new Synchronized("Shinobu");

    class Note extends Synchronized {
        static get Color() {
            return {
                RED: "red",
                BLUE: "blue",
                GREEN: "green",
                YELLOW: "yellow",
                PINK: "pink",
                PURPLE: "purple",
                GRAY: "gray",
                CYAN: "cyan"
            };
        }

        static create(title = null,
                      text = _("defaultNoteText"),
                      color = Note.Color.GRAY) {
            return super.create().then((obj) => {
                    if (!title) {
                        title = obj.id;
                    }
                    return obj.set({
                            title: title,
                            text: text,
                            color: color
                        }
                    ).then(() => {
                        return Shinobu.set("notes", Synchronized.arrayAdder(obj.id));
                    }).then(() => {
                        return obj;
                    });
                }
            );
        }

        static attributes() {
            return ["title", "text", "color", "fontSize"];
        }
    }

    Synchronized._registerClass(Note);

    return Note;
});