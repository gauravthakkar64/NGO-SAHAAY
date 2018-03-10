const express = require('express');

const router = express.Router();
const Certificates = require('../models/certificates');
//get certificates from db
router.get('/certificates/:id',function (req,res,next) {
    Certificates.findOne({_id:req.params.id}).then(function(data){
        res.json(data);
        //res.render("certificate-verify.ejs",{certificate:data});
        
    });
});
router.get('/abc',function (req,res,next) {
        res.send("ABC");
        //res.render("certificate-verify.ejs",{certificate:data});
});

//add new certificates to sb
router.post('/certificates',function (req,res,next) {
    //var certificates = new Certificates(req.body);
    //certificates.save();
    Certificates.create(req.body).then(function(data,next) {
        res.send(data);    
    }).catch(next);
    //res.send(req.body);
 });

 //Update certificates
 router.put('/certificates/:id',function (req,res,next) {
    Certificates.findByIdAndUpdate({_id:req.params.id},req.body).then(function(){
        Certificates.findOne({_id:req.params.id}).then(function(data){
            res.send(data);
        });
    }); 
    
 });

 //delete certificates from cb
 router.delete('/certificates/:id',function (req,res,next) {
    Certificates.findByIdAndRemove({_id:req.params.id}).then(function(data){
        res.send(data); 
    });
    // res.send({type:'DELETE'});
 });

 module.exports = router;