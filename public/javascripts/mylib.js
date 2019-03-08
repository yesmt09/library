//借书、还书、续借、预约、取消预约等界面所需的js代码
//借书请求
function borrow_book(isbn) {
	var isbn = isbn;
	var readerId = $('input[readerId]').attr('readerId');
	if(readerId == ''){
		layer.msg('登录中...')
		location.href = '/login'
		return false;
	}
	$.ajax({
		url: '/borrow',
		type: 'post',
		dataType: 'json',
		data: {isbn: isbn,readerId:readerId},
	})
	.done(function(d) {
		layer.alert(d.msg,function(){
			location.href = '/mylib/myborrow'
		})
	})
}

//还书请求
$(document).ready(function() {
	$('.return').on('click',function(){
		var that = $(this)
		var isbn = that.parent().siblings('.isbn').text()
		$.ajax({
			url: '/mylib/return',
			type: 'post',
			dataType: 'json',
			data: {isbn: isbn},
		})
		.done(function(d) {
			layer.alert(d.msg,function(){
				location.reload();
			})
		})
		
	})
});

//预约请求
function book_order(isbn) {
    $.ajax({
		url: '/order',
		type: 'post',
		dataType: 'json',
		data: {isbn:isbn},
	}).done(function (data) {
        layer.alert(data.msg,function(){
            location.reload();
        })
    })
}

//取消预约
$(document).ready(function() {
	$(".cancel").each(function(index) {
		$(this).eq(index).click(function() {
			var url = "/mylib/cancel";
			var isbn = $(this).val();
			$.StandardPost(url, {
				isbn: isbn
			});
		});
	});
});

//构建post请求
$.extend({
	StandardPost: function(url, args) {
		var form = $("<form method='post'></form>");
		var input;
		form.attr({
			"action": url
		});
		$.each(args, function(key, value) {
			input = $("<input type='hidden'>");
			input.attr({
				"name": key
			});
			input.val(value);
			form.append(input);
		});
		form.appendTo(document.body);
		form.submit();
		document.body.removeChild(form[0]);
	}
});