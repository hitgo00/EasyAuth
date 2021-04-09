const mongoose = require('mongoose');

const NonVerifiedUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: false },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EventScema', required: true, unique: false },
    hash: { type: String, required: true },
},
    {
        collection: 'NonVerifiedUser',
        timestamps: true,
    }
);

NonVerifiedUserSchema.index({ email: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('NonVerifiedUserSchema', NonVerifiedUserSchema);