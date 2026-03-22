import WorkshopSummer2026Client from "@/components/events/WorkshopSummer2026Client";

const title = "Little Care Summer Workshops 2026 | Expressing Big Emotions at Home";
const description =
  "Free parent–child online workshop (April 18, 2026): learn to understand and express emotions together. Google Meet, 1 hour IST. Register for Little Care Summer Workshops 2026.";

export const metadata = {
  title,
  description,
  keywords: [
    "Little Care",
    "summer workshops 2026",
    "parent child workshop",
    "emotional intelligence children",
    "online family workshop India",
    "Google Meet workshop",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://www.little.care/events/little-care-summer-workshops-2026",
    siteName: "Little Care",
    images: [
      {
        url: "https://www.little.care/events/summer-workshop-hero.png",
        width: 1200,
        height: 630,
        alt: "Little Care Summer Workshops — families learning together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.little.care/events/summer-workshop-hero.png"],
  },
  alternates: {
    canonical: "https://www.little.care/events/little-care-summer-workshops-2026",
  },
};

export default function LittleCareSummerWorkshops2026Page() {
  return <WorkshopSummer2026Client />;
}
