/* Dropdown */
$('body').on('click.dropdown', '.dropdown a.dropdown-toggle', function (e) {
    e.preventDefault();
}).on('click.dropdown', '.dropdown a.dropdown-toggle', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.hasClass('close')) {
        $this.blur();
    } else
        $this.addClass('close');
}).on('focusin.dropdown', '.dropdown', function () {
    var $ul = $(this).find('ul');
    $ul.removeClass('hidden');
    $ul.css('max-height', $(window).height() - ($ul.offset().top - $(window).scrollTop()));
}).on('focusout.dropdown', '.dropdown', function () {
    var $this = $(this);
    $this.find('ul').addClass('hidden');
    $this.find('a.dropdown-toggle').removeClass('close');
});
