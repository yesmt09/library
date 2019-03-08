var express = require('express');
var router = express.Router();
var passport = require('passport');
var logger = require('logger').createLogger();
var LocalStrategy = require('passport-local').Strategy;
var Book=require('../models/book');
var ensure = require('../ensure.js');


//管理页面
router.post('/getbook',ensure.ensureAuthenticated,function(req,res){
	var isbn = req.body.isbn;
	Book.findBooks('isbn',isbn, function(err,rows){
		if(err){
			console.log('findbooks:'+err)
			next(err)
			return err;
		}
        if(rows.length < 1){
        	res.json({status:0,msg:'没有这本书'})
        }else{
        	res.json({status:1,book:rows[0]})
        }
    })
});

//添加书籍
router.post('/edit',ensure.ensureAuthenticated,function(req,res,next){
	var bookInfo = req.body;
	logger.info(bookInfo);
	if (typeof bookInfo.isbn === 'undefined' || bookInfo.isbn == '') {
		addBook(res, next, bookInfo);
	} else {
        Book.findBooks('isbn',bookInfo.isbn, function(err,rows){
            if(err){
                logger.warn('findbooks:'+err);
                next(err);
                return err;
            }
            modBook(res, next,bookInfo);
        })
	}
});

//添加
function addBook(res, next, bookInfo) {
    Book.addBook(bookInfo,function(err,rows){
        if(err){
            console.log('addBook:'+err)
            next(err)
            return err;
        }
        res.json({msg:'添加成功',status:1});
    })
}

//修改
function modBook(res, next, bookInfo) {
    Book.updataBook(bookInfo,function(err,rows){
        if(err){
            console.log('updataBook:'+err)
            next(err)
            return err;
        }
        res.json({msg:'修改成功',status:2});
    })
}


//管理页面
router.get('/',ensure.ensureAuthenticated,function(req,res,next){
	if(req.session.isManager){
		next()
	}else{
		return res.redirect('/')
	}
},function(req,res){
	Book.findBooks('*',null,function(err,rows){
		if(err){
			console.log(err);
			return err;
		}
		res.render('modify',{
			title:'书籍管理',
			arr:[{sch:'active',lib:'',abt:'',log:''}],
			books:rows
		});
	})
});
//管理页面
router.post('/',ensure.ensureAuthenticated,function(req,res){
	var isbn = req.body.isbn
	Book.deleteBook(isbn,function(err,rows){
    	if(err){
			console.log('deleteBook:'+err)
			next(err)
    		return err;
    	}
    	res.json({status:1,msg:'删除成功'});
    })
});

module.exports = router;