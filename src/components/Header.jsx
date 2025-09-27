"use client";
import { useState, useEffect } from "react";
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
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [clickedSubmenu, setClickedSubmenu] = useState(null);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clickedSubmenu && !event.target.closest('.counselling-dropdown')) {
        setClickedSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickedSubmenu]);

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
    <header className="w-full bg-white fixed top-0 left-0 right-0 z-50">
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
                      setIsResourcesOpen(false);
                    }}
                  >
                  <span>Counselling</span>
                    <ChevronUpIcon className={`transition-transform ${isFindCareOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                  {/* Counselling Dropdown */}
                  {isFindCareOpen && (
                    <div className="counselling-dropdown absolute top-full left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50 mt-2">
                      {/* Counselling Services */}
                      <div className="px-6 pb-4 border-b border-gray-200">
                        <div className="space-y-3">
                          {/* Emotional & Mental Health */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu('emotional')}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => setClickedSubmenu(clickedSubmenu === 'emotional' ? null : 'emotional')}
                            >
                              <h3 className="text-sm font-semibold text-gray-900">🔹 Emotional & Mental Health</h3>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {/* Hover/Click dropdown */}
                            {(activeSubmenu === 'emotional' || clickedSubmenu === 'emotional') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {[
                                { name: "Anxiety Counselling", url: "/counselling/anxiety-sadness" },
                                { name: "Depression Counselling", url: "/counselling/depression" },
                                { name: "Big Emotions (CBT – Kids)", url: "/counselling/big-emotions" },
                                { name: "Overthinking & OCD", url: "/counselling/overthinking-ocd" },
                                { name: "Fear & Phobias Support", url: "/counselling/fear-phobias-support" }
                              ].map((service, index) => (
                                <div 
                                  key={index}
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Child Development & Learning */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu('development')}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => setClickedSubmenu(clickedSubmenu === 'development' ? null : 'development')}
                            >
                              <h3 className="text-sm font-semibold text-gray-900">🔹 Child Development & Learning</h3>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {/* Hover/Click dropdown */}
                            {(activeSubmenu === 'development' || clickedSubmenu === 'development') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {[
                                { name: "ADHD or Attention Struggles", url: "/counselling/adhd-attention" },
                                { name: "Learning Difficulties (Remedial)", url: "/counselling/learning-difficulties" },
                                { name: "Autism Support", url: "/counselling/autism-support" },
                                { name: "Communication & Social Skills", url: "/counselling/communication-social-skills" }
                              ].map((service, index) => (
                                <div 
                                  key={index}
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Behaviour & Confidence Building */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu('behaviour')}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => setClickedSubmenu(clickedSubmenu === 'behaviour' ? null : 'behaviour')}
                            >
                              <h3 className="text-sm font-semibold text-gray-900">🔹 Behaviour & Confidence Building</h3>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {/* Hover/Click dropdown */}
                            {(activeSubmenu === 'behaviour' || clickedSubmenu === 'behaviour') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {[
                                { name: "Behavioral Coaching", url: "/counselling/behavioral-coaching" },
                                { name: "Confidence & Self-Esteem", url: "/counselling/confidence-self-esteem" }
                              ].map((service, index) => (
                                <div 
                                  key={index}
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Stress & Academic Support */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu('stress')}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => setClickedSubmenu(clickedSubmenu === 'stress' ? null : 'stress')}
                            >
                              <h3 className="text-sm font-semibold text-gray-900">🔹 Stress & Academic Support</h3>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {/* Hover/Click dropdown */}
                            {(activeSubmenu === 'stress' || clickedSubmenu === 'stress') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {[
                                { name: "Exam Fear & Study Stress", url: "/counselling/exam-fear-study-stress" }
                              ].map((service, index) => (
                                <div 
                                  key={index}
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Trauma & Healing */}
                          <div 
                            className="relative"
                            onMouseEnter={() => setActiveSubmenu('trauma')}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div 
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => setClickedSubmenu(clickedSubmenu === 'trauma' ? null : 'trauma')}
                            >
                              <h3 className="text-sm font-semibold text-gray-900">🔹 Trauma & Healing</h3>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {/* Hover/Click dropdown */}
                            {(activeSubmenu === 'trauma' || clickedSubmenu === 'trauma') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                              {[
                                { name: "Trauma & Abuse", url: "/counselling/trauma-abuses" },
                                { name: "Grief & Loss", url: "/counselling/grief-loss" },
                                { name: "Family Conflict Recovery", url: "/counselling/family-conflict-recovery" }
                              ].map((service, index) => (
                                <div 
                                  key={index}
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Other Services */}
                      <div className="px-4 pt-3">
                        <div className="space-y-2">
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
                      setIsResourcesOpen(false);
                    }}
                  >
                  <span>Assessments</span>
                    <ChevronUpIcon className={`transition-transform ${isForProvidersOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-0 bg-indigo-700 transition-all duration-150 group-hover:w-20"></span>
                  
                  {/* Assessments Dropdown */}
                  {isForProvidersOpen && (
                    <div className="fixed top-20 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50 mx-4">
                      <div className="px-6 pb-4 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3">
                          {/* ADHD Section */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ADHD</h4>
                            <div className="space-y-1">
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/adhd-vanderbilt');
                                }}
                              >
                                <span className="text-gray-700 text-sm">ADHD Vanderbilt</span>
                              </div>
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/adhd-conners-3');
                                }}
                              >
                                <span className="text-gray-700 text-sm">ADHD Conners 3</span>
                              </div>
                            </div>
                          </div>

                          {/* Emotional & Behavioral Screening Section */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">EMOTIONAL & BEHAVIORAL SCREENING</h4>
                            <div className="space-y-1">
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/basc-3');
                                }}
                              >
                                <span className="text-gray-700 text-sm">Behaviour Assessment System (BASC-3)</span>
                              </div>
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/child-depression-inventory');
                                }}
                              >
                                <span className="text-gray-700 text-sm">Child Depression Inventory</span>
                              </div>
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/spence-anxiety-scale');
                                }}
                              >
                                <span className="text-gray-700 text-sm">Spence Anxiety Scale</span>
                              </div>
                            </div>
                          </div>

                          {/* Intelligence Test Section */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">INTELLIGENCE TEST</h4>
                            <div className="space-y-1">
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/vsms');
                                }}
                              >
                                <span className="text-gray-700 text-sm">VSMS</span>
                              </div>
                            </div>
                          </div>

                          {/* Projective Tests Section */}
                          <div className="space-y-1">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">PROJECTIVE TESTS</h4>
                            <div className="space-y-1">
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/cat');
                                }}
                              >
                                <span className="text-gray-700 text-sm">CAT (Child Apperception Test)</span>
                              </div>
                              <div 
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push('/assessments/child-sentence-completion');
                                }}
                              >
                                <span className="text-gray-700 text-sm">Child Sentence Completion Test</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Actions */}
                      <div className="px-4 pt-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
                        <div className="grid grid-cols-3 gap-8">
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm font-medium">Get a Free Consultation</span>
                          </div>
                          <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <span className="text-gray-700 text-sm font-medium">View Therapists</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                            onClick={() => {
                              handleFAQClick();
                            }}
                          >
                            <span className="text-gray-700 text-sm font-medium">FAQ</span>
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
                      setIsResourcesOpen(false);
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
                      setIsMobileResourcesOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">Counselling</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileFindCareOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Counselling Dropdown Content */}
                  {isMobileFindCareOpen && (
                    <div className="ml-4 space-y-4 py-2">
                      <div className="px-4 py-2 space-y-4">
                        {/* Emotional & Mental Health */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔹 Emotional & Mental Health</h3>
                          <div className="space-y-1 ml-2">
                            {[
                              { name: "Anxiety Counselling", url: "/counselling/anxiety-sadness" },
                              { name: "Depression Counselling", url: "/counselling/depression" },
                              { name: "Big Emotions (CBT – Kids)", url: "/counselling/big-emotions" },
                              { name: "Overthinking & OCD", url: "/counselling/overthinking-ocd" },
                              { name: "Fear & Phobias Support", url: "/counselling/fear-phobias-support" }
                            ].map((service, index) => (
                              <div 
                                key={index}
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push(service.url);
                                }}
                              >
                                <span className="text-gray-700 text-sm">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Child Development & Learning */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔹 Child Development & Learning</h3>
                          <div className="space-y-1 ml-2">
                            {[
                              { name: "ADHD or Attention Struggles", url: "/counselling/adhd-attention" },
                              { name: "Learning Difficulties (Remedial)", url: "/counselling/learning-difficulties" },
                              { name: "Autism Support", url: "/counselling/autism-support" },
                              { name: "Communication & Social Skills", url: "/counselling/communication-social-skills" }
                            ].map((service, index) => (
                              <div 
                                key={index}
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push(service.url);
                                }}
                              >
                                <span className="text-gray-700 text-sm">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Behaviour & Confidence Building */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔹 Behaviour & Confidence Building</h3>
                          <div className="space-y-1 ml-2">
                            {[
                              { name: "Behavioral Coaching", url: "/counselling/behavioral-coaching" },
                              { name: "Confidence & Self-Esteem", url: "/counselling/confidence-self-esteem" }
                            ].map((service, index) => (
                              <div 
                                key={index}
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push(service.url);
                                }}
                              >
                                <span className="text-gray-700 text-sm">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stress & Academic Support */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔹 Stress & Academic Support</h3>
                          <div className="space-y-1 ml-2">
                            {[
                              { name: "Exam Fear & Study Stress", url: "/counselling/exam-fear-study-stress" }
                            ].map((service, index) => (
                              <div 
                                key={index}
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push(service.url);
                                }}
                              >
                                <span className="text-gray-700 text-sm">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Trauma & Healing */}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔹 Trauma & Healing</h3>
                          <div className="space-y-1 ml-2">
                            {[
                              { name: "Trauma & Abuse", url: "/counselling/trauma-abuses" },
                              { name: "Grief & Loss", url: "/counselling/grief-loss" },
                              { name: "Family Conflict Recovery", url: "/counselling/family-conflict-recovery" }
                            ].map((service, index) => (
                              <div 
                                key={index}
                                className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                                onClick={() => {
                                  router.push(service.url);
                                }}
                              >
                                <span className="text-gray-700 text-sm">{service.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
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
                      setIsMobileResourcesOpen(false);
                    }}
                  >
                    <span className="text-lg font-medium text-gray-900">Assessments</span>
                    <svg className={`w-5 h-5 text-gray-600 transition-transform ${isMobileForProvidersOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Assessments Dropdown Content */}
                  {isMobileForProvidersOpen && (
                    <div className="ml-4 space-y-4 py-2">
                      <div className="px-4">
                        {/* ADHD Section */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">ADHD</h3>
                          <div className="space-y-1 ml-2">
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/adhd-vanderbilt');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">ADHD Vanderbilt</span>
                            </div>
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/adhd-conners-3');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">ADHD Conners 3</span>
                            </div>
                          </div>
                        </div>

                        {/* Emotional & Behavioral Screening Section */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">EMOTIONAL & BEHAVIORAL SCREENING</h3>
                          <div className="space-y-1 ml-2">
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/basc-3');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">Behaviour Assessment System (BASC-3)</span>
                            </div>
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/child-depression-inventory');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">Child Depression Inventory</span>
                            </div>
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/spence-anxiety-scale');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">Spence Anxiety Scale</span>
                            </div>
                          </div>
                        </div>

                        {/* Intelligence Test Section */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">INTELLIGENCE TEST</h3>
                          <div className="space-y-1 ml-2">
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/vsms');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">VSMS</span>
                            </div>
                          </div>
                        </div>

                        {/* Projective Tests Section */}
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">PROJECTIVE TESTS</h3>
                          <div className="space-y-1 ml-2">
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/cat');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">CAT (Child Apperception Test)</span>
                            </div>
                            <div 
                              className="py-1 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                router.push('/assessments/child-sentence-completion');
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm">Child Sentence Completion Test</span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-3">
                          <div className="space-y-2">
                            <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                              <span className="text-gray-700 text-sm font-medium">Get a Free Consultation</span>
                            </div>
                            <div className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                              <span className="text-gray-700 text-sm font-medium">View Therapists</span>
                            </div>
                            <div 
                              className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2"
                              onClick={() => {
                                handleFAQClick();
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="text-gray-700 text-sm font-medium">FAQ</span>
                            </div>
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
                      setIsMobileResourcesOpen(false);
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


