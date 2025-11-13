"use client";

import { useEffect } from "react";
import Image from "next/image";

const teamMembers = [
  { name: "Albin", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Albin.webp" },
  { name: "Aswathy Balan", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Balan.webp" },
  { name: "Thaniya", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Thaniya.webp" },
  { name: "Aswathy Sambath", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Aswathy%20Sambath.webp" },
  { name: "Athullya Nair", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Athullya.webp" },
  { name: "Gayathri", title: "Advisory Board Member", image: "https://iylutfwntoqcnqnjdnnp.supabase.co/storage/v1/object/public/static-files/Gayathri.webp" },
];

export default function MeetTheTeam() {
  useEffect(() => {
    const styleId = 'team-image-border-radius';
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = `
      @media (max-width: 767px) {
        .team-image-container {
          border-radius: 10px;
          overflow: hidden;
        }
        .team-image-container * {
          border-radius: 10px;
        }
        .team-image-container img,
        .team-image-container span,
        .team-image-container span img,
        .team-image-container > *,
        .team-image-container > * > * {
          border-radius: 10px;
          overflow: hidden;
        }
      }
    `;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 767px) {
          .team-image-container {
            border-radius: 10px;
            overflow: hidden;
          }
          .team-image-container * {
            border-radius: 10px;
          }
          .team-image-container img,
          .team-image-container span,
          .team-image-container span img,
          .team-image-container > *,
          .team-image-container > * > * {
            border-radius: 10px;
            overflow: hidden;
          }
        }
      `}} />
      <div className="px-[50px]">
      <section className="w-full mt-24">
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-16">
            <p className="text-xl text-black font-normal text-center mb-2">
              Meet Our
            </p>
            <h2 
              className="text-[2.5rem] md:text-4xl lg:text-5xl font-medium leading-[110%] md:leading-[106%] tracking-[-0.125rem] md:tracking-[-0.195rem]"
              style={{
                color: '#1d1733'
              }}
            >
              Advisory Board
            </h2>
          </div>

          {/* Team Members Grid */}
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="w-80 bg-white rounded-2xl overflow-hidden">
              <div className="h-80 w-full overflow-hidden rounded-[10px] team-image-container" suppressHydrationWarning>
                <Image
                    src={member.image}
                    alt={member.name}
                  width={320}
                  height={320}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="px-0 py-6">
                <h5 className="text-sm md:text-base font-medium text-gray-900 mb-1">
                    {member.name}
                </h5>
                  <p className="text-gray-600">{member.title}</p>
            </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
