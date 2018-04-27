const mong = require('mongoose');
const crypto = require('crypto');
const eventSchema = require('./event');
const addressSchema = require('./address');
const blogSchema = require('./blog');
const imageSchema = require('./photo');
const Schema = mong.Schema

const ngoSchema = new Schema({
    uniqueId: {
        type: String,
        lowercase:true,
        unique: [true, 'username already taken.'],
        required: true,
        validate: {
            validator: function(v) {
                return /[a-zA-Z0-9]+/.test(v);
            },
            message: '{VALUE} is not a valid id!'
        },
        index: true
    },
    name: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        lowercase:true,
        unique: [true, "email already exist."],
        required: true
    },
    password:{
        hash: String,
        salt: String,
    },
    service:{
        type: String,
    },
    blog:[blogSchema],
    logo: String,
    donationLink: String,
    photo:[imageSchema],
    teamSize: Number,
    aboutUs: String,
    establishedYear: {
        type: Date
    },
    address: addressSchema,
    contact:{
        number: String,
        officeNumber: String,
        faxNo: String
    },
    about:String,
    points:Number,
    pastEvents:{
        type:[Schema.Types.ObjectId],
        ref:'Events'
    },
    upcomingEvents:{
        type:[Schema.Types.ObjectId],
        ref:'Events'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date //token expires in 1:00 hr
});

ngoSchema.methods.setPassword = function(password){
    console.log('password ' + password);
    this.password.salt = crypto.randomBytes(16).toString('hex');
    this.password.hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
};


ngoSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.password.salt, 10000, 512, 'sha512').toString('hex');
    return this.password.hash === hash;
};

//to delete sesitive information like password from result
ngoSchema.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

const Ngo = mong.model('ngo', ngoSchema);
module.exports = Ngo;