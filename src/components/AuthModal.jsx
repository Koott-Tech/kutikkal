"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { authApi, clientApi } from "@/lib/backendApi";
import { isClientContactComplete } from "@/lib/contactValidation";
import GoogleSignIn from "@/components/GoogleSignIn";

export default function AuthModal({
  open,
  onClose,
  defaultTab = "login",
  onAuthSuccess,
  onRequireContactInfo
}) {
  const { login, isRemembered } = useAuth();

  const [activeTab, setActiveTab] = useState(defaultTab); // 'login' | 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(isRemembered ?? false);

  // Signup form state
  const [signup, setSignup] = useState({ email: "", password: "", confirmPassword: "" });
  const [signupShowPassword, setSignupShowPassword] = useState(false);

  // Forgot password minimal state
  const [showForgot, setShowForgot] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1);

  const closeAndReset = useCallback(() => {
    setError("");
    setSuccessMessage("");
    setIsLoading(false);
    setShowForgot(false);
    setForgotStep(1);
    onClose?.();
    setRememberMe(false);
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setMounted(false);
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, [open]);

  useEffect(() => {
    if (open) {
      setRememberMe(!!isRemembered);
      // Check for stored auth error when modal opens
      if (typeof window !== 'undefined') {
        const storedError = localStorage.getItem('auth_error');
        if (storedError) {
          setError(storedError);
          localStorage.removeItem('auth_error');
        }
      }
    }
  }, [open, isRemembered]);

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setIsLoading(true);
    setError("");
    try {
      const data = await authApi.login({ email, password });
      const loggedInUser = data?.data?.user;
      const token = data?.data?.token;

      login(loggedInUser, token, { remember: rememberMe });
      try { await onAuthSuccess?.(loggedInUser); } catch (_) {}

      if (loggedInUser?.role === "client") {
        await maybePromptContactInfo();
      }
      closeAndReset();
    } catch (err) {
      const msg = err?.message || "Login failed. Please try again.";
      // Check if it's a "user not found" type error - suggest signup
      const errorMsgLower = msg.toLowerCase();
      if (errorMsgLower.includes('user not found') ||
          errorMsgLower.includes('new to little care') ||
          errorMsgLower.includes('no account found') ||
          errorMsgLower.includes('account does not exist') ||
          errorMsgLower.includes('invalid credentials') ||
          errorMsgLower.includes('incorrect email or password') ||
          (errorMsgLower.includes('authentication required') && !errorMsgLower.includes('session expired'))) {
        setError("No account found with this email. Please create a new account.");
        // Pre-fill email in signup form and switch to signup tab
        setSignup(prev => ({ ...prev, email: email }));
        setActiveTab('signup');
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault?.();
    setIsLoading(true);
    setError("");
    if (signup.password !== signup.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if ((signup.password || "").length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }
    try {
      const data = await authApi.registerClient({ email: signup.email, password: signup.password, role: "client" });
      login(data.data.user, data.data.token, { remember: rememberMe });
      try { await onAuthSuccess?.(data.data.user); } catch (_) {}
      await maybePromptContactInfo();
      closeAndReset();
    } catch (err) {
      const msg = err?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const maybePromptContactInfo = async () => {
    try {
      const response = await clientApi.getProfile();
      const profile = response?.data;
      if (!isClientContactComplete(profile)) {
        onRequireContactInfo?.(profile);
      }
    } catch (contactErr) {
      console.warn("Unable to verify contact information:", contactErr);
    }
  };

  const handleSendOTP = async (e) => {
    e?.preventDefault?.();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      await authApi.sendPasswordResetOTP(email);
      setForgotStep(2);
      setError(""); // Clear any previous errors
      setSuccessMessage("OTP sent to your email address. Please check your inbox.");
    } catch (err) {
      const msg = err?.message || "Failed to send OTP. Please try again.";
      setError(msg);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e?.preventDefault?.();
    if (!otp?.trim()) return setError("Please enter the OTP");
    if (!newPassword?.trim()) return setError("Please enter a new password");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters long");
    if (newPassword !== confirmNewPassword) return setError("Passwords do not match");
    setIsLoading(true);
    setError("");
    try {
      await authApi.resetPassword(email, otp, newPassword);
      setError("");
      setSuccessMessage("Password reset successfully! You can now log in.");
      // Reset form and go back to login after a short delay
      setTimeout(() => {
        setShowForgot(false);
        setForgotStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmNewPassword("");
        setSuccessMessage("");
        setActiveTab("login");
      }, 2000);
    } catch (err) {
      const msg = err?.message || "Failed to reset password. Please try again.";
      setError(msg);
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-2"
      onClick={(e)=>{ if (e.target === e.currentTarget) closeAndReset(); }}
      style={{ display: open ? undefined : "none" }}
    >
      <div className={`w-full max-w-[520px] rounded-xl bg-white shadow-xl py-3 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Header with logo and close */}
        <div className="relative px-3 py-3">
          <div className="w-36 h-10 mx-auto bg-center bg-no-repeat bg-contain" style={{ backgroundImage: "url('/mainlogo.webp')" }} />
          <button aria-label="Close" onClick={closeAndReset} className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Title removed as requested */}

        {error && (
          <div className="mx-4 mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm" style={{ color: '#2C1A4A' }}>{error}</div>
        )}
        {successMessage && (
          <div className="mx-4 mt-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{successMessage}</div>
        )}

        {/* Body */}
        <div className="p-3">
          {/* Forgot Password */}
          <div className="mx-auto w-full max-w-[360px] px-0">
          {showForgot ? (
            forgotStep === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-3">
                <div>
                  <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Email address" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>{ setShowForgot(false); setForgotStep(1); setError(""); }} className="flex-1 rounded-md border px-3 py-2 text-sm">Back to login</button>
                  <button type="submit" disabled={isLoading} className="flex-1 rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Sending…' : 'Send OTP'}</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} maxLength={6} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="OTP code (6 digits)" />
                </div>
                <div>
                  <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="New password" />
                </div>
                <div>
                  <input type="password" value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Confirm new password" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>{ setForgotStep(1); setOtp(""); setNewPassword(""); setConfirmNewPassword(""); setError(""); }} className="flex-1 rounded-md border px-3 py-2 text-sm">Back</button>
                  <button type="submit" disabled={isLoading} className="flex-1 rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Resetting…' : 'Reset Password'}</button>
                </div>
              </form>
            )
          ) : (
            <>
              {activeTab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-3">
                  <GoogleSignIn onSuccess={()=>closeAndReset()} onError={(err)=>setError(err?.message || 'Google Sign-In failed.')} />
                  <div className="flex items-center gap-3"><div className="h-px flex-1 bg-gray-200" /><div className="text-xs text-gray-500">or</div><div className="h-px flex-1 bg-gray-200" /></div>
                  <div>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Email" />
                  </div>
                  <div>
                    <div className="relative">
                      <input type={showPassword ? 'text':'password'} value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Password" />
                      <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{showPassword ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={rememberMe}
                        onChange={(e)=>setRememberMe(e.target.checked)}
                      />
                      <span>Remember me</span>
                    </label>
                    <button type="button" onClick={()=>{ setShowForgot(true); setForgotStep(1); setError(""); }} className="text-[#3f2e73] hover:text-black">Forgot password?</button>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Signing in…' : 'Sign in'}</button>
                  <div className="text-center mt-3 text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={()=>{ 
                        setActiveTab("signup"); 
                        setError(""); 
                        // Pre-fill email if available
                        if (email) {
                          setSignup(prev => ({ ...prev, email: email }));
                        }
                      }}
                      className="text-[#3f2e73] hover:text-black font-medium"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-3">
                  <GoogleSignIn onSuccess={()=>closeAndReset()} onError={(err)=>setError(err?.message || 'Google Sign-In failed.')} />
                  <div className="flex items-center gap-3"><div className="h-px flex-1 bg-gray-200" /><div className="text-xs text-gray-500">or</div><div className="h-px flex-1 bg-gray-200" /></div>
                  <div>
                    <input type="email" value={signup.email} onChange={(e)=>setSignup(s=>({...s, email: e.target.value}))} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Email" />
                  </div>
                  <div>
                    <input type={signupShowPassword ? 'text':'password'} value={signup.password} onChange={(e)=>setSignup(s=>({...s, password: e.target.value}))} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Password (min 6 characters)" />
                  </div>
                  <div>
                    <input type={signupShowPassword ? 'text':'password'} value={signup.confirmPassword} onChange={(e)=>setSignup(s=>({...s, confirmPassword: e.target.value}))} required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-[#3f2e73]" placeholder="Confirm password" />
                    <button type="button" onClick={()=>setSignupShowPassword(!signupShowPassword)} className="mt-1 text-xs text-gray-500">{signupShowPassword ? 'Hide' : 'Show'} passwords</button>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full rounded-md bg-[#3f2e73] px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{isLoading ? 'Creating…' : 'Create account'}</button>
                  <div className="text-center mt-3 text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={()=>{ setActiveTab("login"); setError(""); }}
                      className="text-[#3f2e73] hover:text-black font-medium"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}


