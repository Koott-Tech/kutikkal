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
            <div className="w-full py-16" style={{ backgroundColor: '#3f2e73' }}>
                {/* Top horizontal line at the very beginning */}
                <div className="absolute top-0 left-0 w-full h-3 bg-white"></div>
                
                <div className="w-full flex flex-col justify-center px-8 md:px-16 lg:px-24 mt-12">
                    {/* Top horizontal line */}
                    <div className="w-full h-px mb-16 bg-white"></div>
                    
                    {/* Main footer content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
                        {/* LittleMinds Column */}
                        <div className="space-y-6">
                            <button 
                                onClick={() => toggleSection('littleminds')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>LittleMinds</span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-200 ${openSections.littleminds ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">LittleMinds</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.littleminds ? 'block' : 'hidden md:block'}`}>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">About us</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Insurance & pricing</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Locations</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">FAQ</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Editorial policy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Press</a></li>
                                <li className="flex items-center gap-2">
                                    <a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Careers</a>
                                    <span className="bg-yellow-400 text-black text-sm px-3 py-1 rounded-full font-bold tracking-wide">HIRING</span>
                                </li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="space-y-6">
                            <button 
                                onClick={() => toggleSection('resources')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Resources</span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-200 ${openSections.resources ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Resources</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.resources ? 'block' : 'hidden md:block'}`}>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Anxiety</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Depression</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Grief & loss</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Relationships</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Self-care</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Stress</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">All topics</a></li>
                            </ul>
                        </div>

                        {/* Services Column */}
                        <div className="space-y-6">
                            <button 
                                onClick={() => toggleSection('services')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Services</span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-200 ${openSections.services ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Services</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.services ? 'block' : 'hidden md:block'}`}>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Individual therapy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Psychiatry / medication management</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Online therapy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Child / teen therapy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Family therapy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Couples / marriage therapy</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Find a therapist</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Find a psychiatric NP</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Refer a patient</a></li>
                            </ul>
                        </div>

                        {/* Insurance Column */}
                        <div className="space-y-6">
                            <button 
                                onClick={() => toggleSection('insurance')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Insurance*</span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-200 ${openSections.insurance ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Insurance*</h3>
                            <ul className={`space-y-4 text-base leading-relaxed ${openSections.insurance ? 'block' : 'hidden md:block'}`}>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Aetna</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Optum / UnitedHealthcare</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Blue Cross Blue Shield Plans</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Beacon Health</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Cigna</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Tricare West</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Humana</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Medicare</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Tufts Health Plans</a></li>
                                <li><a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">All Insurances</a></li>
                            </ul>
                            <p className="text-sm mt-6 leading-relaxed font-medium text-white">*Varies by location</p>
                        </div>

                        {/* Reach Us Column */}
                        <div className="space-y-6">
                            <button 
                                onClick={() => toggleSection('reachus')}
                                className="md:hidden flex items-center justify-between w-full text-lg font-bold leading-relaxed tracking-wide text-white"
                            >
                                <span>Reach Us</span>
                                <svg 
                                    className={`w-5 h-5 transition-transform duration-200 ${openSections.reachus ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <h3 className="hidden md:block text-2xl font-bold leading-relaxed tracking-wide text-white">Reach Us</h3>
                            <div className={`space-y-4 text-base leading-relaxed ${openSections.reachus ? 'block' : 'hidden md:block'}`}>
                                <p className="text-xl font-bold tracking-wide text-white">(855) 204-2767</p>
                                <a href="#" className="text-white hover:text-green-200 transition-colors duration-200 font-medium">Contact us</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
