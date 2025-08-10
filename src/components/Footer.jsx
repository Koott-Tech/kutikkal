"use client";

export default function Footer() {
    return (
        <footer className="h-screen w-full flex items-center justify-center font-['Inter']" style={{ backgroundColor: '#1e9d5d' }}>
            {/* Top horizontal line at the very beginning */}
            <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: '#171c21' }}></div>
            
            <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 mt-12">
                {/* Top horizontal line */}
                <div className="w-full h-px mb-16" style={{ backgroundColor: '#171c21' }}></div>
                
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16 flex-1">
                    {/* Kuttikal Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold leading-relaxed tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>Kuttikal</h3>
                        <ul className="space-y-4 text-base leading-relaxed">
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">About us</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Insurance & pricing</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Locations</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">FAQ</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Editorial policy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Press</a></li>
                            <li className="flex items-center gap-2">
                                <a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Careers</a>
                                <span className="bg-yellow-400 text-black text-sm px-3 py-1 rounded-full font-bold tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>HIRING</span>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold leading-relaxed tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>Resources</h3>
                        <ul className="space-y-4 text-base leading-relaxed">
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Anxiety</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Depression</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Grief & loss</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Relationships</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Self-care</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Stress</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">All topics</a></li>
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold leading-relaxed tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>Services</h3>
                        <ul className="space-y-4 text-base leading-relaxed">
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Individual therapy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Psychiatry / medication management</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Online therapy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Child / teen therapy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Family therapy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Couples / marriage therapy</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Find a therapist</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Find a psychiatric NP</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Refer a patient</a></li>
                        </ul>
                    </div>

                    {/* Insurance Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold leading-relaxed tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>Insurance*</h3>
                        <ul className="space-y-4 text-base leading-relaxed">
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Aetna</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Optum / UnitedHealthcare</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Blue Cross Blue Shield Plans</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Beacon Health</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Cigna</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Tricare West</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Humana</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Medicare</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Tufts Health Plans</a></li>
                            <li><a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">All Insurances</a></li>
                        </ul>
                        <p className="text-sm mt-6 leading-relaxed font-medium" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>*Varies by location</p>
                    </div>

                    {/* Reach Us Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold leading-relaxed tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>Reach Us</h3>
                        <div className="space-y-4 text-base leading-relaxed">
                            <p className="text-xl font-bold tracking-wide" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }}>(855) 204-2767</p>
                            <a href="#" style={{ color: '#171c21', fontFamily: 'Inter, system-ui, sans-serif' }} className="hover:text-green-200 transition-colors duration-200 font-medium">Contact us</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
