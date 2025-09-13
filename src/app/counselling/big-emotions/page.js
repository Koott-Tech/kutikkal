import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Big Emotions (CBT - Kids) - Little Care",
  description: "Cognitive Behavioral Therapy for children dealing with big emotions. Professional support to help kids understand and manage their feelings effectively.",
};

export default function BigEmotionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Big Emotions (CBT - Kids)
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Help your child understand and manage big emotions through evidence-based Cognitive Behavioral Therapy techniques designed specifically for children.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Big Emotions CBT Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Big Emotions in Children
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Children often experience intense emotions that can be overwhelming. Our CBT approach helps them develop healthy coping strategies and emotional regulation skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What We Address</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Intense anger and frustration
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Overwhelming sadness and worry
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Difficulty expressing feelings
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Emotional outbursts and meltdowns
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Low self-esteem and confidence
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our CBT Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Age-appropriate emotion identification
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Cognitive restructuring techniques
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Relaxation and mindfulness exercises
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Problem-solving skills development
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3">•</span>
                  Parent coaching and support
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
              How Our Big Emotions CBT Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our structured approach helps children develop emotional intelligence and coping skills through evidence-based techniques.
            </p>
          </div>
          <ProcessSteps therapyType="big-emotions" />
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
              Common questions about Big Emotions CBT for children
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
