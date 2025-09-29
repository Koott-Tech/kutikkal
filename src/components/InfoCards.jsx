"use client";

import Image from "next/image";

export default function InfoCards() {
  const items = [
    {
      icon: "speech-bubble",
      iconColor: "purple",
      title: "Find emotional support and guidance for your child with a licensed therapist",
      description:
        "Child therapy provides a safe and nurturing space where children can express their feelings, build coping skills, and navigate challenges like anxiety, behavior issues, or school stress.",
      cta: "Find a therapist",
    },
    {
      icon: "pill",
      iconColor: "green",
      title: "Get clarity with expert assessments for your child's needs",
      description:
        "Understanding your child's unique strengths and challenges is the first step to meaningful support. Professional assessments can identify learning difficulties, ADHD, autism spectrum concerns, or emotional struggles.",
      cta: "Book an assessment",
    },
    {
      icon: "combination",
      iconColor: "blue",
      title: "Learn strategies and tools to build stronger parent-child relationships",
      description:
        "Parenting doesn't come with a manual—but with expert guidance, you can develop effective techniques to manage behavior, communicate better, and support your child's emotional growth.",
      cta: "Start parent coaching",
    },
  ];

  const getIcon = (iconType, color) => {
    if (iconType === "speech-bubble") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <Image src="/therapy-icon.webp" alt="Therapy icon" width={24} height={24} className="w-6 h-6" />
        </div>
      );
    }
    if (iconType === "pill") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <Image src="/medication-mgmt-icon.webp" alt="Medication management icon" width={24} height={24} className="w-6 h-6" />
        </div>
      );
    }
    if (iconType === "combination") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <Image src="/therapy-med-mgmt-icon.webp" alt="Therapy + Medication icon" width={24} height={24} className="w-6 h-6" />
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mt-10 mobile-section">
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-section {
            margin-top: 8px !important;
          }
        }
      `}</style>
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-3 px-3 sm:px-8 md:px-[50px]">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[220px] flex-col rounded-[10px] border border-gray-200 bg-white p-6"
          >
            {/* Icon at the left top */}
            <div className="flex flex-col items-start">
              <div className="mb-4">
                {getIcon(item.icon, item.iconColor)}
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-medium leading-tight text-gray-900 text-left leading-none">
                {item.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {item.description}
            </p>

            {/* Call to Action */}
            <div className="mt-auto pt-6">
              <a
                href="#"
                className="flex items-center justify-between text-base font-normal text-gray-900 hover:text-gray-700 group"
              >
                <span>{item.cta}</span>
                <span className="text-lg group-hover:scale-125 group-hover:translate-x-1 transition-all duration-200 ease-out">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


