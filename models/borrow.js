var db = require('./dbhelper');

function Borrow(readerId, barcode) {
	this.readerId = readerId;
	this.barcode = barcode;
}

module.exports = Borrow;


// 借书
Borrow.save = function(option,fun){
	var date = new Date().toLocaleString();//借书日期
	var sql = "INSERT INTO borrow (readerId,isbn,outDate) VALUES ('" + option.readerId + "','" + option.isbn + "','"+date+"');";
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		var hisSql = "insert into history (readerId,isbn,outDate,status) values('" + option.readerId + "','" + option.isbn + "','"+date+"',0);"
		db.exec(hisSql,'',function(hiserr,hisrows){})
		fun(err,rows)
	});
}

// 还书
Borrow.return = function(readerId,isbn,fun){
	var date = new Date().toLocaleString();//借书日期
	var sql = "delete from borrow where isbn='"+isbn+"' and readerId='"+readerId+"';";
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		var hisSql = "update history set inDate='"+date+"', status = 1 where isbn="+isbn+" and readerId='"+readerId+"' and status = 0;"
		db.exec(hisSql,'',function(err,rows){})
		fun(err,rows)
	});
}


//当前借阅
Borrow.findNowBorrow=function(readerId,callback){
	var sql="SELECT bw.isbn,bk.title,bk.author,bw.outdate,bk.callNumber,bk.isbn FROM borrow bw,book bk WHERE bw.isbn=bk.isbn AND readerId='"+readerId+"' ORDER BY bw.outDate DESC;"
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
}

//还书
Borrow.returnBook=function(readerId,barcode,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}

			//更改isbn_barcode中state状态为'可借'
			sql="UPDATE isbn_barcode SET state=0 WHERE barcode='"+barcode+"';";
			connection.query(sql,[],function(err){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}

				sql="SELECT outDate FROM borrow WHERE readerId='"+readerId+"' AND barcode='"+barcode+"';";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}

					var outDate=(rows[0].outDate).Format("yyyy-MM-dd hh:mm:ss");//借阅日期
					console.log('outDate',outDate);
					var inDate = new Date().Format("yyyy-MM-dd hh:mm:ss");//还书日期
					sql="INSERT INTO history VALUES('"+readerId+"','"+barcode+"','"+outDate+"','"+inDate+"')";
					connection.query(sql,[],function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}

						//删除借阅表中的记录
						sql="DELETE FROM borrow WHERE readerId='"+readerId+"' AND barcode='"+barcode+"';";
						connection.query(sql,[],function(err,rows){
							if(err){
								return connection.rollback(function(){
									callback(err);
								});
							}
							connection.commit(function(err){
								if(err){
									return connection.rollback(function(){
										callback(err);
									});
								}
								connection.end();
								callback();
							});
						});
					});
				});
			});
		});
	});
};

//续借
Borrow.renew=function(readerId,barcode,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}
			sql="SELECT frequency FROM borrow WHERE readerId='"+readerId+"' AND barcode='"+barcode+"';";
			connection.query(sql,[],function(err,rows){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}

				var frequency=rows[0].frequency;

				if(frequency==0){
					frequency=1;
				}else if(frequency==1){
					frequency=2;
				}else{
					return callback('续借不能超过2次！')
				}
				var sql="UPDATE borrow SET frequency="+frequency+" WHERE readerId='"+readerId+"' AND barcode='"+barcode+"'";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}

					connection.commit(function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}
						callback();
					});	
				});
			});
		});
	});
};

//历史借阅
Borrow.findHistory=function(readerId,callback){
	var sql="SELECT bk.isbn ,bk.title ,bk.author ,bk.press ,bk.callNumber,his.outDate,his.inDate FROM history his,book bk WHERE his.isbn=bk.isbn AND readerId='"+readerId+"' ORDER BY his.inDate DESC;"
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		callback(err,rows);
	});
};

//格式化日期时间
Date.prototype.Format = function() {
	var year = this.getFullYear(),
		month = (this.getMonth()+1) <= 9 ? '0'+(this.getMonth()+1) : (this.getMonth()+1),
		day = this.getDate()
	return year+'-'+month+'-'+day;
}
