$('body').onTyping('.music [name=search]', {
    stop: function (event, $elem) {
        socket.emitSignal(musicSearch, {search: $elem.val()}, function (data) {
            dust.render("calendar.helpers.musicWhisper", {_: _, whisper: data}, function (err, html) {
                $('.music .whisper').html(html);
            });
        });
    },
    delay: 600
});

$('body').on('click', '.music .whisper .tip div', function (e) {
    e.preventDefault();
    $('.music [name=id]').val($(this).attr('id').replace(/m/, ''));
    $('.music .whisper').html('');

    return false;
});

$('body').on('submit', '.music form', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $name = $this.find('[name=name]');
    if ($name.val().match(/^\s*$/) === null) {
        $name.removeClass('error');
        if ($this.data('item-id')) {
            socket.emitSignal(editMusic, {
                id: $this.data('item-id'),
                name: $name.val(),
                vgmid: $this.find('[name=id]').val(),
                date: $this.find('[name=date]').val(),
                notify: $this.find('[name=releaseDate]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.music", data, function (err, html) {
                    $('.music h1 a').toggleClass('hidden');
                    $('.music .content').html(html);
                });
            });
        } else {
            socket.emitSignal(addMusic, {
                name: $name.val(),
                id: $this.find('[name=id]').val(),
                date: $this.find('[name=date]').val(),
                notify: $this.find('[name=releaseDate]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.music", data, function (err, html) {
                    $('.music h1 a').toggleClass('hidden');
                    $('.music .content').html(html);
                });
            });
        }
    } else {
        $name.addClass('error');
    }
    return false;
});