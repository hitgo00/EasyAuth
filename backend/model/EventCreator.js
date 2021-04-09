const mongoose = require('mongoose');
const EventCreatorSchema = new mongoose.Schema({
        username:{type:String,required:true,unique:true},
        email:{type:String,required:true,unique:true}
    },
    {collection:'EventCreator'}
)

module.exports = mongoose.model('EventCreatorSchema',EventCreatorSchema);