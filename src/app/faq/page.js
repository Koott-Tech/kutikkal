"use client";

import { useState } from "react";
import Header from '@/components/Header';

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "How do I become a provider with LittleMinds?",
      answer: "To become a provider with LittleMinds, you'll need to complete our application process which includes credentialing, licensing verification, and a brief interview. Our team will guide you through each step to ensure a smooth onboarding experience."
    },
    {
      question: "What types of providers do you work with?",
      answer: "We work with licensed therapists, psychologists, psychiatrists, and psychiatric nurse practitioners. We welcome providers from various specialties including individual therapy, couples therapy, family therapy, child therapy, and medication management."
    },
    {
      question: "What are the requirements for joining your network?",
      answer: "Requirements include active state licensure, malpractice insurance, completion of our credentialing process, and agreement to our provider terms. We also require providers to maintain continuing education requirements and professional standards."
    },
    {
      question: "How does the payment and billing process work?",
      answer: "We handle all insurance billing and patient payments on your behalf. You'll receive payments directly to your account within 30 days of service completion. We provide detailed reporting and transparent fee structures."
    },
    {
      question: "What technology and support do you provide?",
      answer: "We provide a comprehensive telehealth platform including secure video sessions, scheduling tools, patient management systems, and 24/7 technical support. Our platform is HIPAA-compliant and designed for ease of use."
    },
    {
      question: "How do you handle patient matching and referrals?",
      answer: "Our matching system considers patient needs, provider specialties, availability, and preferences. We use advanced algorithms to ensure optimal matches and provide ongoing support for both providers and patients throughout the therapeutic relationship."
    },
    {
      question: "What are the session rates and fee structures?",
      answer: "Session rates vary based on provider credentials, specialty, and location. We offer competitive rates and transparent fee structures. Our team will provide detailed information about rates during the onboarding process."
    },
    {
      question: "How do you support provider growth and development?",
      answer: "We offer continuing education opportunities, peer consultation groups, professional development resources, and regular training sessions. We also provide access to our clinical team for case consultation and support."
    },
    {
      question: "What insurance networks do you work with?",
      answer: "We work with major insurance networks including Aetna, Blue Cross Blue Shield, Cigna, UnitedHealthcare, and many others. We handle all insurance credentialing and billing processes on your behalf."
    },
    {
      question: "How do you ensure quality of care and patient satisfaction?",
      answer: "We maintain high standards through regular provider reviews, patient feedback systems, and quality assurance protocols. We provide ongoing support and resources to help providers deliver excellent care."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="w-full py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about becoming a provider with LittleMinds and our services.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-t border-gray-200">
                {/* FAQ Header */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* FAQ Content */}
                {openFaq === index && (
                  <div className="px-6 pb-4 bg-white">
                    <div className="pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>




    </div>
  );
}
