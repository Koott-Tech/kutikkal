'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clientApi } from '../../../lib/backendApi';
import { useAuth } from '../../../contexts/AuthContext';

// Force dynamic rendering to bypass cache
export const dynamic = 'force-dynamic';

// Success Animation Component (Google Pay style)
function SuccessAnimationContent() {
  const confettiColors = ['#22c55e', '#3f2e73', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  // Optimize particles based on device capability
  const [particleCount, setParticleCount] = useState(20);
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = width <= 768;
      setIsMobile(isMobileDevice);
      
      // Detect low-end devices
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;
      const connection = navigator.connection;
      const isLowEndDevice = 
        hardwareConcurrency <= 2 ||
        deviceMemory <= 2 ||
        (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) ||
        width <= 480;
      
      setIsLowEnd(isLowEndDevice);
      
      // Set particle count based on device capability
      if (isLowEndDevice) {
        setParticleCount(4); // Ultra-low-end devices
      } else if (isMobileDevice) {
        setParticleCount(6); // Regular mobile
      } else {
        setParticleCount(20); // Desktop
      }
    };
    
    if (typeof window !== 'undefined') {
      checkDevice();
      window.addEventListener('resize', checkDevice);
      return () => window.removeEventListener('resize', checkDevice);
    }
  }, []);
  
  const particles = Array.from({ length: particleCount }, (_, i) => i);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Checkmark Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          isMobile
            ? { type: 'tween', duration: 0.4, ease: 'easeOut' }
            : { type: 'spring', stiffness: 200, damping: 15, duration: 0.6 }
        }
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f0fdf4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
          willChange: 'transform, opacity'
        }}
      >
        <motion.svg
          width="50"
          height="50"
          viewBox="0 0 52 52"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { delay: 0.2, duration: 0.5, ease: 'easeInOut' },
            opacity: { delay: 0.2, duration: 0.3 }
          }}
        >
          <motion.circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: 'easeInOut' }}
          />
          <motion.path
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.3, ease: 'easeInOut' }}
          />
        </motion.svg>
      </motion.div>

      {/* Confetti Particles */}
      <AnimatePresence>
        {particles.map((particle) => {
          const angle = (360 / particles.length) * particle;
          const distance = 60 + Math.random() * 40;
          const x = Math.cos((angle * Math.PI) / 180) * distance;
          const y = Math.sin((angle * Math.PI) / 180) * distance;
          const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          const delay = Math.random() * 0.3;
          const size = 6 + Math.random() * 4;

          return (
            <motion.div
              key={particle}
              initial={{ 
                x: 0, 
                y: 0, 
                scale: 0, 
                opacity: 1,
                ...(isLowEnd ? {} : { rotate: 0 }) // Remove rotate on low-end devices
              }}
              animate={{ 
                x: x, 
                y: y, 
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 0.8, 0],
                ...(isLowEnd ? {} : { rotate: 360 }) // Remove rotate on low-end devices
              }}
              transition={{
                delay: isMobile ? delay * 0.5 : delay, // Reduce delay on mobile
                duration: isMobile ? 0.6 : 0.8, // Shorter duration on mobile
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                zIndex: 1,
                boxShadow: isLowEnd ? 'none' : `0 0 ${size}px ${color}`, // Remove shadow on low-end
                willChange: 'transform, opacity'
              }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Sliding Animation (starts centered, moves to top)
function SlidingSuccessAnimation({ onComplete }) {
  const [isMoving, setIsMoving] = useState(false);
  const [showBackground, setShowBackground] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Ensure page stays at top during animation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // After 1.2 seconds (checkmark animation completes), start moving to top
    const timer = setTimeout(() => {
      setIsMoving(true);
      // Fade out background immediately when moving starts
      setShowBackground(false);
      // After slide completes, notify parent
      setTimeout(() => {
        // Ensure scroll is at top when animation completes
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        onComplete();
      }, 600); // Duration of slide animation
    }, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <>
      {/* White Background Overlay */}
      <AnimatePresence>
        {showBackground && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              // Remove backdrop-filter on mobile for better performance
              backdropFilter: !isMobile ? 'blur(4px)' : 'none',
              WebkitBackdropFilter: !isMobile ? 'blur(4px)' : 'none',
              zIndex: 9998,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* Checkmark Animation - Using transform instead of top for better performance */}
      <motion.div
        initial={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          zIndex: 9999
        }}
        animate={isMoving ? {
          position: 'fixed',
          left: '50%',
          top: '140px', // Fixed position for top
          x: '-50%',
          y: 0, // Reset y transform when at top
          scale: 0.8,
          zIndex: 9999
        } : {
          position: 'fixed',
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          scale: 1,
          zIndex: 9999
        }}
        transition={{
          duration: isMobile ? 0.4 : 0.6, // Faster on mobile
          ease: [0.4, 0, 0.2, 1] // Custom easing for smooth slide
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          willChange: 'transform'
        }}
      >
        <SuccessAnimationContent />
      </motion.div>
    </>
  );
}

// Top Position Animation (shows after slide completes)
function TopSuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '20px' }}
    >
      <SuccessAnimationContent />
    </motion.div>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [paymentData, setPaymentData] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(true);
  const [error, setError] = useState(null);
  const [showCenteredAnimation, setShowCenteredAnimation] = useState(false);
  const [loadingScreenComplete, setLoadingScreenComplete] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show success animation immediately and start fetching data in parallel
  useEffect(() => {
    // Ensure page is at top before showing anything
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Show animation immediately - don't wait for loading screen
    // Data fetching will happen in parallel (already started in the other useEffect)
    setShowCenteredAnimation(true);
    setLoadingScreenComplete(true);
  }, []);

  // Scroll to top on page load and prevent unwanted scrolling
  useEffect(() => {
    // Scroll to top immediately and lock it
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Prevent scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Lock scroll position at top during initial load and animation
    const preventScroll = () => {
      if (window.scrollY > 0 || document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };
    
    // Check scroll position frequently during animation phase
    const scrollCheck = setInterval(preventScroll, 50);
    
    // Keep locked until animation completes (about 2-3 seconds)
    const unlockTimer = setTimeout(() => {
      clearInterval(scrollCheck);
    }, 3000);
    
    return () => {
      clearInterval(scrollCheck);
      clearTimeout(unlockTimer);
    };
  }, []);

  useEffect(() => {
    // Get URL parameters from Razorpay
    const razorpay_order_id = searchParams.get('razorpay_order_id');
    const razorpay_payment_id = searchParams.get('razorpay_payment_id');
    const razorpay_signature = searchParams.get('razorpay_signature');
    const session_id = searchParams.get('session_id'); // NEW: Direct session ID from backend
    const verification_error = searchParams.get('verification_error'); // Flag if verification failed

    console.log('Payment parameters:', { razorpay_order_id, razorpay_payment_id, session_id, verification_error });
    console.log('📱 Device info:', {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
      isIOS: typeof navigator !== 'undefined' ? /iPhone|iPad|iPod/i.test(navigator.userAgent) : false
    });

    // Set payment data from URL parameters
    const payload = {
      orderId: razorpay_order_id || 'N/A',
      paymentId: razorpay_payment_id || 'N/A',
      status: 'success'
    };

    setPaymentData(payload);
    
    // If verification failed in handler, retry it now (for iPhone)
    if (verification_error === 'true' && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      console.log('🔄 Retrying payment verification (verification failed in handler)...');
      retryPaymentVerification(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    }
    
    // Start fetching session details IMMEDIATELY in the background (while animation plays)
    // This ensures data is ready when animation completes
    if (isAuthenticated()) {
      if (session_id) {
        // NEW: Direct fetch by session ID (much more efficient!)
        console.log('✅ Using direct session ID fetch:', session_id);
        fetchSessionById(session_id);
      } else if (razorpay_order_id && razorpay_order_id !== 'N/A') {
        // Fallback: Use old polling method if session_id not available
        console.log('⚠️ No session_id in URL, using polling method');
        fetchSessionDetails(razorpay_order_id);
      } else {
        // Try to get payment details from sessionStorage (iPhone backup)
        try {
          const storedPayment = sessionStorage.getItem('razorpay_payment');
          if (storedPayment) {
            const paymentData = JSON.parse(storedPayment);
            console.log('📦 Found payment data in sessionStorage, retrying verification...');
            if (paymentData.razorpay_order_id && paymentData.razorpay_payment_id && paymentData.razorpay_signature) {
              retryPaymentVerification(
                paymentData.razorpay_order_id,
                paymentData.razorpay_payment_id,
                paymentData.razorpay_signature
              );
            }
          }
        } catch (storageErr) {
          console.warn('⚠️ Could not read payment from sessionStorage:', storageErr);
        }
      }
    }

    // Notify parent window when running inside iframe (modal checkout)
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'RAZORPAY_PAYMENT_RESULT',
          status: 'success',
          payload
        },
        window.location.origin
      );
    }

    setLoading(false);

  }, [searchParams, isAuthenticated]);

  // Session details fetching only - no receipt fetching
  // Receipts are generated on sessions page and sent via WhatsApp/email only

  // Retry payment verification (for iPhone when handler fails)
  const retryPaymentVerification = async (orderId, paymentId, signature) => {
    try {
      console.log('🔄 Retrying payment verification...', { orderId, paymentId });
      const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001/api'}/payment/success`;
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Payment verification retry successful:', data);
        
        // If we got session_id, update URL and fetch session
        if (data?.success && data?.data?.sessionId) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('session_id', data.data.sessionId);
          newUrl.searchParams.delete('verification_error');
          window.history.replaceState({}, '', newUrl.toString());
          
          console.log('✅ Session ID received, fetching session...');
          fetchSessionById(data.data.sessionId);
        } else if (orderId) {
          // Fallback to polling
          fetchSessionDetails(orderId);
        }
      } else {
        console.error('❌ Payment verification retry failed:', response.status);
        // Still try to fetch session using polling
        if (orderId) {
          fetchSessionDetails(orderId);
        }
      }
    } catch (err) {
      console.error('❌ Payment verification retry error:', err);
      // Still try to fetch session using polling
      if (orderId) {
        fetchSessionDetails(orderId);
      }
    }
  };

  // NEW: Direct fetch by session ID (much more efficient!)
  const fetchSessionById = async (sessionId) => {
    try {
      console.log('🔍 Fetching session directly by ID:', sessionId);
      setLoadingSessionDetails(true);
      
      const sessionResponse = await clientApi.getSession(sessionId);
      
      if (sessionResponse.success && sessionResponse.data) {
        const session = sessionResponse.data.session || sessionResponse.data;
        
        if (session && session.scheduled_date && session.scheduled_time) {
          let psychologistName = 'your therapist';
          if (session.psychologist) {
            if (session.psychologist.first_name && session.psychologist.last_name) {
              psychologistName = `${session.psychologist.first_name} ${session.psychologist.last_name}`;
            } else if (session.psychologist.first_name) {
              psychologistName = session.psychologist.first_name;
            }
          } else if (session.psychologist_name) {
            psychologistName = session.psychologist_name;
          } else if (session.psychologist_first_name && session.psychologist_last_name) {
            psychologistName = `${session.psychologist_first_name} ${session.psychologist_last_name}`;
          }
          
          const timeValue = session.scheduled_time;
          const timeOnly = typeof timeValue === 'string' 
            ? timeValue.split(' ')[0]
            : timeValue;
          
          console.log('✅ Session details fetched directly:', { 
            psychologistName, 
            date: session.scheduled_date, 
            time: timeOnly
          });
          
          setSessionDetails({
            psychologistName,
            date: session.scheduled_date,
            time: timeOnly
          });
          setLoadingSessionDetails(false);
          return;
        }
      }
      
      console.warn('⚠️ Session not found or incomplete, falling back to polling method');
      setLoadingSessionDetails(false);
    } catch (error) {
      console.error('❌ Error fetching session by ID:', error);
      setLoadingSessionDetails(false);
      // Don't retry - if direct fetch fails, user can see generic message
    }
  };

  // OLD: Polling method (fallback if session_id not in URL)
  const fetchSessionDetails = async (orderId, attempt = 0) => {
    try {
      console.log('Fetching session details for order:', orderId, 'attempt:', attempt);
      setLoadingSessionDetails(true);
      
      // Add delay based on attempt number
      // First attempt: wait longer to give backend time to verify payment and create session
      // Payment verification can take 2-5 seconds (signature verification, session creation)
      if (attempt === 0) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds
      } else if (attempt === 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds for second attempt
      }
      
      // Fetch sessions list to find the newly created session
      // This is the only way to get session details - no receipt endpoint used
      const cacheBuster = Date.now();
      const sessionsResponse = await clientApi.getSessions({ limit: 20, page: 1, _t: cacheBuster });
      
      if (sessionsResponse.success && sessionsResponse.data) {
        const sessions = sessionsResponse.data.sessions || sessionsResponse.data;
        const sessionsArray = Array.isArray(sessions) ? sessions : [];
        
        // Find the most recent session that was just created (within last 5 minutes)
        // Use a shorter time window to avoid picking old sessions
        const now = new Date();
        const recentSessions = sessionsArray
          .filter(s => {
            if (!s.created_at) return false;
            const sessionTime = new Date(s.created_at);
            const minutesAgo = (now - sessionTime) / (1000 * 60);
            // Only consider sessions created in the last 5 minutes (more strict)
            return minutesAgo < 5 && minutesAgo >= 0;
          })
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Most recent first
        
        console.log('Recent sessions found:', recentSessions.length, recentSessions.map(s => ({
          id: s.id,
          created_at: s.created_at,
          scheduled_date: s.scheduled_date,
          scheduled_time: s.scheduled_time
        })));
        
        const targetSession = recentSessions.length > 0 ? recentSessions[0] : null;
        
        if (targetSession && targetSession.scheduled_date && targetSession.scheduled_time) {
          let psychologistName = 'your therapist';
          if (targetSession.psychologist) {
            if (targetSession.psychologist.first_name && targetSession.psychologist.last_name) {
              psychologistName = `${targetSession.psychologist.first_name} ${targetSession.psychologist.last_name}`;
            } else if (targetSession.psychologist.first_name) {
              psychologistName = targetSession.psychologist.first_name;
            }
          } else if (targetSession.psychologist_name) {
            psychologistName = targetSession.psychologist_name;
          } else if (targetSession.psychologist_first_name && targetSession.psychologist_last_name) {
            psychologistName = `${targetSession.psychologist_first_name} ${targetSession.psychologist_last_name}`;
          }
          
          const timeValue = targetSession.scheduled_time;
          const timeOnly = typeof timeValue === 'string' 
            ? timeValue.split(' ')[0]
            : timeValue;
          
          console.log('Setting session details from sessions list:', { 
            psychologistName, 
            date: targetSession.scheduled_date, 
            time: timeOnly
          });
          
          setSessionDetails({
            psychologistName,
            date: targetSession.scheduled_date,
            time: timeOnly
          });
          setLoadingSessionDetails(false);
          return;
        }
      }
      
      // If not found and haven't exceeded max retries, retry after delay
      // Increase delay progressively to give backend more time
      const maxRetries = 10; // Increased retries to handle slower backend processing
      if (attempt < maxRetries) {
        // Progressive delay: 3s, 4s, 5s, 6s, etc.
        const delay = 3000 + (attempt * 1000);
        console.log(`Session details not found, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        setTimeout(() => {
          fetchSessionDetails(orderId, attempt + 1);
        }, delay);
      } else {
        console.log('Max retries reached for session details - session may still be processing');
        setLoadingSessionDetails(false);
        // Don't show error, just show generic message
      }
    } catch (error) {
      console.log('Could not fetch session details:', error.message, error);
      // Retry if we haven't exceeded max attempts
      const maxRetries = 10;
      if (attempt < maxRetries) {
        // Progressive delay: 3s, 4s, 5s, 6s, etc.
        const delay = 3000 + (attempt * 1000);
        console.log(`Error fetching session details, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        setTimeout(() => {
          fetchSessionDetails(orderId, attempt + 1);
        }, delay);
      } else {
        console.log('Max retries reached after errors - session may still be processing');
        setLoadingSessionDetails(false);
      }
    }
  };

  // Receipt download handled via email/WhatsApp; no manual download button on success page.

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    // Handle different time formats: HH:MM:SS or HH:MM
    let timeParts = timeString.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1] || '00';
    
    // Validate hours
    if (isNaN(hours) || hours < 0 || hours > 23) {
      console.error('Invalid time format:', timeString);
      return timeString; // Return original if invalid
    }
    
    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    const displayMinutes = minutes.padStart(2, '0');
    
    return `${displayHour}:${displayMinutes} ${ampm}`;
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center', 
        fontFamily: 'Arial, sans-serif',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#ef4444' }}>❌ Payment Error</h1>
        <p style={{ color: '#6b7280', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => router.push('/profile/sessions')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          View Sessions
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px 20px', 
      paddingTop: '80px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      // Hide content during animation to prevent footer flash
      opacity: showCenteredAnimation ? 0 : 1,
      visibility: showCenteredAnimation ? 'hidden' : 'visible',
      transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
      // Ensure page stays at top during animation
      position: 'relative',
      overflow: showCenteredAnimation ? 'hidden' : 'visible'
    }}>
      {/* Centered Animation Overlay - Shows immediately */}
      <AnimatePresence>
        {showCenteredAnimation && (
          <SlidingSuccessAnimation onComplete={() => setShowCenteredAnimation(false)} />
        )}
      </AnimatePresence>

      {/* Success Heading - Reduced size and proper margin */}
      <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '20px' }}>
        {!showCenteredAnimation && (
          <>
            <TopSuccessAnimation />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: isMobile ? 0.1 : 0.2, 
                duration: isMobile ? 0.3 : 0.4 
              }}
              style={{ 
                color: '#22c55e', 
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: '20px',
                lineHeight: '1.4',
                willChange: 'transform, opacity'
              }}
            >
              Payment Successful!
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: isMobile ? 0.2 : 0.4, 
                duration: isMobile ? 0.3 : 0.4 
              }}
              style={{ 
                fontSize: '16px', 
                color: '#6b7280', 
                marginBottom: '30px',
                willChange: 'transform, opacity'
              }}
            >
              Your session has been successfully scheduled.
            </motion.p>
          </>
        )}
      </div>
      
      {/* Two Column Layout: Transaction Details (Left) and Session Details (Right) */}
      {!showCenteredAnimation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: isMobile ? 0.3 : 0.6, 
            duration: isMobile ? 0.4 : 0.5 
          }}
          style={{ 
            marginTop: '80px',
            willChange: 'transform, opacity'
          }}
        >
        <div className="details-container">
        {/* Transaction Details - Left Column */}
      {paymentData && (
          <div className="transaction-details-column">
            <div style={{ textAlign: 'left', paddingLeft: '0' }}>
              <div style={{ 
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px',
                marginTop: '0',
                lineHeight: '1.4'
              }}>
                Transaction Details
              </div>
              <div style={{ 
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.8',
                marginBottom: '20px'
              }}>
                {paymentData.transactionId && (
                  <p style={{ margin: '6px 0' }}><strong style={{ color: '#374151' }}>Transaction ID:</strong> {paymentData.transactionId}</p>
                )}
                <p style={{ margin: '6px 0' }}><strong style={{ color: '#374151' }}>Order ID:</strong> {paymentData.orderId}</p>
                <p style={{ margin: '6px 0' }}><strong style={{ color: '#374151' }}>Payment ID:</strong> {paymentData.paymentId}</p>
                <p style={{ margin: '6px 0' }}><strong style={{ color: '#374151' }}>Status:</strong> <span style={{ color: '#22c55e', fontWeight: '500' }}>Confirmed</span></p>
              </div>
              
              {/* Receipt is sent automatically via email and WhatsApp; no manual download button. */}
            </div>
          </div>
        )}

        {/* Vertical Divider */}
        <div className="vertical-divider"></div>

        {/* Session Details - Right Column */}
        <div className="session-details-column" style={{ minHeight: '200px' }}>
          <div style={{
            textAlign: 'left',
            color: '#374151',
            width: '100%'
          }}>
            {loadingSessionDetails ? (
              <>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  marginTop: '0',
                  lineHeight: '1.4'
                }}>
                  Session Details
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  color: '#6b7280',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #e5e7eb',
                    borderTop: '2px solid #3f2e73',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }}></div>
                  <span>Creating your session..</span>
                </div>
              </>
            ) : sessionDetails ? (
              <>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  marginTop: '0',
                  lineHeight: '1.4'
                }}>
                  Session Details
                </div>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '16px',
                  color: '#374151'
                }}>
                  Thank you for booking a session. Your session has been scheduled with{' '}
                  <strong style={{ color: '#3f2e73' }}>{sessionDetails.psychologistName}</strong>.
                </p>
                
        <div style={{
                  backgroundColor: '#f9fafb',
          borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                  border: '1px solid #e5e7eb'
        }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: '#374151' }}>Session Date:</strong>{' '}
                    <span style={{ color: '#6b7280' }}>{formatDate(sessionDetails.date)}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#374151' }}>Session Time:</strong>{' '}
                    <span style={{ color: '#6b7280' }}>{formatTime(sessionDetails.time)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px',
                  marginTop: '0',
                  lineHeight: '1.4'
                }}>
                  Session Details
                </div>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '16px',
                  color: '#374151'
                }}>
                  Thank you for booking a session. Your session has been scheduled successfully.
                </p>
              </>
            )}
          </div>
        </div>
        </div>
        </motion.div>
      )}
      
      {/* Notification Text */}
      {!showCenteredAnimation && sessionDetails && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: isMobile ? 0.35 : 0.75, 
            duration: isMobile ? 0.4 : 0.5 
          }}
          style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5',
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '8px',
            willChange: 'transform, opacity'
          }}
        >
          The session details and receipt have been sent to your registered email and WhatsApp number.
        </motion.p>
      )}
      
      {/* Action Buttons */}
      {!showCenteredAnimation && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: isMobile ? 0.4 : 0.8, 
          duration: isMobile ? 0.4 : 0.5 
        }}
        style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '20px',
          willChange: 'transform, opacity'
        }}
      >
        <button
          onClick={() => router.push('/profile/sessions')}
          style={{
            backgroundColor: 'transparent',
            color: '#3f2e73',
            padding: '10px 24px',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: 'inset 0 0 0 2px #3f2e73',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3f2e73';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #3f2e73';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#3f2e73';
            e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #3f2e73';
          }}
        >
          View Sessions
        </button>
        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#3f2e73',
            color: 'white',
            padding: '10px 28px',
            border: 'none',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            transition: 'background-color 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d1733'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3f2e73'}
        >
          Go Home
        </button>
      </motion.div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .details-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .transaction-details-column,
        .session-details-column {
          width: 100%;
          display: block;
          visibility: visible;
        }
        
        .transaction-details-column {
          padding-left: 0;
        }
        
        .vertical-divider {
          display: none;
        }
        
        /* Tablet view: Center containers horizontally, keep text left-aligned */
        @media (min-width: 768px) and (max-width: 1199px) {
          .details-container {
            max-width: 600px;
            margin: 0 auto;
          }
          
          .transaction-details-column,
          .session-details-column {
            text-align: left;
          }
        }
        
        /* Desktop/Laptop only: Two column layout (tablets use mobile/stacked layout) */
        @media (min-width: 1200px) {
          .details-container {
            flex-direction: row;
            gap: 40px;
            align-items: flex-start;
            display: flex !important;
          }
          
          .transaction-details-column {
            flex: 1;
            max-width: 50%;
            padding-left: 0;
            width: auto;
            display: block !important;
            visibility: visible !important;
          }
          
          .vertical-divider {
            display: block;
            width: 2px;
            height: 100%;
            background-color: #3f2e73;
            border-radius: 2px;
            flex-shrink: 0;
            min-height: 200px;
          }
          
          .session-details-column {
            flex: 1;
            max-width: 50%;
            width: auto;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
