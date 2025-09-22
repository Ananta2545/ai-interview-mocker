"use client"
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';

const StartInterview = ({params}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [interviewData, setInterviewData] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        const fetchInterview = async () => {
          try {
            const resolvedParams = await params;
            const mockId = resolvedParams.interviewId;
            const res = await fetch(`/api/interview/${mockId}`);
            const data = await res.json();
            // console.log(data);

            const jsonMockResp = data.interview[0].jsonMockResp;
            console.log(jsonMockResp)
            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(data.interview[0]);
            
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        fetchInterview();
      }, [params]);

  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Questions */}
            <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

            {/* Video/ audio recording */}
            <RecordAnswerSection/>
        </div>
    </div>
  )
}

export default StartInterview