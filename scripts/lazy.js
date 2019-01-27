document.addEventListener("DOMContentLoaded", function () {
	//set lazy images to all images with lazy class
	var lazyImages = document.querySelectorAll("img.lazy");
	var lazyTimeout;

	function lazyload() {
		if (lazyTimeout) {
			clearTimeout(lazyTimeout);
		}
       
		lazyTimeout = setTimeout(function () {
			//set top of page
			var scrollTop = window.pageYOffset;
			lazyImages.forEach(function (img) {
			    //sets a buffer zone so the image loads in advance of appearing on screen
			    var imgBuffer = img.offsetTop + 300;
				//sets source to data-src and removes lazy class once the image is on screen
				if (imgBuffer < (window.innerHeight + scrollTop)) {
					img.src = img.dataset.src;
					img.classList.remove('lazy');
				}
			});

			//once all images are loaded event listeners are removed
			if (lazyImages.length == 0) {
				document.removeEventListener("scroll", lazyload);
				window.removeEventListener("resize", lazyload);
				window.removeEventListener("orientationChange", lazyload);
			}
		}, 20);
	}

	document.addEventListener("scroll", lazyload);
	window.addEventListener("resize", lazyload);
	window.addEventListener("orientationChange", lazyload);
});
