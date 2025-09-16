"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [isFindCareOpen, setIsFindCareOpen] = useState(false);
  const [isForProvidersOpen, setIsForProvidersOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFindCareOpen, setIsMobileFindCareOpen] = useState(false);
  const [isMobileForProvidersOpen, setIsMobileForProvidersOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleBlogClick = () => {
    router.push('/blog');
  };

  const handleHomeClick = () => {
    router.push('/');
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
    }
  };

  const handleFAQClick = () => {
    router.push('/faq');
    setIsFindCareOpen(false);
  };

  const handleGetStartedClick = () => {
    router.push('/');
    setIsFindCareOpen(false);
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  const handleCompanyClick = () => {
    router.push('/about');
    setIsAboutOpen(false);
  };

  const handleCareerClick = () => {
    router.push('/career');
    setIsAboutOpen(false);
  };

  const handleLoginClick = () => {
    router.push('/login');
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
      <div className="w-full pl-[50px] pr-[50px]">
        <div className="flex h-20 items-center justify-between">
          {/* Left group: Brand + Nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center">
              <button 
                onClick={handleHomeClick}
                className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
              >
                Little Care
              </button>
            </div>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 text-base font-medium text-gray-800">
                <li className="relative group">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setIsFindCareOpen(!isFindCareOpen);
                      setIsForProvidersOpen(false);
                      setIsAboutOpen(false);
                    }}
                  >
                  <span>Counselling</span>
                    <ChevronUpIcon className={`transition-transform ${isFindCareOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                  {/* Counselling Dropdown */}
                  {isFindCareOpen && (
                    <div className="fixed top-20 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50 mx-4">
                      {/* Counselling Services */}
                      <div className="px-6 pb-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Counselling Services</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
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
                            <div 
                              key={index}
                              className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push(service.url);
                              }}
                            >
                              <span className="text-gray-700 text-sm">{service.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Other Services */}
                      <div className="px-4 pt-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Other Services</h3>
                        <div className="grid grid-cols-3 gap-8">
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/assessments');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Assessments</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/better-parenting');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Better Parenting</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/resources');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Resources</span>
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
                      setIsAboutOpen(false);
                    }}
                  >
                  <span>Assessments</span>
                    <ChevronUpIcon className={`transition-transform ${isForProvidersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                  {/* Assessments Dropdown */}
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
                            <span className="text-gray-700 text-sm">Therapy</span>
                           </div>
                           <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                               </svg>
                             </div>
                            <span className="text-gray-700 text-sm">Psychiatry</span>
                           </div>
                           <div 
                             className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                             onClick={() => {
                              handleFAQClick();
                             }}
                           >
                             <div className="w-5 h-5 flex items-center justify-center">
                               <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                            <span className="text-gray-700 text-sm">FAQs</span>
                           </div>
                         </div>
                       </div>
                       
                       {/* Bottom section - Other services */}
                       <div className="px-4 pt-3">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Other services</h3>
                         <div className="space-y-2">
                           <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm">In-person therapy</span>
                           </div>
                           <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm">Medicare & Medicaid</span>
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
                    <span>About Us</span>
                    <ChevronUpIcon className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                                     {/* About Us Dropdown */}
                   {isAboutOpen && (
                     <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                       <div className="px-4 space-y-2">
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                           onClick={handleCompanyClick}
                         >
                          <span className="text-gray-700 text-sm">Company</span>
                         </div>
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                           onClick={handleCareerClick}
                         >
                          <span className="text-gray-700 text-sm">Career</span>
                         </div>
                       </div>
                     </div>
                   )}
                </li>
                <li className="relative group">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => {
                      setIsResourcesOpen(!isResourcesOpen);
                      setIsFindCareOpen(false);
                      setIsForProvidersOpen(false);
                      setIsAboutOpen(false);
                    }}
                  >
                    <span>Resources</span>
                    <ChevronUpIcon className={`transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                  {/* Resources Dropdown */}
                  {isResourcesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                      <div className="px-4 space-y-2">
                        <div 
                          className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                          onClick={() => {
                            router.push('/blog');
                            setIsResourcesOpen(false);
                          }}
                        >
                          <span className="text-gray-700 text-sm">Blog</span>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
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
                  className="inline-flex items-center gap-1 text-base font-medium text-gray-800 hover:text-gray-900 cursor-pointer"
              >
                <span>Login</span>
              </button>
            )}
            <button className="inline-flex items-center rounded-full bg-indigo-700 px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-indigo-800">
              Get started
            </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
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

        {/* Mobile Menu Sidebar */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-semibold text-sm">L</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">Little Care</span>
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

            {/* Mobile Menu Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* User Profile Section - Moved to Top */}
              {isAuthenticated() && (
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <div className="flex flex-col items-center text-center py-2">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-indigo-700 font-semibold text-lg">
                        {getUserInitial()}
                      </span>
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-900">{getUserDisplayName()}</div>
                      <div className="text-sm text-gray-500 mt-1">{user?.email}</div>
                      <div className="text-sm text-indigo-600 font-medium mt-1">
                        {getRoleDisplayName(user?.role)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Dashboard Button */}
                  <button
                    onClick={() => {
                      handleProfileClick();
                    }}
                    className="w-full py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 mt-4 text-center"
                  >
                    Dashboard
                  </button>
                </div>
              )}

              {/* Login/Get Started Section for Non-Authenticated Users */}
              {!isAuthenticated() && (
                <div className="border-b border-gray-200 pb-6 mb-6 space-y-3">
                  {/* Login Button */}
                  <button
                    onClick={() => {
                      handleLoginClick();
                    }}
                    className="w-full text-left py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    Login
                  </button>
                  
                  {/* Get Started Button */}
                  <button 
                    onClick={() => {
                      router.push('/');
                    }}
                    className="w-full py-3 px-4 text-base font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800"
                  >
                    Get started
                  </button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-0">
                {/* Counselling Dropdown */}
                <div className="border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-3"
                    onClick={() => {
                      setIsMobileFindCareOpen(!isMobileFindCareOpen);
                      setIsMobileForProvidersOpen(false);
                      setIsMobileAboutOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">Counselling</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileFindCareOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Counselling Dropdown Content */}
                  {isMobileFindCareOpen && (
                    <div className="ml-4 space-y-2 py-2">
                      <div className="px-4 py-2 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Counselling Services</h4>
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
                          <div 
                            key={index}
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push(service.url);
                            }}
                          >
                            <span className="text-gray-700 text-sm">{service.name}</span>
                          </div>
                        ))}
                        
                        <div className="border-t border-gray-200 mt-4 pt-4">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Other Services</h4>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/assessments');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Assessments</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/better-parenting');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Better Parenting</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/resources');
                            }}
                          >
                            <span className="text-gray-700 text-sm">Resources</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Assessments Dropdown */}
                <div className="border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-3"
                    onClick={() => {
                      setIsMobileForProvidersOpen(!isMobileForProvidersOpen);
                      setIsMobileFindCareOpen(false);
                      setIsMobileAboutOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">Assessments</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileForProvidersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Assessments Dropdown Content */}
                  {isMobileForProvidersOpen && (
                    <div className="ml-4 space-y-2 py-2">
                      <div className="px-4 py-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm">Therapy</span>
                          </div>
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm">Psychiatry</span>
                          </div>
                          <div 
                            className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              handleFAQClick();
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm">FAQs</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-4 pt-3 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Other services</h3>
                        <div className="space-y-2">
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm">In-person therapy</span>
                          </div>
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm">Medicare & Medicaid</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Us Dropdown */}
                <div className="border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-3"
                    onClick={() => {
                      setIsMobileAboutOpen(!isMobileAboutOpen);
                      setIsMobileFindCareOpen(false);
                      setIsMobileForProvidersOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">About Us</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* About Us Dropdown Content */}
                  {isMobileAboutOpen && (
                    <div className="ml-4 space-y-2 py-2">
                      <div className="px-4 py-2">
                        <div className="space-y-2">
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              handleCompanyClick();
                            }}
                          >
                            <span className="text-gray-700 text-sm">Company</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              handleCareerClick();
                            }}
                          >
                            <span className="text-gray-700 text-sm">Career</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resources Dropdown */}
                <div className="border-b border-gray-100">
                  <div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md px-2 py-3"
                    onClick={() => {
                      setIsMobileResourcesOpen(!isMobileResourcesOpen);
                      setIsMobileFindCareOpen(false);
                      setIsMobileForProvidersOpen(false);
                      setIsMobileAboutOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">Resources</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileResourcesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Resources Dropdown Content */}
                  {isMobileResourcesOpen && (
                    <div className="ml-4 space-y-2 py-2">
                      <div className="px-4 py-2">
                        <div className="space-y-2">
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              router.push('/blog');
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <span className="text-gray-700 text-sm">Blog</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Logout Button at Bottom for Authenticated Users */}
              {isAuthenticated() && (
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <button
                    onClick={() => {
                      handleLogout();
                    }}
                    className="w-full py-3 px-4 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-5 w-5 text-gray-600"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.192l3.71-2.96a.75.75 0 0 1 .94 1.17l-4.24 3.38a.75.75 0 0 1-.94 0l-4.24-3.38a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
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


