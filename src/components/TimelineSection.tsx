import { Stethoscope, GraduationCap, Building2 } from "lucide-react";

const milestones = [
  {
    year: "2021",
    icon: Building2,
    title: "Kenyatta National Hospital",
    role: "Medical Laboratory Attaché",
    desc: "Clinical training within Kenya’s leading national referral and teaching hospital, rotating across Haematology, Microbiology, Histology, Cytology, Clinical Chemistry, Blood Transfusion, Immunology and Molecular Diagnostics. Gained hands-on experience in specimen management, diagnostic testing, quality control, result interpretation and laboratory workflows in a high-volume clinical environment.",
  },
  {
    year: "2022",
    icon: Stethoscope,
    title: "Nairobi Women's Hospital",
    role: "Medical Laboratory Scientist",
    desc: "Provided diagnostic laboratory services across haematology, microbiology, clinical chemistry, immunology, molecular diagnostics and blood transfusion. Managed specimen collection and processing, quality assurance, equipment maintenance, reporting and critical-result communication. Through the Gender Violence Recovery Centre (GVRC), gained specialised experience handling medico-legal specimens and documentation, coordinating with law-enforcement and legal stakeholders and supporting medical-legal clinics.",
  },
  {
    year: "2024",
    icon: GraduationCap,
    title: "Mount Kenya University",
    role: "Laboratory Manager",
    desc: "Lead laboratory operations across clinical services, quality systems, procurement, equipment management, student training and digital health workflows. Supported the development and modernisation of laboratory infrastructure, SOPs and quality-management processes aligned with ISO 15189:2022 requirements.",
  },
];

const TimelineSection = () => {
  return (
    <section id="timeline" className="section-padding scroll-mt-16 bg-muted">
      <div className="section-container">
        <h2 className="mb-10 text-3xl font-bold text-foreground animate-on-scroll md:mb-14 md:text-4xl">
          Career Timeline
        </h2>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute bottom-0 left-2 top-0 w-px bg-border md:left-32" />

          <div className="space-y-8 md:space-y-10">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.year}
                  className="relative grid grid-cols-1 gap-3 pl-8 animate-on-scroll md:grid-cols-[8rem_minmax(0,1fr)] md:gap-8 md:pl-0"
                >
                  <div className="absolute left-2 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-muted bg-secondary md:left-32 md:top-8" />

                  <div className="flex items-center gap-2 md:justify-end md:pr-5 md:pt-7">
                    <Icon size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                    <span className="text-sm font-bold text-secondary">{m.year}</span>
                  </div>

                  <div className="border border-border bg-card p-5 text-left shadow-sm sm:p-6 md:ml-8 md:p-8">
                    <h3 className="text-xl font-bold leading-snug text-foreground md:text-2xl">{m.title}</h3>
                    <p className="mt-1.5 text-sm font-medium text-secondary md:text-base">{m.role}</p>
                    <div className="mt-5 border-t border-border pt-5">
                      <p className="max-w-3xl text-[0.95rem] leading-7 text-muted-foreground md:text-base md:leading-8">
                        {m.desc}
                      </p>
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
