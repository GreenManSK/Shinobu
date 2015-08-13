function SocketMsg() {
}

SocketMsg.slideTime = 500;

SocketMsg.addMessege = function (html, data) {
    var duration, error, deleteByNew;

    if (typeof data === 'object') {
        duration = data.duration;
        error = data.error;
        deleteByNew = data.deleteByNew;
    }

    var parentElment = document.getElementById('socketMessege');
    if (parentElment === null) {
        $('body').prepend('<div id="socketMessege"></div>');
    }

    var $msg = $('<div>').html(html).hide();
    
    if (deleteByNew)
        $msg.addClass('deleteByNew');
    
    if (error)
        $msg.addClass('error');
    
    var $msgs = $('#socketMessege');
    $msgs.find('.deleteByNew').remove();
    $msgs.prepend($msg);
    $msg.slideDown(this.slideTime);

    var self = this;
    var deleter = function () {
        $msg.slideUp(self.slideTime, function () {
            $msg.remove();
        });
    };

    if (typeof duration === 'undefined' || duration === null) {
        return deleter;
    } else {
        setTimeout(deleter, duration + this.slideTime);
    }
};