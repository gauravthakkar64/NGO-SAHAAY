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
        res.json(data);

    });
});

//demo test function
router.get('/test', function (req, res, next) {
    Volunteers.findOne({email:"email@gmail.com"},function(err,params) {
        console.log(params);
        res.send("Test Api");
    });
    
});
// register a volunteer to NGO
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
            }).catch(next);
        }
        else {
            res.send("Already exists");
            flag=false;
        }
    });
});

// Request made by a volunteer to an NGO for event
router.post('/request',function(req,res) {
    Events.findOne({_id: req.body.eventId},function (err,event) {
        event.volunteerRequests.push(req.body.volunteerId);
        event.save();
    });
});

//Volunteer approves a Request made by a NGO for an Event
router.post('/approve',function(req,res) {
    Events.findOne({_id: req.body.eventId},function (err,event) {
        event.volunteersApproched.pull(req.body.volunteerId);
        event.volunteersSelected.push(req.body.volunteerId);
        event.save();
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
