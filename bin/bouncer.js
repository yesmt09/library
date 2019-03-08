/**
 * Created by Administrator on 2016/9/6.
 */
"use strict";

var bouncer_sdk = require('node_oauth_sdk');
var User = require('../models/user');
var ensure = require('../ensure.js');
            
function getOptions(req, res, next, cb) {
    return {
        "appkey": 'b8694d827c0f13f22ed3bc',
        "appid": 0,
        "res": res,
        "req": req,
        "cb": cb
    };
};

module.exports.login = function (req, res, next) {
    if (req.session.BabelTimeToken === undefined && req.session.username === undefined) {
        var cb = function (data) {
            if (data.body.status !== false) {
                req.session.username = data.body.info.username;
                req.session.BabelTimeToken = req.query.BabelTimeToken;
                if (ensure.IsManager(req.session.username)) {
                    req.session.isManager =true;
                } else {
                    req.session.isManager =false;
                }
                data.res.writeHead(302, {'Location': req.originalUrl});
                data.res.end();
            } else {
                data.res.writeHead(302, {'Location': req.originalUrl});
                data.res.end();
            }
            User.findUserByreaderId(req.session.username, function(err,rows){
                if(rows.length < 1){
                    User.addUser(req.session.username,function(err,rows){})
                }
            })
            
        }

        bouncer_sdk.login(getOptions(req, res, next, cb));
    } else {
        data.res.writeHead(302, {'Location': req.originalUrl});
        data.res.end();
    }
};

module.exports.logout = function (req, res, next) {

    if (req.session.BabelTimeToken === undefined && req.session.username === undefined) {
        next();
    } else {
        var cb = function (data) {
            data.req.session.username = undefined;
            data.req.session.BabelTimeToken = undefined;
            data.req.flash('success','退出成功');
            data.res.writeHead(302, {'Location': "/search"});
            data.res.end();
        }
        bouncer_sdk.logout(getOptions(req, res, next, cb));
    }
}

