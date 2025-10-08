"use client";
import { Button } from "../../../../components/ui/button.jsx";
import { Lightbulb, WebcamIcon, Monitor, MonitorOff } from "lucide-react";
import { useRouter } from "next/navigation.js";
import React, { useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import toast from "react-hot-toast";

const Interview = ({ params }) => {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [showFullScreenModal, setShowFullScreenModal] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const resolvedParams = await params;
        const mockId = resolvedParams.interviewId;
        const res = await fetch(`/api/interview/${mockId}`);
        const data = await res.json();

        if (data.success) {
          setInterview(data.interview[0]);
        } else {
          setError(data.error || "Interview not found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [params]);

  const startScreenShare = useCallback(async () => {
    if (screenSharing) {
      toast.info("Screen sharing is already active");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          cursor: "always",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true,
      });

      const videoTrack = stream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      if (settings.displaySurface !== "monitor") {
        stream.getTracks().forEach((track) => track.stop());
        toast.error(
          "Please share your entire screen (monitor) instead of a window or tab."
        );
        return;
      }

      // Handle when user stops sharing via browser UI
      videoTrack.onended = () => {
        setScreenSharing(false);
        setScreenStream(null);
        toast.error("Screen sharing stopped. Please enable it again.");
      };

      setScreenStream(stream);
      setScreenSharing(true);
      
      // Store stream reference globally for next page
      if (typeof window !== 'undefined') {
        window.__screenStream = stream;
      }
      
      toast.success("Screen sharing started successfully!");
    } catch (error) {
      console.error("Screen share error:", error);
      if (error.name === "NotAllowedError") {
        toast.error("Screen sharing permission denied. Please allow screen sharing to continue.");
      } else if (error.name === "NotSupportedError") {
        toast.error("Screen sharing is not supported in this browser.");
      } else {
        toast.error("Screen share permission denied or not supported.");
      }
    }
  }, [screenSharing]);

  const handleStopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setScreenSharing(false);
      
      // Clean up global reference
      if (typeof window !== 'undefined') {
        window.__screenStream = null;
      }
      
      toast.success("Screen sharing stopped");
    }
  }, [screenStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        if (typeof window !== 'undefined') {
          window.__screenStream = null;
        }
      }
    };
  }, [screenStream]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-medium">
        Loading interview details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="my-10 flex justify-center items-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="font-extrabold text-3xl text-center text-gray-800 mb-10">
          Let&apos;s Get Started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Job Details */}
          <div className="flex flex-col justify-center space-y-6 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              <strong>Job Role / Position:</strong> {interview?.jobPosition}
            </h2>
            <h2 className="text-xl font-semibold text-gray-900">
              <strong>Job Description / Tech Stack:</strong>{" "}
              {interview?.jobDesc}
            </h2>
            <h2 className="text-xl font-semibold text-gray-900">
              <strong>Years of Experience:</strong> {interview?.jobExperience}
            </h2>

            {/* Information Section */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 shadow-sm">
            <div className="flex items-center mb-3">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">Important Information</h3>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Ensure your <strong>webcam</strong> is working properly before starting the interview.</li>
                <li>Ensure your <strong>microphone</strong> is functioning and properly connected.</li>
                <li>Close all unnecessary applications and notifications to avoid distractions.</li>
                <li>Make sure your <strong>screen sharing</strong> permissions are enabled for the entire screen.</li>
                <li>Use a stable internet connection to avoid interruptions.</li>
            </ul>
            </div>
          </div>

          {/* Right Side: Proctoring Area */}
          <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-xl shadow-sm">
            {/* Screen Sharing Status */}
            {!screenSharing && (
              <div className="w-full mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                <div className="flex items-center">
                  <MonitorOff className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700 font-medium">
                    Screen sharing is not active. Please enable screen sharing to continue.
                  </p>
                </div>
              </div>
            )}

            {screenSharing && (
              <div className="w-full mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-green-700 font-medium">
                      Screen sharing is active
                    </p>
                  </div>
                  <Button
                    onClick={handleStopScreenShare}
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Stop Sharing
                  </Button>
                </div>
              </div>
            )}

            {webCamEnabled ? (
                <>
              <Webcam
                mirrored
                audio={true}
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                className="rounded-2xl border border-gray-200 shadow-md"
                style={{ height: 300, width: 300 }}
                />
                
                {!screenSharing && (
                    <Button
                        onClick={startScreenShare}
                        className="bg-purple-600 mt-4 cursor-pointer hover:bg-purple-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                    >
                        <Monitor className="mr-2 h-5 w-5" />
                        Enable Screen Sharing
                    </Button>
                )}

                {screenSharing && (
                    <Button
                        onClick={() => setShowFullScreenModal(true)}
                        className="bg-green-600 mt-4 cursor-pointer hover:bg-green-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                    >
                        Start Interview
                    </Button>
                )}
              <Button
                    onClick={() => setWebCamEnabled(false)}
                    className="bg-red-600 mt-4 cursor-pointer hover:bg-red-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                >
                    Disable Web Cam & Microphone
                </Button>

                {/* Start Interview Button */}
                </>
            ) : (
              <>
                <WebcamIcon className="h-48 w-48 my-6 p-6 rounded-2xl bg-gray-200 text-gray-500 shadow-inner" />
                <Button
                  onClick={() => setWebCamEnabled(true)}
                  className="bg-blue-600 cursor-pointer hover:bg-blue-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                >
                  Enable Web Cam & Microphone
                </Button>
                <Button
                  onClick={() => setWebCamEnabled(false)}
                  className="bg-red-600 mt-2 cursor-pointer hover:bg-red-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-200"
                >
                  Disable Web Cam & Microphone
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Fullscreen Modal */}
        {showFullScreenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Fullscreen Required</h3>
            <p className="mb-6 text-gray-700">
                The interview requires full-screen mode. Please allow full-screen to continue.
            </p>
            <div className="flex justify-center gap-4">
                <Button
                onClick={() => {
                    const elem = document.documentElement;
                    if (elem.requestFullscreen) {
                    elem.requestFullscreen().then(() => {
                        setShowFullScreenModal(false);
                        // Redirect to exam page
                        // window.location.href = `/interview/${interview.id}/Start`;
                        router.push('/dashboard/interview/'+ interview.mockId + '/start');
                    });
                    } else {
                    alert("Fullscreen not supported in this browser");
                    }
                }}
                className="bg-green-600 cursor-pointer hover:bg-green-800 text-white px-4 py-2 rounded-lg"
                >
                Allow Fullscreen
                </Button>
                <Button
                onClick={() => setShowFullScreenModal(false)}
                className="bg-gray-300 cursor-pointer hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                Cancel
                </Button>
            </div>
            </div>
        </div>
        )}
    </div>
  );
};

export default Interview;
