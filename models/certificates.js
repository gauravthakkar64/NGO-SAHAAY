const mong = require('mongoose');
const Schema = mong.Schema;

// create schema certificate and model
const certificateSchema = new Schema({
    volunteerName:{
        type:String,
        required:[true,"Name is required"]
    },
    ngoName:{
        type:String,
        required:true
    },
    service:{
        type:String,
    },
    date:{
        type:Date
    },
    uniqueId:{
        type:String,
        required:true
    }
});

const Certificate = mong.model('certificate',certificateSchema);
module.exports = Certificate;