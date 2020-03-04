<?php
include_once "Validation.php";

class EnquiryEmail extends Validation
{
    public function email()
    {
        //if all fields are set, the values passed validation
        //so construct the email and send it

        if (
            isset($this->name) &&
            isset($this->enquiry) &&
            isset($this->email) &&
            isset($this->csrfToken) &&
            isset($this->honeypot)
        ) {
            $message = $this->enquiry . "\r\n Reply to " . $this->email;
            mail(
                'email@mail.com',
                $this->name . " Web Developer Request",
                $message
            );
        }
    }
}

$newEnquiry = new EnquiryEmail();
$newEnquiry->validateName();
$newEnquiry->validateEmail();
$newEnquiry->validateEnquiry();
$newEnquiry->verifyCsrfToken();
$newEnquiry->honeypot();
$newEnquiry->email();
