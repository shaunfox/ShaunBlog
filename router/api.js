/**
 * Created by Shaun on 2017/6/5.
 */

// load express module
var express = require('express');
var router = express.Router();

var User= require('../models/User');
var Blog= require('../models/Blog');


// 设置统一返回格式，初始化
var resData;
router.use(function (req, res, next) {
    resData={
        code:0,
        message:""
    };

    next();
});

// 增加注册路由
router.post('/user/register', function (req, res, next) {
    var username=req.body.username;
    var password=req.body.password;
    var repassword=req.body.repassword;

    // 验证username是否为空
    if(username ==''){
        resData.code=1;
        resData.message='用户名不能为空！';
        res.json(resData);
        return;
    }

    // 密码不能为空
    if(password ==''){
        resData.code=2;
        resData.message='密码不能为空！';
        res.json(resData);
        return;
    }

    // 两次输入密码必须一致
    if(repassword != password){
        resData.code=3;
        resData.message='两次输入密码必须一致！';
        res.json(resData);
        return;
    }
    // 用户名是否已经被注册
    User.findOne({
        username:username
    }).then(function (userInfo) {
        if (userInfo){
            resData.code=4;
            resData.message='用户名已经被注册！';
            res.json(resData);
            return;
        }
        // 保存注册数据
        var user = new User({
            username:username,
            password:password
        });
        return user.save();
    }).then(function (newUserInfo) {
        // console.log(newUserInfo);
        resData.message="注册成功";
        res.json(resData);
    });
});

router.post('/user/login', function (req, res) {
    var username=req.body.username;
    var password=req.body.password;

    if(username == '' ||password ==''){
        resData.code=1;
        resData.message="用户名或密码不能为空";
        res.json(resData);
        return;
    }


    // 查询数据库中用户名和密码记录是否存在，如果存在则登陆成功

    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if (!userInfo){
            resData.code=2;
            resData.message="用户名或密码错误";
        res.json(resData);
            return;
        }

        // 走到这一步，说明用户名和密码正确，可以登录
        resData.message="登录成功";
        resData.userInfo={
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(resData);
        return;
    })
});

router.get('/user/logout', function (req, res) {
    req.cookies.set('userInfo', null);
    resData.message="退出成功";
    res.json(resData);
});


// 获取指定文章的所有评论
router.get('/comment', function (req, res) {
    var blogId = req.query.blogid||'';
    Blog.findOne({
        _id:blogId
    }).then(function (blog) {
        resData.data=blog.comments;

        // 将resData返回前端
        res.json(resData);
    });
});



// 评论提交
router.post('/comment/post', function (req, res) {
    // 前端传过来的ID
    var blogId=req.body.blogid||'';

    var postData={
        username:req.userInfo.username,
        postTime:new Date(),
        content:req.body.content
    };

    // 查询当前这篇内容的信息
    Blog.findOne({
        _id:blogId
    }).then(function (blog) {
        blog.comments.push(postData);
        return blog.save();
    }).then(function (newBlog) {
        resData.message='评论成功';

        // 刷新新评论
        resData.data=newBlog;

        // 将resData返回前端
        res.json(resData);
    });


});

module.exports=router;