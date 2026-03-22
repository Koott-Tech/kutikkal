"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/Testimonials";
import {
  WORKSHOP_TESTIMONIALS_PHOTOS,
  WORKSHOP_TESTIMONIALS_DESKTOP_GRID,
} from "@/data/workshopTestimonialsHomeStyle";
import LeadershipMembersShowcase from "@/components/LeadershipMembersShowcase";
import {
  Calendar,
  Clock,
  MonitorPlay,
  Heart,
  Users,
  ArrowRight,
  Loader2,
  MessageCircle,
  LineChart,
  Layers,
  Gift,
  IndianRupee,
} from "lucide-react";
import { SUMMER_WORKSHOP_2026_HERO_IMAGE } from "@/data/summerWorkshop2026Assets";

const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+94", label: "Sri Lanka (+94)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+92", label: "Pakistan (+92)" },
];

/** Same card layout as About → Leadership; optional `image` per person (URLs from content team). */
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
    image:
      "https://www.little.care/api/images/profile-pictures/irene-1761805889946.webp",
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
    image:
      "https://www.little.care/api/images/profile-pictures/29ea19f6-feff-48e3-af67-4c451f8175f4.webp",
  },
  {
    name: "Ambili",
    title: "Workshop panelist",
    image:
      "https://www.little.care/api/images/profile-pictures/57950d98-1d92-4b7f-990f-8a9b5825da8e.webp",
  },
  {
    name: "Shinjuna",
    title: "Workshop panelist",
    image:
      "https://www.little.care/api/images/profile-pictures/8318404d-96eb-428c-b61e-5da72e683f40.webp",
  },
  {
    name: "Aswathy Sampath",
    title: "Workshop panelist",
    image:
      "https://www.little.care/api/images/profile-pictures/8c586c80-a0d1-4fcf-96a4-faf7fdfcae11.webp",
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
    image:
      "https://www.little.care/api/images/profile-pictures/thaniya-1761831177583.webp",
  },
];

export default function WorkshopSummer2026Client() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const scrollToSchedule = useCallback((e) => {
    e.preventDefault();
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToRegister = useCallback((e) => {
    e.preventDefault();
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus("loading");
      setMessage("");
      try {
        const res = await fetch("/api/events/workshop-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            countryCode,
            phone,
            eventSlug: "little-care-summer-workshops-2026",
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          setStatus("error");
          setMessage(data.error || "Could not submit. Please try again.");
          return;
        }
        setStatus("success");
        setMessage(data.message || "Thank you!");
        setFullName("");
        setEmail("");
        setPhone("");
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    },
    [fullName, email, countryCode, phone]
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — full viewport height, split layout, image + floating form */}
      <section className="relative h-[100dvh] min-h-[100dvh] overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
        <Image
          src={SUMMER_WORKSHOP_2026_HERO_IMAGE}
          alt="Children and family learning together at home — Little Care Summer Workshops"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/40 md:from-black/65 md:via-black/45 md:to-black/25" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-start px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 md:pt-44 lg:pt-48 xl:pt-52 pb-10 sm:pb-12 lg:pb-14">
          <div className="grid min-h-0 flex-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                Little Care Summer Workshops 2026
              </p>
              <div
                className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[1.1] tracking-tight font-sans"
                role="heading"
                aria-level={1}
              >
                Not just workshops — spaces where children and parents learn, feel, and grow together.
              </div>
              <p className="mt-5 text-base sm:text-lg text-white/90 leading-relaxed">
                Join our first interactive session on expressing emotions at home. Free for this edition; register to
                save your spot.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#schedule"
                  onClick={scrollToSchedule}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#3f2e73] shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Schedule
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href="/events"
                  className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  All events
                </Link>
              </div>
            </div>

            <div
              id="register"
              className="scroll-mt-24 sm:scroll-mt-28 lg:justify-self-end w-full max-w-md lg:max-w-none"
            >
              <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-black/5">
                <div
                  className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug font-sans"
                  role="heading"
                  aria-level={2}
                >
                  Reserve your spot — Expressing Big Emotions at Home
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-gray-800 uppercase tracking-wide">
                      Full name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#3f2e73]/20 focus:border-[#3f2e73] focus:ring-2"
                      placeholder="As on your email / phone"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-800 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#3f2e73]/20 focus:border-[#3f2e73] focus:ring-2"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-800 uppercase tracking-wide">
                      WhatsApp number
                    </span>
                    <div className="mt-1.5 flex gap-2">
                      <select
                        name="countryCode"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-[min(44%,200px)] shrink-0 rounded-lg border border-gray-200 bg-white px-2 py-2.5 text-sm text-gray-900 outline-none focus:border-[#3f2e73] focus:ring-2 ring-[#3f2e73]/20"
                        aria-label="Country code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
                        className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none ring-[#3f2e73]/20 focus:border-[#3f2e73] focus:ring-2"
                        placeholder="WhatsApp number (10 digits)"
                      />
                    </div>
                  </div>

                  {message && (
                    <p
                      className={`text-sm ${status === "success" ? "text-green-700" : "text-red-600"}`}
                      role="status"
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3f2e73] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#342560] disabled:opacity-60 transition-colors"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      "Submit registration"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content sections — CMS-like grids */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-16 sm:space-y-20">
        <section className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#3f2e73]/10 px-3 py-1 text-xs font-semibold text-[#3f2e73]">
              <Heart className="h-3.5 w-3.5" />
              Our mission
            </div>
            <div
              className="mt-4 text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight font-sans"
              role="heading"
              aria-level={2}
            >
              LittleCare
            </div>
            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              At LittleCare, we create safe and engaging spaces where families can build emotional awareness, improve
              communication, and strengthen their connection. Because when families understand each other better,
              children feel more confident, secure, and heard.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 aspect-[4/3] lg:aspect-auto lg:min-h-[280px]">
            <Image
              src="/TESTIMONIALS 2.webp"
              alt="Parent and child spending time together"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </section>

        {/* Rula-style: centered headline, 4 soft cards, purple icons, pill CTA */}
        <section className="w-full py-2 sm:py-4" aria-labelledby="why-it-matters-heading">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f2e73]">Why it matters</p>
            <div
              id="why-it-matters-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 font-sans leading-tight"
              role="heading"
              aria-level={2}
            >
              When families understand feelings, everyone grows together
            </div>
            <p className="mt-4 text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Many struggles at home start from emotions that are hard to name, hear, or say out loud. This hour is built
              to change that—gently and together.
            </p>
          </div>

          {/* Wider than page column (max-w-6xl) so each card has more horizontal room */}
          <div className="relative left-1/2 right-auto mt-10 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip px-4 sm:px-6 lg:px-10">
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
              {[
                {
                  icon: Clock,
                  title: "Timely skills",
                  body: "In one focused hour, you’ll practice tools you can use the same week—not someday when things calm down.",
                },
                {
                  icon: LineChart,
                  title: "Visible progress",
                  body: "Games and role-plays help you see what’s working: clearer words, softer reactions, and more trust.",
                },
                {
                  icon: MessageCircle,
                  title: "Integrated care",
                  body: "Parents and children learn the same language, so support doesn’t stop when the call ends.",
                },
                {
                  icon: Layers,
                  title: "No barrier to start",
                  body: "This session is free. Show up as you are—we meet you where your family is today.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="min-w-0 rounded-2xl bg-[#F2F2F2] p-7 text-left transition-shadow hover:shadow-md sm:p-8"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center text-[#3f2e73]" aria-hidden>
                    <Icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <div className="text-base font-semibold text-gray-900 font-sans" role="heading" aria-level={3}>
                    {title}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center px-4">
            <a
              href="#register"
              className="inline-flex items-center rounded-full bg-[#3f2e73] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#342560] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f2e73] focus-visible:ring-offset-2"
            >
              Learn more
            </a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#3f2e73]/20 bg-[#3f2e73]/[0.04] p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#3f2e73]">
            <Users className="h-5 w-5" />
            <div className="text-lg font-semibold text-gray-900 font-sans" role="heading" aria-level={2}>
              Who can join?
            </div>
          </div>
          <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
            Parents with their children (best suited for ages <strong>9–14 years</strong>) who wish to build a more
            understanding and emotionally connected home.
          </p>
        </section>

        <section>
          <div
            className="text-xl sm:text-2xl font-semibold text-gray-900 font-sans"
            role="heading"
            aria-level={2}
          >
            Our panelists
          </div>
          <p className="mt-2 text-sm text-gray-600">Facilitators and voices guiding this summer series.</p>
        </section>

        {/* Full viewport width — same breakout pattern as homepage testimonials */}
        <div className="w-screen max-w-[100vw] relative left-1/2 -translate-x-1/2 overflow-x-clip">
          <LeadershipMembersShowcase
            members={PANELISTS}
            showSectionHeader={false}
            useAccessibleNameHeading
            className="!px-0 w-full max-w-none"
            sectionClassName="w-full mt-8 md:mt-10"
            layout="carousel"
            carouselFullBleed
            naturalMemberImageHeight
          />
        </div>

        <section
          id="schedule"
          className="w-full scroll-mt-24 sm:scroll-mt-28"
          aria-labelledby="how-it-works-heading"
        >
          <div
            id="how-it-works-heading"
            className="text-xl sm:text-2xl font-semibold text-gray-900 font-sans"
            role="heading"
            aria-level={2}
          >
            How it works
          </div>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 leading-relaxed">
            One live session online—here&apos;s when, how long, and how you&apos;ll join. Add it to your calendar and show
            up with your child.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8 lg:items-stretch">
            {/* Schedule spotlight — date & time are the hero facts */}
            <div className="relative overflow-hidden rounded-3xl border border-[#3f2e73]/15 bg-gradient-to-br from-[#3f2e73]/12 via-[#f4f2fa] to-white p-8 text-gray-900 shadow-sm lg:col-span-7 lg:p-10">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3f2e73]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-[#3f2e73]/5 blur-2xl" />
              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3f2e73]/80">Session date</p>
                  <p className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl">
                    April 18
                  </p>
                  <p className="mt-2 text-lg font-medium text-gray-600">2026 · Saturday</p>
                </div>
                <div className="rounded-2xl bg-[#3f2e73]/10 px-4 py-3 text-[#3f2e73]">
                  <Calendar className="h-8 w-8" aria-hidden />
                </div>
              </div>
              <div className="relative mt-10 grid gap-6 border-t border-[#3f2e73]/10 pt-8 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4 shrink-0 text-[#3f2e73]" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider">Time (IST)</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
                    11:00 AM – 12:00 PM
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="h-4 w-4 shrink-0 text-[#3f2e73]" aria-hidden />
                    <span className="text-xs font-semibold uppercase tracking-wider">Duration</span>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-gray-900 sm:text-xl">1 hour</p>
                  <p className="mt-1 text-sm text-gray-600">Interactive · parent &amp; child together</p>
                </div>
              </div>
            </div>

            {/* How you join — explains the online piece */}
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-gray-50/90 p-6 shadow-sm sm:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
                  <MonitorPlay className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </div>
                <div
                  className="mt-5 text-lg font-semibold text-gray-900 font-sans"
                  role="heading"
                  aria-level={3}
                >
                  Join on Google Meet
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  This workshop runs <strong className="font-medium text-gray-800">online only</strong>. After you
                  register, we&apos;ll email you the Meet link and reminders—no apps to install beyond your browser.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-gray-700">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f2e73]" aria-hidden />
                    Stable internet and a quiet corner work best for you and your child.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3f2e73]" aria-hidden />
                    Same link for both parent and child—join from one device or two.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-3xl border border-gray-200/90 bg-white shadow-[0_2px_24px_-4px_rgba(15,23,42,0.08)]"
          aria-labelledby="special-note-heading"
        >
          <div
            className="h-1 w-full bg-gradient-to-r from-[#3f2e73] via-[#5c4a94] to-[#3f2e73]"
            aria-hidden
          />
          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-12 lg:gap-12 lg:p-12">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                <Gift className="h-3.5 w-3.5 text-emerald-700" aria-hidden />
                Free · this session
              </div>
              <div
                id="special-note-heading"
                className="mt-5 text-2xl font-semibold tracking-tight text-gray-900 font-sans sm:text-[1.65rem]"
                role="heading"
                aria-level={2}
              >
                Special note
              </div>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                This workshop is <span className="font-semibold text-gray-900">free to attend</span>. We want as many
                families as possible to try a parent–child session with no upfront cost.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-7 lg:justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Pricing snapshot</p>
              <div className="space-y-3">
                <div className="flex flex-col justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-100">
                      <IndianRupee className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Future sessions</p>
                      <p className="text-xs text-gray-500">Standard rate · 1 hour</p>
                    </div>
                  </div>
                  <p className="text-xl font-semibold tabular-nums text-gray-900 sm:text-right">
                    ₹479
                    <span className="text-sm font-normal text-gray-500"> /session</span>
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#3f2e73]/20 bg-gradient-to-br from-[#3f2e73]/[0.06] to-white px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3f2e73]/10 text-[#3f2e73]">
                      <IndianRupee className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Early bird</p>
                      <p className="text-xs text-gray-600">For select upcoming paid workshops</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xl font-semibold tabular-nums text-[#3f2e73]">
                      ₹199
                      <span className="text-sm font-normal text-[#3f2e73]/70"> /session</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-600">Register before Apr 10, 2026 · details by email</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center rounded-2xl bg-gradient-to-b from-[#3f2e73] to-[#2a1f52] px-6 py-12 sm:py-14 text-white">
          <div
            className="text-2xl sm:text-3xl font-semibold font-sans"
            role="heading"
            aria-level={2}
          >
            Ready to join?
          </div>
          <p className="mt-3 mx-auto max-w-xl text-sm sm:text-base text-white/90 leading-relaxed">
            Take the first step towards a more understanding and emotionally safe home.
          </p>
          <a
            href="#register"
            onClick={scrollToRegister}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#3f2e73] shadow-lg hover:bg-gray-100 transition-colors"
          >
            Register
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>
      </div>

      {/* Full-bleed like homepage — not inside max-w-6xl / horizontal padding */}
      <Testimonials
        photos={WORKSHOP_TESTIMONIALS_PHOTOS}
        desktopGrid={WORKSHOP_TESTIMONIALS_DESKTOP_GRID}
        eyebrowText="Testimonials"
        headingLine1="What families say about our workshops"
        headingLine2=""
        useAccessibleHeading
      />
    </div>
  );
}
