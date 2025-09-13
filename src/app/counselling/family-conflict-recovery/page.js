import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Family Conflict Recovery - Little Care",
  description: "Professional support for family conflict resolution and recovery. Help families heal relationships and build stronger connections.",
};

export default function FamilyConflictRecoveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Family Conflict Recovery
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Heal family relationships and resolve conflicts with professional support. Build stronger family connections and create a harmonious home environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* What is Family Conflict Recovery Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Understanding Family Conflict Recovery
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Family conflicts can strain relationships and create lasting damage. Our family therapy approach helps heal wounds, improve communication, and rebuild trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Types of Family Conflicts</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Parent-child relationship issues
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Sibling rivalry and competition
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Communication breakdowns
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Divorce and separation impact
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Blended family challenges
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Family Recovery Approach</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Family systems therapy
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Communication skills training
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Conflict resolution strategies
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Emotional healing and forgiveness
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 mr-3">•</span>
                  Boundary setting and respect
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
              How Our Family Recovery Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our family-centered approach helps all members heal, communicate better, and build stronger, more loving relationships.
            </p>
          </div>
          <ProcessSteps therapyType="family-recovery" />
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
              Common questions about family conflict recovery
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
