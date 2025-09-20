import mongoose from "mongoose";
import express from 'express';
import verifyJWT from '../middleware/authMiddleware.js';
import InterviewSession from '../models/InterviewSession.js';
import main from '../server.js'
const router = express.Router();
// Note: We are now importing the 'callGemini' helper function.
// You should move that function from server.js to a utils file.

// Assume callGemini function is available here

// All routes in this file will be protected by the 'protect' middleware
router.use(verifyJWT);

/**
 * @route   POST /api/interviews/start
 * @desc    Starts a new interview
 */
router.post('/start', async (req, res) => {
    try {
  const { role, domain, interviewMode,location } = req.body;
  
  // The user ID is available from the 'protect' middleware
  const userId = req.user._id; 
// role == class or completed education
// domain == field of interest in which they want to pursue career
// interviewMode == easy, medium, hard
  const prompt = ` You are an expert career counselor for students who have just completed their ${role} studies (e.g., 10th or 12th grade), specializing in career guidance for the ${domain} field.
  Your task is to present the user with a multiple-choice question to assess their interests, skills, or aptitude. The difficulty should be set to ${interviewMode}.
  
  Your tone should be professional, friendly, and encouraging.
  {
    "question": "The question to ask the user.",
    "options": ["Option A", "Option B", "Option C", "Option D"]
  }
  
  // Do not add any other text outside of the JSON object.
`;
  const firstQuestionText = await main(prompt); // Replace with await callGemini(prompt);

  const newSession = new InterviewSession({
    user: userId, // Link the session to the logged-in user
    role,
    domain,
    interviewMode,
    location,
    history: [{ sender: 'ai', text: firstQuestionText }]
  });
  await newSession.save();

  res.json({ 
    question: firstQuestionText, sessionId: newSession._id, location: newSession.location
 });
 } catch (error) {
    console.error('Error in /api/interviews/start:', error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * @route   POST /api/interviews/evaluate
 * @desc    Evaluates a user's answer and provides the next question.
 * @access  Public
 */
router.post('/evaluate', async (req, res) => {
  try {
    // const { history, role, domain, interviewMode } = req.body;
     const { sessionId, userAnswer } = req.body;
     // Find the current interview session
     if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid sessionId format' });
    }
    const session = await InterviewSession.findById(sessionId);
    if (!session) {
        return res.status(404).json({ error: 'Interview session not found.' });
    }

     session.history.push({ sender: 'user', text: userAnswer });
    // Convert history to a readable string for the prompt

    // const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const prompt = `
  You are a career counselor continuing to assess a student based on their previous answers.
  The entire session history so far is:
  ---
  ${historyText}
  ---
  The student just answered the last question. Based on their last answer, generate a new multiple-choice question to further gauge their aptitude for the ${session.domain} field.
  
  You MUST provide your response as a valid JSON object with the following structure:
  {
    "question": "The new question to ask.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "feedback": "A brief, constructive comment on the student's last choice."
  }
  
  Do not add any other text outside of the JSON object.
`;
    
    const responseText = await main(prompt);
    // Clean the response to ensure it's valid JSON
    const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
    const result = JSON.parse(cleanedJsonString);
    // Add the AI's next question to the history
    // session.history.push({ sender: 'ai', text: result.nextQuestion });
    // await session.save(); // Save the updated session
    session.history.push({ sender: 'ai', text: result.question });
    await session.save();
    res.json(result);




  } catch (error) {
    console.error('Error in /api/evaluate:', error);
    res.status(500).json({ error: 'Failed to parse AI response or internal server error.' });
  }
});



/**
 * @route   POST /api/interviews/summary
 * @desc    Ends the interview and generates a final summary report.
 * @access  Public
 */
router.post('/summary', async (req, res) => {
    try {
        // const { history, role } = req.body;
          const { sessionId,location } = req.body;
           // Fetch the complete history from the database
        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Interview session not found.' });
        }

         const historyText = session.history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
        // const historyText = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

        const prompt = `
            You are an expert career coach providing a final career to choose based on mock interview.
            The candidate completed his  ${session.role} .
            Here is the complete transcript of the interview:
            ---
            ${historyText}
            ---
            Based on the entire transcript, generate a comprehensive final report for the candidate.
            The report should be encouraging and constructive.
            You MUST provide your response as a valid JSON object with the following structure:
            {
              "course names ": " suggest 3-5 course names for the specific choosed career based on candidate quiz and interest.",
              "career scope": provide career sc"opes for the specific choosed career.,
              "jobs in related career": "A paragraph highlighting the jobs which a candidate will get after persuing that career.",
              "suggestedColleges": "suggest best colleges around 5-7 near candidates location ${location} , give most preference to government colleges."
              "suggestedCollegesSelectionCriteria": "suggest selection criteria for the above suggested colleges. & make sure that never add "Always check the official website of each college for the most current and detailed admission criteria and application processes." or similar meaning sentences in the response. Note that if student selected that it completes 10th class & domain = software- development than you have to show both part like you also show that you can do 12th and after that b.tech and also show that you can do diploma or certifications."
            }

            Do not add any text outside of this JSON object.
        `;

        const responseText = await main(prompt);
        const cleanedJsonString = responseText.replace(/```json\n|```/g, '').trim();
        const summary = JSON.parse(cleanedJsonString);

        res.json(summary);

    } catch (error) {
        console.error('Error in /api/summary:', error);
        res.status(500).json({ error: 'Failed to generate summary report.' });
    }
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










// ... your other /evaluate and /summary routes would go here ...
// They would also be automatically protected.

export default router;