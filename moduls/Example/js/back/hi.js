$('body').on('click', 'img', function () {
    alert(_.greeting);
});

$('body').on('click', '.refresh', function () {
    socket.doEmit(false, window.location.href, {}, function (data) {
        console.log('Afterload callback');
        console.log('Data from loading:');
        console.log(data);
    }, false);
});

$('body').on('click', '.show', function () {
    socket.emitSignal(showUrl, {}, function (data) {
        console.log('Data from loading:');
        console.log(data);
        alert(data.msg);
    }, false);
});