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
  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Checkmark Circle */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          duration: 0.6
        }}
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
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
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
                rotate: 0
              }}
              animate={{ 
                x: x, 
                y: y, 
                scale: [0, 1, 0.8, 0],
                opacity: [1, 1, 0.8, 0],
                rotate: 360
              }}
              transition={{
                delay: delay,
                duration: 0.8,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: color,
                borderRadius: '50%',
                zIndex: 1,
                boxShadow: `0 0 ${size}px ${color}`
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

  useEffect(() => {
    // After 1.2 seconds (checkmark animation completes), start moving to top
    const timer = setTimeout(() => {
      setIsMoving(true);
      // Fade out background immediately when moving starts
      setShowBackground(false);
      // After slide completes, notify parent
      setTimeout(() => {
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
              backdropFilter: 'blur(4px)',
              zIndex: 9998,
              pointerEvents: 'none'
            }}
          />
        )}
      </AnimatePresence>

      {/* Checkmark Animation */}
      <motion.div
        initial={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          zIndex: 9999
        }}
        animate={isMoving ? {
          position: 'fixed',
          top: '140px',
          left: '50%',
          x: '-50%',
          y: 0,
          scale: 0.8,
          zIndex: 9999
        } : {
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          scale: 1,
          zIndex: 9999
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1] // Custom easing for smooth slide
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
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

  // Wait for default loading screen to complete before showing success animation
  useEffect(() => {
    // The default loading screen shows for HIDE_DELAY (600ms) as defined in PageLoadingOverlay
    // Wait for it to complete, then start the success animation
    const timer = setTimeout(() => {
      setLoadingScreenComplete(true);
      setShowCenteredAnimation(true);
    }, 600); // Match HIDE_DELAY from PageLoadingOverlay

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Scroll to top on page load and prevent unwanted scrolling
  useEffect(() => {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Prevent scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Keep scroll position at top during initial load
    const preventScroll = () => {
      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };
    
    // Check scroll position periodically during initial load
    const scrollCheck = setInterval(preventScroll, 100);
    
    // Clear interval after content is loaded
    setTimeout(() => {
      clearInterval(scrollCheck);
    }, 2000);
    
    return () => {
      clearInterval(scrollCheck);
    };
  }, []);

  useEffect(() => {
    // Get URL parameters from Razorpay
    const razorpay_order_id = searchParams.get('razorpay_order_id');
    const razorpay_payment_id = searchParams.get('razorpay_payment_id');
    const razorpay_signature = searchParams.get('razorpay_signature');

    console.log('Payment parameters:', { razorpay_order_id, razorpay_payment_id });

    // Set payment data from URL parameters
    const payload = {
      orderId: razorpay_order_id || 'N/A',
      paymentId: razorpay_payment_id || 'N/A',
      status: 'success'
    };

    setPaymentData(payload);
    
    // Fetch session details if authenticated and order ID is available
    if (isAuthenticated() && razorpay_order_id && razorpay_order_id !== 'N/A') {
      fetchSessionDetails(razorpay_order_id);
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

  // Receipt fetching removed from success page.

  const fetchSessionDetails = async (orderId, attempt = 0) => {
    try {
      console.log('Fetching session details by order ID, attempt:', attempt);
      setLoadingSessionDetails(true);
      
      // Get receipt by order ID - this includes session details for the specific payment
      const receiptResponse = await clientApi.getReceiptByOrderId(orderId);
      console.log('Receipt response:', receiptResponse);
      
      if (receiptResponse.success && receiptResponse.data) {
        const receiptSession = receiptResponse.data.session;
        
        // Check if session details are included in receipt response
        if (receiptSession) {
          const session = receiptSession;
          
          // Extract psychologist name
          let psychologistName = 'your therapist';
          if (session.psychologist) {
            if (session.psychologist.first_name && session.psychologist.last_name) {
              psychologistName = `${session.psychologist.first_name} ${session.psychologist.last_name}`;
            }
          }
          
          console.log('Setting session details from receipt:', { 
            psychologistName, 
            date: session.scheduled_date, 
            time: session.scheduled_time 
          });
          
          if (session.scheduled_date && session.scheduled_time) {
            setSessionDetails({
              psychologistName,
              date: session.scheduled_date,
              time: session.scheduled_time
            });
            setLoadingSessionDetails(false);
            return;
          }
        }
        
        // If session not in receipt, fallback to getting sessions list
        console.log('Session not in receipt response, fetching from sessions list...');
        const sessionsResponse = await clientApi.getSessions({ limit: 10, page: 1 });
        
        if (sessionsResponse.success && sessionsResponse.data) {
          const sessions = sessionsResponse.data.sessions || sessionsResponse.data;
          const sessionsArray = Array.isArray(sessions) ? sessions : [];
          
          // Find session that matches this payment order ID by checking payment_id
          // We need to find the session that was created for this payment
          // Since we have the orderId, we can try to match by finding the most recent session
          // that was just created (within last few minutes)
          const now = new Date();
          const recentSessions = sessionsArray.filter(s => {
            if (!s.created_at) return false;
            const sessionTime = new Date(s.created_at);
            const minutesAgo = (now - sessionTime) / (1000 * 60);
            return minutesAgo < 10; // Sessions created in last 10 minutes
          });
          
          const targetSession = recentSessions.length > 0 ? recentSessions[0] : sessionsArray[0];
          
          if (targetSession) {
            let psychologistName = 'your therapist';
            if (targetSession.psychologist) {
              if (targetSession.psychologist.first_name && targetSession.psychologist.last_name) {
                psychologistName = `${targetSession.psychologist.first_name} ${targetSession.psychologist.last_name}`;
              }
            } else if (targetSession.psychologist_name) {
              psychologistName = targetSession.psychologist_name;
            } else if (targetSession.psychologist_first_name && targetSession.psychologist_last_name) {
              psychologistName = `${targetSession.psychologist_first_name} ${targetSession.psychologist_last_name}`;
            }
            
            if (targetSession.scheduled_date && targetSession.scheduled_time) {
              console.log('Setting session details from sessions list:', { 
                psychologistName, 
                date: targetSession.scheduled_date, 
                time: targetSession.scheduled_time 
              });
              setSessionDetails({
                psychologistName,
                date: targetSession.scheduled_date,
                time: targetSession.scheduled_time
              });
              setLoadingSessionDetails(false);
              return;
            }
          }
        }
      }
      
      // If not found and haven't exceeded max retries, retry after delay
      const maxRetries = 5;
      if (attempt < maxRetries) {
        const delay = 2000 + (attempt * 1000);
        console.log(`Session details not found, retrying in ${delay}ms...`);
        setTimeout(() => {
          fetchSessionDetails(orderId, attempt + 1);
        }, delay);
      } else {
        console.log('Max retries reached for session details');
        setLoadingSessionDetails(false);
      }
    } catch (error) {
      console.log('Could not fetch session details:', error.message, error);
      // Retry if we haven't exceeded max attempts
      const maxRetries = 5;
      if (attempt < maxRetries) {
        const delay = 2000 + (attempt * 1000);
        setTimeout(() => {
          fetchSessionDetails(orderId, attempt + 1);
        }, delay);
      } else {
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
    // Assuming time is in HH:MM format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
      minHeight: '100vh'
    }}>
      {/* Centered Animation Overlay */}
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
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{ 
                color: '#22c55e', 
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '12px',
                marginTop: '20px',
                lineHeight: '1.4'
              }}
            >
              Payment Successful!
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              style={{ fontSize: '16px', color: '#6b7280', marginBottom: '30px' }}
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
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ marginTop: '80px' }}
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
          transition={{ delay: 0.75, duration: 0.5 }}
          style={{
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: '1.5',
            textAlign: 'center',
            marginTop: '40px',
            marginBottom: '8px'
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
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '20px'
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
