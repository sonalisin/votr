const mongoose = require('mongoose');
var count;

//define learning hub schema
var schema = mongoose.Schema;

var lhSchema = new schema({
    path: String,
    topic: String,
    content: String,
});

const lhModel = mongoose.model('topics', lhSchema)

//define callback
function getValue(err, value){
    if(err){
        console.log("error in find");
    }
    console.log(value);
    return {
        path: value.path,
        topic: value.topic,
        content: value.content
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

//filter function by path
function findPath(topic) {
    return topic.path === this.path;
}

//initialise all data
function init(){
    lhModel.count({}).exec(countDocs);
}

//retrieve array of learning hub data from collection
module.exports = {model:lhModel, cb:getValue, count:getCount, findPath:findPath, init:init}