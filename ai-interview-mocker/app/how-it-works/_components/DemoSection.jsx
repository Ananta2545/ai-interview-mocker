"use client";

import { Play, CheckCircle, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const DemoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const highlights = [
    'AI generates realistic interview questions',
    'Record answers via text or voice input',
    'Get instant feedback and improvement tips',
    'Track your progress with detailed analytics',
    'Practice with customizable time limits',
    'Prepare for any role or industry',
  ];

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleStopVideo = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  // Enforce mute on video - prevent unmuting
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Force mute
      video.muted = true;
      video.volume = 0;
      
      // Prevent unmuting through volume change events
      const preventUnmute = () => {
        if (!video.muted) {
          video.muted = true;
        }
        if (video.volume > 0) {
          video.volume = 0;
        }
      };
      
      video.addEventListener('volumechange', preventUnmute);
      
      return () => {
        video.removeEventListener('volumechange', preventUnmute);
      };
    }
  }, []);

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video player */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl dark:shadow-2xl aspect-video">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                src="/interviewMockerVideo.mp4"
                onEnded={handleVideoEnd}
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
              >
                Your browser does not support the video tag.
              </video>

              {/* Play button overlay - only show when not playing */}
              {!isPlaying && (
                <div 
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/90 to-purple-600/90 dark:from-blue-600/90 dark:to-purple-700/90 transition-all duration-300 cursor-pointer hover:from-primary hover:to-purple-600"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    </div>
                    <p className="text-white font-semibold text-lg">Watch Demo</p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 right-4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                </div>
              )}

              {/* Stop button - only show when playing */}
              {isPlaying && (
                <button
                  onClick={handleStopVideo}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all duration-300 z-10 group/btn"
                  aria-label="Stop video"
                >
                  <X className="w-5 h-5 text-white group-hover/btn:scale-110 transition-transform duration-300" />
                </button>
              )}
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-2xl p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 flex items-center justify-center transition-colors duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
              See It In Action
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
              Experience the power of AI-driven interview preparation. Our platform simulates 
              real interview scenarios and provides comprehensive feedback to help you improve.
            </p>

            {/* Highlights list */}
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-600 dark:from-blue-500 dark:to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300">
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
