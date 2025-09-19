
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    counselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor',
        required: true
    },
    appointmentTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'No-show'],
        default: 'Scheduled'
    },
    notes: { // Notes from the counselor after the session
        type: String
    },
    endTime: { type: Date, required: true },

    mode: { // To support both online and offline
        type: String,
        enum: ['Online', 'In-person'],
        default: 'Online'
    }
}, { timestamps: true });

// Ensure a counselor can only have one appointment at a specific time
appointmentSchema.index({ counselor: 1, appointmentTime: 1 }, { unique: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
