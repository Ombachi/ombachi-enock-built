import { ArrowDown, Briefcase, Mail } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG image with overlay */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      <div className="section-container relative z-10 py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-widest uppercase text-primary-foreground/60 mb-4 animate-fade-up">
            Medical Laboratory Scientist · Laboratory Manager · Health Systems Innovator
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Ombachi Enock
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Building stronger diagnostic systems, advancing climate-resilient healthcare, and mentoring the next generation of laboratory professionals across East Africa.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={() => scrollTo("work")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground font-medium rounded-lg hover:shadow-lg transition-all"
            >
              <Briefcase size={18} /> View Work
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-primary-foreground/30 text-primary-foreground font-medium rounded-lg hover:bg-primary-foreground/10 transition-all"
            >
              <Mail size={18} /> Contact Me
            </button>
          </div>

          <blockquote className="border-l-2 border-secondary pl-4 text-primary-foreground/70 italic text-sm max-w-md animate-fade-up" style={{ animationDelay: "0.4s" }}>
            "The strongest health systems are built at the intersection of science, technology, and human commitment."
          </blockquote>
        </div>

        <button
          onClick={() => scrollTo("about")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/50 animate-bounce"
        >
          <ArrowDown size={24} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
