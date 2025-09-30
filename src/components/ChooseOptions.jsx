"use client";

import Image from "next/image";

export default function ChooseOptions() {
  const cards = [
    {
      id: 1,
      tags: ["Counselling", "Emotions"],
      title: "Child\nCounselling",
      description: "We provide a safe space for children to share and grow.",
      image: "/girl1.png",
      // gradient removed in favor of background image
      gradient: "",
      bgImage: "/6.png", // Our promise second FAQ background image
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black",
      },
      imageClass: "object-cover object-[50%_100%]",
    },
    {
      id: 2,
      tags: ["Assessments", "Tests"],
      title: "Child\nAssessment",
      description: "Reveal your child's strengths and needs for growth.",
      image: "/boy1.png",
      gradient: "",
      bgImage: "/faq1.png",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black",
      },
    },
    {
      id: 3,
      tags: ["Parents", "Workshops"],
      title: "Better\nParenting",
      description: "Build stronger bonds and nurturing home.",
      image: "/fam1.png",
      gradient: "",
      bgImage: "/7.png",
      tagColors: {
        primary: "bg-white text-black",
        secondary: "bg-white text-black",
      },
    },
  ];

  return (
    <section className="w-full py-2 px-4 md:px-6 mt-20">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center md:text-left mb-6 max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-2 leading-tight">Let us guide you.</p>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight leading-none">
            Choose your options to get started
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgImage ? "relative" : ""} ${card.bgImage ? "" : `bg-gradient-to-b ${card.gradient}`} overflow-hidden flex flex-col h-[600px] rounded-[10px]`}
            >
              {/* Stretched, rotated background for first card */}
              {card.bgImage && (
                <>
                  <style jsx>{`
                    .choose-stretched-bg {
                      position: absolute;
                      inset: 0;
                      transform: rotate(90deg) scale(2.0);
                      transform-origin: center;
                      width: 220%;
                      height: 120%;
                      left: -60%;
                      top: -10%;
                      background-size: cover !important;
                      background-position: center center !important;
                      background-repeat: no-repeat !important;
                      z-index: 0;
                    }
                    @media (max-width: 1023px) {
                      .choose-stretched-bg {
                        transform: rotate(90deg) scale(2.3);
                        width: 240%;
                        height: 140%;
                        left: -70%;
                        top: -20%;
                      }
                    }
                  `}</style>
                  <div
                    className="choose-stretched-bg"
                    style={{ backgroundImage: `url('${card.bgImage}')` }}
                  />
                  {/* Bottom mask to hide overflow under inner image */}
                  <div
                    className="absolute left-0 right-0 bottom-0 z-0"
                    style={{ height: 'calc(20rem + 16px)', background: '#ffffff' }}
                  />
                </>
              )}

              {/* Card Content */}
              <div className="p-6 pb-0 mb-0 px-8 relative z-10">
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${card.tagColors.primary}`}>
                    {card.tags[0]}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${card.tagColors.secondary}`}>
                    {card.tags[1]}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-3xl md:text-4xl font-medium text-gray-900 mb-3 whitespace-pre-line leading-none"
                  style={{ fontWeight: 500 }}
                >
                  {card.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-tight mb-0">{card.description}</p>
              </div>

              {/* Image Section */}
              <div className="relative h-80 md:h-80 overflow-hidden mt-6 md:mt-4 w-full max-w-[260px] md:max-w-[300px] mx-auto rounded-[20px] z-10">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className={`${card.imageClass ? `${card.imageClass}` : "object-cover object-center md:object-[50%_100%]"} rounded-[20px]`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Read More Button */}
                <div className="absolute bottom-8 left-6">
                  <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-0 h-8 rounded-2xl text-base font-medium transition-all duration-200 flex items-center shadow-sm border border-white/20 overflow-hidden group">
                    <span className="px-3">Read more.</span>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#3e2e73] transition-colors duration-200">
                      <svg
                        className="w-3.5 h-3.5 group-hover:stroke-white group-hover:scale-110 transition-all duration-200"
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