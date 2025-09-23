"use client"
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const StartInterview = ({params}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [interviewData, setInterviewData] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [evaluating, setEvaluating] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchInterview = async () => {
          try {
            const resolvedParams = await params;
            const mockId = resolvedParams.interviewId;
            const res = await fetch(`/api/interview/${mockId}`);
            const data = await res.json();
            // console.log(data);

            const jsonMockResp = data.interview[0].jsonMockResp;
            console.log(data)
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
        if (loading) return <p>Loading...</p>;
        if (error) return <p className="text-red-600">{error}</p>;

      const handleNextQuestion = ()=>{
        setActiveQuestionIndex((prevIndex)=>{
            if(prevIndex < mockInterviewQuestion.length - 1){
                return prevIndex + 1;
            }else{
                toast.success("You completed all the questions");
                setEvaluating(true);
                setTimeout(() => {
                  router.push(`/dashboard/interview/${interviewData?.id}/feedback`);
                }, 2000); 
                return prevIndex;
            }
        })
      }

      if (evaluating) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="loader mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Evaluating your answers...
            </p>
          </div>
        );
      }


  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Questions */}
            <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

            {/* Video/ audio recording */}
            <RecordAnswerSection interviewId={interviewData?.id} onNextQuestion={handleNextQuestion} userId={interviewData?.userId} activeQuestionIndex={activeQuestionIndex}/>
        </div>
    </div>
  )
}

export default StartInterview