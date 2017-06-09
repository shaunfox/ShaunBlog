// 每页显示评论数,当前页和总页数
var perpage=3;
var page=1;
var pages=0;
var comments=[];

//提交评论

$('#commentBtn').on('click', function () {
    console.log('1');

    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            blogid: $('#blogId').val(),
            content: $('#commentContent').val()
        },
        success:function (resData) {
            // 清空评论框里的内容
            $('#commentContent').val('');
            comments=resData.data.comments.reverse();

            // 当前页不是1时，提交评论自动跳转到第一页
            page=1;
            renderComment();
        }
    })
});

// 每次页面重载，获取该文章的所有评论
    $.ajax({
        url:'/api/comment',
        data:{
            blogid: $('#blogId').val()
        },
        success:function (resData) {
            comments=resData.data.reverse();
            renderComment();
        }
    });



// 通过事件委托机制，做翻页效果

$('.pager').delegate('a', 'click', function () {
   if ($(this).parent().hasClass('previous')){
       page--;
   }else{
       page++;
   }
   renderComment();
});



// 根据resData渲染评论区

function renderComment() {
    $('#messageCount').html(comments.length);
    pages=Math.ceil(comments.length/perpage);

    // 所有li条数
    var $lis=$('.pager li');
    $lis.eq(1).html(page +'/'+ pages);

    var start=Math.max(0, (page-1)*perpage),
        end=Math.min(start+perpage, comments.length);

    if (page<=1){
        page=1;
        $lis.eq(0).html('<span>&nbsp首&nbsp页&nbsp</span>');
    }else {
        $lis.eq(0).html('<a href="####">&nbsp上&nbsp页&nbsp</a>');
    }

    if (page>=pages){
        page=pages;
        $lis.eq(2).html('<span>&nbsp末&nbsp页&nbsp</span>');
    }else {
        $lis.eq(2).html('<a href="####">&nbsp下&nbsp页&nbsp</a> ');
    }


    if(comments.length==0){
        $('.messageList').html('<li class="list-group-item">还没留言，快来抢沙发！</li>');
    }else {
        var html='';
        for (var i=start; i<end;i++){
            html+='<div class="panel panel-default messagebox"><div class="panel-heading "><h3 class="panel-title">'+formatDate(comments[i].postTime)+'&nbsp&nbsp&nbsp&nbsp&nbsp留言者:'+comments[i].username+'</h3></div><div class="panel-body">'+comments[i].content+'</div></div>';
        }
        $('.messageList').html(html);
    }

    console.log(page);
}


function formatDate(d) {
    // d为String，所以将其改为日期对象
        var date1 = new Date(d);
        function pending(num) {
            return num<10?'0'+num:num;
        }
        return date1.getFullYear() +'-'+pending(date1.getMonth()+1) +'-'+pending(date1.getDate()) +' '+pending(date1.getHours()) +':'+pending(date1.getMinutes()) +':'+pending(date1.getSeconds());
}