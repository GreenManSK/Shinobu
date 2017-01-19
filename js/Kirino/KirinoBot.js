//namespace Kirino
var DISABLE_LOG = false;
var DISABLE_DEBUG = false;

define(function (require) {
    var oldLog = console.log;

    var FONT_SIZE = "15px";
    var BG_COLOR = "#000;";
    var KIRINO_COLOR = "orange";
    var TEXT_COLOR = "#fff";

    class KirinoBot {
        static say(text) {
            if (DISABLE_LOG)
                return;
            text = "%c " + text;
            oldLog("%c " + _("kirino") + ":" + text, "color: " + KIRINO_COLOR + "; background-color: " + BG_COLOR + "; font-size: " + FONT_SIZE, "color: " + TEXT_COLOR + "; background-color: " + BG_COLOR + "; font-size: " + FONT_SIZE);
        }
    }
    ;

    console.log = KirinoBot.say;
    console.kirino = KirinoBot.say;
    if (DISABLE_DEBUG)
        console.debug = function() {};
    
    //@todo: Upozornuj na console.error

    return KirinoBot;
});