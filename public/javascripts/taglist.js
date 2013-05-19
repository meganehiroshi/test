$(function() {

	$(".btn").mouseup(function() {
		tagid = $(this).attr("id");

		$('input[type=hidden]').val(tagid);
		$('#form').submit();
		//window.alert(tagid);
	});
});