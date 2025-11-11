import MissionHero from '@/components/MissionHero';
import WhyWereHere from '@/components/WhyWereHere';
import AboutStats from '@/components/AboutStats';
import MeetTheTeam from '@/components/MeetTheTeam';
import TestimonialsAbout from '@/components/TestimonialsAbout';
import LeadershipTeam from '@/components/LeadershipTeam';

export default function About() {
  return (
    <div>
        <div className="mt-24">

      {/* Mission Hero Section */}
      <MissionHero />
      </div>
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
