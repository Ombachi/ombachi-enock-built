import headshot from "@/assets/headshot.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

const AboutSection = () => (
  <section id="about" className="section-padding bg-background">
    <div className="section-container">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 animate-on-scroll">
        The Man Behind the Work
      </h2>

      <div className="grid md:grid-cols-12 gap-10 lg:gap-14 items-start animate-on-scroll">
        <div className="md:col-span-7 order-2 md:order-1">
          <div className="flex md:hidden justify-center mb-6">
            <img
              src={headshot}
              alt="Ombachi Enock — Medical Laboratory Scientist"
              className="w-36 h-36 rounded-2xl object-cover shadow-lg"
              loading="lazy"
              width={400}
              height={400}
            />
          </div>
          <div className="space-y-5">
            <p className="text-muted-foreground leading-relaxed">
              I am a Medical Laboratory Scientist by training. A policy thinker by education. A founder by practice. A
              writer by compulsion. I solve problems. I build systems. I connect ideas. I make things. I want to be useful.
            </p>
          </div>
        </div>
        <div className="md:col-span-5 order-1 md:order-2 hidden md:block">
          <div className="relative">
            <img
              src={heroPortrait}
              alt="Ombachi Enock — portrait"
              className="w-full aspect-[4/5] rounded-2xl object-cover shadow-xl"
              loading="lazy"
              width={600}
              height={750}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
