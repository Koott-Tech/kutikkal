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
      icon: "combination",
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
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      );
    }
    if (iconType === "pill") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
    if (iconType === "combination") {
      return (
        <div className="w-8 h-8 flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="mt-1">
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-3 px-3 sm:px-8 md:px-[50px]">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex min-h-[240px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            {/* Icon at the left top */}
            <div className="flex flex-col items-start">
              <div className="mb-4">
                {getIcon(item.icon, item.iconColor)}
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-medium leading-tight text-gray-900 text-center md:text-left">
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


