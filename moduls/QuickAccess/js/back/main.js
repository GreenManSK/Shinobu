/* Dropdown */
$('body').on('click.dropdown', '.dropdown .dropdown-toggle', function (e) {
    e.preventDefault();
}).on('click.dropdown', '.dropdown .dropdown-toggle', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.hasClass('close')) {
        $this.blur();
    } else
        $this.addClass('close');
}).on('focusin.dropdown', '.dropdown', function () {
    var $ul = $(this).find('.dropdown-list');
    $ul.removeClass('hidden');
    $ul.css('max-height', $(window).height() - ($ul.offset().top - $(window).scrollTop()));
    $ul.trigger('open');
}).on('focusout.dropdown', '.dropdown', function () {
    var $this = $(this);
    $this.find('.dropdown-list').addClass('hidden').trigger('close');
    $this.find('a.dropdown-toggle').removeClass('close');
});
