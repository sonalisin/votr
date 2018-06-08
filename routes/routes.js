const express = require('express');
const router = express.Router();
const controller = require('../controller/controller.js');

router.get('/', controller.sayHello);
router.get('/quiz/', controller.startQuiz);
router.get('/quiz/:id', controller.startQuiz);
router.get('/results/:match/:key', controller.quizResults);
router.get('/results/:match/:key/:answers', controller.quizResults);
router.get('/learninghub/', controller.learningHub);
router.get('/learninghub/:topicPath', controller.learningHub);
// Route for rendering specific parties
router.get('/learninghub/:topicPath/:partyPath', controller.learningHub);
//generate session key for results
router.get('/generate/:match', controller.generateKey);
//route for rendering invalid locations
router.get('*', controller.notFound);

module.exports = router;