/**
 * Created by Shaun on 2016/10/5.
 */
var mongoose = require('mongoose');

var categorySchema= require('../schema/categories');

// 模型类的创建,返回一个构造函数
module.exports=mongoose.model('Category', categorySchema);