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
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            {isWarmingUp ? "Setting up your workspace..." : "Loading your interviews..."}
          </p>
          {isWarmingUp && (
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds on first load</p>
          )}
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Authentication Required</h3>
          <p className="text-red-700">Please sign in to view your interviews</p>
        </div>
      </div>
    );
  }

  // Error state with retry
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Something went wrong</h3>
          <p className="text-red-700 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsInitialLoad(true);
              fetchInterviews(0);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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
        <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-12 max-w-md">
          <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="h-10 w-10 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Start?</h3>
          <p className="text-gray-600 mb-6">
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
          <h2 className="text-2xl font-bold text-gray-900">Your Mock Interviews</h2>
          <p className="text-gray-600 mt-1">
            {interviews.length} {interviews.length === 1 ? 'interview' : 'interviews'} available
          </p>
        </div>
        <button
          onClick={() => fetchInterviews(0)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Active
              </span>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {interview.jobPosition}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Briefcase className="h-4 w-4" />
              <span>{interview.jobExperience} years experience</span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
              {interview.jobDesc}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
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
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Interview
              </button>
              <button 
                onClick={() => router.push(`/dashboard/interview/${interview.mockId}/feedback`)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
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