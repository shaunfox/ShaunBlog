# ShaunBlog
Any inspiration, any idea, any progress！


>  上个月跟着视频做完这个小项目，突然发现自己知识的局限，还有业务逻辑方面的欠缺。


*****


>  最近得闲，把页面美化了一下，也增加了部分功能：

* 主页的摘要部分支持HTML代码解析（背后是一个安全大坑，接下来等深入了解了安全方面的知识后再来填坑。）

* 正文支持MD写法

* 页面增加更多链接，让页面间跳转更方便。

*****

###### 项目虽然大体框架已经有了，但是亟待解决的问题依然众多：

* 评论的无安全监控

* 密码无加密处理

* 百度的UE编辑器还不知道如何插入后台发布系统

* node的项目不能在自己买的服务器上运行，还需要第三方托管

* 数据库的安全处理不够

* ......

`不要睡了！要做的事很多！`

*****


### 使用方法

* `npm install` 安装依赖

* 打开CMD，用mongod --dbpath=xxx(你存放此项目的文件夹地址)\db --port=27018

* 运行app.js
 
* 打开浏览器，转向  [localhost:8081](http://localhost:8081/ "Title")

* DB中预设管理员账号：admin  密码123

* 如有任何问题，请联系：`shaun.wang@hotmail.com`
