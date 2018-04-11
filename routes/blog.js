const express = require('express');
const router = express.Router();
const ngo = require('../models/ngo');

router.get('/:id',function(req,res){
    ngo.findOne({
        'blog._id': req.params.id
    }).then(blog => {
        if(blog)
            res.status(200).json(blog);
        else
            res.status(444).json("No Blog with the given ID found");
    });
});

router.post('/:id',function(req,res){
    ngo.findOne({_id:req.params.id}).then(obj=>{

        if(obj){
            obj.blog.push(req.body);
            obj.save();
            res.status(200).json(obj);
        }
        else{
            res.status(444).json("NGO not found");
        }
    }).catch(function (err){
        res.status(344).json(err);  
    });  
});
router.delete('/:id',function(req,res){
    ngo.findOne({
        'blog._id': req.params.id
    }).then(blog => {
        if(blog){
            blog.blog.pull(req.params.id);
        blog.save();
        res.status(200).json(blog);
        }
        else{
            res.send(444).json("Blog with the given ID not found");
        }
    });
});
router.get('/all/:id',function(req,res){
    ngo.findOne({_id:req.params.id}).then(obj=>{
        if(obj){
            res.status(200).json(obj.blog);
        }
        else{
            res.status(444).json("NGO not found");
        }
    }).catch(function (err){
        res.status(344).json(err);  
    });  
});
module.exports=router;
