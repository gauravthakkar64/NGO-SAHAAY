const express = require('express');

const router = express.Router();
const Ngo = require('../models/ngo');
const async= require('async');
const nodemailer = require('nodemailer');
const smtpTransport=require('nodemailer-smtp-transport');
const crypto = require("crypto");
const fs = require('fs');
const xouth2 = require('xoauth2');

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

 //forgot password
router.get('/forgot', function(req, res){
    res.send('response to forgot password page');
    
 });
//Enter both email and uniqueId to get mail of reset password  api
router.post('/forgot',function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token=buf.toString('hex');
                done(err,token);
                console.log("token created");
            });
        },function(token,done){
            console.log(req.body.email);
            Ngo.findOne({uniqueId:req.body.uniqueId},function(err,user){
                    if(!user){
                        //console.log('error','No account with that email address exists.');
                        //return res.redirect('/forgot_password.html');
                        console.log("revert back to reset password page");
                        //return res.send('revert back to reset password page');
                        
                    }
                    else{
                    console.log("token is "+user.resetPasswordTokens);
                    user.resetPasswordToken=token;
                    user.resetPasswordExpires = Date.now()+3600000; //1 hr

                    user.save(function(err){
                        done(err,token,user);
                        console.log("done");
                    });
                }
            });
        },
        function(token,user,done){
           
            let transport=nodemailer.createTransport({
                service:'gmail',
                secure:false,
                port:25,
                auth:{
                      user:'ngosahaay@gmail.com',
                      pass:'NgoSahaay123'    
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
            let mailOptions ={
                from:'ngosahaay@gmail.com',
                to: user.email,
                subject:'Reset password',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/api/ngo/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                done(err, 'done');
                res.status(200);
              });
        }
    ],function(err){
        if(err) 
        console.log('in above');
        // return next(err);

        res.send('page redirected to change password');
    });
});

//Reset password token
router.get('/reset/:token', function(req, res) {
    Ngo.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.send('redirect to forgot password page');
      }
      res.send('reset password page');
    });
  });

  //reset password page
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        Ngo.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            
        if (!user) {
               console.log('Password reset token is invalid or has expired.');
                // req.flash('error', 'Password reset token is invalid or has expired.');
                //return res.send('back');
          }
          else{
              console.log("user found");
          }
          if(req.body.password === req.body.confirm) {
             
                
              //user.temppassword=req.body.password;
              user.setPassword(req.body.password);
              user.save(function(err){  
                  if(err)
                  {
                   console.log("error in changing");
                  }
                  else{
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                   console.log('Password changed successfully');
                   done(err, user);
                  }
              })
              
          } else {
            console.log("password not macth");
          }
          
        });
      },
      function(user, done) {
          console.log("in mail");
        let transport=nodemailer.createTransport({
            service:'gmail',
            secure:false,
            port:25,
            auth:{
                  user:'ngosahaay@gmail.com',
                  pass:'NgoSahaay123'    
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        console.log(user.email);
        var mailOptions = {
          to: user.email,
          from: 'ngosahaay@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transport.sendMail(mailOptions, function(err) {
            done(err);
            res.status(200).json({"messgae":"success"});
        
        });
      }
    ], function(err) {
        res.status(200);
      res.send('password changed successfully,revert back to login page');
    });
  });



module.exports = router;