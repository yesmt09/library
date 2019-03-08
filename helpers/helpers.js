//handlebars helper
//css helper
exports.css = function(str, option) {
	var cssList = this.cssList || [];
	//console.log('--',cssList);
	str = str.split(/[,，;；]/);
	//console.log('css: ', str);
	str.forEach(function(item) {
		if (cssList.indexOf(item) < 0) {
			cssList.push(item);
		}
	});
	this.cssList = cssList.concat();
};

//js helper
exports.js = function(str, option) {
	var jsList = this.jsList || [];
	str = str.split(/[,，;；]/);
	//console.log('js: ', str);
	str.forEach(function(item) {
		if (jsList.indexOf(item) < 0) {
			jsList.push(item);
		}
	});
	this.jsList = jsList.concat();
	//console.log(jsList);
};

exports.expirationDate = function (date) {
	var d = new Date(date);
    d.setTime(d.getTime() + (15 * 86400 * 1000));
    return d.toDateString()
}

exports.compare= function(left, operator, right, options) {

	if (arguments.length < 3) {

		throw new Error('Handlerbars Helper "compare" needs 2 parameters');

	}

	var operators = {

		'==': function(l, r) {return l == r; },

		'===': function(l, r) {return l === r; },

		'!=': function(l, r) {return l != r; },

		'!==': function(l, r) {return l !== r; },

		'<': function(l, r) {return l < r; },

		'>': function(l, r) {return l > r; },

		'<=': function(l, r) {return l <= r; },

		'>=': function(l, r) {return l >= r; },

		'typeof': function(l, r) {return typeof l == r; }

	};

	if (!operators[operator]) {

		throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);

	}

	var result = operators[operator](left, right);

	if (result) {

		return options.fn(this);

	} else {

		return options.inverse(this);

	}

};

