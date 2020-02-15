<?php
class Views {
    private $viewCount;
    protected $conn;
    protected $selectViews;
    protected $updateViews;

    public function __construct() {
        //when the website is visited set the view count to 1
        $this->viewCount = 1;
    }

    public function dbConnection() {
        include_once "database_credentials";
        try {
            $this->conn = new PDO($dsn, $user, $password);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    public function prepareStatements() {
        //creating prepared statements
        $this->selectViews = $this->conn->prepare(
            "SELECT views FROM PageViews"
        );
        $this->updateViews = $this->conn->prepare(
            "UPDATE PageViews SET views=? WHERE ID =?"
        );
    }

    public function updatePageViews() {
        //execute select * query
        $this->selectViews->execute();
        $row = $this->selectViews->fetch();
        //get the total views prior to the current page view
        $views = $row[0];

        if ($views > 0) {
            //if the views are greated than 0 add the current page view to the number of views returned from the db
            $totalViews = $views + $this->viewCount;
            //update the db with the total views
            $this->updateViews->execute([$totalViews, 1]);
        } else {
            //otherwise insert the current view into the db
            $this->updateViews->execute([$this->viewCount, 1]);
        }
    }

    public function terminateConnections() {
        $this->conn = null;
        $this->selectViews = null;
        $this->updateViews = null;
    }
}
