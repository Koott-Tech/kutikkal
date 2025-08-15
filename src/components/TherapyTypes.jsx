"use client";

import Image from 'next/image';

export default function TherapyTypes() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-[1400px] px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Section - Text Content */}
          <div className="pt-16 md:pt-20">
            <h1 className="text-5xl md:text-6xl font-semibold text-[#323232] leading-none mb-8">
              Types of individual<br />
              therapy
            </h1>
            
            <div className="space-y-8">
              {/* CBT Section */}
              <div>
                <h3 className="text-2xl font-semibold text-[#296662] mb-3">
                  Cognitive behavioral therapy (CBT)
                </h3>
                <p className="text-lg text-black leading-relaxed">
                  Focuses on the connection between thoughts, feelings, and behaviors to interrupt anxiety.
                </p>
              </div>

              {/* DBT Section */}
              <div>
                <h3 className="text-2xl font-semibold text-[#296662] mb-3">
                  Dialectic behavioral therapy (DBT)
                </h3>
                <p className="text-lg text-black leading-relaxed">
                  Emphasizes emotional regulation skills and acceptance of oneself, including anxiety.
                </p>
              </div>

              {/* EMDR Section */}
              <div>
                <h3 className="text-2xl font-semibold text-[#296662] mb-3">
                  Eye movement desensitization and reprocessing (EMDR)
                </h3>
                <p className="text-lg text-black leading-relaxed">
                  A therapeutic technique using eye movements or tapping to process traumatic memories.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex justify-center">
            <div className="relative w-[500px] h-[500px]">
              <Image
                src="/rightside5th.png"
                alt="Two women in therapy session"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
