import React from 'react';
import Image from 'next/image';

export default function WhyWereHere() {
  return (
    <section className="w-full py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Text Content */}
          <div className="space-y-6 ml-8 max-w-lg">
            <h2 className="text-4xl md:text-5xl font-medium text-black leading-tight tracking-tight">
              Why We're Here
            </h2>
            
            <div className="space-y-6 text-base text-gray-700 leading-relaxed tracking-tight">
              <p>
                Each year, more than 65 million Americans seek help for a mental health condition. 
                And due to a broken and frustrating system, 2 out of 3 of those individuals give up 
                before ever getting the help they need.
              </p>
              
              <p>
                We can do better. We <strong className="font-medium underline">must</strong> do better. 
                Our team is here to do just that.
              </p>
              
              <p>
                Our mission is to create a world where every person can access high-quality mental 
                health care. We recognize that mental health issues can be complex and multifaceted, 
                and we are dedicated to treating the whole person, not just the symptoms.
              </p>
              
              <p>
                We're building the future of mental health care; a comprehensive behavioral health 
                solution that helps every person access high quality care from a licensed professional, 
                at a time that works for them and at a cost they can afford.
              </p>
              
              <p>
                Our approach to care is evidence-based, outcome-driven and compassionate. 
                We empower our exceptional provider network to track progress throughout the care 
                journey to ensure clients achieve their full potential.
              </p>
            </div>
          </div>

          {/* Right Section - Image Collage */}
          <div className="relative ml-12 -mt-16">
            {/* Top Image - Larger, vertical */}
            <div className="relative w-80 h-[32rem] mx-auto">
              <Image
                src="/kids.png"
                alt="Young man with laptop and dog"
                fill
                className="object-cover rounded-2xl"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              
              {/* Small blue logo in top left */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center z-10">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>

            {/* Bottom Image - Smaller, horizontal, overlapping */}
            <div className="absolute -bottom-8 -left-8 w-80 h-60">
              <Image
                src="/rightside5th.png"
                alt="Woman reading a book"
                fill
                className="object-cover rounded-2xl"
                sizes="(min-width: 768px) 25vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
