import Image from "next/image";

export default function LogosStrip() {
  return (
    <section className="mt-10">
      <div className="mt-4">
        <div className="flex flex-nowrap items-center justify-center gap-10 px-[50px] pb-2">
          {[
            "aetna-logo-1.png",
            "cigna-logo-1.png",
            "kaiser-logo.png",
            "logo_bcbs-1.png",
            "optum-logo-1.png",
            "uhc-logo.png",
            "umr-logo.png",
          ].map((src) => (
            <div key={src} className="relative h-14 w-36 shrink-0">
              <Image
                src={`/${src}`}
                alt={src.replace(/[-_]/g, " ").replace(/\.png$/, "")}
                fill
                className="object-contain"
                sizes="112px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
