"use client";

import Header from '@/components/Header';
import MissionHero from '@/components/MissionHero';
import LogosStrip from '@/components/LogosStrip';
import WhyWereHere from '@/components/WhyWereHere';
import AboutStats from '@/components/AboutStats';
import MeetTheTeam from '@/components/MeetTheTeam';
import TestimonialsAbout from '@/components/TestimonialsAbout';
import LeadershipTeam from '@/components/LeadershipTeam';

export default function About() {
  return (
    <div>
      
      {/* Mission Hero Section */}
      <MissionHero />
      
      {/* Logo Strip */}
      <LogosStrip bgColor="bg-[#1d1733]" height="py-4" logosCount={6} />
      
      {/* Why We're Here Section */}
      <WhyWereHere />
      <MeetTheTeam />
      {/* About Stats Section */}
      <AboutStats />
      
      {/* Meet The Team Section */}
      
      <LeadershipTeam />
      
      {/* Testimonials Section */}
      <TestimonialsAbout />
      
      {/* Leadership Team Section */}
     
      
      {/* Hero Section */}
      

      <div className="mt-20">
      </div>
    </div>
  );
}
