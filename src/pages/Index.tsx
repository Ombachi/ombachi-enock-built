import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import TimelineSection from "@/components/TimelineSection";
import PublicationsSection from "@/components/PublicationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Index = () => {
  useScrollAnimation();

  return (
    <PageTransition>
      <Helmet>
        <title>Ombachi Enock — A Renaissance Man</title>
        <meta name="description" content="Explore Ombachi Enock's work across medical laboratory science, technology, entrepreneurship, public leadership, diagnostics, and climate-health systems." />
        <link rel="canonical" href="https://ombachi-enock-built.lovable.app/" />
        <meta property="og:title" content="Ombachi Enock — Science, Technology & Public Leadership" />
        <meta property="og:description" content="Work and ideas across medical laboratory science, technology, entrepreneurship, diagnostics, and public leadership." />
        <meta property="og:url" content="https://ombachi-enock-built.lovable.app/" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <TimelineSection />
        <WorkSection />
        <PublicationsSection />
        <ContactSection />
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default Index;
