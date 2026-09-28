import { Container, Reveal, SectionHeading } from "./ui";
import { LandingPageVisual } from "./LandingPageVisual";

/*
 * Standalone section for আনলিমিটেড ল্যান্ডিং পেজ ডিজাইন. It shows the same
 * visual as slide 2 of the hero carousel via <LandingPageVisual />, but scaled
 * up for the wider section layout — taller stage, no card surface behind it.
 * The carousel's own chrome (arrows, dots, counter) stays in the carousel.
 */
export function LandingPages() {
  return (
    <section
      id="landing-pages"
      aria-labelledby="landing-pages-title"
      className="relative scroll-mt-24 py-10 sm:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />

      <Container>
        <SectionHeading
          id="landing-pages-title"
          title={
            <>
              আনলিমিটেড{" "}
              <span className="text-brand-600 dark:text-brand-400">
                ল্যান্ডিং পেজ ডিজাইন
              </span>
            </>
          }
          subtitle="ব্লক-ভিত্তিক বিল্ডার দিয়ে প্রতিটি অফারের জন্য আলাদা ল্যান্ডিং পেজ — সরাসরি সেখান থেকেই অর্ডার নিন।"
        />
      </Container>

      <Container className="mt-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-white/60 font-bangla dark:border-white/10">
            <div className="relative h-[340px]" aria-hidden="true">
              <LandingPageVisual className="h-[320px] w-full max-w-[300px] object-contain" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
