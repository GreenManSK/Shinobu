define(function (require) {
    var NAMESPACE = "Gumi";
    var Gumi = require("Gumi/Gumi");
    var Notifications = require("Base/Notifications");

    let MODAL_CLASS = "modal-bg";
    let BOX_CLASS = "box";
    let BOX_COLOR = "green";
    let QUESTION_CLASS = "question";
    let BUTTONS_CLASS = "buttons";
    let CANCEL_BUTTON = "second";

    class Alert {
        static show() {
            let $modalBg = $('<div class="' + MODAL_CLASS + '"></div>');
            $modalBg.on('click', (e) => {
                if ($(e.target).hasClass(MODAL_CLASS)) {
                    Alert.closeModal();
                }
            });

            let $box = $("<div class='" + BOX_CLASS + " " + BOX_COLOR + "'></div>");
            let $form = $("<form></form>");

            $form.prepend($("<div class='" + QUESTION_CLASS + "'>" + _("gumiSyncAsk") + "</div>"));
            let $buttons = $("<div class='" + BUTTONS_CLASS + "'></div>");

            let $toServer = $("<button class=''>" + _("syncToServer") + "</button>");
            let $fromServer = $("<button class=''>" + _("syncFromServer") + "</button>");
            let $cancel = $("<button class='" + CANCEL_BUTTON + "'>" + _("cancel") + "</button>");

            $toServer.on("click", function(e) {
                e.preventDefault();
                Alert.closeModal();
                let cb = Alert.createNotification();
                Gumi.syncToServer(cb);
            });
            $fromServer.on("click", function(e) {
                e.preventDefault();
                Alert.closeModal();
                let cb = Alert.createNotification();
                Gumi.syncFromServer(cb);
            });
            $cancel.on("click", function(e) {
                e.preventDefault();
                Alert.closeModal();
            });

            $buttons.append($toServer);
            $buttons.append($fromServer);
            $buttons.append($cancel);

            $form.append($buttons);

            $box.prepend($form);
            $modalBg.prepend($box);
            $("body").prepend($modalBg);
        }

        static createNotification() {
            let cb = Notifications.notify("hello", Notifications.Type.WARNING, null, true);
            return function() {
                cb();
            }
        }

        static closeModal() {
            $("." + MODAL_CLASS).remove();
        }
    }

    return Alert;
});
