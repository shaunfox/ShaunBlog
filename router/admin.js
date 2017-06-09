
// load express module
var express = require('express');
var router = express.Router();

var User = require('../models/User');

var Category = require('../models/Category');

var Blog = require('../models/Blog');

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send('sorry, I am waiting for Shaun!');
        return;
    }
    next();
});

router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo:req.userInfo
    });
});

router.get('/user', function (req, res) {

    // 分页功能，限制获取的数据条数：limit()
    // // 忽略获取的数据条数 skip()
    // 分页逻辑：
    // 1:1-2  skip：0  -》（当前页-1）*limit数
    // 2:3-4  skip：2

    var page=Number(req.query.page ||1);
    var limit=10;

    User.count().then(function (count) {

        // 计算总页数
        pages= Math.ceil(count/limit);
        // 取值不能超过pages
        page=Math.min(page, pages);
        // 取值不能小于1
        page=Math.max(page, 1);
        var skip=(page-1)*limit;
        // 从数据库中读取所有用户数据
        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index', {
                userInfo:req.userInfo,
                users:users,
                page:page,
                pages:pages,
                limit:limit,
                count:count
            });
        });
    });
});


// 分类首页
router.get('/category', function (req, res, next) {
    var page=Number(req.query.page ||1);
    var limit=10;

    Category.count().then(function (count) {

        // 计算总页数
        pages= Math.ceil(count/limit);
        // 取值不能超过pages
        page=Math.min(page, pages);
        // 取值不能小于1
        page=Math.max(page, 1);
        var skip=(page-1)*limit;
        // 从数据库中读取所有用户数据
        Category.find().limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo:req.userInfo,
                categories:categories,
                page:page,
                pages:pages,
                limit:limit,
                count:count
            });
        });
    });
});


// 分类添加
router.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo:req.userInfo
    });
});
// 分类保存
router.post('/category/add', function (req, res) {
    var categoryname= req.body.name || '';

    if(categoryname == ''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:"名称不能为空"
        });
        return;
    }

    // 查看是否存在同名的分类
    Category.findOne({
        name: categoryname
    }).then(function (rs) {
        if(rs){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"存在同名的分类"
            });
            return Promise.reject();
        }else {
            // 不存在同名，可以保存
            return new Category({
                name:categoryname
            }).save();
        }
    }).then(function (newCategory) {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"分类保存成功！",
            url:'/admin/category'
        });
    })
});

// 分类的修改
router.get('/category/edit', function (req, res) {
    // 获取分类信息，用表单形式展现出来
    var id = req.query.id || '';
    // 获取要修改的分类信息
    Category.findOne({
        _id:id
    }).then(function (category) {
        // console.log(category);
        if (!category){
            res.render('admin/error', {
                userInfo:req.userInfo,
                message:"分类信息不存在"
            });
            return Promise.reject();
        }else{
            res.render('admin/category_edit', {
                userInfo:req.userInfo,
                category:category
            })
        }
    });
});


// 分类的修改保存
router.post('/category/edit', function (req, res) {
    // 获取要修改的分类信息，用表单表现出来
    var id = req.query.id || "";
    // 获取post过来的名称
    var name = req.body.name || "";

    Category.findOne({
        _id:id
    }).then(function (category) {
        // console.log(category);
        if (!category){
            res.render('admin/error', {
                userInfo:req.userInfo,
                message:"分类信息不存在"
            });
            return Promise.reject();
        }else{
            // 当用户没做任何修改就提交
            if (name==category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:"保存成功",
                    url:'/admin/category'
                });
                return Promise.reject();
            }else {
                // 要修改的分类名称，是否已经在数据库中存在
                return Category.findOne({
                    _id:{$ne:id},
                    name:name
                });
            }
        }
    }).then(function (sameCategory) {
        if (sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:"此名称在分类中已存在"
            });
            return Promise().reject();
        }else {
            return Category.update({
                _id:id
            },{
                name:name
            });
        }
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"修改成功",
            url:'/admin/category'
        });
    });
});

router.get('/category/delete', function (req, res) {
    var id = req.query.id || "";

    Category.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/category'
        });
    })
});


// 内容首页
router.get('/blog', function (req, res) {
    var page=Number(req.query.page ||1);
    var limit=10;

    Blog.count().then(function (count) {

        // 计算总页数
        pages= Math.ceil(count/limit);
        // 取值不能超过pages
        page=Math.min(page, pages);
        // 取值不能小于1
        page=Math.max(page, 1);
        var skip=(page-1)*limit;
        // 从数据库中读取所有用户数据
        Blog.find().limit(limit).skip(skip).populate(['category', 'user']).sort({
            addTime:-1
        }).then(function (blogs) {
            res.render('admin/blog_index', {
                userInfo:req.userInfo,
                blogs:blogs,
                page:page,
                pages:pages,
                limit:limit,
                count:count
            });
        });
    });
});

// 内容添加页面
router.get('/blog/add', function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {

        res.render('admin/blog_add', {
            userInfo:req.userInfo,
            categories:categories
        })
    });
});


// 内容save页面
router.post('/blog/add', function (req, res) {
    console.log(req.userInfo);
    if (req.body.category==""){
        res.render('admin/error', {
            userInfo:req.userInfo,
            message:"所属分类不能为空"
        });
        return;
    }

    if (req.body.title==""){
        res.render('admin/error', {
            userInfo:req.userInfo,
            message:"标题不能为空"
        });
        return;
    }
    // 保存数据到数据库
    new Blog({
        category:req.body.category,

        // 内容标题
        title:req.body.title,

        // 作者
        user:req.userInfo,

        // 简介
        description:req.body.description,

        // 内容
        content:req.body.content
    }).save().then(function (newBlog) {
        res.render('admin/success', {
            userInfo:req.userInfo,
            message:"内容保存成功"
        });
    });

});



// 博客的修改
router.get('/blog/edit', function (req, res) {
    // 获取分类信息，用表单形式展现出来
    var id = req.query.id || '';
    // 获取要修改的分类信息

    var categories = [];

    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Blog.findOne({
            _id:id
        }).populate('category');
        }).then(function (blog) {
        // console.log(category);
        if (!blog){
            res.render('admin/error', {
                userInfo:req.userInfo,
                message:"分类信息不存在"
            });
            return Promise.reject();
        }else{
            res.render('admin/blog_edit', {
                userInfo:req.userInfo,
                categories:categories,
                blog:blog
            })
        }
    });
});


// blog内容的修改 and 保存
router.post('/blog/edit', function (req, res) {
    // 获取要修改的分类信息，用表单表现出来
    var id = req.query.id || "";
    if (req.body.category==""){
        res.render('admin/error', {
            userInfo:req.userInfo,
            message:"所属分类不能为空"
        });
        return;
    }

    if (req.body.title==""){
        res.render('admin/error', {
            userInfo:req.userInfo,
            message:"标题不能为空"
        });
        return;
    }
    console.log(req.userInfo.username);
    Blog.update({
        _id:id
        },{
        category:req.body.category,
        // 内容标题
        title:req.body.title,

        // 简介
        description:req.body.description,

        // 内容
        content:req.body.content
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"内容修改成功",
            url:'/admin/blog'
            // url:'/admin/blog/edit?id='+id
        });
    });
});



// blog内容删除页面
router.get('/blog/delete', function (req, res) {
    var id = req.query.id || "";

    Blog.remove({
        _id:id
    }).then(function () {
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:"删除成功",
            url:'/admin/blog'
        });
    })
});


module.exports=router;