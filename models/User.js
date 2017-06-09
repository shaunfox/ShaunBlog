/**
 * Created by Shaun on 2017/6/5.
 */
var mongoose = require('mongoose');

var userSchema= require('../schema/users');

// 模型类的创建,返回一个构造函数
module.exports=mongoose.model('User', userSchema);