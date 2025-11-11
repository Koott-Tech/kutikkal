"use client";

import Image from "next/image";

const teamMembers = [
  { name: "Albin", title: "Advisory Board Member", image: "/doug.png" },
  { name: "Aswathy Usha Raman", title: "Advisory Board Member", image: "/doug.png" },
  { name: "Thaniya", title: "Advisory Board Member", image: "/doug.png" },
  { name: "Aswathy Sambath", title: "Advisory Board Member", image: "/doug.png" },
  { name: "Athullya Nair", title: "Advisory Board Member", image: "/doug.png" },
  { name: "Gayathri", title: "Advisory Board Member", image: "/doug.png" },
];

export default function MeetTheTeam() {
  return (
    <div className="px-[50px]">
      <section className="w-full mt-6 md:mt-8 mb-6 md:mb-8">
        <div className="w-full py-20">
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
              <div className="h-80 w-full overflow-hidden">
                <Image
                    src={member.image}
                    alt={member.name}
                  width={320}
                  height={320}
                  className="w-full h-full object-cover"
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
  );
}
