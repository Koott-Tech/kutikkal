import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Overthinking & OCD - Little Care",
  description: "Professional support for overthinking and OCD. Evidence-based therapy to help manage intrusive thoughts and compulsive behaviors.",
};

export default function OverthinkingOCDPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Overthinking & OCD
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Break free from overthinking and OCD patterns. Professional support to help you manage intrusive thoughts and compulsive behaviors effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Overthinking & OCD Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Overthinking and OCD
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Overthinking and OCD can significantly impact daily life. Our specialized approach helps you develop strategies to manage intrusive thoughts and break free from compulsive patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Patterns</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Intrusive, unwanted thoughts
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Repetitive mental rituals
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Excessive worry and rumination
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Compulsive behaviors or checking
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Perfectionism and control issues
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Treatment Methods</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Exposure and Response Prevention (ERP)
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Cognitive Behavioral Therapy (CBT)
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Mindfulness-based interventions
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Thought challenging techniques
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3">•</span>
                  Habit reversal training
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
              How Our OCD Treatment Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our specialized approach helps you gradually face fears, reduce compulsions, and develop healthier thought patterns for lasting recovery.
            </p>
          </div>
          <ProcessSteps therapyType="ocd-treatment" />
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
              Common questions about overthinking and OCD treatment
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
