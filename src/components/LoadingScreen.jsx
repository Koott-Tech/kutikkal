"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [textOpacity, setTextOpacity] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Show loading screen on initial load
    const timer = setTimeout(() => {
      setTextOpacity(1);
    }, 100);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Handle route changes
  useEffect(() => {
    if (pathname) {
      setIsVisible(true);
      setTextOpacity(0);

      const timer = setTimeout(() => {
        setTextOpacity(1);
      }, 100);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 1200);

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [pathname]);

  // Show loading screen on page reload
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsVisible(true);
      setTextOpacity(0);
    };

    const handleLoad = () => {
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontFamily: "Arial, Helvetica, sans-serif"
    }}>
      <div style={{
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "700",
          margin: 0,
          opacity: textOpacity,
          transition: "opacity 1s ease-in-out",
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
        }}>
          kuttikal
        </h1>

      </div>
      

    </div>
  );
}
