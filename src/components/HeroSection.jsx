"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="w-full">
      <section className="w-full">
                 <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-teal-50">
           <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
             {/* Left side - Content Area */}
             <div className="p-8 md:p-12 space-y-6">
                               <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-tight">
                  Take the first step, individual therapy through Rula.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-normal">
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
  );
}
