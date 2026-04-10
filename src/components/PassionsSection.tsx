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
  { name: "Film", image: passionFilm, color: "from-purple-500 to-pink-500" },
  { name: "Photography", image: passionPhotography, color: "from-orange-500 to-red-500" },
  { name: "Music", image: passionMusic, color: "from-pink-500 to-yellow-500" },
  { name: "Football", image: passionFootball, color: "from-green-500 to-yellow-500" },
  { name: "Rugby", image: passionRugby, color: "from-blue-500 to-red-500" },
  { name: "Badminton", image: passionBadminton, color: "from-pink-500 to-yellow-400" },
  { name: "Formula 1", image: passionF1, color: "from-red-500 to-orange-500" },
  { name: "Golf", image: passionGolf, color: "from-green-600 to-emerald-400" },
  { name: "Basketball", image: passionBasketball, color: "from-orange-500 to-blue-500" },
  { name: "Space", image: passionSpace, color: "from-purple-600 to-blue-900" },
];

const PassionsSection = () => (
  <section id="passions" className="section-padding bg-muted">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">
        Passions & Play
      </p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
        Beyond the Lab
      </h2>
      <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
        Life is richer when you explore beyond your profession. Here's what fuels my curiosity and keeps me grounded.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-on-scroll">
        {passions.map((p) => (
          <div
            key={p.name}
            className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              width={640}
              height={640}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-30 group-hover:opacity-50 transition-opacity`} />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-white font-semibold text-sm drop-shadow-lg">{p.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PassionsSection;
