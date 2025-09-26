"use client";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Progress } from "../../../../../components/ui/progress";
import { ArrowRight, CheckCircle, Clock, SkipForwardIcon, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const QuizPage = ({ params }) => {
  const [quiz, setQuiz] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { quizId } = use(params); // NO use(params), params is already an object
  const {user, isLoaded} = useUser();
  useEffect(() => {
    if (isLoaded) { // Wait for user to load
      fetchQuiz();
    }
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (!quiz || showResult) return;
    if (timeLeft > 0 && selectedOption === null) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedOption === null) {
      handleSkip();
    }
  }, [timeLeft, showResult, selectedOption, quiz]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`);
      const data = await response.json();

      if (data.success) {
        const questions = data.quiz.questions.map((q) => ({
          ...q,
          questionText: q.questionText || q.text || "Undefined question",
          options: q.options || [],
          correctAnswer: q.correctAnswer || null,
        }));

        setQuiz({
          ...data.quiz,
          questions,
          timeLimit: 60,
        });
        setTimeLeft(60);
      } else {
        alert("Quiz not found");
        router.push("/dashboard/questions");
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      router.push("/dashboard/questions");
    } finally {
      setLoading(false);
    }
  };

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
    setAnswers({
      ...answers,
      [currentQuestion]: {
        questionId: currentQ.id,
        selected: null,
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
      alert('User not authenticated');
      router.push('/sign-in');
      return;
    }
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
      if (data.success) {
        router.push(`/dashboard/questions/results/${data.resultId}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Fix: Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please sign in to take the quiz</p>
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
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-lg font-semibold">
              <Clock className="w-5 h-5 mr-2" />
              {timeLeft}s
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6">{currentQ.questionText}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              let buttonClass =
                "w-full p-4 text-left border-2 rounded-lg transition-all ";

              if (selectedOption === null) {
                buttonClass +=
                  "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              } else if (option === currentQ.correctAnswer) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (
                selectedOption === index &&
                currentQ.options[selectedOption] !== currentQ.correctAnswer
              ) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {selectedOption !== null &&
                      (option === currentQ.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : selectedOption === index &&
                        currentQ.options[selectedOption] !== currentQ.correctAnswer ? (
                        <XCircle className="w-6 h-6 text-red-600" />
                      ) : null)}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleSkip}
          disabled={selectedOption !== null}
        >
          <SkipForwardIcon className="w-4 h-4 mr-2" />
          Skip Question
        </Button>

        {selectedOption !== null && (
          <Button
            onClick={moveToNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion < quiz.questions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
