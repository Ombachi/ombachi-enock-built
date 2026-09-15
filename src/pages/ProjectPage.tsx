import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Microscope, Leaf, Database, BookOpen, GraduationCap, Stethoscope, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

const projectsData: Record<string, {
  title: string;
  icon: React.ElementType;
  link?: string;
  problem: string;
  role: string;
  tools: string;
  outcome: string;
  longDescription: string;
  metrics: string[];
}> = {
  "litu-vault": {
    title: "Litu Vault",
    icon: Database,
    link: "https://lituvault.com",
    problem: "Healthcare facilities struggle with fragmented records, inefficient billing, and operational blind spots that compromise patient care.",
    role: "Founder & Product Lead — systems architecture, clinical workflow design, and go-to-market strategy.",
    tools: "FHIR-compliant data models, cloud infrastructure, role-based access control, laboratory modules, billing automation.",
    outcome: "A modern hospital management system that unifies clinical, laboratory, and administrative workflows in one secure platform.",
    longDescription: "Litu Vault is designed to be the operating system for modern healthcare facilities. It brings patient records, laboratory results, billing, pharmacy, and appointments into a single, secure, easy-to-use platform. Built with clinical teams in mind, it reduces administrative burden, minimises errors, and gives hospital leaders real-time visibility into operations — so they can focus on delivering better care.",
    metrics: ["EMR, lab, billing & pharmacy modules", "Role-based access & audit trails", "Cloud-hosted with 99.9% uptime target"],
  },
  "litu-hub": {
    title: "Litu Hub",
    icon: BookOpen,
    link: "https://lituhub.com",
    problem: "Education is changing rapidly. Learning is no longer confined to the classroom. Students need the ability to learn independently, navigate digital information, develop practical skills, and prepare for a changing world of work. Many learning environments remain dependent on physical classrooms, fragmented learning materials, paper-based assessments, and limited visibility into individual student progress.",
    role: "Learning Architect — curriculum strategy, platform design, and instructor partnerships.",
    tools: "Learning management and course delivery, Digital course content and multimedia, Assignments, quizzes and question banks, Discussions and collaborative learning, Gradebook and competency tracking,Tutor feedback and assessment workflows.",
    outcome: "Litu Hub is being developed as a scalable digital learning ecosystem that can help institutions move progressively from: Classroom learning → Blended learning → Self-directed learning → Distance learning without requiring them to abandon the people, curriculum, culture, or physical infrastructure that already make their educational communities valuable.",
    longDescription: "Litu Hub is a digital learning management and learner-development platform designed to extend education beyond the traditional classroom. It brings courses, learning materials, videos, assignments, quizzes, discussions, assessments, grades, feedback, portfolios, and learning progress into one connected environment. Litu Hub supports schools, tutors, students, parents, university learners, medical trainees, and lifelong learners. This is a flexible digital layer through which institutions can gradually transition from classroom-only instruction to blended, self-directed, and eventually distance learning.",
    metrics: ["Self-directed learning", "Courses, assessments & competency tracking", "Mobile-first digital learning environment"],
  },
  "litu-diagnostics": {
    title: "Litu Diagnostics",
    icon: Microscope,
    link: "https://litudiagnostics.com",
    problem: "Many communities lack access to reliable, accredited diagnostic services, leading to delayed diagnoses and poor health outcomes.",
    role: "Solution Architect — strategy, quality systems design, operations setup, and partnerships.",
    tools: "ISO 15189, LIS platforms, quality management systems, community health frameworks.",
    outcome: "Building a scalable model for decentralised diagnostics that brings lab services closer to the people who need them.",
    longDescription: "Litu Diagnostics was born from the conviction that quality laboratory services shouldn't be a privilege of geography. Across East Africa, millions of people travel hours to access basic diagnostic tests. We are building infrastructure that brings accredited, reliable testing closer to these communities through a combination of technology, rigorous quality systems, and strategic community partnerships.",
    metrics: ["Targeting 10+ underserved communities", "ISO 15189 quality framework", "Partnerships with 3+ county health departments"],
  },
  "ecoswarm": {
    title: "EcoSwarm",
    icon: Leaf,
    link: "https://ecoswarm.co.ke",
    problem: "Climate information is everywhere, but knowing about climate change does not automatically lead to action. At the same time, consumers increasingly want sustainable products but may struggle to identify credible options or understand their environmental value.",
    role: "Co-creator — research, systems architecture, and climate-health integration.",
    tools: "Learn → Understand → Discover → Choose better.",
    outcome: "A growing community of informed climate-conscious learners and consumers with the knowledge, tools, and access to make more sustainable everyday choices.",
    longDescription: "EcoSwarm is a climate learning and sustainable marketplace platform helping people understand the environmental challenges shaping our world and make more informed choices in everyday life.Through our Climate Academy, learners can explore accessible courses covering climate science, climate justice, resilience, biodiversity, climate governance, sustainable development, and green skills.Through EcoMarket, users can discover environmentally conscious products while learning about the environmental thinking behind better consumption choices.",
    metrics: ["Climate Academy courses", "EcoMarket sustainable products", "Education and consumption reinforcing each other"],
  },
  "mount-kenya-university": {
    title: "Mount Kenya University",
    icon: GraduationCap,
    link: "https://mku.ac.ke",
    problem: "University laboratory infrastructure and training programmes needed modernisation to meet evolving industry standards.",
    role: "Laboratory Manager — operations, curriculum input, equipment management, and student development.",
    tools: "Laboratory information systems, accreditation standards, competency-based training, virtual labs.",
    outcome: "Upgraded lab operations, improved student competency outcomes, and stronger alignment with professional standards.",
    longDescription: "At Mount Kenya University, I manage laboratory operations that serve thousands of students across multiple programmes. This role involves more than equipment and reagents — it's about building systems that produce competent, confident laboratory professionals. From modernising standard operating procedures to introducing competency-based assessments, every change is designed to align student training with the demands of modern clinical laboratories.",
    metrics: ["500+ students mentored", "Modernised SOPs across 4 departments", "Competency-based assessment framework"],
  },
  "nairobi-womens-hospital": {
    title: "Nairobi Women's Hospital",
    icon: Stethoscope,
    link: "https://nwh.co.ke",
    problem: "High patient volumes demanding fast, accurate diagnostics with limited resources and staffing pressures.",
    role: "Medical Laboratory Scientist — clinical testing, quality assurance, and junior staff mentorship.",
    tools: "Haematology, clinical chemistry, microbiology, SOPs, internal quality controls.",
    outcome: "Consistently reliable results, reduced turnaround times, and a culture of mentorship that strengthened the entire team.",
    longDescription: "The Nairobi Women's Hospital is where my career in laboratory science began in earnest. Working in a high-volume clinical environment taught me the discipline of precision under pressure — running haematology panels, clinical chemistry assays, and microbiology cultures with speed and accuracy. More importantly, it taught me the value of mentorship: guiding junior staff, building confidence, and creating a team culture where quality is everyone's responsibility.",
    metrics: ["2,000+ patients served", "Reduced turnaround time by 40%", "Mentored 15+ junior staff"],
  },
};

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? projectsData[slug] : null;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-foreground mb-4">Project not found</h1>
          <button onClick={() => navigate("/")} className="text-secondary hover:underline">← Back home</button>
        </div>
      </div>
    );
  }

  const Icon = project.icon;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="pt-28 pb-16 bg-primary">
          <div className="section-container">
            <button
              onClick={() => navigate("/#work")}
              className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-8 transition-colors"
            >
              <ArrowLeft size={16} /> Back to all work
            </button>
            <div className="flex items-center gap-4 mb-4">
              <Icon size={40} className="text-secondary" />
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground">
                {project.title}
              </h1>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:underline text-sm mt-2"
              >
                <ExternalLink size={14} /> Visit website
              </a>
            )}
          </div>
        </section>

        <section className="section-padding">
          <div className="section-container">
            <p className="text-muted-foreground leading-relaxed text-lg mb-8 max-w-3xl">
              {project.longDescription}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap gap-4 mb-12">
              {project.metrics.map((m) => (
                <div key={m} className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium">
                  <TrendingUp size={14} />
                  {m}
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: "Problem", text: project.problem },
                { label: "My Role", text: project.role },
                { label: "Tools & Systems", text: project.tools },
                { label: "Outcome", text: project.outcome },
              ].map((item) => (
                <div key={item.label} className="bg-card rounded-xl p-8 border border-border">
                  <h3 className="font-semibold text-xs uppercase tracking-wide mb-3 text-secondary">{item.label}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/#work")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <ArrowLeft size={16} /> Back to all projects
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ProjectPage;
