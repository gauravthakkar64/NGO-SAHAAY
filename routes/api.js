const express = require('express');

const router = express.Router();
const Certificates = require('../models/certificates');
//get certificates from db
router.get('/certificates/:id', function (req, res, next) {
    Certificates.findOne({
        _id: req.params.id
    }).then(function (data) {
        res.json(data);
        //res.render("certificate-verify.ejs",{certificate:data});

    });
});
router.get('/test', function (req, res, next) {
    var id = 123;
    Certificates.findOne({uniqueId: id}, function(err,obj) { console.log(obj); });
    res.send("Test Api");
});

//add new certificates to sb
router.post('/certificates', function (req, res, next) {
    console.log('in');
    //var certificates = new Certificates(req.body);
    //certificates.save();
    var flag = true;
    //while (flag) {
        var id = randomNumber(1000000, 9999999);
        //console.log(id);
        Certificates.findOne({uniqueId: id}, function(err,obj) { 
            console.log("in"); 
            console.log(obj); 
            console.log(err);
            if (obj==null) {
                flag = false;
                req.body.uniqueId = id;
                console.log(req.body.uniqueId);
                Certificates.create(req.body).then(function (data, next) {
                    console.log('sent')
                    res.send(data);
                }).catch(next);
                console.log('done')
                res.send(req.body);
            }
        });
    //}
    console.log('loop')
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