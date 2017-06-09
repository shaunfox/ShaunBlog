/**
 * Created by Shaun on 2016/10/5.
 */
var mongoose = require('mongoose');

// blog的内容的表结构,操作并不在这里，需要在models中建立Category.js
module.exports = new mongoose.Schema({
    // 该字段是关联字段，所以不能设置字符串，-----分类的id
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    },

    //关联字段 - 用户ID
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用  另一张表的model model/User.js
        ref:"User"
    },

    // 添加时间
    addTime: {
        type: Date,
        default: new Date()
    },

    // 阅读量
    clicks: {
        type: Number,
        default: 0
    },


    // 内容标题
    title: String,

    // 简介
    description: {
        type: String,
        default: ''
    },

    // 内容
    content: {
        type: String,
        default: ''
    },

    // 评论
    comments:{
        type:Array,
        default:[]
    }

});
