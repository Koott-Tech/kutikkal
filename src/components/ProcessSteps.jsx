"use client";

export default function ProcessSteps({ therapyType = "individual" }) {
  // Content configuration for different therapy types
  const content = {
    individual: {
      title: "How individual therapy works at Kuttikal",
      subtitle: "From beginning to end, we'll tailor your online therapy experience to you.",
      step1: {
        title: "1. Tell us what's important",
        description: "We'll use your preferences and insurance details to find providers who fit your needs.",
        tags: ["Anger Management", "Behavioral Issues", "Chronic Impulsivity", "Coping Skills"]
      },
      step2: {
        title: "2. Explore your matches",
        description: "Browse the profiles of licensed, in-network providers who match your preferences."
      },
      step3: {
        title: "3. Schedule your visit",
        description: "Choose your preferred time and meet with your provider as soon as tomorrow."
      },
      step4: {
        title: "4. Join your online session",
        description: "Connect with your provider over live video from wherever you feel comfortable."
      }
    },
    couples: {
      title: "How couples therapy works at Kuttikal",
      subtitle: "From beginning to end, we'll tailor your couples therapy experience to strengthen your relationship.",
      step1: {
        title: "1. Share your relationship goals",
        description: "Tell us about your relationship challenges and what you hope to achieve together.",
        tags: ["Communication", "Trust Issues", "Conflict Resolution", "Intimacy"]
      },
      step2: {
        title: "2. Find your perfect match",
        description: "Browse profiles of licensed couples therapists who specialize in relationship counseling."
      },
      step3: {
        title: "3. Book your session",
        description: "Schedule a time that works for both partners to begin your journey together."
      },
      step4: {
        title: "4. Start healing together",
        description: "Join your online session as a couple and begin building a stronger relationship."
      }
    },
    family: {
      title: "How family therapy works at Kuttikal",
      subtitle: "From beginning to end, we'll help your family build stronger bonds and better communication.",
      step1: {
        title: "1. Identify family dynamics",
        description: "Share your family's unique challenges and what you hope to improve together.",
        tags: ["Parent-Child Issues", "Sibling Rivalry", "Blended Families", "Communication"]
      },
      step2: {
        title: "2. Choose your family therapist",
        description: "Find licensed family therapists who understand your family's specific needs."
      },
      step3: {
        title: "3. Schedule family time",
        description: "Book sessions that work for everyone's schedule and commitments."
      },
      step4: {
        title: "4. Grow together",
        description: "Join your online family session and start building healthier relationships."
      }
    },
    child: {
      title: "How child therapy works at Kuttikal",
      subtitle: "From beginning to end, we'll create a safe, supportive environment for your child's growth.",
      step1: {
        title: "1. Understand your child's needs",
        description: "Share your concerns about your child's behavior, emotions, or development.",
        tags: ["Anxiety", "Behavioral Issues", "Social Skills", "Academic Challenges"]
      },
      step2: {
        title: "2. Find the right specialist",
        description: "Connect with licensed child therapists who specialize in working with children."
      },
      step3: {
        title: "3. Plan your child's sessions",
        description: "Schedule appointments that fit your family's routine and your child's energy levels."
      },
      step4: {
        title: "4. Support their journey",
        description: "Join your child in their online therapy session and support their emotional growth."
      }
    },
    teen: {
      title: "How teen therapy works at Kuttikal",
      subtitle: "From beginning to end, we'll provide a safe space for your teenager to explore and grow.",
      step1: {
        title: "1. Address teen-specific concerns",
        description: "Share your teen's unique challenges and what they hope to achieve through therapy.",
        tags: ["Peer Pressure", "Identity Issues", "Academic Stress", "Family Dynamics"]
      },
      step2: {
        title: "2. Connect with teen specialists",
        description: "Find therapists who specialize in adolescent mental health and development."
      },
      step3: {
        title: "3. Respect their schedule",
        description: "Book sessions that work with your teen's school, activities, and social life."
      },
      step4: {
        title: "4. Empower their independence",
        description: "Support your teen as they engage in their online therapy sessions."
      }
    },
    psychiatry: {
      title: "How psychiatry works at Kuttikal",
      subtitle: "From beginning to end, we'll provide comprehensive psychiatric care for your mental health needs.",
      step1: {
        title: "1. Share your symptoms",
        description: "Describe your mental health symptoms and any previous treatment experiences.",
        tags: ["Medication Management", "Diagnosis", "Treatment Planning", "Monitoring"]
      },
      step2: {
        title: "2. Find your psychiatrist",
        description: "Connect with licensed psychiatrists who can provide medication and therapy."
      },
      step3: {
        title: "3. Schedule your evaluation",
        description: "Book your initial psychiatric evaluation at a time that works for you."
      },
      step4: {
        title: "4. Begin your treatment",
        description: "Start your psychiatric treatment plan with medication and ongoing support."
      }
    }
  };

  const currentContent = content[therapyType] || content.individual;

  return (
    <section className="w-full bg-white py-16 mt-8">
      <div className="mx-auto max-w-[1400px] pl-8 pr-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-medium text-black mb-4">
            {currentContent.title}
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Four Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="bg-purple-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex items-center justify-center">
              <div className="space-y-2">
                {currentContent.step1.tags?.map((tag, index) => (
                  <div key={index} className="bg-white rounded-full px-4 py-2 text-sm text-gray-600">{tag}</div>
                ))}
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">{currentContent.step1.title}</h3>
            <p className="text-black text-left font-light">
              {currentContent.step1.description}
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="bg-green-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex items-center justify-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">{currentContent.step2.title}</h3>
            <p className="text-black text-left font-light">
              {currentContent.step2.description}
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="bg-orange-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex flex-col items-center justify-center space-y-4">
              <div className="text-sm font-medium text-gray-700">Mornings Before 12pm</div>
              <div className="flex space-x-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'S'].map((day, index) => (
                  <button
                    key={day}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      day === 'Fr' 
                        ? 'bg-white border-2 border-gray-400 text-gray-700' 
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">{currentContent.step3.title}</h3>
            <p className="text-black text-left font-light">
              {currentContent.step3.description}
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="bg-blue-100 rounded-2xl p-6 mb-6 h-56 min-w-[320px] flex flex-col items-center justify-center relative">
              <div className="text-center mb-4">
                <div className="text-sm font-bold text-gray-800">Tyrell Washington</div>
                <div className="text-xs text-gray-600">LMFT</div>
              </div>
              <div className="w-20 h-20 bg-gray-400 rounded-full mb-4"></div>
              <div className="flex items-center justify-between w-full px-4">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                </div>
                <button className="bg-red-500 text-white text-xs px-3 py-1 rounded">
                  End
                </button>
              </div>
            </div>
            <h3 className="text-xl font-medium text-black mb-3 text-left">{currentContent.step4.title}</h3>
            <p className="text-black text-left font-light">
              {currentContent.step4.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
