"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Briefcase, Calendar, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      fetchInterviews();
    } else if (isLoaded && !user) {
      setLoading(false);
      setError("Please sign in to view interviews");
    }
  }, [isLoaded, user]);

  const fetchInterviews = async (retryCount = 0, maxRetries = 3) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [Client] Fetching interviews (attempt ${retryCount + 1})...`);

      const response = await fetch('/api/interviews', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id, // Pass userId in header
        },
        cache: 'no-store',
      });

      console.log("📡 [Client] Response status:", response.status);

      const contentType = response.headers.get('content-type');
      
      // Handle 404 - route not compiled yet
      if (response.status === 404) {
        console.log("⚠️ [Client] Route not ready (404), retrying...");
        
        if (retryCount < maxRetries) {
          setIsWarmingUp(true);
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchInterviews(retryCount + 1, maxRetries);
        } else {
          throw new Error('Unable to connect to server. Please refresh the page.');
        }
      }

      // Handle 500 errors (database connection issues)
      if (response.status === 500) {
        console.log("⚠️ [Client] Server error (500), retrying...");
        
        if (retryCount < maxRetries) {
          setIsWarmingUp(true);
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchInterviews(retryCount + 1, maxRetries);
        } else {
          throw new Error('Server is experiencing issues. Please try again later.');
        }
      }

      // Check for valid JSON response
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error("❌ [Client] Non-JSON response:", text.substring(0, 200));
        
        // Retry on HTML response (route not ready)
        if (text.includes('<!DOCTYPE') && retryCount < maxRetries) {
          setIsWarmingUp(true);
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchInterviews(retryCount + 1, maxRetries);
        }
        
        throw new Error('Server returned invalid response');
      }

      const data = await response.json();
      console.log("📊 [Client] Response data:", data);

      if (response.ok && data.success) {
        setInterviews(data.interviews || []);
        console.log(`✅ [Client] Loaded ${data.interviews?.length || 0} interviews`);
        setIsWarmingUp(false);
        setIsInitialLoad(false);
      } else {
        throw new Error(data.error || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error('❌ [Client] Error:', err);
      setError(err.message || 'Failed to load interviews');
      setIsWarmingUp(false);
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4 transition-colors duration-300" />
          <p className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
            {isWarmingUp ? "Setting up your workspace..." : "Loading your interviews..."}
          </p>
          {isWarmingUp && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 transition-colors duration-300">This may take a few seconds on first load</p>
          )}
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md transition-colors duration-300">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2 transition-colors duration-300">Authentication Required</h3>
          <p className="text-red-700 dark:text-red-400 transition-colors duration-300">Please sign in to view your interviews</p>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 max-w-md transition-colors duration-300">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4 transition-colors duration-300" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-2 transition-colors duration-300">Something went wrong</h3>
          <p className="text-red-700 dark:text-red-400 mb-6 transition-colors duration-300">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsInitialLoad(true);
              fetchInterviews(0);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - Don't show if it's initial load with error
  if (interviews.length === 0 && !isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg p-12 max-w-md transition-colors duration-300">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center transition-colors duration-300">
            <Briefcase className="h-10 w-10 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Ready to Start?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-300">
            You haven't created any mock interviews yet. Click above add new button to continue.
          </p>
        </div>
      </div>
    );
  }

  // Success state - show interviews
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Your Mock Interviews</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
            {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'} available
          </p>
        </div>
        <button
          onClick={() => fetchInterviews(0)}
          className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Interview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <div 
            key={interview.id} 
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl dark:hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full transition-colors duration-300">
                Active
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {interview.jobPosition}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
              <Briefcase className="h-4 w-4" />
              <span>{interview.jobExperience} years experience</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[40px] transition-colors duration-300">
              {interview.jobDesc}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>{interview.totalQuestions} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(interview.createdAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/dashboard/interview/${interview.mockId}/start`)}
                className="flex-1 px-4 cursor-pointer py-2.5 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:shadow-lg"
              >
                Start Interview
              </button>
              <button 
                onClick={() => router.push(`/dashboard/interview/${interview.id}/feedback`)}
                className="flex-1 cursor-pointer px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                View Feedback
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;