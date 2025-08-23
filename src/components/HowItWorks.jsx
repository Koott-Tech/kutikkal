import Image from "next/image";

export default function HowItWorks() {
  const avatars = [
    "/hero.png",
    "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    "/hero.png",
    "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png",
    "/hero.png",
  ];

  return (
    <section className="min-h-[100vh] w-full mt-12 md:mt-16">
      <div className="mx-auto flex min-h-[100vh] max-w-[1400px] flex-col justify-center px-[50px] py-8 md:py-10">
        <h2 className="text-center text-xl md:text-2xl font-medium tracking-tight text-gray-900 leading-tight mt-8">
          How it works
        </h2>

        {/* Inline CTA under the heading */}
        <div className="mt-2 mb-6 text-center">
          <h3 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight">
            Your journey to mental well-being gets easier<br />from here.
          </h3>
          <button
            type="button"
            className="mt-5 inline-flex items-center rounded-full bg-black px-[26px] md:px-[32px] py-2.5 text-sm md:text-sm font-medium text-white hover:bg-black/85 shadow-sm"
          >
            Get started
          </button>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4 max-w-7xl mx-auto px-0">
          {/* Card 01 */}
          <div
            className="rounded-2xl p-5 min-h-[360px] w-full md:w-[330px] md:flex-shrink-0"
            style={{
              background:
                "conic-gradient(at 50% 50%, #f5f3ff 0deg, #ede9fe 120deg, #e9d5ff 240deg, #f5f3ff 360deg)",
            }}
          >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">01</div>
            <h3 className="mt-3 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate">
              Tell us what's important
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {[
                "Anxiety and Depression",
                "Accepts Cigna Health Plans",
                "Available this week",
              ].map((label) => (
                <div
                  key={label}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900"
                >
                  <span className="text-indigo-700">✓</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 pt-2 text-sm leading-relaxed text-gray-700">
              We'll use your preferences and insurance information to find
              providers who fit your needs.
            </p>
          </div>

          {/* Card 02 */}
          <div
            className="rounded-2xl p-5 min-h-[320px] w-full md:w-[330px] md:flex-shrink-0"
            style={{
              background:
                "conic-gradient(at 50% 50%, #ecfdf5 0deg, #d1fae5 140deg, #a7f3d0 280deg, #ecfdf5 360deg)",
            }}
          >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">02</div>
            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate">
              Explore your matches
            </h3>

            <div className="mt-6 flex items-center gap-4">
              {avatars.map((src, idx) => (
                <div key={idx} className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white">
                  <Image src={src} alt="avatar" fill className="object-cover" sizes="40px" />
                </div>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-base font-semibold text-gray-900">Anne Treisman</p>
              <p className="text-sm text-gray-600">Licensed Psychiatric Provider</p>
            </div>

            <p className="mt-6 pt-2 text-sm leading-relaxed text-gray-700">
              Browse the profiles of licensed, in‑network providers who match
              your preferences.
            </p>
          </div>

          {/* Card 03 */}
          <div
            className="rounded-2xl p-5 min-h-[320px] w-full md:w-[330px] md:flex-shrink-0"
            style={{
              background:
                "conic-gradient(at 50% 50%, #fff7ed 0deg, #ffedd5 150deg, #fed7aa 300deg, #fff7ed 360deg)",
            }}
          >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">03</div>
            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate">
              Schedule your visit
            </h3>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-sm text-gray-900">
              <span className="text-indigo-700">📅</span>
              <span>Evenings After 4pm</span>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div
                  key={d}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${
                    d === "Tu" || d === "Fr" ? "bg-white/90 border border-gray-200" : ""
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>

            <p className="mt-6 pt-2 text-sm leading-relaxed text-gray-700">
              Choose your preferred time and meet with your provider as soon as
              tomorrow.
            </p>
          </div>

          {/* Card 04 */}
          <div
            className="rounded-2xl p-5 min-h-[320px] w-full md:w-[330px] md:flex-shrink-0"
            style={{
              background:
                "conic-gradient(at 50% 50%, #ecfeff 0deg, #cffafe 160deg, #bae6fd 320deg, #ecfeff 360deg)",
            }}
          >
            <div className="text-3xl md:text-4xl font-medium text-indigo-900 text-center">04</div>
            <h3 className="mt-4 text-lg md:text-xl font-medium text-gray-900 text-center whitespace-nowrap truncate">
              Join your online session
            </h3>

            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                  alt="participant"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="relative h-28 w-40 overflow-hidden rounded-md">
                <Image
                  src="/hero.png"
                  alt="provider"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>

            <p className="mt-6 pt-2 text-sm leading-relaxed text-gray-700">
              Connect with your provider over live video from wherever you feel
              comfortable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


