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
    const [allowFullscreenExit, setAllowFullscreenExit] = useState(false); // Flag to allow legitimate exits

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
          // 3. It's not when completing all questions (allowFullscreenExit is true)
          if (wasInFullscreen && !isInFullscreen && !isInitialLoad && !allowFullscreenExit) {
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
      }, [fullscreenExitCount, router, allowFullscreenExit]);

      const handleReEnterFullscreen = () => {
        document.documentElement.requestFullscreen().then(() => {
          setShowFullscreenWarning(false);
          toast.success("Fullscreen mode restored!");
        }).catch((err) => {
          console.error("Error entering fullscreen:", err);
          toast.error("Please click the fullscreen button to continue.");
        });
      };
      
        if (loading) return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Loading interview...</p>
            </div>
          </div>
        );
        
        if (error) return (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <p className="text-red-600 dark:text-red-400 font-semibold text-lg transition-colors duration-300">{error}</p>
            </div>
          </div>
        );

      const handleNextQuestion = ()=>{
        setActiveQuestionIndex((prevIndex)=>{
            if(prevIndex < mockInterviewQuestion.length - 1){
                return prevIndex + 1;
            }else{
                // Allow fullscreen exit for completion
                setAllowFullscreenExit(true);
                
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
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="loader mb-4"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
              Evaluating your answers...
            </p>
          </div>
        );
      }


  return (
    <div className='p-6 md:p-10 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300'>
        {/* Fullscreen Warning Modal */}
        {showFullscreenWarning && (
          <div className="fixed inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border-4 border-red-500 dark:border-red-600 animate-pulse transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <div className="bg-red-500 dark:bg-red-600 p-4 rounded-full mb-4 transition-colors duration-300">
                  <Maximize className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  ⚠️ Fullscreen Mode Required!
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                  You have exited fullscreen mode <span className="font-bold text-red-600 dark:text-red-400">{fullscreenExitCount} time(s)</span>.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
                  For security and proctoring purposes, you must remain in fullscreen mode during the interview.
                </p>
                <Button
                  onClick={handleReEnterFullscreen}
                  className="bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-600 dark:to-orange-600 hover:from-red-600 hover:to-orange-600 dark:hover:from-red-700 dark:hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Maximize className="w-5 h-5 mr-2" />
                  Re-Enter Fullscreen Now
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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