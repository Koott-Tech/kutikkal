import Image from "next/image";

export default function AboutStats() {
  return (
    <div className="w-full">
      <section className="w-full mt-24">
        <div className="min-h-[120vh] md:h-[100vh] w-full overflow-hidden shadow-sm">
          <div className="flex flex-col md:grid md:grid-cols-2 h-full w-full">
            {/* Left: Text + Stats */}
            <div
              className="flex flex-col justify-center px-5 sm:px-8 md:px-[100px] lg:px-[120px] py-8 md:py-12 text-[#1c331d] order-1 md:order-1"
              style={{ background: "#d3e9d1" }}
            >
              <h2 
                className="text-[2.5rem] md:text-[3.75rem] font-medium leading-[110%] md:leading-[106%] tracking-[-0.125rem] md:tracking-[-0.195rem]"
                style={{
                  color: '#1c331d'
                }}
              >
                We Care A Lot
              </h2>
              <div
                className="mt-4 max-w-xl"
              >
                <p>
                 Every number here tells a story of trust, healing, and care that reached a little farther.

                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-x-12 gap-y-10">
                <StatBlock value="14,000+" label="Session hours completed with care" />
                <StatBlock value="4,500 +" label="families" />
                <StatBlock value="10,500+" label="individuals took their first step with us" />
                <StatBlock value="90%" label=" of parents notices positive changes within months" />
              </div>

              {/* Find Care Button */}
              <div className="mt-8 flex justify-center md:justify-start">
                <button className="px-25 md:px-8 py-2 bg-[#1c331d] text-white font-medium rounded-full hover:bg-[#152a18] transition-colors duration-200 shadow-lg">
                  Find care that fits your child
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative order-2 md:order-2 h-[60vh] md:h-full">
              <Image
                src="/Aboutus 2.webp"
                alt="Person enjoying a cup"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBlock({ value, label }) {
  return (
    <div className="pl-3 border-l border-[#1c331d]">
      <div className="text-4xl md:text-5xl font-medium">{value}</div>
      <p className="mt-2 max-w-xs text-sm opacity-90">{label}</p>
    </div>
  );
}
