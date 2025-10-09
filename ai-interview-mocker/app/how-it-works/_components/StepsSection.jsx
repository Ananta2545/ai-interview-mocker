"use client";

import { UserPlus, Brain, MessageSquare, LineChart } from 'lucide-react';

const StepsSection = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your career goals, target roles, and experience level.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Generates Questions',
      description: 'Our advanced AI creates personalized interview questions based on your profile and job requirements.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: MessageSquare,
      title: 'Practice & Record',
      description: 'Answer questions via text or voice, just like in a real interview environment.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      number: '04',
      icon: LineChart,
      title: 'Get Instant Feedback',
      description: 'Receive detailed evaluations, scores, and improvement suggestions from our AI.',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            Get started in just four simple steps and transform your interview preparation
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection line (hidden on last step) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block cursor-pointer absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 z-0 transition-colors duration-300" />
              )}

              {/* Step card */}
              <div className="relative bg-white dark:bg-gray-800 cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg dark:shadow-2xl hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 z-10">
                {/* Step number badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} text-white font-bold text-lg mb-4`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <step.icon className="w-12 h-12 text-primary dark:text-blue-400 transition-colors duration-300" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
