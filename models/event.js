const mong = require('mongoose');
const Schema = mong.Schema;
const addressSchema = require('./address');
const imageSchema = require('./photo');
const eventSchema = new Schema({
    ngoID:{
        type:Schema.Types.ObjectId,
        //type:String,
        required:true
    },
    name: {
        type: String,
        required: [true, "Ngo name is required"]  
    },
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
        ref: 'Volunteer'
    }],
    volunteersApproched:[{
        type: Schema.Types.ObjectId,
        ref: 'Volunteer'
    }],
    volunteerRequests:[{
        type: Schema.Types.ObjectId,
        ref: 'Volunteer'
    }]
});
const Events = mong.model('Events', eventSchema);
module.exports = Events;