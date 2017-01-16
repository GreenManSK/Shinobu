//namespace Base
define(function (require) {
	return class Synchronized {
		constructor (id) {
			this._id = id;
			this.lastSynchronized = 0;
		}
		
		get id() { return this._id; }
		set id(id) { this._id = id; }
		get dataHash() { return ""; }
	}
});