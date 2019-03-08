
var manager = require('./manager.js');
var bouncer = require('./bin/bouncer');
var bouncer_sdk = require('node_oauth_sdk');

function ensure(){}
//登录验证
ensure.ensureAuthenticated= function(req, res, next){
	if (req.session.username != undefined && req.session.username !== '') {
		next();
	} else {
		bouncer.login(req, res, next);
	}
}

//登录验证
ensure.IsManager=function(username){
	console.log(manager,username)
	for(var i = 0; i <= manager.length-1; i++){
		console.log(manager[i] == username)
		if(manager[i] == username){
			return true;
		}
	}
	return false;
}


module.exports = ensure;