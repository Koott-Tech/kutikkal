"use client";

import { useState } from "react";

export default function Footer() {
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };
    return (
        <footer className="w-full" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <style jsx>{`
                @media (max-width: 767px) {
                    .footer-heading {
                        font-size: 28px !important;
                        line-height: 0.95 !important;
                        font-weight: 600 !important;
                    }
                    .footer-description {
                        line-height: 1.2 !important;
                    }
                }
            `}</style>
            {/* New section above footer */}
            <div className="w-full py-16 px-8 md:px-16 lg:px-24" style={{ 
                background: 'linear-gradient(to bottom, #f3f0ff, #e0d8ff)'
            }}>
                <div className="text-center max-w-4xl mx-auto">
                    <h4 className="footer-heading mb-2 font-semibold">
                        Confused where to start?
                    </h4>
                    <p className="footer-description text-sm md:text-base text-gray-700 mb-8 leading-relaxed">
                        Book a free 20 minutes session with our psychologist.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <a
                            href="https://wa.me/"
                            className="px-5 py-2.5 rounded-3xl font-semibold transition-all duration-200"
                            style={{ backgroundColor: 'transparent', color: '#3f2e73', border: '2px solid #3f2e73' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3f2e73'; e.currentTarget.style.color = '#ffffff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#3f2e73'; }}
                        >
                            WhatsApp Us
                        </a>
                        <button 
                            className="text-white px-8 py-3 rounded-3xl font-semibold transition-all duration-200 shadow-sm" 
                            style={{ backgroundColor: '#3f2e73' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
                        >
                            Book  Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Original footer content */}
            <div className="w-full py-16" style={{ backgroundColor: '#15171A' }}>
                {/* Top horizontal line at the very beginning */}
                <div className="absolute top-0 left-0 w-full h-3 bg-white"></div>
                
                <div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 mt-4">
                    {/* Main footer content - header-like FAQ dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 xl:gap-16">
                        {/* Counselling (mirrors header nested submenu) */}
                        <div className="space-y-5">
                            <button
                                onClick={() => toggleSection('counselling')}
                                className="md:hidden flex items-center justify-between w-full cursor-pointer"
                            >
                                <h5 className="text-white">Counselling</h5>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.counselling ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h5 className="hidden md:block text-white mb-8">Counselling</h5>
                            <div className={`${openSections.counselling ? 'block' : 'hidden md:block'} space-y-3`}>
                                {/* Category: Emotional & Mental Health */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSection('c_emotional')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Emotional & Mental Health</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.c_emotional ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.c_emotional ? 'block' : 'hidden'}`}>
                                        <li><a href="/counselling/anxiety-sadness" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Anxiety Counselling</a></li>
                                        <li><a href="/counselling/depression" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Depression Counselling</a></li>
                                        <li><a href="/counselling/big-emotions" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Big Emotions (CBT – Kids)</a></li>
                                        <li><a href="/counselling/overthinking-ocd" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Overthinking & OCD</a></li>
                                        <li><a href="/counselling/fear-phobias-support" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Fear & Phobias Support</a></li>
                                    </ul>
                                </div>
                                {/* Category: Child Development & Learning */}
                                <div className="space-y-1 mt-2">
                                    <button
                                        onClick={() => toggleSection('c_development')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Child Development & Learning</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.c_development ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.c_development ? 'block' : 'hidden'}`}>
                                        <li><a href="/counselling/adhd-attention" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">ADHD or Attention Struggles</a></li>
                                        <li><a href="/counselling/learning-difficulties" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Learning Difficulties (Remedial)</a></li>
                                        <li><a href="/counselling/autism-support" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Autism Support</a></li>
                                        <li><a href="/counselling/communication-social-skills" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Communication & Social Skills</a></li>
                                    </ul>
                                </div>
                                {/* Category: Behaviour & Confidence */}
                                <div className="space-y-1 mt-2">
                                    <button
                                        onClick={() => toggleSection('c_behaviour')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Behaviour & Confidence</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.c_behaviour ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.c_behaviour ? 'block' : 'hidden'}`}>
                                        <li><a href="/counselling/behavioral-coaching" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Behavioral Coaching</a></li>
                                        <li><a href="/counselling/confidence-self-esteem" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Confidence & Self-Esteem</a></li>
                                    </ul>
                                </div>
                                {/* Category: Stress & Academic Support */}
                                <div className="space-y-1 mt-2">
                                    <button
                                        onClick={() => toggleSection('c_stress')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Stress & Academic Support</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.c_stress ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.c_stress ? 'block' : 'hidden'}`}>
                                        <li><a href="/counselling/exam-fear-study-stress" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Exam Fear & Study Stress</a></li>
                                    </ul>
                                </div>
                                {/* Category: Trauma & Healing */}
                                <div className="space-y-1 mt-2">
                                    <button
                                        onClick={() => toggleSection('c_trauma')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Trauma & Healing</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.c_trauma ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.c_trauma ? 'block' : 'hidden'}`}>
                                        <li><a href="/counselling/grief-loss" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Grief & Loss</a></li>
                                        <li><a href="/counselling/trauma-abuses" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Trauma & Abuses</a></li>
                                        <li><a href="/counselling/family-conflict-recovery" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Family Conflict Recovery</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* Assessments */}
                        <div className="space-y-5 lg:ml-4 xl:ml-8">
                            <button
                                onClick={() => toggleSection('assessments')}
                                className="md:hidden flex items-center justify-between w-full cursor-pointer"
                            >
                                <h5 className="text-white">Assessments</h5>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.assessments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h5 className="hidden md:block text-white mb-8">Assessments</h5>
                            <div className={`${openSections.assessments ? 'block' : 'hidden md:block'} space-y-3`}>
                                {/* Category: ADHD Assessments */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSection('a_adhd')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>ADHD Assessments</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_adhd ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-1 ${openSections.a_adhd ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/adhd-vanderbilt" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">ADHD Vanderbilt</a></li>
                                        <li><a href="/assessments/adhd-conners-3" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">ADHD Conners 3</a></li>
                                    </ul>
                                </div>
                                {/* Category: Emotional & Behavioral Screening */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSection('a_emotional')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90 text-left cursor-pointer gap-2"
                                    >
                                        <span className="text-left">Emotional & Behavioral</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_emotional ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-1 text-left ${openSections.a_emotional ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/basc-3" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">BASC-3</a></li>
                                        <li><a href="/assessments/child-depression-inventory" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Child Depression Inventory</a></li>
                                        <li><a href="/assessments/spence-anxiety-scale" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Spence Anxiety Scale</a></li>
                                    </ul>
                                </div>
                                {/* Category: Intelligence Tests */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSection('a_intelligence')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Intelligence Tests</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_intelligence ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-1 ${openSections.a_intelligence ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/vsms" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">VSMS</a></li>
                                    </ul>
                                </div>
                                {/* Category: Projective Tests */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => toggleSection('a_projective')}
                                        className="flex w-full items-center justify-between text-base font-normal text-white/90 cursor-pointer"
                                    >
                                        <span>Projective Tests</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_projective ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-1 ${openSections.a_projective ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/cat" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">CAT (Child Apperception Test)</a></li>
                                        <li><a href="/assessments/child-sentence-completion" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Child Sentence Completion Test</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* About Us */}
                        <div className="space-y-5 lg:ml-8 xl:ml-16">
                            <button
                                onClick={() => toggleSection('about')}
                                className="md:hidden flex items-center justify-between w-full cursor-pointer"
                            >
                                <h5 className="text-white">About Us</h5>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.about ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h5 className="hidden md:block text-white mb-8">About Us</h5>
                            <ul className={`space-y-1 text-base leading-relaxed ${openSections.about ? 'block' : 'hidden md:block'}`}>
                                <li><a href="/about" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Our story</a></li>
                                <li><a href="/faq" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">FAQ</a></li>
                                <li><a href="/career" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Careers</a></li>
                                <li><a href="/contact" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Contact</a></li>
                            </ul>
                        </div>
                        {/* Resources */}
                        <div className="space-y-5">
                            <button
                                onClick={() => toggleSection('resources')}
                                className="md:hidden flex items-center justify-between w-full cursor-pointer"
                            >
                                <h5 className="text-white">Resources</h5>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.resources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h5 className="hidden md:block text-white mb-8">Resources</h5>
                            <ul className={`space-y-1 text-base leading-relaxed ${openSections.resources ? 'block' : 'hidden md:block'}`}>
                                <li><a href="/blog" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Blog</a></li>
                                <li><a href="/resources" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Guides</a></li>
                                <li><a href="/free-assessment" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Free assessment</a></li>
                                <li><a href="/assessments" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Tools</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Help/Emergency section and bottom bar */}
                <div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 mt-4">
                    <div className="w-full h-px my-8 bg-white/40"></div>
                    <div className="mt-0 text-white">
                        <h5 className="mb-4 text-center md:text-left "><span className="italic" style={{ color: '#eae5ff', fontSize: '28px' }}>We're</span> Little Care</h5>
                        <div className="space-y-3 text-center md:text-left">
                            
                            <div className="text-base md:text-lg text-white/70 leading-[1] p2">
                             A team of psychologists who believe every child and parent deserves understanding, guidance, and a space to grow emotionally and happily.
                            </div>
                            <div className="w-full h-px mt-10 mb-3 bg-white/40"></div>

                            <div className="text-white/70 leading-[1]" style={{ fontSize: '13px' }}>
                            If you're in crisis or need immediate help, please contact your local emergency helpline (India (24×7) 1800-891-4416) or visit the nearest hospital.
                            </div>
                           
                          
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white/90 text-sm mt-6">
                            <p className="p2 text-center md:text-left">©️ Little Care by Koott Care Pvt. Ltd. All rights reserved</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
                                <a href="#" className="hover:text-white transition-colors">TERMS AND CONDITIONS</a>
                                <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
                                <a href="#" className="hover:text-white transition-colors">THERAPY AGREEMENT</a>
                                <a href="#" className="hover:text-white transition-colors">REFUND POLICY</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
