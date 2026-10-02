import ResponsivePicture from "@/components/ResponsivePicture";
import { responsiveImages } from "@/lib/responsiveImages";
import headshot from "@/assets/headshot.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

const AboutSection = () => (
  <section id="about" className="section-padding scroll-mt-16 bg-background">
    <div className="section-container">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 animate-on-scroll">
        The Man Behind the Work
      </h2>

      <div className="animate-on-scroll flow-root">
        <ResponsivePicture
          sources={responsiveImages.headshot}
          sizes="160px"
          src={headshot}
          alt="Ombachi Enock — Medical Laboratory Scientist"
          className="mx-auto mb-7 h-40 w-40 rounded-lg object-cover shadow-lg md:hidden"
          loading="lazy"
          width={400}
          height={400}
        />
        <figure className="hidden md:float-right md:ml-10 md:mb-7 md:block md:w-[42%] lg:ml-14 lg:w-[39%]">
          <ResponsivePicture
            sources={responsiveImages["hero-portrait"]}
            sizes="(max-width: 768px) 100vw, 40vw"
            src={heroPortrait}
            alt="Ombachi Enock — portrait"
            className="h-auto w-full rounded-lg shadow-xl"
            loading="lazy"
            width={600}
            height={750}
          />
        </figure>

        <div className="space-y-5 text-muted-foreground leading-7 md:text-[1.02rem] md:leading-8">
          <p>
              I am Ombachi Enock, a Medical Laboratory Scientist, technology enthusiast, entrepreneur, and emerging
              voice in climate and public leadership. My work sits at the intersection of healthcare, technology,
              evidence, policy, and human development. I am interested in the questions that emerge when these worlds
              meet: How can technology make healthcare more accessible? How can institutions work better for ordinary
              people? How do we move from reacting to health problems to preventing them? And how can communities build
              the knowledge, systems, and agency they need to thrive?
          </p>
          <p>
              Over the years, I have worked across clinical
              diagnostics, laboratory management, digital health and medico-legal healthcare. My experience has taught
              me to appreciate both the technical and human sides of healthcare. In the laboratory, precision matters.
              In management, systems matter. In digital health, usability matters. In public health, context matters.
              And in all of them, people matter.
          </p>
          <p>
              My interest in technology also extends to education. I believe learning
              should be more flexible, practical, connected to real-world needs, and accessible beyond traditional
              classrooms. This thinking informs my work around Litu Hub, an education platform concept designed to
              support structured digital learning.
          </p>
          <p>
              Another major dimension of my work is climate and planetary health. I
              am convinced that climate change is a human development issue. The effects of extreme weather, changing
              disease patterns, food and water insecurity, displacement, and environmental degradation all shape health
              outcomes and the ability of communities to thrive. I am also interested in the less visible psychological
              dimensions of climate change, including climate anxiety, eco-distress and grief. These issues remind me
              that resilience is the ability of people to understand change, cope with uncertainty, support one another,
              and find meaningful ways to act.
          </p>
          <p>
              My interest in public leadership has evolved alongside my technical
              career. I have pursued public leadership and policy because many of the problems we experience are caused
              by weak systems, fragmented institutions, poor implementation, limited accountability, and incentives that
              reward the wrong outcomes. One idea that has stayed with me is that “every system is perfectly designed to
              get the results it gets.” When a system repeatedly produces the same result, we should examine its
              structures, processes, incentives, assumptions, and relationships.
          </p>
          <p>
              I am also deeply curious. I enjoy
              learning across disciplines because the most interesting solutions emerge between fields. Medical science
              can inform technology. Technology can strengthen public systems. Climate science can reshape healthcare.
              Policy can influence innovation. Education can multiply the impact of all of them. I am still building.
              The path I am taking is shaped by curiosity, experimentation and service.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
