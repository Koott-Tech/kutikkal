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
    "linear-gradient(180deg, #f5f3ff 0%, #ede9fe 50%, #ffffff 100%)",
    "linear-gradient(180deg, #ecfdf5 0%, #d1fae5 50%, #ffffff 100%)",
    "linear-gradient(180deg, #fff7ed 0%, #ffedd5 50%, #ffffff 100%)",
    "linear-gradient(180deg, #ecfeff 0%, #cffafe 50%, #ffffff 100%)",
  ];

  function toggle(idx) {
    setActive((prev) => (prev === idx ? -1 : idx));
  }

  return (
    <section className="w-full flex items-center mt-32 our-promise-section" style={{ height: 'auto' }}>
      <style jsx>{`
        .faq-background {
          height: 100% !important;
          min-height: calc(100% - 48px) !important;
        }
        .faq-mobile-content {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1023px) {
          .faq-background {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 170% !important; /* stretch beyond container width */
            height: 120% !important;
            transform: translate(-50%, -50%) rotate(90deg) !important;
            transform-origin: center center !important;
            background-size: cover !important;
            background-position: center center !important;
          }
        }
        .our-promise-section {
          min-height: auto !important;
          height: auto !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
          position: relative;
          z-index: 0;
          isolation: isolate;
        }
        @media (min-width: 1024px) {
          .our-promise-section {
            min-height: clamp(520px, 60vh, 820px) !important;
            height: clamp(520px, 60vh, 820px) !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
      <div className="w-full mx-auto max-w-[1400px] px-3 sm:px-8 md:px-[50px]">
        <p className="text-center md:text-center text-base md:text-lg font-normal text-gray-700 leading-tight">Our promise</p>
        <h3 className="text-center md:text-center mt-2" style={{ fontWeight: 500 }}>
          Support at every step, so the next one is easier.
        </h3>

        {/* Desktop Layout: Image on left (60%), FAQ on right (40%) */}
        <div className="hidden lg:grid mt-2 grid-cols-[1fr_1fr] xl:grid-cols-[6fr_4fr] gap-4 xl:gap-8 items-stretch" style={{ minHeight: 'inherit', height: '100%' }}>
          {/* Left: Image that changes per selection */}
          <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-100">
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
            <div className="rounded-2xl bg-white space-y-2 h-full max-h-full overflow-y-auto pr-2 shadow-none">
              {items.map((item, idx) => {
                const open = active === idx;
                const gradient = gradients[idx % gradients.length];
                return (
                  <div key={item.title}>
                    <div className={`relative overflow-hidden hover:bg-white hover:shadow-none pb-2 ${idx < items.length - 1 && !open ? 'border-b border-gray-200 pb-4 rounded-none' : 'rounded-2xl'}`}>
                    {/* Background image for first FAQ when open */}
                    {idx === 0 && open && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-150"
                        style={{ backgroundImage: "url('/faq1.png')" }}
                      />
                    )}
                    {/* Background image for second FAQ when open */}
                    {idx === 1 && open && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-150"
                        style={{ backgroundImage: "url('/6.png')" }}
                      />
                    )}
                    {/* Background image for third FAQ when open */}
                    {idx === 2 && open && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-150"
                        style={{ backgroundImage: "url('/7.png')" }}
                      />
                    )}
                    {/* Background image for fourth FAQ when open */}
                    {idx === 3 && open && (
                      <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-150"
                        style={{ backgroundImage: "url('/8.png')" }}
                      />
                    )}

                    <div className="relative p-6">
                      <button
                        type="button"
                        onClick={() => toggle(idx)}
                        className="flex w-full items-start justify-between gap-4 text-left cursor-pointer"
                        aria-expanded={open}
                      >
                      <div>
                        <h5>{item.title}</h5>
                      </div>
                        <ChevronIcon className={`mt-1 h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                      </button>

                      {/* Smoothly expanding answer */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-60 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
                      >
                        <p className="text-sm text-gray-800 mb-4">{item.body}</p>
                        {open && (
                          <button className="inline-flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-gray-900 cursor-pointer group relative">
                            <span className="relative">
                              Get started
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full"></span>
                            </span>
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                      </div>
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
          <div className="rounded-2xl bg-white space-y-2">
            {items.map((item, idx) => {
              const open = active === idx;
              const gradient = gradients[idx % gradients.length];
              return (
                <div key={item.title} className={`relative overflow-hidden pb-2 ${idx < items.length - 1 && !open ? 'border-b border-gray-200 pb-4 rounded-none' : 'rounded-2xl'}`}>
                  {open && (
                    <div
                      className="absolute inset-0 z-0"
                      style={{ background: gradient, opacity: 0.9 }}
                    />
                  )}
                  <div className="relative p-6 z-10 faq-mobile-content">
                    <button
                      type="button"
                      onClick={() => toggle(idx)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                      aria-expanded={open}
                    >
                      <div>
                        <h5>{item.title}</h5>
                      </div>
                      <ChevronIcon className={`mt-1 h-5 w-5 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
                    </button>

                    {/* Smoothly expanding answer with image below */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[400px] md:max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}
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


