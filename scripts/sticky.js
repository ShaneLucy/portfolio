window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");

var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    navbar.classList.remove("navbar-fixed")
  } else {
    navbar.classList.remove("sticky");
    navbar.classList.add("navbar-fixed");
  }
}
