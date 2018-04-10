const mong = require('mongoose');
const Schema = mong.Schema;
const imageSchema = new Schema({
        image: String,
        imageCaption: String,
});
module.exports=imageSchema;