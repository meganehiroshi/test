$(function() {

	var socket = io.connect('http://localhost:3000/');
	var timer;

	$(".tag-button").mouseup(function() {
		//tagid = $(this).attr("id");
		//$('input[type=hidden]').val(tagid);
		$('#form').submit(function() {
			socket.emit('settag', {
				action: 'post',
				tagid: $(this).attr("id"),
				userid: 1
			});
			//socket.send($('#message').val());
			//$('#message').attr('value', '');
			return false;
		});
	});

	  $('#message').keydown(function(event) {
	      // イベント名'others'でメッセージをサーバに送信する
	      socket.emit('others', {
	        action: 'typing',
	        user: $('#user').val()
	      });
	  });

	  // サーバからのイベント'msg'を受信する
	  socket.on('settag-result', function(data) {
	    switch (data.action) {
	      case 'err': // 発言の描画

	        break;
	      case 'success': // タイピング中ステータスの描画
	        $('#typing').text(data.user + 'さんがタイピング中です...');
	        break;
	    }
	  });

});

