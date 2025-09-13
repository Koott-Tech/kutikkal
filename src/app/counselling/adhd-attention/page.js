import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "ADHD or Attention Struggles - Little Care",
  description: "Professional support for children and adults with ADHD and attention difficulties. Evidence-based interventions to improve focus and executive functioning.",
};

export default function ADHDSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ADHD or Attention Struggles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive support for ADHD and attention difficulties. We help children and adults develop focus, organization, and executive functioning skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is ADHD Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding ADHD and Attention Challenges
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ADHD affects attention, impulse control, and executive functioning. Our evidence-based approach helps individuals develop strategies to thrive in daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Challenges</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Difficulty sustaining attention
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Impulsivity and hyperactivity
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Executive functioning difficulties
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Time management struggles
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Organization and planning issues
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Support Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Behavioral interventions
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Executive function training
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Attention and focus exercises
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Organization skill building
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3">•</span>
                  Parent and family support
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
              How Our ADHD Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach addresses attention, behavior, and executive functioning through personalized interventions.
            </p>
          </div>
          <ProcessSteps therapyType="adhd-support" />
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
              Common questions about ADHD and attention support
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
