import { Award, BookOpen, Heart, Users } from "lucide-react";
import headshot from "@/assets/headshot.jpg";

const values = [
  { icon: Award, title: "Excellence", desc: "Relentless pursuit of quality in every system I build." },
  { icon: BookOpen, title: "Evidence-Based Practice", desc: "Every decision grounded in data, research, and validated methods." },
  { icon: Users, title: "Mentorship", desc: "Empowering the next generation of laboratory professionals." },
  { icon: Heart, title: "Decentralised Healthcare", desc: "Bringing diagnostics closer to the communities that need them most." },
];

const AboutSection = () => (
  <section id="about" className="section-padding bg-background">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">About</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 animate-on-scroll">
        The Person Behind the Work
      </h2>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="space-y-5 animate-on-scroll">
          <div className="flex justify-center md:justify-start mb-6">
            <img
              src={headshot}
              alt="Ombachi Enock — Medical Laboratory Scientist"
              className="w-48 h-48 rounded-2xl object-cover shadow-lg"
              loading="lazy"
              width={800}
              height={800}
            />
          </div>
          <p className="text-muted-foreground leading-relaxed">
            I'm a Medical Laboratory Scientist and Laboratory Manager at <a href="https://mku.ac.ke" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Mount Kenya University</a>, where I oversee lab operations, curriculum development, and student mentorship. My work sits at the intersection of diagnostics, health systems strengthening, and climate-health resilience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            As the founder of <a href="https://litudiagnostics.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Litu Diagnostics</a>, I'm working to decentralise quality laboratory services—bringing reliable testing closer to communities that have been underserved. I'm also the author of <span className="font-medium text-foreground">Litu Musings</span>, where I write about diagnostics, climate-health, and leadership.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My journey started in clinical laboratories at <a href="https://nwh.co.ke" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Nairobi Women's Hospital</a>, where hands-on patient care shaped my understanding of what works—and what doesn't—in healthcare delivery.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-on-scroll">
          {values.map((v) => (
            <div key={v.title} className="bg-card rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <v.icon size={24} className="text-secondary mb-3" />
              <h3 className="font-semibold text-foreground text-sm mb-1">{v.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
