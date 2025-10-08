"use client";

import { Sparkles, TrendingUp, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 md:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50/30 to-blue-50/30 -z-10" />
      
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6 animate-fade-in">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI-Powered Interview Preparation</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-slide-up">
            Master Your Interviews with{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 mb-10">
            Practice with AI-generated questions, get instant feedback, and improve your interview skills 
            in a realistic environment. Your path to landing your dream job starts here.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { number: '10,000+', label: 'Practice Questions' },
              { number: '95%', label: 'Success Rate' },
              { number: '5,000+', label: 'Happy Users' },
              { number: '24/7', label: 'AI Available' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center transform transition-all duration-300 hover:scale-110"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
