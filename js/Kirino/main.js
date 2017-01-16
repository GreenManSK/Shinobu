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
	var md5 = require("lib/md5");
	require("Base/Synchronized");
	var Anime = require("Kirino/Types/Anime");
	var Show = require("Kirino/Types/Show");
	var OVA = require("Kirino/Types/OVA");
	var Music = require("Kirino/Types/Music");
	var Episode = require("Kirino/Types/Episode");
	
	// Start
	console.log("Hello");
	
	var data = {};
	data["anime"] = [];
});