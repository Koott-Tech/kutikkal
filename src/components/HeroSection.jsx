"use client";

import Image from "next/image";

export default function HeroSection({ therapyType = "individual" }) {
  // Content configuration for different therapy types
  const content = {
    individual: {
      title: "Take the first step, individual therapy through Rula.",
      description: "Rula makes it simple to take the first step towards better mental\nhealth. Explore licensed, in-network therapists online who\nspecialise in your unique needs.",
      image: "/kids.png",
      alt: "Individual in therapy session"
    },
    couples: {
      title: "Take the first step,\ncouples therapy\nthrough Rula.",
      description: "Rula makes it simple to take the first step towards better relationship\nhealth. Explore licensed, in-network couples therapists online who\nspecialise in strengthening relationships.",
      image: "/kids.png",
      alt: "Couple in therapy session"
    },
    family: {
      title: "Take the first step,\nfamily therapy\nthrough Rula.",
      description: "Rula makes it simple to take the first step towards better family\nhealth. Explore licensed, in-network family therapists online who\nspecialise in improving family dynamics.",
      image: "/kids.png",
      alt: "Family in therapy session"
    },
    child: {
      title: "Take the first step,\nchild therapy\nthrough Rula.",
      description: "Rula makes it simple to take the first step towards better child\nmental health. Explore licensed, in-network child therapists online who\nspecialise in supporting children's emotional growth.",
      image: "/kids.png",
      alt: "Child in therapy session"
    },
    teen: {
      title: "Take the first step,\nteen therapy\nthrough Rula.",
      description: "Rula makes it simple to take the first step towards better teen\nmental health. Explore licensed, in-network teen therapists online who\nspecialise in adolescent development and challenges.",
      image: "/kids.png",
      alt: "Teen in therapy session"
    },
    psychiatry: {
      title: "Take the first step,\npsychiatry\nthrough Rula.",
      description: "Rula makes it simple to take the first step towards better mental\nhealth. Explore licensed, in-network psychiatrists online who\nspecialise in medication management and comprehensive care.",
      image: "/kids.png",
      alt: "Psychiatric consultation session"
    }
  };

  const currentContent = content[therapyType] || content.individual;

  return (
    <div className="w-full">
      <section className="w-full">
                 <div className="w-full md:rounded-2xl overflow-hidden bg-gradient-to-b from-blue-50 to-teal-50">
                     <div className="flex flex-col lg:grid lg:grid-cols-2 lg:items-start">
             {/* Content Area */}
                          <div className="p-8 md:p-12 pb-20 md:pb-24 pt-16 md:pt-20 mt-2 md:mt-21 space-y-6 order-1 lg:order-1">
                             <h1 className="text-[2.5rem] md:text-5xl lg:text-6xl font-medium text-[#123331] leading-[110%] md:leading-none md:whitespace-pre-line text-center md:text-left">
                 {currentContent.title}
               </h1>
              
                             <p className="text-base md:text-xl text-black leading-[150%] md:leading-tight font-normal md:font-normal tracking-[-0.0375rem] md:tracking-normal md:whitespace-pre-line" style={{ fontFamily: 'Scto Grotesk A Regular, Roboto, Arial, sans-serif' }}>
                {currentContent.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#296662] hover:bg-[#1f4f4a] text-white font-medium px-8 py-3 rounded-full transition-colors duration-200 shadow-lg">
                  Get started
                </button>
                
                                 <div className="flex items-center gap-2 text-[#123331] md:text-[#296662] font-normal cursor-pointer hover:text-teal-600 transition-colors duration-200 justify-center md:justify-start">
                  <span>See how it works</span>
                                     <svg className="w-4 h-4 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l5 5 5-5" />
                   </svg>
                   <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                   </svg>
                </div>
              </div>
              
              {/* Feature List */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                                     <span className="text-black font-normal" style={{ fontFamily: 'Scto Grotesk A Regular, Roboto, Arial, sans-serif' }}>15,000+ licensed providers to match your unique needs</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                                     <span className="text-black font-normal" style={{ fontFamily: 'Scto Grotesk A Regular, Roboto, Arial, sans-serif' }}>Meet with a therapist via live video as soon as tomorrow</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#296662] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#296662]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                                     <span className="text-black font-normal" style={{ fontFamily: 'Scto Grotesk A Regular, Roboto, Arial, sans-serif' }}>Rula patients pay an average of $15 per session using insurance</span>
                </div>
              </div>
            </div>
            
                         {/* Image Area - Below content on mobile, right side on desktop */}
             <div className="relative h-96 md:h-full order-2 lg:order-2">
               <div className="absolute inset-0">
                 <Image
                   src={currentContent.image}
                   alt={currentContent.alt}
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
