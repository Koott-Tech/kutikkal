"use client";

import Image from "next/image";

export default function LeadershipTeam() {
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
              Advisory board
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the team shaping our unique approach to mental healthcare.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Josh Bruno - CEO */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Josh Bruno"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">Josh Bruno</h3>
                 <p className="text-gray-600">CEO</p>
              </div>
            </div>

            {/* Gabe Diop - Co-founder */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Gabe Diop"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">Gabe Diop</h3>
                 <p className="text-gray-600">Co-founder</p>
              </div>
            </div>

            {/* Mark Khavkin - CFO */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Mark Khavkin"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">Mark Khavkin</h3>
                 <p className="text-gray-600">Chief Financial Officer</p>
              </div>
            </div>

            {/* Tracey Scraba - General Counsel */}
            <div className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden">
                <Image
                  src="/doug.png"
                  alt="Tracey Scraba"
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                                 <h3 className="text-xl font-normal text-gray-900 mb-1">Tracey Scraba</h3>
                 <p className="text-gray-600">General Counsel</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
