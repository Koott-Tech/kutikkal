"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleViewFullReport = (session) => {
    setSelectedReport(session);
    setShowReportModal(true);
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
    setSelectedReport(null);
  };

  // Mock data for all sessions
  const allSessions = [
    {
      id: 1,
      date: "2024-01-15",
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "50 minutes",
      status: "Completed",
      report: "Patient showed significant improvement in managing anxiety symptoms. Cognitive behavioral techniques were effective. Focus on anxiety management, discussed recent stressors, practiced relaxation techniques, set goals for next session. Recommended continued practice of breathing exercises and mindfulness techniques."
    },
    {
      id: 2,
      date: "2024-01-08",
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      patient: "John Doe",
      type: "Couples Therapy",
      duration: "60 minutes",
      status: "Completed",
      report: "Couple demonstrated improved communication patterns. Conflict resolution strategies were practiced successfully. Worked on communication skills, addressed recent conflicts, practiced active listening exercises, assigned homework for communication practice. Relationship dynamics are showing positive changes."
    },
    {
      id: 3,
      date: "2024-01-01",
      time: "11:15 AM",
      doctor: "Dr. Emily Rodriguez",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "45 minutes",
      status: "Completed",
      report: "Initial assessment completed. Patient presents with mild depression symptoms. Initial consultation, mental health assessment, discussed treatment goals, established therapeutic relationship, planned next steps. Treatment plan established focusing on cognitive restructuring and behavioral activation."
    },
    {
      id: 4,
      date: "2024-01-22",
      time: "3:00 PM",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "50 minutes",
      status: "Scheduled",
      report: "Follow-up session planned to continue anxiety management work and assess progress on previously set goals."
    },
    {
      id: 5,
      date: "2024-01-29",
      time: "1:00 PM",
      doctor: "Dr. Michael Chen",
      patient: "John Doe",
      type: "Couples Therapy",
      duration: "60 minutes",
      status: "Scheduled",
      report: "Continued couples therapy focusing on deepening communication skills and addressing ongoing relationship challenges."
    }
  ];

  const reports = [
    {
      id: 1,
      sessionId: 1,
      date: "2024-01-15",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      type: "Individual Therapy",
      diagnosis: "Generalized Anxiety Disorder",
      symptoms: "Excessive worry, restlessness, difficulty concentrating",
      treatment: "Cognitive Behavioral Therapy (CBT)",
      progress: "Significant improvement in anxiety management",
      recommendations: "Continue breathing exercises, practice mindfulness daily, schedule follow-up in 2 weeks",
      nextSession: "2024-01-22"
    },
    {
      id: 2,
      sessionId: 2,
      date: "2024-01-08",
      doctor: "Dr. Michael Chen",
      patient: "John Doe",
      type: "Couples Therapy",
      diagnosis: "Relationship Communication Issues",
      symptoms: "Frequent arguments, poor communication, lack of emotional connection",
      treatment: "Couples Therapy with Communication Focus",
      progress: "Improved communication patterns, better conflict resolution",
                        recommendations: "Practice active listening daily, use &apos;I&apos; statements, schedule weekly check-ins",
      nextSession: "2024-01-29"
    },
    {
      id: 3,
      sessionId: 3,
      date: "2024-01-01",
      doctor: "Dr. Emily Rodriguez",
      patient: "John Doe",
      type: "Individual Therapy",
      diagnosis: "Mild Depression",
      symptoms: "Low mood, decreased energy, social withdrawal",
      treatment: "Cognitive Restructuring and Behavioral Activation",
      progress: "Initial assessment completed, treatment plan established",
      recommendations: "Start daily mood tracking, increase social activities, practice positive self-talk",
      nextSession: "2024-01-15"
    }
  ];

  const invoices = [
    {
      id: 1,
      date: "2024-01-15",
      amount: "$150.00",
      status: "Paid",
      description: "Individual Therapy Session"
    },
    {
      id: 2,
      date: "2024-01-08",
      amount: "$180.00",
      status: "Paid",
      description: "Couples Therapy Session"
    },
    {
      id: 3,
      date: "2024-01-01",
      amount: "$150.00",
      status: "Paid",
      description: "Individual Therapy Session"
    }
  ];

  const renderSessions = (sessions, title) => (
    <div style={{ marginBottom: "2rem" }}>
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: "1rem"
      }}>
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {sessions.map((session) => (
          <div key={session.id} style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem"
            }}>
              <div>
                <h4 style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem"
                }}>
                  {session.type}
                </h4>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  <strong>Doctor:</strong> {session.doctor}
                </p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  <strong>Patient:</strong> {session.patient}
                </p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280"
                }}>
                  <strong>Duration:</strong> {session.duration}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  background: session.status === "Completed" ? "#dcfce7" : "#fef3c7",
                  color: session.status === "Completed" ? "#166534" : "#92400e"
                }}>
                  {session.status}
                </div>
                <p style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginTop: "0.5rem"
                }}>
                  {session.date}
                </p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280"
                }}>
                  {session.time}
                </p>
              </div>
            </div>
            
            {/* Doctor's Report Section */}
            {session.report && (
              <div style={{ 
                marginBottom: "1rem", 
                padding: "1rem", 
                background: "#f8fafc", 
                borderRadius: "0.5rem",
                border: "1px solid #e2e8f0"
              }}>
                <h5 style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem"
                }}>
                  📋 Doctor&apos;s Report
                </h5>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#4b5563",
                  lineHeight: "1.5"
                }}>
                  {session.report}
                </p>
              </div>
            )}
            
                        {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1rem"
            }}>
              {session.status === "Completed" && (
                <button 
                  onClick={() => handleViewFullReport(session)}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  📄 View Full Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div>
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: "1rem"
      }}>
        Session Reports & Details
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reports.map((report) => (
          <div key={report.id} style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1rem"
            }}>
              <div>
                <h4 style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem"
                }}>
                  {report.type} - {report.diagnosis}
                </h4>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  <strong>Doctor:</strong> {report.doctor}
                </p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  <strong>Date:</strong> {report.date}
                </p>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem"
                }}>
                  <strong>Treatment:</strong> {report.treatment}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  background: "#dbeafe",
                  color: "#1e40af"
                }}>
                  Report #{report.id}
                </div>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginTop: "0.5rem"
                }}>
                  Next Session: {report.nextSession}
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <h5 style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "0.5rem"
              }}>
                Symptoms & Assessment
              </h5>
              <p style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                lineHeight: "1.5"
              }}>
                {report.symptoms}
              </p>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <h5 style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "0.5rem"
              }}>
                Progress & Observations
              </h5>
              <p style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                lineHeight: "1.5"
              }}>
                {report.progress}
              </p>
            </div>
            
            <div style={{ marginBottom: "1rem" }}>
              <h5 style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "0.5rem"
              }}>
                Recommendations
              </h5>
              <p style={{
                fontSize: "0.875rem",
                color: "#4b5563",
                lineHeight: "1.5"
              }}>
                {report.recommendations}
              </p>
            </div>
            
            <div style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "1rem"
            }}>
              <button style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
              >
                📄 Download Report
              </button>
              <button style={{
                background: "white",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                📋 View Session Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div>
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: "1rem"
      }}>
        Invoices & Bills
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {invoices.map((invoice) => (
          <div key={invoice.id} style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}>
              <div>
                <h4 style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem"
                }}>
                  {invoice.description}
                </h4>
                <p style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1rem"
                }}>
                  Date: {invoice.date}
                </p>
                <button style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                >
                  📄 Download Receipt
                </button>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: "0.5rem"
                }}>
                  {invoice.amount}
                </p>
                <div style={{
                  padding: "0.25rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  background: "#dcfce7",
                  color: "#166534"
                }}>
                  {invoice.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div>
      <h3 style={{
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#1a1a1a",
        marginBottom: "1rem"
      }}>
        Support & Help
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "0.5rem"
          }}>
            Contact Support
          </h4>
          <p style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1rem"
          }}>
            Need help? Our support team is here to assist you.
          </p>
          <button style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            Contact Support
          </button>
        </div>
        
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h4 style={{
            fontSize: "1.125rem",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "0.5rem"
          }}>
            FAQ
          </h4>
          <p style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "1rem"
          }}>
            Find answers to frequently asked questions.
          </p>
          <button style={{
            background: "white",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "Arial, Helvetica, sans-serif",
      paddingTop: "2rem"
    }}>
      <div style={{
        display: "flex",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem"
      }}>
        {/* Sidebar */}
        <div style={{
          width: "250px",
          background: "white",
          borderRadius: "0.75rem",
          padding: "1.5rem",
          height: "fit-content",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
        }}>
          <h2 style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#1a1a1a",
            marginBottom: "1.5rem"
          }}>
            Dashboard
          </h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { id: "sessions", label: "Sessions", icon: "📅" },
              { id: "reports", label: "Reports", icon: "📊" },
              { id: "invoices", label: "Invoices & Bills", icon: "💰" },
              { id: "support", label: "Support", icon: "🆘" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  background: activeTab === item.id ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "transparent",
                  color: activeTab === item.id ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  textAlign: "left",
                  width: "100%"
                }}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{
          flex: "1",
          marginLeft: "2rem"
        }}>
          {activeTab === "sessions" && renderSessions(allSessions, "All Sessions")}
          {activeTab === "reports" && renderReports()}
          {activeTab === "invoices" && renderInvoices()}
          {activeTab === "support" && renderSupport()}
        </div>
      </div>
      
      {/* Detailed Report Modal */}
      {showReportModal && selectedReport && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "2rem"
        }}>
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseReportModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "#6b7280",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#f3f4f6"
              }}
            >
              ✕
            </button>
            
            {/* Report Header */}
            <div style={{
              borderBottom: "2px solid #e5e7eb",
              paddingBottom: "1rem",
              marginBottom: "2rem"
            }}>
              <h2 style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "0.5rem"
              }}>
                Session Report
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                fontSize: "0.875rem",
                color: "#6b7280"
              }}>
                <div>
                  <strong>Session Type:</strong> {selectedReport.type}
                </div>
                <div>
                  <strong>Date:</strong> {selectedReport.date}
                </div>
                <div>
                  <strong>Time:</strong> {selectedReport.time}
                </div>
                <div>
                  <strong>Duration:</strong> {selectedReport.duration}
                </div>
                <div>
                  <strong>Doctor:</strong> {selectedReport.doctor}
                </div>
                <div>
                  <strong>Patient:</strong> {selectedReport.patient}
                </div>
              </div>
            </div>
            
            {/* Detailed Report Content */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1a1a1a",
                marginBottom: "1rem"
              }}>
                Doctor&apos;s Comprehensive Report
              </h3>
              <div style={{
                background: "#f8fafc",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                lineHeight: "1.7",
                fontSize: "1rem",
                color: "#374151"
              }}>
                {selectedReport.report}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "1.5rem"
            }}>
              <button
                onClick={handleCloseReportModal}
                style={{
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
              <button style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer"
              }}>
                📄 Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
