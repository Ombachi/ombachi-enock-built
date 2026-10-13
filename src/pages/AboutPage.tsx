import { Helmet } from "react-helmet-async";
import { GraduationCap } from "lucide-react";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import PassionsSection from "@/components/PassionsSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Replace with confirmed qualifications.
const EDUCATION = [
  { title: "Bachelor of Science, Medical Laboratory Science", detail: "Clinical training across haematology, microbiology, clinical chemistry and blood transfusion." },
  { title: "Laboratory Quality Management (ISO 15189)", detail: "Quality systems, internal audit and accreditation readiness for clinical laboratories." },
];

const AboutPage = () => {
  useScrollAnimation();
  return (
    <PageTransition>
      <Helmet>
        <title>About — Ombachi Enock</title>
        <meta name="description" content="The story, education, principles and passions behind Ombachi Enock's work in diagnostics, technology and public leadership." />
        <link rel="canonical" href="https://ombachi-enock-built.lovable.app/about" />
        <meta property="og:title" content="About Ombachi Enock" />
        <meta property="og:url" content="https://ombachi-enock-built.lovable.app/about" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <AboutSection />
        <section id="education" className="section-padding bg-muted">
          <div className="section-container">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 animate-on-scroll">
              Education
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 animate-on-scroll">
              {EDUCATION.map((e) => (
                <li key={e.title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
                  <GraduationCap className="mt-1 shrink-0 text-secondary" size={20} />
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-foreground">{e.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <PassionsSection />
        <PrinciplesSection />
        <Footer />
        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default AboutPage;
