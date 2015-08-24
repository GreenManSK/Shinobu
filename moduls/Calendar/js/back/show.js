$('body').onTyping('.show [name=name]', {
    stop: function (event, $elem) {
        socket.emitSignal(showSearch, {search: $elem.val()}, function (data) {
            if (typeof data === 'string') {
                $('[name="nextEpisodeUrl"]').val(data);
            } else {
                dust.render("calendar.helpers.showWhisper", {_: _, whisper: data}, function (err, html) {
                    $('.show .whisper').html(html);
                });
            }
        });
    },
    delay: 600
});

$('body').on('click', '.show .whisper .tip div', function (e) {
    e.preventDefault();
    $('.show [name=name]').val($(this).text().trim());
    $('.show [name=nextEpisodeUrl]').val($(this).attr('_link'));
    $('.show .whisper').html('');

    return false;
});

$('body').on('submit', '.show form', function (e) {
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
                dust.render("calendar.helpers.show", data, function (err, html) {
                    $('.show h1 a').toggleClass('hidden');
                    $('.show .content').html(html);
                });
            });
        } else {
            socket.emitSignal(addShow, {
                name: $name.val(),
                link: $this.find('[name=nextEpisodeUrl]').val(),
                notify: $this.find('[name=releaseDate]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.show", data, function (err, html) {
                    $('.show h1 a').toggleClass('hidden');
                    $('.show .content').html(html);
                });
            });
        }
    } else {
        $name.addClass('error');
    }
    return false;
});

$('body').on('click', '.show .watched', function (e) {
    e.preventDefault();

    socket.emitSignal(watchShow, {
        id: $(this).parents('li').attr('id').replace('s', ''),
        date: $(this).attr('date')
    }, function (data) {
        data._ = _;
        dust.render("calendar.helpers.show", data, function (err, html) {
            $('.show .content').html(html);
        });
    });

    return false;
});