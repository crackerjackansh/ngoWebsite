const mongoose = require('mongoose');
var upcomingSchema= new mongoose.Schema({
    title:String,
    image:String,
    image_id:String,
    location:String,
    joinLink:String,
    date:String,
    body:String,
    created:{type:Date,default:Date.now}
});
module.exports = mongoose.model("Upcoming",upcomingSchema);