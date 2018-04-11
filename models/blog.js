const mong = require('mongoose');
const Schema = mong.Schema;
const blogSchema = new Schema({
        title: String,
        body: String,
        author: {
            type: String,
        },
        images:[String],
        featuredImage:String,
        date:{
            type:Date,
            default:(new Date())
        },
        tags:[String]
});
module.exports=blogSchema;