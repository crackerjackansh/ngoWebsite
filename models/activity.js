const mongoose = require('mongoose');
var activitiesSchema= new mongoose.Schema({
    title:String,
    image:String,
    image_id:String,
    location:String,
    body:String,
    doneDate:String
});
module.exports = mongoose.model("Activities",activitiesSchema);