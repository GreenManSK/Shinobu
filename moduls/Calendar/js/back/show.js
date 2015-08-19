$('body').on('click', '.shows .add', function (e) {
    e.preventDefault();

    $('.shows h1 a').toggleClass('hidden');

    dust.render("calendar.forms.shows", {_: _}, function (err, html) {
        $('.shows .content').html(html);
    });

    return false;
});

$('body').on('click', '.shows .edit', function (e) {
    e.preventDefault();

    var id = $(this).parents('li').attr('id').replace('s', '');

    socket.emitSignal(getShow, {id: id}, function (data) {
        data._ = _;

        dust.render("calendar.forms.shows", data, function (err, html) {
            $('.shows h1 a').toggleClass('hidden');
            $('.shows .content').html(html);
            $('.shows .content form').data('item-id', id);
        });
    });

    return false;
});

$('body').on('click', '.shows .refresh', function (e) {
    e.preventDefault();

    socket.emitSignal(getAllShows, {}, function (data) {
        data._ = _;
        dust.render("calendar.helpers.shows", data, function (err, html) {
            $('.shows h1 a').toggleClass('hidden');
            $('.shows .content').html(html);
        });
    });

    return false;
});

$('body').onTyping('.shows [name=name]', {
    stop: function (event, $elem) {
        socket.emitSignal(showSearch, {search: $elem.val()}, function (data) {
            dust.render("calendar.helpers.showsWhisper", {_: _, whisper: data}, function (err, html) {
                $('.shows .whisper').html(html);
            });
        });
    },
    delay: 400
});

$('body').on('click', '.shows .whisper .tip div', function (e) {
    e.preventDefault();
    $('.shows [name=name]').val($(this).text().trim());
    $('.shows [name=nextEpisodeUrl]').val($(this).attr('_link'));
    $('.shows .whisper').html('');

    return false;
});

$('body').on('submit', '.shows form', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $name = $this.find('[name=name]');
    if ($name.val().match(/^\s*$/) === null) {
        $name.removeClass('error');
        if ($this.data('item-id')) {
            socket.emitSignal(editShow, {
                id: $this.data('item-id'),
                name: $name.val(),
                link: $this.find('[name=nextEpisodeUrl]').val(),
                notify: $this.find('[name=releaseDate]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.shows", data, function (err, html) {
                    $('.shows h1 a').toggleClass('hidden');
                    $('.shows .content').html(html);
                });
            });
        } else {
            socket.emitSignal(addShow, {
                name: $name.val(),
                link: $this.find('[name=nextEpisodeUrl]').val(),
                notify: $this.find('[name=releaseDate]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.shows", data, function (err, html) {
                    $('.shows h1 a').toggleClass('hidden');
                    $('.shows .content').html(html);
                });
            });
        }
    } else {
        $name.addClass('error');
    }
    return false;
});

$('body').on('click', '.shows .delete', function (e) {
    e.preventDefault();

    socket.emitSignal(deleteShow, {id: $(this).parents('li').attr('id').replace('s', '')}, function (data) {
        data._ = _;
        dust.render("calendar.helpers.shows", data, function (err, html) {
            $('.shows .content').html(html);
        });
    });

    return false;
});

$('body').on('click', '.shows .watched', function (e) {
    e.preventDefault();

    socket.emitSignal(watchShow, {
        id: $(this).parents('li').attr('id').replace('s', ''),
        date: $(this).attr('date')
    }, function (data) {
        data._ = _;
        dust.render("calendar.helpers.shows", data, function (err, html) {
            $('.shows .content').html(html);
        });
    });

    return false;
});

$('body').on('click', '.shows .refreshData', function (e) {
    e.preventDefault();

    socket.emitSignal(refreshShows, {}, function (data) {
        data._ = _;
        dust.render("calendar.helpers.shows", data, function (err, html) {
            $('.shows .content').html(html);
        });
    });

    return false;
});