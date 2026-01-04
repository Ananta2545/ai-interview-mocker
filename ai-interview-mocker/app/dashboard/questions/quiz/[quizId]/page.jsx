"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Progress } from "../../../../../components/ui/progress";
import { ArrowRight, CheckCircle, Clock, SkipForwardIcon, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const QuizPage = ({ params }) => {
  const [quiz, setQuiz] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const unwrappedParams = use(params);
  const { quizId } = unwrappedParams;
  const {user, isLoaded} = useUser();


  useEffect(() => {
    if (isLoaded && quizId) {
      fetchQuiz();
    }
  }, [quizId, isLoaded]);

  // Timer - optimized to avoid unnecessary checks
  useEffect(() => {
    if (!quiz || showResult || selectedOption !== null) return;
    
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSkip();
    }
  }, [timeLeft, showResult, selectedOption, quiz]);

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();

      if (data.success) {
        const questions = data.quiz.questions.map((q) => ({
          ...q,
          id: q.id, // Explicitly ensure id is present
          questionText: q.questionText || q.text || "Undefined question",
          options: q.options || [],
          correctAnswer: q.correctAnswer || null,
        }));

        // Validate that all questions have IDs
        const invalidQuestions = questions.filter(q => !q.id);
        if (invalidQuestions.length > 0) {
          console.error("Some questions are missing IDs:", invalidQuestions);
          toast.error("Quiz data is incomplete. Please contact support.");
          router.push("/dashboard/questions");
          return;
        }

        // Use timeLimit from database, fallback to 60 if not set
        const quizTimeLimit = data.quiz.timeLimit || 60;

        setQuiz({
          ...data.quiz,
          questions,
          timeLimit: quizTimeLimit,
        });
        setTimeLeft(quizTimeLimit);
      } else {
        toast.error("Quiz not found");
        router.push("/dashboard/questions");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz");
      router.push("/dashboard/questions");
    } finally {
      setLoading(false);
    }
  }, [quizId, router]);

  const handleOptionSelect = (optionIndex) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const currentQ = quiz.questions[currentQuestion];
    const selectedText = currentQ.options[optionIndex];
    const isCorrect = selectedText === currentQ.correctAnswer;

    setAnswers({
      ...answers,
      [currentQuestion]: {
        questionId: currentQ.id,
        selected: selectedText,
        correct: isCorrect,
        timeSpent: quiz.timeLimit - timeLeft,
      },
    });

    setShowResult(true);

    setTimeout(() => {
      moveToNext();
    }, 2000);
  };

  const handleSkip = () => {
    const currentQ = quiz.questions[currentQuestion];
    setAnswers({
      ...answers,
      [currentQuestion]: {
        questionId: currentQ.id,
        selected: "", // Use empty string instead of null for database compatibility
        correct: false,
        timeSpent: quiz.timeLimit - timeLeft,
        skipped: true,
      },
    });
    moveToNext();
  };

  const moveToNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setTimeLeft(quiz.timeLimit);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      router.push('/sign-in');
      return;
    }
    
    // Validate answers before submitting
    const invalidAnswers = Object.entries(answers).filter(([key, answer]) => !answer.questionId);
    if (invalidAnswers.length > 0) {
      console.error("Some answers are missing questionId:", invalidAnswers);
      toast.error("Quiz data is incomplete. Please refresh and try again.");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          quizId: quizId,
          answers: answers,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to submit quiz');
      }
      
      if (data.success) {
        toast.success('Quiz submitted successfully!');
        // Keep submitting state true during redirect
        router.push(`/dashboard/questions/results/${data.resultId}`);
      } else {
        setSubmitting(false);
        toast.error(data.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmitting(false);
      toast.error(error.message || 'Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 transition-colors duration-300"></div>
      </div>
    );
  }

  // Fix: Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">Please sign in to take the quiz</p>
          <Button onClick={() => router.push('/sign-in')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }


  if (!quiz) return null;

  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              <Clock className="w-5 h-5 mr-2" />
              {timeLeft}s
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg dark:shadow-2xl transition-all duration-300">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">{currentQ.questionText}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 rounded-lg transition-all duration-300 ";

              if (selectedOption === null) {
                buttonClass +=
                  "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-md dark:hover:shadow-lg hover:scale-[1.02]";
              } else if (option === currentQ.correctAnswer) {
                buttonClass += "border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300";
              } else if (
                selectedOption === index &&
                currentQ.options[selectedOption] !== currentQ.correctAnswer
              ) {
                buttonClass += "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300";
              } else {
                buttonClass += "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {selectedOption !== null &&
                      (option === currentQ.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 transition-colors duration-300" />
                      ) : selectedOption === index &&
                        currentQ.options[selectedOption] !== currentQ.correctAnswer ? (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 transition-colors duration-300" />
                      ) : null)}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Skip Button - Only show if no answer selected */}
      {selectedOption === null && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all duration-300 cursor-pointer"
          >
            <SkipForwardIcon className="w-4 h-4 mr-2" />
            Skip Question
          </Button>
        </div>
      )}

      {/* Submission Loading Overlay */}
      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700 transition-colors">
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4 transition-colors duration-300" />
            <p className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200 transition-colors duration-300">
              Submitting your answers...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 transition-colors duration-300">
              Please wait while we process your quiz
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
