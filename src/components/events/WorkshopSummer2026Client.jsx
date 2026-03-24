"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Heart,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  LineChart,
  Layers,
  Gift,
  IndianRupee,
} from "lucide-react";
import { SUMMER_WORKSHOP_2026_HERO_IMAGE } from "@/data/summerWorkshop2026Assets";
import Reviews from "@/components/Reviews";

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

const EVENT_DUMMY_REVIEWS = [
  {
    author: "Aparna",
    text: "The session gave us simple steps we could apply the same day. My child opened up more than usual after the workshop.",
    avatarUrl: "/testimonialgirl.png",
  },
  {
    author: "Nikhil",
    text: "Very practical and easy to follow. We now have a calm routine for talking about big emotions at home.",
    avatarUrl: "/testimonial5.PNG",
  },
  {
    author: "Farah",
    text: "Loved the parent-child activities. It felt supportive, clear, and realistic for everyday family life.",
    avatarUrl: "/TESTIMONIALS 4.webp",
  },
];

const EVENT_SPEAKERS = [
  {
    name: "Irene Cherian",
    designation: "Child Psychologist",
    experience: "8+ years experience",
    image: "https://www.little.care/api/images/profile-pictures/irene-1761805889946.webp",
    details:
      "Focuses on child emotional wellbeing, parent guidance, and practical communication tools for everyday family life.",
    languages: "English, Malayalam, Hindi",
    focus: "Emotional regulation, parent-child communication, anxiety support",
    style: "Warm, structured, and activity-based",
  },
  {
    name: "Shuhaima Katti",
    designation: "Behavior Therapist",
    experience: "6+ years experience",
    image: "https://www.little.care/api/images/profile-pictures/katti-1762803574350.webp",
    details:
      "Works with families on behavior support strategies, emotional regulation routines, and consistent home follow-through.",
    languages: "English, Malayalam, Tamil",
    focus: "Behavior plans, calming routines, home consistency",
    style: "Practical, child-friendly, and collaborative",
  },
  {
    name: "Aswathy Sampath",
    designation: "Special Educator",
    experience: "7+ years experience",
    image: "https://www.little.care/api/images/profile-pictures/8c586c80-a0d1-4fcf-96a4-faf7fdfcae11.webp",
    details:
      "Helps parents understand learning differences and build supportive, child-friendly practices at home and school.",
    languages: "English, Malayalam",
    focus: "Learning support, confidence building, school-home bridge",
    style: "Inclusive, adaptive, and strengths-focused",
  },
];

export default function WorkshopSummer2026Client() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [speakerIndex, setSpeakerIndex] = useState(0);
  const [speakerPhase, setSpeakerPhase] = useState("idle");
  const [speakerDirection, setSpeakerDirection] = useState(1);

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

  const activeSpeaker = EVENT_SPEAKERS[speakerIndex];

  const changeSpeaker = useCallback((nextIndex, direction = 1) => {
    if (nextIndex === speakerIndex) return;
    setSpeakerDirection(direction);
    setSpeakerPhase("out");
    setTimeout(() => {
      setSpeakerIndex(nextIndex);
      setSpeakerPhase("in");
      setTimeout(() => setSpeakerPhase("idle"), 20);
    }, 220);
  }, [speakerIndex]);

  const goPrevSpeaker = () => {
    const next = (speakerIndex - 1 + EVENT_SPEAKERS.length) % EVENT_SPEAKERS.length;
    changeSpeaker(next, -1);
  };

  const goNextSpeaker = () => {
    const next = (speakerIndex + 1) % EVENT_SPEAKERS.length;
    changeSpeaker(next, 1);
  };

  useEffect(() => {
    const autoTimer = setInterval(() => {
      const next = (speakerIndex + 1) % EVENT_SPEAKERS.length;
      changeSpeaker(next);
    }, 6000);

    return () => clearInterval(autoTimer);
  }, [speakerIndex, changeSpeaker]);

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
              <p className="text-xs font-semibold uppercase text-white/80">
                Little Care Summer Workshops 2026
              </p>
              <div
                className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-sans"
                role="heading"
                aria-level={1}
              >
                Not just workshops — spaces where children and parents learn, feel, and grow together.
              </div>
              <p className="mt-5 text-base sm:text-lg text-white/90">
                Join our first interactive session on expressing emotions at home. Free for this edition; register to
                save your spot.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#register"
                  onClick={scrollToRegister}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#3f2e73] shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Register
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
                  className="text-lg sm:text-xl font-semibold text-gray-900 font-sans"
                  role="heading"
                  aria-level={2}
                >
                  Reserve your spot — Expressing Big Emotions at Home
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-gray-800 uppercase">
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
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-800 uppercase">
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
                    <span className="block text-xs font-semibold text-gray-800 uppercase">
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 space-y-28 sm:space-y-32 lg:space-y-36">
        <section
          className="relative overflow-hidden rounded-3xl border border-[#3f2e73]/20 bg-gradient-to-br from-[#f8f5ff] via-white to-[#eef6ff] p-6 sm:p-8"
          aria-labelledby="what-is-this-heading"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#3f2e73]/10 blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-[#7b68b8]/10 blur-xl" aria-hidden />

          <div className="relative">
            <p className="inline-flex rounded-full border border-[#3f2e73]/20 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase text-[#3f2e73]">
              Workshop Format
            </p>
            <div
              id="what-is-this-heading"
              className="mt-3 text-2xl sm:text-3xl font-semibold text-gray-900 font-sans"
              role="heading"
              aria-level={2}
            >
              What is this?
            </div>
            <p className="mt-4 max-w-3xl text-sm sm:text-base text-gray-700">
              This is a 1-hour interactive online workshop designed for parents and children to participate together.
              It is not a lecture; it is a practical space where families engage, share, and learn through games,
              role-plays, and guided activities.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { icon: LineChart, text: "Understand what emotions really are and why they can feel intense." },
                { icon: MessageCircle, text: "Learn how to express feelings without hurting each other." },
                { icon: Clock, text: "Explore simple ways to improve communication at home." },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3f2e73]/10 text-[#3f2e73]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="event-speakers-heading">
          <div className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase text-[#3f2e73]">Meet the speakers</p>
            <div
              id="event-speakers-heading"
              className="mt-3 text-2xl sm:text-3xl font-semibold text-gray-900 font-sans"
              role="heading"
              aria-level={2}
            >
              Panelists for this session
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="text-xs font-medium text-[#3f2e73]">
              {speakerIndex + 1} / {EVENT_SPEAKERS.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevSpeaker}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3f2e73]/20 text-[#3f2e73] hover:bg-[#f4f1ff] transition-colors"
                aria-label="Previous speaker"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNextSpeaker}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#3f2e73]/20 text-[#3f2e73] hover:bg-[#f4f1ff] transition-colors"
                aria-label="Next speaker"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <article
            className={`grid gap-10 lg:grid-cols-2 lg:gap-14 items-start lg:items-center transition-all duration-500 ease-out ${
              speakerPhase === "out"
                ? speakerDirection === 1
                  ? "opacity-0 -translate-x-6"
                  : "opacity-0 translate-x-6"
                : speakerPhase === "in"
                  ? speakerDirection === 1
                    ? "opacity-0 translate-x-6"
                    : "opacity-0 -translate-x-6"
                  : "opacity-100 translate-x-0"
            }`}
          >
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-[#241a44] font-sans">{activeSpeaker.name}</div>
              <p className="mt-2 text-sm font-medium text-[#3f2e73]">
                {activeSpeaker.designation} · {activeSpeaker.experience}
              </p>
              <p className="mt-4 text-sm sm:text-base text-gray-600">{activeSpeaker.details}</p>
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-gray-700">
                <p><span className="font-semibold text-[#2a1f52]">Languages:</span> {activeSpeaker.languages}</p>
                <p><span className="font-semibold text-[#2a1f52]">Session focus:</span> {activeSpeaker.focus}</p>
                <p><span className="font-semibold text-[#2a1f52]">Approach:</span> {activeSpeaker.style}</p>
              </div>
            </div>

            <div className="relative w-full max-w-[220px] sm:max-w-[250px] lg:max-w-[280px] rounded-2xl overflow-hidden border border-gray-200 aspect-[3/4] mx-auto lg:ml-auto lg:mr-0">
              <Image
                src={activeSpeaker.image}
                alt={activeSpeaker.name}
                fill
                className="object-cover rounded-2xl"
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 250px, 220px"
              />
            </div>
          </article>

          <div className="mt-5 flex items-center gap-2">
            {EVENT_SPEAKERS.map((speaker, idx) => (
              <button
                key={speaker.name}
                type="button"
                onClick={() => changeSpeaker(idx, idx > speakerIndex ? 1 : -1)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === speakerIndex ? "w-8 bg-[#3f2e73]" : "w-4 bg-[#3f2e73]/25"
                }`}
                aria-label={`Go to speaker ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Rula-style: centered headline, 4 soft cards, purple icons, pill CTA */}
        <section className="w-full py-2 sm:py-4" aria-labelledby="why-it-matters-heading">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-0">
            <p className="text-xs font-semibold uppercase text-[#3f2e73]">Why it matters</p>
            <div
              id="why-it-matters-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold text-gray-900 font-sans"
              role="heading"
              aria-level={2}
            >
              Why this workshop matters for families
            </div>
            <p className="mt-4 text-base text-gray-600 max-w-2xl mx-auto">
              Many challenges do not begin outside the home, they begin in small moments where feelings are left
              unspoken. Children may not know how to express emotions, and parents may not always know how to respond
              in the moment. This workshop helps bridge that gap.
            </p>
          </div>

          {/* Wider than page column (max-w-6xl) so each card has more horizontal room */}
          <div className="relative left-1/2 right-auto mt-10 w-screen max-w-[100vw] -translate-x-1/2 overflow-x-clip px-4 sm:px-6 lg:px-10">
            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-4 lg:gap-8">
              {[
                {
                  icon: Clock,
                  title: "Children feel safer expressing emotions",
                  body: "Kids learn words and simple tools to share big feelings instead of shutting down or reacting in frustration.",
                },
                {
                  icon: LineChart,
                  title: "Parents respond with more confidence",
                  body: "You practice calm, practical responses that improve communication and reduce emotional conflict at home.",
                },
                {
                  icon: MessageCircle,
                  title: "Families build healthier patterns",
                  body: "Parents and children learn together, creating shared emotional language that continues after the session.",
                },
                {
                  icon: Layers,
                  title: "A small step creates real change",
                  body: "A single guided session can strengthen trust, reduce misunderstandings, and improve day-to-day connection.",
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
                  <p className="mt-2 text-sm text-gray-600">{body}</p>
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

        <section className="py-4" aria-labelledby="who-can-join-heading">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 text-[#3f2e73]">
              <Users className="h-5 w-5" />
              <div id="who-can-join-heading" className="text-xl font-semibold text-[#241a44] font-sans" role="heading" aria-level={2}>
                Who can join?
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#f4f1ff] px-3 py-1 text-xs font-semibold text-[#3f2e73]">
              Age 9-14
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border-l-2 border-[#3f2e73]/30 pl-4">
              <p className="text-[11px] font-semibold uppercase text-[#3f2e73]/60">Primary attendees</p>
              <p className="mt-1 text-sm font-medium text-[#2a1f52]">Parents with their children (best suited for ages 9-14 years)</p>
            </div>
            <div className="border-l-2 border-[#3f2e73]/30 pl-4">
              <p className="text-[11px] font-semibold uppercase text-[#3f2e73]/60">Best suited for</p>
              <p className="mt-1 text-sm font-medium text-[#2a1f52]">Families building emotional communication at home</p>
            </div>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-3xl border border-[#3f2e73]/20 bg-white shadow-[0_18px_48px_-22px_rgba(63,46,115,0.45)]"
          aria-labelledby="ticket-heading"
        >
          <div className="pointer-events-none absolute right-0 top-0 h-16 w-16 bg-[#3f2e73]" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#3f2e73] via-[#7b68b8] to-[#3f2e73]" aria-hidden />
          <div className="grid lg:grid-cols-[220px_1fr]">
            <div className="relative border-b border-[#3f2e73]/15 bg-[#f4f1ff] p-6 lg:border-b-0 lg:border-r lg:border-[#3f2e73]/15">
              <p className="text-[10px] font-semibold uppercase text-[#3f2e73]/70">Session pass</p>
              <p className="mt-2 text-4xl font-semibold text-[#2f2358]">FREE</p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <Gift className="h-3 w-3" aria-hidden />
                Complimentary
              </div>
              <div className="mt-6 text-xs font-medium text-[#5e5774]">Ticket ID: LC-SW-2026</div>
            </div>

            <div className="p-6 sm:p-7">
              <div
                id="ticket-heading"
                className="text-2xl font-semibold text-[#241a44] font-sans sm:text-[1.8rem]"
                role="heading"
                aria-level={2}
              >
                Expressing Big Emotions at Home
              </div>
              <p className="mt-2 text-sm text-[#5e5774]">One-session parent-child workshop ticket.</p>

              <div className="mt-6 grid gap-0 rounded-2xl border border-[#3f2e73]/14 bg-white sm:grid-cols-3">
                <div className="p-4 sm:border-r sm:border-[#3f2e73]/12">
                  <p className="text-[10px] font-semibold uppercase text-[#3f2e73]/60">Date</p>
                  <p className="mt-1 text-sm font-semibold text-[#2a1f52]">Sat, 18 April 2026</p>
                </div>
                <div className="border-t border-[#3f2e73]/12 p-4 sm:border-t-0 sm:border-r sm:border-[#3f2e73]/12">
                  <p className="text-[10px] font-semibold uppercase text-[#3f2e73]/60">Time</p>
                  <p className="mt-1 text-sm font-semibold text-[#2a1f52]">11:00 AM - 12:00 PM IST</p>
                </div>
                <div className="border-t border-[#3f2e73]/12 p-4 sm:border-t-0">
                  <p className="text-[10px] font-semibold uppercase text-[#3f2e73]/60">Format</p>
                  <p className="mt-1 text-sm font-semibold text-[#2a1f52]">Online (Google Meet)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#3f2e73]/18 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgba(63,46,115,0.08)]">
          <div className="text-2xl sm:text-3xl font-semibold text-gray-900 font-sans" role="heading" aria-level={2}>
            What You&apos;ll Take Back
          </div>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            By the end of the workshop, families leave with practical tools they can use right away.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Heart, text: "Better understanding of emotions" },
              { icon: MessageCircle, text: "Simple tools to express feelings" },
              { icon: Users, text: "Improved parent-child communication" },
              { icon: LineChart, text: "A stronger emotional connection at home" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 rounded-2xl border border-[#3f2e73]/12 bg-[#faf8ff] p-4">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3f2e73]/12 text-[#3f2e73]">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm sm:text-base text-[#2a1f52]">{text}</p>
              </div>
            ))}
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
          <p className="mt-3 mx-auto max-w-xl text-sm sm:text-base text-white/90">
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

      <div className="mt-20 sm:mt-24 md:mt-28">
        <Reviews
          cmsData={{
            title: "What families said after this event",
            reviews: EVENT_DUMMY_REVIEWS,
          }}
        />
      </div>

    </div>
  );
}
