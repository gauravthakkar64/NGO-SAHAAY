const mong = require('mongoose');
const Schema = mong.Schema;

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
    totalDays: String,
    address: String,
    cheifGuest: String,
    type: String,
    volunteerSize: String,
    photos:[{
        imageCaption: String,
        imagePath: String
    }],
    volunteers:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Volunteer'
        }
    ]
});

module.exports = eventSchema;