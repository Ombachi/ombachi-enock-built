import { Stethoscope, GraduationCap, Microscope, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

const milestones = [
  {
    year: "2018",
    title: "Nairobi Women's Hospital",
    role: "Medical Laboratory Scientist",
    desc: "Served 2,000+ patients · Reduced turnaround time by 40%",
    icon: Stethoscope,
    slug: "nairobi-womens-hospital",
  },
  {
    year: "2020",
    title: "Mount Kenya University",
    role: "Laboratory Manager",
    desc: "Modernised lab systems · Mentored 500+ students",
    icon: GraduationCap,
    slug: "mount-kenya-university",
  },
  {
    year: "2022",
    title: "Litu Diagnostics",
    role: "Founder",
    desc: "Decentralising diagnostics for underserved communities",
    icon: Microscope,
    slug: "litu-diagnostics",
  },
  {
    year: "2023",
    title: "EcoSwarm",
    role: "Co-creator",
    desc: "Climate-health innovation linking data to diagnostic preparedness",
    icon: Leaf,
    slug: "ecoswarm",
  },
];

const TimelineSection = () => {
  const navigate = useNavigate();

  return (
    <section id="timeline" className="section-padding bg-muted">
      <div className="section-container">
        <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Journey</p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-12 animate-on-scroll">
          Career Timeline
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-12">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={m.year}
                  className={`relative flex items-start gap-6 animate-on-scroll ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-background z-10 mt-1" />

                  {/* Card */}
                  <div
                    className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8" : "md:pl-8"
                    }`}
                  >
                    <button
                      onClick={() => navigate(`/work/${m.slug}`)}
                      className="text-left w-full bg-card p-6 rounded-xl border border-border hover:border-secondary/40 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon size={20} className="text-secondary" />
                        <span className="text-xs font-bold text-secondary tracking-wide">{m.year}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-secondary transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.desc}</p>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
