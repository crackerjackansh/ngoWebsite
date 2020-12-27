const mongoose = require('mongoose');
var picSchema= new mongoose.Schema({
    image_id:String,
    title:String,
    image:String,
    
});
module.exports = mongoose.model("Pic",picSchema);