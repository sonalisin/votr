const keyPrefix = "qn";
const numQuestions = 9;

function goHome() {
    //save state before going back home?
    location.href = '/'
}

var myVar;

function myFunction() {
    myVar = setTimeout(showPage, 3000);
    initialise();
}

function showPage() {
    document.getElementById("loading-container").style.display = "none";
    document.getElementById("content").style.display = "grid";
}

//this will need to be changed to fetch the current page when result formatting has been decided
var url=location.href;

//facebook app ID
const appID = '124855641706920';

//default text to be passed for twitter
const twittShare ={
    text: "text=I just used Votr so can you!",
    url: "url="+url,
    hashtags: 'hashtags=auspol,aec,getinvolved',
    twitterUrl: "https://twitter.com/intent/tweet?"
}


//share variable for facebook
const fbShareText = {
    method: 'share',
    display: 'popup',
    mobile_iframe: true,
    href: url,
}

const messText ={
    method: 'send',
    display: 'popup',
    link: url,
}

//email default text
const mailText ={
    subject: 'subject=Your Votr Results',
    body: 'body=See your Results at\n'+url,
    mailUrl: 'mailto:?'
}

//import facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId            : appID,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.12'
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//share in facebook app
function shareFB(response){
    window.open('fb://share?link=' + encodeURIComponent(url))
}

//share in messenger app
function sendMessenger(){
    window.open('fb-messenger://share/?link=' + encodeURIComponent(url) +"&app_id="+encodeURIComponent(appID));
}

//import twitter SDK
window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));

//configure the href for the twitter button
function tweetButton(){
    var tButton = document.getElementById("twitter");
    var href =twittShare.text+"&"+twittShare.url+"&"+twittShare.hashtags
    href = browserReady(href);
    href = twittShare.twitterUrl+"&"+href;
    tButton.setAttribute("href", href);
}

//copy url to clipboard (extra functionality added to support mobile devices)
function copyPage(){
    //setup dummy text area
    var text = document.createElement("textarea");
    var range = document.createRange();

    //setup text area
    text.value = url;
    text.contenteditable = true;
    text.readonly = false;
    document.body.appendChild(text);
    text.select();

    //set up selection range
    range.selectNodeContents(text);
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    text.setSelectionRange(0, 999999);

    //check if copy successful
    var copied = document.execCommand("copy");
    if(!copied){
        alert("Link copy failed");
    }
    else {
        alert("Link copied to clipboard");
    }

    //delete dummy
    document.body.removeChild(text);
}


function makeAlert(){
    alert("alert");
}

function mailButton(){
    var mButton = document.getElementById("mailto");
    var text = mailText.subject+'&'+mailText.body
    text = browserReady(text);
    text = mailText.mailUrl+text;
    mButton.setAttribute("href", text);

}

//replace all special characters
function browserReady(href){
    href = href.replace(/,/g, "%2C");
    href = href.replace(/:/g, "%3A");
    href = href.replace(/\//g, "%2F");
    href = href.replace(/ /g, "%20");
    href = href.replace(/\n/g, "%0D%0A");
    return href;
}

//run all startup functions
function initialise(){
    tweetButton();
    mailButton();
}

//sourced from https://www.abeautifulsite.net/detecting-mobile-devices-with-javascript
var isMob = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMob.Android() || isMob.BlackBerry() || isMob.iOS() || isMob.Opera() || isMob.Windows());
    }
};

//set image parameter for results match
function setImage(){
    var imageSRC = "http://graph.facebook.com/" + sessionStorage.name + "/picture?type=large&width=600&height=600"
    if(sessionStorage.fb === "set") {
        //user has chosen to share their profile picture
        document.getElementById("match").setAttribute("src",imageSRC)

    }
    else if(sessionStorage.fb === "no"){
        //user has chosen to use their name instead
        document.getElementById("match-text").innerText += " " + sessionStorage.name + " you match with...";
    }
}

//create key to allow answers to display in share link
function answerKey() {
    var answers = "/";
    for (var i = 0; i <= numQuestions; i++) {
        var answer = sessionStorage.getItem(keyPrefix + i.toString());
        answers += i + "=" + answer + "!";
    }
    return answers;
}

//where answers have been provided in the url i.e shared link not session, load into session storage
function setAnswers(list, qs){
    //this indicates no answers provided, i.e within a session
    if(!(list == "NULL")) {
        var answers = list.split("!");
        for (var i = 0; i <= numQuestions; i++) {
            var info = answers[i].split("=");
            sessionStorage.setItem(keyPrefix + info[0], info[1]);
        }
    }
    else {
        url += answerKey();
    }
    writeAnswers(qs);

}

//write answers to answer box
function writeAnswers(qs){
    var text = "";

    for (var i = 0; i <= numQuestions; i++){
        text+="<h4 class='tooltip'> Q"+(i+1)+": "+sessionStorage.getItem(keyPrefix+i) +
            "<span class='tooltiptext'>"+qs[i].qText+"</span></h4>";
    }
    document.getElementById("quiz-answers").innerHTML += text;
}
