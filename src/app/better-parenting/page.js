import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";

export const metadata = {
  title: "Better Parenting Support - Little Care",
  description: "Comprehensive parenting support including early parent support, parenting coaching, and child development guidance for all kinds of parents.",
};

export default function BetterParentingPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Better Parenting Support
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Expert guidance and support for parents at every stage of their journey. 
            From early parenting to ongoing development, we're here to help you and your child thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* Parenting Services Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Parenting Support Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Early Parent and Postpartum Support",
                description: "Comprehensive support for new parents during the critical early months, including postpartum depression and anxiety management."
              },
              {
                title: "Parenting Coaching and Counselling",
                description: "One-on-one coaching sessions to help parents develop effective strategies and build confidence in their parenting skills."
              },
              {
                title: "Parent-Child Joint Sessions",
                description: "Therapeutic sessions involving both parent and child to improve communication, bonding, and relationship dynamics."
              },
              {
                title: "Child Development and Behaviour Support",
                description: "Expert guidance on understanding child development milestones and managing challenging behaviors effectively."
              },
              {
                title: "Help for All Kinds of Parents",
                description: "Inclusive support for single parents, blended families, LGBTQ+ parents, and parents with special needs children."
              },
              {
                title: "Group and Community Support",
                description: "Join supportive communities of parents facing similar challenges, sharing experiences and learning together."
              },
              {
                title: "Care for Parents",
                description: "Mental health support specifically for parents, addressing stress, anxiety, and the unique challenges of parenthood."
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our Parenting Support Works
          </h2>
          <ProcessSteps therapyType="parenting" />
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
