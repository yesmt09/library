var fs=require('fs');
var querystring=require('querystring');
var db=require('./dbhelper');

function User(){
	this.readerId;
	this.password;
}

module.exports=User;

//根据证件号查找用户
User.findUserByreaderId=function(username, callback){
	var sql="SELECT readerId from reader where readerId='"+username+"'"
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		//rows是一个对象数组
		callback(err,rows);
	});
};

User.addUser=function(username,callback){
	var sql = "insert into `reader` (readerId) values ('"+username+"');"
    db.exec(sql,'', function(err, rows) {
    	if(err){
			throw err;
		}
    })
}


