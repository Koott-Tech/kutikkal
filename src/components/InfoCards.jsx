"use client";

import Image from "next/image";

export default function InfoCards({ cmsData = null, compact = false, hideIcons = false }) {
  const defaultItems = [
    {
      icon: "speech-bubble",
      iconColor: "purple",
      title: "Find licensed therapist to support your child's bigger emotions",
      description:
        "Child therapy provides a safe and nurturing space where children can express their feelings, build coping skills, and navigate challenges like anxiety, behavior issues, or school stress.",
      cta: "Find a therapist",
    },
    {
      icon: "pill",
      iconColor: "green",
      title: "Get clarity with experts for your child's needs and strengths",
      description:
        "Understanding your child’s strengths and challenges is the key to giving the right support. Assessments help identify learning, attention, or emotional concerns like ADHD or autism.",
      cta: "Book an assessment",
    },
    {
      icon: "combination",
      iconColor: "blue",
      title: "Learn strategies and tools to be a better parent that you always wanted to be",
      description:
        "Parenting doesn't come with a manual—but with expert guidance, you can develop effective techniques to manage behavior, communicate better, and support your child's emotions.",
      cta: "Start parent coaching",
    },
  ];

  const items = (cmsData?.items && Array.isArray(cmsData.items) && cmsData.items.length > 0)
    ? cmsData.items
    : defaultItems;

  const getIcon = (iconType) => {
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

  const sectionClassName = `mobile-section ${compact ? '' : 'min-h-[90vh]'} flex items-center justify-center pt-4 md:pt-6 pb-0 mb-0`;

  return (
    <section className={sectionClassName}>
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-section {
            margin-top: 8px !important;
          }
          .info-card {
            min-height: 180px !important;
            padding: 16px !important;
          }
          .info-card-title {
            font-size: 16px !important;
            line-height: 1.3 !important;
          }
          .info-card-description {
            font-size: 13px !important;
            line-height: 1.4 !important;
          }
          .info-card-cta {
            font-size: 14px !important;
          }
        }
      `}</style>
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 px-4 sm:px-6 md:px-8">
        {items.map((item) => (
          <div
            key={item.title}
            className="info-card flex min-h-[160px] md:min-h-[220px] flex-col rounded-[10px] border border-gray-200 bg-white p-3 sm:p-4 md:p-6 mx-1.5 sm:mx-0"
          >
            {/* Icon and Title */}
            <div className="flex flex-col items-start">
              {!hideIcons && (
                <div className="mb-3 md:mb-4">
                  {getIcon(item.icon)}
                </div>
              )}
              <h6 className="info-card-title text-left font-medium text-sm md:text-base">
                {item.title}
              </h6>
            </div>
            
            {/* Description */}
            <p className="info-card-description p1 mt-3 md:mt-4 text-xs md:text-sm">
              {item.description}
            </p>

            {/* Call to Action */}
            <div className="mt-auto pt-4 md:pt-6">
              <a
                href={item.ctaLink || item.link || '#'}
                className="info-card-cta flex items-center justify-between text-sm md:text-base text-gray-900 group"
              >
                <h6 className="transition-all group-hover:font-semibold">{item.cta}</h6>
                <span className="text-base md:text-lg group-hover:scale-125 group-hover:translate-x-1 transition-all duration-200 ease-out">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


