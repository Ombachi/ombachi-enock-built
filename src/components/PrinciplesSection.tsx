import { Activity, Shield, Heart, BarChart3, Eye, Cpu } from "lucide-react";

const principles = [
  { icon: Activity, title: "Evidence-Based Medicine", desc: "Clinical decisions grounded in validated research and quality data, not assumptions." },
  { icon: Shield, title: "Quality Systems & Accreditation", desc: "Building labs that meet ISO 15189 and international standards from day one." },
  { icon: Heart, title: "Preventive Over Reactive Care", desc: "Shifting resources upstream—catching problems before they become crises." },
  { icon: BarChart3, title: "Decentralised Healthcare", desc: "Extending diagnostic capacity beyond urban centres to where people actually live." },
  { icon: Eye, title: "Visual Learning & Informed Patients", desc: "Making complex health information accessible through clear, visual communication." },
  { icon: Cpu, title: "Technology & AI in Health", desc: "Dashboards, LIS/EMR systems, virtual labs, and AI tools to modernise healthcare delivery." },
];

const PrinciplesSection = () => (
  <section id="principles" className="section-padding bg-background">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Principles</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
        How I Think About Health Systems
      </h2>
      <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
        These aren't abstract ideals — they're the operating principles behind every project I take on.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
        {principles.map((p) => (
          <div key={p.title} className="group p-6 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors">
            <p.icon size={28} className="text-secondary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PrinciplesSection;
