"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../lib/backendApi";
import GoogleSignIn from "../../components/GoogleSignIn";
import { useNotification } from "../../contexts/NotificationContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const { showError, showSuccess } = useNotification();
  
  // Get return URL from query parameters
  const [returnUrl, setReturnUrl] = useState("");
  
  useEffect(() => {
    // Get return URL from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrlParam = urlParams.get('returnUrl');
    if (returnUrlParam) {
      setReturnUrl(returnUrlParam);
    }
    
    // Check for auth error message from automatic logout
    const authError = localStorage.getItem('auth_error');
    if (authError) {
      setError(authError);
      localStorage.removeItem('auth_error');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use our backend API
      const data = await authApi.login({ email, password });

      // Use the auth context to login
      login(data.data.user, data.data.token);

      // If there's a return URL and user is a client, redirect there
      if (returnUrl && data.data.user.role === 'client') {
        router.push(returnUrl);
      } else {
        // Redirect based on user role
        if (data.data.user.role === 'admin' || data.data.user.role === 'superadmin') {
          router.push('/admin');
        } else if (data.data.user.role === 'psychologist') {
          router.push('/psychologist');
        } else if (data.data.user.role === 'finance') {
          router.push('/finance');
        } else if (data.data.user.role === 'client') {
          // Clients go to guide page to browse and book therapists
          router.push('/guide');
        } else {
          router.push('/profile');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      let errorMessage;
      if (error.message && error.message.includes('Invalid credentials')) {
        errorMessage = 'Wrong password. Please try again.';
      } else if (error.message && error.message.includes('User not found')) {
        errorMessage = 'No account found with this email address.';
      } else if (error.message && error.message.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else {
        errorMessage = error.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authApi.sendPasswordResetOTP(email);
      setForgotPasswordStep(2);
      showSuccess("OTP sent to your email address", "Check Your Email");
    } catch (error) {
      console.error("Send OTP error:", error);
      const errorMessage = error.message || "Failed to send OTP. Please try again.";
      setError(errorMessage);
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }
    
    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authApi.resetPassword(email, otp, newPassword);
      showSuccess("Password reset successfully! You can now log in with your new password.", "Success");
      // Reset forgot password state and go back to login
      setShowForgotPassword(false);
      setForgotPasswordStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Reset password error:", error);
      const errorMessage = error.message || "Failed to reset password. Please try again.";
      setError(errorMessage);
      showError(errorMessage, "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setForgotPasswordStep(1);
    setError("");
  };

  return (
    <div 
      className="login-page"
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
        backgroundImage: "url('/signin.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }} className="hidden md:flex">
      </div>

      {/* Right Side - Login Form */}
      <div style={{ 
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(0.75rem, 2vw, 1rem)",
        background: "#fff"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px"
        }}>
                     {/* Header */}
           <div style={{
             textAlign: "center",
             marginBottom: "1rem",
             position: "relative"
           }}>
            <button 
              onClick={handleBackToHome}
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
              {showForgotPassword ? (forgotPasswordStep === 1 ? "Forgot Password" : "Reset Password") : "Sign in to your account"}
            </h6>
            <p style={{
              color: "#666",
              fontSize: "1rem",
              marginTop: "0.25rem"
            }}>
              {showForgotPassword ? (forgotPasswordStep === 1 ? "Enter your email to receive reset instructions" : "Enter OTP and new password") : "Welcome back! Please enter your details."}
            </p>
          </div>

          {/* Forgot Password Form */}
          {showForgotPassword && forgotPasswordStep === 1 && (
            <form onSubmit={handleSendOTP} style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3f2e73"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  placeholder="Enter your email address"
                />
              </div>

              {error && (
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  style={{
                    flex: 1,
                    padding: "0.875rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: isLoading ? "#9ca3af" : "#3f2e73",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.875rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#1d1733";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#3f2e73";
                    }
                  }}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form (OTP Step) */}
          {showForgotPassword && forgotPasswordStep === 2 && (
            <form onSubmit={handleResetPassword} style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem"
            }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    backgroundColor: "#f9fafb",
                    color: "#6b7280",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3f2e73"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  placeholder="Enter 6-digit OTP"
                />
                <p style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginTop: "0.25rem"
                }}>
                  Check your email for the 6-digit code
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3f2e73"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "0.5rem"
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3f2e73"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  placeholder="Confirm new password"
                />
              </div>

              {error && (
                <div style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem"
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordStep(1);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                  }}
                  style={{
                    flex: 1,
                    padding: "0.875rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#374151",
                    backgroundColor: "#fff",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#fff";
                  }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    backgroundColor: isLoading ? "#9ca3af" : "#3f2e73",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.875rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#1d1733";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.backgroundColor = "#3f2e73";
                    }
                  }}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

                     {/* Login Form */}
           {!showForgotPassword && (
           <form onSubmit={handleSubmit} style={{
             display: "flex",
             flexDirection: "column",
             gap: "0.75rem"
           }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box"
                }}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem"
              }}>
                Password
              </label>
              <div style={{
                position: "relative"
              }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    paddingRight: "3rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    fontSize: "1rem"
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.875rem"
            }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer"
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    accentColor: "#667eea"
                  }}
                />
                <span style={{ color: "#374151" }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPasswordClick}
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
                Forgot password?
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                marginTop: "0.5rem"
              }}>
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
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
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

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
              returnUrl={returnUrl}
              onSuccess={(result) => {
                console.log('Google Sign-In successful:', result);
              }}
              onError={(error) => {
                console.error('Google Sign-In error:', error);
                setError(error.message || 'Google Sign-In failed. Please try again.');
              }}
            />

            {/* Sign Up Link */}
              <div style={{
                textAlign: "center",
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                color: "#6b7280"
              }}>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => router.push('/register')}
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
                Sign up
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
