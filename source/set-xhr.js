
/**
 * set-xhr.js
 *
 * Set XMLHttpRequest 
 */

marmottajax.prototype.setXhr = function() {

	this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

	this.xhr.lastResult = null;

	this.xhr.json = this.json;
	this.xhr.binding = null;

	this.bind = function(binding) {

		this.xhr.binding = binding;

		return this;

	};

	this.cancel = function(callback) {

		this.xhr.abort();

		return this;

	};

	this.xhr.callbacks = {

		then: [],
		change: [],
		error: []

	};

	for (var name in this.xhr.callbacks) {

		if (this.xhr.callbacks.hasOwnProperty(name)) {

			this[name] = function(name) {

				return function(callback) {

					this.xhr.callbacks[name].push(callback);

					return this;

				};

			}(name);

		}

	}

	this.xhr.call = function(categorie, result) {

		for (var i = 0; i < this.callbacks[categorie].length; i++) {

			if (typeof(this.callbacks[categorie][i]) === "function") {

				if (this.binding) {

					this.callbacks[categorie][i].call(this.binding, result);

				}

				else {

					this.callbacks[categorie][i](result);

				}

			}

		}

	};

	this.xhr.onreadystatechange = function() {

		if (this.readyState === 4 && this.status == 200) {

			var result = this.responseText;

			if (this.json) {

				try {

					result = JSON.parse(result);

				}

				catch (error) {

					this.call("error", "invalid json");

					return false;

				}

			}

			this.lastResult = result;

			this.call("then", result);

		}

		else if (this.readyState === 4 && this.status == 404) {

			this.call("error", "404");

		}

		else if (this.readyState === 4) {

			this.call("error", "unknow");

		}

	};

	this.xhr.open(this.method, this.url, true);
	this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	this.xhr.send(typeof this.postData != "undefined" ? this.postData : null);

};