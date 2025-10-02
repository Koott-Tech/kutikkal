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
      // Close submenus
      if (clickedSubmenu && !event.target.closest('.counselling-dropdown') && !event.target.closest('.assessments-dropdown')) {
        setClickedSubmenu(null);
      }
      
      // Close main dropdowns
      if (!event.target.closest('.header-dropdown') && !event.target.closest('.counselling-dropdown') && !event.target.closest('.assessments-dropdown')) {
        setIsFindCareOpen(false);
        setIsForProvidersOpen(false);
        setIsAboutOpen(false);
        setIsResourcesOpen(false);
      }
    };

    const handleTouchOutside = (event) => {
      // Close submenus
      if (clickedSubmenu && !event.target.closest('.counselling-dropdown') && !event.target.closest('.assessments-dropdown')) {
        setClickedSubmenu(null);
      }
      
      // Close main dropdowns
      if (!event.target.closest('.header-dropdown') && !event.target.closest('.counselling-dropdown') && !event.target.closest('.assessments-dropdown')) {
        setIsFindCareOpen(false);
        setIsForProvidersOpen(false);
        setIsAboutOpen(false);
        setIsResourcesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [clickedSubmenu, isFindCareOpen, isForProvidersOpen, isAboutOpen, isResourcesOpen]);

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
        <div className="flex h-16 items-center justify-between">
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
                    <div className="counselling-dropdown header-dropdown absolute top-full left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50 mt-2">
                      {/* Counselling Services */}
                      <div className="px-6 pb-4 border-b border-gray-200">
                        <div className="space-y-3">
                          {/* Emotional & Mental Health */}
                          <div 
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('emotional');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                              <div 
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                                onClick={() => {
                                  setClickedSubmenu(clickedSubmenu === 'emotional' ? null : 'emotional');
                                  setActiveSubmenu(null);
                                }}
                              >
                                <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Emotional & Mental Health</h7>
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
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4 transition-all duration-200"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Child Development & Learning */}
                          <div 
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('development');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                              <div 
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                                onClick={() => {
                                  setClickedSubmenu(clickedSubmenu === 'development' ? null : 'development');
                                  setActiveSubmenu(null);
                                }}
                              >
                                <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Child Development & Learning</h7>
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
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4 transition-all duration-200"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Behaviour & Confidence Building */}
                          <div 
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('behaviour');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                              <div 
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                                onClick={() => {
                                  setClickedSubmenu(clickedSubmenu === 'behaviour' ? null : 'behaviour');
                                  setActiveSubmenu(null);
                                }}
                              >
                                <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Behaviour & Confidence Building</h7>
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
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4 transition-all duration-200"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Stress & Academic Support */}
                          <div 
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('stress');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                              <div 
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                                onClick={() => {
                                  setClickedSubmenu(clickedSubmenu === 'stress' ? null : 'stress');
                                  setActiveSubmenu(null);
                                }}
                              >
                                <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Stress & Academic Support</h7>
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
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4 transition-all duration-200"
                                  onClick={() => {
                                    router.push(service.url);
                                    setClickedSubmenu(null);
                                  }}
                                >
                                  <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">{service.name}</span>
                                </div>
                              ))}
                              </div>
                            )}
                          </div>

                          {/* Trauma & Healing */}
                          <div 
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('trauma');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                              <div 
                                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                                onClick={() => {
                                  setClickedSubmenu(clickedSubmenu === 'trauma' ? null : 'trauma');
                                  setActiveSubmenu(null);
                                }}
                              >
                                <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Trauma & Healing</h7>
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
                                  className="py-2 cursor-pointer hover:bg-gray-50 px-4 transition-all duration-200"
                              onClick={() => {
                                router.push(service.url);
                                    setClickedSubmenu(null);
                              }}
                            >
                                  <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">{service.name}</span>
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
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              router.push('/assessments');
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Assessments</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              router.push('/better-parenting');
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Better Parenting</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              router.push('/resources');
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Resources</span>
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
                    <div className="assessments-dropdown header-dropdown absolute top-full left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50 mt-2">
                      <div className="px-6 pb-4 border-b border-gray-200">
                        <div className="space-y-3">
                          {/* ADHD Assessments */}
                          <div
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('adhd');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                              onClick={() => {
                                setClickedSubmenu(clickedSubmenu === 'adhd' ? null : 'adhd');
                                setActiveSubmenu(null);
                              }}
                            >
                              <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">ADHD Assessments</h7>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                             </div>
                            {(activeSubmenu === 'adhd' || clickedSubmenu === 'adhd') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                                {[
                                  { name: "ADHD Vanderbilt", url: "/assessments/adhd-vanderbilt" },
                                  { name: "ADHD Conners 3", url: "/assessments/adhd-conners-3" }
                                ].map((assessment, index) => (
                                  <div
                                    key={index}
                                    className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                    onClick={() => {
                                      router.push(assessment.url);
                                      setClickedSubmenu(null);
                                    }}
                                  >
                                    <span className="text-gray-700 text-sm">{assessment.name}</span>
                           </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Emotional & Behavioral Screening */}
                          <div
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('emotional');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                              onClick={() => {
                                setClickedSubmenu(clickedSubmenu === 'emotional' ? null : 'emotional');
                                setActiveSubmenu(null);
                              }}
                            >
                              <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Emotional & Behavioral Screening</h7>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                             </div>
                            {(activeSubmenu === 'emotional' || clickedSubmenu === 'emotional') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                                {[
                                  { name: "BASC-3", url: "/assessments/basc-3" },
                                  { name: "Child Depression Inventory", url: "/assessments/child-depression-inventory" },
                                  { name: "Spence Anxiety Scale", url: "/assessments/spence-anxiety-scale" }
                                ].map((assessment, index) => (
                                  <div
                                    key={index}
                                    className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                    onClick={() => {
                                      router.push(assessment.url);
                                      setClickedSubmenu(null);
                                    }}
                                  >
                                    <span className="text-gray-700 text-sm">{assessment.name}</span>
                           </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Intelligence Tests */}
                          <div
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('intelligence');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                             onClick={() => {
                                setClickedSubmenu(clickedSubmenu === 'intelligence' ? null : 'intelligence');
                                setActiveSubmenu(null);
                              }}
                            >
                              <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Intelligence Tests</h7>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                               </svg>
                             </div>
                            {(activeSubmenu === 'intelligence' || clickedSubmenu === 'intelligence') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                                {[
                                  { name: "VSMS", url: "/assessments/vsms" }
                                ].map((assessment, index) => (
                                  <div
                                    key={index}
                                    className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                    onClick={() => {
                                      router.push(assessment.url);
                                      setClickedSubmenu(null);
                                    }}
                                  >
                                    <span className="text-gray-700 text-sm">{assessment.name}</span>
                           </div>
                                ))}
                         </div>
                            )}
                       </div>
                       
                          {/* Projective Tests */}
                          <div
                            className="relative"
                            onMouseEnter={() => {
                              setActiveSubmenu('projective');
                              setClickedSubmenu(null);
                            }}
                            onMouseLeave={() => setActiveSubmenu(null)}
                          >
                            <div
                              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                              onClick={() => {
                                setClickedSubmenu(clickedSubmenu === 'projective' ? null : 'projective');
                                setActiveSubmenu(null);
                              }}
                            >
                              <h7 className="text-gray-900 hover:translate-x-1 transition-all duration-200">Projective Tests</h7>
                              <svg className="w-4 h-4 text-gray-500 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            {(activeSubmenu === 'projective' || clickedSubmenu === 'projective') && (
                              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                                {[
                                  { name: "CAT (Child Apperception Test)", url: "/assessments/cat" },
                                  { name: "Child Sentence Completion Test", url: "/assessments/child-sentence-completion" }
                                ].map((assessment, index) => (
                                  <div
                                    key={index}
                                    className="py-2 cursor-pointer hover:bg-gray-50 px-4"
                                    onClick={() => {
                                      router.push(assessment.url);
                                      setClickedSubmenu(null);
                                    }}
                                  >
                                    <span className="text-gray-700 text-sm">{assessment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                       <div className="px-4 pt-3">
                         <div className="space-y-2">
                          <div
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              router.push('/free-assessment');
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Get a Free Consultation</span>
                           </div>
                          <div
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              router.push('/assessments');
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">View All Assessments</span>
                          </div>
                          <div
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200 flex items-center gap-3"
                            onClick={() => {
                              handleFAQClick();
                            }}
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">FAQ</span>
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
                     <div className="header-dropdown absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                       <div className="px-4 space-y-2">
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 flex items-center gap-3"
                           onClick={handleCompanyClick}
                         >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="text-gray-700 text-sm">Company</span>
                         </div>
                         <div 
                           className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 flex items-center gap-3"
                           onClick={handleCareerClick}
                         >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                          </svg>
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
                    <div className="header-dropdown absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                      <div className="px-4 space-y-2">
                        <div 
                          className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 flex items-center gap-3"
                          onClick={() => {
                            router.push('/blog');
                            setIsResourcesOpen(false);
                          }}
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
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
                className="inline-flex items-center gap-1 text-base font-medium text-gray-800 hover:text-gray-900 cursor-pointer group relative mr-2"
              >
                <span className="relative">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full"></span>
                </span>
              </button>
            )}
            <button className="inline-flex items-center rounded-full px-4 py-2 text-base font-semibold text-white shadow-sm hover:opacity-90" style={{ backgroundColor: '#3e2e73' }}>
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
                          <h7 className="text-gray-500 uppercase tracking-wider mb-2">🔹 Emotional & Mental Health</h7>
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
                          <h7 className="text-gray-500 uppercase tracking-wider mb-2">🔹 Child Development & Learning</h7>
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
                          <h7 className="text-gray-500 uppercase tracking-wider mb-2">🔹 Behaviour & Confidence Building</h7>
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
                          <h7 className="text-gray-500 uppercase tracking-wider mb-2">🔹 Stress & Academic Support</h7>
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
                          <h7 className="text-gray-500 uppercase tracking-wider mb-2">🔹 Trauma & Healing</h7>
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
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                            onClick={() => {
                              router.push('/assessments');
                            }}
                          >
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Assessments</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                            onClick={() => {
                              router.push('/better-parenting');
                            }}
                          >
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Better Parenting</span>
                          </div>
                          <div 
                            className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2 transition-all duration-200"
                            onClick={() => {
                              router.push('/resources');
                            }}
                          >
                            <span className="text-gray-700 text-sm hover:translate-x-1 transition-all duration-200">Resources</span>
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
                        {/* ADHD Assessments */}
                        <div className="mb-4">
                          <h7 className="text-gray-900 mb-2">ADHD Assessments</h7>
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

                        {/* Emotional & Behavioral Screening */}
                        <div className="mb-4">
                          <h7 className="text-gray-900 mb-2">Emotional & Behavioral Screening</h7>
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
                      
                        {/* Intelligence Tests */}
                        <div className="mb-4">
                          <h7 className="text-gray-900 mb-2">Intelligence Tests</h7>
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

                        {/* Projective Tests */}
                        <div className="mb-4">
                          <h7 className="text-gray-900 mb-2">Projective Tests</h7>
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


