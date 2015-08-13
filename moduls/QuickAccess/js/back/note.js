function addNote() {
    var $textarea = $('.notes textarea');
    var $name = $('.notes span.name');

//    $textarea.prop('disabled', false);
    var $msgBar = $('.notes .msgBar');
    $msgBar.html(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');

    socket.emitSignal(addNoteUrl, {name: $name.text(), content: ""}, function (data) {
        if (data.error) {
            $msgBar.html('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.saveError);
        } else {
            $msgBar.html(_.scripts.saved + ' <i class="fa fa-check"></i>');

            $('.notes span.name').text(data.name);
            $textarea.prop('disabled', false);

            Cookies.set('note', data.name, {expires: 6 * 365});

            var a = $('<a>').attr({
                title: data.name,
                href: '#',
            }).text(data.name).addClass('active');

            var $noteList = $('.notes .noteList');
            $noteList.find('a').removeClass('active');
            $noteList.prepend($('<li>').append(a));
            $('.dropdown a.dropdown-toggle, a.delete').removeClass('hidden');
        }
    }, false);
}
function updateNote() {
    var $textarea = $('.notes textarea');
    var $name = $('.notes span.name');
    var name = $name.data('name');
    name = name ? name : $name.text();

    var $msgBar = $('.notes .msgBar');
    $msgBar.html(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');

    socket.emitSignal(editNote, {name: name, newName: $name.text(), content: $textarea.val()}, function (data) {
        if (data.error) {
            $msgBar.html('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.saveError);
        } else {
            $msgBar.html(_.scripts.saved + ' <i class="fa fa-check"></i>');

            $('.notes .noteList a[title="' + name.replace(/"/g, '\\"') + '"]').attr('title', data.name).text(data.name);
            $('.notes span.name').text(data.name);

            Cookies.set('note', data.name, {expires: 6 * 365});
        }
    }, false);
}

/* Add input */
$('body').on('click', '.notes .add', function (e) {
    e.preventDefault();

    var $name = $('.notes span.name');
    $name.text('');
    $('.notes textarea').val('');
    $name.trigger('click');

    return false;
});

/* Name to input */
$('body').on('click', '.notes span.name:not(.input)', function () {
    var $this = $(this);
    $this.addClass('input').data('name', $this.text()).html($('<input type=text name=title>').val($this.text()))
            .find('input').focus();
});
$('body').on('focusout', '.notes span.name input', function (e) {
    var $this = $(this);
    var $parent = $this.parents('span.name');
    if ($this.val().match(/^\s*$/) === null) {
        $parent.removeClass('input').text($this.val());
        if (Boolean($parent.data('name'))) {
            updateNote();
        } else {
            addNote();
        }
    } else {
        $parent.removeClass('input').text($parent.data('name'));
    }
    $parent.data('name', false);
}).on('keypress', 'span.name input', function (e) {
    if (e.type === 'keypress' && e.which === 13) {
        $(this).blur();
    }
});

/* Text edit */
$('body').onTyping('.notes textarea', {
    stop: function (event, $elem) {
        updateNote();
    },
    delay: 400
});

/* Choose note */
$('body').on('click', '.notes .noteList a', function (e) {
    e.preventDefault();
    var $this = $(this);

    if (!$this.hasClass('active')) {
        var $msgBar = $('.notes .msgBar');
        $msgBar.html(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');

        socket.emitSignal(getNote, {name: $this.attr('title')}, function (data) {
            if (data.error) {
                $msgBar.html('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.error);
            } else {
                $this.parents('.noteList').find('a').removeClass('active');
                $this.addClass('active');

                $this.blur();

                $('.notes span.name').text($this.attr('title'));
                $('.notes textarea').val(data);
                $msgBar.text('');

                Cookies.set('note', $this.attr('title'), {expires: 6 * 365});
            }
        }, false);
    }

    return false;
});

/* Delete note */
$('body').on('click', '.notes a.delete', function (e) {
    e.preventDefault();

    var $msgBar = $('.notes .msgBar');
    $msgBar.html(_.scripts.loading + ' <i class="fa fa-spinner fa-pulse"></i>');

    socket.emitSignal(deleteNote, {name: $('.notes span.name').text()}, function (data) {
        if (data.error) {
            $msgBar.html('<i class="fa fa-exclamation-triangle"></i> ' + _.scripts.error);
        } else {
            $msgBar.html(_.scripts.deleted + ' <i class="fa fa-check"></i>');

            $('.notes .noteList a').remove('.active');
            var notes = $('.notes .noteList a');

            if (notes.length > 0) {
                $(notes[0]).trigger('click');
            } else {
                $('.dropdown a.dropdown-toggle, a.delete').addClass('hidden');
                $('.notes span.name').text('');
                $('.notes textarea').val('').prop('disabled', true);
            }
        }
    }, false);

    return false;
});