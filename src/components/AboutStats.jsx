import Image from "next/image";

export default function AboutStats() {
  return (
    <div className="w-full">
      <section className="w-full mt-6 md:mt-20 mb-6 md:mb-8">
        <div className="h-[100vh] w-full overflow-hidden shadow-sm">
          <div className="grid h-full w-full grid-cols-1 items-stretch md:grid-cols-2">
            {/* Left: Text + Stats */}
            <div
              className="flex flex-col justify-center px-[100px] md:px-[120px] py-12 text-[#1c331d]"
              style={{ background: "#d3e9d1" }}
            >
              <h2 
                className="text-3xl md:text-5xl font-medium leading-tight"
                style={{
                  color: '#1c331d',
                  fontFamily: 'Scto Grotesk A Medium, Roboto, Arial, sans-serif',
                  fontSize: '3.75rem',
                  letterSpacing: '-0.195rem',
                  lineHeight: '106%'
                }}
              >
                Our impact by the numbers
              </h2>
              <div
                className="mt-4 max-w-xl"
              >
                <p>
                  We take immense pride in the positive changes we've brought to patients and providers.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-x-12 gap-y-10">
                <StatBlock value="140M+" label="people have access to in-network mental health care with Rula" />
                <StatBlock value="Millions" label="of successful therapy sessions conducted on our platform" />
                <StatBlock value="15,000+" label="providers delivering quality care in our diverse network" />
                <StatBlock value="98%" label="of provider searches result in an exact match via our unique matching system" />
              </div>

              {/* Find Care Button */}
              <div className="mt-8">
                <button className="px-8 py-3 bg-[#1c331d] text-white font-medium rounded-full hover:bg-[#152a18] transition-colors duration-200 shadow-lg">
                  Find care
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <Image
                src="/rightside5th.png"
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
