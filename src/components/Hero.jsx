"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/guide');
  };
  return (
    <div className="px-[50px]">
    <section className="bg-purple-100 text-black rounded-[10px] p-[50px] h-[80vh]">
      <div className="grid h-full grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left: Text */}
        <div className="flex flex-col justify-center pl-10">
          <h1 className="text-5xl font-normal leading-tight md:text-6xl">
            Connect with mental health experts who specialize in you
          </h1>
          <p className="mt-4 text-base font-light opacity-95">
            You deserve quality care from someone who cares.
          </p>
          <p className="mt-1 text-sm font-light opacity-90">
            <span className="font-normal">Subheading -</span> Match with a licensed provider today.
          </p>
          <div className="mt-6 flex items-center gap-6">
            <button
              onClick={handleGetStartedClick}
              className="inline-flex w-fit items-center rounded-[20px] bg-purple-600 px-8 py-3 text-sm font-normal text-white shadow-sm hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600/40"
              type="button"
            >
              Get started
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-normal text-black hover:text-gray-800"
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
        <div className="relative flex items-center justify-center">
          <Image
            src="/hero.png"
            alt="Hero"
            fill
            className="object-contain"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>
      </div>
    </section>
  </div>
  );
}







