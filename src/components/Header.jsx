"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [isFindCareOpen, setIsFindCareOpen] = useState(false);
  const [isForProvidersOpen, setIsForProvidersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFindCareOpen, setIsMobileFindCareOpen] = useState(false);
  const [isMobileForProvidersOpen, setIsMobileForProvidersOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleBlogClick = () => {
    router.push('/blog');
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const handleTherapyTypeClick = (therapyType) => {
    const routeMap = {
      "Individual therapy": "/individual-therapy",
      "Couples therapy": "/couples-therapy",
      "Family therapy": "/family-therapy",
      "Child therapy": "/child-therapy",
      "Teen therapy": "/teen-therapy",
      "Psychiatry": "/psychiatry"
    };
    
    const route = routeMap[therapyType];
    if (route) {
      router.push(route);
      setIsFindCareOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  const handleFAQClick = () => {
    router.push('/faq');
    setIsFindCareOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleGetStartedClick = () => {
    router.push('/');
    setIsFindCareOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAboutClick = () => {
    router.push('/about');
    setIsMobileMenuOpen(false);
  };

  const handleCompanyClick = () => {
    router.push('/about');
    setIsAboutOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCareerClick = () => {
    router.push('/career');
    setIsAboutOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      router.push('/admin');
    } else if (user?.role === 'psychologist') {
      router.push('/psychologist');
    } else if (user?.role === 'finance') {
      router.push('/finance');
    } else {
      router.push('/profile');
    }
    setIsUserMenuOpen(false);
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'superadmin': 'Super Admin',
      'psychologist': 'Psychologist',
      'finance': 'Finance',
      'client': 'Client',
      'user': 'User'
    };
    return roleMap[role] || role;
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // For admins, show email
    if (user.role === 'admin' || user.role === 'superadmin') {
      return user.email;
    }
    
    // For psychologists, show name from profile
    if (user.role === 'psychologist' && user.profile) {
      return `${user.profile.first_name} ${user.profile.last_name}`.trim();
    }
    
    // For clients, show name from profile
    if (user.role === 'client' && user.profile) {
      return `${user.profile.first_name} ${user.profile.last_name}`.trim();
    }
    
    // Fallback to email if no name available
    return user.email || 'User';
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    
    const displayName = getUserDisplayName();
    
    // For admins, use first letter of email
    if (user.role === 'admin' || user.role === 'superadmin') {
      return displayName.charAt(0).toUpperCase();
    }
    
    // For others, use first letter of name
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 md:pl-[50px] md:pr-[50px]">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Left group: Brand + Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex items-center">
              <button 
                onClick={handleHomeClick}
                className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
              >
                LittleMinds
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex items-center gap-10 text-base font-extrabold text-gray-800">
                <li className="relative group">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setIsFindCareOpen(!isFindCareOpen);
                      setIsForProvidersOpen(false);
                    }}
                  >
                  <span style={{ fontWeight: 400 }}>Find Care</span>
                    <ChevronUpIcon className={`transition-transform ${isFindCareOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-300 group-hover:w-20"></span>
                  
                  {/* Find Care Dropdown */}
                  {isFindCareOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                      {/* Top section - Types of care */}
                      <div className="px-4 pb-3 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Types of care</h3>
                                                 <div className="space-y-2">
                           {[
                             "Individual therapy",
                             "Couples therapy", 
                             "Family therapy",
                             "Child therapy",
                             "Teen therapy",
                             "Psychiatry"
                           ].map((option) => (
                             <div 
                               key={option} 
                               className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                               onClick={() => handleTherapyTypeClick(option)}
                             >
                               <span className="text-gray-700 text-sm font-medium">{option}</span>
                             </div>
                           ))}
                         </div>
                      </div>
                      
                                             {/* Bottom section - Get Started and FAQs */}
                       <div className="px-4 pt-3">
                         <div className="space-y-2">
                           <div 
                             className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                             onClick={handleGetStartedClick}
                           >
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                               </svg>
                             </div>
                             <span className="text-gray-700 text-sm font-medium">Get Started</span>
                           </div>
                           <div 
                             className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                             onClick={handleFAQClick}
                           >
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                             <span className="text-gray-700 text-sm font-medium">FAQs</span>
                           </div>
                         </div>
                       </div>
                    </div>
                  )}
                </li>
                <li className="relative group">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setIsForProvidersOpen(!isForProvidersOpen);
                      setIsFindCareOpen(false);
                    }}
                  >
                  <span style={{ fontWeight: 400 }}>For Providers</span>
                    <ChevronUpIcon className={`transition-transform ${isForProvidersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-300 group-hover:w-20"></span>
                  
                  {/* For Providers Dropdown */}
                  {isForProvidersOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                                             {/* Top section - Main options */}
                       <div className="px-4 pb-3 border-b border-gray-200">
                         <div className="space-y-2">
                           <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                               </svg>
                             </div>
                             <span className="text-gray-700 text-sm font-medium">Therapy</span>
                           </div>
                           <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                               </svg>
                             </div>
                             <span className="text-gray-700 text-sm font-medium">Psychiatry</span>
                           </div>
                           <div 
                             className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                             onClick={() => {
                               handleFAQClick();
                               setIsForProvidersOpen(false);
                             }}
                           >
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                             <span className="text-gray-700 text-sm font-medium">FAQs</span>
                           </div>
                         </div>
                       </div>
                       
                       {/* Bottom section - Other services */}
                       <div className="px-4 pt-3">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Other services</h3>
                         <div className="space-y-2">
                           <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                             <span className="text-gray-700 text-sm font-medium">In-person therapy</span>
                           </div>
                           <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                             <span className="text-gray-700 text-sm font-medium">Medicare & Medicaid</span>
                           </div>
                         </div>
                       </div>
                    </div>
                  )}
                </li>
                <li className="relative group">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setIsAboutOpen(!isAboutOpen);
                      setIsFindCareOpen(false);
                      setIsForProvidersOpen(false);
                    }}
                  >
                    <span style={{ fontWeight: 400 }}>About Us</span>
                    <ChevronUpIcon className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-300 group-hover:w-20"></span>
                  
                                     {/* About Us Dropdown */}
                   {isAboutOpen && (
                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                       <div className="px-4 space-y-2">
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                           onClick={handleCompanyClick}
                         >
                           <span className="text-gray-700 text-sm font-medium">Company</span>
                         </div>
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                           onClick={handleCareerClick}
                         >
                           <span className="text-gray-700 text-sm font-medium">Career</span>
                         </div>
                       </div>
                     </div>
                   )}
                </li>
                <li className="relative group cursor-pointer hover:text-gray-900">
                  <span onClick={handleBlogClick} style={{ fontWeight: 400 }}>Blog</span>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-300 group-hover:w-20"></span>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <button 
              onClick={handleLoginClick}
              className="hidden md:inline-flex items-center gap-1 text-base font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
            >
              <span style={{ fontWeight: 400 }}>Login</span>
            </button>
            <button className="hidden md:inline-flex items-center rounded-full px-4 py-2 text-base font-semibold text-white shadow-sm transition-colors" style={{ backgroundColor: '#3e2e73' }}>
              Get started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-50">
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-semibold text-gray-900">LittleMinds</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-4 space-y-0">
              <div className="space-y-0">
                {/* Find Care */}
                <div className="py-2 border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-4 py-1.5"
                    onClick={() => setIsMobileFindCareOpen(!isMobileFindCareOpen)}
                  >
                    <span className="text-lg font-medium text-gray-900">Find Care</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileFindCareOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Find Care Dropdown Content */}
                  {isMobileFindCareOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      <div className="px-4 py-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Types of care</h3>
                        <div className="space-y-2">
                          {[
                            "Individual therapy",
                            "Couples therapy", 
                            "Family therapy",
                            "Child therapy",
                            "Teen therapy",
                            "Psychiatry"
                          ].map((option) => (
                            <div 
                              key={option} 
                              className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => handleTherapyTypeClick(option)}
                            >
                              <span className="text-gray-700 text-sm font-medium">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="px-4 pt-3 border-t border-gray-200">
                        <div className="space-y-2">
                          <div 
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={handleGetStartedClick}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Get Started</span>
                          </div>
                          <div 
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={handleFAQClick}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">FAQs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* For Providers */}
                <div className="py-2 border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-4 py-1.5"
                    onClick={() => setIsMobileForProvidersOpen(!isMobileForProvidersOpen)}
                  >
                    <span className="text-lg font-medium text-gray-900">For Providers</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileForProvidersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* For Providers Dropdown Content */}
                  {isMobileForProvidersOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      <div className="px-4 py-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Therapy</span>
                          </div>
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">Psychiatry</span>
                          </div>
                          <div 
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              handleFAQClick();
                              setIsMobileForProvidersOpen(false);
                            }}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">FAQs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 pt-3 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Other services</h3>
                        <div className="space-y-2">
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm font-medium">In-person therapy</span>
                          </div>
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm font-medium">Medicare & Medicaid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Us */}
                <div className="py-2 border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-4 py-1.5"
                    onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                  >
                    <span className="text-lg font-medium text-gray-900">About Us</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* About Us Dropdown Content */}
                  {isMobileAboutOpen && (
                    <div className="mt-2 ml-4 space-y-2">
                      <div className="px-4 py-2">
                        <div className="space-y-2">
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={handleCompanyClick}
                          >
                            <span className="text-gray-700 text-sm font-medium">Company</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={handleCareerClick}
                          >
                            <span className="text-gray-700 text-sm font-medium">Career</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated() ? (
              /* Logged in user menu */
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-base font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-semibold text-sm">
                      {getUserInitial()}
                    </span>
                  </div>
                  <span>{getUserDisplayName()}</span>
                  <ChevronUpIcon className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                    <div className="px-4 pb-3 border-b border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{getUserDisplayName()}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      <div className="text-xs text-indigo-600 font-medium mt-1">
                        {getRoleDisplayName(user?.role)}
                      </div>
                    </div>
                    <div className="px-4 pt-3 space-y-2">
                      <button
                        onClick={handleProfileClick}
                        className="w-full text-left py-2 px-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 px-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login button for non-authenticated users */
              <button 
                onClick={handleLoginClick}
                className="hidden md:inline-flex items-center gap-1 text-base font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
              >
                <span>Login</span>
              </button>
            )}
            <button className="inline-flex items-center rounded-full bg-indigo-700 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-800">
              Get started
            </button>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
              <div className="p-4 space-y-4">
                {/* Mobile Blog */}
                <div className="py-2 border-b border-gray-100">
                  <div 
                    className="cursor-pointer hover:bg-gray-50 rounded-md px-4 py-1.5"
                    onClick={handleBlogClick}
                  >
                    <span className="text-lg font-medium text-gray-900">Blog</span>
                  </div>
                </div>

                {/* Mobile Login */}
                <div className="py-2 border-b border-gray-100">
                  <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-4 py-1.5">
                    <span className="text-lg font-medium text-gray-900">Login</span>
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Mobile Get Started Button */}
                <div className="py-3 px-4">
                  <button 
                    onClick={handleGetStartedClick}
                    className="w-full text-white font-semibold py-3 px-6 rounded-3xl transition-colors"
                    style={{ backgroundColor: '#3e2e73' }}
                  >
                    Get started
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </header>
  );
}

function ChevronUpIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={`h-5 w-5 text-gray-600 ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.192l3.71-2.96a.75.75 0 0 1 .94 1.17l-4.24 3.38a.75.75 0 0 1-.94 0l-4.24-3.38a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


