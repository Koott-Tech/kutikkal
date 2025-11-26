"use client";

export default function LoadingScreen({ message = "" }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#111827",
        }}
      >
        <div
          className="loading-logo"
          style={{
            width: "240px",
            height: "79px",
            margin: "0 auto",
            backgroundImage: "url('/mainlogo.webp')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            animation: "pulseScale 2s ease-in-out infinite",
          }}
        />
        {message ? (
          <p
            style={{
              marginTop: "0.5rem",
              fontSize: "1rem",
              color: "#4b5563",
              letterSpacing: "0.05em",
            }}
          >
            {message}
          </p>
        ) : null}
      </div>
      <style>
        {`
          @keyframes pulseScale {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
          }
          @media (max-width: 767px) {
            .loading-logo {
              width: 200px !important;
              height: 66px !important;
            }
          }
        `}
      </style>
    </div>
  );
}
