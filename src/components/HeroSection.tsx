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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % flipImages.length);
    }, 4000);
    return () => clearInterval(interval);
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
