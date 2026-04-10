import { Award, BookOpen, Heart, Users } from "lucide-react";

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
          <p className="text-muted-foreground leading-relaxed">
            I'm a Medical Laboratory Scientist and Laboratory Manager at Mount Kenya University, where I oversee lab operations, curriculum development, and student mentorship. My work sits at the intersection of diagnostics, health systems strengthening, and climate-health resilience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            As the founder of Litu Diagnostics, I'm working to decentralise quality laboratory services—bringing reliable testing closer to communities that have been underserved. I believe that strong diagnostic infrastructure is the backbone of any functioning health system.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My journey started in clinical laboratories at Nairobi Women's Hospital, where hands-on patient care shaped my understanding of what works—and what doesn't—in healthcare delivery. That experience drives everything I build today.
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
