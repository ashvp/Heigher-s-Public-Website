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
import { ThunderboltDivider } from '@/components/ThunderboltDivider';
// import { VisionSection } from '@/components/VisionSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ThunderboltDivider />
        <AboutSection />
        <ThunderboltDivider />
        {/* <VisionSection />
        <ThunderboltDivider /> */}
        <WhatWeDoSection />
        <ThunderboltDivider />
        <TeamSection />
        <ThunderboltDivider />
        <EventsSection />
        <ThunderboltDivider />
        <StatsSection />
        <ThunderboltDivider />
        <JoinSection />
        <ThunderboltDivider />
        <SocialsSection />
        <ThunderboltDivider />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
