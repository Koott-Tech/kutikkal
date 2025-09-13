import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Autism Support - Little Care",
  description: "Comprehensive autism support and therapy services. Professional care to help individuals with autism thrive and reach their full potential.",
};

export default function AutismSupportPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Autism Support
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive autism support and therapy services. Professional care to help individuals with autism spectrum disorder thrive and reach their full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-sky-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-sky-600 text-sky-600 px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Autism Support Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Autism Support
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Autism spectrum disorder affects individuals uniquely. Our comprehensive approach provides personalized support to help individuals with autism develop skills, build relationships, and achieve their goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Areas We Support</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Communication and language development
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Social skills and relationship building
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Sensory processing and regulation
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Behavioral challenges and self-regulation
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Daily living and independence skills
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Autism Support Methods</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Applied Behavior Analysis (ABA)
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Speech and language therapy
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Occupational therapy
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Social skills groups
                </li>
                <li className="flex items-start">
                  <span className="text-sky-600 mr-3">•</span>
                  Family training and support
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
              How Our Autism Support Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our individualized approach focuses on each person's unique strengths and needs, providing comprehensive support for development and growth.
            </p>
          </div>
          <ProcessSteps therapyType="autism-support" />
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
              Common questions about autism support and therapy services
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
