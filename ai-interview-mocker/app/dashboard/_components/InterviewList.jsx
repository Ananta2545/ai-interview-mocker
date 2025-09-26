"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs'; // Fixed import - removed /server
import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  Briefcase, 
  User, 
  PlayCircle, 
  BarChart3,
  Clock,
  FileText,
  Loader2
} from 'lucide-react';

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser(); // This will now work correctly
  const router = useRouter();

  // Rest of your component code remains the same
  useEffect(() => {
    if (isLoaded && user) {
      fetchInterviews();
    }
  }, [isLoaded, user]);

  const {getToken} = useAuth();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const token = await getToken({
        template: "default"
      });
      console.log("TOKEN IS : ", token);
      const response = await fetch('/api/interviews', {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setInterviews(data.interviews);
      } else {
        setError(data.error || 'Failed to fetch interviews');
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code stays exactly the same
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExperienceColor = (years) => {
    if (years === 0) return 'bg-green-100 text-green-800';
    if (years <= 2) return 'bg-blue-100 text-blue-800';
    if (years <= 5) return 'bg-purple-100 text-purple-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getExperienceLabel = (years) => {
    if (years === 0) return 'Fresher';
    if (years === 1) return '1 Year';
    return `${years} Years`;
  };

  const handleStartInterview = (interview) => {
    setLoading(true);
    const interviewId = interview.mockId;
    router.push(`/dashboard/interview/${interviewId}/start`);
    setLoading(false);
  };

  const handleViewFeedback = (interview) => {
    setLoading(true);
    const interviewId = interview.id;
    router.push(`/dashboard/interview/${interviewId}/feedback`);
    setLoading(false)
  };

  // ... rest of your JSX remains the same
  
  if (!isLoaded || loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Previous Mock Interviews</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Interviews</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchInterviews} variant="outline">
          <Loader2 className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Interviews Yet</h3>
        <p className="text-gray-600 mb-4">Create your first mock interview to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Previous Mock Interviews</h2>
          <p className="text-gray-600 mt-1">
            {interviews.length} interview{interviews.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <Button className={`cursor-pointer`} onClick={fetchInterviews} variant="outline" size="sm">
          <Loader2 className="w-4 h-4 mr-2 " />
          Refresh
        </Button>
      </div>

      {/* Interview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview, index) => (
          <Card 
            key={interview.id} 
            className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {interview.jobPosition}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-3 h-3" />
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-1 ${getExperienceColor(interview.jobExperience)}`}
                    >
                      {getExperienceLabel(interview.jobExperience)} Experience
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                Created on {formatDate(interview.createdAt)}
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="w-3 h-3 mr-1" />
                UserId : {interview.userId}
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {/* Job Description Preview */}
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-1">
                  <FileText className="w-3 h-3 mr-1" />
                  <span className="font-medium">Description:</span>
                </div>
                <p className="line-clamp-2 text-xs leading-relaxed">
                  {interview.jobDesc}
                </p>
              </div>

              {/* Interview Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {interview.totalQuestions} Questions
                </div>
                <div className="text-right">
                  ID: {String(interview.mockId || interview.id).slice(0, 8)}...
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  onClick={() => handleViewFeedback(interview)}
                  variant="outline"
                  size="sm"
                  className="flex-1 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Feedback
                </Button>
                <Button 
                  onClick={() => handleStartInterview(interview)}
                  size="sm" 
                  className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700"
                >
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InterviewList;