var NAMESPACE = "Base";
define(function (require) {
    var ID = 'mainMenu';
    var MENU = {
        settings: {
            text: 'settings',
            icon: 'fa-sliders',
            class: null,
            link: 'settings.html'
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
    class MainMenu {
        constructor() {
        }

        start() {
            var $body = $('body');

            this.$menu = $('<ul></ul>').attr('id', ID);
            for (let key in MENU) {
                if (!$body.hasClass(key)) {
                    var elem = MENU[key];
                    var $li = $('<li><a ' +
                        'href="' + elem.link + '" ' +
                        'title="' + _(elem.text) + '" ' +
                        (elem.class ? 'class="icon ' + elem.class + '" ' : '') +
                        '>' +
                        (elem.icon ? '<i class="fa ' + elem.icon + '" aria-hidden="true"></i>' : '') +
                        '</a></li>');
                    this.$menu.append($li);
                }
            }

            $body.prepend(this.$menu);
        }
    }
    return new MainMenu();
});