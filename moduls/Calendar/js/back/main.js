$('img').on('load', function () {
    $('.notrans').removeClass('notrans');
});

/* Music */

$('body').on('click', '.music .add', function (e) {
    e.preventDefault();

    $('.music h1 a').toggleClass('hidden');

    dust.render("calendar.forms.music", {_: _}, function (err, html) {
        $('.music .content').html(html);
    });

    return false;
});


$('body').on('click', '.music .edit', function (e) {
    e.preventDefault();

    var id = $(this).parents('li').attr('id').replace('m', '');

    socket.emitSignal(getMusic, {id: id}, function (data) {
        data._ = _;
        dust.render("calendar.forms.music", data, function (err, html) {
            $('.music h1 a').toggleClass('hidden');
            $('.music .content').html(html);
            $('.music .content form').data('item-id', id);
        });
    });

    return false;
});

$('body').on('click', '.music .refresh', function (e) {
    e.preventDefault();

    socket.emitSignal(getAllMusic, {}, function (data) {
        console.log(data);
        dust.render("calendar.helpers.music", {_: _, music: data.music}, function (err, html) {
            $('.music h1 a').toggleClass('hidden');
            $('.music .content').html(html);
        });
    });

    return false;
});

$('body').on('click', '.music .refreshData', function (e) {
    e.preventDefault();

    socket.emitSignal(refreshMusic, {}, function (data) {
        dust.render("calendar.helpers.music", {_: _, music: data.music}, function (err, html) {
            $('.music .content').html(html);
        });
    });

    return false;
});

$('body').onTyping('.music [name=search]', {
    stop: function (event, $elem) {
        socket.emitSignal(musicSearch, {search: $elem.val()}, function (data) {
            dust.render("calendar.helpers.musicWhisper", {_: _, whisper: data}, function (err, html) {
                $('.music .whisper').html(html);
            });
        });
    },
    delay: 400
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
                dust.render("calendar.helpers.music", {_: _, music: data.music}, function (err, html) {
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
                dust.render("calendar.helpers.music", {_: _, music: data.music}, function (err, html) {
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

$('body').on('click', '.music .delete', function (e) {
    e.preventDefault();

    socket.emitSignal(deleteMusic, {id: $(this).parents('li').attr('id').replace('m', '')}, function (data) {
        dust.render("calendar.helpers.music", {_: _, music: data.music}, function (err, html) {
            $('.music .content').html(html);
        });
    });

    return false;
});