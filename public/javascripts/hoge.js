function shoki(){
	$('#screen').append(

	)

}

/* Canvasを追加し、追加されたCanvasを返す。 */
function addCanvas(width, height) {
    var screen = document.getElementById('screen');
    // idは 'canvas[n]' (nは要素数) とする
    var id = 'canvas' + (screen.getElementsByTagName('canvas').length + 1).toString();
    // Canvas要素を追加
    $('#screen').append(
        $('<canvas></canvas>')
            .attr('id', id)
            .attr('width', width)
            .attr('height', height)
			.css({
			        position: 'absolute',
			        top: '180px',
			        left: '340px'
			        //marginLeft: '-300px'
			    })
    );
    // ブラウザが未対応の場合はnullを返す
    var canvas = document.getElementById(id);
    if (!canvas || !canvas.getContext)
        return null;
    return canvas;
}

/* 共通処理 */
function initContext(canvas, context, data) {
    // 中にテキストを描画


    	//window.alert(text);
//    var text = document.forms.fm.text.value;
    if (data.text) {
        context.font = "13px 'MS Pゴシック'";
    	//context.font = "16px";
        context.fillStyle = "black";
        var x = 7;
        var y = canvas.height/2 + 8;
        context.fillText(data.text, x, y, canvas.width);
    }

    // ドラッグ可能にする
    $(canvas).draggable({ containment: '#screen',scroll: false });
}

	function drawRect(data) {
		//window.alert('2');
		    // Canvasを取得
		    var width = 120;
		    var height = 30;
		    var canvas = addCanvas(width, height);

		    canvas.addEventListener("mouseup", mouseUpHandler, false);
			function mouseUpHandler(e) {
				var rect = e.target.getBoundingClientRect();
				//mouseX =  Math.floor(e.clientX - rect.left);
				//mouseY =  Math.floor(e.clientY - rect.top);
				//data = {id:canvas.id , x:mouseX , y:mouseY};
				data = {id:canvas.id , x:rect.left , y:rect.top};
				//window.alert(canvas.id + ' : ' + mouseY + ':' + mouseX);
				//console.log(canvas.id);


				var socket = io.connect('http://localhost:3000/');
				socket.emit('mouseup', data);

			}
		    //canvas.onmouseup = mouseUpListner;
		    if (!canvas) return false;
		    // 四角形を描画
		    var context = canvas.getContext('2d');
		    context.beginPath();
		    context.fillStyle = "#ffcccc";
		    context.fillRect(0, 0, width, height);


		    initContext(canvas, context,data);
	 }



/* 四角形を追加 */
$(function() {
	var socket = io.connect('http://localhost:3000/');
	$('#addRect').click(function(event){
		var text = $('#posttext').val();
		var data =  {action: 'postit', user: $('#user').text() ,text: text  };
		// イベント名'others'でメッセージをサーバに送信する
	    socket.emit('postit', data);
	    //window.alert('1');
	    drawRect(data);
	});

	 socket.on('postit',function(data){
		 //window.alert('3');
		 drawRect(data);
	 });
	 socket.on('mouseup',function(data){
		 //window.alert('3');
		 move(data);
	 });


});

function move(data) {

	//window.alert(data.id + ' : ' + data.y + ':' + data.x);

	$('#'+data.id)
		.css({
	        position: 'absolute',
	        top: data.y,
	        left: data.x
	        //marginLeft: '-300px'
	    });

}

//タブ切換え
$(function() {

	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	})

//canvas.drawDashLine(50, 50, 300, 200);
	$('#openModal').click(function (e) {

		//window.alert('asdf');
		//$('body').addClass('modal-open');
		//$("div#main").fadeOut(500);
		//$("div#main").stop().fadeTo(500,4);
		$('#myModal').modal({
           // show:true
			backdrop: true
		});
		//$('#myModal').removeClass('hide');
		//$('#myModal').removeClass('fade');
		//$('#myModal').addClass('show');
/*
		$('#myModal').modal({
           // backdrop: true
		});
*/
	})

})


