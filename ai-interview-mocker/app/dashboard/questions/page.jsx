"use client";

// import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    const {user} = useUser();
    const router = useRouter();

    const handleSubmit = async(e)=>{
        e.preventDefault();
        if(!user){
            toast.error("No user found");
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
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Practice Quiz</h1>
                <p className="text-gray-600 text-lg">Test your knowledge with custom quizzes</p>
            </div>

            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-semibold text-center">Create Your Quiz</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* topic input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Topic</label>
                            <input type="text" value={formData.topic}
                                onChange={(e)=>{setFormData({...formData, topic: e.target.value})}}
                                placeholder="e.g., JavaScript"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                             />
                        </div>


                        {/* Difficulty input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                            <input
                                type="text"
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                placeholder="easy, medium, hard"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>

                        {/* Number of questions input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Number of Questions</label>
                            <input
                                type="number"
                                value={formData.questionCount}
                                onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                                min={1}
                                max={50}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>

                        {/* Time Limit Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Time per Question (seconds)</label>
                            <input
                                type="number"
                                value={formData.timeLimit}
                                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                                min={10}
                                max={60}
                                className="w-full border border-gray-300 rounded-lg p-2"
                                required
                            />
                        </div>
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-lg py-3"
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