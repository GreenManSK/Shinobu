$('body').on('submit', '.anime form', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $name = $this.find('[name=name]');
    if ($name.val().match(/^\s*$/) === null) {
        $name.removeClass('error');
        if ($this.data('item-id')) {
            socket.emitSignal(editAnime, {
                id: $this.data('item-id'),
                name: $name.val(),
                aid: $this.find('[name=aid]').val(),
                nyaa: $this.find('[name=nyaa]').val(),
                notifyDate: $this.find('[name=releaseDate]').prop('checked'),
                notifyFile: $this.find('[name=releaseFile]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.anime", data, function (err, html) {
                    $('.anime h1 a').toggleClass('hidden');
                    $('.anime .content').html(html);
                });
            });
        } else {
            socket.emitSignal(addAnime, {
                name: $name.val(),
                aid: $this.find('[name=aid]').val(),
                nyaa: $this.find('[name=nyaa]').val(),
                notifyDate: $this.find('[name=releaseDate]').prop('checked'),
                notifyFile: $this.find('[name=releaseFile]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.anime", data, function (err, html) {
                    $('.anime h1 a').toggleClass('hidden');
                    $('.anime .content').html(html);
                });
            });
        }
    } else {
        $name.addClass('error');
    }
    return false;
});

$('body').on('click', '.anime .watched', function (e) {
    e.preventDefault();

    socket.emitSignal(watchAnime, {
        id: $(this).parents('li').attr('id').replace('s', ''),
        date: $(this).attr('date')
    }, function (data) {
        data._ = _;
        dust.render("calendar.helpers.anime", data, function (err, html) {
            $('.anime .content').html(html);
        });
    });

    return false;
});