import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Grief & Loss - Little Care",
  description: "Professional grief counseling and loss support. Compassionate care to help you navigate the grieving process and find healing.",
};

export default function GriefLossPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Grief & Loss
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Navigate grief and loss with compassionate professional support. Find healing and hope as you process your emotions and rebuild your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-violet-600 text-violet-600 px-8 py-3 rounded-lg font-semibold hover:bg-violet-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Grief & Loss Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Grief and Loss
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Grief is a natural response to loss, but it can feel overwhelming and isolating. Our compassionate approach helps you process your emotions and find meaning in your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Loss We Support</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Death of a loved one
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Divorce or relationship ending
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Job loss or career change
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Health diagnosis or chronic illness
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Miscarriage or infertility
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Grief Support Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Grief counseling and therapy
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Support group facilitation
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Mindfulness and coping strategies
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Meaning-making and legacy work
                </li>
                <li className="flex items-start">
                  <span className="text-violet-600 mr-3">•</span>
                  Family grief support
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
              How Our Grief Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our compassionate approach honors your unique grieving process and helps you find healing, hope, and meaning in your journey forward.
            </p>
          </div>
          <ProcessSteps therapyType="grief-support" />
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
              Common questions about grief counseling and loss support
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
