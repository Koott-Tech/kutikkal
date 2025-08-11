import Image from "next/image";

export default function InfoCards() {
  const items = [
    {
      iconNode: "💬",
      title: "Talk therapy with a licensed therapist",
      description:
        "Build healthier habits and navigate challenges in a supportive space. Match with someone who fits your goals and preferences.",
      cta: "Find a therapist",
    },
    {
      iconNode: "💊",
      title: "Medication options with a psychiatric expert",
      description:
        "Review symptoms and decide if prescription support fits your plan. Virtual visits and ongoing follow‑ups when needed.",
      cta: "Find a psychiatric provider",
    },
    {
      iconNode: "🤝",
      title: "Combined care for better wellbeing",
      description:
        "Pair therapy and medication for stronger, longer‑lasting outcomes. One place to coordinate care and track your progress.",
      cta: "Get started",
    },
  ];

  return (
    <section className="mt-40">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[260px] flex-col rounded-lg border border-gray-200 bg-white p-7 md:max-w-[calc(100%-20px)]"
          >
            {/* Icon top-left. Supports emoji, inline SVG, or image src */}
            {item.iconNode ? (
              <div className="text-2xl md:text-3xl text-indigo-700">{item.iconNode}</div>
            ) : item.icon ? (
              <div className="relative h-7 w-7">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  sizes="28px"
                  className="object-contain"
                  priority={false}
                />
              </div>
            ) : null}
            <h3 className="mt-4 text-xl md:text-2xl font-semibold leading-snug text-gray-900 whitespace-nowrap truncate">
              {item.title}
            </h3>
            <p className="mt-3 text-[15px] md:text-base text-gray-700">
              {item.description}
            </p>

            <div className="mt-auto pt-4">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-800"
              >
                {item.cta || "Get started"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586l-3.293-3.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


