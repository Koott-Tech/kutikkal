/**
 * Events listing — static cards; detail pages under /events/...
 * Styling: Tailwind + semantic headings as role="heading" to avoid globals.css h1–h6 overrides.
 */
import Link from "next/link";
import Image from "next/image";
import LeadershipMembersShowcase from "@/components/LeadershipMembersShowcase";
import { Calendar, ChevronDown, Clock, MonitorPlay } from "lucide-react";
import Testimonials from "@/components/Testimonials";
import {
  WORKSHOP_TESTIMONIALS_PHOTOS,
  WORKSHOP_TESTIMONIALS_DESKTOP_GRID,
} from "@/data/workshopTestimonialsHomeStyle";
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

const PANELISTS = [
  {
    name: "Sreerag Babu",
    title: "Workshop panelist",
    image:
      "https://static.wixstatic.com/media/624142_016a00ca91fb416c9e3b5a3693aebfe0~mv2.webp/v1/fill/w_256,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state.webp",
  },
  {
    name: "Irene Cherian",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/irene-1761805889946.webp",
  },
  {
    name: "Lakshmi",
    title: "Workshop panelist",
    image:
      "https://static.wixstatic.com/media/624142_20fd35759ae94c32bc333c9ba016dc89~mv2.webp/v1/fill/w_256,h_300,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state.webp",
  },
  {
    name: "Shuhaima Katti",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/katti-1762803574350.webp",
  },
  {
    name: "Anjala",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/29ea19f6-feff-48e3-af67-4c451f8175f4.webp",
  },
  {
    name: "Ambili",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/57950d98-1d92-4b7f-990f-8a9b5825da8e.webp",
  },
  {
    name: "Shinjuna",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/8318404d-96eb-428c-b61e-5da72e683f40.webp",
  },
  {
    name: "Aswathy Sampath",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/8c586c80-a0d1-4fcf-96a4-faf7fdfcae11.webp",
  },
  {
    name: "Albin",
    title: "Workshop panelist",
    image:
      "https://static.wixstatic.com/media/624142_0c31eb1f7e7b4bf68b2b299457144aa5~mv2.png/v1/fill/w_256,h_300,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state.png",
  },
  {
    name: "Taniya",
    title: "Workshop panelist",
    image: "https://www.little.care/api/images/profile-pictures/thaniya-1761831177583.webp",
  },
];

export default function EventsPage() {
  const events = [
    {
      id: "summer-2026",
      category: "Family Workshop",
      title: "Little Care Summer Workshop 2026",
      description:
        "Interactive parent-child session focused on expressing emotions at home, communication tools, and practical weekly habits.",
      organizer: "Little Care Team",
      schedule: "Sat, 18 April 2026 at 11:00 AM IST",
      image: SUMMER_WORKSHOP_2026_HERO_IMAGE,
      detailsHref: "/events/little-care-summer-workshops-2026",
      ticketHref: "/events/little-care-summer-workshops-2026#register",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 80vh */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-b from-[#f8f6ff] to-white px-5 pt-20 sm:px-8 sm:pt-24 lg:px-12">
        <div className="mx-auto max-w-4xl text-center mt-12 sm:mt-16">
          <span className="inline-flex rounded-full border border-[#3f2e73]/20 bg-[#3f2e73]/10 px-5 py-1.5 text-sm font-semibold text-[#3f2e73]">
            Events
          </span>
          <div
            className="mt-6 text-4xl font-bold text-[#241a44] sm:text-5xl md:text-6xl"
            role="heading"
            aria-level={1}
          >
            Grow Your Network &amp; Skills with Our Events
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#5e5774] sm:text-lg">
            Join our workshops and family events designed to help parents and children learn, connect, and grow together.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="whitespace-nowrap rounded-full bg-[#3f2e73] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#342560] transition-colors"
          >
            All Events
          </button>
          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-[#3f2e73]/25 bg-white px-6 py-2.5 text-sm font-medium text-[#3f2e73] hover:bg-[#f4f1ff] transition-colors"
          >
            Nearest Events
          </button>
          <button
            type="button"
            className="whitespace-nowrap rounded-full border border-[#3f2e73]/25 bg-white px-6 py-2.5 text-sm font-medium text-[#3f2e73] hover:bg-[#f4f1ff] transition-colors"
          >
            Latest Event
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 pb-16 sm:px-8 lg:px-12">

        <div className="space-y-6">
          {events.slice(0, 3).map((event) => (
            <article
              key={event.id}
              className="rounded-3xl border border-[#3f2e73]/15 bg-white/95 p-3 shadow-[0_8px_30px_rgba(63,46,115,0.08)] backdrop-blur-[1px] sm:p-4 lg:p-5"
            >
              <div className="grid gap-4 md:grid-cols-[300px_1fr_auto] md:items-center md:gap-6">
                <Link href={event.detailsHref} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#3f2e73]/10 md:aspect-[5/4] cursor-pointer group">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    sizes="(min-width: 768px) 300px, 100vw"
                    priority
                  />
                </Link>

                <div className="min-w-0 px-1 md:pr-2">
                  <span className="inline-flex rounded-full border border-[#3f2e73]/20 bg-[#3f2e73]/10 px-3 py-1 text-xs font-semibold text-[#3f2e73]">
                    {event.category}
                  </span>
                  <div className="mt-3 text-2xl font-semibold text-[#241a44] sm:text-[30px] lg:text-[32px]">
                    {event.title}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-[#5e5774] sm:text-[15px]">
                    {event.description}
                  </p>
                  <div className="mt-7 space-y-1.5 text-sm text-[#514a68]">
                    <p>
                      <span className="font-semibold text-[#2f2358]">Organizer:</span> {event.organizer}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2f2358]">Date:</span> {event.schedule}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 px-1 md:w-[160px] md:px-0">
                  <Link
                    href={event.ticketHref}
                    className="inline-flex items-center justify-center rounded-full bg-[#3f2e73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#342560]"
                  >
                    Buy a ticket
                  </Link>
                  <Link
                    href={event.detailsHref}
                    className="inline-flex items-center justify-center rounded-full border border-[#3f2e73]/25 bg-white px-5 py-2.5 text-sm font-semibold text-[#3f2e73] transition-colors hover:bg-[#f4f1ff]"
                  >
                    See details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pt-12 pb-8 sm:pt-16 sm:pb-12">
          <section className="mx-auto max-w-5xl rounded-3xl border border-[#3f2e73]/15 bg-[#f4f1ff] px-6 py-8 text-center sm:px-8 sm:py-10">
            <span className="inline-flex rounded-full border border-[#3f2e73]/20 bg-[#3f2e73]/10 px-4 py-1 text-xs font-semibold text-[#3f2e73]">
              Our mission
            </span>
            <div
              className="mt-4 text-3xl font-semibold text-[#241a44] sm:text-4xl"
              role="heading"
              aria-level={2}
            >
              Building emotionally safer homes for every family
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[#5e5774] sm:text-base">
              At Little Care, we design practical workshops where parents and children learn together, understand
              emotions better, and build stronger day-to-day communication with confidence.
            </p>
          </section>
        </div>

        <section className="w-full" aria-labelledby="events-how-it-works-heading">
          <div
            id="events-how-it-works-heading"
            className="text-center text-2xl font-semibold text-[#241a44] sm:text-3xl"
            role="heading"
            aria-level={2}
          >
            How it works
          </div>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-[#5e5774] sm:text-base">
            Register for your preferred event, receive the joining details, and attend the live session with your family.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-[#3f2e73]/15 bg-white p-5 shadow-[0_8px_22px_rgba(63,46,115,0.07)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-semibold text-[#241a44]">Pick your event date</div>
              <p className="mt-2 text-sm text-[#5e5774]">
                Choose the event that suits your family and complete your booking in a few steps.
              </p>
            </article>

            <article className="rounded-2xl border border-[#3f2e73]/15 bg-white p-5 shadow-[0_8px_22px_rgba(63,46,115,0.07)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
                <MonitorPlay className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-semibold text-[#241a44]">Get joining details</div>
              <p className="mt-2 text-sm text-[#5e5774]">
                We share your event link, reminders, and session instructions on email and WhatsApp.
              </p>
            </article>

            <article className="rounded-2xl border border-[#3f2e73]/15 bg-white p-5 shadow-[0_8px_22px_rgba(63,46,115,0.07)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
                <Clock className="h-5 w-5" />
              </div>
              <div className="mt-4 text-lg font-semibold text-[#241a44]">Attend live session</div>
              <p className="mt-2 text-sm text-[#5e5774]">
                Join on time with your child and learn practical tools you can use right away at home.
              </p>
            </article>
          </div>
        </section>

        <section className="pt-12 sm:pt-16 lg:pt-20">
          <div
            className="text-center text-2xl font-semibold text-[#241a44] sm:text-3xl"
            role="heading"
            aria-level={2}
          >
            Our panelists
          </div>
          <p className="mt-2 text-center text-sm text-[#5e5774]">
            Facilitators and voices guiding our event sessions.
          </p>
        </section>

        <div className="w-full relative overflow-x-clip md:w-screen md:max-w-[100vw] md:left-1/2 md:-translate-x-1/2">
          <LeadershipMembersShowcase
            members={PANELISTS}
            showSectionHeader={false}
            useAccessibleNameHeading
            className="!px-0 w-full max-w-none"
            sectionClassName="w-full mt-8 md:mt-10 px-4 sm:px-6 md:px-0"
            layout="carousel"
            carouselFullBleed
            naturalMemberImageHeight
          />
        </div>

      </div>

      <div className="mt-16 sm:mt-20">
        <Testimonials
          photos={WORKSHOP_TESTIMONIALS_PHOTOS}
          desktopGrid={WORKSHOP_TESTIMONIALS_DESKTOP_GRID}
          eyebrowText="Testimonials"
          headingLine1="What families say about our workshops"
          headingLine2=""
          useAccessibleHeading
        />
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 pt-16 sm:space-y-14 sm:px-6 sm:pt-20 lg:px-8">
        <div className="py-16 sm:py-24">
          <section className="mx-auto max-w-4xl" aria-labelledby="events-faq-heading">
            <div
              id="events-faq-heading"
              className="text-center text-2xl font-semibold text-[#241a44] sm:text-3xl"
              role="heading"
              aria-level={2}
            >
              Frequently asked questions
            </div>

            <div className="mt-8">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-[#3f2e73]/15 px-1 py-5 text-left text-base font-medium text-[#2f2358]">
                  <span>Is this event online or offline?</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-1 pb-5 text-sm text-[#5e5774]">
                  Most sessions are hosted online. Final venue or join-link details are shared after booking.
                </p>
              </details>

              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-[#3f2e73]/15 px-1 py-5 text-left text-base font-medium text-[#2f2358]">
                  <span>Can parents and children join together?</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-1 pb-5 text-sm text-[#5e5774]">
                  Yes. Our events are designed for parent-child participation unless mentioned otherwise on the event card.
                </p>
              </details>

              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-[#3f2e73]/15 px-1 py-5 text-left text-base font-medium text-[#2f2358]">
                  <span>How will I receive reminders and updates?</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="px-1 pb-5 text-sm text-[#5e5774]">
                  You will receive confirmations and reminders by email and WhatsApp after successful registration.
                </p>
              </details>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
