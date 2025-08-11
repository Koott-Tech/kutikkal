"use client";
import { useState } from "react";

export default function Header() {
  const [isFindCareOpen, setIsFindCareOpen] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="w-full pl-[50px] pr-[50px]">
        <div className="flex h-20 items-center justify-between">
          {/* Left group: Brand + Nav */}
          <div className="flex items-center gap-10">
            <div className="flex items-center">
              <span className="text-2xl font-semibold tracking-tight text-gray-900">
                kuttikal
              </span>
            </div>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-8 text-base font-medium text-gray-800">
                <li className="relative">
                  <button 
                    className="flex items-center gap-1 cursor-pointer hover:text-gray-900"
                    onClick={() => setIsFindCareOpen(!isFindCareOpen)}
                  >
                    <span>Find Care</span>
                    <ChevronUpIcon className={`transition-transform ${isFindCareOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Find Care Dropdown */}
                  {isFindCareOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-4 z-50">
                      {/* Top section - Types of care */}
                      <div className="px-4 pb-3 border-b border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Types of care</h3>
                        <div className="space-y-2">
                          {[
                            "Individual therapy",
                            "Couples therapy", 
                            "Family therapy",
                            "Child therapy",
                            "Teen therapy",
                            "Psychiatry"
                          ].map((option) => (
                            <div key={option} className="py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                              <span className="text-gray-700">{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bottom section - Get Started and FAQs */}
                      <div className="px-4 pt-3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">Get Started</span>
                          </div>
                          <div className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md px-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">FAQs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
                <li className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  <span>For Providers</span>
                  <ChevronDownIcon />
                </li>
                <li className="cursor-pointer hover:text-gray-900">
                  <span>About Us</span>
                </li>
                <li className="cursor-pointer hover:text-gray-900">Blog</li>
              </ul>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <button className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-900">
              <span>Login</span>
            </button>
            <button className="inline-flex items-center rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800">
              Get started
            </button>
          </div>
        </div>
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
      className="h-4 w-4 text-gray-600"
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
      className={`h-4 w-4 text-gray-600 ${className}`}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.192l3.71-2.96a.75.75 0 0 1 .94 1.17l-4.24 3.38a.75.75 0 0 1-.94 0l-4.24-3.38a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


