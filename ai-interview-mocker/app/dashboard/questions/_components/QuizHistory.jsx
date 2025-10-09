"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
import {Card, CardContent} from '../../../../components/ui/card'
// import { Button } from "@/components/ui/button";
import {Button} from '../../../../components/ui/button'
import { 
  Brain, 
  Calendar, 
  Clock, 
  BarChart3, 
  Trophy,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  X
} from "lucide-react";
import toast from "react-hot-toast";

const QuizHistory = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const response = await fetch("/api/quiz/history");
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.quizzes);
      } else {
        toast.error("Failed to load quiz history");
      }
    } catch (error) {
      console.error("Error fetching quiz history:", error);
      toast.error("Failed to load quiz history");
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = (quizId) => {
    router.push(`/dashboard/questions/quiz/${quizId}`);
  };

  const handleViewResults = (quizId) => {
    router.push(`/dashboard/questions/results/${quizId}`);
  };

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!quizToDelete) return;

    setDeletingId(quizToDelete.id);
    setShowDeleteModal(false);
    
    try {
      const response = await fetch("/api/quiz/history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizId: quizToDelete.id }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Quiz deleted successfully");
        // Remove from local state
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete.id));
      } else {
        toast.error(data.error || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setDeletingId(null);
      setQuizToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  const getDifficultyColor = (level) => {
    const colors = {
      easy: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
      hard: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    };
    return colors[level.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Your Quiz History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-blue-400 transition-colors duration-300"></div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Your Quiz History</h2>
        <Card className="border-dashed bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 transition-all duration-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4 transition-colors duration-300" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
              No quizzes yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">
              Create your first quiz above to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Your Quiz History</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/20 dark:hover:border-blue-400/30 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-6">
              {/* Header with topic and difficulty */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300">
                    <Brain className="w-5 h-5 text-primary dark:text-blue-400 flex-shrink-0 transition-colors duration-300" />
                    <span className="truncate">{quiz.topic}</span>
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${getDifficultyColor(
                      quiz.level
                    )}`}
                  >
                    {quiz.level.toUpperCase()}
                  </span>
                </div>

                {/* Completion badge */}
                {quiz.completed && (
                  <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 dark:border-green-700 flex-shrink-0 transition-all duration-300">
                    <Trophy className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>

              {/* Quiz details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <BarChart3 className="w-4 h-4 flex-shrink-0" />
                  <span>{quiz.questionCount} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{quiz.timeLimit || 60}s per question</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{formatDate(quiz.createdAt)}</span>
                </div>
              </div>

              {/* Score display if completed */}
              {quiz.completed && quiz.score !== null && (
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-3 mb-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      Your Score:
                    </span>
                    <span className="text-2xl font-bold text-primary dark:text-blue-400 transition-colors duration-300">
                      {quiz.score}/{quiz.totalQuestions}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden transition-colors duration-300">
                    <div
                      className="bg-gradient-to-r from-primary to-purple-600 dark:from-blue-500 dark:to-purple-500 h-full transition-all duration-500"
                      style={{
                        width: `${(quiz.score / quiz.totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleRetake(quiz.id)}
                  className="flex-1 min-w-[120px] bg-primary dark:bg-blue-600 hover:bg-primary/90 dark:hover:bg-blue-500 transition-all cursor-pointer duration-300"
                  size="sm"
                  disabled={deletingId === quiz.id}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {quiz.completed ? "Retake" : "Continue"}
                </Button>
                
                {quiz.completed && (
                  <Button
                    onClick={() => handleViewResults(quiz.id)}
                    variant="outline"
                    className="flex-1 min-w-[120px] border-primary dark:border-blue-500 text-primary dark:text-blue-400 cursor-pointer hover:bg-primary/10 dark:hover:bg-blue-900/30 transition-all duration-300"
                    size="sm"
                    disabled={deletingId === quiz.id}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                )}

                <Button
                  onClick={() => handleDeleteClick(quiz)}
                  variant="outline"
                  className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 transition-all cursor-pointer duration-300 min-w-[40px]"
                  size="sm"
                  disabled={deletingId === quiz.id}
                >
                  {deletingId === quiz.id ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 dark:border-red-400 border-t-transparent transition-colors duration-300" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && quizToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700 transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-colors duration-300">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Delete Quiz</h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
                Are you sure you want to delete this quiz?
              </p>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary dark:text-blue-400 transition-colors duration-300" />
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{quizToDelete.topic}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-300 ${getDifficultyColor(quizToDelete.level)}`}>
                    {quizToDelete.level.toUpperCase()}
                  </span>
                  <span>{quizToDelete.questionCount} Questions</span>
                </div>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-4 flex items-center gap-2 transition-colors duration-300">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>This action cannot be undone.</span>
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl transition-all duration-300">
              <Button
                onClick={handleCancelDelete}
                variant="outline"
                className="flex-1 cursor-pointer dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 text-white transition-all duration-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Quiz
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
