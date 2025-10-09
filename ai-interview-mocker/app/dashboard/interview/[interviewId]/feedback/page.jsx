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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto transition-colors duration-300"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading your evaluation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 dark:text-red-400 text-6xl mb-4 transition-colors duration-300">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Error Loading Results</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">{error}</p>
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <Card className="max-w-md mx-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Interview Feedback</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">Detailed evaluation of your performance</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(evaluationData.fetchedAt).toLocaleDateString()}
              </div>
              <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Interview ID: <strong>{interviewDetails.id}</strong>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Interview Details */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Interview Details</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Position</p>
                <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{interviewDetails.jobPosition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Experience Level</p>
                <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{interviewDetails.jobExperience} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Questions</p>
                <p className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{summary.totalReports}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Job Description</p>
              <p className="text-gray-700 dark:text-gray-300 mt-1 transition-colors duration-300">{interviewDetails.jobDesc}</p>
            </div>
          </CardContent>
        </Card>

        {/* Overall Performance */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400 transition-colors duration-300" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Overall Performance</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Score */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg transition-colors duration-300 border border-blue-200 dark:border-blue-800">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(summary.averageScore).split(' ')[0]} dark:brightness-125 transition-colors duration-300`}>
                  {summary.averageScore}/100
                </div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Badge className={`${summary.grade.color === 'green' ? 'bg-green-500 dark:bg-green-600' : 
                    summary.grade.color === 'blue' ? 'bg-blue-500 dark:bg-blue-600' : 
                    summary.grade.color === 'indigo' ? 'bg-indigo-500 dark:bg-indigo-600' :
                    summary.grade.color === 'yellow' ? 'bg-yellow-500 dark:bg-yellow-600' :
                    summary.grade.color === 'orange' ? 'bg-orange-500 dark:bg-orange-600' : 'bg-red-500 dark:bg-red-600'} text-white transition-colors duration-300`}>
                    Grade {summary.grade.grade}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{summary.grade.description}</p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-300">Category Breakdown</h3>
                {Object.entries(summary.categoryAverages).map(([category, score]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300 transition-colors duration-300">{category}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white transition-colors duration-300">{score}/25</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 transition-colors duration-300">
                      <div 
                        className={`h-2 rounded-full ${getCategoryColor(score)} transition-all duration-500`}
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
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 transition-colors duration-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">Question-wise Analysis</h2>
          </div>

          {reports.map((report, index) => (
            <Card key={report.answerId} className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    Question {report.questionIndex + 1}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(report.score)} dark:brightness-110 transition-colors duration-300`}>
                    {report.score}/100
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Question:</h4>
                  <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg transition-colors duration-300">
                    {report.evaluation.question}
                  </p>
                </div>

                {/* Your Answer vs Expected Answer */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Your Answer:</h4>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg max-h-32 overflow-y-auto transition-colors duration-300 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{report.evaluation.userAnswer}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Expected Answer:</h4>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg max-h-32 overflow-y-auto transition-colors duration-300 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{report.evaluation.expectedAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg transition-colors duration-300">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 transition-colors duration-300">Score Breakdown:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                        {report.evaluation.technicalAccuracy}/25
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Technical</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                        {report.evaluation.completeness}/25
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Completeness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">
                        {report.evaluation.clarity}/25
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600 dark:text-orange-400 transition-colors duration-300">
                        {report.evaluation.relevance}/25
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Relevance</div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Feedback:</h4>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg transition-colors duration-300 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{report.evaluation.feedback}</p>
                  </div>
                </div>

                {/* Suggestions */}
                {report.evaluation.suggestions && report.evaluation.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-300">Suggestions for Improvement:</h4>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg transition-colors duration-300 border border-orange-200 dark:border-orange-800">
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 transition-colors duration-300">
                        {report.evaluation.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-orange-500 dark:text-orange-400 mr-2 transition-colors duration-300">•</span>
                            <span>{typeof suggestion === 'string' 
                                ? suggestion 
                                : suggestion.suggestion || suggestion.example || JSON.stringify(suggestion)
                              }</span>
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
            <Button className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300`} onClick={() => router.push('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer transition-all duration-300">
              Print Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;