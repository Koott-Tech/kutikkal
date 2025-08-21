"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
    // Redirect to profile page after successful login
    router.push('/profile');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Hide footer on login page
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
      className="login-page"
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
          <div style={{
            fontSize: "4rem",
            marginBottom: "1rem",
            opacity: 0.9
          }}>
            🧠
          </div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            marginBottom: "1rem",
            lineHeight: "1.2"
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            maxWidth: "400px",
            lineHeight: "1.6"
          }}>
            Continue your journey to better mental health with our trusted providers
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{ 
        flex: "1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#fff"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "400px"
        }}>
                     {/* Header */}
           <div style={{
             textAlign: "center",
             marginBottom: "1.5rem"
           }}>
            <button 
              onClick={handleBackToHome}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1a1a1a",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              kuttikal
            </button>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "#1a1a1a",
              marginBottom: "0.5rem"
            }}>
              Sign in to your account
            </h2>
            <p style={{
              color: "#666",
              fontSize: "1rem"
            }}>
              Welcome back! Please enter your details.
            </p>
          </div>

                     {/* Login Form */}
           <form onSubmit={handleSubmit} style={{
             display: "flex",
             flexDirection: "column",
             gap: "1rem"
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
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Forgot password?
              </button>
            </div>

                         {/* Sign In Button */}
             <button
               type="submit"
               style={{
                 background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                 color: "white",
                 border: "none",
                 borderRadius: "0.5rem",
                 padding: "0.875rem 1rem",
                 fontSize: "1rem",
                 fontWeight: "600",
                 cursor: "pointer",
                 transition: "transform 0.2s",
                 marginTop: "0.5rem"
               }}
              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
            >
              Sign in
            </button>

                         {/* Divider */}
             <div style={{
               display: "flex",
               alignItems: "center",
               margin: "1rem 0"
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

                         {/* Continue with Google */}
             <button
               type="button"
               style={{
                 background: "white",
                 color: "#374151",
                 border: "1px solid #d1d5db",
                 borderRadius: "0.5rem",
                 padding: "0.75rem 1rem",
                 fontSize: "1rem",
                 fontWeight: "500",
                 cursor: "pointer",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 gap: "0.5rem",
                 transition: "background-color 0.2s"
               }}
               onMouseEnter={(e) => e.target.style.backgroundColor = "#f9fafb"}
               onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
             >
               <span style={{ fontSize: "1.2rem" }}>🔍</span>
               Continue with Google
             </button>

                          {/* Sign Up Link */}
              <div style={{
                textAlign: "center",
                marginTop: "1rem",
                fontSize: "0.875rem",
                color: "#6b7280"
              }}>
              Don't have an account?{" "}
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "#667eea",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
