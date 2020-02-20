<?php
include_once "Views.php";
class AnnualEmail extends Views {
    public function emailViews() {
        //get the total page views from the db
        $this->selectViews->execute();
        $row = $this->selectViews->fetch();
        $totalViews = $row[1];
        $annualViews = $row[2];

        //construct the message to be emailed
        $message =
            "Over the past year there has been " .
            $annualViews .
            " page views on shanelucy.me and the total views for this website to date are" .
            $totalViews;
        //call the mail function
        mail('email@address', 'shanelucy.me Page Views', $message);
        //finally reset the annual views to 0
        $this->updateAnnualViews->execute([0, 1]);
    }
}

$cron = new AnnualEmail();
$cron->dbConnection();
$cron->prepareStatements();
$cron->emailViews();
$cron->terminateConnections();
