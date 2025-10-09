"use client";

import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
import {Button} from '../../../components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  const router = useRouter();

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-purple-50/30 to-blue-50/30 dark:from-primary/10 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-purple-600 dark:from-blue-600 dark:to-purple-700 p-12 md:p-16 shadow-2xl transition-colors duration-300">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

          {/* Content */}
          <div className="relative text-center text-white">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium mb-6">
              <Sparkles size={16} className="animate-pulse" />
              <span>Start Your Journey Today</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Ace Your Next Interview?
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who improved their interview skills 
              with our AI-powered platform. Start practicing today!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-100 dark:text-blue-600 dark:hover:bg-white font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="ml-2" size={20} />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary dark:hover:text-blue-600 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                View Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap justify-center items-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckIcon />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple check icon component
const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default CTASection;
