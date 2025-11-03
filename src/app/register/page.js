"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../lib/backendApi";
import GoogleSignIn from "../../components/GoogleSignIn";

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
      
      // Handle specific error messages
      let errorMessage;
      if (error.message && error.message.includes('already exists')) {
        errorMessage = 'Email already in use. Please use a different email or try logging in.';
      } else if (error.message && error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message && error.message.includes('Validation Error')) {
        errorMessage = 'Please check your input. Make sure email is valid and password is at least 6 characters.';
      } else {
        errorMessage = error.message || 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  return (
    <div 
      className="register-page"
      style={{ 
        display: "flex", 
        minHeight: "100vh",
        height: "100vh",
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden"
      }}
    >
      {/* Left Side - Large Image */}
      <div style={{ 
        flex: "1",
        backgroundImage: "url('/signup.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }} className="hidden md:flex">
      </div>

      {/* Right Side - Registration Form (no blue container) */}
      <div style={{ 
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.75rem, 2vw, 1rem)",
        background: "#ffffff"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px"
        }}>
          <div style={{
            textAlign: "center",
            marginBottom: "1rem",
            position: "relative"
          }}>
            <button 
              onClick={() => router.push('/')}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                marginBottom: "0.5rem",
                marginTop: "0",
                display: "inline-block",
                position: "relative",
                top: "clamp(-3rem, -6vw, -1.5rem)"
              }}
            >
              <div 
                style={{ 
                  width: "180px", 
                  height: "60px", 
                  backgroundImage: "url('/mainlogo.webp')", 
                  backgroundSize: "contain", 
                  backgroundRepeat: "no-repeat", 
                  backgroundPosition: "center",
                  margin: "0 auto"
                }}
              />
            </button>
            <h6 className="text-3xl font-bold text-gray-900 mb-1">
              Sign Up
            </h6>
            <p style={{
              color: "#6b7280",
              fontSize: "0.875rem",
              marginTop: "0.25rem"
            }}>
              Create your account to get started
            </p>
            
            {/* Registration Policy Note removed */}
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "0.75rem",
              fontSize: "0.875rem"
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* Email */}
            <div>
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
            <div>
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
            <div>
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
                backgroundColor: isLoading ? "#9ca3af" : "#3f2e73",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                marginTop: "0.25rem",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#1d1733";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#3f2e73";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div style={{
              textAlign: "center",
              marginTop: "0.75rem",
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
                  color: "#3f2e73",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#1d1733'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#3f2e73'; }}
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            margin: "0.75rem 0"
          }}>
            <div style={{
              flex: "1",
              height: "1px",
              background: "#e5e7eb"
            }}></div>
            <span style={{
              padding: "0 1rem",
              color: "#6b7280",
              fontSize: "0.875rem"
            }}>
              or
            </span>
            <div style={{
              flex: "1",
              height: "1px",
              background: "#e5e7eb"
            }}></div>
          </div>

          {/* Google Sign-In Component */}
          <GoogleSignIn 
            onSuccess={(result) => {
              console.log('Google Sign-In successful:', result);
            }}
            onError={(error) => {
              console.error('Google Sign-In error:', error);
              setError(error.message || 'Google Sign-In failed. Please try again.');
            }}
          />
        </div>
      </div>
    </div>
  );
}
