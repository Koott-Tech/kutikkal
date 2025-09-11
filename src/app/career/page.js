'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Career() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-x-hidden relative">
      <div className="relative z-10"></div>
      
      <section className="w-full min-h-screen bg-white flex flex-col items-center justify-center pt-16 pb-8 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-black text-center tracking-tight leading-tight max-w-4xl mb-6">
          Access to better mental health<br />
          care for everyone
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl font-normal mb-12">
          Let&apos;s work together to make mental healthcare work the way it should.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => {
              const element = document.getElementById('openings');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-purple-700 hover:bg-purple-800 text-white border-none rounded-full px-8 py-4 text-base font-semibold cursor-pointer transition-colors duration-200 shadow-lg w-full sm:w-auto"
          >
            See open positions
          </button>
          <button 
            onClick={() => router.push('/guide')}
            className="bg-purple-700 hover:bg-purple-800 text-white border-none rounded-full px-8 py-4 text-base font-semibold cursor-pointer transition-colors duration-200 shadow-lg w-full sm:w-auto"
          >
            Join our provider network
          </button>
        </div>
         
          
         
         {/* Why We're Here Section */}
         <div className="w-full bg-white py-16 mt-16">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-8">
             {/* Left Column - Text Content */}
             <div>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                 Why We&apos;re Here
               </h2>
               
               <div className="text-lg leading-relaxed text-gray-700 space-y-6">
                 <p>
                   Over 65 million Americans seek mental health help, but 2 out of 3 give up due to a broken and frustrating system.
                 </p>
                 
                 <p>
                   We must do better. Our team is on a mission to transform mental healthcare and make it accessible to everyone who needs it.
                 </p>
                 
                 <p>
                   We&apos;re building the future of mental healthcare - providing high-quality, affordable care from licensed professionals who truly care.
                 </p>
                 
                 <p>
                   Our team comes from diverse backgrounds, but we share one passion: helping people access the mental healthcare they deserve.
                 </p>
                 
                 <p>
                   We&apos;re inspired and energized by the impact we&apos;re making on the lives of those who entrust us with their care.
                 </p>
               </div>
             </div>
             
             {/* Right Column - Image with Overlay Cards */}
             <div className="relative">
               <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl relative overflow-hidden">
                 {/* Golden Logo */}
                 <div className="absolute top-5 left-5 w-12 h-12 md:w-15 md:h-15 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center text-lg md:text-xl font-bold text-white z-10">
                   CM
                 </div>
                 
                 {/* Profile Cards Stack */}
                 <div className="absolute top-20 left-5 z-10">
                   {/* Card 1 - Isabella Parker */}
                   <div className="bg-white rounded-lg p-3 mb-2 shadow-lg flex items-center gap-3 w-48 md:w-52">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                       IP
                     </div>
                     <div>
                       <div className="font-semibold text-sm text-gray-900">
                         Isabella Parker
                       </div>
                       <div className="text-xs text-gray-600">
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                   
                   {/* Card 2 - Ariyah Richards */}
                   <div className="bg-white rounded-lg p-3 mb-2 shadow-lg flex items-center gap-3 w-48 md:w-52">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                       AR
                     </div>
                     <div>
                       <div className="font-semibold text-sm text-gray-900">
                         Ariyah Richards
                       </div>
                       <div className="text-xs text-gray-600">
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                   
                   {/* Card 3 - Kimber Bautista */}
                   <div className="bg-white rounded-lg p-3 mb-2 shadow-lg flex items-center gap-3 w-48 md:w-52">
                     <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                       KB
                     </div>
                     <div>
                       <div className="font-semibold text-sm text-gray-900">
                         Kimber Bautista
                       </div>
                       <div className="text-xs text-gray-600">
                         In-network • Accepting new patients
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* Placeholder for woman image */}
                 <div className="absolute right-0 bottom-0 w-3/5 h-full bg-gradient-to-br from-green-400 to-teal-400 flex items-center justify-center text-white text-4xl md:text-5xl">
                   👩‍💼
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* From our CEO Section */}
         <div className="w-full bg-white py-16 mt-8">
           <div className="max-w-6xl mx-auto px-8">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
               From our CEO
             </h2>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               {/* Left Column - Message */}
               <div>
                 <p className="text-lg md:text-xl leading-relaxed text-gray-700 mb-8">
                   Our mission is to make mental healthcare work for everyone and we can only achieve this by building, and nurturing, the strongest teams. Talent is my #1 priority, and I am grateful for our employees who could work anywhere but chose to be a part of Rula. Thank you for considering joining our team!
                 </p>
                 
                 <div className="text-xl md:text-2xl font-semibold text-gray-900 mt-8 font-serif">
                   Josh Bruno
                 </div>
               </div>
               
               {/* Right Column - CEO Photo */}
               <div className="flex justify-center items-center">
                 <div className="w-64 h-80 md:w-80 md:h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-5xl md:text-6xl relative overflow-hidden">
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                     👨‍💼
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* Our Values Section */}
         <div className="w-full bg-white py-16 mt-8">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-8">
             {/* Left Column - Visual Panel */}
             <div className="bg-gradient-to-br from-cyan-50 to-cyan-200 rounded-t-xl p-8 md:p-12 text-center relative min-h-96 flex flex-col justify-between">
               {/* Logo */}
               <div className="w-12 h-12 md:w-15 md:h-15 bg-gradient-to-br from-teal-700 to-teal-900 rounded-full mx-auto mb-8 flex items-center justify-center text-xl font-bold text-white">
                 ∞
               </div>
               
               {/* Text */}
               <div className="text-teal-700 text-xl md:text-2xl font-semibold leading-tight mb-8">
                 We can make real<br />progress together
               </div>
               
               {/* Chart Visualization */}
               <div className="flex items-end justify-center gap-2 h-24">
                 <div className="w-2 h-10 bg-cyan-200 rounded"></div>
                 <div className="w-2 h-15 bg-cyan-200 rounded"></div>
                 <div className="w-2 h-8 bg-cyan-200 rounded"></div>
                 <div className="w-2 h-20 bg-cyan-200 rounded"></div>
                 <div className="w-3 h-24 bg-teal-700 rounded relative">
                   <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-700 rounded-full"></div>
                 </div>
                 <div className="w-2 h-12 bg-cyan-200 rounded"></div>
                 <div className="w-2 h-18 bg-cyan-200 rounded"></div>
                 <div className="w-2 h-11 bg-cyan-200 rounded"></div>
               </div>
             </div>
             
             {/* Right Column - Values List */}
             <div>
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                 Our values
               </h2>
               
               <div className="space-y-6">
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Bias to Action
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Nobody else is more capable of solving this problem than you are right now.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Self-care
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Put your life jacket on before helping others.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Authenticity
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Be yourself and be open to others.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Camaraderie
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Take care of one another.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Transparency
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Be honest even if it&apos;s uncomfortable.
                   </p>
                 </div>
                 
                 <div>
                   <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                     Operational Rigor
                   </h3>
                   <p className="text-base text-gray-600 leading-relaxed">
                     Maintain high standards in everything we do.
                   </p>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         <div 
           id="openings"
           className="bg-gray-50 rounded-3xl p-8 md:p-10 max-w-4xl w-full mx-auto mt-8"
         >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Current Openings
          </h2>
          
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Licensed Clinical Psychologist
              </h3>
              <p className="text-gray-600 mb-3">
                Full-time • Remote • Competitive salary
              </p>
              <p className="text-gray-700 leading-relaxed">
                We&apos;re looking for experienced clinical psychologists to join our team and provide high-quality mental health care to our clients.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer mt-3 transition-colors duration-200">
                Apply Now
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Frontend Developer
              </h3>
              <p className="text-gray-600 mb-3">
                Full-time • Remote • Competitive salary
              </p>
              <p className="text-gray-700 leading-relaxed">
                Help us build and improve our platform to make mental health care more accessible and user-friendly.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer mt-3 transition-colors duration-200">
                Apply Now
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                Customer Success Manager
              </h3>
              <p className="text-gray-600 mb-3">
                Full-time • Remote • Competitive salary
              </p>
              <p className="text-gray-700 leading-relaxed">
                Help our clients get the most out of our platform and ensure they have a positive experience with our services.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer mt-3 transition-colors duration-200">
                Apply Now
              </button>
            </div>
          </div>
          
          <div className="text-center mt-10 p-8 bg-green-50 rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              Don&apos;t see a role that fits?
            </h3>
            <p className="text-gray-600 mb-5">
              We&apos;re always looking for talented individuals to join our team. Send us your resume and we&apos;ll keep you in mind for future opportunities.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white border-none rounded-lg px-6 py-3 text-base font-semibold cursor-pointer transition-colors duration-200">
              Send Resume
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
