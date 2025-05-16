function Store(initial) {
	this._value = initial;
	this._subs = [];
}

Store.prototype.get = function () {
	return this._value;
};

Store.prototype.set = function (val) {
	if (this._value !== val) {
		this._value = val;
		for (var i = 0; i < this._subs.length; i++) {
			this._subs[i](val);
		}
	}
};

Store.prototype.update = function (fn) {
	var next = fn(this._value);
	this.set(next);
};

Store.prototype.subscribe = function (fn) {
	this._subs.push(fn);
	return fn;
};

Store.prototype.unsubscribe = function (fn) {
	var i = indexOf(this._subs, fn);
	if (i >= 0) this._subs.splice(i, 1);
};
