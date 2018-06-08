var numQuestions;
const helpID = "help";
const qID = "question";
const startID = "start";
const keyPrefix = "qn";
const appID = '124855641706920';
var inHelp = false;
var tally;
var q;
var nameEntered = true;

//initialise facebook
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

function checkLogin(response){
    sessionStorage.setItem("name", response.authResponse.userID);
    sessionStorage.setItem("fb","set");
    nameEntered = true;
    return;
}
//initialise tally
function initTally(emptyTally){
    tally = emptyTally;
    console.log(tally);
}

//initialise questions
function initQ(questions){
    q = questions;
    numQuestions = q.length - 1;
    console.log(q);
}
//transition from quiz start page
function startQuiz(num){
    if(num == 0){
        nameEntered = false;
        document.getElementById("main-grid").className = "no-input-grid-container";
        document.getElementById("yes").style.display = "none";
        document.getElementById("no").style.display = "none";
        document.getElementById(startID).style.display = "block";

    }
    else {
        if(!nameEntered) {
            alert("Please select one of the name options and try again")
            return;
        }
        document.getElementById("main-grid").className = "grid-container";
        document.getElementById("yes").style.display = "block";
        document.getElementById("no").style.display = "block";
        document.getElementById(startID).style.display = "none";
    }
}

//provide name instead of facebook access
function provideName(){
    var name = prompt("Enter your name");
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("fb", "no");
    nameEntered = true;
}
//transition to help from question text
function getHelp(){
    inHelp = true;
    document.getElementById(qID).style.display = "none";
    document.getElementById(helpID).style.display = "block";
    document.getElementById("main-grid").className = "no-input-grid-container";
    document.getElementById("yes").style.display = "none";
    document.getElementById("no").style.display = "none";
}

//transition back to question from help text
function getQuestion(){
    inHelp = false;
    document.getElementById(helpID).style.display = "none";
    document.getElementById(qID).style.display = "block";
    document.getElementById("main-grid").className = "grid-container";
    document.getElementById("yes").style.display = "block";
    document.getElementById("no").style.display = "block";

}

//record yes result
function yesClick(num){
    myClick(num, 'y');
}

//record no result
function noClick(num){
    myClick(num, 'n');
}
//record results and transition to the next question, do not proceed if
//the user is still on the help text
function myClick(num, answer){
    var questionKey =  keyPrefix + num.toString();
    if(num < numQuestions) {
        // Save answers to session storage
        sessionStorage.setItem(questionKey, answer);
        location.href = '/quiz/' + (num + 1);
    }
    else{
        // Save final answer to session storage
        sessionStorage.setItem(questionKey, answer);
        var match = calculateMatch();
        location.href = match;
    }
}

function goHome() {
    location.href = '/'
}

//update tally scores based on matches
function updateTally(match){
   var entry = tally.find(function(entry){
        return entry.party === match ;
    })

    if(entry !== undefined) {
        entry.score += 1;
    }

}

//check that answer is defined, if not raise an alert and return false
function validAnswer(answer){
    if(answer === "n" || answer === "y"){
        return true
    }
    alert("It appears you have not answered all questions, we will now restart the quiz");
    sessionStorage.clear();
    return false;
}

function calculateMatch() {
    var invalid = false

    //tally answers based on questions
    for (var i = 0; i <= numQuestions; i++){
        var answer = sessionStorage.getItem(keyPrefix + i.toString());
        if(validAnswer(answer)) {
            var matches = (answer === "y") ? q[i].yes : q[i].no;
            matches.forEach(updateTally);
        }
        else{
            invalid = true;
            break;
        }
    }

    //provided no invalid answers(skipped questions) proceed to find match
    if(!invalid) {
        //determine matching party by finding highest score
        var matchingParty = tally.reduce(function (prev, curr) {
            return prev.score > curr.score ? prev : curr;
        })
        return '/generate/'+matchingParty.party;
    }
    return '/quiz/';

}