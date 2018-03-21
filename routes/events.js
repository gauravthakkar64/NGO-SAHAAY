const express = require('express');
const Ngo = require('../models/ngo');
const modelsUtil = require('../util/model-utils')
const router = express.Router();
const Events = require('../models/event');


//create an event
router.post('/create', function(req, res){
    Events.create(req.body).then(function (data) {
        res.send(data);
    })
});

//NGO approves a Request made by a Volunteer to Event
router.post('/approve',function(req,res) {
    Events.findOne({_id: req.body.eventId},function (err,event) {
        event.volunteerRequests.pull(req.body.volunteerId);
        event.volunteersSelected.push(req.body.volunteerId);
        event.save();
    });
});


//request made by NGO to a volunteer
router.post('/request',function(req,res){
    Events.findOne({_id: req.body.eventId},function (err,event) {
        event.volunteersApproched.push(req.body.volunteerId);
        event.save();
    });
});

//get all event of a single ngo
router.get('/ngo/:id', modelsUtil.loadSingleModel(Ngo, 'id'), function(req, res){
    res.json(req.model.events)
});

module.exports = router