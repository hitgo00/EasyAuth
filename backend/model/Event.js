const mongoose = require('mongoose');

const EventScema = new mongoose.Schema({
        event_name: {type:String, required:true},
        creator_id: {type:mongoose.Schema.Types.ObjectId, ref:'EventCreatorSchema'},
        created_at: {type:Date,default:Date.now},
        token: {type:String,required:true},
    },
    {collection:'Event'}
)

module.exports = mongoose.model('EventScema',EventScema);