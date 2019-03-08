$(function(){
	$('#add_book').on('submit',function(e){
		var data = {}
        $.each($(this).serializeArray(),function (index,value) {
            data[value.name] = value.value
        });
		data.isbn = $('#isbn').val()
		console.log(data);
		$.ajax({
			url: '/admin/edit',
			type: 'post',
			dataType: 'json',
			data: data,
		})
		.done(function(d) {
			layer.alert(d.msg,function(){
				location.reload();
			})
		})
		
		
		e.preventDefault();
	})

	$('#modal_add_book').on('show.bs.modal', function (event) {
		
		$('#add_book')[0].reset();
		var button = $(event.relatedTarget).text() == '' ? '修改' : $(event.relatedTarget).text()// Button that triggered the modal
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.

		var modal = $(this)
		modal.find('.btn_submit').text(button)
	})

	$('.table').on('click','.btn_modify',function(){
		var isbn = $(this).parent().siblings('.isbn').text();
		var readerId = $('input[readerId]').attr('readerId');
		if(readerId == ''){
			layer.msg('登录中...')
			location.href = '/login'
			return false;
		}
		var that = $(this);
		$.ajax({
			url: '/admin/getbook',
			type: 'post',
			dataType: 'json',
			data: {isbn: isbn},
		})
		.done(function(d) {
			if(d.status == 0){
				layer.alert(d.msg)
			}else{
				$('#modal_add_book').modal('show')
				$('#modal_add_book #isbn').val(d.book.isbn).attr('disabled','disabled')
				$('#modal_add_book #title').val(d.book.title)
				$('#modal_add_book #author').val(d.book.author)
				$('#modal_add_book #press').val(d.book.press)
				$('#modal_add_book #address').val(d.book.address)
				$('#modal_add_book #content').val(d.book.content)
				$('#modal_add_book #callNumber').val(d.book.callNumber)
                $('#modal_add_book #status').val(d.book.status)
			}
		})
	})

	$('.table').on('click','.btn_delete',function(){
		var that = this;
		var isbn = $(this).parent().siblings('.isbn').text()
		layer.confirm('确定要删除这本书么？', function(){
			$.ajax({
				url: '/admin',
				type: 'post',
				dataType: 'json',
				data: {isbn: isbn},
			})
			.done(function(d) {
				if(d.status != 0){
					layer.alert(d.msg,function(){
						location.reload();
					})
				}else{
					layer.alert(d.msg)
				}
				
			})
		})
	})
})