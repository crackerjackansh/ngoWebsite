const mongoose = require('mongoose');
var internshipSchema= new mongoose.Schema({
    title:String,
    image:String,
    image_id:String,
    startDate:String,
    timeLimit:String,
    applyLink:String,
    body:String,
    created:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Internship",internshipSchema);