import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Psychological Assessments - Little Care",
  description: "Comprehensive psychological assessments including ADHD, emotional screening, intelligence tests, and projective tests for children and adults.",
};

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Psychological Assessments
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional psychological assessments to understand cognitive abilities, 
            emotional well-being, and behavioral patterns for better support and intervention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Types Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Assessment Services
          </h2>
          
          {/* ADHD Assessments */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">ADHD Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ADHD Vanderbilt</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive assessment tool for evaluating ADHD symptoms and related behavioral concerns.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ADHD Conners 3</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Advanced assessment for ADHD with comprehensive evaluation of attention and behavioral patterns.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Emotional & Behavioral Screening */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Emotional & Behavioral Screening</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Behaviour Assessment System (BASC-3)</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive evaluation of behavioral and emotional functioning.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Child Depression Inventory</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Assessment tool for identifying depression symptoms in children and adolescents.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Spence Anxiety Scale</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive assessment for anxiety disorders and related symptoms.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Intelligence Tests */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Intelligence Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">VSMS</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Vineland Social Maturity Scale for assessing adaptive behavior and social skills.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Projective Tests */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Projective Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">CAT (Child Apperception Test)</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Projective assessment tool for understanding children's emotional and psychological functioning.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Child Sentence Completion Test</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Projective technique for assessing personality and emotional development in children.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our Assessments Work
          </h2>
          <ProcessSteps therapyType="assessments" />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <HelpFaq />
        </div>
      </div>

      {/* Consultation Banner */}
      <ConsultationBanner />
    </div>
  );
}
