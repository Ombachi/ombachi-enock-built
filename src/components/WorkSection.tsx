import { useState } from "react";
import { Microscope, Leaf, GraduationCap, Stethoscope } from "lucide-react";

interface Project {
  title: string;
  summary: string;
  icon: React.ElementType;
  problem: string;
  role: string;
  tools: string;
  outcome: string;
}

const projects: Project[] = [
  {
    title: "Litu Diagnostics",
    summary: "Decentralising quality laboratory services across underserved communities.",
    icon: Microscope,
    problem: "Many communities lack access to reliable, accredited diagnostic services, leading to delayed diagnoses and poor health outcomes.",
    role: "Founder — strategy, quality systems design, operations setup, and partnerships.",
    tools: "ISO 15189, LIS platforms, quality management systems, community health frameworks.",
    outcome: "Building a scalable model for decentralised diagnostics that brings lab services closer to the people who need them.",
  },
  {
    title: "EcoSwarm",
    summary: "Climate-health innovation linking environmental data to diagnostic preparedness.",
    icon: Leaf,
    problem: "Climate change is shifting disease patterns, but health systems aren't adapting their diagnostic capacity accordingly.",
    role: "Co-creator — research, systems architecture, and climate-health integration.",
    tools: "Environmental monitoring, epidemiological data, AI-driven dashboards, predictive analytics.",
    outcome: "A framework connecting climate signals to laboratory readiness, enabling proactive rather than reactive healthcare.",
  },
  {
    title: "Mount Kenya University",
    summary: "Transforming laboratory systems, curriculum, and student mentorship.",
    icon: GraduationCap,
    problem: "University laboratory infrastructure and training programmes needed modernisation to meet evolving industry standards.",
    role: "Laboratory Manager — operations, curriculum input, equipment management, and student development.",
    tools: "Laboratory information systems, accreditation standards, competency-based training, virtual labs.",
    outcome: "Upgraded lab operations, improved student competency outcomes, and stronger alignment with professional standards.",
  },
  {
    title: "Nairobi Women's Hospital",
    summary: "Clinical laboratory excellence and frontline mentorship.",
    icon: Stethoscope,
    problem: "High patient volumes demanding fast, accurate diagnostics with limited resources and staffing pressures.",
    role: "Medical Laboratory Scientist — clinical testing, quality assurance, and junior staff mentorship.",
    tools: "Haematology, clinical chemistry, microbiology, SOPs, internal quality controls.",
    outcome: "Consistently reliable results, reduced turnaround times, and a culture of mentorship that strengthened the entire team.",
  },
];

const FlipCard = ({ project }: { project: Project }) => {
  const [flipped, setFlipped] = useState(false);
  const Icon = project.icon;

  return (
    <div
      className={`flip-card h-80 md:h-96 ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="flip-card-inner">
        {/* Front */}
        <div className="flip-card-front bg-card shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col justify-between border border-border">
          <div>
            <Icon size={32} className="text-secondary mb-4" />
            <h3 className="font-serif text-xl font-bold text-foreground mb-2">{project.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{project.summary}</p>
          </div>
          <p className="text-xs text-secondary font-medium">Tap to flip →</p>
        </div>

        {/* Back */}
        <div className="flip-card-back bg-primary text-primary-foreground p-8 flex flex-col justify-center border border-border overflow-y-auto">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-primary-foreground/70 text-xs uppercase tracking-wide">Problem</p>
              <p className="leading-relaxed">{project.problem}</p>
            </div>
            <div>
              <p className="font-semibold text-primary-foreground/70 text-xs uppercase tracking-wide">My Role</p>
              <p className="leading-relaxed">{project.role}</p>
            </div>
            <div>
              <p className="font-semibold text-primary-foreground/70 text-xs uppercase tracking-wide">Tools & Systems</p>
              <p className="leading-relaxed">{project.tools}</p>
            </div>
            <div>
              <p className="font-semibold text-primary-foreground/70 text-xs uppercase tracking-wide">Outcome</p>
              <p className="leading-relaxed">{project.outcome}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkSection = () => (
  <section id="work" className="section-padding bg-muted">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Featured Work</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
        Projects & Impact
      </h2>
      <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
        A few projects that show how I think, build, and solve problems across diagnostics, health systems, climate, and technology.
      </p>

      <div className="grid md:grid-cols-2 gap-6 animate-on-scroll">
        {projects.map((p) => (
          <FlipCard key={p.title} project={p} />
        ))}
      </div>
    </div>
  </section>
);

export default WorkSection;
