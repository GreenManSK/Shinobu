var config = require("./libs/Config")("config.json");
var context = require("./libs/Context")(config);

context.addService("cmd", "libs/Cmd");
context.addLib("intercept-stdout", "intercept-stdout");

context.getService("cmd").start();