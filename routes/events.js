const express = require('express');
const Ngo = require('../models/ngo');
const modelsUtil = require('../util/model-utils')
const router = express.Router();


//create an event
router.post('/', function(req, res){
    const ngoId = req.body.ngoId;

    Ngo.findOne({uniqueId: ngoId}, function(err, ngo){
        if(err){
            res.json({errMsg: err})
        }
        if(!ngo){
            res.status(404).json({errMsg: 'No'})
        }
        else{
            ngo.events.push(req.body.event)
            ngo.save(function(err, result){
                if(err) {
                    res.json({errMsg: err.message})
                }
                else
                    res.json({event: result})
            });
        }
    });
});



//get all event of a single ngo
router.get('/ngo/:id', modelsUtil.loadSingleModel(Ngo, 'id'), function(req, res){
    res.json(req.model.events)
});

module.exports = router