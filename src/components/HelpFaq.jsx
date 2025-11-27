"use client";
import Image from "next/image";
import { useState } from "react";

const DATA = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I know if my child needs counselling?",
        a: "Look out for changes in behavior, emotions, or daily routines — such as frequent sadness, anxiety, anger, withdrawal, or school difficulties. Counselling can help even if challenges seem small.",
      },
      {
        q: "Are your sessions online or in-person?",
        a: "Our online sessions make it easy for families to access expert support from the comfort of their homes.",
      },
      {
        q: "How long is a counselling session?",
        a: "50-60 minutes.",
      },
    ],
  },
  {
    title: "Understanding assessments",
    items: [
      {
        q: "What kind of assessments do you offer?",
        a: "We offer emotional, intelligence, projective, ADHD and behavioral assessments to understand your child's strengths, challenges, and needs.",
      },
      {
        q: "Will I be involved in my child's therapy?",
        a: "Yes! We believe parents play a key role. We'll share progress updates and provide parenting strategies to support your child at home.",
      },
      {
        q: "Is therapy confidential?",
        a: "Yes, your child's privacy is very important to us. We share updates with parents only in ways that are helpful and supportive.",
      },
    ],
  },
];

export default function HelpFaq({ cmsData = null }) {
  // Track open item as "categoryIndex-questionIndex"
  const [openId, setOpenId] = useState("");

  // Use CMS data if available, otherwise fall back to hardcoded data
  const faqData = cmsData && cmsData.faqs && cmsData.faqs.length > 0 ? 
    (() => {
      const customSections = [];

      if (cmsData.context !== 'better-parenting') {
        customSections.push({
          title: "Getting Started",
          items: cmsData.faqs.slice(0, 3).map(faq => ({
            q: faq.question,
            a: faq.answer
          }))
        });

        if (cmsData.faqs.length > 3) {
          customSections.push({
          title: "Understanding Therapy",
          items: cmsData.faqs.slice(3, 6).map(faq => ({
              q: faq.question,
              a: faq.answer
            }))
          });
        }
      } else {
        customSections.push({
          title: "Getting Started",
          items: cmsData.faqs.map(faq => ({
            q: faq.question,
            a: faq.answer
          }))
        });
      }

      return customSections.length > 0 ? customSections : DATA;
    })() : DATA;

  // Get the left image from CMS data or use default
  const leftImageUrl = cmsData?.leftImageUrl || "/footerfaq copy.webp";

  return (
    <section className="w-full px-4 lg:px-6 mt-8 lg:mt-24">
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .help-faq-heading {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 0.95 !important;
            text-align: left !important;
          }
          .help-faq-subheading {
            text-align: left !important;
          }
          .help-faq-description {
            text-align: left !important;
          }
          .faq-section-title {
            text-align: left !important;
          }
          /* Force smaller answer text on mobile */
          .faq-answer {
            font-size: 11px !important;
            line-height: 1.4 !important;
          }
          /* Reduce margin-bottom for last FAQ section in mobile */
          .faq-section:last-child {
            margin-bottom: 1rem !important;
          }
          /* Ensure parent container aligns content to left */
          .help-faq-left-column {
            align-items: flex-start !important;
          }
          /* Left align image in mobile view - match text alignment exactly */
          .help-faq-image-container {
            margin-left: 0 !important;
            margin-right: auto !important;
            align-self: flex-start !important;
            width: 280px !important;
            max-width: 280px !important;
            margin-inline-start: 0 !important;
            margin-inline-end: auto !important;
          }
          /* Force image to align with heading text - remove any centering */
          .help-faq-left-column .help-faq-image-container {
            margin-left: 0 !important;
            padding-left: 0 !important;
            left: 0 !important;
            transform: translateX(0) !important;
            margin-inline-start: 0 !important;
            padding-inline-start: 0 !important;
          }
          /* Compensate for parent's ml-2 (8px) and px-2 (8px) to align with text */
          @media (max-width: 767px) {
            .help-faq-left-column .help-faq-image-container {
              margin-left: -16px !important; /* Pull back to match text alignment (ml-2 + px-2 = 16px) */
            }
            /* Align FAQ section titles with image left alignment */
            /* Right column has ml-1 (4px) + px-2 (8px) = 12px, so move -12px to align with image at 0px */
            .faq-section-title {
              margin-left: -12px !important;
              padding-left: 0 !important;
            }
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .help-faq-image-container {
            margin-left: auto !important;
            margin-right: auto !important;
            align-self: center !important;
            width: 600px !important;
            max-width: 600px !important;
            height: 450px !important;
          }
          .help-faq-right-column {
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 600px !important;
          }
          .help-faq-left-column {
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 600px !important;
            align-items: flex-start !important;
            margin-top: 2rem !important;
          }
        }
      `}} />
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 lg:gap-8 px-0 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: Heading + link + image */}
        <div className="flex flex-col ml-2 md:ml-0 space-y-3 md:space-y-4 px-2 md:px-0 help-faq-left-column">
          <div className="space-y-1">
            <h3 className="help-faq-heading font-bold text-gray-900 text-left md:text-left text-base md:text-xl">
              Questions?
            </h3>
            <h4 className="help-faq-subheading text-gray-900 text-left md:text-left text-base md:text-lg">
              We're here to help
            </h4>
          </div>
          <div>
            <p className="help-faq-description text-sm md:text-base lg:text-lg text-left md:text-left">
              Visit our full <a className="underline font-medium" href="/faq">FAQ page</a> for more<br className="hidden md:block" />
              commonly asked questions.
            </p>
          </div>
                     <div className="relative mt-4 md:mt-6 max-w-[280px] md:w-[320px] md:mx-0 h-[160px] md:h-[240px] overflow-hidden rounded-2xl help-faq-image-container">
            <Image
              src={leftImageUrl}
              alt="Smiling people"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>

                 {/* Right column: Accordion FAQ */}
         <div className="help-faq-right-column mr-4 md:mr-8 lg:mr-12 w-full md:max-w-2xl ml-1 md:ml-0 px-2 md:px-0">
           {faqData.map((section, ci) => {
            const isLastSection = ci === faqData.length - 1;
            const spacingClasses = isLastSection ? 'mt-16 md:mt-3' : 'mt-3';
            return (
            <div key={section.title} className={`faq-section mb-6 md:mb-10 ${spacingClasses}`}>
              <h5 className={`faq-section-title ${section.title === "Understanding assessments" ? "mb-1" : "mb-1"} text-left md:text-left text-sm md:text-base lg:text-lg font-medium`}>
                {section.title}
              </h5>
              <div className="space-y-0">
                {section.items.map((item, qi) => {
                  const id = `${ci}-${qi}`;
                  const open = openId === id;
                  return (
                    <div key={id} className="border-b border-gray-200 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? "" : id)}
                        className="flex w-full items-center justify-between py-3 md:py-4 text-left hover:bg-white transition-colors px-2 md:px-0 cursor-pointer"
                      >
                        <span className="text-xs md:text-sm lg:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                          {item.q}
                        </span>
                        <Chevron className={`h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-800 transition-transform flex-shrink-0 ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          open ? "max-h-96 md:max-h-64 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-2 pb-3 md:px-0 md:pb-4">
                          <p className="faq-answer text-xs md:text-sm leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}

function Chevron({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
        clipRule="evenodd"
      />
    </svg>
  );
}


