"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
import {Button} from '../../../../../components/ui/button'
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {Card, CardContent, CardHeader} from '../../../../../components/ui/card'
import { Badge } from '../../../../../components/ui/badge';
import { ArrowLeft, Trophy, TrendingUp, User, Calendar, Briefcase } from 'lucide-react';
import { useParams } from 'next/navigation';

const FeedbackPage = () => {
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const {interviewId} = useParams();

  // useEffect(() => {
  //   if (isLoaded && user && params.interviewId) {
  //     fetchEvaluationReports();
  //   }
  // }, [isLoaded, user, params.interviewId]);

  useEffect(()=>{
    if(isLoaded && user && interviewId){
      fetchEvaluationReports(interviewId);
    }
  }, [isLoaded, user, interviewId]);

  const fetchEvaluationReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/answers?interviewId=${interviewId}&userId=${user.id}&limit=5`
      );
      
      const data = await response.json();
      
      if (data.success) {
        setEvaluationData(data);
      } else {
        setError(data.error || 'Failed to fetch evaluation data');
      }
    } catch (err) {
      console.error('Error fetching evaluation:', err);
      setError('Failed to load evaluation reports');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (score) => {
    if (score >= 20) return 'bg-green-500';
    if (score >= 15) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your evaluation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Results</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} className={`cursor-pointer`} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!evaluationData || !evaluationData.reports.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Evaluation Found</h3>
            <p className="text-gray-600 mb-4">No evaluation reports found for this interview.</p>
            <Button onClick={() => router.push('/dashboard')} className={`cursor-pointer`} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { interviewDetails, summary, reports } = evaluationData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="mb-4 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Interview Feedback</h1>
              <p className="text-gray-600 mt-1">Detailed evaluation of your performance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(evaluationData.fetchedAt).toLocaleDateString()}
              </div>
              <Badge variant="outline" className="text-xs">
                Interview ID: <strong>{interviewDetails.id}</strong>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Interview Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Interview Details</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold">{interviewDetails.jobPosition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience Level</p>
                <p className="font-semibold">{interviewDetails.jobExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="font-semibold">{summary.totalReports}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Job Description</p>
              <p className="text-gray-700 mt-1">{interviewDetails.jobDesc}</p>
            </div>
          </CardContent>
        </Card>

        {/* Overall Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold">Overall Performance</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(summary.averageScore).split(' ')[0]}`}>
                  {summary.averageScore}/100
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Badge className={`${summary.grade.color === 'green' ? 'bg-green-500' : 
                    summary.grade.color === 'blue' ? 'bg-blue-500' : 
                    summary.grade.color === 'indigo' ? 'bg-indigo-500' :
                    summary.grade.color === 'yellow' ? 'bg-yellow-500' :
                    summary.grade.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'} text-white`}>
                    Grade {summary.grade.grade}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{summary.grade.description}</p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Category Breakdown</h3>
                {Object.entries(summary.categoryAverages).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{category}</span>
                      <span className="text-sm font-bold">{score}/25</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(score)}`}
                        style={{ width: `${(score / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Question Results */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">Question-wise Analysis</h2>
          </div>

          {reports.map((report, index) => (
            <Card key={report.answerId} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Question {report.questionIndex + 1}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(report.score)}`}>
                    {report.score}/100
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Question:</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {report.evaluation.question}
                  </p>
                </div>

                {/* Your Answer vs Expected Answer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Your Answer:</h4>
                    <div className="bg-yellow-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700">{report.evaluation.userAnswer}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Expected Answer:</h4>
                    <div className="bg-green-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                      <p className="text-sm text-gray-700">{report.evaluation.expectedAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Score Breakdown:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {report.evaluation.technicalAccuracy}/25
                      </div>
                      <div className="text-xs text-gray-600">Technical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {report.evaluation.completeness}/25
                      </div>
                      <div className="text-xs text-gray-600">Completeness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {report.evaluation.clarity}/25
                      </div>
                      <div className="text-xs text-gray-600">Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {report.evaluation.relevance}/25
                      </div>
                      <div className="text-xs text-gray-600">Relevance</div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Feedback:</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">{report.evaluation.feedback}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {report.evaluation.suggestions && report.evaluation.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Suggestions for Improvement:</h4>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <ul className="text-sm text-gray-700 space-y-1">
                        {report.evaluation.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center py-8">
          <div className="space-x-4">
            <Button className={`cursor-pointer`} onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;