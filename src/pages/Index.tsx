import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import QuoteSection from "@/components/QuoteSection";
import PassionsSection from "@/components/PassionsSection";
import WritingSection from "@/components/WritingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WorkSection />
      <PrinciplesSection />
      <QuoteSection />
      <PassionsSection />
      <WritingSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
