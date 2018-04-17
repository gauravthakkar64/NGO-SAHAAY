const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const TOKEN_PRIVATE_KEY = "3sqr"
const Volunteers = require('../models/volunteer');
const Events = require('../models/event');
const Certificate = require('../models/certificates');
const async= require('async');
const nodemailer = require('nodemailer');
const smtpTransport=require('nodemailer-smtp-transport');
const crypto = require("crypto");
const fs = require('fs');
const xouth2 = require('xoauth2');


//get a volunteer from ID
router.get('/fetch/:id', function (req, res, next) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (data) {
        if(data)
            res.json(data);
        else    
            res.status(444).json("No Volunteer with the given ID found");
    }).catch(function(err){
        res.status(344).json(err);
    });
});

//demo test function
router.get('/', function (req, res, next) {
    Volunteers.find().then(objs=>{
        res.json(objs);
    });
    
});
// register a volunteer
router.post('/register', function (req, res, next) {
    Volunteers.findOne({email:req.body.email},function(err,params) {
        if(params==null){
            Volunteers.create(req.body).then(function (data) {
                data.setPassword(req.body.password);
                data.save();
                //create token
                res.send({
                    email: data.email,
                    token: createToken(data)
                }); 
                res.status(200).json("Successfully registered");
            }).catch(function (err){
                res.status(344).json(err);
            });
        }
        else {
            res.status(444).json("Already exists");
            flag=false;
        }
    });
});

//Update existing volunteer profile
router.patch('/update/:id', function (req, res, next) {

    Volunteers.findById(req.params.id, function (err, volunteerpro) {
        if (!err) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var p in req.body) {
                volunteerpro[p] = req.body[p];
            }
            volunteerpro.save(function (err) {
                if (!err) {
                    res.status(200).json(volunteerpro);
                } else {
                    res.status(344).json("failed");
                }
            });
        }
        else{
            res.status(444).json(err);
        }
    });
});

 //total volunter count
 router.get('/count',function(req,res){
    Volunteers.find().then(objs=>{
        res.json(objs.length);
    });
 });

// Request made by a volunteer to an NGO for event
router.post('/request', function (req, res) {
    Events.findOne({
        _id: req.body.eventId
    }, function (err, event) {
        if (event) {
            Volunteers.findOne({
                _id: req.body.volunteerId
            }).then(function (volunteer) {

                if (volunteer) {
                    event.volunteerRequests.push(req.body.volunteerId);
                    event.save();
                    res.status(200).json("Request Processed Successfully");
                } else {
                    res.status(444).json("Volunteer with given event Id not found");
                }

            });

        } else {
            res.status(444).json("Event with given event Id not found");
        }
    });
});

//Volunteer approves a Request made by a NGO for an Event
// removes from approched and inserts in selected.
//{"volunteerId":"5ab0ee9444d20419bc457bf2","eventId":"5ac220001709802e60aea2a2"}
router.post('/approve',function(req,res) {
    Events.findOne({_id: req.body.eventId}).then(function (event,err) {
        if(event){
            Volunteers.findOne({_id:req.body.volunteerId}).then(function(volunteer,err){
                if(volunteer){
                    event.volunteersApproched.pull(req.body.volunteerId);
                    event.volunteersSelected.push(req.body.volunteerId);
                    event.save();
                    res.sendStatus(200);
                }
                else if(!err){
                    res.status(444).json("No volunteer found by the given volunteer ID");        
                }
                else{
                    res.status(344).json(err);    
                }
            });
        }
        else if(!err){
            res.status(445).json("No event found by the given event ID");
        }
        else{
            res.status(444).json("No volunteer found by the given volunteer ID");        
        }
    });
});

//viewing participated events of volunteer
router.get('/participatedevents/:id', function (req, res) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (volunteer) {
        if (volunteer) {
            Events.find({
                $and: [{
                        volunteersSelected: req.params.id
                    },
                    {
                        date: {
                            $lte: (new Date())
                        }
                    }
                ]
            }).then(function (objs) {
                res.status(200).json(objs);
            });
        } else {
            res.status(444).json("Volunteer not found");
        }
    });
});

//viewing upcoming participated events of volunteer
router.get('/upcomingParticipatedEvents/:id', function (req, res) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (volunteer) {
        if (volunteer) {
            Events.find({
                $and: [{
                        volunteersSelected: req.params.id
                    },
                    {
                        date: {
                            $gte: (new Date())
                        }
                    }
                ]
            }).then(function (objs) {
                res.status(200).json(objs);
            });
        } else {
            res.status(444).json("Volunteer not found");
        }
    });
});
//add certificate to volunteer profile
router.post("/certificate",function (req,res){
    Certificate.findOne({uniqueId:req.body.uniqueId}).then(certificate=>{
        if(certificate){
            Volunteers.findOne({_id:req.body.volunteerId}).then(obj=>{
                if(obj){
                    Volunteers.findOne({certificates:certificate._id}).then(obj1=>{
                        if(!obj){
                            
                            obj.certificates.push(certificate._id);
                            obj.save();
                            res.sendStatus(200);
                        }
                        else{
                            res.status(444).json("Certificate already exisits");                
                        }
                    });
                }
                else{
                    res.status(444).json("Volunteer not found");
                }
            }).catch(err=>{
                res.status(344).json(err);
            });
        }
        else{
            res.status(444).json("No Certificate with the given ID found");
        }
    });
});

//list sent volunteering requests
//buggy *****************************************
router.get('/sentrequests/:id',function(req,res){
    Events.find({
        volunteerRequests:req.params.id
    }).then(function(objs){
        console.log(objs);
        res.status(200).json(objs);
    }).catch(err=>{
        res.status(444).json("Error Occured" + err);
    });
});

//list all the requests by NGO to volunteer for volunteering
//localhost:3000/api/volunteers/fetchngorequests/5ab0ee1444d20419bc457bf8 <- volunteerId
router.get('/fetchngorequests/:id',function(req,res){
    Events.find ({volunteersApproched:req.params.id}).then(function(event,err){
        //console.log(event);
        res.status(200).json(event);
    });
});

//forgot password
router.get('/forgot', function(req, res){
    res.send('response to forgot password page');
    
 });

//creates token to reset password
router.post('/forgot',function(req,res,next){
    async.waterfall([
        function(done){
            crypto.randomBytes(20,function(err,buf){
                var token=buf.toString('hex');
                done(err,token);
                console.log("token created");
            });
        },function(token,done){
            Volunteers.findOne({email:req.body.email},function(err,user){
                    if(!user){
                        //console.log('error','No account with that email address exists.');
                        //return res.redirect('/forgot_password.html');
                        console.log("revert back to reset password page");
                        //return res.send('revert back to reset password page');
                        
                    }
                    
                    console.log("token is "+user.resetPasswordTokens);
                    user.resetPasswordToken=token;
                    user.resetPasswordExpires = Date.now()+3600000; //1 hr

                    user.save(function(err){
                        done(err,token,user);
                        console.log("done");
                    });
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
                'http://' + req.headers.host + '/api/volunteers/reset/' + token + '\n\n' +
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
    Volunteers.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
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
        Volunteers.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            
        if (!user) {
               console.log('Password reset token is invalid or has expired.');
                // req.flash('error', 'Password reset token is invalid or has expired.');
                //return res.send('back');
          }
          else{
              console.log("user found");
          }
          if(req.body.password === req.body.confirm) {
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
            res.json('password  do not match')
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
  

router.post('/login', (req, res)=>{
    Volunteers.findOne({email: req.body.email}, function(err, user){
        if(!err && user){
            console.log(user);
            if(user.validPassword(req.body.password)){
                res.status(200).json({msg: 'login'})
                //dosomething
            }
            else{
                res.status(404).json({msg: 'invalid credentials(password)'})
            }
        }
        else{
                res.status(404).json({msg: 'email does not exist.'})
        }
    });
})
  

module.exports = router;

function createToken(volunteer){
    const payload = {
        username: volunteer.username,
        email: volunteer.email,
        password: volunteer.password.salt
    }
    return jwt.sign(payload, TOKEN_PRIVATE_KEY);
}
