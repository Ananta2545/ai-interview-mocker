"use client"
import React, { useEffect, useState } from 'react'
import QuestionSection from './_components/QuestionSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {Button} from '../../../../../components/ui/button'
import { Maximize } from 'lucide-react';

const StartInterview = ({params}) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState()
    const [interviewData, setInterviewData] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [evaluating, setEvaluating] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [fullscreenExitCount, setFullscreenExitCount] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const fetchInterview = async () => {
          try {
            const resolvedParams = await params;
            const mockId = resolvedParams.interviewId;
            const res = await fetch(`/api/interview/${mockId}`);
            const data = await res.json();

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

      // Fullscreen enforcement - show warning modal instead of automatic request
      useEffect(() => {
        let wasInFullscreen = !!document.fullscreenElement;
        let isInitialLoad = true; // Flag to prevent warning on first load
        
        // Small delay to mark initial load complete
        const timer = setTimeout(() => {
          isInitialLoad = false;
        }, 1000);
        
        const handleFullscreenChange = () => {
          const isInFullscreen = !!document.fullscreenElement;
          
          // Only show warning if:
          // 1. They were in fullscreen and then exited
          // 2. It's not the initial page load
          if (wasInFullscreen && !isInFullscreen && !isInitialLoad) {
            const newCount = fullscreenExitCount + 1;
            setFullscreenExitCount(newCount);
            
            // Check if they've exited 3 times
            if (newCount >= 3) {
              toast.error("⚠️ You exited fullscreen 3 times. Redirecting to dashboard for security reasons.", {
                duration: 4000
              });
              // Redirect to dashboard after 2 seconds
              setTimeout(() => {
                router.push('/dashboard');
              }, 2000);
            } else {
              setShowFullscreenWarning(true);
              toast.error(`⚠️ Warning ${newCount}/3: You exited fullscreen mode! Please re-enter to continue.`);
            }
          }
          
          wasInFullscreen = isInFullscreen;
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
          clearTimeout(timer);
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
      }, [fullscreenExitCount, router]);

      const handleReEnterFullscreen = () => {
        document.documentElement.requestFullscreen().then(() => {
          setShowFullscreenWarning(false);
          toast.success("Fullscreen mode restored!");
        }).catch((err) => {
          console.error("Error entering fullscreen:", err);
          toast.error("Please click the fullscreen button to continue.");
        });
      };
      
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
    <div className='p-10'>
        {/* Fullscreen Warning Modal */}
        {showFullscreenWarning && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-4 border-red-500 animate-pulse">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500 p-4 rounded-full mb-4">
                  <Maximize className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  ⚠️ Fullscreen Mode Required!
                </h2>
                <p className="text-gray-700 mb-2">
                  You have exited fullscreen mode <span className="font-bold text-red-600">{fullscreenExitCount} time(s)</span>.
                </p>
                <p className="text-gray-600 mb-6">
                  For security and proctoring purposes, you must remain in fullscreen mode during the interview.
                </p>
                <Button
                  onClick={handleReEnterFullscreen}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Maximize className="w-5 h-5 mr-2" />
                  Re-Enter Fullscreen Now
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2'>
            {/* Questions */}
            <QuestionSection mockInterviewQuestion={mockInterviewQuestion} activeQuestionIndex={activeQuestionIndex}/>

            {/* Video/ audio recording */}
            <RecordAnswerSection 
              interviewId={interviewData?.id} 
              onNextQuestion={handleNextQuestion} 
              userId={interviewData?.userId} 
              activeQuestionIndex={activeQuestionIndex}
            />
        </div>
    </div>
  )
}

export default StartInterview