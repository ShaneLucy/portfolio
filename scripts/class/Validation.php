<?php
session_start();
class Validation
{
    protected $name;
    protected $email;
    protected $enquiry;
    protected $csrfToken;
    protected $honeypot;

    public function validateName()
    {
        //sanitising input
        $trimmed = trim($_POST["name"]);
        $sanitised = filter_var($trimmed, FILTER_SANITIZE_STRING);
        $name = htmlspecialchars($sanitised);
        //name may only contain letters and spaces
        if (preg_match("/[A-Za-z ]/", $name) && strlen($name) >= 3) {
            $this->name = $name;
        }
    }

    public function validateEmail()
    {
        $trimmed = trim($_POST["email"]);
        if (filter_var($trimmed, FILTER_VALIDATE_EMAIL)) {
            $this->email = $trimmed;
        }
    }

    public function validateEnquiry()
    {
        $trimmed = trim($_POST["enquiry"]);
        $sanitised = strip_tags($trimmed);
        $enquiry = htmlspecialchars($sanitised);
        //only set the enquiry if it contains 20 chars or more
        if (strlen($enquiry) >= 20) {
            $this->enquiry = $enquiry;
        }
    }

    public function verifyCsrfToken()
    {
        $token = $_POST["token"];
        if ($_SESSION['csrfToken'] == $token) {
            $this->csrfToken = $token;
        }
    }

    public function honeypot()
    {
        //a basic method to help prevent spam bots from filling in the form
        $number = $_POST["mobile-number"];
        //if the value is changed the validation fails and the value won't be set
        if ($number == 0) {
            $this->honeypot = 0;
        }
    }
}
