//RequireJs Configuration
requirejs.config({
    baseUrl: 'js', // Require starts in js directory
    paths: {
        lib: '../libs'
    }
});

define(function (require) {
    "use strict";
    var Data = require("Base/Data");
    require("Base/Synchronized");
    require("Base/Translator");

    var dispatcher = require("Background/Messages/Dispatcher");

    dispatcher.start();
});