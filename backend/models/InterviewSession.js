import mongoose from 'mongoose';

// A sub-schema for individual messages in the history
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['user', 'ai'] // Sender can only be 'user' or 'ai'
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// The main schema for an entire interview session
const interviewSessionSchema = new mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This tells Mongoose the ObjectId refers to a User document
  },
  role: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  interviewMode: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  // History will be an array of message objects
  history: [messageSchema] 
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;