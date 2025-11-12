"use client";

import Image from "next/image";

export default function PersonalizedCare() {
  return (
    <section className="w-full flex items-center mt-16">
      <style jsx>{`
        @media (min-width: 768px) and (max-width: 1023px) {
          .personalized-care-heading {
            font-size: 32px;
            font-weight: 600;
            line-height: 1.1;
          }
        }
        @media (max-width: 767px) {
          .personalized-care-heading {
            font-size: 28px;
            font-weight: 600;
            line-height: 0.95;
          }
        }
      `}</style>
      <div className="w-full px-4 sm:px-6 md:px-0">
        {/* Header Section */}
        <div className="text-center mb-0 px-4">
          <h3 className="personalized-care-heading mb-0 mx-auto text-lg md:text-2xl lg:text-3xl" style={{ fontWeight: 500 }}>
            The care you need, whenever you need it
          </h3>
          <p className="p1 text-sm md:text-base lg:text-lg max-w-3xl mx-auto mt-3 md:mt-4">
          No matter where your journey begins, Little Care is here to create a safe, supportive, and open space for you and your little ones.
          </p>
        </div>

        {/* Main Content with Central Image */}
        <div className="flex items-center justify-center mt-6 md:-mt-4">
          {/* Central Large Image - Mobile optimized */}
          <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1100px] h-[200px] sm:h-[250px] md:h-[400px] lg:h-[500px] xl:h-[550px] rounded-2xl overflow-hidden mx-auto">
            <Image
              src="/Little Hope.webp"
              alt="Little Hope"
              width={1000}
              height={667}
              className="w-full h-full object-contain"
              sizes="(max-width: 640px) 400px, (max-width: 768px) 500px, (max-width: 1024px) 600px, (max-width: 1280px) 900px, 1100px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
