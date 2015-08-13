var DateControler = function (date) {
    if (!(this instanceof DateControler))
        return new DateControler(date);

    this.day = 1;
    this.month = 1;
    var parts = date.match(/^(\d+)\.(\d+)$/);
    if (parts !== null) {

        this.day = parseInt(parts[1]);
        this.month = parseInt(parts[2]);
    }
};

DateControler.prototype.check = function (date) {
    if (date === undefined)
        date = new Date();

    return date.getDate() === this.day && parseInt(date.getMonth() + 1) === this.month;
};

module.exports = DateControler;