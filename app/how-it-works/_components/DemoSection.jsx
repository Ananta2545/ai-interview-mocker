"use client";

import { Play, CheckCircle } from 'lucide-react';

const DemoSection = () => {
  const highlights = [
    'AI generates realistic interview questions',
    'Record answers via text or voice input',
    'Get instant feedback and improvement tips',
    'Track your progress with detailed analytics',
    'Practice with customizable time limits',
    'Prepare for any role or industry',
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Demo video placeholder */}
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 aspect-video">
              {/* Video placeholder */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-purple-600">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                  <p className="text-white font-semibold text-lg">Watch Demo</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              See It In Action
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Experience the power of AI-driven interview preparation. Our platform simulates 
              real interview scenarios and provides comprehensive feedback to help you improve.
            </p>

            {/* Highlights list */}
            <ul className="space-y-4">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
