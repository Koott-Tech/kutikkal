"use client";

import Image from "next/image";

export default function ChooseOptions() {
  const cards = [
    {
      id: 1,
      tags: ["Counselling", "Emotions"],
      title: "Child\nCounselling",
      description: "Safe space for children to share and grow.",
      image: "/girl1.png",
      gradient: "from-[#DEEACB] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      },
      imageClass: "object-cover object-[50%_100%]"
    },
    {
      id: 2,
      tags: ["Assessments", "Tests"],
      title: "Child\nAssessment", 
      description: "Reveal your child's strengths and needs.",
      image: "/boy1.png",
      gradient: "from-[#EACBDE] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      }
    },
    {
      id: 3,
      tags: ["Parents", "Workshops"],
      title: "Better\nParenting",
      description: "Build stronger bonds and nurturing home.", 
      image: "/fam1.png",
      gradient: "from-[#EAE0CB] to-white",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black"
      },
      imageClass: "object-cover object-[50%_100%]"
    }
  ];

  return (
    <section className="w-full py-2 px-2 md:px-4 mt-20">
      <style jsx>{`
        @media (min-width: 768px) {
          .card-container {
            height: 500px !important;
            min-height: 500px !important;
            max-height: 500px !important;
            align-self: stretch !important;
          }
          .cards-grid {
            grid-template-rows: 500px !important;
            align-items: stretch !important;
          }
        }
      `}</style>
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center md:text-left mb-6 max-w-4xl mx-auto">
          <p className="p1 text-lg mb-2">Let us guide you.</p>
          <h3 className="text-xl md:text-2xl font-medium">
            Choose your options to get started
          </h3>
        </div>

        {/* Cards Grid */}
        <div className="cards-grid grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-20 max-w-4xl mx-auto items-stretch rounded-[37.8px]">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`card-container relative bg-white rounded-[20px] overflow-hidden flex flex-col h-[500px] min-h-[500px] max-h-[500px] flex-shrink-0`}
              style={{ height: '500px' }}
            >
              {/* Colored background that matches image width */}
              <div className={`absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b ${card.gradient} pointer-events-none z-0 rounded-[10px]`} />
              {/* White gradient overlay from half to bottom - matches image width on mobile */}
              <div className="absolute top-1/2 left-0 right-0 bottom-0 bg-gradient-to-b from-transparent to-white pointer-events-none z-0 rounded-b-[10px]" />
              {/* Card Content */}
              <div className="p-6 pb-0 mb-0 px-14 md:px-8 relative z-10">
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded-full font-light ${card.tagColors.primary}`} style={{ fontSize: '12px', lineHeight: '1', fontFamily: 'inherit' }}>
                    {card.tags[0]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-light ${card.tagColors.secondary}`} style={{ fontSize: '12px', lineHeight: '1', fontFamily: 'inherit' }}>
                    {card.tags[1]}
                  </span>
                </div>

                {/* Title */}
                <h5 className="text-3xl md:text-4xl font-medium text-gray-900 mb-1 whitespace-pre-line leading-none" style={{ fontWeight: 'bold' }}>
                  {card.title}
                </h5>

                {/* Description */}
                <p className="p1 text-sm mb-0" style={{ lineHeight: '1.2' }}>
                  {card.description}
                </p>
              </div>

              {/* Image Section */}
              <div className="absolute left-0 right-0 z-10 h-64 min-h-64 max-h-64 overflow-hidden rounded-[20px]" style={{ height: '256px', top: '180px' }}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={`${card.imageClass ? `${card.imageClass}` : "object-cover object-center md:object-[50%_100%]"}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Read More Button */}
                <div className="absolute bottom-8 left-6">
                  <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-0 h-8 rounded-2xl text-sm font-medium transition-all duration-200 flex items-center shadow-sm border border-white/20 overflow-hidden group">
                    <span className="px-3">Read more.</span>
                     <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#EAE4F4] transition-colors duration-200">
                      <svg
                        className="w-3.5 h-3.5 group-hover:scale-110 transition-all duration-200"
                        fill="none"
                        stroke="#000000"
                        strokeOpacity="0.6"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
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