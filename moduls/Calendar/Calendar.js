var _AbstractModul = require('../_AbstractModul.js'),
        util = require('util');

function Calendar() {
    Calendar.super_.apply(this, arguments);

    this.updateContext();
    this.startTasks();
}

util.inherits(Calendar, _AbstractModul);

Calendar.prototype.updateContext = function () {
    this.getContext().addService('notify', this.context.getService("notify"));
    this.getContext().addService('saver', this.context.getService("saver"));

    this.getContext().addService('nextEpisode', 'moduls/' + this.modulName + '/libs/NextEpisode');
    this.getContext().addService('vgmDb', 'moduls/' + this.modulName + '/libs/VGMdb');
    this.getContext().addService('aniDb', 'moduls/' + this.modulName + '/libs/AniDB');

    this.getContext().addService('musicModel', 'moduls/' + this.modulName + '/libs/MusicModel');
    this.getContext().addService('showModel', 'moduls/' + this.modulName + '/libs/ShowModel');
};

Calendar.prototype.startTasks = function () {

};

module.exports = Calendar;