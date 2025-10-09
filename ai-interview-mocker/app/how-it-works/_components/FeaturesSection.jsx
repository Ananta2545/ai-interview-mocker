"use client";

import { Zap, Target, BrainCircuit, Clock, Shield, TrendingUp } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant AI Feedback',
      description: 'Get detailed analysis and scores for every answer you provide in real-time.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Target,
      title: 'Role-Specific Questions',
      description: 'Questions tailored to your target job position and industry requirements.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BrainCircuit,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates realistic interview scenarios based on actual hiring trends.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Clock,
      title: 'Flexible Practice',
      description: 'Practice anytime, anywhere with customizable time limits and difficulty levels.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. Practice with complete peace of mind.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your improvement over time with detailed analytics and insights.',
      gradient: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to ace your next interview, powered by cutting-edge AI technology
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group cursor-pointer relative bg-white rounded-2xl border border-gray-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />

              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-5`}>
                <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
