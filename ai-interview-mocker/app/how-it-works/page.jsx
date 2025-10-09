import React from 'react';
import HeroSection from './_components/HeroSection';
import StepsSection from './_components/StepsSection';
import FeaturesSection from './_components/FeaturesSection';
import DemoSection from './_components/DemoSection';
import CTASection from './_components/CTASection';
import Header from '../dashboard/_components/Header';

export const metadata = {
  title: 'How It Works - AI Mock Interview',
  description: 'Learn how our AI-powered interview preparation platform works',
};

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header />
      <HeroSection />
      <StepsSection />
      <FeaturesSection />
      <DemoSection />
      <CTASection />
    </div>
  );
};

export default HowItWorksPage;
