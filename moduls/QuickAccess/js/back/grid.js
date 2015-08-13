/*Modal*/
$('.modal-box').on('click.close', function (e) {
    if (this == e.target)
        $(this).addClass('hidden');
}).on('click.close', '.close', function (e) {
    e.preventDefault();
    $(this).parents('.modal-box').addClass('hidden');
});

/* Context menu */
function reloadPreview() {
    var $this = $(this);
    var $modal = $('.modal-box .modal');
    var $preview = $modal.find('.preview');

    if ($this.is('[name=url]')) {
        var url = $this.val();
        if (isUrl(url) || isUrl('http://' + url)) {
            if (!isUrl(url) && isUrl('http://' + url)) {
                url = 'http://' + url;
                $this.val(url);
            }
            $this.parents('.row').removeClass('error');
            $preview.find('a').html('<i class="fa fa-spinner fa-pulse"></i>');

            socket.emitSignal(parseUrl, {url: url}, function (data) {
                if (data.error) {
                    $preview.find('a').html('<i class="fa fa-warning"></i>');
                } else {
                    $modal.find('[name=title]').val(data.title);
                    $modal.find('[name=img]').val(data.icon);
                    reloadPreview();
                }
            });
        } else {
            $this.parents('.row').addClass('error');
        }
    } else {
        $preview.find('a').html('<i class="fa fa-spinner fa-pulse"></i>');

        var data = {
            _: _,
            title: $modal.find('[name=title]').val(),
            icon: $modal.find('[name=icon]').val(),
            url: $modal.find('[name=url]').val(),
            img: $modal.find('[name=img]').val()
        };

        dust.render("quickaccess.helpers.link", data, function (err, html) {
            $preview.html(html);
        });
    }
}

function isUrl(url) {
    return url.match(/^(https?|ftp):\/\/[a-z0-9-]+(\.[a-z0-9-]+)+\/?([\/?].+)?$/) !== null;
}

var createModal = function (actionUrl, submitAction, element) {
    var data = {_: _};
    if (typeof element !== 'undefined') {
        var $element = $(element);

        var icon = $element.find('i').attr('class');
        data.title = $element.attr('title');
        data.icon = typeof icon !== 'undefined' ? icon.replace(/^fa /, '') : '';
        data.url = $element.attr('href');
        data.img = $element.find('img').attr('src');
    }

    dust.render("quickaccess.forms.link", data, function (err, html) {
        $('.modal-box .modal').html(html);
        dust.render("quickaccess.helpers.link", {_: _, icon: "fa-question"}, function (err, html) {
            $('.modal-box .modal .preview').html(html);

            var $modal = $('.modal-box .modal');

            $('.modal-box .modal :text').typing({
                stop: function (event, $elem) {
                    reloadPreview.bind($elem)();
                },
                delay: 400
            });

            $('.modal-box .modal [type=file]').on('change', function () {
                if (this.files.length > 0) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        $modal.find('[name=img]').val(reader.result);
                        reloadPreview.bind(this)();
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });

            $('.modal-box .modal form').on('submit', function (e) {
                e.preventDefault();

                var linkData = {
                    title: $modal.find('[name=title]').val(),
                    icon: $modal.find('[name=icon]').val(),
                    url: $modal.find('[name=url]').val(),
                    img: $modal.find('[name=img]').val()
                };

                if (typeof element !== 'undefined') {
                    linkData.index = $(element).index();
                }

                socket.emitSignal(actionUrl, linkData, function (data) {
                    submitAction(linkData);

                    $('.modal-box').trigger('click.close');
                    SocketMsg.addMessege(_.scripts.saved + ' <i class="fa fa-check"></i>', {
                        duration: 5000,
                        deleteByNew: true
                    });
                });

                return false;
            });

            $('.modal-box').removeClass('hidden');
        });
    });
};

var addLink = function (event, element) {
    createModal(addLinkUrl, function (linkData) {
        dust.render("quickaccess.helpers.link", linkData, function (err, html) {
            $('.iconGrid .add').remove();
            $('.iconGrid').append(html);
            refreshGrid();
        });
    });
};
var editLink = function (event, element) {
    createModal(editLinkUrl, function (linkData) {
        dust.render("quickaccess.helpers.link", linkData, function (err, html) {
            $($('.iconGrid a').get(linkData.index)).replaceWith(html);
        });
    }, element);
};

var removeLink = function (event, element) {
    var index = $(element).index();

    socket.emitSignal(deleteLink, {index: index}, function (data) {
        $(element).remove();
        SocketMsg.addMessege(_.scripts.saved + ' <i class="fa fa-check"></i>', {
            duration: 5000,
            deleteByNew: true
        });
    });
};


function refreshGrid() {
    var menu = {};
    menu[_.default.addItem] = addLink;
    menu[_.default.editItem] = editLink;
    menu[_.default.removeItem] = removeLink;
    $(".iconGrid a:not(.add)").contextmenu(menu, 'right');
    $('.iconGrid a.add').off('click').on('click', function (e) {
        e.preventDefault();
        addLink();
        return false;
    });

    /* Sotrable */
    $('.iconGrid').sortable({
        forcePlaceholderSize: true,
        placeholderClass: 'placeholder',
    }).unbind('sortstart').bind('sortstart', function (e, ui) {
        var i = 0;
        ui.startparent.find('a').each(function () {
            $(this).attr('_order', i++);
        });
    }).unbind('sortstop').bind('sortstop', function (e, ui) {
        var newOrder = [];
        var changed = false;

        var elements = ui.startparent.find('a');
        for (var i = 0; i < elements.length; i++) {
            var j = $(elements[i]).attr('_order');
            newOrder.push(j);
            if (i != j)
                changed = true;
        }

        if (changed) {
            socket.emitSignal(orderLink, {newOrder: newOrder}, function (data) {
                SocketMsg.addMessege(_.scripts.saved + ' <i class="fa fa-check"></i>', {
                    duration: 5000,
                    deleteByNew: true
                });
            });
        }
    });
}
refreshGrid();