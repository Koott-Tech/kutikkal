"use client";

import Image from "next/image";

export default function InfoCards({ cmsData = null, compact = false, hideIcons = false, isCmsPage = false }) {
  const defaultItems = [
    {
      icon: "speech-bubble",
      iconColor: "purple",
      title: "Find Licensed Child Psychologists to Support Your Child's Emotions",
      description:
        "Child therapy provides a safe and nurturing space where children can express their feelings, build coping skills, and navigate challenges like anxiety, behavior issues, or school stress.",
      cta: "Find a therapist",
    },
    {
      icon: "pill",
      iconColor: "green",
      title: "Get Expert Guidance to Understand Your Child's Needs & Strengths",
      description:
        "Understanding your child’s strengths and challenges is the key to giving the right support. Child Assessments help identify learning, attention, or emotional concerns like ADHD or autism.",
      cta: "Book an assessment",
    },
    {
      icon: "combination",
      iconColor: "blue",
      title: "Learn Parenting Counseling Strategies to Support Your Child Better",
      description:
        "Parenting doesn’t come with a manual—but with supportive parenting counseling, you can learn effective ways to manage behaviour, communicate better, and understand your child’s emotions.",
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

  const sectionClassName = `mobile-section ${compact ? '' : (isCmsPage ? '' : 'min-h-[90vh]')} flex ${isCmsPage ? '' : 'items-center'} justify-center ${isCmsPage ? 'mt-0 info-cards-cms-mobile' : 'mt-2'}`;

  return (
    <section className={sectionClassName}>
      <style jsx>{`
        /* Override global h2 styles with h6 styles from globals.css (lines 74-76) */
        .info-card-title {
          font-size: 18px !important;
          line-height: 1.5rem !important;
          letter-spacing: -0.65px !important;
        }
        .info-cards-cms-mobile {
          margin-top: 0 !important;
          padding-top: 4rem !important;
          padding-bottom: 2rem !important;
        }
        @media (min-width: 768px) {
          .info-cards-cms-mobile {
            padding-top: 12rem !important;
            padding-bottom: 12rem !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1180px) and (max-height: 1180px) {
          .info-card {
            min-height: 200px;
            padding: 20px;
            /* On tablet, keep card width similar to laptop card width and center it */
            max-width: 520px;
            margin-left: auto;
            margin-right: auto;
          }
          .info-card-title {
            font-size: 18px !important;
            line-height: 1.25rem !important;
            letter-spacing: -0.65px !important;
          }
          .info-card-description {
            font-size: 14px;
            line-height: 1.45;
          }
          .info-card-cta {
            font-size: 15px;
          }
        }
        @media (max-width: 767px) {
          .info-card {
            min-height: 180px;
            padding: 16px;
          }
          .info-card-title {
            font-size: 20px !important;
            line-height: 1.5rem !important;
            letter-spacing: -0.65px !important;
          }
          .info-card-description {
            font-size: 13px;
            line-height: 1.4;
          }
          .info-card-cta {
            font-size: 14px;
          }
        }
      `}</style>
      <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 px-4 sm:px-6 md:px-8">
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
              <h2 className="info-card-title text-left font-medium text-sm md:text-base" suppressHydrationWarning>
                {item.title}
              </h2>
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


