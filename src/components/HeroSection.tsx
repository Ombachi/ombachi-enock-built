import { useState, useEffect } from "react";
import heroImg1 from "@/assets/hero-speaking.jpg";
import heroImg2 from "@/assets/hero-steps.jpg";
import heroImg3 from "@/assets/hero-casual.jpg";
import heroImg4 from "@/assets/hero-outdoor.jpg";

const flipImages = [
  { src: heroImg1, alt: "Ombachi Enock speaking at an event" },
  { src: heroImg2, alt: "Ombachi Enock — professional portrait" },
  { src: heroImg3, alt: "Ombachi Enock — casual portrait" },
  { src: heroImg4, alt: "Ombachi Enock outdoors" },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % flipImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowTagline(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {flipImages.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: currentImage === i ? 1 : 0 }}
        >
          <img src={img.src} alt={img.alt} className="w-full h-full object-cover object-top md:object-[center_20%]" loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}
      <div className="absolute inset-0 bg-primary/85" />

      <div className="section-container relative z-10 py-32 flex flex-col items-center text-center justify-center min-h-[60vh]">
        <h1
          className={`font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground transition-all duration-1000 ease-out ${
            showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
        >
          Medical Laboratory Scientist
        </h1>
        <p
          className={`mt-4 text-lg md:text-2xl text-primary-foreground/80 font-medium tracking-wide transition-all duration-1000 delay-300 ease-out ${
            showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.3)" }}
        >
          Health Systems Builder
        </p>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {flipImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              aria-label={`Show image ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${currentImage === i ? "bg-primary-foreground w-6" : "bg-primary-foreground/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
