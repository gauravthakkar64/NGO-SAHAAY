const mong = require('mongoose');
const Schema = mong.Schema;
const imageSchema = new Schema({
        imagePath: String,
        imageCaption: String,
});
module.exports=imageSchema;