const express = require('express');
const Ngo = require('../models/ngo');
const modelsUtil = require('../util/model-utils')
const router = express.Router();
const Events = require('../models/event');
const mong = require('mongoose');

router.get('/test',function(req,res){
});

router.get('/', function(req, res){
    let query = {};
    if(req.query.city)
        query["venue.city"] = req.query.city
    if(req.query.state)
        query["venue.state"] = req.query.state
    
    Events.find(query).sort({date: 1}).exec(function(err, events) { 
        res.json(events);
    });
});

//fetch a particular event

router.get('/fetch/:id/',function(req,res) {
    Events.findById({id: req.params.id},function (err, event){
        if(err)
            res.json(err);
        else
            res.json(event);
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

//find event by type
router.post('/eventbytype', function (req, res) {
    Ngo.find(req.body).then((obj,err)=>{
        res.status(200).json(obj);
    });
});


//create an event

router.post('/create', function(req, res){
    console.log('create')
    console.log(req.body);

    /* Example Request Body
        { 
          name: 'sahaay',
          totalDays: '5',
          volunteerSize: '5',
          date: '03/23/2018',
          type: 'donation',
          venue: 
          { 
             street: '221 baker street',
             city: 'Ahmedabad',
             state: 'Gujarat',
             country: 'India' 
          },
          photos: [ 'photo in base64', ] 
        }
    */
    Events.create(req.body).then(function (err,data) {
        res.json(data);
    }).catch(err=>{
        res.status(404).json(err);
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
// REQ BODY {"voluteerId":"5ab0ee1444d20419bc457bf8","eventId":"5abbc070fe0249330c9f49b0"}
//ADDS THE given volunteer Id to the event model in volunteersapproached
router.post('/request',function(req,res){
    Events.findOne({_id:req.body.eventId}).then(function (event,err) {
        event.volunteersApproched.push(req.body.volunteerId);
        res.sendStatus(200);
        event.save();
    }).catch(err=>{
        console.log(err);
    });
});

//get all event of a single ngo
router.get('/ngo/:id', modelsUtil.loadSingleModel(Ngo, 'id'), function(req, res){
    res.json(req.model.events)
});

module.exports = router