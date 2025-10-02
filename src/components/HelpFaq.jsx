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

export default function HelpFaq() {
  // Track open item as "categoryIndex-questionIndex"
  const [openId, setOpenId] = useState("");

  return (
    <section className="w-full mt-20 px-4 lg:px-6">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-0 py-4 md:py-6 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: Heading + link + image */}
        <div className="flex flex-col ml-4 md:ml-0 space-y-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-center md:text-left">
              Questions?
            </h3>
            <h4 className="text-gray-900 text-center md:text-left">
              We're here to help
            </h4>
          </div>
          <div>
            <p1 className="text-base md:text-lg text-center md:text-left">
              Visit our full <a className="underline font-medium" href="#">FAQ page</a> for more<br />
              commonly asked questions.
            </p1>
          </div>
                     <div className="relative mt-6 w-[320px] h-[180px] md:w-[320px] md:h-[240px] overflow-hidden rounded-2xl">
            <Image
              src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
              alt="Smiling people"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>

                 {/* Right column: Accordion FAQ */}
         <div className="mr-8 md:mr-12 w-full md:max-w-2xl ml-1 md:ml-0">
           {DATA.map((section, ci) => (
            <div key={section.title} className="mb-10 mt-3">
              <h5 className={`${section.title === "Understanding assessments" ? "mb-1" : "mb-1"} text-center md:text-left`}>
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
                        className="flex w-full items-center justify-between py-4 text-left hover:bg-white transition-colors px-3 md:px-0 cursor-pointer"
                      >
                        <span className="text-base text-gray-900 w-full md:w-auto pr-3 md:pr-0">
                          {item.q}
                        </span>
                        <Chevron className={`h-5 w-5 text-gray-800 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-3 pb-4 md:px-0">
                          <p1 className="text-sm">
                            {item.a}
                          </p1>
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


