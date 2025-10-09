import { Button } from "../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Brain, Video, MessageSquare, TrendingUp, Sparkles, CheckCircle, Users, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-bounce transition-colors duration-300">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Practice
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight transition-colors duration-300">
              Master Your
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 text-transparent bg-clip-text"> Interview Skills </span>
              with AI
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
              Practice mock interviews with AI, get real-time feedback, and ace your next job interview with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-400 px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950 dark:text-white">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-gray-700 dark:text-gray-300 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">10K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold">95% Success Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold">100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              Everything you need to prepare for your dream job interview
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">AI-Powered Questions</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Get personalized interview questions generated by advanced AI based on your job role and experience level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <Video className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Video Recording</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Record your answers with webcam and screen sharing to simulate real interview conditions and build confidence.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-pink-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Real-Time Feedback</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Receive instant AI feedback on your answers, including suggestions for improvement and best practices.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Monitor your improvement over time with detailed analytics and performance metrics for each interview.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Your data is encrypted and secure. Full screen sharing ensures a fair and monitored interview environment.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">Quick & Easy</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                Start practicing in minutes. No complex setup required. Just sign in and begin your interview preparation journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto transition-colors duration-300">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transition-colors duration-300">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Create Your Profile</h3>
              <p className="text-blue-100 dark:text-blue-200 transition-colors duration-300">
                Sign up and tell us about your job role, experience level, and interview goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transition-colors duration-300">
                <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Practice Interviews</h3>
              <p className="text-blue-100 dark:text-blue-200 transition-colors duration-300">
                Answer AI-generated questions while recording your responses with video and audio.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl transition-colors duration-300">
                <span className="text-4xl font-bold text-pink-600 dark:text-pink-400">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Get Feedback</h3>
              <p className="text-blue-100 dark:text-blue-200 transition-colors duration-300">
                Review AI-powered feedback and track your progress to continuously improve your skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">
            Ready to Ace Your Interview?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors duration-300">
            Join thousands of successful candidates who improved their interview skills with our AI-powered platform.
          </p>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800 text-white px-10 py-6 text-xl rounded-xl shadow-xl hover:shadow-2xl dark:shadow-2xl dark:hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 group">
              Start Practicing Now
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 transition-colors duration-300">
            © 2025 AI Interview Mocker. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link href="/how-it-works" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
              How It Works
            </Link>
            <Link href="/dashboard" className="text-gray-400 hover:text-white dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}