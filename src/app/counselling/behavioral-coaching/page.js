import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Behavioral Coaching - Little Care",
  description: "Professional behavioral coaching for children and families. Evidence-based strategies to address challenging behaviors and promote positive change.",
};

export default function BehavioralCoachingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Behavioral Coaching
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform challenging behaviors into positive outcomes through evidence-based behavioral coaching techniques for children and families.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Behavioral Coaching Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Behavioral Coaching
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Behavioral coaching focuses on identifying patterns, understanding triggers, and implementing positive behavior change strategies for lasting results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Behavioral Challenges We Address</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Aggressive or defiant behaviors
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Tantrums and meltdowns
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Non-compliance and resistance
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Social interaction difficulties
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  School-related behavior issues
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Coaching Methods</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Applied Behavior Analysis (ABA)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Positive reinforcement strategies
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Behavior modification techniques
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
                  Parent training and support
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-3">•</span>
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
              How Our Behavioral Coaching Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our systematic approach identifies behavior patterns and implements positive change strategies for lasting improvement.
            </p>
          </div>
          <ProcessSteps therapyType="behavioral-coaching" />
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
              Common questions about behavioral coaching
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
