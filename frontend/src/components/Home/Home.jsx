import React, { useState } from 'react'; 
import { Link } from "react-router-dom";

function Home() {
  // This function handles the smooth scrolling logic.
  const handleScrollToLogin = (event) => {
    event.preventDefault();
    const loginSection = document.getElementById('login');
    if (loginSection) {
      loginSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 font-inter antialiased">
        {/* Hero Section */}
        <header className="text-center py-16 px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Make Smart Career Choices with <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">EduGuideX</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Your personalized AI career advisor that helps you choose the right stream, find perfect degree courses, and discover career paths tailored to your interests and strengths.
            </p>
           
            <div className="mt-8 flex justify-center">
                <a onClick={handleScrollToLogin} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 cursor-pointer">
                    Start Your Career Journey
                </a>
            </div>
        </header>

        {/* Features and Advantages Section */}
        <section className="w-full max-w-6xl mx-auto py-12 px-4">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">Why Choose EduGuideX?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
                {/* Card 1: Personalized Career Guidance */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2.683 2.871A.993.993 0 0010 11.999v.001A1 1 0 019 13a1 1 0 11-2 0 3 3 0 003-3V7.5a1 1 0 011-1h.5a1 1 0 110 2H10a1 1 0 000-2z" clipRule="evenodd"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Career Guidance</h3>
                    <p className="text-gray-600">Take aptitude tests to discover your strengths and interests. Get AI-powered recommendations for streams, courses, and career paths perfectly matched to your profile.</p>
                </div>

                {/* Card 2: Course-to-Career Mapping */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Course-to-Career Mapping</h3>
                    <p className="text-gray-600">Explore detailed visual charts showing what each degree offers, from B.A. to B.Tech, including job prospects, government exams, and higher education opportunities.</p>
                </div>

                {/* Card 3: Government College Directory */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 11-2 0 1 1 0 012 0zm10.5-8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"></path></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nearby Government Colleges</h3>
                    <p className="text-gray-600">Find government colleges near you with complete details on available programs, cut-offs, facilities, and admission requirements. Quality education at affordable costs.</p>
                </div>

            </div>
        </section>

        {/* Real-World Uses Section */}
        <section className="w-full max-w-6xl mx-auto py-12 px-4">
            <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">How EduGuideX Transforms Your Future</h2>
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Uses: Stream Selection After 10th/12th */}
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM9.002 11a5.002 5.002 0 011.996 0A.999.999 0 0012 10a1 1 0 012 0c.002 1.348-.124 2.65-.63 3.868A7.001 7.001 0 0010 15a7.001 7.001 0 00-3.37-1.132A6.999 6.999 0 005.002 10a1 1 0 012 0c0 .64.103 1.258.293 1.838A5.002 5.002 0 019.002 11z"></path></svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Smart Stream Selection</h3>
                        <p className="text-gray-600 text-sm mt-1">Choose between Arts, Science, Commerce, or Vocational streams based on your aptitude and career goals, not just peer pressure.</p>
                    </div>
                </div>

                {/* Uses: Degree Course Guidance */}
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path></svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Degree Course Clarity</h3>
                        <p className="text-gray-600 text-sm mt-1">Understand what B.A., B.Sc., B.Com, BBA, and other degrees actually offer in terms of career opportunities and earning potential.</p>
                    </div>
                </div>

                {/* Uses: Timeline & Scholarship Tracking */}
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Never Miss Deadlines</h3>
                        <p className="text-gray-600 text-sm mt-1">Get timely notifications for admission dates, scholarship applications, entrance tests, and counseling schedules to secure your future.</p>
                    </div>
                </div>
               
            </div>
        </section>

        {/* New User / Login Box */}
        <section id="login" className="w-full max-w-lg mx-auto py-12 px-4 text-center">
            <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8 rounded-3xl shadow-xl text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Shape Your Future?</h2>
                <p className="mb-6 text-purple-200">Join thousands of students making informed career decisions with personalized guidance.</p>
                <div className="flex justify-center space-x-4">
                    <Link
  to="/login"
  className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
>
  Log In
</Link>
 <Link
  to="/signup"
  className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-full border border-white hover:bg-purple-400 transition duration-300"
>
  Sign Up
</Link>
                </div>
            </div>
        </section>
    </div>
  );
}

export default Home;
















































// import React, { useState } from 'react'; 
// import { Link } from "react-router-dom";

// function Home() {
//   // Smooth scroll to login/signup section
//   const handleScrollToLogin = (event) => {
//     event.preventDefault();
//     const loginSection = document.getElementById('login');
//     if (loginSection) {
//       loginSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 font-inter antialiased">
//         {/* Hero Section */}
//         <header className="text-center py-16 px-4 max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//                 Your <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">One-Stop Career & Education Advisor</span>
//             </h1>
//             <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//                 Helping students make informed academic and career choices through personalized guidance, course-to-career mapping, and local college discovery.
//             </p>
           
//             <div className="mt-8 flex justify-center">
//                 <a onClick={handleScrollToLogin} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 cursor-pointer">
//                     Get Started Now
//                 </a>
//             </div>
//         </header>

//         {/* Features and Advantages Section */}
//         <section className="w-full max-w-6xl mx-auto py-12 px-4">
//             <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">Why Choose This Platform?</h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
//                 {/* Card 1: Aptitude Based Suggestions */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M18 13V7a1 1 0 00-1-1h-5V4a3 3 0 10-6 0v2H3a1 1 0 00-1 1v6h16z" /></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Guidance</h3>
//                     <p className="text-gray-600">Take short quizzes to identify your strengths and interests. Get tailored recommendations on suitable streams and courses (Arts, Science, Commerce, Vocational).</p>
//                 </div>

//                 {/* Card 2: Course to Career Mapping */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h14v2H3V3zm0 6h14v2H3V9zm0 6h14v2H3v-2z" /></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Course-to-Career Mapping</h3>
//                     <p className="text-gray-600">Understand where each degree can take you. Explore career paths, higher studies, exams, and jobs linked to your chosen subject stream.</p>
//                 </div>

//                 {/* Card 3: Local Colleges Directory */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5" /></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Nearby Colleges</h3>
//                     <p className="text-gray-600">Discover government colleges near you, available courses, cut-offs, eligibility, facilities, and admission updates.</p>
//                 </div>

//             </div>
//         </section>

//         {/* Real-World Uses Section */}
//         <section className="w-full max-w-6xl mx-auto py-12 px-4">
//             <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">How This Platform Helps</h2>
//             <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//                 {/* Uses: Stream Selection */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16z" /></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Choosing Streams</h3>
//                         <p className="text-gray-600 text-sm mt-1">Clear confusion after Class 10 or 12 by matching your aptitude with the right subject stream.</p>
//                     </div>
//                 </div>

//                 {/* Uses: Future Roadmap */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3h10v14H5z" /></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Career Roadmap</h3>
//                         <p className="text-gray-600 text-sm mt-1">Visualize what jobs, exams, or higher studies await after choosing a specific degree course.</p>
//                     </div>
//                 </div>

//                 {/* Uses: Confidence in Decision */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4-1.5-1.5L11 11l-1-1-1 1z" /></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Confidence in Choices</h3>
//                         <p className="text-gray-600 text-sm mt-1">Reduce confusion and make informed academic decisions that align with long-term goals.</p>
//                     </div>
//                 </div>
               
//             </div>
//         </section>

//         {/* New User / Login Box */}
//         <section id="login" className="w-full max-w-lg mx-auto py-12 px-4 text-center">
//             <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8 rounded-3xl shadow-xl text-white">
//                 <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Begin?</h2>
//                 <p className="mb-6 text-purple-200">Join thousands of students shaping their future with personalized career and education guidance.</p>
//                 <div className="flex justify-center space-x-4">
//                     <Link
//   to="/login"
//   className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
// >
//   Log In
// </Link>
//  <Link
//   to="/signup"
//   className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-full border border-white hover:bg-purple-400 transition duration-300"
// >
//   Sign Up
// </Link>
//                 </div>
//             </div>
//         </section>
//     </div>
//   );
// }

// export default Home;






























// import React, { useState } from 'react';
// import { Link } from "react-router-dom";

// function Home() {
//   // This function handles the smooth scrolling logic.
//   const handleScrollToLogin = (event) => {
//     event.preventDefault();
//     const loginSection = document.getElementById('login');
//     if (loginSection) {
//       loginSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 font-inter antialiased">
//         {/* Hero Section */}
//         <header className="text-center py-16 px-4 max-w-4xl mx-auto">
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
//                 Ace Your Next Interview with <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">IntervuX</span>
//             </h1>
//             <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//                 Intervuix is your personal AI chat coach, designed to help you prepare for any interview scenario with personalized mock interviews and instant feedback.
//             </p>
           
//             <div className="mt-8 flex justify-center">
//                 <a onClick={handleScrollToLogin} className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transition duration-300 transform hover:scale-105 cursor-pointer">
//                     Get Started Now
//                 </a>
//             </div>
//         </header>

//         {/* Features and Advantages Section */}
//         <section className="w-full max-w-6xl mx-auto py-12 px-4">
//             <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">Why Choose IntervuX?</h2>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
//                 {/* Card 1: Personalized Feedback */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2.683 2.871A.993.993 0 0010 11.999v.001A1 1 0 019 13a1 1 0 11-2 0 3 3 0 003-3V7.5a1 1 0 011-1h.5a1 1 0 110 2H10a1 1 0 000-2z" clipRule="evenodd"></path></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Feedback</h3>
//                     <p className="text-gray-600">Receive detailed analysis of your answers, including clarity, confidence, and areas for improvement. Every session is tailored to you.</p>
//                 </div>

//                 {/* Card 2: Realistic Mock Interviews */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Realistic Mock Interviews</h3>
//                     <p className="text-gray-600">Simulate real-world interview conditions with our AI that adapts its questions and tone to your industry and role.</p>
//                 </div>

//                 {/* Card 3: Anytime, Anywhere Practice */}
//                 <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center transition-transform transform hover:scale-105">
//                     <div className="w-16 h-16 flex items-center justify-center bg-purple-100 rounded-full mb-4">
//                         <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 11-2 0 1 1 0 012 0zm10.5-8a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"></path></svg>
//                     </div>
//                     <h3 className="text-xl font-semibold text-gray-800 mb-2">Anytime, Anywhere Practice</h3>
//                     <p className="text-gray-600">Prepare at your own pace, on your own schedule. Intervuix is available 24/7, so you can practice whenever you're ready.</p>
//                 </div>

//             </div>
//         </section>

//         {/* Real-World Uses Section */}
//         <section className="w-full max-w-6xl mx-auto py-12 px-4">
//             <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-12">How It Helps in a Real Interview</h2>
//             <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-gray-100 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//                 {/* Uses: Behavioral Questions */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM9.002 11a5.002 5.002 0 011.996 0A.999.999 0 0012 10a1 1 0 012 0c.002 1.348-.124 2.65-.63 3.868A7.001 7.001 0 0010 15a7.001 7.001 0 00-3.37-1.132A6.999 6.999 0 005.002 10a1 1 0 012 0c0 .64.103 1.258.293 1.838A5.002 5.002 0 019.002 11z"></path></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Behavioral Questions</h3>
//                         <p className="text-gray-600 text-sm mt-1">Practice the STAR method to structure your answers and showcase your skills effectively.</p>
//                     </div>
//                 </div>

//                 {/* Uses: Technical Questions */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Technical Questions</h3>
//                         <p className="text-gray-600 text-sm mt-1">Get comfortable explaining your thought process for problem-solving in a structured way.</p>
//                     </div>
//                 </div>

//                 {/* Uses: General Confidence */}
//                 <div className="flex items-start space-x-4">
//                     <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full flex-shrink-0">
//                         <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
//                     </div>
//                     <div>
//                         <h3 className="font-semibold text-gray-800">Boosted Confidence</h3>
//                         <p className="text-gray-600 text-sm mt-1">Practice and refine your answers to reduce anxiety and walk into your interview feeling prepared and confident.</p>
//                     </div>
//                 </div>
               
//             </div>
//         </section>

//         {/* New User / Login Box */}
//         <section id="login" className="w-full max-w-lg mx-auto py-12 px-4 text-center">
//             <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-8 rounded-3xl shadow-xl text-white">
//                 <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Start?</h2>
//                 <p className="mb-6 text-purple-200">Join thousands of others improving their interview skills today.</p>
//                 <div className="flex justify-center space-x-4">
//                     <Link
//   to="/login"
//   className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
// >
//   Log In
// </Link>
//  <Link
//   to="/signup"
//   className="bg-purple-500 text-white font-semibold py-3 px-6 rounded-full border border-white hover:bg-purple-400 transition duration-300"
// >
//   Sign Up
// </Link>
//                 </div>
//             </div>
//         </section>
//     </div>
//   );
// }

// export default Home;
