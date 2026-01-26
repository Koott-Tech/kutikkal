import { Metadata } from 'next';
import React from 'react';

// Default metadata for therapist profile page
// Note: Dynamic metadata based on ?doctor= query param will be handled client-side
// since Next.js layouts don't have access to searchParams
export const metadata: Metadata = {
  title: "Child Psychologist Profile | Little Care",
  description:
    "View details of a Little Care child psychologist, including experience, specialization, and available online counseling slots.",
  openGraph: {
    title: "Child Psychologist Profile | Little Care",
    description:
      "View details of a Little Care child psychologist, including experience, specialization, and available online counseling slots.",
    type: "profile",
    url: "https://www.little.care/therapist-profile",
    images: [
      {
        url: "https://www.little.care/favicon.png",
        width: 1200,
        height: 630,
        alt: "Little Care logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Child Psychologist Profile | Little Care",
    description:
      "View details of a Little Care child psychologist, including experience, specialization, and available online counseling slots.",
    images: ["https://www.little.care/favicon.png"],
  },
  alternates: {
    canonical: "https://www.little.care/therapist-profile",
  },
};

export default function TherapistProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
