"use strict";

var express = require('express');
var router = express.Router();
var Borrow=require('../models/borrow');
var Book=require('../models/book');
var ensure = require('../ensure.js');

//当前借阅
router.get('/myborrow',ensure.ensureAuthenticated,function(req,res,next){
	var readerId=res.locals.username;
	Borrow.findNowBorrow(readerId,function(err,borrows){
		if(err){
			return next(err);
		}
		//修正日期数据
		borrows.forEach(function(borrow){
			var outdate=borrow.outdate;
			//格式化借阅日期
			borrow.outdate = outdate
		});
		res.render('myborrow',{
			title:'当前借阅-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}],
			borrows:borrows
		});
	});
});

//还书
router.post('/return',ensure.ensureAuthenticated,function(req,res,next){
	var isbn=req.body.isbn;
	var readerId=res.locals.username;
	Borrow.return(readerId,isbn,function(err){
		if(err){
			return next(err);
		}
		Book.updataStatus('',1,isbn,function(err,rows){
			Book.findBooksByISBN(isbn,function (err,bookinfo) {
                res.json({msg:'还书成功！请将书归还到 <span style="color: red">' + bookinfo.address + '</span> 按图书序号归还原位'});
            })
		})
	});
});

//续借
router.post('/renew',ensure.ensureAuthenticated,function(req,res,next){
	var barcode=req.body.barcode;
	var readerId=res.locals.username;
	Borrow.renew(readerId,barcode,function(err){
		if(err){
			return next(err);
		}
		res.render('result_renew',{
			title:'续借结果-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}]
		});
	});
});

//借阅历史
router.get('/history',ensure.ensureAuthenticated,function(req,res,next){
	var readerId=res.locals.username;
	Borrow.findHistory(readerId,function(err,rows){
		if(err){
			return next(err);
		}
		rows.forEach(function(row){
			row.outdate=row.outDate;//格式化时间
			if(row.inDate == 0){
				row.indate = 0;
			}else{
				row.indate=row.inDate;
			}
		});
		res.render('history',{
			title:'借阅历史-我的图书馆',
			arr:[{sch:'',lib:'active',abt:'',log:''}],
			books:rows
		});
	});
});
module.exports = router;
