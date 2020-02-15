<?php
include_once "Views.php";
class Cron extends Views {
    public function emailViews() {
        //get the total page views from the db
        $this->selectViews->execute();
        $row = $this->selectViews->fetch();
        $views = $row[0];

        //construct a message to be emailed
        $message =
            "Over the past month there has been " .
            $views .
            " page views on shanelucy.me";
        //call the mail function
        mail('email@address', 'shanelucy.me Page Views', $message);
    }
}

$cron = new Cron();
$cron->dbConnection();
$cron->prepareStatements();
$cron->emailViews();
$cron->terminateConnections();
