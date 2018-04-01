const express = require('express');

const router = express.Router();
const Ngo = require('../models/ngo');

//test
router.get('/test', (req, res) => {
    res.send("test API");
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


module.exports = router;