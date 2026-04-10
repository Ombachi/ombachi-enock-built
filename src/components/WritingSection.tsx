import { ArrowUpRight } from "lucide-react";

const articles = [
  {
    title: "Why Climate Change Is a Diagnostics Problem",
    excerpt: "Shifting disease patterns demand that laboratories adapt faster than ever. Here's how climate data can drive diagnostic preparedness.",
    tag: "Climate & Health",
    date: "2025",
  },
  {
    title: "Decentralising Lab Services: Lessons from the Field",
    excerpt: "Quality diagnostics shouldn't require a four-hour bus ride. Reflections on building accessible laboratory infrastructure.",
    tag: "Health Systems",
    date: "2025",
  },
  {
    title: "Mentorship in the Lab: What I Wish I'd Known Earlier",
    excerpt: "The most important skills in laboratory science aren't taught in textbooks. On building competence, confidence, and culture.",
    tag: "Leadership",
    date: "2024",
  },
  {
    title: "AI in Diagnostics: Promise, Pitfalls, and Pragmatism",
    excerpt: "Artificial intelligence can transform healthcare delivery — but only if we implement it with context, equity, and rigour.",
    tag: "Technology",
    date: "2024",
  },
];

const WritingSection = () => (
  <section id="writing" className="section-padding bg-muted">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">Writing & Insights</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 animate-on-scroll">
        Thinking Out Loud
      </h2>
      <p className="text-muted-foreground mb-12 max-w-xl animate-on-scroll">
        Short reflections on diagnostics, climate-health, leadership, and the systems that shape healthcare.
      </p>

      <div className="space-y-4 animate-on-scroll">
        {articles.map((a) => (
          <article
            key={a.title}
            className="group bg-card rounded-xl p-6 border border-border hover:border-secondary/40 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{a.tag}</span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-secondary transition-colors mb-1">
                  {a.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{a.excerpt}</p>
              </div>
              <ArrowUpRight size={20} className="text-muted-foreground group-hover:text-secondary transition-colors mt-1 shrink-0" />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default WritingSection;
