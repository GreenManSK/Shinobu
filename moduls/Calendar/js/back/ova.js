$('body').onTyping('.ova [name=aid]', {
    stop: function (event, $elem) {
        var $form = $elem.parents('form');
        socket.emitSignal(ovaSearch, {id: $elem.val()}, function (data) {
            dust.render("calendar.helpers.ovaWhisper", {_: _, whisper: data.episodes}, function (err, html) {
                $form.find('.ovaWhisper').html(html);
            });
        });
    },
    delay: 600
});

$('body').on('click', '.ovaWhisper .tip div', function (e) {
    e.preventDefault();
    var $form = $(this).parents('form');

    $form.find('[name=eid]').val($(this).attr('id').replace(/[a-z]/, ''));
    $form.find('.ovaWhisper').html('');

    return false;
});

$('body').on('submit', '.ova form', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $name = $this.find('[name=name]');
    if ($name.val().match(/^\s*$/) === null) {
        $name.removeClass('error');
        if ($this.data('item-id')) {
            socket.emitSignal(editOva, {
                id: $this.data('item-id'),
                name: $name.val(),
                aid: $this.find('[name=aid]').val(),
                eid: $this.find('[name=eid]').val(),
                nyaa: $this.find('[name=nyaa]').val(),
                date: $this.find('[name=date]').val(),
                notifyDate: $this.find('[name=releaseDate]').prop('checked'),
                notifyFile: $this.find('[name=releaseFile]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.ova", data, function (err, html) {
                    $('.ova h1 a').toggleClass('hidden');
                    $('.ova .content').html(html);
                });
            });
        } else {
            socket.emitSignal(addOva, {
                name: $name.val(),
                aid: $this.find('[name=aid]').val(),
                eid: $this.find('[name=eid]').val(),
                nyaa: $this.find('[name=nyaa]').val(),
                date: $this.find('[name=date]').val(),
                notifyDate: $this.find('[name=releaseDate]').prop('checked'),
                notifyFile: $this.find('[name=releaseFile]').prop('checked')
            }, function (data) {
                data._ = _;
                dust.render("calendar.helpers.ova", data, function (err, html) {
                    $('.ova h1 a').toggleClass('hidden');
                    $('.ova .content').html(html);
                });
            });
        }
    } else {
        $name.addClass('error');
    }
    return false;
});