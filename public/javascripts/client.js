
$(function() {

	var socket = io.connect('http://localhost:3000/');
	var timer;

	$('#form').submit(function() {
		socket.emit('all', {
			action: 'post',
			user: $('#user').val(),
			text: $('#message').val()
		});
		//socket.send($('#message').val());
		$('#message').attr('value', '');
		return false;
	});

	  $('#message').keydown(function(event) {
	      // イベント名'others'でメッセージをサーバに送信する
	      socket.emit('others', {
	        action: 'typing',
	        user: $('#user').val()
	      });
	  });

	  // サーバからのイベント'msg'を受信する
	  socket.on('msg', function(data) {
	    switch (data.action) {
	      case 'post': // 発言の描画
	        //$('#list').append($('<dt>' + data.user + '</dt><dd>' + data.text + '</dd>'));
	        $('#list').append($('<table><tr>'+
	        					'<td><img src="https://api.twitter.com/1/users/profile_image?screen_name='+data.user+'&size=normal"></td>'
	        					+'<td><div class="balloon">'+ data.text +'<br></div></td>'
	        					+'</tr></table>'));

	        break;
	      case 'typing': // タイピング中ステータスの描画
	        $('#typing').text(data.user + 'さんがタイピング中です...');
	        clearTimeout(timer);
	        timer = setTimeout(function() { $('#typing').empty(); }, 3000);
	        break;
	    }
	  });

});

