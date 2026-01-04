"use client";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import {Button} from "../../../components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import QuizHistory from "./_components/QuizHistory";

const QuestionsPage = ()=>{
    const [formData, setFormData] = useState({
        topic: '',
        difficulty: 'medium',
        questionCount: 10,
        timeLimit: 15
    });

    const [loading, setLoading] = useState(false);
    const {user, isLoaded} = useUser();
    const router = useRouter();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!isLoaded){
            toast.error("Loading user data...");
            return;
        }
        if(!user){
            toast.error("Please sign in to start a quiz");
            return;
        }
        setLoading(true);

        try{
            const response = await fetch('/api/quiz/generate', {
                method: "POST",
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    topic: formData.topic,
                    level: formData.difficulty,
                    numQuestions: formData.questionCount,
                    timeLimit: formData.timeLimit
                })
            })

            const data = await response.json();

            if(data.success){
                router.push(`/dashboard/questions/quiz/${data.quizId}`);
            }else{
                // Better error messages
                if (response.status === 503) {
                    toast.error('AI service is currently overloaded. Please try again in a few moments.');
                } else {
                    toast.error(data.error || 'Failed to generate quiz');
                }
            }

        }catch(error){
            console.error('Error generating quiz:', error);
            toast.error('Failed to generate quiz. Please try again.');
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="max-w-2xl mx-auto space-y-8 p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Practice Quiz</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg transition-colors duration-300">Test your knowledge with custom quizzes</p>
            </div>

            <Card className="shadow-xl dark:shadow-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-t-lg border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white transition-colors duration-300">Create Your Quiz</h2>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* topic input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Topic</label>
                            <input type="text" value={formData.topic}
                                onChange={(e)=>{setFormData({...formData, topic: e.target.value})}}
                                placeholder="e.g., JavaScript"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                required
                             />
                        </div>


                        {/* Difficulty input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Difficulty Level</label>
                            <input
                                type="text"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                placeholder="easy, medium, hard"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Number of questions input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Number of Questions</label>
                            <input
                                type="number"
                                value={formData.questionCount}
                                onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                                min={1}
                                max={50}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                required
                            />
                        </div>

                        {/* Time Limit Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Time per Question (seconds)</label>
                            <input
                                type="number"
                                value={formData.timeLimit}
                                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                                min={10}
                                max={60}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                                required
                            />
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-lg py-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            disabled={!formData.topic || !formData.difficulty || !formData.questionCount || loading}
                            >
                            {loading ? 'Generating Quiz...' : 'Start Quiz'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Quiz History Section */}
            <QuizHistory />
        </div>
    )

};
export default QuestionsPage;