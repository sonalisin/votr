const mongoose = require('mongoose');
var count;
var tally = [];

//define partyData schema
var schema = mongoose.Schema;

var partySchema = new schema({
    partyID: String,
    partyName: String,
    // TODO: Image of Party in DB, for rendering on Results Match Screen and on Learning Hub Parties Screen
    // TODO: POST upload feature with MULTER NPM
    //partyImg: {data: Buffer, contentType: String},
    partyDesc: String,
    partyAlignment: [Number],
    partyURL: String
});

const partyModel = mongoose.model('parties', partySchema)

//define callback
function getValue(err, value){
    if(err){
        console.log("error in find");
    }
    console.log(value);
    return {
        partyName: value.partyName,
        partyDesc: value.partyDesc
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
    console.log("Number of parties: "+count);
    return count;
}

//filter function by partyID, to be used with mongoose find function and this value explicitly declared in find
function findParty(party) {
    return party.partyID === this.partyID;
}

//create empty tally array
function createTally(){

    //record array of parties
    var cursor = partyModel.find({}).cursor();
    cursor.on('data', function(party){
        tally.push({
            party: party.partyID,
            score: 0
        });
    });
}


//return tally array
function returnTally(){
    return tally;
}

//initialise all data
function init(){
    createTally();
    partyModel.count({}).exec(countDocs);
}
//retrieve array of questions from collection
module.exports = {model:partyModel, cb:getValue, count:getCount, findParty:findParty, tally:returnTally, init:init}