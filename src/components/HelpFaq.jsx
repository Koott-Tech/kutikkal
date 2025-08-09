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
        a: "Consider experience, identity preferences, specialties, and availability. We’ll help you match on these preferences.",
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
        q: "Which insurance do you accept?",
        a: "We work with major plans and are expanding coverage regularly. Check your specific plan during signup.",
      },
      {
        q: "What will my cost per session be if I’m using insurance?",
        a: "Your cost depends on your benefits (copay, coinsurance, or deductible). We’ll verify and show transparent pricing before you book.",
      },
      {
        q: "What if I don’t have insurance or my insurance doesn’t cover sessions?",
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
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-[50px] py-12 md:grid-cols-[0.9fr_1.1fr]">
        {/* Left column: Heading + link + image */}
        <div className="flex flex-col">
          <div>
            <h2 className="text-[28px] leading-[1.1] font-medium tracking-tight md:text-[42px] text-gray-900">
              Questions?
              <br />We’re here to help
            </h2>
            <p className="mt-5 text-gray-700">
              Visit our full <a className="underline font-medium" href="#">FAQ page</a> for more
              commonly asked questions.
            </p>
          </div>
          <div className="relative mt-8 w-[240px] h-[180px] md:w-[320px] md:h-[240px] overflow-hidden rounded-2xl">
            <Image
              src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
              alt="Smiling people"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>

        {/* Right column: Accordion */}
        <div>
          {DATA.map((section, ci) => (
            <div key={section.title} className="mb-10">
              <h3 className="text-2xl md:text-3xl font-medium text-gray-900">
                {section.title}
              </h3>
              <div className="mt-4 rounded-2xl">
                {section.items.map((item, qi) => {
                  const id = `${ci}-${qi}`;
                  const open = openId === id;
                  return (
                    <div key={id} className="bg-white">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? "" : id)}
                        className="flex w-full items-center justify-between px-5 py-5 text-left"
                      >
                        <span className="text-base md:text-lg text-gray-900">
                          {item.q}
                        </span>
                        <Chevron className={`h-5 w-5 text-gray-800 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>
                      <div
                        className={`grid overflow-hidden transition-all duration-300 ease-out ${
                          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        } px-5 pb-0`}
                      >
                        <div className="min-h-0">
                          <p className="pb-5 pr-4 text-sm text-gray-700">
                            {item.a}
                          </p>
                        </div>
                      </div>
                      {qi < section.items.length - 1 && (
                        <div className="mx-5 h-px bg-gray-300/40" />
                      )}
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


