import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { WhatWeDoSection } from '@/components/WhatWeDoSection';
import { TeamSection } from '@/components/TeamSection';
import { JoinSection } from '@/components/JoinSection';
import { EventsSection } from '@/components/EventsSection';
import { StatsSection } from '@/components/StatsSection';
import { SocialsSection } from '@/components/SocialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <WhatWeDoSection />
        <TeamSection />
        <JoinSection />
        <EventsSection />
        <StatsSection />
        <SocialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
