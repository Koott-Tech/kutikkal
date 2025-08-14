"use client";

import Image from 'next/image';

export default function BenefitsSection() {
  return (
    <section className="w-full bg-white h-screen">
      <div className="mx-auto max-w-[1400px] pl-8 pr-16">
        {/* Header */}
        <div className="text-center mb-20 mt-24">
          <h2 className="text-4xl md:text-5xl font-medium text-black">
            Benefits of individual therapy
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Section - Image */}
          <div className="flex justify-start -mt-4">
            <div className="relative w-[500px] h-[500px]">
              <Image
                src="/rightside5th.png"
                alt="Individual therapy benefits illustration"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Section - Benefits List */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Row 1 */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-2">Develop coping skills</h3>
                  <p className="text-black">Gain tools and strategies for managing stress and anxiety.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-2">Improve emotional wellbeing</h3>
                  <p className="text-black">Therapy builds greater emotional regulation and awareness, helping to replace negative thought patterns with healthy habits.</p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-2">Reduce mental health symptoms</h3>
                  <p className="text-black">Talk therapy can help you manage symptoms linked to conditions like anxiety, depression, OCD, and eating disorders.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-3">Get personalized support</h3>
                  <p className="text-black">Connect one-on-one with an expert who can develop a treatment plan to meet your specific needs and goals.</p>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-2">Bolster self-esteem</h3>
                  <p className="text-black">Strengthen your sense of self-worth and break patterns of negative self talk.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-2.5 h-2.5 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-black text-lg mb-2">Strengthen relationships</h3>
                  <p className="text-black">Build stronger communication skills that can lead to more fulfilling personal and romantic relationships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
