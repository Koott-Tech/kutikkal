"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/guide');
  };
  return (
    <div className="w-full overflow-hidden">
      <section className="text-black rounded-[10px] p-4 sm:p-8 md:p-[50px] min-h-[80vh] md:h-[80vh] mx-3 sm:mx-6 md:mx-0" style={{ background: 'linear-gradient(98.54deg, rgba(153, 126, 255, .25) 6.76%, rgba(153, 126, 255, .2) 98%)' }}>
        <div className="grid h-full grid-cols-1 gap-6 md:gap-8 md:grid-cols-2">
          {/* Left: Text */}
          <div className="flex flex-col justify-center order-1 md:order-1 md:pl-10 text-center md:text-left mt-8 md:mt-0 px-2 sm:px-0">
                         <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight break-words" style={{ color: '#1d1733', letterSpacing: '-0.06em', lineHeight: '1.1', fontFamily: 'Scto Grotesk A Medium, Roboto, Arial, sans-serif', fontWeight: 500 }}>
              Connect with mental health experts who specialize in you
            </h1>
            <p className="mt-6 text-[8px] sm:text-sm md:text-lg font-light opacity-95 leading-none break-words" style={{ color: '#15171a', fontFamily: 'Scto Grotesk A Regular, Recife Text, Roboto, Arial, sans-serif', fontSize: '1.125rem', fontStyle: 'normal', fontWeight: 500 }}>
              You deserve quality care from someone who cares.
            </p>
            <p className="mt-3 text-[8px] sm:text-sm md:text-lg font-light opacity-90 leading-none break-words" style={{ color: '#15171a', fontFamily: 'Scto Grotesk A Regular, Recife Text, Roboto, Arial, sans-serif', fontSize: '1.125rem', fontStyle: 'normal', fontWeight: 500 }}>
              Match with a licensed provider today.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 sm:justify-start">
              <button
                onClick={handleGetStartedClick}
                className="w-full sm:w-fit inline-flex items-center justify-center rounded-[20px] px-6 py-3 text-sm font-normal text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3e2e73]/40"
                style={{ backgroundColor: '#3e2e73' }}
                type="button"
              >
                <span style={{ fontWeight: 500 }}>Get started</span>
              </button>
              <button
                type="button"
                className="w-full sm:w-fit inline-flex items-center justify-center gap-2 text-sm font-normal text-black hover:text-gray-800"
              >
                <span>How does it work?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.192l3.71-2.96a.75.75 0 0 1 .94 1.17l-4.24 3.38a.75.75 0 0 1-.94 0l-4.24-3.38a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative flex items-center justify-center order-2 md:order-2 min-h-[300px] md:min-h-0">
            <Image
              src="/hero.png"
              alt="Hero"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}







