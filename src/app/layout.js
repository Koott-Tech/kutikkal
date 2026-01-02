import "./globals.css";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ConditionalProviders from "@/components/ConditionalProviders";
import ConditionalPadding from "@/components/ConditionalPadding";
import WhatsAppWidgetWrapper from "@/components/WhatsAppWidgetWrapper";
import PageLoadingOverlay from "@/components/PageLoadingOverlay";
import ClickBurst from "@/components/ClickBurst";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: "India's Trusted Child Psychologist | Online Child Counseling",
  description:
    "Connect with experienced child psychologists for safe, supportive online child counseling. Help your child manage anxiety, behavior, or school stress from the comfort of home.",
  openGraph: {
    title: "India's Trusted Child Psychologist | Online Child Counseling",
    description:
      "Connect with experienced child psychologists for safe, supportive online child counseling. Help your child manage anxiety, behavior, or school stress from the comfort of home.",
    type: "website",
    siteName: "Little Care",
    url: "https://www.little.care",
    images: [
      {
        url: "https://www.little.care/hero.png",
        width: 1200,
        height: 630,
        alt: "Little Care child counseling and parent support hero image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "India's Trusted Child Psychologist | Online Child Counseling",
    description:
      "Connect with experienced child psychologists for safe, supportive online child counseling. Help your child manage anxiety, behavior, or school stress from the comfort of home.",
    images: ["https://www.little.care/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.little.care",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch and Preconnect for faster API connections (especially for international users) */}
        {process.env.NEXT_PUBLIC_BACKEND_URL && (
          <>
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api', '')} />
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api', '')} crossOrigin="anonymous" />
          </>
        )}
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-K7Z8F94Z80"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K7Z8F94Z80');
          `
        }} />
        {/* Favicon for browsers */}
        <link rel="icon" href="/Fav Icon 1.png" type="image/png" />
        <link rel="shortcut icon" href="/Fav Icon 1.png" type="image/png" />
        {/* Apple touch icon for iOS */}
        <link rel="apple-touch-icon" href="/Fav Icon 1.png" />
        {/* Additional favicon formats for better Google compatibility */}
        <link rel="icon" type="image/png" sizes="32x32" href="/Fav Icon 1.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/Fav Icon 1.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Preload logo for instant loading screen display */}
        <link rel="preload" as="image" href="/mainlogo.webp" />
        {/* CRITICAL: Script to manage loader - runs immediately in head */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Ensure loader stays visible initially
                // This runs BEFORE body content is parsed
                window.__LOADER_START_TIME__ = Date.now();
                window.__LOADER_MIN_TIME__ = 800; // Minimum 800ms display
                window.__DOM_READY__ = false;
                
                // Function to hide loader when ready
                window.__HIDE_LOADER__ = function() {
                  var elapsed = Date.now() - window.__LOADER_START_TIME__;
                  var remaining = Math.max(0, window.__LOADER_MIN_TIME__ - elapsed);
                  
                  setTimeout(function() {
                    if (document.body) {
                      document.body.classList.add('loaded');
                    } else {
                      // Body not ready yet, try again
                      setTimeout(window.__HIDE_LOADER__, 50);
                    }
                  }, remaining + 100);
                };
                
                // Mark DOM as ready
                function markReady() {
                  if (!window.__DOM_READY__) {
                    window.__DOM_READY__ = true;
                    window.__HIDE_LOADER__();
                  }
                }
                
                // Check if already ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', markReady);
                } else {
                  // Already interactive or complete
                  setTimeout(markReady, 100);
                }
                
                // Safety fallback - hide after 2 seconds max
                setTimeout(function() {
                  if (document.body && !document.body.classList.contains('loaded')) {
                    document.body.classList.add('loaded');
                  }
                }, 2000);
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for immediate mobile styling */
            @media (max-width: 767px) {
              .hero-title, .hero-description {
                text-align: center !important;
              }
              .hero-title {
                line-height: 0.95 !important;
              }
            }
            /* Instant loading screen - renders with HTML, no hydration needed */
            /* CRITICAL: Hide ALL body content until loader is ready to hide */
            body:not(.loaded) {
              overflow: hidden !important;
            }
            body:not(.loaded) > *:not(#initial-loader) {
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
            }
            body.loaded > *:not(#initial-loader) {
              opacity: 1 !important;
              visibility: visible !important;
              pointer-events: auto !important;
              transition: opacity 200ms ease-in-out;
            }
            /* Loader must be visible and on top */
            #initial-loader {
              position: fixed !important;
              inset: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background: #ffffff !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 999999 !important;
              font-family: Arial, Helvetica, sans-serif !important;
              overflow: hidden !important;
              margin: 0 !important;
              padding: 0 !important;
              transition: opacity 300ms ease-in-out !important;
              pointer-events: auto !important;
              opacity: 1 !important;
              visibility: visible !important;
            }
            body.loaded #initial-loader {
              opacity: 0 !important;
              pointer-events: none !important;
              visibility: hidden !important;
            }
            #initial-loader .loading-logo {
              width: 240px;
              height: 79px;
              margin: 0 auto;
              background-image: url('/mainlogo.webp');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              animation: pulseScale 2s ease-in-out infinite;
            }
            @keyframes pulseScale {
              0% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); opacity: 0.9; }
            }
            @media (max-width: 767px) {
              #initial-loader .loading-logo {
                width: 200px !important;
                height: 66px !important;
              }
            }
          `,
          }}
        />
        {/* Organization / MedicalBusiness structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              name: "Little Care",
              description:
                "Online child psychotherapy and counseling services for children and parents.",
              url: "https://www.little.care",
              logo: "https://www.little.care/Fav Icon 1.png",
              image: "https://www.little.care/hero.png",
              telephone: "+91 95390 07766",
              email: "hey@little.care",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
              medicalSpecialty: [
                "Child Psychology",
                "Child Counseling",
                "Parent Support",
              ],
              serviceType: "Online Therapy",
              areaServed: "Worldwide",
            }),
          }}
        />
      </head>
      <body className="antialiased bg-gray-50">
        {/* INSTANT - Server-rendered loader (appears at 0ms, no hydration needed) */}
        <div id="initial-loader">
          <div className="loading-logo"></div>
        </div>
        {/* Client-side loader for navigation transitions (only after hydration) */}
        <Suspense fallback={null}>
          <PageLoadingOverlay />
        </Suspense>
        <ClickBurst />
        <ErrorBoundary>
          <ConditionalProviders>
            <HeaderWrapper />
            <ConditionalPadding>
              {children}
            </ConditionalPadding>
            <FooterWrapper />
            <WhatsAppWidgetWrapper />
          </ConditionalProviders>
        </ErrorBoundary>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
