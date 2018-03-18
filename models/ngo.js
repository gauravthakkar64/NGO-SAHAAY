const mong = require('mongoose');
const crypto = require('crypto');
const EventSchema = require('./event')
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
        select: false
    },
    service:{
        type: String,
        //required: true
    },
    logo: String,
    teamSize: Number,
    aboutUs: String,
    establishedYear: {
        type: Date
    },
    address: {
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
    },
    contact:{
        number: String,
        officeNumber: String,
        faxNo: String
    },

    events:[EventSchema]
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