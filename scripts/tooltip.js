$(function () {
	//applies bootstrap css to tooltips
	$('[data-toggle="tooltip"]').tooltip();


	//toggles visibilty off card headings and content on mouseover and mouseleave 
	$("#card-img-1").mouseover(function () {
		$('.card-1').css('display', 'block');
		$('#card-img-2').css('display', 'none');
	});


	$("#card-img-1").mouseout(function () {
		$('.card-1').css('display', 'none');
		$('#card-img-2').css('display', 'block');
	});

	$("#card-img-2").mouseover(function () {
		$('.card-2').css('display', 'block');
		$('#card-img-1').css('display', 'none');

	});


	$("#card-img-2").mouseout(function () {
		$('.card-2').css('display', 'none');
		$('#card-img-1').css('display', 'block');
	});


});
