"use client";
import Image from "next/image";
import { useRef, useState } from "react";

export default function FeatureCards() {
  const localImage = "/360_F_262015638_nxpC4t1wbe8cLiVX3eholwctgVItTqF6.png";
  const cards = [
    {
      src: localImage,
      title: "Accessible Anywhere",
      description: "Connect with licensed experts from the comfort of your home.",
    },
    {
      src: localImage,
      title: "Simple Scheduling",
      description: "Book, reschedule, and manage sessions in just a few clicks.",
    },
    {
      src: localImage,
      title: "Personalized Plans",
      description: "Care plans tailored to your needs and your pace.",
    },
    {
      src: localImage,
      title: "Seamless Experience",
      description: "Modern, secure platform that just works on every device.",
    },
    {
      src: localImage,
      title: "Virtual IOP",
      description: "Enhanced virtual outpatient support when you need it.",
    },
    {
      src: localImage,
      title: "Champions of the Mind",
      description: "Build strength for competitive pressures and performance.",
    },
    {
      src: localImage,
      title: "School Supplies",
      description: "Skills to thrive in and out of the classroom.",
    },
    {
      src: localImage,
      title: "Sleep",
      description: "Give your teen tools to get better sleep.",
    },
    {
      src: localImage,
      title: "Resilience",
      description: "Strengthen coping strategies for everyday demands.",
    },
  ];
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  function handleMouseDown(event) {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(event.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleMouseLeave() {
    setIsDragging(false);
  }

  function handleMouseMove(event) {
    if (!isDragging || !scrollRef.current) return;
    event.preventDefault();
    const x = event.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll speed
    scrollRef.current.scrollLeft = scrollStart - walk;
  }

  // Touch support
  function handleTouchStart(event) {
    if (!scrollRef.current) return;
    const touch = event.touches[0];
    setIsDragging(true);
    setStartX(touch.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  }

  function handleTouchEnd() {
    setIsDragging(false);
  }

  function handleTouchMove(event) {
    if (!isDragging || !scrollRef.current) return;
    const touch = event.touches[0];
    const x = touch.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollStart - walk;
  }

  return (
    <section className="mt-40 md:mt-50 ml-[10px] overflow-visible">
      <div className="overflow-visible px-0">
        <div
          ref={scrollRef}
          className="no-scrollbar -ml-[60px] -mr-[50px] flex gap-3 md:gap-4 overflow-x-auto pb-4 scroll-smooth cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
        {cards.map((card, index) => (
        <div key={`${card.title}-${index}`} className="ml-[16px] md:ml-[20px]">
          <div
            className="flex h-[450px] w-[340px] min-w-[320px] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm "
          >
            {/* Top: Image (60% height) */}
            <div className="relative h-[100%] w-full overflow-hidden rounded-t-2xl ">
              <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover"
                sizes="360px"
                priority={false}
              />
            </div>

            {/* Bottom: Content (40% height) */}
            <div className="flex h-[40%] flex-col p-8">
              <h3 className="text-base font-semibold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          </div>
        </div>
         ))}
        </div>
      </div>
    </section>
  );
}


