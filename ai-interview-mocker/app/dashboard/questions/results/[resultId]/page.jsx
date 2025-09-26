"use client";
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Badge } from '../../../../../components/ui/badge';
import { Progress } from '../../../../../components/ui/progress';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  SkipForward,
  ArrowLeft,
  BarChart3,
  Award,
  TrendingUp,
  Calendar,
  Brain,
  Zap,
  RefreshCw
} from 'lucide-react';

const ResultsPage = ({ params }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const unwrappedParams = use(params);
  const resultId = unwrappedParams.resultId;

  useEffect(() => {
    if (isLoaded && resultId) {
      fetchResults();
    }
  }, [resultId, isLoaded]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching results for ID:', resultId);

      const response = await fetch(`/api/quiz/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      const data = await response.json();
      console.log('📊 API Response:', data);
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Failed to load results');
      }
    } catch (error) {
      console.error('❌ Error fetching results:', error);
      setError('Failed to load quiz results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-green-500', desc: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-400', desc: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B+', color: 'bg-blue-500', desc: 'Great Job!' };
    if (percentage >= 60) return { grade: 'B', color: 'bg-blue-400', desc: 'Good Work!' };
    if (percentage >= 50) return { grade: 'C', color: 'bg-yellow-500', desc: 'Keep Going!' };
    return { grade: 'D', color: 'bg-red-500', desc: 'Need Practice!' };
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "🎉 Outstanding performance! You've mastered this topic.";
    if (percentage >= 80) return "🌟 Excellent work! You have a strong understanding.";
    if (percentage >= 70) return "👍 Good job! You're on the right track.";
    if (percentage >= 60) return "📚 Not bad! A bit more practice will help.";
    if (percentage >= 50) return "💪 Keep practicing! You're making progress.";
    return "🎯 Don't give up! More practice will definitely help.";
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="p-8 text-center shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Analyzing Your Performance</h3>
        <p className="text-gray-600">Please wait while we compile your quiz results...</p>
      </Card>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md shadow-lg">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-red-600">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="flex space-x-3 justify-center">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={fetchResults}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );

  if (!results) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <Card className="p-8 text-center max-w-md shadow-lg">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
        <p className="text-gray-600 mb-4">We couldn't find the results for this quiz.</p>
        <Button onClick={() => router.push('/dashboard/questions')} className="bg-blue-600 hover:bg-blue-700">
          <Brain className="w-4 h-4 mr-2" />
          Take a New Quiz
        </Button>
      </Card>
    </div>
  );

  // Extract questions from API response
  const quizQuestions = results;

  const totalQuestions = quizQuestions.length;
  const correctAnswers = quizQuestions.filter(q => q.isCorrect).length;
  const incorrectAnswers = quizQuestions.filter(q => q.isCorrect === false).length;
  const skippedAnswers = quizQuestions.filter(q => q.userAnswer === null).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  const grade = getGrade(scorePercentage);
  const performanceMessage = getPerformanceMessage(scorePercentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Header */}
        <div className="text-center pt-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz Results
            </h1>
          </div>
        </div>

        {/* Main Score Card */}
        <Card className={`text-center ${getScoreBgColor(scorePercentage)} border-2 shadow-xl`}>
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                {scorePercentage >= 80 && (
                  <Award className="w-8 h-8 text-yellow-600 absolute -top-2 -right-2 animate-bounce" />
                )}
              </div>
            </div>

            <div className={`text-7xl font-bold mb-4 ${getScoreColor(scorePercentage)} drop-shadow-lg`}>
              {scorePercentage}%
            </div>

            <Badge className={`${grade.color} text-white text-xl px-6 py-2 mb-4 shadow-lg`}>
              Grade {grade.grade}
            </Badge>

            <h3 className="text-2xl font-semibold mb-2">{grade.desc}</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">{performanceMessage}</p>

            <div className="text-xl font-medium text-gray-700">
              <strong>{correctAnswers}</strong> out of <strong>{totalQuestions}</strong> questions correct
            </div>

            <div className="mt-6 max-w-md mx-auto">
              <Progress value={scorePercentage} className="h-4 shadow-sm" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>0%</span>
                <span className="font-medium">{scorePercentage}%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question by Question Review */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <h2 className="text-2xl font-semibold flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Detailed Review
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {quizQuestions.map((question, index) => {
              const userAnswer = question.userAnswer;
              const isCorrect = question.isCorrect;
              return (
                <div key={index} className="border-2 rounded-xl p-6 hover:shadow-md transition-all duration-300 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Question {index + 1}</h3>
                    <div className="flex items-center space-x-3">
                      {userAnswer === null ? (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <SkipForward className="w-3 h-3 mr-1" />
                          Skipped
                        </Badge>
                      ) : isCorrect ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                          <XCircle className="w-3 h-3 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">{question.questionText}</p>

                  <div className="space-y-3 mb-4">
                    {question.options.map((option, optionIndex) => {
                      const isUserChoice = userAnswer === option;
                      const isCorrectOption = question.correctAnswer === option;
                      let optionClass = "p-4 rounded-lg border-2 transition-all ";
                      if (isCorrectOption) {
                        optionClass += "bg-green-50 border-green-300 text-green-800";
                      } else if (isUserChoice && !isCorrect) {
                        optionClass += "bg-red-50 border-red-300 text-red-800";
                      } else {
                        optionClass += "bg-gray-50 border-gray-200";
                      }
                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option}</span>
                            <div className="flex items-center space-x-2">
                              {isUserChoice && (
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  Your Choice
                                </Badge>
                              )}
                              {isCorrectOption && <CheckCircle className="w-5 h-5 text-green-600" />}
                              {isUserChoice && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-8">
          <Button variant="outline" onClick={() => router.push('/dashboard')} className="flex items-center w-full sm:w-auto px-6 py-3 text-lg border-2 hover:bg-gray-50">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => router.push('/dashboard/questions')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto px-6 py-3 text-lg shadow-lg">
            <Brain className="w-5 h-5 mr-2" />
            Take Another Quiz
          </Button>
          <Button variant="outline" onClick={() => window.print()} className="w-full sm:w-auto px-6 py-3 text-lg border-2 hover:bg-gray-50">
            Save Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;