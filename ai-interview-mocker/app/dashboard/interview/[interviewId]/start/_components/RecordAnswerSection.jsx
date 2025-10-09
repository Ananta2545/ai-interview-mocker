"use client";
import { Button } from "../../../../../../components/ui/button.jsx";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import toast from "react-hot-toast";
import { Mic, Maximize, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

const RecordAnswerSection = ({ interviewId, onNextQuestion, userId, activeQuestionIndex }) => {
  const [saving, setSaving] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [time, setTime] = useState(50);
  const timerRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [fullScreenWarnings, setFullScreenWarnings] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenCheckIntervalRef = useRef(null);
  const speakingTimeoutRef = useRef(null);
  const router = useRouter();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Loading messages for better UX
  const loadingMessages = [
    "📝 Submitting your answer...",
    "🤖 AI is processing your response...",
    "✨ Analyzing your answer...",
    "🔍 Checking grammar and clarity...",
    "💡 Almost done...",
  ];

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="text-red-600 dark:text-red-400 font-semibold text-lg transition-colors duration-300">
        ❌ Your browser does not support speech recognition.
      </span>
    );
  }

  // Full screen monitoring - only check during active recording
  useEffect(() => {
    const checkFullScreen = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullScreen(isCurrentlyFullScreen);
      
      // If not in fullscreen and interview is running (listening), show warning
      if (!isCurrentlyFullScreen && isListening) {
        setFullScreenWarnings(prev => {
          const newCount = prev + 1;
          
          if (newCount >= 3) {
            toast.error("You've exited fullscreen 3 times. Redirecting to dashboard for security reasons.", {
              duration: 5000
            });
            // Stop recording manually instead of calling handleStop
            SpeechRecognition.stopListening();
            clearInterval(timerRef.current);
            setIsListening(false);
            setIsSpeaking(false);
            setTime(50);
            
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
            return newCount;
          } else {
            toast.error(`⚠️ Warning ${newCount}/3: Please stay in fullscreen mode!`, {
              duration: 4000,
              icon: '⚠️'
            });
            return newCount;
          }
        });
      }
    };

    // Start monitoring fullscreen when interview begins
    if (isListening) {
      fullScreenCheckIntervalRef.current = setInterval(checkFullScreen, 2000); // Check every 2 seconds
    } else {
      if (fullScreenCheckIntervalRef.current) {
        clearInterval(fullScreenCheckIntervalRef.current);
      }
    }

    return () => {
      if (fullScreenCheckIntervalRef.current) {
        clearInterval(fullScreenCheckIntervalRef.current);
      }
    };
  }, [isListening, router]);

  // Request fullscreen when starting interview
  const requestFullScreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  // Detect when user is actively speaking
  useEffect(() => {
    if (transcript.length > 0 && isListening) {
      setIsSpeaking(true);
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
      }, 1500);
    }
    return () => clearTimeout(speakingTimeoutRef.current);
  }, [transcript, isListening]);

  // Timer logic
  useEffect(() => {
    if (!isListening) return;

    setTime(50);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isListening]);


  const formatTime = sec => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStart = useCallback(() => {
    // Only request fullscreen on first start (when not already in fullscreen)
    if (!document.fullscreenElement && !isListening) {
      requestFullScreen();
      setFullScreenWarnings(0); // Reset warnings when starting new session
      
      // Small delay to allow fullscreen to activate
      setTimeout(() => {
        SpeechRecognition.startListening({ continuous: true, interimResults: true, language: "en-IN" });
        setIsListening(true);
      }, 500);
    } else {
      // If already in fullscreen, just start listening
      SpeechRecognition.startListening({ continuous: true, interimResults: true, language: "en-IN" });
      setIsListening(true);
    }
  }, [requestFullScreen, isListening]);

  const handleStop = useCallback(() => {
    // Stop listening and reset timer without exiting fullscreen
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
    setIsListening(false);
    setIsSpeaking(false);
    setTime(50); // Reset timer to 50 seconds
    
    toast.success("Recording stopped. Timer reset to 50 seconds.");
  }, []);

  const handleSave = useCallback(async () => {
    if (!transcript || transcript.trim() === "") {
      toast.error("No speech detected. Please try speaking before saving.");
      setSaving(false);
      return;
    }

    // Stop listening when saving
    SpeechRecognition.stopListening();
    setIsListening(false);
    setIsSpeaking(false);

    setSaving(true);
    clearInterval(timerRef.current);

    // Cycle through loading messages
    let messageIndex = 0;
    setLoadingMessage(loadingMessages[0]);
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[messageIndex]);
    }, 1500);

    try {
      // Parallel execution for faster save - make both API calls at once
      const [correctionResponse, saveResponse] = await Promise.all([
        fetch("/api/correct", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ 
            transcribedText: transcript,
            interviewId: interviewId,
            questionId: `${activeQuestionIndex}`
          }),
        }),
        fetch(`/api/answers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            interviewId,
            questionIndex: activeQuestionIndex,
            answerText: transcript, // Save original first
            transcript: transcript
          }),
        })
      ]);

      if (!saveResponse.ok) {
        throw new Error("Failed to save answer");
      }

      // Update with corrected text if available
      if (correctionResponse.ok) {
        const correctionData = await correctionResponse.json();
        if (correctionData.success && correctionData.correctedText !== transcript) {
          // Update with corrected version
          await fetch(`/api/answers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              interviewId,
              questionIndex: activeQuestionIndex,
              answerText: correctionData.correctedText,
              transcript: transcript
            }),
          });
        }
      }

      clearInterval(messageInterval);
      toast.success("Answer saved successfully!");
      resetTranscript();
      setTime(50);

      if (typeof onNextQuestion === "function") {
        onNextQuestion();
      }
    } catch (err) {
      clearInterval(messageInterval);
      console.error("Save error:", err);
      toast.error("Error saving answer. Please try again.");
    } finally {
      setSaving(false);
      setLoadingMessage("");
    }
  }, [transcript, interviewId, activeQuestionIndex, userId, onNextQuestion, resetTranscript, loadingMessages]);

  // Reset when question changes
  useEffect(() => {
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
    resetTranscript();
    setTime(50);
    setIsListening(false);
    setIsSpeaking(false);
    setFullScreenWarnings(0); // Reset warnings for new question
    // Stay in fullscreen when moving to next question
  }, [activeQuestionIndex, resetTranscript]);

  // Cleanup on unmount ONLY - exit fullscreen when leaving the interview page
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(speakingTimeoutRef.current);
      if (fullScreenCheckIntervalRef.current) {
        clearInterval(fullScreenCheckIntervalRef.current);
      }
      // Exit fullscreen on unmount (when leaving interview page)
      if (document.fullscreenElement) {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  return (
    <div className="flex flex-col items-center">
      {/* Professional Loading Modal */}
      {saving && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border-2 border-blue-500/20 dark:border-blue-400/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Animated AI Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-4xl">🤖</span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>

            {/* Loading Message */}
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-3 transition-colors duration-300">
              Processing...
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-lg font-medium transition-all duration-500">
              {loadingMessage}
            </p>

            {/* Loading Bar */}
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 dark:from-blue-600 dark:via-purple-600 dark:to-blue-600 animate-shimmer"></div>
            </div>

            {/* Additional Info */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 transition-colors duration-300">
              Please wait while we process your response
            </p>
          </div>
        </div>
      )}

      {/* Full Screen Warning - Show when not in fullscreen during interview */}
      {isListening && !isFullScreen && fullScreenWarnings > 0 && fullScreenWarnings < 3 && (
        <div className="w-full max-w-3xl mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600 text-white p-4 rounded-xl shadow-lg dark:shadow-2xl animate-pulse transition-all duration-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <p className="font-semibold">⚠️ Fullscreen Warning {fullScreenWarnings}/3</p>
              <p className="text-sm">Please return to fullscreen mode immediately! You'll be redirected to dashboard after 3 warnings.</p>
            </div>
          </div>
        </div>
      )}

      {/* Webcam Container */}
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-gray-950 dark:via-black dark:to-gray-900 p-6 mt-2 ml-5 rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-600 backdrop-blur-md transition-all duration-500 hover:scale-[1.03] hover:shadow-purple-500/40 dark:hover:shadow-purple-600/50">
        <Image src={"/webCam.png"} width={220} height={220} alt="webcam overlay" className="absolute opacity-15 dark:opacity-10" />
        <Webcam mirrored={true} className="rounded-xl border-2 border-purple-500/40 dark:border-purple-600/50 shadow-lg dark:shadow-2xl transition-all duration-300" style={{ height: 300, width: "100%", zIndex: 10 }} />
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-purple-600/30 dark:border-purple-500/40 animate-pulse" />
      </div>

      {/* Fullscreen Status Badge */}
      {isFullScreen && isListening && (
        <div className="mt-2 flex items-center gap-2 bg-green-500/10 dark:bg-green-600/20 border border-green-500/30 dark:border-green-500/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg transition-all duration-300">
          <Maximize className="w-4 h-4" />
          <span className="text-sm font-medium">Fullscreen Mode</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        {!isListening ? (
          <Button
            onClick={handleStart}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              saving 
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white" 
                : "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-700 dark:hover:to-emerald-800 text-white hover:shadow-green-500/40 dark:hover:shadow-green-600/50 cursor-pointer hover:scale-105"
            }`}
          >
            Start Speaking
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
              saving 
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white" 
                : "bg-gradient-to-r from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700 hover:from-red-600 hover:to-rose-700 dark:hover:from-red-700 dark:hover:to-rose-800 text-white hover:shadow-red-500/40 dark:hover:shadow-red-600/50 cursor-pointer hover:scale-105"
            }`}
          >
            ⏹️ Stop
          </Button>
        )}

        <Button
          onClick={handleSave}
          disabled={saving || !transcript.trim()}
          className={`px-6 py-3 rounded-xl cursor-pointer font-semibold shadow-lg transition-all duration-300 hover:scale-105
            ${!saving && transcript.trim() ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-700 dark:via-indigo-700 dark:to-blue-700 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 dark:hover:from-purple-800 dark:hover:via-indigo-800 dark:hover:to-blue-800 text-white hover:shadow-purple-500/40 dark:hover:shadow-purple-600/50" : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"}`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⚡</span>
              Processing...
            </span>
          ) : (
            "💾 Save Answer"
          )}
        </Button>
      </div>

      {/* Listening Status Indicator - Show appropriate message based on state */}
      <div className="mt-6 ml-10 w-full max-w-3xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900 text-gray-900 dark:text-white p-5 rounded-xl shadow-inner dark:shadow-2xl border border-gray-300 dark:border-gray-700 transition-all duration-300 hover:shadow-md dark:hover:shadow-xl flex justify-between items-center min-h-[120px]">
        <div className="flex-1 flex items-center justify-center">
          {!isListening ? (
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-900 transition-colors duration-300">
              <Mic className="w-6 h-6" />
              <span className="text-lg">🎙️ Click 'Start Speaking' to begin recording your answer</span>
            </div>
          ) : transcript.trim() === "" ? (
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 animate-pulse transition-colors duration-300">
              <Mic className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-medium">Listening... Start speaking</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400 transition-colors duration-300">
              <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
              <Mic className="w-6 h-6" />
              <span className="text-lg font-medium">Recording your answer... We're hearing you!</span>
            </div>
          )}
        </div>
        <div className="ml-4 px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg shadow-lg dark:shadow-2xl font-mono text-lg font-semibold transition-all duration-300">
          ⏱ {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
