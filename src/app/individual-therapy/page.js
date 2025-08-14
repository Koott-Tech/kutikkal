"use client";

import Image from "next/image";
import LogosStrip from '@/components/LogosStrip';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';

export default function IndividualTherapyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="w-full">
        <section className="w-full">
          <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-teal-50">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[690px]">
              {/* Left side - Content Area */}
              <div className="p-8 md:p-12 pl-12 space-y-8 flex flex-col justify-center h-full">
                <h1 className="text-4xl  md:text-5xl  lg:text-6xl font-medium text-gray-900 leading-none">
                  Take the first step, individual therapy through Rula.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-normal font-normal">
                  Rula makes it simple to take the first step towards better mental health. Explore licensed, in-network therapists online who specialize in your unique needs.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-4 rounded-full transition-colors duration-200 shadow-lg">
                    Get started
                  </button>
                  
                  <div className="flex items-center gap-2 text-gray-700 font-normal cursor-pointer hover:text-teal-600 transition-colors duration-200">
                    <span>See how it works</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Feature List */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-normal">15,000+ licensed providers to match your unique needs</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-normal">Meet with a therapist via live video as soon as tomorrow</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-normal">Rula patients pay an average of $15 per session using insurance</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - Image Area */}
              <div className="relative h-full">
                <div className="absolute inset-0">
                  <Image
                    src="/kids.png"
                    alt="Children in therapy session"
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <LogosStrip />
      <HowItWorks />
      
      {/* Benefits of Individual Therapy Section */}
      <section className="w-full py-16 px-[50px]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-20">
            Benefits of individual therapy
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            {/* Left Column - Image */}
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gray-100 lg:col-span-2">
              <Image
                src="/hero.png"
                alt="Therapist in video call"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            
            {/* Right Column - Benefits List */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Sub-column */}
                <div className="space-y-6">
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Develop coping skills</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Gain tools and strategies for managing stress and anxiety.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Reduce mental health symptoms</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Talk therapy can help you manage symptoms linked to conditions like anxiety, depression, OCD, and eating disorders.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Bolster self-esteem</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Strengthen your sense of self-worth and break patterns of negative self talk.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Sub-column */}
                <div className="space-y-6">
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Improve emotional wellbeing</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Therapy builds greater emotional regulation and awareness, helping to replace negative thought patterns with healthy habits.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Get personalized support</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Connect one-on-one with an expert who can develop a treatment plan to meet your specific needs and goals.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6 h-32">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Strengthen relationships</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Build stronger communication skills that can lead to more fulfilling personal and romantic relationships.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Types of Individual Therapy Section */}
      <section className="h-[140vh] py-16 px-20 bg-green-50 mx-10 mb-16">
        <div className="max-w-[1400px] mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-stretch h-full">
            {/* Left Column - Content */}
            <div className="lg:col-span-3 space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12">
                Types of individual therapy
              </h2>
              <div className="space-y-8">
                <div className="pt-6">
                  <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">Cognitive behavioral therapy (CBT)</h3>
                  <p className="text-gray-600 text-base leading-relaxed">Cognitive behavioral therapy focuses on the connection between people's thoughts, feelings, and behaviors to interrupt anxiety and other mental health challenges.</p>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">Dialectic behavioral therapy (DBT)</h3>
                  <p className="text-gray-600 text-base leading-relaxed">Focuses on building emotional regulation skills and encouraging participants to fully accept all parts of themselves — even their anxiety.</p>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">Eye movement desensitization and reprocessing (EMDR)</h3>
                  <p className="text-gray-600 text-base leading-relaxed">EMDR is a therapeutic technique that uses specific eye movements or tapping to help people process traumatic memories.</p>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">Acceptance and commitment therapy (ACT)</h3>
                  <p className="text-gray-600 text-base leading-relaxed">ACT is a mindfulness-based form of behavioral therapy. It can effectively treat depression, anxiety, psychosis, OCD, and health conditions like chronic pain.</p>
                </div>
              </div>
              
              <div className="pt-8">
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-8 py-4 rounded-full transition-colors duration-200 shadow-lg">
                  Get started
                </button>
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-100 lg:col-span-2">
              <Image
                src="/hero.png"
                alt="Therapy session"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
