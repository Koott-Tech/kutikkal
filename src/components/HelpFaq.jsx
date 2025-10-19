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
        a: "We currently provide online sessions to make support accessible and convenient for families anywhere.",
      },
      {
        q: "How long is a counselling session?",
        a: "Each session is typically 45–50 minutes, depending on the child's age and comfort level.",
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
      const midpoint = Math.ceil(cmsData.faqs.length / 2);
      return [
        {
          title: "Getting Started",
          items: cmsData.faqs.slice(0, midpoint).map(faq => ({
            q: faq.question,
            a: faq.answer
          }))
        },
        {
          title: "Understanding Therapy",
          items: cmsData.faqs.slice(midpoint).map(faq => ({
            q: faq.question,
            a: faq.answer
          }))
        }
      ];
    })() : 
    DATA;

  // Get the left image from CMS data or use default
  const leftImageUrl = cmsData?.leftImageUrl || "/footerfaq.png";

  return (
    <section className="w-full mt-12 md:mt-20 px-4 lg:px-6">
      <style jsx>{`
        @media (max-width: 767px) {
          .help-faq-heading {
            font-size: 28px !important;
            font-weight: 600 !important;
            line-height: 0.95 !important;
          }
        }
      `}</style>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-6 md:gap-8 px-0 py-4 md:py-6 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: Heading + link + image */}
        <div className="flex flex-col ml-2 md:ml-0 space-y-3 md:space-y-4 px-2 md:px-0">
          <div className="space-y-1">
            <h3 className="help-faq-heading font-bold text-gray-900 text-center md:text-left text-base md:text-xl">
              Questions?
            </h3>
            <h4 className="text-gray-900 text-center md:text-left text-base md:text-lg">
              We're here to help
            </h4>
          </div>
          <div>
            <p className="text-sm md:text-base lg:text-lg text-center md:text-left">
              Visit our full <a className="underline font-medium" href="#">FAQ page</a> for more<br className="hidden md:block" />
              commonly asked questions.
            </p>
          </div>
                     <div className="relative mt-4 md:mt-6 w-full max-w-[280px] md:w-[320px] h-[160px] md:h-[240px] overflow-hidden rounded-2xl mx-auto md:mx-0">
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
         <div className="mr-4 md:mr-8 lg:mr-12 w-full md:max-w-2xl ml-1 md:ml-0 px-2 md:px-0">
           {faqData.map((section, ci) => (
            <div key={section.title} className="mb-6 md:mb-10 mt-3">
              <h5 className={`${section.title === "Understanding assessments" ? "mb-1" : "mb-1"} text-center md:text-left text-base md:text-lg font-medium`}>
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
                        <span className="text-sm md:text-base text-gray-900 w-full md:w-auto pr-2 md:pr-3 lg:pr-0">
                          {item.q}
                        </span>
                        <Chevron className={`h-4 w-4 md:h-5 md:w-5 text-gray-800 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-2 pb-3 md:px-0 md:pb-4">
                          <p className="text-xs md:text-sm">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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


