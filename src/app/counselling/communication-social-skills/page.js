import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Communication & Social Skills - Little Care",
  description: "Develop essential communication and social skills for children and adults. Professional support for building meaningful relationships and effective communication.",
};

export default function CommunicationSocialSkillsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Communication & Social Skills
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build essential communication and social skills for meaningful relationships. Professional support for children and adults to thrive in social situations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Communication & Social Skills Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Building Essential Social Skills
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Effective communication and social skills are fundamental to success in relationships, school, and work. We help develop these crucial life skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Skills We Develop</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Verbal and non-verbal communication
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Active listening and empathy
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Conflict resolution skills
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Making and maintaining friendships
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Assertiveness and boundaries
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Social skills training groups
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Role-playing and practice exercises
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Communication skill building
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Peer interaction support
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-3">•</span>
                  Family and school collaboration
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
              How Our Social Skills Program Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our structured program builds communication and social skills through practice, feedback, and real-world application.
            </p>
          </div>
          <ProcessSteps therapyType="social-skills" />
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
              Common questions about communication and social skills development
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
