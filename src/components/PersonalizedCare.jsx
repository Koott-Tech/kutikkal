import Image from "next/image";

export default function PersonalizedCare() {
  return (
    <section className="w-full min-h-screen flex items-center ">
      <div className="w-full px-3 sm:px-8 md:px-[70px] py-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-medium text-gray-900 mb-6 leading-tight max-w-4xl mx-auto tracking-tight md:tracking-normal">
            The care you need, whenever you need it
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            No matter where you start, your provider will work with you to develop a treatment plan that's tailored around you and your individual needs.
          </p>
        </div>

        {/* Main Content with Side Images and Central Image */}
        <div className="flex items-center justify-center gap-12">
          {/* Left Small Image and Text */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                alt="Individual therapy"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 flex items-center gap-2 mt-3 shadow-sm relative z-10">
              <div className="w-3 h-3 rounded-full flex items-center justify-center">
                <svg className="w-1.5 h-1.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-black">Therapy</span>
            </div>
          </div>

          {/* Central Large Image */}
          <div className="w-[700px] h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/treatment-plan .png"
              alt="Treatment plan"
              width={700}
              height={500}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Small Image and Text */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src="/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png"
                alt="Couples therapy"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-1 flex items-center gap-2 mt-3 shadow-sm relative z-10">
              <div className="w-3 h-3 rounded-full flex items-center justify-center">
                <svg className="w-1.5 h-1.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-medium text-black">Couples therapy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
