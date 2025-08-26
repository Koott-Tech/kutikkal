'use client';

import React, { useState, useEffect } from "react";
import OnboardingModal from './OnboardingModal';
import { useRouter } from 'next/navigation';
import { publicApi } from '../../lib/backendApi';

const Guide = () => {
  const [selected, setSelected] = useState(null);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch doctors from database
  const fetchDoctors = async () => {
    try {
      console.log('Fetching doctors...');
      setLoading(true);
      setError(null);
      const response = await publicApi.getPsychologists();
      console.log('API Response:', response);
      const psychologists = response?.data?.psychologists || [];
      console.log('Psychologists data:', psychologists);
      

      
      setDoctors(psychologists);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors. Please try again later.');
      // Fallback to empty array
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (selected !== null || showDateTimePicker || showPaymentModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
    }
  }, [selected, showDateTimePicker, showPaymentModal]);

  const handleBookSession = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDateTimePicker(true);
    setSelected(null); // Close doctor modal
  };

  const handleDateTimeConfirm = () => {
    if (selectedDate && selectedTime) {
      setShowDateTimePicker(false);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor(null);
    // Redirect to chat session or show success message
    router.push('/chat-therapy');
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setShowDateTimePicker(true);
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", background: "#f8fafc", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @media (max-width: 768px) {
          .company-name-guide {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Company name at left, aligned with navbar */}
      <div
        className="company-name-guide"
        style={{
          position: "absolute",
          top: "2.5rem",
          left: "5vw",
          zIndex: 2,
          fontWeight: 900,
          fontSize: "2.2rem",
          color: "#27ae60",
          letterSpacing: "0.05em",
          userSelect: "none",
          textShadow: "0 2px 12px rgba(39,174,96,0.08)",
          cursor: "pointer"
        }}
        onClick={() => router.push('/')}
        title="Go to homepage"
      >
        Kuttikal
      </div>
      
      <div style={{ position: "relative", zIndex: 3 }}></div>
      
      <section style={{ width: "100vw", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "8rem", paddingBottom: "4rem" }}>
        <h1 style={{ fontSize: "3.2rem", fontWeight: 800, color: "#1a1a1a", textAlign: "center", letterSpacing: "-0.01em", lineHeight: 1.1, maxWidth: 900, marginBottom: "2.2rem" }}>
          Guides that help you grow
        </h1>
        <p style={{ fontSize: "1.18rem", color: "#444", textAlign: "center", maxWidth: 600, fontWeight: 500, margin: 0, marginBottom: "2.2rem" }}>
          Skilled and supportive mental health professionals dedicated to you and your wellness journey.
        </p>
        
        {/* Debug/Refresh Button */}
        <button
          onClick={fetchDoctors}
          style={{
            padding: "0.5rem 1rem",
            background: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "2rem",
            fontSize: "0.9rem"
          }}
        >
          Refresh Doctors
        </button>
        
        <style>{`
          .find-therapist-btn {
            position: relative;
            overflow: hidden;
            padding: 0.85rem 2.2rem;
            border-radius: 15px;
            border: none;
            background: #27ae60;
            color: #fff;
            font-weight: 700;
            font-size: 1.1rem;
            cursor: pointer;
            box-shadow: 0 6px 24px rgba(0,0,0,0.18), 0 2px 12px rgba(0,0,0,0.12);
            transition: color 0.2s, border 0.2s;
            z-index: 1;
          }
          .find-therapist-btn::before {
            content: "";
            position: absolute;
            left: 0;
            bottom: -100%;
            width: 100%;
            height: 100%;
            background: #fff;
            z-index: 0;
            transition: bottom 0.4s cubic-bezier(.4,2,.6,1), opacity 0.2s;
            opacity: 0.95;
          }
          .find-therapist-btn:hover::before {
            bottom: 0;
          }
          .find-therapist-btn:hover {
            color: #27ae60;
            border: none;
          }
          .find-therapist-btn span {
            position: relative;
            z-index: 1;
          }
        `}</style>
        
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "2.5rem", marginBottom: "2.5rem" }}>
          <button 
            className="find-therapist-btn" 
            style={{ padding: "12px 44px", fontSize: 28, fontWeight: 800, borderRadius: 15, letterSpacing: "-0.01em" }} 
            onClick={() => setShowOnboarding(true)}
          >
            <span>Find My Therapist</span>
          </button>
          
          {!loading && (
            <button 
              style={{ 
                padding: "12px 24px", 
                fontSize: 16, 
                fontWeight: 600, 
                borderRadius: 15, 
                background: "#f8f9fa",
                color: "#27ae60",
                border: "2px solid #27ae60",
                cursor: "pointer",
                transition: "all 0.2s"
              }} 
              onClick={fetchDoctors}
              title="Refresh doctors list"
            >
              🔄 Refresh
            </button>
          )}
        </div>
        
        <OnboardingModal 
          open={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
          onComplete={() => { setShowOnboarding(false); router.push('/guide'); }} 
        />
        
        {/* Guide video cards row - Single row with real doctors only */}
        <div style={{
          width: "100%",
          marginTop: "3.2rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          height: 380,
          gap: 18,
        }}>
          <style>{`
            .guide-video-card {
              cursor: pointer;
              will-change: transform;
              transition: transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.2s;
              z-index: 1;
              width: 300px;
              height: 370px;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10);
              background: #fff;
              border: 2px solid #e0e7ef;
              position: relative;
            }
            .guide-video-card:hover {
              transform: scale(1.13) translateY(-18px);
              z-index: 10;
              box-shadow: 0 16px 48px rgba(39,174,96,0.22), 0 4px 16px rgba(0,0,0,0.12);
            }
          `}</style>
          
          {loading ? (
            <div style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 380,
              color: "#666",
              fontSize: "1.2rem"
            }}>
              Loading doctors...
            </div>
          ) : error ? (
            <div style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 380,
              color: "#e74c3c",
              fontSize: "1.2rem",
              textAlign: "center"
            }}>
              {error}
            </div>
          ) : doctors.length === 0 ? (
            <div style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 380,
              color: "#666",
              fontSize: "1.2rem",
              textAlign: "center"
            }}>
              No doctors available at the moment.
            </div>
          ) : (
            doctors.map((doc, idx) => {
              return (
                <div
                  className="guide-video-card"
                  key={doc.id || doc.name || idx}
                  style={{ zIndex: idx+1, position: "relative" }}

                  onClick={() => setSelected(idx)}
                >
                  {/* Doctor Profile Picture or Cover Image */}
                  {(() => {
                    // First try actual image URLs from database
                    let imageSrc = doc.cover_image_url || doc.profile_picture_url;
                    
                    // If no database image, use fallback based on name
                    if (!imageSrc) {
                      const name = (doc.name || doc.first_name || '').toLowerCase();
                      if (name.includes('irene') || name.includes('marium')) {
                        imageSrc = '/irene.jpeg';
                      } else if (name.includes('doug') || name.includes('douglas')) {
                        imageSrc = '/doug.png';
                      } else if (name.includes('ashley') || name.includes('ash') || name.includes('sarah')) {
                        imageSrc = '/hero.png';
                      } else if (name.includes('child') || name.includes('teen') || name.includes('liana')) {
                        imageSrc = '/kids.png';
                      }
                    }
                    
                    console.log(`Doctor ${doc.name || doc.first_name}: imageSrc = ${imageSrc}`);
                    
                    if (imageSrc) {
                      return (
                        <img
                          src={imageSrc}
                          alt={`${doc.name || doc.first_name} profile`}
                          style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "cover"
                          }}
                          onError={(e) => {
                            console.log(`Image failed to load for ${doc.name || doc.first_name}: ${imageSrc}`);
                            // Fallback to initials if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={() => {
                            console.log(`Image loaded successfully for ${doc.name || doc.first_name}: ${imageSrc}`);
                          }}
                        />
                      );
                    }
                    return null;
                  })()}
                  
                  {/* Fallback: Doctor Initials Avatar */}
                  <div 
                    style={{
                      display: (() => {
                        // Check if we have any image (database or fallback)
                        const name = (doc.name || doc.first_name || '').toLowerCase();
                        if (doc.cover_image_url || doc.profile_picture_url) return 'none';
                        if (name.includes('irene') || name.includes('marium') || 
                            name.includes('doug') || name.includes('douglas') || 
                            name.includes('ashley') || name.includes('ash') || 
                            name.includes('child') || name.includes('teen') ||
                            name.includes('sarah') || name.includes('liana')) return 'none';
                        return 'flex';
                      })(),
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "4rem",
                      fontWeight: "bold",
                      color: "#fff",
                      textShadow: "0 2px 8px rgba(0,0,0,0.3)"
                    }}
                  >
                    {doc.name ? 
                      doc.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() :
                      doc.first_name ? 
                        doc.first_name.charAt(0).toUpperCase() : 
                        'D'
                    }
                  </div>
                  {/* Doctor name and expertise bubbles */}
                  <div style={{
                    position: "absolute",
                    left: 18,
                    bottom: 18,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                    width: "80%"
                  }}>
                    <div style={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                      marginBottom: 4,
                      letterSpacing: "-0.01em"
                    }}>{doc.name || 'Dr. ' + (doc.first_name || 'Unknown')}</div>
                    {doc.experience_years && (
                      <div style={{
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                        marginBottom: 8,
                        opacity: 0.9
                      }}>{doc.experience_years} years experience</div>
                    )}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {doc.area_of_expertise && Array.isArray(doc.area_of_expertise) && doc.area_of_expertise.length > 0 ? (
                        doc.area_of_expertise.slice(0, 3).map((exp, i) => (
                          <span key={i} style={{
                            background: "rgba(255,255,255,0.22)",
                            color: "#fff",
                            borderRadius: 16,
                            padding: "0.32em 1.1em",
                            fontWeight: 600,
                            fontSize: "0.98rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            border: "1.5px solid rgba(255,255,255,0.18)",
                            marginBottom: 2
                          }}>{exp}</span>
                        ))
                      ) : (
                        <span style={{
                          background: "rgba(255,255,255,0.22)",
                          color: "#fff",
                          borderRadius: 16,
                          padding: "0.32em 1.1em",
                          fontWeight: 600,
                          fontSize: "0.98rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          border: "1.5px solid rgba(255,255,255,0.18)",
                          marginBottom: 2
                        }}>Psychology</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Popup for Doctor Details */}
        {selected !== null && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.32)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s"
          }}
            onClick={() => setSelected(null)}
          >
            <div
              style={{
                width: "80vw",
                maxWidth: 1300,
                height: 700,
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 12px 48px rgba(39,174,96,0.18), 0 4px 16px rgba(0,0,0,0.12)",
                display: "flex",
                overflow: "hidden",
                position: "relative"
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close X Button */}
              <button
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  border: "2px solid #e1e5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transition: "all 0.2s",
                  zIndex: 20
                }}
                onClick={() => setSelected(null)}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,1)";
                  e.target.style.borderColor = "#ff6b6b";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.9)";
                  e.target.style.borderColor = "#e1e5e9";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
              
              {/* Left: Doctor Profile Picture or Cover Image */}
              <div style={{ flex: 1.2, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                {(doctors[selected]?.profile_picture_url || doctors[selected]?.cover_image_url ||
                  (doctors[selected]?.name && (doctors[selected].name.toLowerCase().includes('irene') || 
                                             doctors[selected].name.toLowerCase().includes('marium')))) ? (
                  <img
                    src={doctors[selected].profile_picture_url || doctors[selected].cover_image_url ||
                         (() => {
                           const name = doctors[selected]?.name?.toLowerCase() || '';
                           if (name.includes('irene') || name.includes('marium')) return '/irene.jpeg';
                           if (name.includes('doug') || name.includes('douglas')) return '/doug.png';
                           if (name.includes('ashley') || name.includes('ash')) return '/hero.png';
                           if (name.includes('child') || name.includes('teen')) return '/kids.png';
                           return null;
                         })()}
                    alt={`${doctors[selected]?.name || doctors[selected]?.first_name} profile`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: 700 }}
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                
                {/* Fallback: Doctor Initials Avatar */}
                <div 
                  style={{
                    display: (doctors[selected]?.profile_picture_url || doctors[selected]?.cover_image_url ||
                              (doctors[selected]?.name && (doctors[selected].name.toLowerCase().includes('irene') || 
                                                         doctors[selected].name.toLowerCase().includes('marium') ||
                                                         doctors[selected].name.toLowerCase().includes('doug') ||
                                                         doctors[selected].name.toLowerCase().includes('ashley') ||
                                                         doctors[selected].name.toLowerCase().includes('child')))) ? 'none' : 'flex',
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "8rem",
                    fontWeight: "bold",
                    color: "#fff",
                    textShadow: "0 4px 16px rgba(0,0,0,0.5)"
                  }}
                >
                  {doctors[selected]?.name ? 
                    doctors[selected].name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() :
                    doctors[selected]?.first_name ? 
                      doctors[selected].first_name.charAt(0).toUpperCase() : 
                      'D'
                  }
                </div>
              </div>
              
              {/* Right: Details */}
              <div style={{ flex: 1, padding: "40px 48px", display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 16, position: "relative" }}>
                <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>{doctors[selected]?.name || 'Dr. ' + (doctors[selected]?.first_name || 'Unknown')}</h2>
                
                {/* Experience Years */}
                {doctors[selected]?.experience_years && (
                  <div style={{ marginBottom: 44 }}>
                    <span style={{ 
                      background: "rgba(255,193,7,0.15)", 
                      color: "#ff9800", 
                      borderRadius: 8, 
                      padding: "6px 16px", 
                      fontWeight: 600, 
                      fontSize: 15,
                      border: "1px solid rgba(255,193,7,0.3)"
                    }}>
                      {doctors[selected].experience_years} years experience
                    </span>
                  </div>
                )}
                
                {/* Expertise Tags */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                  {doctors[selected]?.area_of_expertise && Array.isArray(doctors[selected].area_of_expertise) && doctors[selected].area_of_expertise.length > 0 ? (
                    doctors[selected].area_of_expertise.map((exp, i) => (
                      <span key={i} style={{ background: "rgba(39,174,96,0.12)", color: "#27ae60", borderRadius: 8, padding: "4px 12px", fontWeight: 600, fontSize: 14 }}>{exp}</span>
                    ))
                  ) : (
                    <span style={{ background: "rgba(39,174,96,0.12)", color: "#27ae60", borderRadius: 8, padding: "4px 12px", fontWeight: 600, fontSize: 14 }}>Psychology</span>
                  )}
                </div>
                
                {/* Contact Info */}
                <div style={{ marginBottom: 16 }}>
                  {doctors[selected]?.phone && doctors[selected].phone !== 'N/A' && (
                    <div style={{ fontSize: 16, color: "#333", marginBottom: 8 }}><b>Phone:</b> {doctors[selected].phone}</div>
                  )}
  
                </div>
                
                {/* Education section removed */}
                
                {/* Bio */}
                <div style={{ fontSize: 16, color: "#555", lineHeight: 1.5, marginBottom: 24 }}>
                  <b>Bio:</b> {doctors[selected]?.description || "This doctor is passionate about helping people achieve mental wellness through evidence-based therapy and compassionate guidance."}
                </div>
                
                {/* Session Types & Pricing */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#333", marginBottom: 12 }}>Session Types & Pricing</div>
                  <div style={{ fontSize: 16, color: "#555", lineHeight: 1.6 }}>
                    • Individual Therapy (60 min) - <b>$150</b><br/>
                    • Child Therapy (45 min) - <b>$120</b>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: "flex", flexDirection: "row", gap: 16, justifyContent: "center", alignItems: "center", marginTop: 32 }}>
                  <button
                    style={{
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 24px",
                      fontSize: 15,
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(39,174,96,0.15)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleBookSession(doctors[selected])}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#229954";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#27ae60";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Book a Session
                  </button>
                  <button
                    style={{
                      background: "transparent",
                      color: "#27ae60",
                      border: "2px solid #27ae60",
                      borderRadius: 12,
                      padding: "12px 24px",
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onClick={() => {
                      router.push(`/therapist-profile?doctor=${selected}`);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#27ae60";
                      e.target.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = "#27ae60";
                    }}
                  >
                    View Profile
                  </button>
                </div>
                
                {/* Navigation Arrows */}
                <button
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    border: "2px solid #e1e5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.2s",
                    zIndex: 10
                  }}
                  onClick={() => {
                    const prevIndex = selected === 0 ? doctors.length - 1 : selected - 1;
                    setSelected(prevIndex);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(39,174,96,0.1)";
                    e.target.style.borderColor = "#27ae60";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.9)";
                    e.target.style.borderColor = "#e1e5e9";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                
                <button
                  style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    border: "2px solid #e1e5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transition: "all 0.2s",
                    zIndex: 10
                  }}
                  onClick={() => {
                    const nextIndex = selected === doctors.length - 1 ? 0 : selected + 1;
                    setSelected(nextIndex);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(39,174,96,0.1)";
                    e.target.style.borderColor = "#27ae60";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.9)";
                    e.target.style.borderColor = "#e1e5e9";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Date/Time Picker Modal */}
        {showDateTimePicker && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)"
          }}
            onClick={() => setShowDateTimePicker(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "30px",
                maxWidth: "450px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                textAlign: "center"
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
                Book Session with {selectedDoctor?.name}
              </h2>
              
              {/* Calendar Header */}
              <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#333", marginBottom: "3px" }}>Select Date & Time</h3>
                <p style={{ fontSize: "12px", color: "#666" }}>Choose a date and time that works for you</p>
              </div>
              
              {/* Calendar Grid */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(7, 1fr)", 
                  gap: "2px", 
                  marginBottom: "12px" 
                }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                    <div key={`header-${index}`} style={{ 
                      textAlign: "center", 
                      fontSize: "10px", 
                      fontWeight: 600, 
                      color: "#666", 
                      padding: "4px 2px" 
                    }}>
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    const isAvailable = day >= 15 && day <= 25;
                    const isSelected = selectedDate && new Date(selectedDate).getDate() === day;
                    return (
                      <div
                        key={`day-${day}`}
                        onClick={() => {
                          if (isAvailable) {
                            const today = new Date();
                            const selectedDay = new Date(today.getFullYear(), today.getMonth(), day);
                            // Use Indian Standard Time (IST) - UTC+5:30
                            setSelectedDate(selectedDay.toISOString().split('T')[0]);
                          }
                        }}
                        style={{
                          textAlign: "center",
                          padding: "4px 2px",
                          borderRadius: "4px",
                          cursor: isAvailable ? "pointer" : "default",
                          transition: "all 0.2s",
                          fontSize: "11px",
                          fontWeight: 500,
                          backgroundColor: isSelected ? "#27ae60" : "transparent",
                          color: isSelected ? "#fff" : isAvailable ? "#333" : "#ccc",
                          border: isSelected ? "none" : "1px solid transparent"
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Time Slots */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#333", marginBottom: "8px", textAlign: "left" }}>
                  Available Times
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => {
                    const timeValue = time === '9:00 AM' ? '09:00' : 
                                    time === '10:00 AM' ? '10:00' : 
                                    time === '11:00 AM' ? '11:00' : 
                                    time === '12:00 PM' ? '12:00' : 
                                    time === '2:00 PM' ? '14:00' : 
                                    time === '3:00 PM' ? '15:00' : 
                                    time === '4:00 PM' ? '16:00' : '17:00';
                    const isSelected = selectedTime === timeValue;
                    return (
                      <div
                        key={time}
                        onClick={() => setSelectedTime(timeValue)}
                        style={{
                          padding: "8px 6px",
                          borderRadius: "6px",
                          border: `2px solid ${isSelected ? "#27ae60" : "#e1e5e9"}`,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontSize: "12px",
                          fontWeight: 500,
                          backgroundColor: isSelected ? "#f0f9f0" : "transparent",
                          color: isSelected ? "#27ae60" : "#333",
                          textAlign: "center"
                        }}
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button
                  onClick={() => setShowDateTimePicker(false)}
                  style={{
                    padding: "12px 24px",
                    border: "2px solid #e1e5e9",
                    background: "#fff",
                    color: "#666",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateTimeConfirm}
                  disabled={!selectedDate || !selectedTime}
                  style={{
                    padding: "12px 24px",
                    border: "none",
                    background: selectedDate && selectedTime ? "#27ae60" : "#ccc",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: selectedDate && selectedTime ? "pointer" : "not-allowed",
                    transition: "all 0.2s"
                  }}
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)"
          }}
            onClick={() => setShowPaymentModal(false)}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "40px",
                maxWidth: "500px",
                width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                textAlign: "center"
              }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
                Complete Your Booking
              </h2>
              
              <div style={{ 
                background: "#f8f9fa", 
                borderRadius: "12px", 
                padding: "20px", 
                marginBottom: "30px",
                textAlign: "left"
              }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#333", marginBottom: "15px" }}>
                  Session Details:
                </h3>
                <div style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
                  <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                  <p><strong>Date:</strong> {selectedDate}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Duration:</strong> 30 minutes</p>
                  <p><strong>Price:</strong> ₹100</p>
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#333", marginBottom: "15px" }}>
                  Payment Method:
                </h3>
                <div style={{ 
                  border: "2px solid #e1e5e9", 
                  borderRadius: "12px", 
                  padding: "15px",
                  background: "#f8f9fa"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input type="radio" id="card" name="payment" defaultChecked style={{ transform: "scale(1.2)" }} />
                    <label htmlFor="card" style={{ fontSize: "16px", color: "#333" }}>
                      Credit/Debit Card
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button
                  onClick={handlePaymentCancel}
                  style={{
                    padding: "12px 24px",
                    border: "2px solid #e1e5e9",
                    background: "#fff",
                    color: "#666",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSuccess}
                  style={{
                    padding: "12px 24px",
                    border: "none",
                    background: "#27ae60",
                    color: "#fff",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  Pay ₹100
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Guide;
