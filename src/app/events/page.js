/**
 * Events listing — static cards; detail pages under /events/...
 * Styling: Tailwind + semantic headings as role="heading" to avoid globals.css h1–h6 overrides.
 */
import Link from "next/link";
import Image from "next/image";
import { SUMMER_WORKSHOP_2026_HERO_IMAGE } from "@/data/summerWorkshop2026Assets";

export const metadata = {
  title: "Events",
  description:
    "Little Care workshops and family events — parent–child sessions on emotions, communication, and growing together.",
  openGraph: {
    title: "Events | Little Care",
    description:
      "Join Little Care workshops for parents and children — safe spaces to learn, feel, and grow together.",
    type: "website",
    url: "https://www.little.care/events",
    siteName: "Little Care",
  },
  alternates: {
    canonical: "https://www.little.care/events",
  },
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div
          className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight font-sans"
          role="heading"
          aria-level={1}
        >
          Events
        </div>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 leading-relaxed">
          Workshops and live sessions for families. Browse what&apos;s on and register for upcoming dates.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Featured event — image card; title + date at bottom; hover dark overlay */}
          <article>
            <Link
              href="/events/little-care-summer-workshops-2026"
              className="group relative block w-full overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f2e73] focus-visible:ring-offset-2 aspect-[4/3] sm:aspect-[16/10]"
            >
              <Image
                src={SUMMER_WORKSHOP_2026_HERO_IMAGE}
                alt="Little Care Summer Workshops 2026 — parent and child workshop"
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(min-width: 640px) 50vw, 100vw"
                priority
              />
              <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3f2e73] shadow-sm">
                Featured
              </span>
              {/* Base gradient for legibility */}
              <div
                className="absolute inset-0 z-[1] bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                aria-hidden
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 z-[2] bg-black/0 transition-colors duration-300 group-hover:bg-black/50"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                <time
                  className="text-[11px] font-medium text-white/85 transition-colors duration-300 group-hover:text-white sm:text-xs"
                  dateTime="2026-04-18"
                >
                  April 18, 2026 · Online
                </time>
                <div
                  className="mt-1.5 text-base font-semibold leading-snug text-white drop-shadow-md transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_2px_12px_rgba(255,255,255,0.35)] sm:text-lg font-sans"
                  role="heading"
                  aria-level={2}
                >
                  Little Care Summer Workshops 2026
                </div>
              </div>
            </Link>
          </article>

          {/* Placeholder — no image; heading only */}
          <article className="flex aspect-[4/3] flex-col justify-end rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100/90 p-5 sm:aspect-[16/10] sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">More soon</div>
            <div
              className="mt-2 text-lg font-semibold text-gray-900 font-sans"
              role="heading"
              aria-level={2}
            >
              More workshops coming
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
