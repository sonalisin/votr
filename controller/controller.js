const db = require('../models/db.js');
const q = db.questions;
const parties = db.parties;
const lh = db.lh;
const keys = db.keys;

module.exports.sayHello = function(req,res){
    db.init();
    res.render('home');
}
module.exports.startQuiz = function(req,res){
    const qNum = req.params.id || "0";

    // Can only operate on value within callback
    q.model.find({}).sort('qNum').exec(function(err, qDocs) {
        if (err) {
            console.log("error in startQuiz route, finding questions model");
            return;
        }
        // Render retrieved question
        const theQuestion = qDocs.find(q.findQ, {qNum:qNum});
        res.render('quiz', {
            theQuestion: theQuestion,
            questions: q.count(), num: qNum, startText: q.startText(),
            tally:parties.tally(), allQ: qDocs
        });
    });
}
module.exports.quizResults = function(req,res){
    const match = req.params.match || "LNP";
    const key = parseInt(req.params.key) || 0;
    const answers = req.params.answers || "NULL";
    //check that key is valid, if not redirect to not found
    //point of this is to ensure people can't manipulate their results page
    if(!keys.isValid(match, key)){
        res.render('notFound');
        return;
    }

    //TODO: Implement empty session storage catch
    parties.model.findOne({partyID:match}, function(err, value) {
        if(err){
            console.log("error in quizResults route, finding parties model");
            return;
        }
        q.model.find({},"qText").sort('qNum').exec(function(err, qDocs) {
            // TODO: Implement quiz result algorithm
            // Return matching party instance from DB for matching with Quiz answers
            res.render('results', {
                party: value, answers: answers, qs: qDocs
            });
        })
    })
}

module.exports.learningHub = function(req,res){
    // TODO: Fix URL params to match names of subcontent
    const topicPath = req.params.topicPath || "votingsystem";
    const partyPath= req.params.partyPath || "NULL";

    parties.model.find({}, function(err, partiesDocs) {
        if (err) {
            console.log("error in learningHub route, finding parties model");
            return;
        }

        const currParty = partiesDocs.find(parties.findParty,{partyID:partyPath});

        //nest topics retrieval within parties retrieval
        lh.model.find({}, function (err, topics) {
            if (err) {
                console.log("error in learningHub route "+topicPath);
                return;
            }
            //provided topic is not correct redirect to not found
            const currTopic = topics.find(lh.findPath,{path:topicPath});
            if(currTopic === undefined){
                res.render('notFound');
                return;
            }

            // Return the topics collection from the DB
            res.render('learninghub', {
                parties: partiesDocs, topics: topics,
                currTopic: currTopic, currParty:currParty, partyPath: partyPath
            });
        });
    });
}

module.exports.generateKey = function(req, res){
    //generate key and navigate towards results
    const match = req.params.match;
    const key = keys.genKey(match);

    return res.redirect('/results/'+match+'/'+key);

}

module.exports.notFound = function(req, res){
    res.render('notFound');
}