const express = require('express');
const routes = require("./routes/api");
const authRoutes = require("./routes/auth"); 
const eventsRoutes = require("./routes/events");
const volunteerRoutes = require("./routes/volunteers");
const ngoRoutes = require("./routes/ngo");
const blogRoutes = require("./routes/blog");

const bodyParser = require('body-parser');
const mong = require("mongoose");
var cors = require('cors');

//setup express webapp
const webapp = express();
//connect to mongo db
mong.connect('mongodb://sahaay-admin:sahaaymewithpassword@ngosahaay-shard-00-00-hadfz.mongodb.net:27017,ngosahaay-shard-00-01-hadfz.mongodb.net:27017,ngosahaay-shard-00-02-hadfz.mongodb.net:27017/ngoSahaay?ssl=true&replicaSet=NGOSahaay-shard-0&authSource=admin');
mong.Promise = Promise;


webapp.use(bodyParser.json());
webapp.use(cors());
// webapp.set('views', __dirname + '/views');
// webapp.set('view engine', 'ejs');
// initialize routes

webapp.use(express.static('public'));

webapp.use(function(req,res,next){
    console.log(req.method + '\t' + req.originalUrl)
    next();
});



webapp.use('/api',routes);
webapp.use('/api/auth', authRoutes);
webapp.use('/api/events', eventsRoutes);
webapp.use('/api/volunteers', volunteerRoutes);
webapp.use('/api/blog', blogRoutes);
// webapp.use('/api/events', eventsRoutes);
webapp.use('/api/ngo', ngoRoutes);

//error hadling middleware


//listen for requests
// webapp.listen(process.env.port,function(){
//     console.log('now listeing for reqests');
// });

webapp.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, webapp.settings.env);
  });