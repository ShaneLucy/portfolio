$(function () {


	//applies bootstrap css to tooltips
	$('[data-toggle="tooltip"]').tooltip();

	$(window).scroll(function () {
		//inverses scrollTop method    
		var scrollBottom = $(window).height() - $(window).scrollTop();
		//gets nav bar height 
		var navHeight = $("#navbar").innerHeight();
		//changes navbar styles depending on scroll position
		if (scrollBottom < navHeight) {
			$("#navbar").addClass("inline");
			$("#navbar").removeClass("navbar-fixed");
			$("#navbar").addClass("navbar-scroll");
		} else {
			$("#navbar").removeClass("inline");
			$("#ghost-nav").css("display", "none");
			$("#navbar").removeClass("navbar-scroll");
			$("#navbar").addClass("navbar-fixed");

		}

	});

});
