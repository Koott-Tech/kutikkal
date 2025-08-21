"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Mock data for sessions
  const previousSessions = [
    {
      id: 1,
      date: "2024-01-15",
      time: "10:00 AM",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "50 minutes",
      status: "Completed"
    },
    {
      id: 2,
      date: "2024-01-08",
      time: "2:30 PM",
      doctor: "Dr. Michael Chen",
      patient: "John Doe",
      type: "Couples Therapy",
      duration: "60 minutes",
      status: "Completed"
    },
    {
      id: 3,
      date: "2024-01-01",
      time: "11:15 AM",
      doctor: "Dr. Emily Rodriguez",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "45 minutes",
      status: "Completed"
    }
  ];

  const upcomingSessions = [
    {
      id: 4,
      date: "2024-01-22",
      time: "3:00 PM",
      doctor: "Dr. Sarah Johnson",
      patient: "John Doe",
      type: "Individual Therapy",
      duration: "50 minutes",
      status: "Scheduled"
    },
    {
      id: 5,
      date: "2024-01-29",
      time: "1:00 PM",
      doctor: "Dr. Michael Chen",
      patient: "John Doe",
      type: "Couples Therapy",
      duration: "60 minutes",
      status: "Scheduled"
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
              { id: "sessions", label: "Previous Sessions", icon: "📅" },
              { id: "upcoming", label: "Upcoming Sessions", icon: "⏰" },
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
          {activeTab === "sessions" && renderSessions(previousSessions, "Previous Sessions")}
          {activeTab === "upcoming" && renderSessions(upcomingSessions, "Upcoming Sessions")}
          {activeTab === "invoices" && renderInvoices()}
          {activeTab === "support" && renderSupport()}
        </div>
      </div>
    </div>
  );
}
