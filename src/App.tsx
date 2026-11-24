import { AboutSection, FounderSection } from './components/AboutFounderSections';
import { ClippersSection, CreatorsSection } from './components/CreatorsClippersSections';
import {
  CampaignsSection,
  DashboardPreviewSection,
  HowItWorksSection,
} from './components/DashboardAndProcessSections';
import { ContactSection, FaqSection, Footer } from './components/FaqContactFooter';
import { GoldSceneBackdrop } from './components/GoldScene';
import { HeroSection } from './components/HeroSection';
import { MeetingsSection } from './components/MeetingsSection';
import { ScrollProvider } from './components/MotionPrimitives';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <ScrollProvider>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <GoldSceneBackdrop />
      <div aria-hidden="true" className="grain" />
      <Navbar />

      <main id="main" className="relative z-10 overflow-x-clip">
        <HeroSection />
        <AboutSection />
        <FounderSection />
        <CreatorsSection />
        <ClippersSection />
        <DashboardPreviewSection />
        <HowItWorksSection />
        <CampaignsSection />
        <MeetingsSection />
        <FaqSection />
        <ContactSection />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </ScrollProvider>
  );
}
