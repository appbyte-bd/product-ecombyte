import { Container, Reveal, SectionHeading } from "./ui";
import { TrackingFanout } from "./TrackingFanout";

/*
 * Standalone section for আনলিমিটেড সার্ভার-সাইড ট্র্যাকিং. It renders exactly the
 * block that slide 6 of the hero carousel shows — same card surface, same
 * h-[260px] stage, same diagram — because both use <TrackingFanout />. The
 * carousel's own chrome (arrows, dots, counter) stays in the carousel.
 */
export function ServerTracking() {
  return (
    <section
      id="server-tracking"
      aria-labelledby="server-tracking-title"
      className="relative scroll-mt-24 py-10 sm:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />

      <Container>
        <SectionHeading
          id="server-tracking-title"
          title={
            <>
              আনলিমিটেড{" "}
              <span className="text-brand-600 dark:text-brand-400">
                সার্ভার-সাইড ট্র্যাকিং
              </span>
            </>
          }
          subtitle="ব্রাউজার বাইপাস করে সার্ভার থেকেই ইভেন্ট যায় — Facebook, Instagram, TikTok আর Google-এ ১০০% নির্ভুল ডেটা, অ্যাড-ব্লকারেও আটকায় না।"
        />
      </Container>

      {/* Same container width as the OrderTools tiles, so the card lines up
          with the courier and fraud cards instead of sitting narrow in the
          middle of the row. */}
      <Container className="mt-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-5 font-bangla shadow-[0_24px_80px_-20px_rgba(0,80,50,0.22),0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1f18]/80 dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            {/* `reduced={false}`: like the carousel, this demo is the proof of
                the feature, so it always animates — the visitor's reduced
                motion setting keeps controlling the page's decorative motion. */}
            <div className="relative h-[260px]" aria-hidden="true">
              <TrackingFanout reduced={false} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
