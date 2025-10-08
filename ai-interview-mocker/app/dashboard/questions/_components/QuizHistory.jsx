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
      easy: "bg-green-100 text-green-700 border-green-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      hard: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[level.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
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
        <h2 className="text-2xl font-bold mb-6">Your Quiz History</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Your Quiz History</h2>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Brain className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No quizzes yet
            </h3>
            <p className="text-gray-500">
              Create your first quiz above to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Your Quiz History</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card
            key={quiz.id}
            className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
          >
            <CardContent className="p-6">
              {/* Header with topic and difficulty */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    {quiz.topic}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      quiz.level
                    )}`}
                  >
                    {quiz.level.toUpperCase()}
                  </span>
                </div>

                {/* Completion badge */}
                {quiz.completed && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                    <Trophy className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              {/* Quiz details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="w-4 h-4" />
                  <span>{quiz.questionCount} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.timeLimit || 60}s per question</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(quiz.createdAt)}</span>
                </div>
              </div>

              {/* Score display if completed */}
              {quiz.completed && quiz.score !== null && (
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Your Score:
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      {quiz.score}/{quiz.totalQuestions}
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-purple-600 h-full transition-all duration-500"
                      style={{
                        width: `${(quiz.score / quiz.totalQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRetake(quiz.id)}
                  className="flex-1 bg-primary hover:bg-primary/90"
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
                    className="flex-1 border-primary text-primary hover:bg-primary/10"
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
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  size="sm"
                  disabled={deletingId === quiz.id}
                >
                  {deletingId === quiz.id ? (
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Quiz</h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this quiz?
              </p>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-gray-900">{quizToDelete.topic}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(quizToDelete.level)}`}>
                    {quizToDelete.level.toUpperCase()}
                  </span>
                  <span>{quizToDelete.questionCount} Questions</span>
                </div>
              </div>
              <p className="text-sm text-red-600 mt-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                This action cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <Button
                onClick={handleCancelDelete}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
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
