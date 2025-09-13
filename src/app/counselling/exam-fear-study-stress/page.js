import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Exam Fear & Study Stress - Little Care",
  description: "Overcome exam anxiety and study stress with professional support. Build confidence and effective study strategies for academic success.",
};

export default function ExamFearStudyStressPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Exam Fear & Study Stress
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Overcome exam anxiety and study stress with confidence. Professional support to help students develop effective study strategies and manage academic pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-yellow-600 text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Exam Fear & Study Stress Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Exam Anxiety and Study Stress
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Exam anxiety and study stress are common challenges that can significantly impact academic performance. Our approach helps students build confidence and develop effective learning strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Challenges</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Test anxiety and panic attacks
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Procrastination and avoidance
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Perfectionism and fear of failure
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Poor time management
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Difficulty concentrating and focusing
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Support Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Anxiety management techniques
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Study skills and strategies
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Time management training
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Confidence building exercises
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3">•</span>
                  Parent and teacher collaboration
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
              How Our Academic Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach addresses both the emotional and practical aspects of academic success, helping students thrive in their studies.
            </p>
          </div>
          <ProcessSteps therapyType="academic-support" />
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
              Common questions about exam anxiety and study stress support
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
