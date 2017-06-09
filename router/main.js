/**
 * Created by Shaun on 2017/6/5.
 */

// load express module
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var User=require('../models/User');
var Blog = require('../models/Blog');
var markdown = require('markdown').markdown;

var data;
// 处理通用数据
router.use('/', function (req, res, next) {
    data={
        userInfo:req.userInfo,
        categories:[],
        users:[]
    };

    Category.find().then(function (categories) {
        data.categories=categories;
        next();
    });

    // User.find().then(function (users) {
    //     data.users=users;
    //     next();
    // });
});



router.get('/', function (req, res, next) {
    data.category=req.query.category || "";
    data.count=0;
    data.blogs=[];
    data.page=Number(req.query.page ||1);
    data.limit=5;
    data.pages=0;

    var where= {};
    if (data.category){
        where.category=data.category;
    }
    Blog.where(where).count().then(function (count) {
        data.count=count;
        // 计算总页数
        data.pages= Math.ceil(data.count/data.limit);
        // 取值不能超过pages
        data.page=Math.min(data.page, data.pages);
        // 取值不能小于1
        data.page=Math.max(data.page, 1);

        var skip=(data.page-1)*data.limit;

        return Blog.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
            addTime:-1
        });

    }).then(function(blogs){
        console.log(blogs);
        data.blogs = blogs;
        //
        // data.blogs = blogs;

        res.render('main/index', data);
    });
});

// 详情页&&markdown的实现
router.get('/view', function (req, res) {
    var blogId=req.query.blogid||'';
    Blog.findOne({
        _id:blogId
    }).then(function (blog) {
        console.log(blog);
        data.blog=blog;
        blog.clicks++;
        return blog.save();
        }).then(function () {
        //markdown转html
        data.blog.content=markdown.toHTML(data.blog.content);
        res.render('main/view', data);
    });
});


module.exports=router;