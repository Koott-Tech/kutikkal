"use client";
import Image from "next/image";

export default function FeatureCards() {
  const localImage = "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png";
  const cards = [
    {
      src: localImage,
      title: "Accessible Anywhere",
      description: "Connect with licensed experts from the comfort of your home.",
    },
    {
      src: localImage,
      title: "Simple Scheduling",
      description: "Book, reschedule, and manage sessions in just a few clicks.",
    },
    {
      src: localImage,
      title: "Personalized Plans",
      description: "Care plans tailored to your needs and your pace.",
    },
  ];

  return (
    <section className="mt-20 md:mt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center gap-6 md:gap-8">
          {cards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="flex-shrink-0">
              <div className="flex h-[450px] w-[370px] min-w-[350px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Top: Image (60% height) */}
                <div className="relative h-[100%] w-full overflow-hidden rounded-t-2xl">
                  <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="360px"
                    priority={false}
                  />
                </div>

                {/* Bottom: Content (40% height) */}
                <div className="flex h-[40%] flex-col p-8">
                  <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


