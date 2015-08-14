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
    var $content = $('.console .content');
    if (data.length !== 0) {
        var actualData = $content.text().split("\n");

        for (var i = 0; i <= actualData.length; i++) {
            if (actualData.slice(i, actualData.length).join("\n") === data.slice(i, actualData.length).join("\n")) {
                $content.append(document.createTextNode("\n" + data.slice(actualData.length, data.length).join("\n")));
                $content.scrollTop($content.prop("scrollHeight"));
                return;
            }
        }
        $content.append(document.createTextNode("\n" + data.join("\n")));
        $content.scrollTop($content.prop("scrollHeight"));
    } else {
        $content.text('');
    }
}

new ResizeSensor($('.console'), function () {
    var $content = $('.console .content');
    $content.scrollTop($content.prop("scrollHeight"));
});

$('.console input[name=cmd]').data('usedCmds', []).data('actualCmd', -1);
$('body').on('keyup', '.console input[name=cmd]', function (e) {
    var $this = $(this);
    if (e.which === 13) { //ENTER
        var cmd = $this.val();

        $this.data('usedCmds').push(cmd);
        $this.data('actualCmd', $this.data('usedCmds').length);

        socket.emitSignal(parseCmd, {cmd: cmd}, function (data) {
            $('.console .content').text(data.join("\n"));
            $this.val('');
            addToConsole(data);
        });
    } else if (e.which === 38 && $this.data('actualCmd') > 0) { //UP

        $this.data('actualCmd', $this.data('actualCmd') - 1);
        $this.val($this.data('usedCmds')[$this.data('actualCmd')]);

    } else if (e.which === 40) { //DOWN
        if ($this.data('actualCmd') !== $this.data('usedCmds').length - 1) {
            $this.data('actualCmd', $this.data('actualCmd') + 1);
            $this.val($this.data('usedCmds')[$this.data('actualCmd')]);
        } else {
            $this.val('');
            $this.data('actualCmd', $this.data('usedCmds').length);
        }
    }
});

function refreshConsole() {
    socket.emitSignal(getConsole, {}, function (data) {
        $('.console .content').text(data.join("\n"));
        addToConsole(data);
    }, false);
    setTimeout(refreshConsole, 1000);
}
refreshConsole();
