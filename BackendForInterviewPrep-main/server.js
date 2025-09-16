import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';





import { GoogleGenAI } from "@google/genai";
import connectDB from './config.db/db.js'; // Import DB connection
import InterviewSession from './models/InterviewSession.js';
// Load environment variables from .env file
import userRoutes from './routes/userRoutes.js'; 
import interviewRoutes from './routes/interviewRoutes.js'
import { ApiError } from './utils/ApiError.js';
// dotenv.config();/

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
     "https://interview-prep-bot-peach.vercel.app",

  "http://localhost:5001", // local backend
  "https://interview-prep-bot-6ked.vercel.app" // deployed frontend
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



// /**
//  * @route   POST /api/start
//  * @desc    Starts a new interview and gets the first question.
//  * @access  Public
//  */

// app.post('/api/start', async (req, res) => {
//   try {
//     const { role, domain, interviewMode } = req.body;

//     const prompt = `
//       Act as an expert interviewer for a ${role} position, specializing in ${domain}.
//       You are starting a ${interviewMode} interview.
//       Your tone should be professional, friendly, and encouraging.
//       Do not ask for introductions or any pleasantries.
//       Directly ask the very first interview question based on the role and interview mode.
//       Do not add any preamble like "Great, let's start." or "Here is your first question:". Just state the question directly.
//     `;

//     const firstQuestion =  await main(prompt);
//     // Create a new interview session in the database
//     const newSession = new InterviewSession({
//       role,
//       domain,
//       interviewMode,
//       history: [{ sender: 'ai', text: firstQuestionText }] // Add the first question to history
//     });

//     await newSession.save();

//     // Return the first question and the unique session ID to the client
//     res.json({ 
//         question: firstQuestion, 
//         sessionId: newSession._id 
//     });
//     // res.json({ question: firstQuestion });

//     // await main(prompt);

//   } catch (error) {
//     console.error('Error in /api/start:', error);
//     res.status(500).json({ error: error.message });
//   }
// });








// const ai = new GoogleGenAI({});

// // async function main() {
//     const main = async (prompt) => {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: `${prompt}`,
//     config: {
//       thinkingConfig: {
//         thinkingBudget: 0, // Disables thinking
//       },
//     }
//   });
//   console.log(response.text);
//   return(response.text);
  
// }

 
// /**
//  * @route   POST /api/evaluate
//  * @desc    Evaluates a user's answer and provides the next question.
//  * @access  Public
//  */
// app.post('/api/evaluate', async (req, res) => {
//   try {
//     // const { history, role, domain, interviewMode } = req.body;
//      const { sessionId, userAnswer } = req.body;
//      // Find the current interview session
//     const session = await InterviewSession.findById(sessionId);
//     if (!session) {
//         return res.status(404).json({ error: 'Interview session not found.' });
//     }

//      session.history.push({ sender: 'user', text: userAnswer });
//     // Convert history to a readable string for the prompt

//     // const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
//     const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
//     const prompt = `
//       You are an expert interviewer for a ${session.role} position specializing in ${domain}, conducting a ${interviewMode} interview.
//       The entire interview history so far is:
//       ---
//       ${historyText}
//       ---
//       Your task is to evaluate the candidate's most recent answer and then ask the next question.
//       You MUST provide your response as a valid JSON object with the following structure:
//       {
//         "feedback": "A detailed, constructive critique of the candidate's last answer. Be specific about what was good and what could be improved. Use markdown for formatting.",
//         "score": A numerical score from 1 to 10 for the last answer, where 1 is poor and 10 is excellent.,
//         "nextQuestion": "The next logical interview question. The question should build upon the conversation if possible, or introduce a new relevant topic. Do not repeat questions."
//       }

//       Do not add any extra text or explanation outside of the JSON object.
//     `;
    
//     const responseText = await main(prompt);
//     // Clean the response to ensure it's valid JSON
//     const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
//     const result = JSON.parse(cleanedJsonString);
//     // Add the AI's next question to the history
//     session.history.push({ sender: 'ai', text: result.nextQuestion });
//     await session.save(); // Save the updated session

//     res.json(result);




//   } catch (error) {
//     console.error('Error in /api/evaluate:', error);
//     res.status(500).json({ error: 'Failed to parse AI response or internal server error.' });
//   }
// });


// /**
//  * @route   POST /api/summary
//  * @desc    Ends the interview and generates a final summary report.
//  * @access  Public
//  */
// app.post('/api/summary', async (req, res) => {
//     try {
//         // const { history, role } = req.body;
//           const { sessionId } = req.body;
//            // Fetch the complete history from the database
//         const session = await InterviewSession.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({ error: 'Interview session not found.' });
//         }

//          const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
//         // const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

//         const prompt = `
//             You are an expert career coach providing a final summary for a mock interview.
//             The candidate was interviewing for a ${session.role} position.
//             Here is the complete transcript of the interview:
//             ---
//             ${historyText}
//             ---
//             Based on the entire transcript, generate a comprehensive final report for the candidate.
//             The report should be encouraging and constructive.
//             You MUST provide your response as a valid JSON object with the following structure:
//             {
//               "overallScore": An average score out of 10 for the entire interview performance.,
//               "strengths": "A paragraph highlighting the candidate's key strengths, with specific examples from the interview.",
//               "areasForImprovement": "A paragraph detailing the areas where the candidate can improve, offering actionable advice.",
//               "suggestedResources": "A list of 3-5 bullet points with suggested resources (like articles, courses, or topics to study) to help the candidate improve."
//             }

//             Do not add any text outside of this JSON object.
//         `;

//         const responseText = await main(prompt);
//         const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
//         const summary = JSON.parse(cleanedJsonString);

//         res.json(summary);

//     } catch (error) {
//         console.error('Error in /api/summary:', error);
//         res.status(500).json({ error: 'Failed to generate summary report.' });
//     }
// });











































// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import connectDB from './config/db.js'; // Import DB connection
// import InterviewSession from './models/InterviewSession.js'; // Import Mongoose model

// // Load environment variables
// dotenv.config();

// // Connect to Database
// connectDB();

// const app = express();
// const port = process.env.PORT || 5001;

// // --- Middleware ---
// app.use(cors());
// app.use(express.json());

// // --- Google Generative AI Initialization ---
// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not defined in the .env file.");
// }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // Helper function to call Gemini
// const callGemini = async (prompt) => {
//     try {
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text();
//     } catch (error) {
//         console.error("Error calling Gemini API:", error);
//         throw new Error("Failed to get response from AI model.");
//     }
// };

// /**
//  * @route   POST /api/start
//  * @desc    Starts a new interview, saves it, and gets the first question.
//  */
// app.post('/api/start', async (req, res) => {
//   try {
//     const { role, domain, interviewMode } = req.body;

//     const prompt = `Directly ask the very first interview question for a ${role} position specializing in ${domain} for a ${interviewMode} interview. Do not add any preamble like "Great, let's start." or "Here is your first question:". Just state the question.`;
    
//     const firstQuestionText = await callGemini(prompt);

//     // Create a new interview session in the database
//     const newSession = new InterviewSession({
//       role,
//       domain,
//       interviewMode,
//       history: [{ sender: 'ai', text: firstQuestionText }] // Add the first question to history
//     });

//     await newSession.save();

//     // Return the first question and the unique session ID to the client
//     res.json({ 
//         question: firstQuestionText, 
//         sessionId: newSession._id 
//     });

//   } catch (error) {
//     console.error('Error in /api/start:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


// /**
//  * @route   POST /api/evaluate
//  * @desc    Evaluates an answer, updates history, and provides the next question.
//  */
// app.post('/api/evaluate', async (req, res) => {
//   try {
//     const { sessionId, userAnswer } = req.body;

//     // Find the current interview session
//     const session = await InterviewSession.findById(sessionId);
//     if (!session) {
//         return res.status(404).json({ error: 'Interview session not found.' });
//     }

//     // Add the user's answer to the history
//     session.history.push({ sender: 'user', text: userAnswer });
    
//     const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

//     const prompt = `You are an expert interviewer for a ${session.role} position. The interview history is:
// ---
// ${historyText}
// ---
// Your task is to evaluate the candidate's most recent answer and then ask the next question.
// You MUST provide your response as a valid JSON object with this structure:
// {
//   "feedback": "A detailed, constructive critique of the candidate's last answer.",
//   "score": A numerical score from 1 to 10 for the last answer.,
//   "nextQuestion": "The next logical interview question."
// }
// Do not add any text or explanation outside the JSON object.`;
    
//     const responseText = await callGemini(prompt);
//     const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
//     const result = JSON.parse(cleanedJsonString);
    
//     // Add the AI's next question to the history
//     session.history.push({ sender: 'ai', text: result.nextQuestion });
//     await session.save(); // Save the updated session

//     res.json(result);

//   } catch (error) {
//     console.error('Error in /api/evaluate:', error);
//     res.status(500).json({ error: 'Failed to parse AI response or internal server error.' });
//   }
// });


// /**
//  * @route   POST /api/summary
//  * @desc    Ends the interview and generates a final summary report.
//  */
// app.post('/api/summary', async (req, res) => {
//     try {
//         const { sessionId } = req.body;
        
//         // Fetch the complete history from the database
//         const session = await InterviewSession.findById(sessionId);
//         if (!session) {
//             return res.status(404).json({ error: 'Interview session not found.' });
//         }

//         const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

//         const prompt = `You are an expert career coach. Based on the entire transcript for a ${session.role} interview, generate a comprehensive final report.
// ---
// ${historyText}
// ---
// You MUST provide your response as a valid JSON object with this structure:
// {
//   "overallScore": An average score out of 10.,
//   "strengths": "A paragraph on key strengths with examples.",
//   "areasForImprovement": "A paragraph on areas for improvement with advice.",
//   "suggestedResources": "A list of 3-5 bullet points with suggested resources."
// }
// Do not add any text outside this JSON object.`;

//         const responseText = await callGemini(prompt);
//         const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
//         const summary = JSON.parse(cleanedJsonString);

//         res.json(summary);

//     } catch (error) {
//         console.error('Error in /api/summary:', error);
//         res.status(500).json({ error: 'Failed to generate summary report.' });
//     }
// });


// // --- Server Listener ---
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
