/**
 * Created by Shaun on 2017/6/5.
 */
var mongoose = require('mongoose');

// 分类的表结构,操作并不在这里，需要在models中建立Category.js
module.exports = new mongoose.Schema({
    name:String
});