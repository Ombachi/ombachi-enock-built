import { Microscope, Leaf, Database, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  slug: string;
  title: string;
  summary: string;
  icon: React.ElementType;
  link?: string;
}

const projects: Project[] = [
  {
    slug: "litu-vault",
    title: "Litu Vault",
    summary: "A modern hospital management system streamlining patient records, billing, and clinical operations.",
    icon: Database,
    link: "https://lituvault.com",
  },
  {
    slug: "litu-hub",
    title: "Litu Hub",
    summary:
      "A premier learning management system used to create, deliver, track, and manage educational courses and training programs.",
    icon: BookOpen,
    link: "https://lituhub.com",
  },
  {
    slug: "litu-diagnostics",
    title: "Litu Diagnostics",
    summary: "Decentralising quality laboratory services across underserved communities.",
    icon: Microscope,
    link: "https://litudiagnostics.com",
  },
  {
    slug: "ecoswarm",
    title: "EcoSwarm",
    summary: "Climate-health innovation linking environmental data to diagnostic preparedness.",
    icon: Leaf,
    link: "https://ecoswarm.co.ke",
  },
];

const WorkSection = () => {
  const navigate = useNavigate();

  return (
    <section id="work" className="section-padding bg-background">
      <div className="section-container">
        <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll"></p>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
          Featured Projects & Impact
        </h2>
        <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll"></p>

        <div className="grid md:grid-cols-2 gap-6 animate-on-scroll">
          {projects.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.slug}
                onClick={() => navigate(`/work/${p.slug}`)}
                className="text-left bg-card shadow-sm hover:shadow-md transition-all p-8 rounded-xl border border-border hover:border-secondary/40 group"
              >
                <Icon size={32} className="text-secondary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{p.summary}</p>
                <span className="text-xs font-medium text-secondary">View full project →</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
