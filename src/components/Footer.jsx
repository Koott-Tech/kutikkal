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
            {/* New section above footer */}
            <div className="w-full py-16 px-8 md:px-16 lg:px-24" style={{ 
                background: 'linear-gradient(to bottom, #f3f0ff, #e0d8ff)'
            }}>
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 mb-4 leading-tight">
                        Ready to start yout journeyto mental well-being?
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 mb-8 leading-relaxed">
                        We'll find you a provider in-network with your insurance that specializes in the care you're looking for.
                    </p>
                    <button className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-3 rounded-3xl font-medium transition-all duration-200 shadow-sm">
                        Get started
                    </button>
                </div>
            </div>

            {/* Original footer content */}
            <div className="w-full py-16" style={{ backgroundColor: 'rgba(62, 46, 115, 0.9)' }}>
                {/* Top horizontal line at the very beginning */}
                <div className="absolute top-0 left-0 w-full h-3 bg-white"></div>
                
                <div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 mt-12">
                    {/* Top horizontal line */}
                    <div className="w-full h-px mb-16 bg-white"></div>
                    {/* Main footer content - header-like FAQ dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                        {/* Counselling (mirrors header nested submenu) */}
                        <div className="space-y-4">
                            <button
                                onClick={() => toggleSection('counselling')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Counselling</span>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.counselling ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Counselling</h3>
                            <div className={`${openSections.counselling ? 'block' : 'hidden md:block'} space-y-6`}>
                                {/* Category: Emotional & Mental Health */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleSection('c_emotional')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
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
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => toggleSection('c_development')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
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
                                {/* Category: Behaviour & Confidence Building */}
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => toggleSection('c_behaviour')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
                                    >
                                        <span>Behaviour & Confidence Building</span>
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
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => toggleSection('c_stress')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
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
                                <div className="space-y-2 mt-4">
                                    <button
                                        onClick={() => toggleSection('c_trauma')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
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
                        <div className="space-y-6">
                            <button
                                onClick={() => toggleSection('assessments')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Assessments</span>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.assessments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Assessments</h3>
                            <div className={`${openSections.assessments ? 'block' : 'hidden md:block'} space-y-6`}>
                                {/* Category: ADHD Assessments */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleSection('a_adhd')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
                                    >
                                        <span>ADHD Assessments</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_adhd ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.a_adhd ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/adhd-vanderbilt" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">ADHD Vanderbilt</a></li>
                                        <li><a href="/assessments/adhd-conners-3" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">ADHD Conners 3</a></li>
                                    </ul>
                                </div>
                                {/* Category: Emotional & Behavioral Screening */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleSection('a_emotional')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90 text-left"
                                    >
                                        <span className="text-left">Emotional & Behavioral Screening</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_emotional ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 text-left ${openSections.a_emotional ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/basc-3" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">BASC-3</a></li>
                                        <li><a href="/assessments/child-depression-inventory" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Child Depression Inventory</a></li>
                                        <li><a href="/assessments/spence-anxiety-scale" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Spence Anxiety Scale</a></li>
                                    </ul>
                                </div>
                                {/* Category: Intelligence Tests */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleSection('a_intelligence')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
                                    >
                                        <span>Intelligence Tests</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_intelligence ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.a_intelligence ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/vsms" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">VSMS</a></li>
                                    </ul>
                                </div>
                                {/* Category: Projective Tests */}
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleSection('a_projective')}
                                        className="flex w-full items-center justify-between text-base font-semibold text-white/90"
                                    >
                                        <span>Projective Tests</span>
                                        <svg className={`w-4 h-4 transition-transform ${openSections.a_projective ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <ul className={`ml-2 pl-2 border-l border-white/20 space-y-2 ${openSections.a_projective ? 'block' : 'hidden'}`}>
                                        <li><a href="/assessments/cat" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">CAT (Child Apperception Test)</a></li>
                                        <li><a href="/assessments/child-sentence-completion" className="text-white hover:text-green-200 transition-colors duration-200 text-sm">Child Sentence Completion Test</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        {/* About Us */}
                        <div className="space-y-6">
                            <button
                                onClick={() => toggleSection('about')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>About Us</span>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.about ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">About Us</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.about ? 'block' : 'hidden md:block'}`}>
                                <li><a href="/about" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Our story</a></li>
                                <li><a href="/faq" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">FAQ</a></li>
                                <li><a href="/career" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Careers</a></li>
                                <li><a href="/contact" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Contact</a></li>
                            </ul>
                        </div>
                        {/* Resources */}
                        <div className="space-y-6">
                            <button
                                onClick={() => toggleSection('resources')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Resources</span>
                                <svg className={`w-5 h-5 transition-transform duration-200 ${openSections.resources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Resources</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.resources ? 'block' : 'hidden md:block'}`}>
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
                    <div className="w-full h-px mb-8 bg-white/40"></div>
                    <div className="mt-12 text-white">
                        <h3 className="text-2xl md:text-3xl font-medium mb-6 text-left md:text-left">Here to help</h3>
                        <div className="space-y-4 text-left md:text-left">
                            <div className="text-lg md:text-xl font-semibold">Emergency</div>
                            <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                The 9152987821 Suicide and Crisis Lifeline provides 24/7, confidential support with trained crisis counselors.
                            </p>
                            <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                If you or a loved one is in emotional distress or a suicidal crisis, please call or text 9152987821.
                            </p>
                        </div>
                        <div className="w-full h-px my-10 bg-white/40"></div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 text-white/90 text-sm">
                            <div className="text-center md:text-left">© 2025 Path CCM, Inc. d/b/a Little Care. All rights reserved.</div>
                            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="hover:text-white transition-colors">Notice of Privacy Practice</a>
                                <a href="#" className="hover:text-white transition-colors">No Surprises Act</a>
                                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                                <a href="#" className="hover:text-white transition-colors">Patient Rights</a>
                                <a href="#" className="hover:text-white transition-colors">Provider Positions</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
