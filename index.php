<?php
session_start();
if (empty($_SESSION['csrfToken'])) {
    $_SESSION['csrfToken'] = bin2hex(random_bytes(32));
}
include_once("scripts/class/Validation.php");
include_once("scripts/headers.php");
include_once("scripts/class/Views.php");
$pageView = new Views();
$pageView->dbConnection();
$pageView->prepareStatements();
$pageView->updatePageViews();
$pageView->terminateConnections();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, minimum-scale=0" />
    <meta name="description" content="I am a web developer with a real passion in building optimised websites. Need a website? Lets get in contact!" />
    <meta name="author" content="Shane Lucy" />
    <title>Shane Lucy - Web Developer</title>
    <!--Social Media meta tags-->
    <meta property="og:title" content="Shane Lucy - Web Developer" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://shanelucy.me" />
    <meta property="og:image" content="https://shanelucy.me/images/icon.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1316" />
    <meta property="og:image:height" content="915" />
    <meta property="og:image:alt" content="A man designing and developing a website on a laptop" />
    <meta property="og:description" content="I am a web developer with a real passion in building optimised websites. Need a website? Lets get in contact!" />
    <meta property="og:locale" content="en_GB" />
    <!--pre connecting external links -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="preload" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous" as="style" >
    <!--Bootstrap css cdn-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">
    <!-- Custom style sheet -->
    <link href="scripts/custom.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab&family=Open+Sans&display=swap" rel="stylesheet"> 
</head>
<body>
    <!--Fallback for clients with Javascript disabled-->
    <noscript>This website requires Javascript to function properly. Please turn it on and refresh the page for the best experience!</noscript>
    <header>
        <div id="home">
            <div class="text-center">
                <div class="hero-image">
                    <div id="cookie-consent" class="cookie-consent">
                        <p>This website uses cookies which are <strong>essential</strong> for this website to function. I don't use any tracking, analytical or marketing cookies because I believe privacy online is a fundamental right. <button type="button" class="btn btn-light" id="cookie-dismiss">Dismiss</button></p>
                    </div>
                    <div class="col-sm-8 desktop hero-text">
                        <h1>Hi, I'm Shane Lucy, I have a passion for web development. I'd love to work with you.</h1>
                    </div>
                    <div class="mobile hero-text">
                        <h1>Hi, I'm Shane Lucy,</h1>
                        <h1>I have a passion for</h1>
                        <h1>web development.</h1>
                        <h1>I'd love to work</h1>
                        <h1>with you.</h1>
                    </div>
                </div>
            </div>
        </div>

    </header>
    <script nonce="<?php echo $nonce;?>" src="scripts/cookie.js"></script>
    <div>
    <!--Navigation-->
    <nav class="navbar navbar-dark navbar-expand-sm navbar-fixed" id="navbar">
        <div class="navbar-header">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarResponsive">
            <ul class="navbar-nav ">
                <li class="nav-item">
                    <a class="nav-link" href="#process">My Process</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#showcase">My Work</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#about">About Me</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#contact">Contact Me</a>
                </li>
            </ul>
        </div>
    </nav>
    <span id="process"></span>
    <main>
        <section class="pad-top">
            <div class="container">
                <div class="desktop">
                    <h2 class="display-4 pad-5 text-center">My Process</h2>
                    <div class="row pad-5">
                        <div class="col-sm-6 text-center">
                            <div class="card yellow-shadow">
                                <div class="card-body rounded">
                                    <img loading="lazy" src="images/creativity.png" alt="A lightbulb, cloud and pen merging inside a box surrounded by stars" data-toggle="tooltip" title="Icons made by https://www.freepik.com/" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <h3 class="card-title">Design</h3>
                            <p class="card-text">First and foremost, I will find out the exact requirements. From this I will draw up an initial design, select an appropriate colour scheme and typography. Following a sign off from you on the design I can then move onto development.</p>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-6">
                            <h3 class="card-title">Development</h3>
                            <p class="card-text">This is the fun part. Now I will take the final design and with lots of coffee, I will transform it into a fully functioning product.</p>
                        </div>
                        <div class="col-sm-6 text-center">
                            <div class="card blue-shadow">
                                <div class="card-body rounded">
                                    <img loading="lazy" src="images/thinking.png" alt="A lightbulb inside a head" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/eucalyp" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-6 text-center">
                            <div class="card yellow-shadow">
                                <div class="card-body rounded">
                                    <img loading="lazy" src="images/launch.png" alt="A rocket flying upwards" data-toggle="tooltip" title="Icons made by https://www.freepik.com/ from https://www.flaticon.com/" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <h3 class="card-title">Optimisation</h3>
                            <p class="card-text">Although optimisation begins in the development phase, through the use of a variety of tools, I will now enhance the performance to keep your site visitors engaged and interested. </p>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-6">
                            <h3 class="card-title">Other Services</h3>
                            <ul class="card-text">
                                <li>TLS certificates</li>
                                <li>Advice on the best hosting solution for your requirements</li>
                                <li>Maintenance</li>
                            </ul>
                        </div>
                        <div class="col-sm-6 text-center">
                            <div class="card blue-shadow">
                                <div class="card-body rounded">
                                    <img loading="lazy"  src="images/lock.png" alt="A lock" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mobile text-center">
                    <h2 class="display-4 pad-5">My Process</h2>
                    <div class="row pad-top">
                        <div class="card yellow-shadow">
                            <div class="card-body rounded">
                                <img loading="lazy" src="images/creativity.png" alt="A lightbulb, cloud and pen merging inside a box surrounded by stars" data-toggle="tooltip" title="Icons made by https://www.freepik.com/" />
                                <h3 class="card-title pad-top">Design</h3>
                                <p class="card-text">First and foremost, I will find out the exact requirements. From this I will draw up an initial design, select an appropriate colour scheme and typography. Following a sign off from you on the design I can then move onto development.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="card blue-shadow">
                            <div class="card-body rounded">
                                <img loading="lazy" src="images/thinking.png" alt="A lightbulb inside a head" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/eucalyp" />
                                <h3 class="card-title pad-top">Development</h3>
                                <p class="card-text">This is the fun part. Now I will take the final design and with lots of coffee, I will transform it into a fully functioning product.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="card yellow-shadow">
                            <div class="card-body rounded">
                                <img loading="lazy" src="images/launch.png" alt="A rocket flying upwards" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
                                <h3 class="card-title pad-top">Optimisation</h3>
                                <p class="card-text">Although optimisation begins in the development phase, through the use of a variety of tools, I will now enhance the performance to keep your site visitors engaged and interested. </p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="col-sm-12 card blue-shadow">
                            <div class="card-body rounded">
                                <img loading="lazy" src="images/lock.png" alt="A lock" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
                                <h3 class="card-title pad-top">Other Services</h3>
                                <ul class="card-text">
                                    <li>TLS certificates</li>
                                    <li>Advice on the best hosting solution for your requirements</li>
                                    <li>Maintenance</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <span id="showcase"></span>
        <section class="showcase">
            <div class="container desktop">
                <h2 class="text-center display-4 pad-top">My Work</h2>
                <div class="row pad-5">
                    <div class="col-sm-6">
                        <h3 class="card-title">Sunday Roasts</h3>
                        <p class="card-text">
                            This website was developed to automate the process of tracking member participation within the clan. I used PHP and bootstrap to develop this website.
                        </p>
                    </div>
                    <div class="col-sm-6">
                        <div class="card yellow-shadow">
                            <div class="card-body rounded">
                                <a href="https://sundayroasts.xyz/" target="_blank" rel="noopener">
                                    <img class="card-img-top" loading="lazy" src="images/sundayRoastsDesktop.png" alt="A website I developed for a clan in the game Clash Royale" data-toggle="tooltip" title="Click to visit me!" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row pad-5">
                    <div class="col-sm-6">
                        <div class="card blue-shadow">
                            <div class="card-body rounded">
                                <a href="http://www.thewoodhill.uk" target="_blank" rel="noopener">
                                    <img class="card-img-top" loading="lazy" src="images/huntingLodgeDesktop.png" alt="The Woodhill Hunting Lodge" data-toggle="tooltip" title="Click to visit me!" /></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <h3 class="card-title">The Woodhill Huntinglodge</h3>
                        <p class="card-text">This is a brochure style website I developed for a clients bar & restaurant with Bootstrap, JavaScript and PHP.</p>
                    </div>
                </div>
            </div>
            <div class="container mobile">
                <h2 class="text-center display-4 pad-5">My Work</h2>
                <div class="row pad-top">
                    <div class="col-sm-12 card yellow-shadow">
                        <div class="card-body rounded">
                            <a href="https://sundayroasts.xyz/" target="_blank" rel="noopener">
                                <img class="card-img-top" loading="lazy" src="images/sundayRoastsMobile.png" alt="A website I developed for a clan in the game Clash Royale" data-toggle="tooltip" title="Click to visit me!" />
                            </a>
                            <h3 class="card-title">Sunday Roasts</h3>
                            <p class="card-text">
                                This website was developed to automate the process of tracking member participation within the clan. I used PHP and bootstrap to develop this website.
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row pad-top">
                    <div class="col-sm-12 card blue-shadow">
                        <div class="card-body rounded ">
                            <a href="http://www.thewoodhill.uk" target="_blank" rel="noopener">
                                <img class="card-img-top" loading="lazy" src="images/huntingLodgeMobile.png" alt="The Woodhill Hunting Lodge" data-toggle="tooltip" title="Click to visit me!" />
                            </a>
                            <h3 class="card-title">The Woodhill Huntinglodge</h3>
                            <p class="card-text">This is a brochure style website I developed for a bar & restaurant with Bootstrap, JavaScript and PHP.</p>
                        </div>
                    </div>
                </div>
            </div>
            <span id="about"></span>
        </section>
        <!--About me section-->
        <section class="about">
            <div class="container">
                <h2 class="text-center display-4 pad-top">About me</h2>
                <div class="row">
                    <div class="col-sm-2"></div>
                    <div class="col-sm-8">
                        <p id="bio">Shane graduated from Ulster University Jordanstown with a BSc Honours in Computing Science in 2018. Currently Shane is developing a real time trivia game using Django, Node.js and React.js. Some of his favourite past times are kayaking, hiking, car detailing and reading up on cryptocurrencies.</p>
                    </div>
                </div>
            </div>
        </section>
        <footer>
            <!--SVG creates curved section divider-->
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="1 1 99 99" preserveAspectRatio="none">
               <path d="M0 0 C 50 100 80 100 100 0 Z" fill="white" />
            </svg>
            <span id="contact"></span>
            <div class="container">
                <div class="mobile pad-5"></div>
                <h2 class="text-center display-4 pad-5">Contact me</h2>
                <form nonce="<?php echo $nonce;?>" novalidate>
                    <div class="row pad-top">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="name">Name: *</label>
                                <input required type="text" pattern="^[a-zA-Z ]+$" class="form-control" name="name" minlength="3" id="name">
                                <span id="name-error" aria-live="polite"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="email">Email: *</label>
                                <input type="email" name="email" required class="form-control" id="email">
                                <span id="email-error" aria-live="polite"></span>
                                <input type="hidden" name="token" id="token" value="<?php echo $_SESSION['csrfToken'];?>">
                                <input type="number" name="mobile-number" id="mobile-number" required value="0">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="enquiry">Enquiry: *</label>
                                <input type="text" class="form-control" name="enquiry" id="enquiry" pattern="^[a-zA-Z0-9£$&.\\/+=: \-]+$" required minlength="20">
                                <span id="enquiry-error" aria-live="polite"></span>
                            </div>
                            <small>* indicates a required field</small>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 text-center">
                            <button type="submit" class="btn btn-dark">Submit</button>
                        </div>
                    </div>
                </form>
                <div class="container text-center pad-5">
                    <details>
                        <summary>Value privacy and security? Click to get my PGP public key</summary>
                        <pre><code>-----BEGIN PGP PUBLIC KEY BLOCK-----
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
rj9A//Gu+dbPMQpscg==
=6ZWz
-----END PGP PUBLIC KEY BLOCK-----</code></pre>
                    </details>
                </div>
            </div>
            <div class="container text-center pad-top">
                <div class="desktop">
                    <div class="row pad-top text-center">
                        <div class="col-sm-4">
                            <a href="https://github.com/ShaneLucy" target="_blank" rel="noopener"><img class="icons" loading="lazy"  src="images/github.png" alt="GitHub logo" /></a>
                        </div>
                        <div class="col-sm-4">
                         
                        </div>
                        <div class="col-sm-4">
                            <a href="https://www.linkedin.com/in/shane-lucy-4735b616a/" target="_blank" rel="noopener"><img class="icons" loading="lazy" src="images/linkedin.png" alt="LinkedIn logo" /></a>
                        </div>
                    </div>
                    <div class="row pad-5">
                    </div>
                </div>
                
                <div class="mobile text-center">
                    <div class="row pad-5">
                        <div class="col-sm-12">
                            <a href="https://github.com/ShaneLucy" target="_blank" rel="noopener"><img loading="lazy" class="icons float-left"  src="images/github.png" alt="GitHub logo" /></a>
                            <a href="https://www.linkedin.com/in/shane-lucy-4735b616a/" target="_blank" rel="noopener"><img loading="lazy" class="icons float-right"  src="images/linkedin.png" alt="LinkedIn logo" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </main>
</div>    
    <script nonce="<?php echo $nonce;?>" src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="scripts/validation.js"></script>
</body>
</html>
