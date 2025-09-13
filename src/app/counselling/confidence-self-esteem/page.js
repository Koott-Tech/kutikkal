import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Confidence & Self-esteem - Little Care",
  description: "Build confidence and self-esteem with professional support. Develop a positive self-image and overcome self-doubt for personal growth.",
};

export default function ConfidenceSelfEsteemPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Confidence & Self-esteem
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build unshakeable confidence and healthy self-esteem. Professional support to help you develop a positive self-image and overcome self-doubt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Confidence & Self-esteem Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Building Confidence and Self-esteem
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Healthy self-esteem and confidence are essential for personal growth and success. Our approach helps you develop a positive self-image and overcome limiting beliefs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Challenges</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Low self-worth and self-doubt
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Fear of judgment and criticism
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Difficulty asserting boundaries
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Perfectionism and self-criticism
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Social anxiety and avoidance
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Confidence Building Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Self-compassion and acceptance
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Cognitive restructuring techniques
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Assertiveness training
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Goal setting and achievement
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-3">•</span>
                  Social skills development
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
              How Our Confidence Building Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our systematic approach helps you identify strengths, challenge negative beliefs, and develop the confidence to pursue your goals and dreams.
            </p>
          </div>
          <ProcessSteps therapyType="confidence-building" />
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
              Common questions about confidence and self-esteem building
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
