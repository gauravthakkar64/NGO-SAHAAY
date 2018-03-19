const mong = require('mongoose');
const Schema = mong.Schema;
const addressSchema = require('./address');
const imageSchema = require('./photo');
const eventSchema = new Schema({
    name: {
        type: String,
        required: [true, "Ngo name is required"]  
    },
    date: {
        type: Date,
        required: false
    },
    venue: {
        type: String,
        required: [true, "Venue is required"]
    },
    totalDays: Number,
    address: addressSchema,
    type: String,
    volunteerSize: String,
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
module.exports = eventSchema;