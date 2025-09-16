"use client";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1600px] px-0 md:px-1 py-12 md:py-16">
        <h2 className="text-3xl md:text-[44px] font-semibold tracking-tight text-gray-900 text-center">
          Hear from our patients
        </h2>
        <p className="text-gray-600 text-center mt-3 mb-10 text-base md:text-lg">
          We’re making online therapy work the way it should.
        </p>

        {/* Desktop: 5-column layout with images */}
        <div className="hidden lg:grid grid-cols-5 gap-0">
          {/* First column split vertically into two equal halves with padding and gap */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="flex-1 rounded-[10px] bg-[#E6F5EC] border border-gray-200 p-4">
              <p className="text-[15px] leading-relaxed text-gray-900">
                "Rula was the only way I was able to find a therapist. Everywhere else I was running into barriers. At a time when I was really struggling, finding help seemed impossible. Rula made it possible."
              </p>
              <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
            </div>
            <div className="flex-1 rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-4">
              <p className="text-[15px] leading-relaxed text-gray-900">
                "Finding mental healthcare through insurance can be a daunting task, but Rula made it easy to find a therapist who meets my needs and takes my insurance."
              </p>
              <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
            </div>
          </div>
          {/* Second column: full-length image edge-to-edge */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-0">
            <div className="flex-1 rounded-[10px] relative overflow-hidden">
              <Image src="/thumb1.jpg" alt="Smiling parent and child" fill className="object-cover" />
            </div>
          </div>
          {/* Third column: split 40% top (text review), 60% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="basis-[40%] rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-3 flex flex-col">
              <p className="text-[13px] leading-snug text-gray-900">
                "I was hesitant to go the online therapy route. But I am so glad I did. It was an easy process and I absolutely adore my therapist."
              </p>
              <div className="mt-2 text-[11px] text-gray-600 font-medium">Rula patient</div>
            </div>
            <div className="basis-[60%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb3.jpg" alt="Happy child" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Fourth column: split 30% top (image), 70% bottom (image) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="basis-[30%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb2.jpg" alt="Family smiling" fill className="object-cover" />
              </div>
            </div>
            <div className="basis-[70%] rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/kids.png" alt="Happy family" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Fifth column: split 50% image (top), 50% text (bottom) */}
          <div className="h-[640px] rounded-[10px] overflow-hidden flex flex-col p-1 gap-1">
            <div className="flex-1 rounded-[10px] p-0">
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-gray-100">
                <Image src="/thumb4.jpg" alt="Family moment" fill className="object-cover" />
              </div>
            </div>
            <div className="flex-1 rounded-[10px] bg-[#FFFBE6] border border-gray-200 p-3 flex flex-col">
              <p className="text-[13px] leading-snug text-gray-900">
                "Clear progress, kind support, and easy follow‑ups. Highly recommend."
              </p>
              <div className="mt-2 text-[11px] text-gray-600 font-medium">Rula patient</div>
            </div>
          </div>
        </div>

        {/* Mobile: Text-only reviews in a simple grid */}
        <div className="block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-[10px] bg-[#E6F5EC] border border-gray-200 p-4">
            <p className="text-[15px] leading-relaxed text-gray-900">
              "Rula was the only way I was able to find a therapist. Everywhere else I was running into barriers. At a time when I was really struggling, finding help seemed impossible. Rula made it possible."
            </p>
            <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
          </div>
          
          <div className="rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-4">
            <p className="text-[15px] leading-relaxed text-gray-900">
              "Finding mental healthcare through insurance can be a daunting task, but Rula made it easy to find a therapist who meets my needs and takes my insurance."
            </p>
            <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
          </div>
          
          <div className="rounded-[10px] bg-[#ECEBFF] border border-gray-200 p-4">
            <p className="text-[15px] leading-relaxed text-gray-900">
              "I was hesitant to go the online therapy route. But I am so glad I did. It was an easy process and I absolutely adore my therapist."
            </p>
            <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
          </div>
          
          <div className="rounded-[10px] bg-[#FFFBE6] border border-gray-200 p-4">
            <p className="text-[15px] leading-relaxed text-gray-900">
              "Clear progress, kind support, and easy follow‑ups. Highly recommend."
            </p>
            <div className="mt-3 text-xs text-gray-600 font-medium">Rula patient</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteCard({ quote, by, tone = "mint", className = "" }) {
  const toneClasses = {
    mint: "bg-[#E6F5EC] text-gray-900",
    lavender: "bg-[#ECEBFF] text-gray-900",
    peach: "bg-[#FFF0E1] text-gray-900",
  };
  return (
    <div className={`rounded-2xl p-6 md:p-7 border border-gray-200 ${toneClasses[tone]} ${className}`}>
      <p className="text-[15px] md:text-base leading-relaxed">“{quote}”</p>
      <div className="mt-3 text-xs md:text-sm text-gray-700 font-medium">{by}</div>
    </div>
  );
}

function PlayImage({ src, alt, className = "" }) {
  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
      <button
        aria-label="Play testimonial"
        className="absolute left-4 bottom-4 h-10 w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-white/90 shadow-md hover:bg-white transition"
      >
        <PlayIcon className="h-5 w-5 md:h-6 md:w-6 text-gray-900" />
      </button>
    </div>
  );
}

function ImageTile({ src, alt, className = "" }) {
  const hasFullHeight = className?.includes('h-full');
  const aspectClass = hasFullHeight ? '' : 'aspect-[4/3]';
  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden rounded-2xl bg-gray-100 ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 1024px) 20vw, 50vw" />
    </div>
  );
}

function PlayIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72c0 .79.86 1.28 1.54.86l10.37-6.86a1 1 0 000-1.72L9.54 4.28A1 1 0 008 5.14z" />
    </svg>
  );
}


