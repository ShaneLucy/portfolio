<?php
class Views {
    private $viewCount;
    protected $conn;
    protected $selectViews;
    protected $updateMonthlyViews;
    protected $updateAnnualViews;
    protected $updateTotalViews;

    public function __construct() {
        //when the website is visited set the view count to 1
        $this->viewCount = 1;
    }

    public function dbConnection() {
        include_once "credentials";
        try {
            $this->conn = new PDO($dsn, $user, $password);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    public function prepareStatements() {
        //creating prepared statements
        $this->selectViews = $this->conn->prepare("SELECT * FROM PageViews");
        $this->updateMonthlyViews = $this->conn->prepare(
            "UPDATE PageViews SET monthlyViews=? WHERE ID =?"
        );
        $this->updateAnnualViews = $this->conn->prepare(
            "UPDATE PageViews SET annualViews=? WHERE ID =?"
        );
        $this->updateTotalViews = $this->conn->prepare(
            "UPDATE PageViews SET totalViews=? WHERE ID =?"
        );
    }

    public function updatePageViews() {
        //execute select * query
        $this->selectViews->execute();
        $row = $this->selectViews->fetch();
        //assign monthly, annual and total views to variables
        $totalViews = $row[1];
        $annualViews = $row[2];
        $monthlyViews = $row[3];

        //if the monthly views are greater than 0 add the current page view to the number of monthly views returned from the db
        if ($monthlyViews > 0) {
            $updatedMonthlyViews = $monthlyViews + $this->viewCount;
            //update the db with the total monthly views
            $this->updateMonthlyViews->execute([$updatedMonthlyViews, 1]);
        } else {
            //otherwise insert the current view into the db
            $this->updateMonthlyViews->execute([$this->viewCount, 1]);
        }

        //repeat the above statement for annual and total views
        if ($annualViews > 0) {
            $updatedAnnualViews = $annualViews + $this->viewCount;
            $this->updateAnnualViews->execute([$updatedAnnualViews, 1]);
        } else {
            $this->updateAnnualViews->execute([$this->viewCount, 1]);
        }

        if ($totalViews > 0) {
            $updatedTotalViews = $totalViews + $this->viewCount;
            $this->updateTotalViews->execute([$updatedTotalViews, 1]);
        } else {
            $this->updateTotalViews->execute([$this->viewCount, 1]);
        }
    }

    public function terminateConnections() {
        $this->conn = null;
        $this->selectViews = null;
        $this->updateMonthlyViews = null;
        $this->updateAnnualViews = null;
        $this->updateTotalViews = null;
    }
}
