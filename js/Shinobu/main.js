//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

define(function (require) {
    "use strict";

    // Requires
    require("https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.1/less.min.js");
    less.env = "development";
    less.watch();
    require(["lib/jquery"], function () {
        require(["lib/ui.position.min", "lib/contextMenu.min", "lib/jquery-ui.min", "lib/jquery.typing-0.2.0.min"], function () {
            $(function () {
                start();
            });
        });
    });

    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");

    require("Shinobu/Types/Note");
    var PanelNote = require("Shinobu/Render/PanelNote");

    var MainMenu = require("Base/MainMenu");

    function start() {
        translateWholeDom();
        MainMenu.start();
        (new PanelNote()).render();
        // let $grid = $(".iconGrid");
        // $grid.sortable({
        //     placeholder: "placeholder",
        //     cancel: ".open"
        // });
    }
});