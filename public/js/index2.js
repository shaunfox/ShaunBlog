$(function () {
    var $loginBox= $('#loginBox');
    var $registerBox= $('#registerBox');
    var $userInfo= $('#userInfo');

// 切换到注册面板
    $loginBox.find('a.colMint').on('click', function () {
        $loginBox.hide();
        $registerBox.show();
    });

// 切换到登录面板
    $registerBox.find('a.colMint').on('click', function () {
        $registerBox.hide();
        $loginBox.show();
    });

    // 注册表单提交
    $registerBox.find('button').on('click', function () {
        // 通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data:{
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (result) {
                $registerBox.find(".colWarning").html(result.message);
                if (!result.code){
                    // code如果是0，代表注册成功，即!result.code
                    setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);
                }
            }
        });
    });

    // 登录表单提交
    $loginBox.find('button').on('click', function () {
       $.ajax({
           type: 'post',
           url:'/api/user/login',
           data:{
               username: $loginBox.find('[name="username"]').val(),
               password: $loginBox.find('[name="password"]').val()
           },
           dataType:'json',
           success:function (result) {
                $loginBox.find(".colWarning").html(result.message);
                if(!result.code){
                    // setTimeout(function () {
                    //     $loginBox.hide();
                    //     $userInfo.show();
                    //     // 显示用户信息
                    //     $userInfo.find('.username').html(result.userInfo.username);
                    //     $userInfo.find('.info').html('你好，欢迎登陆ShaunBlog');
                    // },1000)
                    window.location.reload();
                }
           }
       })
    });

    // 退出逻辑实现
    $('#logoutBtn').on('click', function () {
        $.ajax({
            url: '/api/user/logout',
            success:function (result) {
                if (!result.code){
                    window.location.reload();
                }
            }
        });
    });

    $('#blogContent').html($('#blogContent').text());

    var $blogPost=$('.blog-post');
    for(var i=0; i<=$blogPost.length; i++){
        $('.blogDescription').eq(i).html($('.blogDescription').eq(i).text());
    }


});

