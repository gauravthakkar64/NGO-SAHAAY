const mong = require('mongoose');
const Schema = mong.Schema;
const addressSchema = require('./address');
const imageSchema = require('./photo');
const rsvpSchema = new Schema({
    email:String,
    attendees:Number
});

const eventSchema = new Schema({
    ngoId:{
        type:Schema.Types.ObjectId,
        //type:String,
        required:true
    },
    name: {
        type: String,
        required: [true, "Ngo name is required"]  
    },
    description:String,
    date: {
        type: Date,
        required: false
    },
    venue: addressSchema,
    totalDays: Number,
    type: String,
    volunteerSize: Number,
    photos:[imageSchema],
    volunteersSelected:[{
        type: Schema.Types.ObjectId,
        ref: 'volunteer'
    }],
    volunteersApproched:[{
        type: Schema.Types.ObjectId,
        ref: 'volunteer'
    }],
    volunteerRequests:[{
        type: Schema.Types.ObjectId,
        ref: 'volunteer'
    }],
    rsvp:[rsvpSchema]
});


const Events = mong.model('Events', eventSchema);
module.exports = Events;