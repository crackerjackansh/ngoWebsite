const mongoose = require('mongoose');
var vidSchema= new mongoose.Schema({
    title:String,
    thumbnail:String,
    image_id:String,
    video:String
})
module.exports = mongoose.model("Vid",vidSchema);