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
    this.getContext().addService('ovaModel', 'moduls/' + this.modulName + '/libs/OvaModel');
    this.getContext().addService('animeModel', 'moduls/' + this.modulName + '/libs/AnimeModel');
};

Calendar.prototype.startTasks = function () {
    var scheduler = this.context.getService("scheduler");

    scheduler.every('anidb', this.getContext().getService('aniDb').parseTitles.bind(this.getContext().getService('aniDb')), true, 0, 0, 0, 7);
    
    var d = this.getConfig().get('dataRefresh');
    var models = [
        ['music', this.getContext().getService('musicModel')],
        ['show', this.getContext().getService('showModel')],
        ['ova', this.getContext().getService('ovaModel')],
        ['anime', this.getContext().getService('animeModel')]
    ];
    for (var i in models) {
        scheduler.every('Calendar.' + models[i][0], models[i][1].dataRefresh.bind(models[i][1]), true, d[0], d[1], d[2], d[3]);
    }
    
};

module.exports = Calendar;