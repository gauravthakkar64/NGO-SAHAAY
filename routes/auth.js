const express = require('express');

const router = express.Router();
const Ngo = require('../models/ngo');
const jwt = require('jsonwebtoken');

const TOKEN_PRIVATE_KEY = "3sqr"

function createToken(ngo){
    const payload = {
        username: ngo.username,
        email: ngo.email,
        password: ngo.password.salt
    }
    return jwt.sign(payload, TOKEN_PRIVATE_KEY);
}


router.post('/register',function (req,res,next) {
    req.body.uniqueId = randomNumber(1000000, 9999999);;
    console.log(req.body);
    Ngo.create(req.body).then(function(ngo) {
        ngo.setPassword(req.body.password);
        ngo.save();

        //create token
        res.send({
            email: ngo.email,
            token: createToken(ngo)
        });    
    }).catch(function(err){
        console.log(err)
        res.status(500).json({'errmsg': err.errmsg});
    });
 });


 //login
router.post('/createtoken', function(req, res, next){
    console.log('login')
    Ngo.findOne({email: req.body.email}, function(err, ngo){
        if(err) {
            return err;
        }
        if(ngo){
            if(ngo.validPassword(req.body.password)){
                res.send({
                    token: createToken(ngo)
                })
            }else{
                res.send({
                    error: 'Invalid Username or Password'
                })
            }
        }
        else{
            res.status(404).json({'errmsg': 'account not found'})
        }
    })
});

function randomNumber(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

 module.exports = router;