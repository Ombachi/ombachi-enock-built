import headshot from "@/assets/headshot.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

const AboutSection = () => (
  <section id="about" className="section-padding bg-background">
    <div className="section-container">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 animate-on-scroll">
        The Man Behind the Work
      </h2>

      <div className="grid md:grid-cols-12 gap-10 lg:gap-14 items-start animate-on-scroll">
        <div className="md:col-span-7 order-2 md:order-1">
          <div className="flex md:hidden justify-center mb-6">
            <img
              src={headshot}
              alt="Ombachi Enock — Medical Laboratory Scientist"
              className="w-36 h-36 rounded-2xl object-cover shadow-lg"
              loading="lazy"
              width={400}
              height={400}
            />
          </div>
          <div className="space-y-5">
            <p className="text-muted-foreground leading-relaxed">
              I am Ombachi Enock, a Medical Laboratory Scientist, technology enthusiast, entrepreneur, and emerging
              voice in climate and public leadership. My work sits at the intersection of healthcare, technology,
              evidence, policy, and human development. I am interested in the questions that emerge when these worlds
              meet: How can technology make healthcare more accessible? How can institutions work better for ordinary
              people? How do we move from reacting to health problems to preventing them? And how can communities build
              the knowledge, systems, and agency they need to thrive? Over the years, I have worked across clinical
              diagnostics, laboratory management, digital health and medico-legal healthcare. My experience has taught
              me to appreciate both the technical and human sides of healthcare. In the laboratory, precision matters.
              In management, systems matter. In digital health, usability matters. In public health, context matters.
              And in all of them, people matter. My interest in technology also extends to education. I believe learning
              should be more flexible, practical, connected to real-world needs, and accessible beyond traditional
              classrooms. This thinking informs my work around Litu Hub, an education platform concept designed to
              support structured digital learning. Another major dimension of my work is climate and planetary health. I
              am convinced that climate change is a human development issue. The effects of extreme weather, changing
              disease patterns, food and water insecurity, displacement, and environmental degradation all shape health
              outcomes and the ability of communities to thrive. I am also interested in the less visible psychological
              dimensions of climate change, including climate anxiety, eco-distress and grief. These issues remind me
              that resilience is the ability of people to understand change, cope with uncertainty, support one another,
              and find meaningful ways to act. My interest in public leadership has evolved alongside my technical
              career. I have pursued public leadership and policy because many of the problems we experience are caused
              by weak systems, fragmented institutions, poor implementation, limited accountability, and incentives that
              reward the wrong outcomes. One idea that has stayed with me is that “every system is perfectly designed to
              get the results it gets.” When a system repeatedly produces the same result, we should examine its
              structures, processes, incentives, assumptions, and relationships. I am also deeply curious. I enjoy
              learning across disciplines because the most interesting solutions emerge between fields. Medical science
              can inform technology. Technology can strengthen public systems. Climate science can reshape healthcare.
              Policy can influence innovation. Education can multiply the impact of all of them. I am still building.
              The path I am taking is shaped by curiosity, experimentation and service.
            </p>
          </div>
        </div>
        <div className="md:col-span-5 order-1 md:order-2 hidden md:block">
          <div className="relative">
            <img
              src={heroPortrait}
              alt="Ombachi Enock — portrait"
              className="w-full aspect-[4/5] rounded-2xl object-cover shadow-xl"
              loading="lazy"
              width={600}
              height={750}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
