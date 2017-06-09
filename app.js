/**
 * Created by Shaun on 2016/10/5.
 */
// load express module
var express = require('express');
var mongoose = require('mongoose');
// create app appilication, it equal to the Http.createServer() in NodeJS
var app = express();
var bodyParser= require('body-parser');
var swig = require('swig');
var User= require('./models/User');
var Cookies = require('cookies');

swig.setDefaults({cache:false});

app.engine('html', swig.renderFile);

app.set('view engine', 'html');

app.set('views', './views');

app.use('/public', express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({extended:true}));

// 无论任何时候用户访问网站，都会走这个流程
app.use(function (req, res, next) {
    req.cookies= new Cookies(req, res);
    // 解析用户的cookie信息
    req.userInfo={};
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            // 获取当前用户信息中的isAdmin字段
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                // console.log(req.userInfo);
                next();
            });
        }catch (e){
            next();
        }
    }else {
        next();
    }
});

app.use('/', require('./router/main'));
app.use('/admin', require("./router/admin"));
app.use('/api', require('./router/api'));


// listen

mongoose.connect('mongodb://localhost:27018/blog', function (err) {
    if(err){
        console.log('mongoose connects failure');
    }else{
        console.log('mongoose connects success');
        app.listen(8081);
    }
});