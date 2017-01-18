//namespace Kirino/Render
define(function (require) {
    return class Icon {
        static get Type() {
            return {
                ICON: 0,
                IMG: 1
            };
        }
        
        constructor (type, icon) {
            this.type = type;
            this.icon = icon;
        }
        
        get html() {
            if (this.type == Icon.Type.ICON) {
                return '<i class="icon fa fa-'+this.icon+'" aria-hidden="true"></i>';
            }
            return '<img class="icon" src="icons/'+this.icon+'" aria-hidden="true">';
        }
    };
});