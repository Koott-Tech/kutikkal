'use client';

import React, { useState } from "react";
import OnboardingModal from './OnboardingModal';
import { useRouter } from 'next/navigation';

const DOCTORS = [
  {
    name: "Dr. Irene Cheriyan",
    expertise: ["Anxiety", "CBT", "Mindfulness"],
    experience: 12,
    languages: ["English", "Malayalam", "Hindi"],
    qualifications: "PhD in Clinical Psychology, University of Mumbai. Certified CBT Practitioner.",
    bio: "Dr. Irene Cheriyan is a passionate psychologist dedicated to helping individuals overcome anxiety and improve their mental wellness through evidence-based therapy."
  },
  {
    name: "Dr. Rahul Menon",
    expertise: ["Depression", "Adolescents", "Family Therapy"],
    experience: 9,
    languages: ["English", "Tamil"],
    qualifications: "M.Phil in Psychiatry, NIMHANS. Family Therapy Certification.",
    bio: "Dr. Rahul Menon specializes in treating depression and adolescents. He is certified in family therapy and dedicated to helping families navigate through difficult times."
  },
  {
    name: "Dr. Priya Nair",
    expertise: ["Stress", "Relationships", "Trauma"],
    experience: 7,
    languages: ["English", "Hindi", "Kannada"],
    qualifications: "MSc in Counseling Psychology, Christ University. Trauma Specialist.",
    bio: "Dr. Priya Nair is a trauma specialist with expertise in helping individuals cope with stress and improve their relationships."
  },
  {
    name: "Dr. Arjun Sinha",
    expertise: ["Sleep", "Addiction", "Self-Esteem"],
    experience: 15,
    languages: ["English", "Bengali", "Hindi"],
    qualifications: "PhD in Psychology, Jadavpur University. Addiction Recovery Expert.",
    bio: "Dr. Arjun Sinha specializes in addiction recovery and self-esteem. He is dedicated to helping individuals overcome addiction and improve their self-esteem."
  }
];

const Guide = () => {
  const [selected, setSelected] = useState(null);
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const router = useRouter();

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
        CureMinds
      </div>
      
      <div style={{ position: "relative", zIndex: 3 }}></div>
      
      <section style={{ width: "100vw", minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "8rem", paddingBottom: "4rem" }}>
        <h1 style={{ fontSize: "3.2rem", fontWeight: 800, color: "#1a1a1a", textAlign: "center", letterSpacing: "-0.01em", lineHeight: 1.1, maxWidth: 900, marginBottom: "2.2rem" }}>
          Guides that help you grow
        </h1>
        <p style={{ fontSize: "1.18rem", color: "#444", textAlign: "center", maxWidth: 600, fontWeight: 500, margin: 0, marginBottom: "2.2rem" }}>
          Skilled and supportive mental health professionals dedicated to you and your wellness journey.
        </p>
        
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
        
        <button 
          className="find-therapist-btn" 
          style={{ marginTop: "2.5rem", marginBottom: "2.5rem", padding: "12px 44px", fontSize: 28, fontWeight: 800, borderRadius: 15, letterSpacing: "-0.01em" }} 
          onClick={() => setShowOnboarding(true)}
        >
          <span>Find My Therapist</span>
        </button>
        
        <OnboardingModal 
          open={showOnboarding} 
          onClose={() => setShowOnboarding(false)} 
          onComplete={() => { setShowOnboarding(false); router.push('/guide'); }} 
        />
        
        {/* Guide video cards row */}
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
          
          {DOCTORS.map((doc, idx) => {
            const thumb = `thumb${idx+1}.jpg`;
            return (
              <div
                className="guide-video-card"
                key={doc.name}
                style={{ zIndex: idx+1, position: "relative" }}
                onMouseEnter={e => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={e => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
                onClick={() => setSelected(idx)}
              >
                <video
                  src={`/intro_${idx+1}.mp4`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                  playsInline
                  preload="metadata"
                  poster={`/${thumb}`}
                />
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
                  }}>{doc.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {doc.expertise.map((exp, i) => (
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
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Repeat the same row again below */}
        <div style={{
          width: "100%",
          marginTop: "2.8rem",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          position: "relative",
          height: 380,
          gap: 18,
        }}>
          {DOCTORS.map((doc, idx) => {
            const thumb = `thumb${idx+1}.jpg`;
            return (
              <div
                className="guide-video-card"
                key={doc.name + "-repeat"}
                style={{ zIndex: idx+1, position: "relative" }}
                onMouseEnter={e => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={e => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
                onClick={() => setSelected(idx)}
              >
                <video
                  src={`/intro_${idx+1}.mp4`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  muted
                  playsInline
                  preload="metadata"
                  poster={`/${thumb}`}
                />
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
                    textShadow: "0 2px 8px rgba(0,0,0,0.25)" ,
                    marginBottom: 4,
                    letterSpacing: "-0.01em"
                  }}>{doc.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {doc.expertise.map((exp, i) => (
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
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
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
                height: 620,
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
              
              {/* Left: Video */}
              <div style={{ flex: 1.2, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                <video
                  src={`/intro_${selected+1}.mp4`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", maxHeight: 620 }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={`/thumb${selected+1}.jpg`}
                />
              </div>
              
              {/* Right: Details */}
              <div style={{ flex: 1, padding: 56, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, position: "relative" }}>
                <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 0 }}>{DOCTORS[selected].name}</h2>
                <div style={{ display: "flex", gap: 16, marginBottom: 0 }}>
                  {DOCTORS[selected].expertise.map((exp, i) => (
                    <span key={i} style={{ background: "rgba(39,174,96,0.12)", color: "#27ae60", borderRadius: 10, padding: "6px 16px", fontWeight: 600, fontSize: 16 }}>{exp}</span>
                  ))}
                </div>
                <div style={{ fontSize: 18, color: "#222" }}><b>Experience:</b> {DOCTORS[selected].experience} years</div>
                <div style={{ fontSize: 18, color: "#222" }}><b>Languages:</b> {DOCTORS[selected].languages.join(", ")}</div>
                <div style={{ fontSize: 18, color: "#222" }}><b>Qualifications:</b> {DOCTORS[selected].qualifications}</div>
                <div style={{ fontSize: 17, color: "#444", marginTop: -10, marginBottom: 8 }}><b>Bio:</b> {DOCTORS[selected].bio || "Dr. CureMinds is passionate about helping people achieve mental wellness through evidence-based therapy and compassionate guidance."}</div>
                <div style={{ display: "flex", flexDirection: "row", gap: 12, justifyContent: "center", alignItems: "center", marginTop: "auto", marginBottom: 60 }}>
                  <button
                    style={{
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      borderRadius: 20,
                      padding: "10px 24px",
                      fontSize: 16,
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(39,174,96,0.12)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onClick={() => handleBookSession(DOCTORS[selected])}
                  >
                    Book a Session
                  </button>
                  <button
                    style={{
                      background: "#f8f9fa",
                      color: "#27ae60",
                      border: "2px solid #27ae60",
                      borderRadius: 20,
                      padding: "10px 24px",
                      fontSize: 16,
                      fontWeight: 600,
                      boxShadow: "0 2px 8px rgba(39,174,96,0.12)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onClick={() => {
                      router.push(`/therapist-profile?doctor=${selected}`);
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
                    const prevIndex = selected === 0 ? DOCTORS.length - 1 : selected - 1;
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
                    const nextIndex = selected === DOCTORS.length - 1 ? 0 : selected + 1;
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
