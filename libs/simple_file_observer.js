"use strict";

var util = require('util');
var events = require('events');
var fs = require('fs');

function observe(filename) {
	return new SimpleFileObserver(filename);
}

function SimpleFileObserver(filename) {
	events.EventEmitter.call(this);
	
	this.filename = filename;
	this.timeout = null;
	
	this.watcher = fs.watch(filename);
	this.watcher.on('change', this.fileChangeCallback.bind(this));
	this.watcher.on('error', this.watcherError.bind(this));
}

util.inherits(SimpleFileObserver, events.EventEmitter);

SimpleFileObserver.prototype.fileChangeCallback = function() {
	if (this.timeout) {
		return;
	}
	this.timeout = setTimeout(this.timeoutHit.bind(this), 500);
}

SimpleFileObserver.prototype.timeoutHit = function() {
	this.timeout = null;
	this.emit('change');
}

SimpleFileObserver.prototype.stopObserving = function() {
	if (this.timeout) {
		clearTimeout(this.timeout);
		this.timeout = null;
	}
	this.watcher.close();
}

SimpleFileObserver.prototype.watcherError = function() {
	this.emit('error');
}

SimpleFileObserver.prototype.getFile = function() {
	return this.filename;
}

module.exports.observe = observe;