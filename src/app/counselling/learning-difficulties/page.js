import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Learning Difficulties (Remedial) - Little Care",
  description: "Professional remedial support for learning difficulties. Evidence-based interventions to help students overcome academic challenges and succeed.",
};

export default function LearningDifficultiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-50 to-pink-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Learning Difficulties (Remedial)
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional remedial support for learning difficulties. Evidence-based interventions to help students overcome academic challenges and build confidence in their abilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-red-600 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Learning Difficulties Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Learning Difficulties
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Learning difficulties can affect various aspects of academic performance. Our remedial approach provides targeted support to help students develop the skills they need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Learning Difficulties</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Dyslexia (reading difficulties)
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Dyscalculia (math difficulties)
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Dysgraphia (writing difficulties)
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Processing speed issues
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Working memory challenges
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Remedial Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Individualized assessment
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Multisensory learning techniques
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Structured literacy programs
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  Assistive technology support
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-3">•</span>
                  School collaboration and advocacy
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
              How Our Remedial Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our systematic approach identifies specific learning challenges and provides targeted interventions to help students build essential academic skills.
            </p>
          </div>
          <ProcessSteps therapyType="remedial-support" />
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
              Common questions about learning difficulties and remedial support
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
