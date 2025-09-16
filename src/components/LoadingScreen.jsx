"use client";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    // Show loading screen only on initial load
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

  if (!isVisible) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontFamily: "Arial, Helvetica, sans-serif",
      overflow: "hidden",
      margin: 0,
      padding: 0
    }}>
      <div style={{
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          margin: 0,
          opacity: textOpacity,
          transition: "opacity 1s ease-in-out",
          textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          textAlign: "center"
        }}>
          Little Care
        </h1>

      </div>
      

    </div>
  );
}
