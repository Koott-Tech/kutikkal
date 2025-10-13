import HowItWorks from "@/components/HowItWorks";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Psychological Assessments - Little Care",
  description: "Comprehensive psychological assessments including ADHD, emotional screening, intelligence tests, and projective tests for children and adults.",
};

export default function AssessmentsPage() {
  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Psychological Assessments
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
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
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-8">
            Our Assessment Services
          </h2>
          
          {/* ADHD Assessments */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">ADHD Assessments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">ADHD Vanderbilt</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive assessment tool for evaluating ADHD symptoms and related behavioral concerns.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">ADHD Conners 3</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Advanced assessment for ADHD with comprehensive evaluation of attention and behavioral patterns.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Emotional & Behavioral Screening */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Emotional & Behavioral Screening</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Behaviour Assessment System (BASC-3)</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive evaluation of behavioral and emotional functioning.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Child Depression Inventory</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Assessment tool for identifying depression symptoms in children and adolescents.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Spence Anxiety Scale</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Comprehensive assessment for anxiety disorders and related symptoms.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Intelligence Tests */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Intelligence Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">VSMS</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Vineland Social Maturity Scale for assessing adaptive behavior and social skills.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            </div>
          </div>

          {/* Projective Tests */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Projective Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">CAT (Child Apperception Test)</h4>
                <p className="text-gray-600 text-sm mb-3">
                  Projective assessment tool for understanding children's emotional and psychological functioning.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Child Sentence Completion Test</h4>
                <p className="text-gray-600 text-sm mb-3">
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

      {/* Free Consultation - moved up above How It Works */}
      <ConsultationBanner />

      {/* How It Works Section (reuse homepage component) */}
      <HowItWorks />

      {/* FAQ Section */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <HelpFaq />
        </div>
      </div>
      
    </div>
  );
}
