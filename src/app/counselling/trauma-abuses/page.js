import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Trauma & Abuses - Little Care",
  description: "Professional trauma therapy and abuse recovery support. Safe, compassionate care to help survivors heal and rebuild their lives.",
};

export default function TraumaAbusesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trauma & Abuses
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Safe, compassionate support for trauma recovery and healing from abuse. Professional therapy to help survivors rebuild their lives and find hope.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-gray-600 text-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Trauma & Abuse Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Trauma and Abuse Recovery
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Trauma and abuse can have lasting effects on mental health and well-being. Our trauma-informed approach provides safe, evidence-based support for healing and recovery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Trauma We Address</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Childhood trauma and abuse
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Domestic violence and intimate partner abuse
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Sexual assault and harassment
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Emotional and psychological abuse
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Complex trauma and PTSD
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Trauma-Informed Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Trauma-Focused CBT (TF-CBT)
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  EMDR (Eye Movement Desensitization)
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Somatic experiencing techniques
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Safety planning and stabilization
                </li>
                <li className="flex items-start">
                  <span className="text-gray-600 mr-3">•</span>
                  Support group facilitation
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
              How Our Trauma Recovery Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our trauma-informed approach prioritizes safety, empowerment, and healing at your own pace, helping you reclaim your life and build resilience.
            </p>
          </div>
          <ProcessSteps therapyType="trauma-recovery" />
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
              Common questions about trauma therapy and abuse recovery
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
