import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,
    },
    startTime: { type: String, required: true }, // e.g., "09:00"
    endTime: { type: String, required: true },   // e.g., "17:00"
    isAvailable: { type: Boolean, default: true }
});

const counselorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specializations: [{
        type: String
    }],
    bio: {
        type: String,
        maxlength: 500
    },
    availability: [availabilitySchema]
}, { timestamps: true });

export const Counselor = mongoose.model('Counselor', counselorSchema);
