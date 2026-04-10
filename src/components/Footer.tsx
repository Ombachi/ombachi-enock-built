const Footer = () => (
  <footer className="py-8 border-t border-border bg-background">
    <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <p>© {new Date().getFullYear()} Ombachi Enock. All rights reserved.</p>
      <p>Medical Laboratory Scientist · Health Systems Builder</p>
    </div>
  </footer>
);

export default Footer;
