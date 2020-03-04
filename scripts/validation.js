const form = document.getElementsByTagName('form')[0];
const email = document.getElementById('email');
const emailError = document.getElementById('email-error');
const name = document.getElementById('name');
const nameError = document.getElementById('name-error');
const enquiry = document.getElementById('enquiry');
const enquiryError = document.getElementById('enquiry-error');



name.addEventListener('input', function(event) {
    //check if the value is valid as it's being entered
    if (name.validity.valid) {
        nameError.textContent = '';
        name.classList.remove("invalid");
        name.classList.add("valid");
    } else {
        //if input is invalid show the appropriate error message
        validateName();
    }
});

enquiry.addEventListener('input', function(event) {
    if (enquiry.validity.valid) {
        enquiryError.textContent = "";
        enquiry.classList.remove("invalid");
        enquiry.classList.add("valid");
    } else {
        validateEnquiry();
    }
});

email.addEventListener('input', function(event) {
    if (email.validity.valid) {
        emailError.textContent = '';
        email.classList.remove("invalid");
        email.classList.add("valid");
    } else {

        validateEmail();
    }
});

form.addEventListener('submit', function(event) {
    //prevent the form from submitting
    event.preventDefault();
    //submit the form if all fields are valid to the backend for further validation
    if ((email.validity.valid) && (name.validity.valid) && (enquiry.validity.valid)) {
        var formData = new FormData(form);
        var request = new XMLHttpRequest();
        request.open("POST", "scripts/class/EnquiryEmail.php");
        request.send(formData);
        request.onreadystatechange = function() {
            //if the request completes successfully notify the user
            if (request.readyState == XMLHttpRequest.DONE) {
                alert("Thanks for the enquiry. I will get in touch within 2 working days");
                //finally reset the values in the inputs and remove the valid class
                name.value = '';
                name.classList.remove("valid");
                email.value = '';
                email.classList.remove("valid");
                enquiry.value = '';
                enquiry.classList.remove("valid");
            }
        }
    }

    //if any of the form fields are invalid prevent the form from submitting
    if (!email.validity.valid) {
        validateEmail();
    }

    if (!enquiry.validity.valid) {
        validateEnquiry();
    }

    if (!name.validity.valid) {
        validateName();
    }
});


function validateName() {
    if (name.validity.valueMissing) {
        nameError.textContent = 'Enter your name.';
      
    } else if (name.validity.patternMismatch) {
        nameError.textContent = "Only use letters.";

    } else if (name.validity.tooShort) {
        nameError.textContent = "Name is too short.";
    }
    name.classList.remove("valid");
    name.classList.add("invalid");
}

function validateEmail() {
    if (email.validity.valueMissing) {
        emailError.textContent = 'Enter an email address.';

    } else if (email.validity.typeMismatch) {
        emailError.textContent = "Enter a valid email address.";
      
    }
    email.classList.remove("valid");
    email.classList.add("invalid");
}

function validateEnquiry() {
    if (enquiry.validity.valueMissing) {
        enquiryError.textContent = "Enter an enquiry.";
    } else if (enquiry.validity.patternMismatch) {
        enquiryError.textContent = "Only alphanumeric characters and punctuation are accepted."
    } else if (enquiry.validity.tooShort) {
        enquiryError.textContent = "Provide more detail"
    }


    enquiry.classList.remove("valid");
    enquiry.classList.add("invalid");
}
