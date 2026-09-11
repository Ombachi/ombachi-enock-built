import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import TimelineSection from "@/components/TimelineSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import QuoteSection from "@/components/QuoteSection";
import PassionsSection from "@/components/PassionsSection";
import WritingSection from "@/components/WritingSection";
import ContactSection from "@/components/ContactSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  useScrollAnimation();

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <PassionsSection />
        <TimelineSection />
        <WorkSection />
        <PrinciplesSection />
        <QuoteSection />
        <WritingSection />
        <ContactSection />
        <NewsletterSignup />
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default Index;
