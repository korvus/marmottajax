
/**
 * set-xhr.js
 *
 * Set Watcher 
 */

marmottajax.prototype.setWatcher = function() {

	if (this.watch !== -1) {

		this.watchIntervalFunction = function() {

			if (this.xhr.readyState === 4 && this.xhr.status === 200) {

				this.updateXhr();

			}

			this.watcherTimeout();

		};

		this.watcherTimeout();

		this.stop = function() {

			this.changeTime(-1);

		};

		this.changeTime = function(newTime) {

			clearTimeout(this.changeTimeout);

			this.watch = typeof newTime === "number" ? newTime : this.watch;

			this.watcherTimeout();

		};

	}

};