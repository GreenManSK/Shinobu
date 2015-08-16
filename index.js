var config = require("./libs/Config")("config.json");
var context = require("./libs/Context")(config);

context.addLib('config', '../libs/Config');
context.addLib('context', '../libs/Context');

context.addLib("intercept-stdout", "intercept-stdout");
context.addService("saver", "libs/Saver");
context.addService("scheduler", "libs/Scheduler");
context.addService("cmd", "libs/Cmd");

context.addLib("dust", "dustjs-linkedin");
context.addLib("dustjs-helpers", "dustjs-helpers");
if (!config.get("minify.html", false)) {
    context.getLib("dust").optimizers.format = function (ctx, node) {
        return node;
    };
}
context.getLib("dust").helpers.exec = function (chunk, context, bodies, params) {
    var args = JSON.parse(params.args.replace(/'/g, '"'));
    var object = context.stack.head;

    params.func.split('.').some(function (property) {
        if (typeof (object[property]) === "function") {
            var result = object[property].apply(object, args);
            chunk.write(result);
            return true;
        } else if (typeof (object[property]) === "object" && typeof (object[property].this) === "object"
                && typeof (object[property].func) === "function") {
            var result = object[property].func.apply(object[property].this, args);
            chunk.write(result);
            return true;
        } else {
            object = object[property];
            return false;
        }
    });

    return chunk;
};

context.addLib("router", "../libs/Router");
context.addService("compiler", "libs/Compiler");
context.addService("translator", "libs/Translator");
context.addService("serverHandler", "libs/ServerHandler");

context.addService("server", require('http'));
context.addService("serverHandler", "libs/ServerHandler");
context.addService("server", context.getService('server').createServer(context.getService('serverHandler').handleRequest.bind(context.getService('serverHandler'))));

context.addService("socketHandler", "libs/SocketHandler");
context.addService("notify", "libs/Notify");
context.addService("socket", require('socket.io')(context.getService('server')));
context.getService("socket").on('connection', function (socket) {
    context.getService('socketHandler').handleConnection(socket);
});


context.getService('compiler').compileAll(function () {
    context.getService("server").listen(config.get('port', 6464));
    console.log('Server running!');
    context.getService("cmd").start();
});