const express = require('express');
const Ngo = require('../models/ngo');
const modelsUtil = require('../util/model-utils')
const router = express.Router();
const Events = require('../models/event');


router.get('/test',function(req,res){
});
//fetch a particular event
router.get('/fetch/:eventId',function(req,res) {
    Events.findById({id:eventId},function (event){
        res.send(event);
    });
});

//upcomming events
router.get('/upcoming',function(req,res){
    Events.find({date:{$gte:(new Date())}},function(err,obj){
        res.status(200).json(obj);
    });
});
//past events
router.get('/past',function(req,res){
    Events.find({date:{$lte:(new Date())}},function(err,obj){
        res.status(200).json(obj);
    });
});

//event of a specific NGO
router.get('/ngoevent/:id',function(req,res){
    Events.find({ngoId:req.params.id}).then(function(obj){
        res.send(obj);
    });
});

//create an event
// BUG 1:date actually stored in database is a day less than what is actually passed
// Error 2: ngoID validation error
router.post('/create', function(req, res){
    //console.log(req.body);
    Events.create(req.body).then(function (err,data) {
        res.send(data);
    }).catch(err=>{
        res.status(344).json(err);
    });
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