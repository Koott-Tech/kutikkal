import Image from "next/image";

export default function LogosStrip() {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between gap-8 px-[70px]">
        <div className="flex items-center gap-2">
          <div className="text-left">
            <p className="text-sm font-normal text-gray-700 leading-tight">
              120M+ individuals are
            </p>
            <p className="text-sm font-normal text-gray-700 leading-tight">
              covered by insurance
            </p>
          </div>
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 ml-1">
            <span className="text-xs font-medium text-gray-600">i</span>
          </div>
        </div>
        
        <div className="flex flex-nowrap items-center gap-6">
          {[
            "aetna-logo-1.png",
            "cigna-logo-1.png",
            "uhc-logo.png",
            "logo_bcbs-1.png",
            "optum-logo-1.png",
            "kaiser-logo.png",
            "umr-logo.png",
          ].map((src) => (
            <div key={src} className="relative h-14 w-36 shrink-0">
              <Image
                src={`/${src}`}
                alt={src.replace(/[-_]/g, " ").replace(/\.(png|svg)$/, "")}
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
          ))}
        </div>
        
        <div className="flex items-center">
          <span className="text-sm font-thin text-gray-700">More partners →</span>
        </div>
      </div>
    </section>
  );
}
