/* Dropdown */
$('body').on('click.dropdown', '.dropdown a.dropdown-toggle', function (e) {
    e.preventDefault();
}).on('click.dropdown', '.dropdown a.dropdown-toggle', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.hasClass('close')) {
        $this.blur();
    } else
        $this.addClass('close');
}).on('focusin.dropdown', '.dropdown', function () {
    var $ul = $(this).find('ul');
    $ul.removeClass('hidden');
    $ul.css('max-height', $(window).height() - ($ul.offset().top - $(window).scrollTop()));
}).on('focusout.dropdown', '.dropdown', function () {
    var $this = $(this);
    $this.find('ul').addClass('hidden');
    $this.find('a.dropdown-toggle').removeClass('close');
});

/* Console */
function addToConsole(data) {
    var actualData = $('.console .content').text().split("\n");

    var $content = $('.console .content');
    for (var i = 0; i <= actualData.length; i++) {
        if (actualData.slice(i, actualData.length).join("\n") === data.slice(i, actualData.length).join("\n")) {
            $('.console .content').append(document.createTextNode("\n" + data.slice(actualData.length, data.length).join("\n")));
            $content.scrollTop($content.prop("scrollHeight"));
            return;
        }
    }
    $('.console .content').append(document.createTextNode("\n" + data.join("\n")));
    $content.scrollTop($content.prop("scrollHeight"));
}

new ResizeSensor($('.console'), function () {
    var $content = $('.console .content');
    $content.scrollTop($content.prop("scrollHeight"));
});

$('body').on('keypress', '.console input[name=cmd]', function (e) {
    if (e.type === 'keypress' && e.which === 13) {
        var $this = $(this);
        socket.emitSignal(parseCmd, {cmd: $this.val()}, function (data) {
            $('.console .content').text(data.join("\n"));
            $this.val('');
            addToConsole(data);
        });
    }
});