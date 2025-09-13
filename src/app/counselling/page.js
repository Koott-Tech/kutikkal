import ProcessSteps from "@/components/ProcessSteps";
import HelpFaq from "@/components/HelpFaq";
import ConsultationBanner from "@/components/ConsultationBanner";
import Link from "next/link";

export const metadata = {
  title: "Counselling Services - Little Care",
  description: "Professional counselling services for individuals and families. Expert therapists providing personalized care for mental health and well-being.",
};

export default function CounsellingPage() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional Counselling Services
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Expert therapists providing personalized counselling for individuals and families. 
            Get the support you need for mental health and well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Free Consultation
            </button>
            <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              View Therapists
            </button>
          </div>
        </div>
      </div>

      {/* Counselling Types Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Individual & Package Counselling Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Big Emotions (CBT - Kids)", url: "/counselling/big-emotions" },
              { name: "ADHD or Attention struggles", url: "/counselling/adhd-attention" },
              { name: "Behavioral Coaching", url: "/counselling/behavioral-coaching" },
              { name: "Communication & Social Skills", url: "/counselling/communication-social-skills" },
              { name: "Anxiety, Sadness or Low mood", url: "/counselling/anxiety-sadness" },
              { name: "Overthinking & OCD", url: "/counselling/overthinking-ocd" },
              { name: "Exam Fear & Study Stress", url: "/counselling/exam-fear-study-stress" },
              { name: "Learning Difficulties (Remedial)", url: "/counselling/learning-difficulties" },
              { name: "Trauma & Abuses", url: "/counselling/trauma-abuses" },
              { name: "Confidence & Self-esteem", url: "/counselling/confidence-self-esteem" },
              { name: "Family Conflict Recovery", url: "/counselling/family-conflict-recovery" },
              { name: "Grief & Loss", url: "/counselling/grief-loss" },
              { name: "Fear & Phobias Support", url: "/counselling/fear-phobias-support" },
              { name: "Autism Support", url: "/counselling/autism-support" }
            ].map((service, index) => (
              <Link key={index} href={service.url} className="block">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Professional counselling support tailored to your specific needs and challenges.
                  </p>
                  <div className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                    Learn More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How Our Counselling Works
          </h2>
          <ProcessSteps therapyType="counselling" />
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
