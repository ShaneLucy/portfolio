<?php
include_once "Views.php";
class MonthlyEmail extends Views {
    public function emailViews() {
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
        mail('email@address', 'shanelucy.me Page Views', $message);
        //finally reset the monthly views to 0
        $this->updateMonthlyViews->execute([0, 1]);
    }
}

$cron = new MonthlyEmail();
$cron->dbConnection();
$cron->prepareStatements();
$cron->emailViews();
$cron->terminateConnections();
