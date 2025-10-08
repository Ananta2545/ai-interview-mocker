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

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="text-red-600 font-semibold text-lg">
        ❌ Your browser does not support speech recognition.
      </span>
    );
  }

  // Full screen monitoring
  useEffect(() => {
    const checkFullScreen = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      setIsFullScreen(isCurrentlyFullScreen);
      
      // If not in fullscreen and interview is running, show warning
      if (!isCurrentlyFullScreen && isListening) {
        setFullScreenWarnings(prev => {
          const newCount = prev + 1;
          
          if (newCount >= 3) {
            toast.error("You've exited fullscreen 3 times. Redirecting to dashboard for security reasons.", {
              duration: 5000
            });
            handleStop();
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
    // Request fullscreen before starting
    requestFullScreen();
    setFullScreenWarnings(0); // Reset warnings when starting new session
    
    // Small delay to allow fullscreen to activate
    setTimeout(() => {
      SpeechRecognition.startListening({ continuous: true, interimResults: true, language: "en-IN" });
      setIsListening(true);
    }, 500);
  }, [requestFullScreen]);

  const handleStop = useCallback(() => {
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
    setIsListening(false);
    setIsSpeaking(false);
    
    // Exit fullscreen when stopping
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!transcript || transcript.trim() === "") {
      toast.error("No speech detected. Please try speaking before saving.");
      setSaving(false);
      return;
    }

    setSaving(true);
    clearInterval(timerRef.current);

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

      toast.success("Answer saved successfully!");
      resetTranscript();
      setTime(50);
      setIsListening(false);
      setIsSpeaking(false);

      if (typeof onNextQuestion === "function") {
        onNextQuestion();
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving answer. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [transcript, interviewId, activeQuestionIndex, userId, onNextQuestion, resetTranscript]);

  // Reset when question changes
  useEffect(() => {
    SpeechRecognition.stopListening();
    clearInterval(timerRef.current);
    resetTranscript();
    setTime(50);
    setIsListening(false);
    setIsSpeaking(false);
    setFullScreenWarnings(0); // Reset warnings for new question
  }, [activeQuestionIndex, resetTranscript]);

  // Cleanup on unmount ONLY
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(speakingTimeoutRef.current);
      if (fullScreenCheckIntervalRef.current) {
        clearInterval(fullScreenCheckIntervalRef.current);
      }
      // Exit fullscreen on unmount
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  return (
    <div className="flex flex-col items-center">
      {/* Full Screen Warning - Show when not in fullscreen during interview */}
      {isListening && !isFullScreen && fullScreenWarnings > 0 && fullScreenWarnings < 3 && (
        <div className="w-full max-w-3xl mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-xl shadow-lg animate-pulse">
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
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 mt-2 ml-5 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-md transition-all duration-500 hover:scale-[1.03] hover:shadow-purple-500/40">
        <Image src={"/webCam.png"} width={220} height={220} alt="webcam overlay" className="absolute opacity-15" />
        <Webcam mirrored={true} className="rounded-xl border-2 border-purple-500/40 shadow-lg" style={{ height: 300, width: "100%", zIndex: 10 }} />
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-purple-600/30 animate-pulse" />
      </div>

      {/* Fullscreen Status Badge */}
      {isFullScreen && isListening && (
        <div className="mt-2 flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-700 px-3 py-1 rounded-lg">
          <Maximize className="w-4 h-4" />
          <span className="text-sm font-medium">Fullscreen Mode</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        {!isListening ? (
          <Button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-green-500/40 cursor-pointer px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300"
          >
            Start Speaking
          </Button>
        ) : (
          <Button
            onClick={handleStop}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/40 transition-all duration-300 cursor-pointer"
          >
            ⏹️ Stop
          </Button>
        )}

        <Button
          onClick={handleSave}
          disabled={saving || !transcript.trim()}
          className={`px-6 py-3 rounded-xl cursor-pointer font-semibold shadow-lg transition-all duration-300 
            ${!saving && transcript.trim() ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white hover:shadow-purple-500/40" : "bg-gray-400 cursor-not-allowed text-white"}`}
        >
          {saving ? "💾 Saving..." : "💾 Save Answer"}
        </Button>
      </div>

      {/* Listening Status Indicator - Show appropriate message based on state */}
      <div className="mt-6 ml-10 w-full max-w-3xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900 p-5 rounded-xl shadow-inner border border-gray-300 transition-all duration-300 hover:shadow-md flex justify-between items-center min-h-[120px]">
        <div className="flex-1 flex items-center justify-center">
          {!isListening ? (
            <div className="flex items-center gap-3 text-gray-500">
              <Mic className="w-6 h-6" />
              <span className="text-lg">🎙️ Click 'Start Speaking' to begin recording your answer</span>
            </div>
          ) : transcript.trim() === "" ? (
            <div className="flex items-center gap-3 text-blue-600 animate-pulse">
              <Mic className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-medium">Listening... Start speaking</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-600">
              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              <Mic className="w-6 h-6" />
              <span className="text-lg font-medium">Recording your answer... We're hearing you!</span>
            </div>
          )}
        </div>
        <div className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg font-mono text-lg font-semibold">
          ⏱ {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
