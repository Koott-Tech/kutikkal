import WorkshopSummer2026Client from "@/components/events/WorkshopSummer2026Client";

export const metadata = {
  title: "Little Care Summer Workshops 2026 | Events",
  description:
    "Interactive parent–child workshop on expressing emotions at home — register for Little Care Summer Workshops 2026.",
  openGraph: {
    title: "Little Care Summer Workshops 2026",
    description:
      "Spaces where children and parents learn, feel, and grow together. Register for the online session.",
    type: "website",
    url: "https://www.little.care/events/little-care-summer-workshops-2026",
    siteName: "Little Care",
  },
  alternates: {
    canonical: "https://www.little.care/events/little-care-summer-workshops-2026",
  },
};

export default function LittleCareSummerWorkshops2026Page() {
  return <WorkshopSummer2026Client />;
}
