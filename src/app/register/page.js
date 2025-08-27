"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../lib/backendApi";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Register client with minimal data
      const data = await authApi.registerClient({
        email: formData.email,
        password: formData.password,
        role: 'client'
      });

      // Auto-login after successful registration
      login(data.data.user, data.data.token);

      // Redirect to profile contact tab to complete setup
      router.push('/profile?tab=contact');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle validation errors specifically
      if (error.message && error.message.includes('Validation Error')) {
        setError('Please check your input. Make sure email is valid and password is at least 6 characters.');
      } else if (error.message && error.message.includes('already exists')) {
        setError('An account with this email already exists. Please use a different email or try logging in.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  // Hide footer on register page
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // Cleanup function to show footer when leaving the page
    return () => {
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  return (
    <div 
      className="register-page"
      style={{ 
        display: "flex", 
        height: "90vh",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      {/* Left Side - Large Image */}
      <div style={{ 
        flex: "1",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Pattern */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.1)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          opacity: 0.3
        }}></div>
        
        {/* Content */}
        <div style={{
          textAlign: "center",
          color: "white",
          zIndex: 1,
          position: "relative",
          padding: "2rem"
        }}>
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: "1rem"
          }}>
            Join Kuttikal
          </h1>
          <p style={{
            fontSize: "1.25rem",
            opacity: 0.9,
            maxWidth: "500px",
            lineHeight: "1.6"
          }}>
            Create your account quickly with just email and password. Complete your profile later to access therapy services.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div style={{ 
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "#f9fafb"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "2rem"
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "0.5rem"
            }}>
              Quick Sign Up
            </h2>
            <p style={{
              color: "#6b7280",
              fontSize: "0.875rem"
            }}>
              Just email and password to get started
            </p>
            
            {/* Registration Policy Note */}
            <div style={{
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              color: "#1e40af",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginTop: "1rem",
              fontSize: "0.75rem"
            }}>
              <strong>Note:</strong> Only clients can create accounts. Psychologists, admins, and superadmins are created by administrators. You'll complete your profile after registration to access therapy services.
            </div>
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ spaceY: "1rem" }}>
            {/* Email */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem"
                }}
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem"
                }}
                placeholder="Create a password (min 6 characters)"
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem"
                }}
                placeholder="Confirm your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "transform 0.2s",
                marginTop: "0.5rem",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => !isLoading && (e.target.style.transform = "translateY(0)")}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: "center",
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: "#6b7280"
            }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleBackToLogin}
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
