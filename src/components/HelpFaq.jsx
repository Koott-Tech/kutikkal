"use client";
import Image from "next/image";
import { useState } from "react";

const DATA = [
  {
    title: "Getting started",
    items: [
      {
        q: "How do I know if therapy is right for me?",
        a: "Therapy can help with stress, anxiety, relationships, and personal growth. If you're curious, a first session is a great low‑pressure way to explore fit.",
      },
      {
        q: "What should I consider when choosing a therapist?",
        a: "Consider experience, identity preferences, specialties, and availability. We'll help you match on these preferences.",
      },
      {
        q: "Can I combine therapy and psychiatry?",
        a: "Many people benefit from both. Your providers can coordinate care to support your goals.",
      },
    ],
  },
  {
    title: "Understanding costs",
    items: [
      {
        q: "Which insurance does Rula accept?",
        a: "We work with major plans and are expanding coverage regularly. Check your specific plan during signup.",
      },
      {
        q: "What will my cost per session be if I'm using insurance?",
        a: "Your cost depends on your benefits (copay, coinsurance, or deductible). We'll verify and show transparent pricing before you book.",
      },
      {
        q: "What if I don't have insurance or my insurance doesn't cover sessions?",
        a: "We offer out‑of‑pocket options and can provide superbills for reimbursement when available.",
      },
    ],
  },
];

export default function HelpFaq() {
  // Track open item as "categoryIndex-questionIndex"
  const [openId, setOpenId] = useState("");

  return (
    <section className="min-h-[100vh] w-full mt-0">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-4 sm:px-10 md:px-[50px] py-4 md:py-8 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: Heading + link + image */}
        <div className="flex flex-col">
          <div>
                         <h2 className="text-[32px] leading-[1.1] font-medium tracking-tight md:tracking-normal md:text-[48px] text-gray-900">
              Questions?
              <br />
              <span>We're here to help</span>
            </h2>
            <p className="mt-5 text-lg text-gray-700">
              Visit our full <a className="underline font-medium" href="#">FAQ page</a> for more<br />
              commonly asked questions.
            </p>
          </div>
                     <div className="relative mt-10 w-[320px] h-[180px] md:w-[320px] md:h-[240px] overflow-hidden rounded-2xl">
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
         <div className="mr-12 w-full md:max-w-2xl">
           {DATA.map((section, ci) => (
             <div key={section.title} className="mb-12">
               <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8">
                {section.title}
              </h3>
              <div className="space-y-0">
                {section.items.map((item, qi) => {
                  const id = `${ci}-${qi}`;
                  const open = openId === id;
                  return (
                    <div key={id} className="border-b border-gray-200 last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? "" : id)}
                        className="flex w-full items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg text-gray-900 w-full md:w-auto pr-8 md:pr-0">
                          {item.q}
                        </span>
                        <Chevron className={`h-5 w-5 text-gray-800 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          open ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-0 pb-4">
                          <p className="text-base text-gray-700 leading-relaxed">
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


