"use client";
import Image from "next/image";
import { useState } from "react";

export default function SupportFaq() {
  const items = [
    {
      title: "Care that feels safe",
      body:
        "Every child deserves a space where their feelings matter. We promise to create a gentle, non-judgmental environment where kids can express themselves freely.",
      image: "/hero.png",
    },
    {
      title: "Guidance parents can trust",
      body:
        "We walk alongside parents with practical tools, clear communication, and expert guidance—so you never feel alone in supporting your child's well-being.",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    },
    {
      title: "Expertise made simple",
      body:
        "Our child specialists bring evidence-based care to your doorstep, designed to be easy, accessible, and tailored to each child's unique needs.",
      image: "/hero.png",
    },
    {
      title: "Support at every stage",
      body:
        "Whether it's early struggles, school challenges, or big transitions, we promise to be there at every step—making the next one easier.",
      image: "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    },
  ];

  const [active, setActive] = useState(0);

  const gradients = [
    "conic-gradient(at 50% 50%, #f5f3ff 0deg, #ede9fe 120deg, #e9d5ff 240deg, #f5f3ff 360deg)",
    "conic-gradient(at 50% 50%, #ecfdf5 0deg, #d1fae5 140deg, #a7f3d0 280deg, #ecfdf5 360deg)",
    "conic-gradient(at 50% 50%, #fff7ed 0deg, #ffedd5 150deg, #fed7aa 300deg, #fff7ed 360deg)",
    "conic-gradient(at 50% 50%, #ecfeff 0deg, #cffafe 160deg, #bae6fd 320deg, #ecfeff 360deg)",
  ];

  function toggle(idx) {
    setActive((prev) => (prev === idx ? -1 : idx));
  }

  return (
    <section className="w-full flex items-center min-h-screen lg:h-[700px]">
      <div className="w-full px-3 sm:px-8 md:px-[50px] py-16">
        <p className="text-center text-base md:text-lg font-medium text-gray-700 mb-2">Our promise</p>
        <h2 className="text-center text-[32px] md:text-[48px] font-medium tracking-tight md:tracking-normal text-gray-900 mt-2 mb-10 md:mb-12">
          Support at every step, so the next one is easier.
        </h2>

        {/* Desktop Layout: Image on left, FAQ on right */}
        <div className="hidden lg:grid mt-2 grid-cols-2 gap-8 items-stretch h-full">
          {/* Left: Image that changes per selection */}
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              key={items[active >= 0 ? active : 0]?.image}
              src={items[active >= 0 ? active : 0]?.image}
              alt={items[active >= 0 ? active : 0]?.title}
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>

          {/* Right: FAQ Accordion */}
          <div className="w-full h-full">
            <div className="rounded-2xl bg-white space-y-4 h-full max-h-full overflow-y-auto pr-2">
              {items.map((item, idx) => {
                const open = active === idx;
                const gradient = gradients[idx % gradients.length];
                return (
                  <div key={item.title} className="relative overflow-hidden rounded-2xl">
                    {/* Gradient overlay to color the entire Q&A when open */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
                      style={{ background: gradient, opacity: open ? 1 : 0 }}
                    />

                    <div className="relative p-6">
                      <button
                        type="button"
                        onClick={() => toggle(idx)}
                        className="flex w-full items-start justify-between gap-4 text-left"
                        aria-expanded={open}
                      >
                        <div>
                          <h3 className="text-lg md:text-xl font-medium text-gray-900">{item.title}</h3>
                        </div>
                        <ChevronIcon className={`mt-1 h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>

                      {/* Smoothly expanding answer */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
                      >
                        <p className="text-sm text-gray-800">{item.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Layout: FAQ centered with image below when opened */}
        <div className="lg:hidden mt-2">
          <div className="rounded-2xl bg-white space-y-4">
            {items.map((item, idx) => {
              const open = active === idx;
              const gradient = gradients[idx % gradients.length];
              return (
                <div key={item.title} className="relative overflow-hidden rounded-2xl">
                  {/* Gradient overlay to color the entire Q&A when open */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
                    style={{ background: gradient, opacity: open ? 1 : 0 }}
                  />

                  <div className="relative p-6">
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                      aria-expanded={open}
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      </div>
                      <ChevronIcon className={`mt-1 h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {/* Smoothly expanding answer with image below */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
                    >
                      <div className="space-y-4">
                        <p className="text-sm text-gray-800">{item.body}</p>
                        
                        {/* Image appears below text when FAQ is opened on mobile/tablet */}
                        <div className="relative aspect-[3/2] w-1/2 mx-auto overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.19l3.71-2.96a.75.75 0 11.94 1.17l-4.24 3.38a.75.75 0 01-.94 0L5.27 8.34a.75.75 0 01-.04-1.13z"
        clipRule="evenodd"
      />
    </svg>
  );
}


