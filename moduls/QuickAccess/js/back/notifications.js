function changeNotifyCount(n) {
    console.log(n);
    var $notify = $('.notify');
    if (n === 0) {
        $notify.html('<i title="' + _.notify.notifications + '" class="fa fa-optin-monster"></i>');
    } else {
        var actual = parseInt($notify.text());
        if (isNaN(actual))
            actual = 0;
        actual += n;
        $notify.text(actual);
    }
}

if (("Notification" in window)) {
    function getNotificationPremission() {
        Notification.requestPermission(function (permission) {
            if (permission !== "granted") {
                getNotificationPremission();
            }
        });
    }
    getNotificationPremission();

    function notify(data) {
        var id = data[0];
        var n = data[1];
        n.id = id;
        var options = {};

        if (n.body)
            options.body = n.body;
        if (n.img && n.img.match(/^(?:https?:\/\/|data:image)/) !== null)
            options.icon = n.img;
        else
            options.icon = window.location.origin + '/files/icon.jpg';

        var not = new Notification(n.title, options);
        not.onclick = function () {
            if (n.url) {
                var w = window.open(n.url.replace('%baseUrl%', window.location.origin), '_blank');
                w.focus();
            } else {
                window.focus();
            }
            socket.emitSignal(notifyMakeSeen, {id: id}, function () {
            });
            $('#' + id).removeClass('new');
            changeNotifyCount(-1);
        };

        dust.render("quickaccess.helpers.notification", n, function (err, html) {
            changeNotifyCount(1);
            $('.notifications').prepend(html);
        });
    }

    socket.on('notification', function (data) {
        notify(data);
    });
}

$('body').on('open', '.notifications', function () {
    var $this = $(this);
    var len = $this.find('.new').removeClass('new').size();
    changeNotifyCount(0);
    if (len > 0) {
        var id = $this.children().attr('id');
        socket.emitSignal(notifyMakeSeenAll, {id: id}, function () {
        });
    }
});