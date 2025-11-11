"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import GuideModal from '@/components/GuideModal';

export default function MissionHero() {
  const [showGuide, setShowGuide] = useState(false);

  const handleGetStartedClick = () => {
    setShowGuide(true);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col">
        {/* Row 1: Header Content */}
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <h1 
            className="text-[2.5rem] md:text-4xl lg:text-5xl font-medium leading-[110%] md:leading-tight mb-6 max-w-4xl tracking-[-0.195rem]"
            style={{ color: '#1d1733' }}
          >
            Our mission is to make care <br /> feel closer, calmer, and real.
          </h1>
          
          <p className="text-[1rem] md:text-lg lg:text-xl text-gray-700 mb-8 max-w-4xl leading-[1.3rem] md:leading-relaxed">
          Because every child deserves care that truly connects.
          </p>
        </div>

        {/* Row 2: Button */}
        <div className="flex justify-center items-center w-full mb-8">
          <button 
            type="button"
            onClick={handleGetStartedClick}
            className="px-8 py-3 bg-[#3f2e73] text-white font-semibold text-sm rounded-full transition-colors duration-200 shadow-lg"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d1733'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3f2e73'; }}
          >
            Explore how we can help
          </button>
        </div>

        {/* Row 3: Hero Image */}
        <div className="flex-1 flex items-end justify-center px-6 pb-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src="/aboutushero.webp"
              alt="Our Mission"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      {showGuide && (
        <GuideModal open={showGuide} onClose={() => setShowGuide(false)} />
      )}
    </>
  );
}
