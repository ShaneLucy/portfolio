<?php
session_start();
//setting csrf token
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
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, minimum-scale=1" />
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
    <!--pre connecting/fetching external links -->
    <link rel="preload" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" as="style">
    <link rel="preload" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" as="style">

    <!--Bootstrap css cdn-->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <!-- Custom style sheet -->
    <link href="scripts/custom.css" rel="stylesheet" />

    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.2/css/all.css" integrity="sha384-/rXc/GQVaYpyDdyxK+ecHPVYJSN9bmVFBvjA/9eOB+pb3F2w2N6fc5qB9Ew5yIns" crossorigin="anonymous" />
</head>
<body>
    <!--Fallback for clients with Javascript disabled-->
    <noscript>This website requires Javascript to function properly. Please turn it on and refresh the page for the best experience!</noscript>
    <header>
        <div id="home">
            <div class="text-center">
                <div class="hero-image">
                    <div id="cookie-consent" class="cookie-consent">
                        <p>This website uses cookies which are <strong>essentail</strong> for this website to function. I don't use any tracking, analytical or marketing cookies because I believe privacy online is a fundamental right.
                            <button type="button" class="btn btn-light" id="cookie-dismiss">Dismiss</button>
                        </p>
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
    <nav class="navbar" id="ghost-nav">
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
                                    <img class="lazy" data-src="https://shanelucy.me/images/creativity.png" src="images/placeholder256.png" alt="A lightbulb, cloud and pen merging inside a box surrounded by stars" data-toggle="tooltip" title="Icons made by https://www.freepik.com/" />
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <h3 class="card-title">Design</h3>
                            <p class="card-text">First and foremost, I will find out the exact requirements. From this I will draw up an initial design, select an appropriate colour scheme and typography. Following a sign of from you on the design I can then move onto development.</p>
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
                                    <img class="lazy" data-src="https://shanelucy.me/images/thinking.png" src="images/placeholder256.png" alt="A lightbulb inside a head" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/eucalyp" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-6 text-center">
                            <div class="card yellow-shadow">
                                <div class="card-body rounded">
                                    <img class="lazy" data-src="https://shanelucy.me/images/launch.png" src="images/placeholder256.png" alt="A rocket flying upwards" data-toggle="tooltip" title="Icons made by https://www.freepik.com/ from https://www.flaticon.com/" />
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
                                    <img class="lazy" data-src="https://shanelucy.me/images/lock.png" src="images/placeholder256.png" alt="A lock" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
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
                                <img class="lazy" data-src="https://shanelucy.me/images/creativity.png" src="images/placeholder256.png" alt="A lightbulb, cloud and pen merging inside a box surrounded by stars" data-toggle="tooltip" title="Icons made by https://www.freepik.com/" />
                                <h3 class="card-title pad-top">Design</h3>
                                <p class="card-text">First and foremost, I will find out the exact requirements. From this I will draw up an initial design, select an appropriate colour scheme and typography. Following a sign of from you on the design I can then move onto development.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="card blue-shadow">
                            <div class="card-body rounded">
                                <img class="lazy" data-src="https://shanelucy.me/images/thinking.png" src="images/placeholder256.png" alt="A lightbulb inside a head" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/eucalyp" />
                                <h3 class="card-title pad-top">Development</h3>
                                <p class="card-text">This is the fun part. Now I will take the final design and with lots of coffee, I will transform it into a fully functioning product.</p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="card yellow-shadow">
                            <div class="card-body rounded">
                                <img class="lazy" data-src="https://shanelucy.me/images/launch.png" src="images/placeholder256.png" alt="A rocket flying upwards" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
                                <h3 class="card-title pad-top">Optimisation</h3>
                                <p class="card-text">Although optimisation begins in the development phase, through the use of a variety of tools, I will now enhance the performance to keep your site visitors engaged and interested. </p>
                            </div>
                        </div>
                    </div>
                    <div class="row pad-top">
                        <div class="col-sm-12 card blue-shadow">
                            <div class="card-body rounded">
                                <img class="lazy" data-src="https://shanelucy.me/images/lock.png" src="images/placeholder256.png" alt="A lock" data-toggle="tooltip" title="Icon made by https://www.flaticon.com/authors/pixel-perfect" />
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
                <span id="showcase"></span>
            </div>
        </section>
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
                                    <img class="card-img-top lazy" data-src="https://shanelucy.me/images/sundayRoastsDesktop.png" src="images/placeholder256.png" alt="A website I developed for a clan in the game Clash Royale" data-toggle="tooltip" title="Click to visit me!" />
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
                                    <img class="card-img-top lazy" data-src="https://shanelucy.me/images/huntingLodgeDesktop.png" src="images/placeholder256.png" alt="The Woodhill Hunting Lodge" data-toggle="tooltip" title="Click to visit me!" /></a>
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
                                <img class="card-img-top lazy" data-src="https://shanelucy.me/images/sundayRoastsMobile.png" src="images/placeholder484.png" alt="A website I developed for a clan in the game Clash Royale" data-toggle="tooltip" title="Click to visit me!" />
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
                                <img class="card-img-top lazy" data-src="https://shanelucy.me/images/huntingLodgeMobile.png" src="images/placeholder484.png" alt="The Woodhill Hunting Lodge" data-toggle="tooltip" title="Click to visit me!" />
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
                        <p id="bio">Shane graduated from Ulster University Jordanstown with a BSc Honours in Computing Science in 2018. Currently Shane is learning react and ASP.NET Core. Some of his favourite past times are kayaking, hiking, car detailing and reading up on cryptocurrencies.</p>
                    </div>
                </div>
            </div>
        </section>
        <footer>
            <!--SVG creates curved section divider-->
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="1 1 99 99" preserveAspectRatio="none">
                <path d="M0 0 C 50 100 80 100 100 0 Z" fill="white" />
            </svg>
            <div class="container">
                <div class="mobile pad-5"></div>
                <h2 class="text-center display-4 pad-5">Contact me</h2>
                <span id="contact"></span>
                <form novalidate onsubmit="return false">
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
                                <input type="email" name="email" pattern="^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$" required class="form-control" id="email">
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
                                <input type="text" class="form-control" name="enquiry" id="enquiry" pattern="^[A-Za-z0-9&.,!?'$£ ]+$" required minlength="20">
                                <span id="enquiry-error" aria-live="polite"></span>
                            </div>
                            <small>* indicates a required field</small>
                        </div>
                    </div>
                    <div class="row pt-5">
                        <div class="col-sm-12 text-center">
                            <button type="submit" class="btn btn-outline-light">Submit</button>
                        </div>
                    </div>
                </form>
                <script nonce="<?php echo $nonce;?>" src="scripts/validation.js">
                </script>
            </div>
            <div class="container text-center pad-top">
                <div class="desktop">
                    <div class="row pad-top text-center">
                        <div class="col-sm-4">
                            <a href="https://github.com/ShaneLucy" target="_blank" rel="noopener"><img class="icons lazy" data-src="images/github.png" src="placeholder" alt="GitHub logo" /></a>
                        </div>
                        <div class="col-sm-4">
                            <a href="https://www.linkedin.com/in/shane-lucy-4735b616a/" target="_blank" rel="noopener"><img class="icons lazy" data-src="images/linkedin.png" src="placeholder" alt="LinkedIn logo" /></a>
                        </div>
                        <div class="col-sm-4">
                            <a href="#home"><i class="fas fa-arrow-up"  data-toggle="tooltip" title="Beam me up"></i></a>
                            <a class="sr-only" href="#home">Home</a>
                        </div>
                    </div>
                    <div class="mobile desktop row pad-5">
                    </div>
                </div>
                <div class="mobile text-center">
                    <div class="row pad-5">
                        <div class="col-sm-12">
                            <a href="https://github.com/ShaneLucy" target="_blank" rel="noopener"><img class="icons lazy" data-src="images/github.png" src="placeholder" alt="GitHub logo" /></a>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-12">
                            <a href="https://www.linkedin.com/in/shane-lucy-4735b616a/" target="_blank" rel="noopener"><img class="icons lazy" data-src="images/linkedin.png" src="placeholder" alt="LinkedIn logo" /></a>
                        </div>
                    </div>
                    <div class="row pad-5">
                        <div class="col-sm-12">
                            <a href="#home"><i class="text-center fas fa-arrow-up"></i></a>
                            <a class="sr-only" href="#home">Home</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </main>
    <script nonce="<?php echo $nonce;?>" src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6"crossorigin="anonymous"></script>
    <script nonce="<?php echo $nonce;?>" src="scripts/lazy.js"></script>
    <script nonce="<?php echo $nonce;?>" src="scripts/sticky.js"></script>
</body>
</html>
