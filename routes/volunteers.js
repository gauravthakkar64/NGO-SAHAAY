const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const TOKEN_PRIVATE_KEY = "3sqr"
const Volunteers = require('../models/volunteer');
router.get('/fetch/:id', function (req, res, next) {
    Volunteers.findOne({
        _id: req.params.id
    }).then(function (data) {
        res.json(data);

    });
});
router.get('/test', function (req, res, next) {

    res.send("Test Api");
});

router.post('/register', function (req, res, next) {
    Volunteers.create(req.body).then(function (data, next) {
        data.setPassword(req.body.password);
        data.save();
        //create token
        res.send({
            email: data.email,
            token: createToken(data)
        }); 
        res.send(data);
    }).catch(next);
});

module.exports = router;

function createToken(volunteer){
    const payload = {
        username: volunteer.username,
        email: volunteer.email,
        password: volunteer.password.salt
    }
    return jwt.sign(payload, TOKEN_PRIVATE_KEY);
}
