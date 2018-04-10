const express = require('express');

const router = express.Router();
const Ngo = require('../models/ngo');

//test
router.get('/test', (req, res) => {
    res.send("test API");
});

//Get ngo by unique id
router.get('/fetch/:id', function (req, res, next) {
    Ngo.findOne({
        uniqueId: req.params.id
    }).then(function (data) {
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(444).json("No volunteer with the specfifed Id found");
        }
    });
});

router.get('/fetchbyemail/:email', function (req, res, next) {
    Ngo.findOne({
        email: req.params.email
    }).then(function (data) {
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(444).json("email exists");
        }
    });
});

 //total NGO count
 router.get('/count',function(req,res){
    Ngo.find().then(objs=>{
        res.json(objs.length);
    });
 });

//find NGO by tag
// Accepts input in the form of array eg : service:["service1","service2"]
router.post('/ngobyservice', function (req, res) {
    Ngo.find(req.body).then((obj,err)=>{
        res.status(200).json(obj);
    });
    // Ngo.find({
    //         $or: [{
    //             service: "service"
    //         }, {
    //             service: "servicer"
    //         }]
    //     },
    //     function (err, results) {
    //         res.status(200).json(results);
    //     })
});

//ngo listing
router.get('/ngos', function (req, res, next) {
    console.log(req.query)
    Ngo.find(req.query, function (err, ngos) {
        res.send(ngos);
    });
});

//Update NGO By id
router.patch('/update/:id', function (req, res, next) {


     let query={uniqueId:req.params.id}
 
     Ngo.update(query, req.body, function(err){
         if(err)
         {
             console.log(err);
             return;
         }else{
             res.send(req.body);
         }
     });
 });


module.exports = router;