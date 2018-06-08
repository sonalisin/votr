const mongoose = require('mongoose');
const forge = require('node-forge');
var secretKey = 0;
var prime = 2;
const textModel = mongoose.model('texts');

//intiialise secretKey
function setKey(err, value){
    if(err){
        console.log("error in setKey");
        return
    }
    secretKey = parseInt(value.text);
}

function setPrime(err, value){
    if(err){
        console.log("error in setPrime");
    }
    prime = value;
}
//initialise all variables
function init(){
    textModel.findOne({page:"key"},setKey);
    //generate a random prime
    forge.prime.generateProbablePrime(32, setPrime);
}

//generate session key by uniquely combining with result string
function genKey(string){
    //multiple random prime with secretKey
    var key = secretKey*prime;

    //intergify string add string to product
    for(var i = 0; i < string.length; i++){
        key+= string.charCodeAt(i);
    }

    return key;
}

//check if key is valid for given result
function isValid(string, key){
    console.log("validating");
    //remove additions from string

    for(var i = 0; i < string.length; i++){
        key -= string.charCodeAt(i);
    }

    //divide by secret key to reveal random prime
    key /= secretKey;

    //determine if result is prime and therefore valid key
    for(var i = 2, s = Math.sqrt(key); i <= s; i++) {

        if (key % i === 0) {
            return false;
        }
    }

    //check that isnt decimal and hasn't been divided by such a small/large number is now infinity or is 1
    return key % 1 === 0 && key > 1 && key !== Infinity && key !== -Infinity;
}

module.exports = {init:init, genKey:genKey, isValid:isValid};