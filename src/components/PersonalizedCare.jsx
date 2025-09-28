import Image from "next/image";

export default function PersonalizedCare() {
  return (
    <section className="w-full min-h-screen flex items-center mt-20">
      <div className="w-full px-3 sm:px-6 md:px-[50px] py-12">
        {/* Header Section */}
        <div className="text-center md:text-left mb-8">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4 leading-none mx-auto tracking-tighter">
            The care you need, whenever you need it
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto md:mx-0 leading-tight tracking-tight">
            We know parenting can be challenging, so we're here to create a safe, supportive space for you and your child — a place to bring back their smiles and laughter.
          </p>
        </div>

        {/* Main Content with Central Image */}
        <div className="flex items-center justify-center">
          {/* Central Large Image - Mobile optimized */}
          <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] h-[200px] sm:h-[280px] md:h-[400px] lg:h-[500px] xl:h-[667px] rounded-2xl overflow-hidden">
            <Image
              src="/Little%20Hope.png"
              alt="Little Hope"
              width={1000}
              height={667}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
