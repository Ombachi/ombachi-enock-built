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
    philosophy: "Film teaches empathy — the ability to inhabit someone else's story and emerge changed. Every great film is a masterclass in perspective.",
  },
  {
    name: "Photography",
    image: passionPhotography,
    color: "from-orange-500 to-red-500",
    philosophy: "Photography trains the eye to see what others miss. In diagnostics and in life, observation is everything.",
  },
  {
    name: "Music",
    image: passionMusic,
    color: "from-pink-500 to-yellow-500",
    philosophy: "Music is structured creativity — rhythm, harmony, and improvisation. It mirrors the balance between protocol and intuition in the lab.",
  },
  {
    name: "Football",
    image: passionFootball,
    color: "from-green-500 to-yellow-500",
    philosophy: "Football is systems thinking in motion — every player, every pass, every decision shapes the outcome. Teamwork at its purest.",
  },
  {
    name: "Rugby",
    image: passionRugby,
    color: "from-blue-500 to-red-500",
    philosophy: "Rugby demands resilience, discipline, and selflessness. You move forward only by passing backward — a lesson in servant leadership.",
  },
  {
    name: "Badminton",
    image: passionBadminton,
    color: "from-pink-500 to-yellow-400",
    philosophy: "Badminton is about precision and anticipation. In a split second, you read, react, and respond — like clinical decision-making.",
  },
  {
    name: "Formula 1",
    image: passionF1,
    color: "from-red-500 to-orange-500",
    philosophy: "F1 is engineering excellence under extreme pressure. Every millisecond matters — a philosophy I carry into quality systems and accreditation.",
  },
  {
    name: "Golf",
    image: passionGolf,
    color: "from-green-600 to-emerald-400",
    philosophy: "Golf is patience, strategy, and self-mastery. The only opponent is yourself — and the course demands honesty with every stroke.",
  },
  {
    name: "Basketball",
    image: passionBasketball,
    color: "from-orange-500 to-blue-500",
    philosophy: "Basketball rewards adaptability and court vision. Seeing the full picture and making fast, smart decisions — essential in health systems.",
  },
  {
    name: "Space",
    image: passionSpace,
    color: "from-purple-600 to-blue-900",
    philosophy: "Space exploration is humanity's boldest act of curiosity. It reminds me that the biggest problems deserve the most ambitious thinking.",
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
          {passions.map((p) => (
            <div
              key={p.name}
              className={`flip-card aspect-square ${flipped === p.name ? "flipped" : ""}`}
              onClick={() => setFlipped(flipped === p.name ? null : p.name)}
            >
              <div className="flip-card-inner"
                   style={{ transformStyle: "preserve-3d" }}>
                {/* Front */}
                <div className="flip-card-front rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={640}
                    height={640}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-30`} />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-white font-semibold text-sm drop-shadow-lg">{p.name}</p>
                  </div>
                </div>

                {/* Back */}
                <div className={`flip-card-back rounded-2xl overflow-hidden bg-gradient-to-br ${p.color} flex flex-col justify-center p-4`}
                     style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                  <p className="text-white font-bold text-sm mb-2">{p.name}</p>
                  <p className="text-white/90 text-xs leading-relaxed">{p.philosophy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6 animate-on-scroll">
          Tap any card to discover the philosophy behind each passion.
        </p>
      </div>
    </section>
  );
};

export default PassionsSection;
