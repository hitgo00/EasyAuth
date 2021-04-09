const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: false },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EventScema', required: true, unique: false },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    data: { type: mongoose.Schema.Types.Mixed }
},
    {
        collection: 'Users',
        timestamps: true,
        minimize: false,
    }
)

UserSchema.index({ email: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('UserSchema', UserSchema);