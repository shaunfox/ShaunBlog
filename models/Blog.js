
var mongoose = require('mongoose');

var blogSchema= require('../schema/blogs');

// 模型类的创建,返回一个构造函数
module.exports=mongoose.model('Blog', blogSchema);