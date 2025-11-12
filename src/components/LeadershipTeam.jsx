"use client";

import Image from "next/image";

export default function LeadershipTeam() {
  return (
    <div className="px-[50px]">
      <section className="w-full mt-24">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 
              className="text-[2.5rem] md:text-[3.75rem] font-medium md:font-[500] leading-[110%] md:leading-[106%] tracking-[-0.125rem] md:tracking-[-0.195rem] mb-4"
              style={{
                color: '#1d1733'
              }}
            >
              Leadership
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
                <h5 className="text-sm md:text-base font-medium text-gray-900 mb-1">Faisal Vysam Purath </h5>
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
                <h5 className="text-sm md:text-base font-medium text-gray-900 mb-1">Aswathy Usha Raman</h5>
                 <p className="text-gray-600">Chief Psycologist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
