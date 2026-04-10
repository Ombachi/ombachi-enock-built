import { useState, useEffect } from "react";
import { ArrowDown, Briefcase, Mail } from "lucide-react";
import heroFlip1 from "@/assets/hero-flip-1.jpg";
import heroFlip2 from "@/assets/hero-flip-2.jpg";
import heroFlip3 from "@/assets/hero-flip-3.jpg";
import heroFlip4 from "@/assets/hero-flip-4.jpg";

const flipImages = [
  { src: heroFlip1, alt: "Sunrise over African savanna — hope" },
  { src: heroFlip2, alt: "Children on a hillside — continuity" },
  { src: heroFlip3, alt: "Planting a seedling — life and growth" },
  { src: heroFlip4, alt: "Community gathering — inspiration" },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % flipImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Flipping BG images */}
      {flipImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: currentImage === i ? 1 : 0 }}
        >
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-primary/80" />

      <div className="section-container relative z-10 py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-up">
            Ombachi Enock
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-xl animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Building stronger diagnostic systems, advancing climate-resilient healthcare, and mentoring the next generation of laboratory professionals across East Africa.
          </p>

          <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
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

          <blockquote className="border-l-2 border-secondary pl-4 text-primary-foreground/70 italic text-sm max-w-md animate-fade-up" style={{ animationDelay: "0.3s" }}>
            "The strongest health systems are built at the intersection of science, technology, and human commitment."
          </blockquote>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {flipImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`w-2 h-2 rounded-full transition-all ${currentImage === i ? "bg-primary-foreground w-6" : "bg-primary-foreground/40"}`}
            />
          ))}
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
