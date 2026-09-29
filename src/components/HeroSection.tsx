import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import heroImg1 from "@/assets/hero-speaking.jpg";
import heroImg2 from "@/assets/hero-steps.jpg";
import heroImg3 from "@/assets/hero-casual.jpg";
import heroImg4 from "@/assets/hero-outdoor.jpg";

const slides = [
  {
    src: heroImg1,
    alt: "Ombachi Enock speaking to an audience",
    role: "Public Leader & Advocate",
    quote: "I believe public leadership begins by listening closely, speaking clearly, and building with communities.",
  },
  {
    src: heroImg2,
    alt: "Ombachi Enock in a professional portrait",
    role: "Medical Laboratory Scientist",
    quote: "Every reliable diagnosis begins with disciplined science, careful systems, and respect for the person behind the sample.",
  },
  {
    src: heroImg3,
    alt: "Ombachi Enock in a relaxed portrait",
    role: "Tech Professional",
    quote: "Technology matters most when it turns complex systems into practical tools people can trust and use.",
  },
  {
    src: heroImg4,
    alt: "Ombachi Enock outdoors",
    role: "Entrepreneur",
    quote: "I build ventures that move strong ideas into useful, sustainable solutions for everyday challenges.",
  },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [paused]);

  const currentSlide = slides[currentImage];

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="Ombachi Enock's professional roles"
      className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          aria-hidden={currentImage !== i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: currentImage === i ? 1 : 0 }}
        >
          <img
            src={slide.src}
            alt={currentImage === i ? slide.alt : ""}
            className="h-full w-full object-cover object-top md:object-[center_20%]"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />

      <div className="section-container relative z-10 w-full pb-16 pt-32 sm:pb-20 lg:pb-24">
        <div className="max-w-4xl">
          <h1 key={currentSlide.role} className="text-primary-foreground animate-fade-up">
            <span className="block font-sans text-xs font-bold uppercase tracking-[0.18em] sm:text-sm">
              {currentSlide.role}
            </span>
            <span className="mt-5 block font-serif text-2xl italic leading-tight sm:text-3xl lg:text-4xl">
              “{currentSlide.quote}”
            </span>
          </h1>
        </div>

        <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Choose a professional role">
          {slides.map((slide, i) => (
            <Button
              key={i}
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setCurrentImage(i)}
              role="tab"
              aria-selected={currentImage === i}
              aria-label={`Show ${slide.role}`}
              className="h-8 w-8 rounded-full hover:bg-primary-foreground/10"
            >
              <span
                aria-hidden="true"
                className={`block h-2 rounded-full bg-primary-foreground transition-all motion-reduce:transition-none ${currentImage === i ? "w-6" : "w-2 opacity-45"}`}
              />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
