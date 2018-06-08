const mongoose = require('mongoose');
var startText = "If you're seeing this, start text hasn't loaded";
var count;

//define quizData schema
var schema = mongoose.Schema

var qSchema = new schema({
    qText: String,
    qHelp: String,
    qNum: Number,
    yes: [String],
    no: [String],
});

const qModel = mongoose.model('questions', qSchema);

//define text schema
var textSchema = new schema({
    page: String,
    text: String
})

const textModel = mongoose.model('texts',textSchema);

//set startText
function setStart(err, value){
    if(err){
        console.log("error in startText");
        return
    }
    startText = value.text;
}

function getStart(){
    return startText;
}

//define callback
function getValue(err, value){
    if(err){
        console.log("error in find");
    }
    console.log(value);
    return {
        qText: value.qText,
        qHelp: value.qHelp
    };
}

//define function sequence to return count of documents
function countDocs(err, value){
    if(err){
        console.log("error in count");
        return
    }

    count = value;
}

//return the current value of count
function getCount(){
    return count;
}

//filter function by qNum, to be used with mongoose find function and this value explicitly declared in find
function findQ(question) {
    return question.qNum === parseInt(this.qNum);
}

//initialise all data
function init(){
    qModel.count({}).exec(countDocs);
    textModel.findOne({page:"quiz"},setStart);
}

//retrieve array of questions from collection
module.exports = {model : qModel, cb:getValue, count:getCount, startText: getStart, findQ:findQ, init:init}