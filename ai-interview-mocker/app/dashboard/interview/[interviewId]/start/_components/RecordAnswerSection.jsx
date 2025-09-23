"use client";
import { Button } from "../../../../../../components/ui/button.jsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import toast from "react-hot-toast";

const RecordAnswerSection = ({ interviewId, onNextQuestion, userId, activeQuestionIndex }) => {
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState(10);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="text-red-600 font-semibold text-lg">
        ❌ Your browser does not support speech recognition.
      </span>
    );
  }

  // Auto-save when listening stops
useEffect(() => {
  if (!listening && transcript.trim() !== "") {
    const timer = setTimeout(() => {
      handleSave();
    }, 500); // 500ms delay to flush final transcript
    return () => clearTimeout(timer);
  }
}, [listening, transcript]);


  // Timer logic
useEffect(() => {
  if (!listening) return;

  setTime(10); // reset timer on start
  let autoSaved = false; // <-- track if auto-save has happened
  const timerId = setInterval(() => {
    setTime(prev => {
      if (prev <= 1) {
        clearInterval(timerId);
        handleStop();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timerId);
}, [listening]);


  const formatTime = sec => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleStart = () => {
    SpeechRecognition.startListening({ continuous: true, interimResults: true, language: "en-IN" });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    // setTimeout(() => {
    //   console.log("Final transcript:", transcript);
    // }, 1000);
  };

  const handleSave = async () => {
    // if (!transcript || transcript.trim() === "") return;
    setSaving(true);

    console.log("Transcript:", transcript);
    try {
       const payload = {
        userId,
        interviewId,
        answerText: transcript,
        transcript: transcript
      };
      const res = await fetch(`/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save answer");

      resetTranscript();
      setTime(10);

      if (typeof onNextQuestion === "function") {
        onNextQuestion();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving answer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Webcam Container */}
      <div className="relative flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 mt-6 ml-5 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-md transition-all duration-500 hover:scale-[1.03] hover:shadow-purple-500/40">
        <Image src={"/webCam.png"} width={220} height={220} alt="webcam overlay" className="absolute opacity-15" />
        <Webcam mirrored={true} className="rounded-xl border-2 border-purple-500/40 shadow-lg" style={{ height: 300, width: "100%", zIndex: 10 }} />
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-purple-600/30 animate-pulse" />
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        {!listening ? (
          <Button
            onClick={handleStart}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-green-500/40 transition-all duration-300 cursor-pointer"
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
          disabled={saving}
          className={`px-6 py-3 rounded-xl cursor-pointer font-semibold shadow-lg transition-all duration-300 
            ${!saving ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white hover:shadow-purple-500/40" : "bg-gray-400 cursor-not-allowed text-white"}`}
        >
          {saving ? "💾 Saving..." : "💾 Save Answer"}
        </Button>
      </div>

      {/* Transcript Display */}
      <div className="mt-6 ml-10 w-full max-w-3xl bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900 p-5 rounded-xl shadow-inner border border-gray-300 transition-all duration-300 hover:shadow-md flex justify-between items-start">
        <div>
          <strong className="block text-sm text-gray-700 mb-2 uppercase tracking-wide">Transcript:</strong>
          <p className="text-base leading-relaxed whitespace-pre-line">{transcript || "🎙️ Start speaking to see your answer here..."}</p>
        </div>
        <div className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg font-mono text-lg font-semibold">
          ⏱ {formatTime(time)}
        </div>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
