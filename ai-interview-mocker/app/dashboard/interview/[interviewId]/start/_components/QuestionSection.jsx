import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {

  const textToSpeech = (text)=>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    }
    else{
      toast.error("Sorry your browser doesn't support this text to speech");
      alert("Error");
    }
  }

  return mockInterviewQuestion&&(
    <div className="p-5 mt-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`
                p-3 md:p-4 
                rounded-full 
                text-xs md:text-sm 
                text-center 
                cursor-pointer 
                transition-all duration-300 ease-in-out 
                border-2
                hover:scale-105 hover:shadow-xl
                ${activeQuestionIndex === index 
                  ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-lg border-blue-600 dark:border-blue-500' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'}
              `}
            >
              Question {index + 1}
            </h2>
          ))}
      </div>
      <h2 className='my-5 text-md md:text-lg text-gray-900 dark:text-white font-medium transition-colors duration-300'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

      <Volume2 className='cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-110 transition-all duration-300' onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>

      <div className='border-2 border-blue-200 dark:border-blue-800 rounded-lg p-5 bg-blue-50 dark:bg-blue-950 mt-20 shadow-inner dark:shadow-2xl transition-all duration-300'>
        <h2 className='flex gap-2 items-center text-blue-700 dark:text-blue-300 font-semibold transition-colors duration-300'>
            <Lightbulb className='w-5 h-5'/>
            <strong>Note:</strong>
        </h2>
        <div className='text-sm text-blue-700 dark:text-blue-200 my-2 space-y-1 transition-colors duration-300'>
          <p>Click <strong className='font-bold text-blue-800 dark:text-blue-100'>"Record Answer"</strong> to respond to the question.</p>
          <p>Your answer will be saved automatically.</p>
          <p>After completing the interview, you'll receive detailed feedback comparing your answers with the correct ones.</p>
          <p><strong className='font-bold text-blue-800 dark:text-blue-100'>Don't refresh the page.</strong> It will take you to the result page.</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
