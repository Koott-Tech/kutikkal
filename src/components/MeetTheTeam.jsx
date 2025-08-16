"use client";

import Image from "next/image";

export default function MeetTheTeam() {
  return (
    <div className="px-[50px]">
      <section className="w-full mt-6 md:mt-8 mb-6 md:mb-8">
        <div className="w-full py-20">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 
              className="text-4xl font-medium lg:text-5xl mb-4"
              style={{
                color: '#1d1733',
                fontFamily: 'Scto Grotesk A Medium, Roboto, Arial, sans-serif',
                fontSize: '3.75rem',
                letterSpacing: '-0.195rem',
                lineHeight: '106%'
              }}
            >
              Meet our dedicated team guiding<br />
              our commitment to clinical excellence.
            </h2>
            <p className="text-xl text-black font-medium text-center">
              Clinical leadership
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Team Member 1 - Douglas Newton */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Douglas Newton, MD, MPH"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">
                   Douglas Newton, MD, MPH
                 </h3>
                 <p className="text-gray-600">Chief Medical Officer</p>
              </div>
            </div>

            {/* Team Member 2 - Rachelle Scott */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Rachelle Scott, MD"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">
                   Rachelle Scott, MD
                 </h3>
                 <p className="text-gray-600">National Medical Director</p>
              </div>
            </div>

            {/* Team Member 3 - April Bodily */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="April Bodily, NP"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">
                   April Bodily, NP
                 </h3>
                 <p className="text-gray-600">Associate National Medical Director</p>
              </div>
            </div>

            {/* Team Member 4 - Sandrine Pirard */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Sandrine Pirard, MD, MPH"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">
                   Sandrine Pirard, MD, MPH
                 </h3>
                 <p className="text-gray-600">Regional Medical Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
