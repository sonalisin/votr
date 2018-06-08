const mongoose = require('mongoose');
// For Heroku Deployment
const connectionString = 'mongodb://'+process.env.username+':'+process.env.pw+'@ds147965.mlab.com:47965/votr';
// For Local Host Testing
//const connectionString = 'mongodb://'+'404NotFound'+':'+'404NotFound'+'@ds147965.mlab.com:47965/votr';



//establishing database connection
mongoose.connect(connectionString);
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));

//check for successful connection
db.once('open', function(){
    console.log("Successful mongo connection");
});

//imports that require open database
const questions = require('../models/quizData.js');
const parties = require('../models/partyData.js');
const lh = require('../models/learningHubData.js');
const keys = require('../models/keys.js');

function init(){
    questions.init();
    parties.init();
    lh.init();
    keys.init();
}
module.exports = {questions:questions, parties:parties, lh:lh, keys:keys, init:init};