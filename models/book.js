var db=require('./dbhelper');

//book类
function Book(){
	this.isbn;
	this.barcode;
	this.title;
	this.author;
	this.type;
	this.press;
	this.price;
	this.content;
	this.catalog;
	this.callNumber;
	this.address;
	this.state;
}

module.exports=Book;

//保存书籍信息--后台使用的方法
Book.prototype.save = function() {
	var sql="";
};

//根据书名查找书
Book.findBooksByTitle=function(title,callback){
	var sql="SELECT isbn,title,author,type,press,callNumber FROM book WHERE title LIKE '%"+title+"%';";
	db.exec(sql,'',function(err,rows){
		if(err){
			return callback(err);
		}
		//rows是一个对象数组
		callback(err,rows);
	});
};
//根据参数查找书
Book.findBooks=function(arg,val,callback){
	if(val){
		var sql="SELECT * from book where "+arg+"='"+val+"'";
	}else{
		var sql="SELECT "+arg+" from book";
	}
	db.exec(sql,'',function(err,rows){
		if(err){
			callback(err);
		}
		//rows是一个对象数组
		callback(err,rows);
	});
};

//根据isbn查找书籍
Book.findBooksByISBN=function(isbn,callback){
	db.getConnection(function(err,connection){
		if(err){
			return callback(err);
		}
		var sql;
		connection.beginTransaction(function(err){
			if(err){
				return callback(err);
			}
			sql="SELECT isbn,title,author,status,press,type,price,content,catalog,address,callNumber FROM book WHERE isbn='"+isbn+"';";
			connection.query(sql,[],function(err,rows){
				if(err){
					return connection.rollback(function(){
						callback(err);
					});
				}
				var bookInfo=rows[0];//图书基本信息

				sql="SELECT bk.callNumber,ib.barcode,bk.type,bk.status,bk.address,ib.state FROM book bk,isbn_barcode ib WHERE ib.isbn='"+isbn+"' AND bk.isbn=ib.isbn;";
				connection.query(sql,[],function(err,rows){
					if(err){
						return connection.rollback(function(){
							callback(err);
						});
					}
					var booksState=rows;//图书馆藏情况

					connection.commit(function(err){
						if(err){
							return connection.rollback(function(){
								callback(err);
							});
						}
						connection.end();
						callback(undefined,bookInfo,booksState);
					});
				});
			});
		});
	});
};


//根据barcode查找书籍
Book.findBookBybarcode=function(barcode,callback){
	var sql="SELECT bk.title,ib.barcode,bk.author,bk.press FROM book bk,isbn_barcode ib WHERE barcode='"+barcode+"' AND bk.isbn=ib.isbn;";
	db.exec(sql,'',function(err,rows){
		if(err){
			callback(err);
		}
		callback(err,rows[0]);
	});
};

// 添加书籍
Book.addBook = function(option,fun){
	var sql = "insert into book (isbn,title,callNumber,author,press ,price ,content) values ('"+option.isbn+"','"+option.title+"','"+option.callNumber+"','"+option.author+"','"+option.press+"','"+option.price+"','"+option.content+"')";
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		fun(err,rows)
	});
}

// 删除书籍
Book.deleteBook = function(isbn,fun){
	var sql = "delete from book where isbn="+isbn+";"
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		fun(err,rows)
	});
}

// 修改书籍
Book.updataBook = function(option,fun){
	var sql = "update book set title='"+option.title+"' ,author='"+option.author+"' ,address='"+option.address+"' ,content='"+option.content+"' ,callNumber='"+option.callNumber+"', status="+option.status+" where isbn="+option.isbn+";"
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		fun(err,rows)
	});
}
// 更新书籍状态
Book.updataStatus = function(type,status,isbn,fun){
	var sql = "update book set type='"+type+"',status="+status+" where isbn="+isbn+";"
	db.exec(sql,'',function(err,rows){
		if(err){
			fun(err)
		}
		fun(err,rows)
	});
}