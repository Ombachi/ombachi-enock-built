import { Stethoscope, GraduationCap, Building2 } from "lucide-react";

const milestones = [
  {
    year: "2021",
    title: "Kenyatta National Hospital",
    role: "Medical Laboratory Attaché",
    desc: "Clinical training within Kenya’s leading national referral and teaching hospital, rotating across Haematology, Microbiology,Histology, Cytology, Clinical Chemistry, Blood Transfusion, Immunology and Molecular Diagnostics. Gained hands-on experience in specimen management, diagnostic testing, quality control, result interpretation and laboratory workflows in a high-volume clinical environment.",
    icon: ,
  },
  {
    year: "2022",
    title: "Nairobi Women's Hospital",
    role: "Medical Laboratory Scientist",
    desc: "Provided diagnostic laboratory services across haematology, microbiology, clinical chemistry, immunology, molecular diagnostics and blood transfusion. Managed specimen collection and processing, quality assurance, equipment maintenance, reporting and critical-result communication.Through the Gender Violence Recovery Centre (GVRC), gained specialised experience handling medico-legal specimens and documentation, coordinating with law-enforcement and legal stakeholders and supporting medical-legal clinics.",
    icon: ,
  },
  {
    year: "2024",
    title: "Mount Kenya University",
    role: "Laboratory Manager",
    desc: "Lead laboratory operations across clinical services, quality systems, procurement, equipment management, student training and digital health workflows. Supported the development and modernisation of laboratory infrastructure, SOPs and quality-management processes aligned with ISO 15189:2022 requirements.",
    icon:,
  },
];

const TimelineSection = () => {
  return (
    <section id="timeline" className="section-padding bg-muted">
      <div className="section-container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-12 animate-on-scroll">
          Career Timeline
        </h2>

        <div className="relative">
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
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-background z-10 mt-1" />

                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                    <div className="text-left w-full bg-card p-6 rounded-xl border border-border">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon size={20} className="text-secondary" />
                        <span className="text-xs font-bold text-secondary tracking-wide">{m.year}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground">{m.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{m.desc}</p>
                    </div>
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
