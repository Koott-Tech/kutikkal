import Image from "next/image";

export default function PersonalizedCare() {
  return (
    <section className="w-full flex items-center mt-20">
      <div className="w-full px-3 sm:px-6 md:px-0 py-4">
        {/* Header Section */}
        <div className="text-center mb-0">
          <h3 className="mb-0 mx-auto" style={{ fontWeight: 500 }}>
            The care you need, whenever you need it
          </h3>
          <p className="p1 text-sm md:text-lg max-w-3xl mx-auto mt-2 md:mt-3">
            We know parenting can be challenging, so we're here to create a safe, supportive space for you and your child — a place to bring back their smiles and laughter.
          </p>
        </div>

        {/* Main Content with Central Image */}
        <div className="flex items-center justify-center -mt-4">
          {/* Central Large Image - Mobile optimized */}
          <div className="w-full max-w-[500px] sm:max-w-[600px] md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px] h-[250px] sm:h-[300px] md:h-[500px] lg:h-[550px] xl:h-[600px] rounded-2xl overflow-hidden mx-auto">
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
