const cookieContainer = document.getElementById("cookie-consent");
const cookieDismiss = document.getElementById("cookie-dismiss");
var accepted = localStorage.getItem("cookieAccepted");


//if cookies are accepted dont display cookie consent
if (accepted == "true") {
    cookieContainer.style.display = "none";
}


cookieDismiss.addEventListener("click", dismiss);

function dismiss() {
    //set cookie that confirms the cookie display has been dismissed
    localStorage.setItem("cookieAccepted", "true");
    //hide the cookie container
    cookieContainer.style.display = "none";
}
