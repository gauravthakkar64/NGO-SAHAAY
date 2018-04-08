const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const TOKEN_PRIVATE_KEY = "3sqr"
const Volunteers = require('../models/volunteer');
const Events = require('../models/event');


//get a volunteer from ID
router.get('/fetch/:id', function (req, res, next) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (data) {
        if(data)
            res.json(data);
        else    
            res.status(444).json("No Volunteer with the given ID found");
    }).catch(function(err){
        res.status(344).json(err);
    });
});

//demo test function
router.get('/test', function (req, res, next) {
    // Volunteers.findOne({email:"email@gmail.com"},function(err,params) {
    //     console.log(params);
    console.log(new Date());
        res.send("Test Api");
        
    // });
    
});
// register a volunteer
router.post('/register', function (req, res, next) {
    Volunteers.findOne({email:req.body.email},function(err,params) {
        if(params==null){
            Volunteers.create(req.body).then(function (data) {
                data.setPassword(req.body.password);
                data.save();
                //create token
                res.send({
                    email: data.email,
                    token: createToken(data)
                }); 
                res.status(200).json("Successfully registered");
            }).catch(function (err){
                res.status(344).json(err);
            });
        }
        else {
            res.status(444).json("Already exists");
            flag=false;
        }
    });
});

//Update existing volunteer profile
router.patch('/update/:id', function (req, res, next) {

    Volunteers.findById(req.params.id, function (err, volunteerpro) {
        if (!err) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                volunteerpro[p] = req.body[p];
            }
            volunteerpro.save(function (err) {
                if (!err) {
                    res.status(200).json(volunteerpro);
                } else {
                    res.status(344).json("failed");
                }
            });
        }
        else{
            res.status(444).json(err);
        }
    });
});

 //total volunter count
 router.get('/count',function(req,res){
    Volunteers.find().then(objs=>{
        res.json(objs.length);
    });
 });

// Request made by a volunteer to an NGO for event
router.post('/request', function (req, res) {
    Events.findOne({
        _id: req.body.eventId
    }, function (err, event) {
        if (event) {
            Volunteers.findOne({
                _id: req.body.volunteerId
            }).then(function (volunteer) {

                if (volunteer) {
                    event.volunteerRequests.push(req.body.volunteerId);
                    event.save();
                    res.status(200).json("Request Processed Successfully");
                } else {
                    res.status(444).json("Volunteer with given event Id not found");
                }

            });

        } else {
            res.status(444).json("Event with given event Id not found");
        }
    });
});

//Volunteer approves a Request made by a NGO for an Event
// removes from approched and inserts in selected.
//{"volunteerId":"5ab0ee9444d20419bc457bf2","eventId":"5ac220001709802e60aea2a2"}
router.post('/approve',function(req,res) {
    Events.findOne({_id: req.body.eventId}).then(function (event) {
        if(event){
            Volunteers.findOne({_id:req.params.volunteerId}).then(function(volunteer){
                if(volunteer){
                    event.volunteersApproched.pull(req.body.volunteerId);
                    event.volunteersSelected.push(req.body.volunteerId);
                    event.save();
                    res.sendStatus(200);
                }
                else{
                    res.status(444).json("No volunteer found by the given volunteer ID");        
                }
            }.catch(err=>{
                res.status(344).json(err);
            }));
        }
        else{
            res.status(445).json("No event found by the given event ID");
        }
    }.catch(err=>{
        res.status(444).json("No volunteer found by the given volunteer ID");        
    }));
});

//viewing participated events of volunteer
router.get('/participatedevents/:id', function (req, res) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (volunteer) {
        if (volunteer) {
            Events.find({
                $and: [{
                        volunteersSelected: req.params.id
                    },
                    {
                        date: {
                            $lte: (new Date())
                        }
                    }
                ]
            }).then(function (objs) {
                res.status(200).json(objs);
            });
        } else {
            res.status(444).json("Volunteer not found");
        }
    });
});

//viewing upcoming participated events of volunteer
router.get('/upcomingParticipatedEvents/:id', function (req, res) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (volunteer) {
        if (volunteer) {
            Events.find({
                $and: [{
                        volunteersSelected: req.params.id
                    },
                    {
                        date: {
                            $gte: (new Date())
                        }
                    }
                ]
            }).then(function (objs) {
                res.status(200).json(objs);
            });
        } else {
            res.status(444).json("Volunteer not found");
        }
    });
});

//list sent volunteering requests
//buggy *****************************************
router.get('/sentrequests/:id',function(req,res){
    Events.find({
        volunteerRequests:req.params.id
    }).then(function(objs){
        console.log(objs);
        res.status(200).json(objs);
    }).catch(err=>{
        res.status(444).json("Error Occured" + err);
    });
});

//list all the requests by NGO to volunteer for volunteering
//localhost:3000/api/volunteers/fetchngorequests/5ab0ee1444d20419bc457bf8 <- volunteerId
router.get('/fetchngorequests/:id',function(req,res){
    Events.find ({volunteersApproched:req.params.id}).then(function(event,err){
        //console.log(event);
        res.status(200).json(event);
    });
});

module.exports = router;

function createToken(volunteer){
    const payload = {
        username: volunteer.username,
        email: volunteer.email,
        password: volunteer.password.salt
    }
    return jwt.sign(payload, TOKEN_PRIVATE_KEY);
}
