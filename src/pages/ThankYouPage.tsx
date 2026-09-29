import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";

const ThankYouPage = () => (
  <PageTransition>
    <Helmet>
      <title>Thank you — Ombachi Enock</title>
      <meta name="description" content="Your message to Ombachi Enock has been received." />
      <link rel="canonical" href="https://ombachi-enock-built.lovable.app/thank-you" />
      <meta name="robots" content="noindex" />
    </Helmet>
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="section-container flex flex-1 items-center py-28">
        <div className="max-w-2xl">
          <CheckCircle2 className="mb-6 h-12 w-12 text-secondary" aria-hidden="true" />
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Message received</p>
          <h1 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">Thank you for reaching out.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            I have received your message and will respond as soon as I can. In the meantime, you can explore my work or read the latest publications.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/#work">Explore my work <ArrowRight aria-hidden="true" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/library">Browse publications</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </PageTransition>
);

export default ThankYouPage;