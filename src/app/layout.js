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
  description:
    "Your Partner in Child Counseling & Parent Support. Connect with a trusted child psychologist online for quick, gentle child counseling from home.",
  openGraph: {
    title: "Little Care - Child Psychotherapy",
    description:
      "Your Partner in Child Counseling & Parent Support. Connect with a trusted child psychologist online for quick, gentle child counseling from home.",
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
    title: "Little Care - Child Psychotherapy",
    description:
      "Your Partner in Child Counseling & Parent Support. Connect with a trusted child psychologist online for quick, gentle child counseling from home.",
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
