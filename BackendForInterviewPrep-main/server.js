import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';





import { GoogleGenAI } from "@google/genai";
import connectDB from './config.db/db.js'; // Import DB connection
import InterviewSession from './models/InterviewSession.js';
// Load environment variables from .env file
import userRoutes from './routes/userRoutes.js'; 
import interviewRoutes from './routes/interviewRoutes.js'
import { ApiError } from './utils/ApiError.js';
dotenv.config();

connectDB();

const app = express();

// const allowedOrigins = ["http://localhost:https://interview-prep-bot-6ked.vercel.app/", "http://localhost:5001"];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new ApiError("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

const allowedOrigins = [
  "http://localhost:5173",
   // local React dev
     "http://localhost:3000",


  "http://localhost:5001", // local backend
 // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new ApiError("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Handle preflight requests for all routes
// app.options("(.*)", cors({
//   origin: allowedOrigins,
//   credentials: true
// }));









// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) for all routes
// This allows the frontend (running on a different port) to communicate with the backend.
// app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());
app.use(cookieParser());


// --- Google Generative AI Initialization ---
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in the .env file.");
}

const ai = new GoogleGenAI({});

// async function main() {
     const main = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompt}`,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  console.log(response.text);
  return(response.text);
  
}
export default main;


app.use('/api/users', userRoutes);
app.use('/api/interviews', interviewRoutes);

const port = process.env.PORT || 5001;

// --- Server Listener ---
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
