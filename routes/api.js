const express = require('express');
const modelUtil = require('../util/model-utils')
const router = express.Router();
const Certificates = require('../models/certificates');
//get certificates from db

//router.get('/certificates/:id', modelUtil.loadSingleModel(Certificates, "id"), function (req, res, next) {
  router.get('/certificates/:id',function (req,res){

/*     console.log(req.params.id)
    res.json(req.model) */
    
    Certificates.findOne({
        uniqueId: req.params.id
    }).then(function (data) {
        if(data)
            res.status(200).json(data);
        else    
            res.status(444).json("No certificate Found");
    }).catch(err=>{
        res.status(344).json(err);
    });
});
router.get('/test', function (req, res, next) {
    Certificates.find(req.query, function(err, ngos) {
        res.json(ngos);  
    });
});

//add new certificates to sb
//add new certificates to db
router.post('/certificates', function (req, res, next) {
    //var certificates = new Certificates(req.body);
    //certificates.save();
    console.log(req.body)
    var flag = false;
    var i;
    var id = randomNumber(1000000, 9999999);
    while (!flag) {
        Certificates.findOne({
            uniqueId: id
        }, function (err, obj) {
            flag = obj == null;
        });
        require('deasync').loopWhile(function () {
            return !flag;
        });
    }
    if (flag) {
        flag = false;
        req.body.uniqueId = id;
        console.log(req.body.uniqueId);
        Certificates.create(req.body).then(function (data, next) {
            res.send(data);
        }).catch(err=>{
            res.status(344).json(err);
        });
        //res.send(req.body);
    }
});
// //Update certificates
// router.put('/certificates/:id', function (req, res, next) {
//     Certificates.findByIdAndUpdate({
//         _id: req.params.id
//     }, req.body).then(function () {
//         Certificates.findOne({
//             _id: req.params.id
//         }).then(function (data) {
//             res.send(data);
//         });
//     });
// });

//delete certificates from db // deletions not allowed
// router.delete('/certificates/:id', function (req, res, next) {
//     Certificates.findByIdAndRemove({
//         _id: req.params.id
//     }).then(function (data) {
//         res.send(data);
//     });
//     // res.send({type:'DELETE'});
// });

function randomNumber(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = router;