const mong = require('mongoose');
const Schema = mong.Schema;
const crypto = require('crypto');

const addressScehma = require('./address');
const volunteerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: addressScehma,
    interests: [String],
    photo: String,
    contactNumber:Number,
    weeklyHours:Number, 
    certificates:{
        type: [Schema.Types.ObjectId],
        ref: 'Volunteer',
    },
    email:String,
    password:{
        hash: String,
        salt: String
    }
});
volunteerSchema.methods.setPassword = function(password){
    console.log('password ' + password);
    this.password.salt = crypto.randomBytes(16).toString('hex');
    this.password.hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
};


volunteerSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
    return this.password.hash === hash;
};

//to delete sesitive information like password from result
volunteerSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
const vs = mong.model('volunteer', volunteerSchema);
module.exports = vs;