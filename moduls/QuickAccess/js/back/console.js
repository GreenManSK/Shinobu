function addToConsole(data) {
    var $content = $('.console .content');
    if (data.length !== 0) {
        var actualData = $content.text().split("\n");

        for (var i = 0; i <= actualData.length; i++) {
            if (actualData.slice(i, actualData.length).join("\n").trim() === data.slice(i, actualData.length).join("\n").trim()) {
                var s = data.slice(actualData.length, data.length).join("\n").trim();
                if (s !== '') {
                    $content.append(document.createTextNode("\n" + s));
                    $content.scrollTop($content.prop("scrollHeight"));
                }
                return;
            }
        }
        $content.append(document.createTextNode("\n" + data.join("\n").trim()));
        $content.scrollTop($content.prop("scrollHeight"));
    }
}

function refreshConsole() {
    socket.emitSignal(getConsole, {}, function (data) {
        addToConsole(data);
        if ($('.console .content').size() > 0)
            setTimeout(refreshConsole, 1000);
    }, false);
}

function startConsole() {
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
                var $content = $('.console .content');
                $content.text(data.join("\n"));
                $content.scrollTop($content.prop("scrollHeight"));
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
    refreshConsole();
}

if (mainTab) {
    startConsole();
}

socket.on('newMain', function () {
    dust.render("quickaccess.default.console", {console: [_.console.newMainTab]}, function (err, html) {
        $('.iconGrid').addClass('console').removeClass('iconGrid').html(html);
        startConsole();
    });
});