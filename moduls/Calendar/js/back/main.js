$('img').on('load', function () {
    $('.notrans').removeClass('notrans');
});

function ftu(str) {
    return str.replace(/^[a-z]/, function ($1) {
        return $1.toUpperCase();
    });
}

var types = ['music', 'show', 'ova'];

for (var i in types) {
    var t = types[i];

    (function () {
        var t = this;

        $('body').on('click', '.' + t + ' .add', function (e) {
            e.preventDefault();

            $('.' + t + ' h1 a').toggleClass('hidden');

            dust.render("calendar.forms." + t, {_: _}, function (err, html) {
                $('.' + t + ' .content').html(html);
            });

            return false;
        });

        $('body').on('click', '.' + t + ' .edit', function (e) {
            e.preventDefault();

            var id = $(this).parents('li').attr('id').replace(/[a-z]/, '');

            socket.emitSignal(window['get' + ftu(t)], {id: id}, function (data) {
                data._ = _;

                dust.render("calendar.forms." + t, data, function (err, html) {
                    $('.' + t + ' h1 a').toggleClass('hidden');
                    $('.' + t + ' .content').html(html);
                    $('.' + t + ' .content form').data('item-id', id);
                });
            });

            return false;
        });

        $('body').on('click', '.' + t + ' .refresh', function (e) {
            e.preventDefault();

            socket.emitSignal(window['getAll' + ftu(t)], {}, function (data) {
                data._ = _;
                dust.render("calendar.helpers." + t, data, function (err, html) {
                    $('.' + t + ' h1 a').toggleClass('hidden');
                    $('.' + t + ' .content').html(html);
                });
            });

            return false;
        });

        $('body').on('click', '.' + t + ' .refreshData', function (e) {
            e.preventDefault();

            socket.emitSignal(window['refresh' + ftu(t)], {}, function (data) {
                data._ = _;
                dust.render("calendar.helpers." + t, data, function (err, html) {
                    $('.' + t + ' .content').html(html);
                });
            });

            return false;
        });

        $('body').on('click', '.' + t + ' .delete', function (e) {
            e.preventDefault();

            socket.emitSignal(window['delete' + ftu(t)], {id: $(this).parents('li').attr('id').replace(/[a-z]/, '')}, function (data) {
                data._ = _;
                dust.render("calendar.helpers." + t, data, function (err, html) {
                    $('.' + t + ' .content').html(html);
                });
            });

            return false;
        });
    }).bind(t)();
}

$('body').onTyping('.anime [name=name], .ova [name=name]', {
    stop: function (event, $elem) {
        var $form = $elem.parents('form');

        if ($form.find('[name=aid],[name=id]').val().match(/^\s*$/) !== null) {
            socket.emitSignal(animeSearch, {search: $elem.val()}, function (data) {
                dust.render("calendar.helpers.animeWhisper", {_: _, whisper: data}, function (err, html) {
                    $form.find('.animeWhisper').html(html);
                });
            });
        }
    },
    delay: 600
});

$('body').on('click', '.animeWhisper .tip div', function (e) {
    e.preventDefault();
    var $form = $(this).parents('form');

    $form.find('[name=aid],[name=id]').val($(this).attr('id').replace(/[a-z]/, ''));
    $form.find('[name=aid],[name=id]').trigger("keypress").trigger("blur");
    $form.find('.animeWhisper').html('');

    return false;
});