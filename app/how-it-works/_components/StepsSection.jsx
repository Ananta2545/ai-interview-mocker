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
    <section className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                <div className="hidden lg:block absolute top-20 left-1/2 w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 z-0" />
              )}

              {/* Step card */}
              <div className="relative bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 z-10">
                {/* Step number badge */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${step.gradient} text-white font-bold text-lg mb-4`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <step.icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
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
