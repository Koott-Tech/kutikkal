"use client";

import Image from "next/image";

export default function ChooseOptions() {
  const cards = [
    {
      id: 1,
      tags: ["Children", "Emotions"],
      title: "Child\nCounseling",
      description: "Support your child from the big emotion struggle",
      image: "/kids.png",
      gradient: "from-green-100 to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      }
    },
    {
      id: 2,
      tags: ["Children", "Tests"],
      title: "Child\nAssessment", 
      description: "Support your child from the big emotion struggle",
      image: "/kids.png",
      gradient: "from-purple-100 to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      }
    },
    {
      id: 3,
      tags: ["Parents", "Workshops"],
      title: "Better\nParenting",
      description: "Support your child from the big emotion struggle", 
      image: "/kids.png",
      gradient: "from-orange-100 to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      }
    }
  ];

  return (
    <section className="w-full py-16 px-4 md:px-6 mt-8 md:mt-12">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center md:text-left mb-12 max-w-4xl mx-auto">
          <p className="text-[18px] text-gray-600 mb-2 leading-tight">Let us guide you.</p>
          <h2 className="text-[32px] md:text-[48px] font-medium text-gray-900 tracking-tight leading-[1.1] md:leading-normal">
            Choose your options to get started
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`bg-gradient-to-b ${card.gradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300`}
            >
              {/* Card Content */}
              <div className="p-6 pb-4">
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${card.tagColors.primary}`}>
                    {card.tags[0]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${card.tagColors.secondary}`}>
                    {card.tags[1]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 whitespace-pre-line">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Image Section */}
              <div className="relative h-48 md:h-56 rounded-t-[30px] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Read More Button */}
                <div className="absolute bottom-3 left-6">
                  <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-0 h-8 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center shadow-sm border border-white/20 overflow-hidden">
                    <span className="px-3">Read more.</span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="#EDE8DD"
                        strokeOpacity="0.6"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
