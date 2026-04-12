import headshot from "@/assets/headshot.jpg";

const AboutSection = () => (
  <section id="about" className="section-padding bg-background">
    <div className="section-container">
      <p className="text-sm font-medium tracking-widest uppercase text-secondary mb-3 animate-on-scroll">About</p>
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6 animate-on-scroll">
        The Person Behind the Work
      </h2>

      <div className="max-w-3xl animate-on-scroll">
        <div className="flex justify-center md:justify-start mb-6">
          <img
            src={headshot}
            alt="Ombachi Enock — Medical Laboratory Scientist"
            className="w-48 h-48 rounded-2xl object-cover shadow-lg"
            loading="lazy"
            width={800}
            height={800}
          />
        </div>
        <div className="space-y-5">
          <p className="text-muted-foreground leading-relaxed">
            I'm a Medical Laboratory Scientist and Laboratory Manager at <a href="https://mku.ac.ke" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Mount Kenya University</a>, where I oversee lab operations, curriculum development, and student mentorship. My work sits at the intersection of diagnostics, health systems strengthening, and climate-health resilience.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            As the founder of <a href="https://litudiagnostics.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Litu Diagnostics</a>, I'm working to decentralise quality laboratory services—bringing reliable testing closer to communities that have been underserved. I'm also the author of <a href="https://medium.com/@litusoja" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Litu Musings</a>, where I write about diagnostics, climate-health, and leadership.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My journey started in clinical laboratories at <a href="https://nwh.co.ke" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Nairobi Women's Hospital</a>, where hands-on patient care shaped my understanding of what works—and what doesn't—in healthcare delivery.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
