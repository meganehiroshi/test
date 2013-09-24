
$(function() {

	var socket = io.connect('http://localhost:3000/');
	var timer;
	var countMax = 140; //メッセージ最大文字数

	socket.on('connected', function() {
		socket.json.emit('init', {
			roomid : js_roomid,
			id : js_id ,
			name : js_name
			});
		chatScrollEnd();
	});

	/***** 過去のチャットを取得する *****/
	$('#list').scroll(function(){

		//チャットリストの位置が一番上に来たかの判定
		if($('#list').scrollTop() == 0 ){

			//チャットリストの先頭に"Loading"のアイコンを表示
			$('#list').prepend("<i class='icon-spinner icon-spin icon-large' id='loadingIcon' style='padding:15;'></i>");

			socket.emit('moreChatList', {
				id:js_id,
				minChatid:$('#startitem').text()
			});
		}
	});


	/***** コメント欄の確定 *****/
	$('#form').submit(function() {

		socket.emit('all', {
			action: 'post',
			user: $('#user').val(),
			id: $('#id').val(),
			message: $('#message').val(),
			chatid:''
		});
		//socket.send($('#message').val());
		$('#message').attr('value', '');
		$('.count').html(countMax);

		return false;
	});

	/***** イイネボタンを押下(初期表示されるイイネボタンのイベント登録) *****/
	$("a.likepoint").click(clickLike);

	/***** イイネボタンを押された後の登録処理 *****/
	function clickLike() {

	var chatid =  $(this).find("span").attr("id");
	chatid = chatid.substring(5);// "like_123"➡"123"に文字列書き換え
	//window.alert('chatid:' + chatid);
	socket.emit('like',{
		id: $('#id').val(),
		chatid: chatid,
		likeCount : '',
		action:'like'
		});
	//window.alert('end:');
	}


	/***** 警告ボタンを押下(初期表示される警告ボタンのイベント登録) *****/
	$("a.warnpoint").click(clickWarn);

	/***** 警告ボタンを押された後の登録処理 *****/
	function clickWarn() {
	}

	/***** イイネボタンを押された後の登録処理 *****/
	function getLikeCount() {

	var chatid =  $(this).find("span").attr("id");
	chatid = chatid.substring(5);// "like_123"➡"123"に文字列書き換え
	//window.alert('chatid:' + chatid);
	socket.emit('getLikeCount',{
		id: $('#id').val(),
		chatidList: chatidList
		});
	//window.alert('end:');
	}

	/***** コメント欄を入力中 *****/
	$('#message').keydown(function(event) {
		// イベント名'others'でメッセージをサーバに送信する
		socket.emit('others', {
			action: 'typing',
			user: $('#user').val()
			});
	});

	/***** コメント欄の文字数カウント *****/
	$('#message').bind('keydown keyup keypress change',function(){
		var thisValueLength = $(this).val().length;
		var countDown = (countMax)-(thisValueLength);
		$('.count').html(countDown);

		if(countDown < 0){
			$('.count').css({color:'#ff0000',fontWeight:'bold'});
			$('#btnMsgSubmit').attr('disabled', true);
		} else {
			$('.count').css({color:'#000000',fontWeight:'normal'});
			$('#btnMsgSubmit').attr('disabled', true);
			$('#btnMsgSubmit').removeAttr('disabled');
		}
	});
	$(window).load(function(){
		$('.count').html(countMax);
	});

	  // サーバからのイベント'moreChatList'を受信する
	  socket.on('moreChatList', function(data) {

			//過去のチャットリスト格納配列
			//var li =[];
		    var chatlist;
			for(i=0; i < data.length ; i++){
				//リストの初めにstartitemを挿入
				if(i==0){
					/* startitemを一旦削除し、最新のminChatidをセットしてから再度リストに追加 */
					$('#startitem').remove();
					chatlist = '<span id="startitem" hidden="hidden">' + data[i].chatid + '</span>';
				}

				chatlist = chatlist + chatMsgFormat(data[i]);
			}

			clearTimeout(timer);
		    timer = setTimeout(function() {

					/* 取得した過去チャットリストを追加 */
					$('#list').prepend(chatlist).fadeIn('2000');

		    		/* チャットリストのスクロール位置をLoadingアイコンの場所に戻す */
			    	var height = document.getElementById('loadingIcon').offsetTop;
			    	var offset = document.getElementById('list').offsetTop;
			    	var moge = $('#loadingIcon').outerHeight();

			    	/* Loadingアイコンの削除 */
			    	$('#loadingIcon').remove();

			    	/* スクロール位置を設定 */
			    	$('#list').scrollTop(height - offset - moge);

			    	/* イイネボタン、警告ボタンのイベントの登録 */
			    	$('.likepoint').unbind();
			    	$('.warnpoint').unbind();
			    	$('.likepoint').bind('click',clickLike);
			    	$('.warnpoint').bind('click',clickWarn);
		    	}, 700);
		});


	  // サーバからのイベント'msg'を受信する
	  socket.on('msg', function(data) {
		  //window.alert('socket on msg');
	    switch (data.action) {
			case 'post': // 発言の描画
				$('#list').append(chatMsgFormat(data));
				chatScrollEnd();	//スクロールを一番下に合わせる
				chatSendCount(data.id)	//連続投稿数のカウント

				break;
			case 'typing': // タイピング中ステータスの描画
				$('#iventMsg').text(data.user + 'さんがタイピング中です...');
				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
			case 'join': // 入室
				$('#iventMsg').text(data.user + 'さんが入室しました！');

				if(js_id == data.id){
					//window.alert('自分が入室');
					//入室したのが自分自身なら、すでに入室済みのメンバーのアイコンを表示
					for(i=0; i < data.memberlist.length ; i++){
						$('#memberlisttd').append($('<img id="member' + data.memberlist[i] + '" src="https://s3-ap-northeast-1.amazonaws.com/talkmobprofile/' + data.memberlist[i] + '" class="img-rounded">'));
					}
				}else{
					//window.alert('他人が入室');
					//入室したのが他人なら、そのひとのアイコンを追加
					$('#memberlisttd').append($('<img id="member' + data.id + '" src="https://s3-ap-northeast-1.amazonaws.com/talkmobprofile/' + data.id + '" class="img-rounded">'));
				}

				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
			case 'exit': // 退室
				$('#iventMsg').text(data.user + 'さんが退室しました。');
				$('#member' + data.id ).remove();
				clearTimeout(timer);
				timer = setTimeout(function() { $('#iventMsg').empty(); }, 3000);
				break;
			case 'like': // イイネ
				$('#like_' + data.chatid).text(data.likeCount);
				break;
	    }
	  });




});



function chatMsgFormat(data){

	var msg =  	'<div style="padding:4px;">'
		+'<div class="row-fluid" style="float:left;">'
		+'  <div style="float:left;"><img src="https://s3-ap-northeast-1.amazonaws.com/talkmobprofile/'+data.id+'" style="height:40px;"></div>'
		+'  <div class="balloon" style="float:left;padding:10px;" >'+ data.message
		+'    <input type="hidden" id="chatid" value="' + data.chatid + '">'
		+'    <div style="padding:0px;margin:0px;">'
		+'      <a href="#" class="likepoint"><i class="icon-thumbs-up"></i><span id="like_'+data.chatid+'"></span></a>'
		+'      <a href="#" class="warnpoint" style="color:orange;"><i class="icon-warning-sign"></i><span id="warn_'+data.chatid+'"></span></a>'
		+'    </div>'
		+'  </div>'
		+'</div>'
		+'<div class="row-fluid">'
		+'  <div style="float:right;padding:0px;font-size:10px;color:#999;">' +data.createdate
		+'  </div>'
		+'</div></div>';
	return msg;

}


//チャットリストの一番下へスクロール
function chatScrollEnd(){
	//一度、目印のlastitemを削除
	if($('#lastitem') != null){
		$('#lastitem').remove();
	}

	//チャットリストの最後尾にlastitemを追加
	$('#list').append("<li id='lastitem'></li>");

	//lastitemにスクロール一を合わせる
	//var height= $('#lastitem').offset().top;//これだと位置がずれる
	var height = document.getElementById('lastitem').offsetTop;
	$('#list').animate({scrollTop: height},'slow');
}

//連続投稿数制御
function chatSendCount(chatUserId){

	var msgMax = 2;
	var myId = $('#id').val();
	var lastMsgUser = $('#lastMsgUser').val();
	var timer;

	if(chatUserId == lastMsgUser){
		var cnt = Number($('#MsgCount').val());
		$('#MsgCount').val(cnt + 1);
	}else{
		$('#lastMsgUser').val(chatUserId);
		$('#MsgCount').val(1);
	}


	if(chatUserId == myId){

		if(msgMax > $('#MsgCount').val()){

		}else{
			$('#btnMsgSubmit').attr('disabled', true);
			$('#message').attr('disabled', true);
			$('#formMsg').text( '連続投稿数が'+msgMax+'回を超えました。');
			clearTimeout(timer);
			timer = setTimeout(function() { $('#formMsg').empty(); }, 3000);
		}

	}else{
		if($('#btnMsgSubmit').attr('disabled') == 'disabled'){
			$('#btnMsgSubmit').attr('disabled', false);
			$('#message').attr('disabled', false);
			$('#formMsg').text( '投稿可能になりました。');
			clearTimeout(timer);
			timer = setTimeout(function() { $('#formMsg').empty(); }, 3000);

		}
	}
}

