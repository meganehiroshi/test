
$(function() {

	var socket = io.connect('http://localhost:3000/');
	var timer;

	socket.on('connected', function() {
		socket.json.emit('init', {
			roomid : js_roomid,
			id : js_id ,
			name : js_name
			});
	});


	$('#form').submit(function() {
		socket.emit('all', {
			action: 'post',
			user: $('#user').val(),
			id: $('#id').val(),
			message: $('#message').val()
		});
		//socket.send($('#message').val());
		$('#message').attr('value', '');
		return false;
	});

	    $("a.likepoint").click(function(e) {
	    	var chatid =  $(this).find("span").attr("id");
	    	var html = $(this).find("span").html();
	    	window.alert("click! " + chatid +" html "+html);
	    	socket.emit('like',{
	    		id: $('#id').val(),
	    		chatid: $('#chatid').val()
	    	});
	    });

	    $("a.warnpoint").click(function(e) {
	    	window.alert("click!");
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
		  //window.alert('socket on msg');
	    switch (data.action) {
			case 'post': // 発言の描画
				//$('#list').append($('<dt>' + data.user + '</dt><dd>' + data.message + '</dd>'));
				$('#list').append($('<table><tr>'+
									'<td><img src="https://api.twitter.com/1/users/profile_image?screen_name='+data.user+'&size=normal" style="height:40px;"></td>'
									+'<td><div class="balloon">'+ data.message
									+'<input type="hidden" id="" value="">'
									+'<li><a href="#" class="likepoint"><i class="icon-thumbs-up"></i></a><a href="#" class="warnpoint" style="color:orange;"><i class="icon-warning-sign"></i></a></li></div></td>'
									+'</tr></table>'));
				break;
			case 'typing': // タイピング中ステータスの描画
				$('#iventMsg').text(data.user + 'さんがタイピング中です...');
				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
			case 'join': // 入室
				$('#iventMsg').text(data.user + 'さんが入室しました！');
				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
			case 'exit': // 退室
				$('#iventMsg').text(data.user + 'さんが退室しました。');
				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
	    }
	  });

});

