import React from 'react';
import Image from 'next/image';

export default function WhyWereHere() {
  return (
    <section className="w-full py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-medium text-black leading-[1.1] md:leading-normal tracking-tight">
              This is where Little Care began
            </h2>
            
            <div className="space-y-6 text-[1.125rem] md:text-base text-gray-700 leading-[150%] md:leading-relaxed tracking-[-0.03375rem] md:tracking-tight">
              <p>
                Little Care was born from a simple truth — children deserve a space where their emotions
                are heard, understood, and cared for. As part of the Koott family, we saw how many
                families struggled to find the right kind of mental health support for their children.
                That’s when we decided to build something just for them.
              </p>

              <p>
                We started Little Care to make mental health care for children warm, accessible, and backed
                by science. From early assessments to child counseling and parenting guidance, every step we
                take is rooted in compassion and evidence-based care.
              </p>

              <p>
                For us, this isn’t just another initiative — it’s a promise.
              </p>

              <p>
                A promise to help every child grow with calm minds, kind hearts, and a little care.
              </p>

              <p>
                Thank you for trusting us to be part of your child’s journey.
              </p>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="relative w-full h-full">
            <div className="relative w-full aspect-square rounded-2xl">
              <div className="absolute inset-8 rounded-xl overflow-hidden">
                <Image
                  src="/aboutus1.webp"
                  alt="Why We're Here"
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
