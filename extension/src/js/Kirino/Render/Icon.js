//namespace Kirino/Render
define(function (require) {
    return class Icon {
        static get Type() {
            return {
                ICON: 0,
                IMG: 1
            };
        }

        constructor(type, icon, systemIcon = true) {
            this.type = type;
            this.icon = icon;
            this.systemIcon = systemIcon;
        }

        get html() {
            if (this.type == Icon.Type.ICON) {
                return '<i class="icon fa fa-' + this.icon + '" aria-hidden="true"></i>';
            }
            return '<img class="icon" src="' + (this.systemIcon ? 'icons/' + this.icon : this.icon) + '" aria-hidden="true">';
        }
    };
});