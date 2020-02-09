<?php
class Token{

    private $csrfToken;
    
     public function setToken(){
     //sets a string of random cryptographically secure bytes
     $rand = random_bytes(15);
     //convert from binary to hex
     $hex = bin2hex($rand);
     //hash the random string
     $token = hash('sha512', $hex);
     $this->csrfToken = $token;
     //store the token in a session variable
     $_SESSION['csrfToken'] = $token;
     }
     
    public function getToken(){
        return $this->csrfToken;
    }
}
