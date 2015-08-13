var socket = io();

socket.errorTime = 7500;

socket.on('presenter', function (data) {
    if (typeof data.head !== 'undefined') {
        $('head *:not(.default)').remove();
        var $head = $('head');
        $head.append(data.head);
    }

    if (typeof data.title !== 'undefined') {
        $('title').text(data.title);
    }

    if (typeof data.body !== 'undefined') {
        $('#content-snippet').html(data.body);
    }

    if (typeof data.scripts !== 'undefined') {
        $('#scripts').html(data.scripts);
    }

    if (typeof data.callback !== 'undefined' && typeof socket.callbacks[data.callback] !== 'undefined') {
        socket.callbacks[data.callback](data);
    }
});

socket.on('action', function (data) {
    if (typeof data.title !== 'undefined') {
        $('title').text(data.title);
    }

    if (typeof data.body !== 'undefined') {
        $('#content-snippet').html(data.body);
    }

    if (typeof data.callback !== 'undefined' && typeof socket.callbacks[data.callback] !== 'undefined') {
        socket.callbacks[data.callback](data);
    }
});

socket.dataToQuery = function (query, data) {
    for (var i in data) {
        switch (i) {
            case 'url':
                query['_url'] = data[i];
                break;
            case 'responseEvent':
                query['_responseEvent'] = data[i];
                break;
            default:
                query[i] = data[i];
        }
    }
    return query;
};

socket.callbacks = [];
socket.callbacksIndex = 0;

socket.doEmit = function (presenter, url, data, cb, defMsgs) {
    if (typeof defMsgs === 'undefined')
        defMsgs = true;

    if (defMsgs) {
        var loadingMsgDeleter = SocketMsg.addMessege(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');
    }

    var query = {
        url: url,
        cookies: Cookies.get()
    };

    query = socket.dataToQuery(query, data);
    var cbId = socket.callbacksIndex++;
    query.callback = cbId;
    socket.callbacks[cbId] = function (data) {
        if (defMsgs) {
            loadingMsgDeleter();
        }

        if (defMsgs && data.error) {
            SocketMsg.addMessege('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.saveError, {
                duration: errorTime,
                error: true
            });
        } else {
            if (cb)
                cb(data);
        }
    };

    socket.emit(presenter ? 'presenter' : 'action', query);
};

socket.actionIndex = 0;
socket.emitSignal = function (url, data, cb, defMsgs) {
    if (typeof defMsgs === 'undefined')
        defMsgs = true;
    var action = "action" + this.actionIndex++;

    if (defMsgs)
        var loadingMsgDeleter = SocketMsg.addMessege(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');

    socket.on(action, function (returnData) {
        if (defMsgs)
            loadingMsgDeleter();

        socket.off('orderChange');

        if (defMsgs && data.error) {
            SocketMsg.addMessege('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.saveError, {
                duration: errorTime,
                error: true
            });
        } else {
            cb(returnData);
        }
    });
    var query = {
        url: url,
        responseEvent: action,
        cookies: Cookies.get()
    };

    for (var i in data) {
        switch (i) {
            case 'url':
                query['_url'] = data[i];
                break;
            case 'responseEvent':
                query['_responseEvent'] = data[i];
                break;
            default:
                query[i] = data[i];
        }
    }

    socket.emit('doSignal', query);
};

/* Start app */
socket.doEmit(true, window.location.href, {}, null, false);