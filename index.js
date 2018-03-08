const express = require('express');
const routes = require("./routes/api"); 
const bodyParser = require('body-parser');
const mong = require("mongoose");
var cors = require('cors');

//setup express webapp
const webapp = express();
//connect to mingi db
mong.connect('mongodb://localhost:27017/ngoSahaay');
mong.Promise = global.Promise;


webapp.use(bodyParser.json());
webapp.use(cors());
// webapp.set('views', __dirname + '/views');
// webapp.set('view engine', 'ejs');
// initialize routes
webapp.use('/api',routes);

//error hadling middleware
webapp.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({errorrr:err.message});
});

//listen for requests
webapp.listen(process.env.port || 4000,function(){
    console.log('now listeing for reqests');
});

