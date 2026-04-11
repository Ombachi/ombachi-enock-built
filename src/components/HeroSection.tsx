import { useState, useEffect } from "react";
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

const coreValues = [
  { word: "Integrity", color: "text-emerald-400" },
  { word: "Equity", color: "text-sky-400" },
  { word: "Dignity", color: "text-amber-400" },
  { word: "Love", color: "text-rose-400" },
  { word: "Kindness", color: "text-violet-400" },
  { word: "Excellence", color: "text-teal-300" },
  { word: "Honor", color: "text-orange-400" },
  { word: "Hope", color: "text-cyan-300" },
  { word: "Justice", color: "text-pink-400" },
  { word: "Courage", color: "text-lime-300" },
];

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [visibleValues, setVisibleValues] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % flipImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Stagger core values appearance
  useEffect(() => {
    const timers = coreValues.map((_, i) =>
      setTimeout(() => setVisibleValues((prev) => [...prev, i]), 200 + i * 300)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

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
      <div className="absolute inset-0 bg-primary/85" />

      <div className="section-container relative z-10 py-32 flex flex-col items-center text-center">
        {/* Animated core values */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 max-w-3xl">
          {coreValues.map((v, i) => (
            <span
              key={v.word}
              className={`font-serif font-bold transition-all duration-700 ease-out ${v.color} ${
                visibleValues.includes(i)
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-75"
              }`}
              style={{
                fontSize: `clamp(1.5rem, ${2 + (i % 3) * 0.8}vw, ${2.5 + (i % 3) * 0.6}rem)`,
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              {v.word}
            </span>
          ))}
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
      </div>
    </section>
  );
};

export default HeroSection;
