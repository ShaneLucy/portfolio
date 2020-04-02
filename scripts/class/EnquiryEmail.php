<?php
include_once "Validation.php";

class EnquiryEmail extends Validation
{
    public function email()
    {
        //if all fields are set, the values passed validation
        if (
            isset($this->name) &&
            isset($this->enquiry) &&
            isset($this->email) &&
            isset($this->csrfToken) &&
            isset($this->honeypot)
        ) {
            //initialise cURL and send email using pepipost api
            $curl = curl_init();
            curl_setopt_array($curl, [
                CURLOPT_URL => "https://api.pepipost.com/v2/sendEmail",
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "{\"personalizations\":[{\"recipient\":\"me@myemail\"}],\"from\":{\"fromEmail\":\"info@mail.shanelucy.me\",\"fromName\":\"'$this->name'\"},\"subject\":\"Web Developer Request - '$this->email'\",\"content\":\"'$this->enquiry'\"}",
                CURLOPT_HTTPHEADER => [
                    "api_key: Key",
                    "content-type: application/json",
                ],
            ]);

            $response = curl_exec($curl);
            $err = curl_error($curl);
            curl_close($curl);

            if ($err) {
                echo "cURL Error #:" . $err;
            } else {
                echo $response;
            }
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
