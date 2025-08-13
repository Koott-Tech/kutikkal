import Image from "next/image";

export default function InfoCards() {
  const items = [
    {
      icon: "speech-bubble",
      iconColor: "purple",
      title: "Find support and build healthier habits with guidance from a licensed therapist",
      description:
        "Talk therapy offers a safe space where you can build healthier habits, navigate challenging situations, and improve your overall well-being. With the support of a licensed therapist, work together to make progress towards your treatment goals.",
      cta: "Find a therapist",
    },
    {
      icon: "pill",
      iconColor: "green",
      title: "Meet with a licensed psychiatric expert to discuss medication options",
      description:
        "If your symptoms are making it difficult to get through your daily routine, meeting with a psychiatric provider can help determine whether you would benefit from prescription medication as part of your treatment plan.",
      cta: "Find a psychiatric provider",
    },
    {
      icon: "speech-bubble",
      iconColor: "blue",
      title: "Access the combination of care you need to maintain your wellbeing",
      description:
        "Research shows that the combination of talk therapy and prescription medication can result in better outcomes in the treatment of many common conditions — including anxiety disorders, depression, ADHD, and others.",
      cta: "Get started",
    },
  ];

  const getIcon = (iconType, color) => {
    if (iconType === "speech-bubble") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        </div>
      );
    }
    if (iconType === "pill") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mt-1">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-6 md:grid-cols-3 px-[50px]">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[240px] flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            {/* Icon at the left top */}
            <div className="flex flex-col items-start">
              <div className="mb-4">
                {getIcon(item.icon, item.iconColor)}
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-medium leading-tight text-gray-900">
                {item.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {item.description}
            </p>

            {/* Call to Action */}
            <div className="mt-auto pt-6">
              <a
                href="#"
                className="flex items-center justify-between text-sm font-normal text-gray-900 hover:text-gray-700"
              >
                <span>{item.cta}</span>
                <span className="text-lg underline">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


