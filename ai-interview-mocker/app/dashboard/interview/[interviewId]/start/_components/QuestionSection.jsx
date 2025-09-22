import { Lightbulb } from 'lucide-react';
import React from 'react';

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
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

      <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-700'>
            <Lightbulb/>
            <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-blue-700 my-2'>Click on Record Answer when you want to answer the question. At the end of the interview we will give you the feedback along with correct answer for each of Question and your answer to compare it.</h2>
      </div>
    </div>
  );
};

export default QuestionSection;
