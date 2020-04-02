<?php
include_once "Views.php";
class MonthlyEmail extends Views
{
    public function emailViews()
    {
        //get the total page views from the db
        $this->selectViews->execute();
        $row = $this->selectViews->fetch();
        $monthlyViews = $row[3];

        //construct the message to be emailed
        $message =
            "Over the past month there has been " .
            $monthlyViews .
            " page views on shanelucy.me";
        //call the mail function

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.pepipost.com/v2/sendEmail",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => "{\"personalizations\":[{\"recipient\":\"myemail@address.com\"}],\"from\":{\"fromEmail\":\"info@mail.shanelucy.me\",\"fromName\":\"\"},\"subject\":\"Monthly Page Views\",\"content\":\"'$message'\"}",
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
            //finally reset the monthly views to 0
            $this->updateMonthlyViews->execute([0, 1]);
        }
    }
}

$cron = new MonthlyEmail();
$cron->dbConnection();
$cron->prepareStatements();
$cron->emailViews();
$cron->terminateConnections();
