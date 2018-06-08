const express = require("express");
const app = express();

/*Allows static reference to CSS and JS files*/
/*app.use(express.static(path.join(__dirname, '/public')));*/

app.use('/public', express.static('public'));

const router = require("./routes/routes.js");
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/', router);

app.listen(PORT, function(){
    console.log("server start");
});


