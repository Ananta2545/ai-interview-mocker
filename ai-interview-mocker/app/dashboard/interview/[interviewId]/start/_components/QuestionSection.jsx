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
    <div className="p-5 mt-5 border rounded-xl bg-gray-50 shadow-sm">
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
                transition-all duration-200 ease-in-out 
                border border-gray-300
                hover:border-blue-500 hover:shadow-lg
                ${activeQuestionIndex === index ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-800'}
              `}
            >
              Question {index + 1}
            </h2>
          ))}
      </div>
      <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

      <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>

      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-700'>
            <Lightbulb/>
            <strong>Note:</strong>
        </h2>
        <div className='text-sm text-blue-700 my-2 space-y-1'>
          <p>Click <strong>"Record Answer"</strong> to respond to the question.</p>
          <p>Your answer will be saved automatically.</p>
          <p>After completing the interview, you'll receive detailed feedback comparing your answers with the correct ones.</p>
          <p><strong>Don't refresh the page.</strong> It will take you to the result page.</p>
        </div>
      </div>
    </div>
  );
};

export default QuestionSection;
