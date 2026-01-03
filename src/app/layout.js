import "./globals.css";
// Suspense removed - no longer needed without PageLoadingOverlay
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ConditionalProviders from "@/components/ConditionalProviders";
import ConditionalPadding from "@/components/ConditionalPadding";
import WhatsAppWidgetWrapper from "@/components/WhatsAppWidgetWrapper";
// REMOVED: PageLoadingOverlay - causes CLS on navigation
// Next.js loading.js handles route transitions automatically
import ClickBurst from "@/components/ClickBurst";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata = {
  title: {
    default: "India's Trusted Child Psychologist | Online Child Counseling",
    template: "%s | Little Care"
  },
  description:
    "Connect with experienced child psychologists for safe, supportive online child counseling. Help your child manage anxiety, behavior, or school stress from the comfort of home.",
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
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
        {/* Preconnect to critical third-party origins for better performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.youtube-nocookie.com" />
        {/* Explicit favicon links for Google search results - ensures favicon appears in SERP */}
        <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon.png" sizes="16x16" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* Font preloading to prevent CLS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load fonts - Varela Round loaded first as it's render-blocking, others can load async */}
        <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {/* Preload logo for instant loading screen display */}
        <link rel="preload" as="image" href="/mainlogo.webp" />
        {/* CRITICAL: Script to manage loader - runs only on client side to prevent hydration mismatch */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Only run on client side (not during SSR)
                if (typeof window === 'undefined') return;
                
                // CRITICAL: No fixed delays - hide immediately when DOM is ready
                // This prevents CLS by allowing content to render immediately
                function hideLoader() {
                  if (document.body) {
                    document.body.classList.add('loaded');
                  } else {
                    // Body not ready yet, try again on next tick
                    requestAnimationFrame(hideLoader);
                  }
                }
                
                // Hide loader as soon as DOM is interactive (not complete - too late)
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideLoader, { once: true });
                } else {
                  // Already interactive or complete - hide immediately
                  hideLoader();
                }
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
            /* CRITICAL: Loader is position:fixed overlay - NEVER affects layout flow */
            /* Content renders immediately for FCP/LCP metrics */
            body:not(.loaded) {
              overflow: hidden !important;
            }
            /* Prevent interaction during initial load, but allow rendering */
            body:not(.loaded) > *:not(#initial-loader) {
              pointer-events: none !important;
            }
            body.loaded > *:not(#initial-loader) {
              pointer-events: auto !important;
            }
            /* Prevent layout shifts during font loading */
            body {
              font-display: swap;
            }
            /* Reserve space for images to prevent CLS */
            img {
              max-width: 100%;
              height: auto;
            }
            img[width][height] {
              aspect-ratio: attr(width) / attr(height);
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
              transition: opacity 200ms ease-out !important;
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
              logo: "https://www.little.care/favicon.png",
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
      <body className="antialiased bg-gray-50" suppressHydrationWarning>
        {/* INSTANT - Server-rendered loader (appears at 0ms, no hydration needed) */}
        {/* Position:fixed overlay - NEVER affects layout flow, prevents CLS */}
        <div id="initial-loader">
          <div className="loading-logo"></div>
        </div>
        {/* REMOVED: Client-side PageLoadingOverlay - caused CLS on navigation */}
        {/* Next.js loading.js (app/loading.js) handles route transitions automatically */}
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
        {/* Google Analytics - Load after interactive to prevent forced reflows */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K7Z8F94Z80"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K7Z8F94Z80');
          `}
        </Script>
      </body>
    </html>
  );
}
