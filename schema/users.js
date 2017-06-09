/**
 * Created by Shaun on 2017/6/5.
 */
var mongoose = require('mongoose');

// 用户的表结构,操作并不在这里，需要在models中建立User.js
module.exports = mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});