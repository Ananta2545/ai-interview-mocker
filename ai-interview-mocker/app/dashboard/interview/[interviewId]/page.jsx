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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">
            Loading interview details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <p className="text-red-500 dark:text-red-400 font-semibold text-lg transition-colors duration-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 flex justify-center items-center px-4 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="font-extrabold text-3xl text-center text-gray-800 dark:text-white mb-10 transition-colors duration-300">
          Let&apos;s Get Started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Job Details */}
          <div className="flex flex-col justify-center space-y-6 bg-gradient-to-r from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              <strong>Job Role / Position:</strong> {interview?.jobPosition}
            </h2>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              <strong>Job Description / Tech Stack:</strong>{" "}
              {interview?.jobDesc}
            </h2>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              <strong>Years of Experience:</strong> {interview?.jobExperience}
            </h2>

            {/* Information Section */}
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-lg p-5 shadow-sm transition-all duration-300">
            <div className="flex items-center mb-3">
                <Lightbulb className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-2 transition-colors duration-300" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white transition-colors duration-300">Important Information</h3>
            </div>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 transition-colors duration-300">
                <li>Ensure your <strong>webcam</strong> is working properly before starting the interview.</li>
                <li>Ensure your <strong>microphone</strong> is functioning and properly connected.</li>
                <li>Close all unnecessary applications and notifications to avoid distractions.</li>
                <li>Make sure your <strong>screen sharing</strong> permissions are enabled for the entire screen.</li>
                <li>Use a stable internet connection to avoid interruptions.</li>
            </ul>
            </div>
          </div>

          {/* Right Side: Proctoring Area */}
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all duration-300">
            {/* Screen Sharing Status */}
            {!screenSharing && (
              <div className="w-full mb-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-lg transition-all duration-300">
                <div className="flex items-center">
                  <MonitorOff className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 transition-colors duration-300" />
                  <p className="text-red-700 dark:text-red-300 font-medium transition-colors duration-300">
                    Screen sharing is not active. Please enable screen sharing to continue.
                  </p>
                </div>
              </div>
            )}

            {screenSharing && (
              <div className="w-full mb-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Monitor className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 transition-colors duration-300" />
                    <p className="text-green-700 dark:text-green-300 font-medium transition-colors duration-300">
                      Screen sharing is active
                    </p>
                  </div>
                  <Button
                    onClick={handleStopScreenShare}
                    size="sm"
                    variant="outline"
                    className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300"
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
                className="rounded-2xl border-4 border-gray-200 dark:border-gray-600 shadow-lg dark:shadow-2xl transition-all duration-300"
                style={{ height: 300, width: 300 }}
                />
                
                {!screenSharing && (
                    <Button
                        onClick={startScreenShare}
                        className="bg-purple-600 dark:bg-purple-500 mt-4 cursor-pointer hover:bg-purple-800 dark:hover:bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        <Monitor className="mr-2 h-5 w-5" />
                        Enable Screen Sharing
                    </Button>
                )}

                {screenSharing && (
                    <Button
                        onClick={() => setShowFullScreenModal(true)}
                        className="bg-green-600 dark:bg-green-500 mt-4 cursor-pointer hover:bg-green-800 dark:hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                        Start Interview
                    </Button>
                )}
              <Button
                    onClick={() => setWebCamEnabled(false)}
                    className="bg-red-600 dark:bg-red-500 mt-4 cursor-pointer hover:bg-red-800 dark:hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                    Disable Web Cam & Microphone
                </Button>

                {/* Start Interview Button */}
                </>
            ) : (
              <>
                <WebcamIcon className="h-48 w-48 my-6 p-6 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 shadow-inner transition-all duration-300" />
                <Button
                  onClick={() => setWebCamEnabled(true)}
                  className="bg-blue-600 dark:bg-blue-500 cursor-pointer hover:bg-blue-800 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Enable Web Cam & Microphone
                </Button>
                <Button
                  onClick={() => setWebCamEnabled(false)}
                  className="bg-red-600 dark:bg-red-500 mt-2 cursor-pointer hover:bg-red-800 dark:hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
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
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 text-center transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Fullscreen Required</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 transition-colors duration-300">
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
                className="bg-green-600 dark:bg-green-500 cursor-pointer hover:bg-green-800 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                Allow Fullscreen
                </Button>
                <Button
                onClick={() => setShowFullScreenModal(false)}
                className="bg-gray-300 dark:bg-gray-600 cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
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
