import { useState } from "react";
import passionFilm from "@/assets/passion-film.jpg";
import passionPhotography from "@/assets/passion-photography.jpg";
import passionMusic from "@/assets/passion-music.jpg";
import passionFootball from "@/assets/passion-football.jpg";
import passionRugby from "@/assets/passion-rugby.jpg";
import passionBadminton from "@/assets/passion-badminton.jpg";
import passionF1 from "@/assets/passion-f1.jpg";
import passionGolf from "@/assets/passion-golf.jpg";
import passionBasketball from "@/assets/passion-basketball.jpg";
import passionSpace from "@/assets/passion-space.jpg";

const passions = [
  {
    name: "Film",
    image: passionFilm,
    color: "from-purple-500 to-pink-500",
    philosophy: "Film teaches empathy — inhabiting someone else's story and emerging changed.",
  },
  {
    name: "Photography",
    image: passionPhotography,
    color: "from-orange-500 to-red-500",
    philosophy: "Photography trains the eye to see what others miss. Observation is everything.",
  },
  {
    name: "Music",
    image: passionMusic,
    color: "from-pink-500 to-yellow-500",
    philosophy: "Structured creativity — rhythm, harmony, and improvisation in perfect balance.",
  },
  {
    name: "Football",
    image: passionFootball,
    color: "from-green-500 to-yellow-500",
    philosophy: "Systems thinking in motion — every pass shapes the outcome. Teamwork at its purest.",
  },
  {
    name: "Rugby",
    image: passionRugby,
    color: "from-blue-500 to-red-500",
    philosophy: "You move forward by passing backward — a lesson in servant leadership.",
  },
  {
    name: "Badminton",
    image: passionBadminton,
    color: "from-pink-500 to-yellow-400",
    philosophy: "Precision and anticipation. Read, react, respond — like clinical decisions.",
  },
  {
    name: "Formula 1",
    image: passionF1,
    color: "from-red-500 to-orange-500",
    philosophy: "Engineering excellence under pressure. Every millisecond matters.",
  },
  {
    name: "Golf",
    image: passionGolf,
    color: "from-green-600 to-emerald-400",
    philosophy: "Patience, strategy, and self-mastery. The course demands honesty.",
  },
  {
    name: "Basketball",
    image: passionBasketball,
    color: "from-orange-500 to-blue-500",
    philosophy: "Court vision and adaptability — seeing the full picture, deciding fast.",
  },
  {
    name: "Space",
    image: passionSpace,
    color: "from-purple-600 to-blue-900",
    philosophy: "Humanity's boldest curiosity. Big problems deserve ambitious thinking.",
  },
];

const PassionsSection = () => {
  const [flipped, setFlipped] = useState<string | null>(null);

  return (
    <section id="passions" className="section-padding bg-muted">
      <div className="section-container">
        <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">
          Passions & Play
        </p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Beyond the Lab
        </h2>
        <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
          Life is richer when you explore beyond your profession. Each passion carries a philosophy that shapes how I work and lead.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-on-scroll">
          {passions.map((p) => {
            const isFlipped = flipped === p.name;
            return (
              <div
                key={p.name}
                className="cursor-pointer"
                style={{ perspective: "600px" }}
                onClick={() => setFlipped(isFlipped ? null : p.name)}
              >
                <div
                  className="relative w-full transition-transform duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    /* Fixed aspect ratio with enough height for philosophy text */
                    paddingBottom: "130%",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl overflow-hidden shadow-md"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={640}
                      height={832}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-30`} />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-white font-semibold text-sm drop-shadow-lg">{p.name}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className={`absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br ${p.color} flex flex-col justify-center p-4`}
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <p className="text-white font-bold text-sm mb-2">{p.name}</p>
                    <p className="text-white/90 text-xs leading-relaxed">{p.philosophy}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6 animate-on-scroll">
          Tap any card to discover the philosophy behind each passion.
        </p>
      </div>
    </section>
  );
};

export default PassionsSection;
