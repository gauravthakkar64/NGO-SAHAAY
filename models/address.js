const mong = require('mongoose');
const Schema = mong.Schema;
const addressSchema = new Schema({
        street: String,
        city: String,
        state: {
            type: String,
        },
        country: {
            type: String,
            required: false
        },
        pincode: Number
});
module.exports=addressSchema;