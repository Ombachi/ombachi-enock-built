import {
  Compass,
  Network,
  TreePine,
  BookOpen,
  Globe,
  Heart,
  Award,
  GraduationCap,
  Cpu,
  Users,
  Map,
} from "lucide-react";

const principles = [
  {
    icon: Compass,
    title: "First Principles",
    desc: "Breaking problems down to their fundamental truths and building solutions from the ground up.",
  },
  { icon: Network, title: "Systems Thinking", desc: "Understanding how interconnected parts create complex wholes." },
  {
    icon: TreePine,
    title: "Long-Term Stewardship",
    desc: "Building institutions and systems that outlast us, with patience and generational thinking.",
  },
  {
    icon: BookOpen,
    title: "Evidence-Based Practice",
    desc: "Every decision grounded in data, research, and validated methods.",
  },
  {
    icon: Globe,
    title: "Decentralisation & Access",
    desc: "Extending quality services beyond urban centres to where communities actually live.",
  },
  {
    icon: Heart,
    title: "Human Dignity",
    desc: "Every system, every policy, every innovation must centre the worth and agency of the individual.",
  },
  { icon: Award, title: "Meritocracy", desc: "Rewarding competence, effort, and character." },
  {
    icon: GraduationCap,
    title: "Lifelong Learning",
    desc: "Staying curious, staying humble, and evolving with new knowledge and perspectives.",
  },
  {
    icon: Cpu,
    title: "Technology-Enabled Service",
    desc: "Leveraging AI and digital tools to modernise and scale delivery.",
  },
  { icon: Users, title: "Mentorship & Multiplication", desc: "Investing in people so they can invest in others." },
  {
    icon: Map,
    title: "Future Mapping",
    desc: "Anticipating trends, preparing for disruption, and designing systems for the world ahead.",
  },
];

const PrinciplesSection = () => (
  <section id="principles" className="section-padding bg-background">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Principles</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
        How I Think About Health Systems
      </h2>
      <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
        Operating Principles behind every project I take on.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll">
        {principles.map((p) => (
          <div
            key={p.title}
            className="group p-6 rounded-xl border border-border bg-card hover:border-secondary/40 transition-colors"
          >
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
