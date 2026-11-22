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
        <meta name="description" content="Scientist, Public Policy Scholar, Founder & Writer" />
        <link rel="canonical" href="https://www.ombachienock.me.ke/" />
        <meta property="og:title" content="Ombachi Enock — A Renaissance Man" />
        <meta property="og:description" content="Scientist, Public Policy Scholar, Founder & Writer" />
        <meta property="og:url" content="https://www.ombachienock.me.ke/" />
        <meta property="og:image" content="https://www.ombachienock.me.ke/og-image-20261122.jpg" />
        <meta property="og:image:alt" content="Ombachi Enock — Scientist, Public Policy Scholar, Founder & Writer" />
        <meta name="twitter:title" content="Ombachi Enock — A Renaissance Man" />
        <meta name="twitter:description" content="Scientist, Public Policy Scholar, Founder & Writer" />
        <meta name="twitter:image" content="https://www.ombachienock.me.ke/og-image-20261122.jpg" />
        <meta name="twitter:image:alt" content="Ombachi Enock — Scientist, Public Policy Scholar, Founder & Writer" />
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
