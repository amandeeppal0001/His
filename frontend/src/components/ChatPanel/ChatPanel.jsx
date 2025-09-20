import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  // Load initial career guidance data
  useEffect(() => {
    const startData = location.state?.interviewData;
    console.log("StartData received:", startData);
    
    if (startData && startData.sessionId && startData.question && startData.options) {
      console.log("Question:", startData.question);
      console.log("Options:", startData.options);
      
      // Create initial message with the question and options
      const initialMessage = {
        sender: "bot",
        text: startData.question,
        options: startData.options,
        type: "mcq"
      };
      
      setMessages([initialMessage]);
      setSessionId(startData.sessionId);
    } else {
      console.error("No career guidance data found. Redirecting...");
      console.error("Missing data:", { 
        hasSessionId: !!startData?.sessionId, 
        hasQuestion: !!startData?.question, 
        hasOptions: !!startData?.options 
      });
      navigate("/select");
    }
  }, [location.state, navigate]);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send message (via input or MCQ selection)
  const handleSendMessage = async (selectedAnswer) => {
    const userAnswer = selectedAnswer || selectedOption || input.trim();
    if (!userAnswer || isLoading || !sessionId) return;

    setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);
    setInput("");
    setSelectedOption("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://his-backend-gyjs.onrender.com/api/interviews/evaluate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId, userAnswer }),
        }
      );

      if (!response.ok) throw new Error("Failed to get evaluation.");
      const result = await response.json();

      // Handle the response - check if it's an object or needs parsing
      let questionText = "";
      let questionOptions = [];
      let messageType = "text";

      if (result.nextQuestion) {
        // If nextQuestion is already an object (updated backend)
        if (typeof result.nextQuestion === 'object' && result.nextQuestion.question) {
          questionText = result.nextQuestion.question;
          questionOptions = result.nextQuestion.options || [];
          messageType = "mcq";
        }
        // If nextQuestion is a clean JSON string
        else if (typeof result.nextQuestion === 'string') {
          try {
            // Clean any potential markdown formatting
            let cleanedResponse = result.nextQuestion.trim();
            if (cleanedResponse.startsWith('```json')) {
              cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedResponse.startsWith('```')) {
              cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            const parsedQuestion = JSON.parse(cleanedResponse);
            if (parsedQuestion.question && parsedQuestion.options) {
              questionText = parsedQuestion.question;
              questionOptions = parsedQuestion.options;
              messageType = "mcq";
            } else {
              questionText = result.nextQuestion;
            }
          } catch (error) {
            // If parsing fails, treat as regular text
            questionText = result.nextQuestion;
            console.log("Next question is regular text, not JSON");
          }
        }
      }

      const newBotMessage = {
        sender: "bot",
        text: questionText,
        feedback: result.feedback,
        score: result.score,
        options: questionOptions,
        type: messageType,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error during evaluation:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred. Please try again.", type: "text" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit career guidance session
  const handleSubmitInterview = async () => {
    if (!sessionId) {
      console.error("No session ID to submit.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://his-backend-gyjs.onrender.com/api/interviews/summary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch summary.");
      const summaryData = await response.json();
      navigate("/summary", { state: { summary: summaryData } });
    } catch (error) {
      console.error("Error submitting career guidance session:", error);
      alert("Could not generate the career guidance report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow bg-white p-6 ml-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Career Guidance Session
      </h1>

      <div
        ref={chatContainerRef}
        className="space-y-6 mb-8 max-h-[calc(100vh-250px)] overflow-y-auto pr-4 pb-10"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* User message */}
            {msg.sender === "user" && (
              <div className="p-4 rounded-lg max-w-2xl bg-purple-600 text-white">
                <p className="font-semibold">You:</p>
                <p className="mt-1">{msg.text}</p>
              </div>
            )}

            {/* Bot message */}
            {msg.sender === "bot" && (
              <div className="p-4 rounded-lg max-w-4xl bg-gray-100 text-gray-800">
                <p className="font-semibold">Career Advisor:</p>
                <p className="mt-1 whitespace-pre-wrap text-lg">{msg.text}</p>

                {msg.feedback && (
                  <div className="mt-3 p-3 bg-white/60 rounded-md border border-gray-300">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      Feedback: {msg.feedback}
                    </p>
                    <p className="font-bold text-gray-800 mt-2">
                      Score:{" "}
                      <span className="text-purple-700">{msg.score}/10</span>
                    </p>
                  </div>
                )}

                {msg.options && msg.options.length > 0 && msg.type === "mcq" && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-600 mb-4">
                      Select your answer:
                    </p>
                    <div className="space-y-3">
                      {msg.options.map((option, idx) => (
                        <label 
                          key={idx}
                          className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(e.target.value)}
                            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                            disabled={isLoading}
                          />
                          <span className="text-gray-800 text-left leading-relaxed">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => handleSendMessage(selectedOption)}
                        disabled={!selectedOption || isLoading}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}

                {/* For non-MCQ questions, show clickable options */}
                {msg.options && msg.options.length > 0 && msg.type !== "mcq" && (
                  <div className="flex flex-col mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Choose an option:
                    </p>
                    {msg.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(option)}
                        className="p-3 rounded-md bg-white text-gray-800 border hover:bg-purple-50 hover:border-purple-300 transition-colors text-left"
                        disabled={isLoading}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="p-4 rounded-lg bg-gray-100 text-gray-500">
              Career Advisor is analyzing...
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Only show for text-based questions */}
      <div className="fixed bottom-0 left-20 right-0 bg-white p-6 shadow-top border-t border-gray-200">
        {/* Show text input only if the last message is not an MCQ or if user wants to type custom answer */}
        {(!messages.length || messages[messages.length - 1]?.type !== "mcq" || messages[messages.length - 1]?.sender === "user") && (
          <>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              rows="3"
              placeholder="Or type your own answer here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <div className="flex justify-end mt-4 space-x-3">
              <button
                className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition disabled:bg-purple-300"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
              >
                Send Answer
              </button>
            </div>
          </>
        )}
        
        {/* Always show the Complete Assessment button */}
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition disabled:bg-gray-400"
            onClick={handleSubmitInterview}
            disabled={isLoading}
          >
            Complete Career Assessment
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatPanel;








































// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function ChatPanel() {
//   const [messages, setMessages] = useState([]);
//   const [sessionId, setSessionId] = useState(null);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const chatContainerRef = useRef(null);

//   // Load initial interview data
//   useEffect(() => {
//     const startData = location.state?.interviewData;
//     if (startData && startData.question && startData.sessionId) {
//       setMessages([{ sender: "bot", text: startData.question }]);
//       setSessionId(startData.sessionId);
//     } else {
//       console.error("No interview data found. Redirecting...");
//       navigate("/select");
//     }
//   }, [location.state, navigate]);

//   // Auto scroll
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // Send message (via input or option click)
//   const handleSendMessage = async (selectedOption) => {
//     const userAnswer = selectedOption || input.trim();
//     if (!userAnswer || isLoading || !sessionId) return;

//     setMessages((prev) => [...prev, { sender: "user", text: userAnswer }]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const response = await fetch(
//         "https://his-backend-gyjs.onrender.com/api/interviews/evaluate",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ sessionId, userAnswer }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to get evaluation.");
//       const result = await response.json(); // { feedback, score, nextQuestion, options? }

//       const newBotMessage = {
//         sender: "bot",
//         text: result.nextQuestion,
//         feedback: result.feedback,
//         score: result.score,
//         options: result.options || [],
//       };

//       setMessages((prev) => [...prev, newBotMessage]);
//     } catch (error) {
//       console.error("Error during evaluation:", error);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Sorry, an error occurred. Please try again." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Submit interview
//   const handleSubmitInterview = async () => {
//     if (!sessionId) {
//       console.error("No session ID to submit.");
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         "https://his-backend-gyjs.onrender.com/api/interviews/summary",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ sessionId }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to fetch summary.");
//       const summaryData = await response.json();
//       navigate("/summary", { state: { summary: summaryData } });
//     } catch (error) {
//       console.error("Error submitting interview:", error);
//       alert("Could not generate the summary report. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="flex-grow bg-white p-6 ml-20">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">
//         Interview Room
//       </h1>

//       <div
//         ref={chatContainerRef}
//         className="space-y-6 mb-8 max-h-[calc(100vh-250px)] overflow-y-auto pr-4 pb-10"
//       >
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.sender === "user" ? "justify-end" : "justify-start"
//             }`}
//           >
//             {/* User message */}
//             {msg.sender === "user" && (
//               <div className="p-4 rounded-lg max-w-2xl bg-purple-600 text-white">
//                 <p className="font-semibold">You:</p>
//                 <p className="mt-1">{msg.text}</p>
//               </div>
//             )}

//             {/* Bot message */}
//             {msg.sender === "bot" && (
//               <div className="p-4 rounded-lg max-w-2xl bg-gray-100 text-gray-800">
//                 <p className="font-semibold">AI Interviewer:</p>
//                 <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>

//                 {msg.feedback && (
//                   <div className="mt-3 p-3 bg-white/60 rounded-md border border-gray-300">
//                     <p className="text-sm text-gray-700 whitespace-pre-wrap">
//                       Feedback: {msg.feedback}
//                     </p>
//                     <p className="font-bold text-gray-800 mt-2">
//                       Score:{" "}
//                       <span className="text-purple-700">{msg.score}/10</span>
//                     </p>
//                   </div>
//                 )}

//                 {msg.options && msg.options.length > 0 && (
//                   <div className="flex flex-col mt-4 space-y-2">
//                     {msg.options.map((option, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleSendMessage(option)}
//                         className="p-3 rounded-md bg-white text-gray-800 border hover:bg-gray-200"
//                       >
//                         {option}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}

//         {isLoading && (
//           <div className="flex justify-start">
//             <div className="p-4 rounded-lg bg-gray-100 text-gray-500">
//               AI Interviewer is typing...
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input Area */}
//       <div className="fixed bottom-0 left-20 right-0 bg-white p-6 shadow-top border-t border-gray-200">
//         <textarea
//           className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
//           rows="3"
//           placeholder="Type your answer here..."
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               handleSendMessage();
//             }
//           }}
//           disabled={isLoading}
//         />
//         <div className="flex justify-end mt-4 space-x-3">
//           <button
//             className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition disabled:bg-purple-300"
//             onClick={() => handleSendMessage()}
//             disabled={isLoading || !input.trim()}
//           >
//             Send Answer
//           </button>
//           <button
//             className="px-6 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition disabled:bg-gray-400"
//             onClick={handleSubmitInterview}
//             disabled={isLoading}
//           >
//             End & Submit Interview
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default ChatPanel;











































// // import React, { useState,useEffect,useRef   } from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';

// // function ChatPanel() {
// //   const [messages, setMessages] = useState([]);
// //   const [sessionId, setSessionId] = useState(null);
// //   const [input, setInput] = useState('');
// //   // const [feedback, setFeedback] = useState('');
// //   // const [score, setScore] = useState('');

// //   const [isLoading, setIsLoading] = useState(false);

// //    const location = useLocation();
// //   const navigate = useNavigate();
// //  const chatContainerRef = useRef(null);




// //    useEffect(() => {
// //     // Access the data from location.state
// //     const startData = location.state?.interviewData;

// //     // Check if the data exists
// //     if (startData && startData.question && startData.sessionId) {
// //       // Set the first message and store the session ID
// //       setMessages([{ sender: 'bot', text: startData.question }]);
// //       setSessionId(startData.sessionId);
// //     } else {
// //       // If a user lands here directly, they won't have the data.
// //       // It's good practice to redirect them back.
// //       console.error("No interview data found. Redirecting...");
// //       navigate('/select'); 
// //     }
// //     // The dependency array ensures this runs only once on mount
// //   }, [location.state, navigate]);

// //  // Auto-scroll to the latest message
// //   useEffect(() => {
// //     if (chatContainerRef.current) {
// //       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
// //     }
// //   }, [messages]);

// //   // const handleSendMessage = () => {
// //   //   if (input.trim() !== '') {
// //   //     setMessages([...messages, { sender: 'user', text: input.trim() }]);
// //   //     setInput('');
// //   //     // In a real application, you would send this message to the bot and get a response.
// //   //     // For this example, we'll just add a placeholder bot response.
// //   //     setTimeout(() => {
// //   //       setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Thank you for that detailed answer. How do you handle conflict within your team?' }]);
// //   //     }, 1000);
// //   //   }
// //   // };

// // const handleSendMessage = async (selectedOption) => {
// //     if (input.trim() === '' || isLoading || !sessionId) return;

// //     const userAnswer = selectedOption;
// //     // const userAnswer = input.trim();
// //     setMessages(prev => [...prev, { sender: 'user', text: userAnswer }]);
// //     setInput('');
// //     setIsLoading(true);

// //     try {
// //       const response = await fetch('https://his-backend-gyjs.onrender.com/api/interviews/evaluate', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         credentials: 'include',
// //         body: JSON.stringify({ sessionId, userAnswer }),
// //       });

// //       if (!response.ok) throw new Error('Failed to get the evaluation.');

// //       const result = await response.json(); // Gets { feedback, score, nextQuestion }

// //       // Create a new bot message object that includes feedback and score
// //       const newBotMessage = {
// //         sender: 'bot',
// //         text: result.nextQuestion,
// //         feedback: result.feedback,
// //         score: result.score
// //       };
      
// //       // Add this comprehensive message object to the state
// //       setMessages(prev => [...prev, newBotMessage]);

// //     } catch (error) {
// //       console.error("Error during evaluation:", error);
// //       setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, an error occurred. Please try again.' }]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
  

// //   // const handleSubmitInterview = () => {
// //   //   // Redirect to the evaluation page
// //   //   // navigate('/evaluation');
// //   //   navigate('/summary');
// //   // };

// //     // In ChatPanel.jsx

// // // ... inside your ChatPanel component

// //   const handleSubmitInterview = async () => {
// //     // Guard clause to ensure we have a session ID
// //     if (!sessionId) {
// //         console.error("No session ID to submit.");
// //         return; 
// //     }
    
// //     setIsLoading(true);

// //     try {
// //         // Call the summary API endpoint with the current session ID
// //         const response = await fetch('https://his-backend-gyjs.onrender.com/api/interviews/summary', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             credentials: 'include', // Important for sending auth cookies
// //             body: JSON.stringify({ sessionId: sessionId }),
// //         });

// //         if (!response.ok) {
// //             throw new Error('Failed to fetch the summary report.');
// //         }

// //         // Get the summary data from the response
// //         const summaryData = await response.json();
        
// //         // **KEY STEP:** Navigate to the summary page and pass the API response in the state
// //         navigate('/summary', { state: { summary: summaryData } });

// //     } catch (error) {
// //         console.error("Error submitting interview:", error);
// //         // Optionally, show an error to the user if the API call fails
// //         alert("Could not generate the summary report. Please try again.");
// //     } finally {
// //         setIsLoading(false);
// //     }
// //   };

// // // ... rest of your component




// // //     const handleSubmitReply =  async (e) => {
// // //   e.preventDefault();

// // //   try {
// // //     const response = await fetch("https://backend-for-interview-prep.onrender.com/api/interviews/evaluate", {
// // //       method: "POST",
// // //       headers: {
// // //     "Content-Type": "application/json",
// // //   },
// // //   credentials: "include",
// // //       body: JSON.stringify({ "sessionId": sessionId,
    
// // //      "userAnswer": input
// // //       })
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error("Login failed");
// // //     }
// // // const interviewData = await response.json();
// // //       //  console.log("Server response:", data);

// // //     // Example: Save token to localStorage
// // //     // localStorage.setItem("token", data.token);
// // // console.log("Selected Data:", formData);
// // // setFeedback([{ sender: 'bot', text: interviewData.feedback }]);
// // // setScore([{ sender: 'bot', text: interviewData.score }]);
// // // setMessages([{ sender: 'bot', text: interviewData.nextQuestion }]);
// // //       // **THE KEY STEP:** Pass the fetched data in `state`
      
// // //     // const data = await response.json();
   
    
// // //     // navigate("/interview", { state: formData });
// // //   } catch (error) {
// // //     console.error("Error starting interview:", error);
// // //   }
// // // };

// //     // Redirect to the evaluation page


// //     // navigate('/evaluation')

// //   return (
// //     // ml-20 gives space for the fixed sidebar
// //     // <main className="flex-grow bg-white p-6 ml-20"> 
// //     //   <h1 className="text-3xl font-bold text-gray-800 mb-8">Interview Room</h1>

// //     //   {/* Chat Messages */}
// //     //   <div className="space-y-6 mb-8 max-h-[calc(100vh-250px)] overflow-y-auto pr-4">
// //     //     {messages.map((msg, index) => (
// //     //       <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
// //     //         <div className={`p-4 rounded-lg max-w-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
// //     //           <p className="font-semibold">{msg.sender === 'user' ? 'You:' : 'AI Interviewer:'}</p>
// //     //           <p className="mt-1">{msg.text}</p>
// //     //         </div>
// //     //       </div>
// //     //     ))}
// //     //   </div>
      

// //     //   {/* Input Area */}
// //     //   <div className="fixed bottom-0 left-20 right-0 bg-white p-6 shadow-top border-t border-gray-200">
// //     //     <textarea
// //     //       className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
// //     //       rows="3"
// //     //       placeholder="Type your answer here..."
// //     //       value={input}
// //     //       onChange={(e) => setInput(e.target.value)}
// //     //       onKeyDown={(e) => {
// //     //         if (e.key === 'Enter' && !e.shiftKey) {
// //     //           e.preventDefault();
// //     //           handleSendMessage();
// //     //         }
// //     //       }}
// //     //     ></textarea>
// //     //     <div className="flex justify-end mt-4 space-x-3">
// //     //       <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition"
// //     //       onClick={handleSubmitReply}
// //     //       >
// //     //         reply
// //     //       </button>
// //     //       <button 
// //     //         className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
// //     //         onClick={handleSubmitInterview} // Changed from 'Submit' to this button
// //     //       >
// //     //         Submit Interview
// //     //       </button>
// //     //     </div>
// //     //   </div>
// //     // </main>




// //     <main className="flex-grow bg-white p-6 ml-20">
// //       <h1 className="text-3xl font-bold text-gray-800 mb-8">Interview Room</h1>
      
// //       <div ref={chatContainerRef} className="space-y-6 mb-8 max-h-[calc(100vh-250px)] overflow-y-auto pr-4 pb-10">
// //         {messages.map((msg, index) => (
// //           <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}pb-9`}>
// //             <div className={`p-9 rounded-lg max-w-2xl w-full ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
             

// //               {/* --- 2. MODIFICATION: Conditionally render feedback and score --- */}
// //               {/* {msg.sender === 'bot' && msg.feedback && ( */}
// //               {msg.sender === 'bot'  && (
// //                 <div className="mt-3 p-3 bg-white/60 rounded-md border border-gray-300">
// //                   <h4 className="font-bold text-gray-800">Career Bot:</h4>
// //                   <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{msg.question}</p>
// //                   {/* <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{msg.feedback}</p> */}
// //                   {/* <p className="font-bold text-gray-800 mt-3">
// //                     Score:  */}
// //                     {/* <span className="text-purple-700 text-lg"> {msg.score} / 10</span> */}

// //                   {/* </p> */}
// //                   <div className="flex flex-col mt-4 space-y-2">
// //             {msg.options.map((option, idx) => (
// //               <button
// //                 key={idx}
// //                 onClick={() => handleSendMessage(option)} // Pass the selected option
// //                 className="p-3 rounded-md bg-white text-gray-800 border hover:bg-gray-200"
// //               >
// //                 {option}
// //               </button>
// //             ))}
// //           </div>
// //                 </div>
// //               )}

// //               {/* Add a separator if feedback was given */}
// //               {/* {msg.feedback && <hr className="my-3 border-gray-300" />} */}

// //               {/* The next question or initial message */}
// //               {/* <p className="mt-1 whitespace-pre-wrap">Question: </p> */}
// //                {/* <p className="font-bold">{msg.sender === 'user' ? 'You:' : 'AI Interviewer Question:'}</p>
// //               <p className="mt-1 whitespace-pre-wrap">{msg.text}</p>
// //             </div>
// //           </div>
// //         ))} */}
// //          {/* Display user's answer */}
// //       {msg.sender === 'user' && (
// //         <div className="p-4 rounded-lg bg-purple-600 text-white">
// //           <p className="font-semibold">You:</p>
// //           <p className="mt-1">{msg.text}</p>
// //         </div>
// //       )}
// //     </div>
// //   ))}
// // </div>
// //         {/* {isLoading && <div className="flex justify-start"><div className="p-4 rounded-lg bg-gray-100 text-gray-500">AI Interviewer is typing...</div></div>} */}
// //       </div>

// //       {/* Input Area (remains the same) */}
// //       <div className="fixed bottom-0 left-20 right-0 bg-white p-6 shadow-top border-t border-gray-200">
// //         <textarea
// //           className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
// //           rows="3"
// //           placeholder="Type your answer here..."
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyDown={(e) => {
// //             if (e.key === 'Enter' && !e.shiftKey) {
// //               e.preventDefault();
// //               handleSendMessage();
// //             }
// //           }}
// //           disabled={isLoading}
// //         />
// //         <div className="flex justify-end mt-4 space-x-3">
// //           <button 
// //             className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition disabled:bg-purple-300"
// //             onClick={handleSendMessage}
// //             disabled={isLoading || !input.trim()}
// //           >
// //             Send Answer
// //           </button>
// //           <button 
// //             className="px-6 py-2 bg-gray-600 text-white rounded-full font-semibold hover:bg-gray-700 transition disabled:bg-gray-400"
// //             onClick={handleSubmitInterview}
// //             disabled={isLoading}
// //           >
// //             End & Submit Interview
// //           </button>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// // export default ChatPanel;















