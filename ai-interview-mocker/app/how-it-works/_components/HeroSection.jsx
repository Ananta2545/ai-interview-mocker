"use client";

import { Sparkles, TrendingUp, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50/30 to-blue-50/30 dark:from-primary/10 dark:via-purple-900/20 dark:to-blue-900/20 -z-10 transition-colors duration-300" />
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 dark:bg-primary/20 px-4 py-2 text-sm font-medium text-primary dark:text-blue-400 mb-6 animate-fade-in transition-colors duration-300">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI-Powered Interview Preparation</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-slide-up transition-colors duration-300">
            Master Your Interviews with{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Practice with AI-generated questions, get instant feedback, and improve your interview skills 
            in a realistic environment. Your path to landing your dream job starts here.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
