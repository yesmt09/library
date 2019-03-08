"use strict";

var express = require('express');
var router = express.Router();
var logger = require('logger').createLogger();
var User=require('../models/user');
var Book=require('../models/book');
var Borrow=require('../models/borrow');
var Order=require('../models/order');
var bouncer = require('../bin/bouncer');
var ensure = require('../ensure.js');

router.post('/order',function (req,res) {
	Order.save(res.locals.username,req.body.isbn,function (err) {
		if (err) {
			return next(err);
		} else {
			res.json({
				msg:'预约成功'
			})
		}
    })
})

//跳转搜索页
router.get('/',function(req,res){
	res.redirect('/search');
});

//获取书目检索页
router.get('/search',function(req,res){
	Book.findBooks('*',null,function(err,rows){
		if(err){
			console.log(err);
			return err;
		}
		res.render('search',{
			title:'书目检索-书籍管理系统',
			arr:[{sch:'active',lib:'',abt:'',log:''}],
			books:rows
		});
	})
});

//提交借书请求
router.post('/borrow',ensure.ensureAuthenticated,function(req,res,next){
	var borrowOption = {
		isbn:req.body.isbn,//书籍条码号
		readerId:res.locals.username//读者证件号
	}
	Borrow.findNowBorrow(borrowOption.readerId,function (err, result) {
		if (err) {
			return next(err);
		}
		if(result == '') {
			Book.findBooksByISBN(borrowOption.isbn, function (err, bookinfo, booksState) {
				if (err) {
					return next(err);
				}
				if(bookinfo.status != 1) {
					res.json({
						msg:'图书已借出给 ' + booksState.type
					});
				} else {
					Borrow.save(borrowOption,function(err){
						if (err) {
							return next(err);
						}
						Book.updataStatus(borrowOption.readerId,2,borrowOption.isbn,function(err,rows){
							if (err) {
								return next(err);
							}
							var date = new Date();
                            date.setTime(date.getTime() + (15 * 86400 * 1000))
							res.json({
								msg:'借阅成功,请到 <span style="color: red">' +  bookinfo.address + '</span> 处领取! 归还时请放回原位<br /> 借阅到期时间 <span style="color: red">' + date.toDateString() + '</span>',
							});
						})
					});
				}
			})
		}else {
            res.json({
                msg:'当前已借阅一本书，请归还后再次借阅',
            });
		}
    })
});

//获取登录页
router.get('/login',ensure.ensureAuthenticated,function(req,res,next){
	res.redirect('/search');
});


//退出登录
router.get('/loginOut',function(req,res,next){
	bouncer.logout(req, res, next);
});

//关于
router.get('/about',function(req,res){
	res.render('about',{
		title:'关于-图书管理系统',
		arr:[{sch:'',lib:'',abt:'active',log:''}]
	});
});


module.exports = router;
