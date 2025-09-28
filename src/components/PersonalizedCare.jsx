import Image from "next/image";

export default function PersonalizedCare() {
  return (
    <section className="w-full flex items-center mt-10">
      <div className="w-full px-3 sm:px-6 md:px-0 py-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 leading-none mx-auto tracking-tighter">
            The care you need, whenever you need it
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-tight tracking-tight">
            We know parenting can be challenging, so we're here to create a safe, supportive space for you and your child — a place to bring back their smiles and laughter.
          </p>
        </div>

        {/* Main Content with Central Image */}
        <div className="flex items-center justify-center">
          {/* Central Large Image - Mobile optimized */}
          <div className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[900px] xl:max-w-[1000px] h-[200px] sm:h-[250px] md:h-[400px] lg:h-[450px] xl:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/Little Hope.png"
              alt="Little Hope"
              width={1000}
              height={667}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
