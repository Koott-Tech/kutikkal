import "./globals.css";
import { Suspense } from "react";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import ConditionalProviders from "@/components/ConditionalProviders";
import ConditionalPadding from "@/components/ConditionalPadding";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import PageLoadingOverlay from "@/components/PageLoadingOverlay";
import ClickBurst from "@/components/ClickBurst";

export const metadata = {
  title: "Little Care - Child Psychotherapy",
  description: "Your Partner in Child Counseling & Parent Support. Connect with a trusted child psychologist online for quick, gentle child counseling from home.",
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PBKE518Y0H"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PBKE518Y0H');
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
        <style dangerouslySetInnerHTML={{
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
          `
        }} />
      </head>
      <body className="antialiased bg-gray-50">
        <Suspense fallback={null}>
          <PageLoadingOverlay />
        </Suspense>
        <ClickBurst />
        <ConditionalProviders>
          <HeaderWrapper />
          <ConditionalPadding>
            {children}
          </ConditionalPadding>
          <FooterWrapper />
          <WhatsAppWidget />
        </ConditionalProviders>
      </body>
    </html>
  );
}
