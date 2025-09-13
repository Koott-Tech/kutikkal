import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Anxiety, Sadness or Low Mood - Little Care",
  description: "Professional support for anxiety, depression, and low mood in children and adults. Evidence-based therapy to help you feel better and thrive.",
};

export default function AnxietySadnessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Anxiety, Sadness or Low Mood
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional support for anxiety, depression, and emotional challenges. Evidence-based therapy to help you overcome difficult emotions and build resilience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-teal-600 text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Anxiety & Depression Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Anxiety and Depression
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Anxiety and depression are common mental health challenges that can significantly impact daily life. Our compassionate approach helps you develop coping strategies and find hope.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Symptoms</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Excessive worry and fear
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Persistent sadness or emptiness
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Loss of interest in activities
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Sleep and appetite changes
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Difficulty concentrating
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Treatment Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Cognitive Behavioral Therapy (CBT)
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Mindfulness and relaxation techniques
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Exposure therapy for anxiety
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Behavioral activation for depression
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-3">•</span>
                  Family support and education
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              How Our Anxiety & Depression Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our evidence-based approach helps you understand your emotions, develop coping strategies, and build resilience for long-term well-being.
            </p>
          </div>
          <ProcessSteps therapyType="anxiety-depression" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Common questions about anxiety and depression support
            </p>
          </div>
          <HelpFaq />
        </div>
      </div>

      {/* Consultation Banner */}
      <ConsultationBanner />
    </div>
  );
}
