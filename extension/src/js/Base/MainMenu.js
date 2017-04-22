var NAMESPACE = "Base";
define(function (require) {
    var Synchronized = require("Base/Synchronized");
    var GumiAlert = require("Gumi/Alert");

    var ID = 'mainMenu';
    var MENU = {
        settings: {
            text: 'settings',
            icon: 'fa-sliders',
            class: null,
            link: 'settings.html'
        },
        gumi: {
            text: 'gumi',
            icon: null,
            class: 'gumi',
            link: "#gumi",
            callback: function (e) {
                e.preventDefault();
                GumiAlert.show();
            }
        },
        kirino: {
            text: 'kirino',
            icon: null,
            class: 'kirino',
            link: 'kirino.html'
        },
        shinobu: {
            text: 'shinobu',
            icon: null,
            class: 'shinobu',
            link: 'index.html'
        }
    };

    let Gumi = new Synchronized("Gumi");

    class MainMenu {
        constructor() {
        }

        start(newWindow = false) {
            var $body = $('body');
            this.$menu = $('<ul></ul>').attr('id', ID);
            this.redraw(newWindow);

            $body.prepend(this.$menu);
            this.listenToRedraw();
        }

        listenToRedraw() {
            let THIS = this;
            chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.name && request.name === 'mainMenu.redraw') {
                    THIS.redraw(request.newWindow);
                }
            });
        }

        redraw(newWindow) {
            Gumi.get({"serverUrl": null, publicKey: null}).then((values) => {
                let menu = Object.assign({}, MENU);
                if (!values.serverUrl || !values.publicKey)
                    delete menu.gumi;

                var $body = $('body');
                this.$menu.empty();
                for (let key in menu) {
                    if (!$body.hasClass(key)) {
                        var elem = menu[key];
                        var $li = $('<li><a ' +
                            'href="' + elem.link + '" ' +
                            'title="' + _(elem.text) + '" ' +
                            (elem.class ? 'class="icon ' + elem.class + '" ' : '') +
                            (newWindow ? ' target="_blank"' : '') +
                            '>' +
                            (elem.icon ? '<i class="fa ' + elem.icon + '" aria-hidden="true"></i>' : '') +
                            '</a></li>');
                        if (elem.hasOwnProperty("callback")) {
                            $li.on('click', elem.callback);
                        }
                        this.$menu.append($li);
                    }
                }
            });
        }
    }
    return new MainMenu();
});