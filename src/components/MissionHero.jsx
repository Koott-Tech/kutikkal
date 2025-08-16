import React from 'react';

export default function MissionHero() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-purple-50 to-purple-100 flex flex-col">
      {/* Row 1: Header Content */}
      <div className="flex flex-col items-center px-6 pt-16 text-center">
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6 max-w-4xl"
          style={{ color: '#1d1733' }}
        >
          Our mission is to make<br />
          mental healthcare work for everyone.
        </h1>
        
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl leading-relaxed">
          Creating a future where high-quality mental healthcare is the standard for all.
        </p>
      </div>

      {/* Row 2: Button */}
      <div className="flex justify-center items-center w-full mb-8">
        <button 
          className="px-8 py-3 bg-[#1d1733] text-white font-normal text-sm rounded-full hover:bg-[#151028] transition-colors duration-200 shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
