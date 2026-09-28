import { Play } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { Button, ButtonLink, Container } from "./ui";
import { DemoVideoModal, openDemoVideo, useDemoVideoOpen } from "./DemoVideo";
import { HeroShowcase } from "./HeroShowcase";

// Promise line above the headline: every character rises in and falls away on
// its own delay, so a longer line just gets a tighter wave. TICKER_BEAT must
// stay in step with the animation duration on .hero-ticker-char in index.css.
const HERO_TICKER = [
  "স্মার্ট অটোমেশন সিস্টেম",
  "ইনকমপ্লিট ও ফেক অর্ডার ট্র্যাকিং",
  "অ্যাডভান্সড ফ্রড চেক",
  "আনলিমিটেড প্রোডাক্ট ও অর্ডার",
  "ওয়ান-ক্লিক কুরিয়ার ইন্টিগ্রেশন",
  "হাই-কনভার্শন ল্যান্ডিং পেজ",
  "ফ্রি ফেসবুক, টিকটক পিক্সেল",
  "আনলিমিটেড সার্ভার-সাইড ট্র্যাকিং",
  "অ্যাডভান্সড নোটিফিকেশন সিস্টেম",
  "ডুপ্লিকেট অর্ডার ব্লক",
];
const TICKER_BEAT = 3200;
const TICKER_SPREAD = 320;

// Bengali conjuncts and vowel signs have to stay in one piece, so the line is
// split by grapheme cluster, never by code point.
const grapheme = new Intl.Segmenter("bn", { granularity: "grapheme" });
const VIRAMA = "\u09CD";

// Grapheme rules still split অ + ্ + য into "অ্" + "যা" — অ is a vowel, not a
// consonant, so the ya-phala is not treated as one unit. Rendered as two boxes
// the virama shows up bare and the word looks broken, so a cluster that ends in
// a virama stays joined to the next one.
function clusters(word: string) {
  const parts: string[] = [];
  for (const part of grapheme.segment(word)) {
    if (parts[parts.length - 1]?.endsWith(VIRAMA))
      parts[parts.length - 1] += part.segment;
    else parts.push(part.segment);
  }
  return parts;
}

export function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [entered, setEntered] = useState(false);
  const [ticker, setTicker] = useState(0);
  const videoOpen = useDemoVideoOpen();

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  // Entrance animation for the showcase column
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // One promise at a time. The tail of every cycle is empty, so a late timer
  // never cuts a line short.
  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(
      () => setTicker((i) => (i + 1) % HERO_TICKER.length),
      TICKER_BEAT,
    );
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  // Words are kept whole so a long promise wraps between them, never inside,
  // and the character delay keeps counting across the whole line.
  let charIndex = 0;
  const tickerWords = HERO_TICKER[ticker].split(" ").map((word) => {
    const start = charIndex;
    const chars = clusters(word);
    charIndex += chars.length + 1;
    return { chars, start };
  });
  const charStep =
    TICKER_SPREAD / Math.max(charIndex - tickerWords.length - 1, 1);

  return (
    <section
      id="top"
      className="hero-shell relative isolate overflow-hidden bg-[#f1f7f3] text-ink-700 dark:bg-[#06130e] dark:text-ink-300"
    >
      {/* Aurora background */}
      <div className="hero-aurora" aria-hidden="true">
        <i className="hero-orb hero-orb-one" />
        <i className="hero-orb hero-orb-two" />
        <i className="hero-orb hero-orb-three" />
        <div className="hero-dotfield">
          <i className="hero-dots" />
          <i className="hero-dots hero-dots-lit" />
        </div>
      </div>

      {/* `hero-grid` flips the split in the showcase column's favour from
          1200px up — see the rule in index.css. */}
      <Container className="hero-grid relative grid gap-10 pb-10 pt-10 lg:grid-cols-[1.02fr_1fr] lg:gap-6 lg:pb-8">
        {/* Left: hero copy */}
        <section className="hero-copy max-w-2xl" aria-labelledby="hero-heading">
          {/* Promise line above the headline. All of them are stacked in one
              grid cell, so the tallest reserves the height and the h1 below
              never moves. The key remounts the live line each turn, which
              restarts every character's rise and fall. */}
          <div className="hero-ticker-wrap mb-3">
            <div className="hero-ticker-text grid font-display font-extrabold leading-[1.24] tracking-normal text-brand-600 dark:text-brand-400">
              {HERO_TICKER.map((line) => (
                <span key={line} className="invisible col-start-1 row-start-1">
                  {line}
                </span>
              ))}
              <p
                key={ticker}
                className="col-start-1 row-start-1 justify-self-start self-center"
              >
                {tickerWords.map(({ chars, start }, w) => (
                  <Fragment key={w}>
                    <span className="hero-ticker-word">
                      {chars.map((char, i) => (
                        <span
                          key={i}
                          className="hero-ticker-char"
                          style={{
                            animationDelay: `${Math.round((start + i) * charStep)}ms`,
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                    {w < tickerWords.length - 1 && " "}
                  </Fragment>
                ))}
              </p>
            </div>
          </div>
          <h1
            id="hero-heading"
            className="hero-heading font-display font-extrabold leading-[1.24] tracking-normal text-ink-900 dark:text-white"
          >
            <span className="block">
              Ecom
              <span className="text-brand-600 dark:text-brand-400">
                Byte
              </span>{" "}
              আপনার অনলাইন ব্যবসার স্মার্ট এবং সহজ সমাধান
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-[clamp(1.05rem,1.6vw,1.2rem)] leading-relaxed text-ink-600 dark:text-ink-300">
            প্রোডাক্ট ম্যানেজমেন্ট থেকে শুরু করে পেমেন্ট এবং ডেলিভারি ট্র্যাকিং
            আপনার পুরো ব্যবসা নিয়ন্ত্রণ করুন, আধুনিক সব ফিচারে সাজানো আমাদের এই
            ecomByte প্ল্যাটফর্মে। আপনি ফোকাস করুন ব্যবসায়, আর বাকি সবকিছুর
            খেয়াল রাখবে ecomByte
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <ButtonLink
              href="https://wa.me/8801891614300"
              size="lg"
              className="hero-primary btn-shine bg-[#00694d] text-white shadow-[0_12px_26px_-12px_#00694d] hover:bg-[#0b8a66]"
            >
              ফ্রি ট্রায়াল শুরু করুন
            </ButtonLink>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={(event) => openDemoVideo(event.currentTarget)}
              aria-haspopup="dialog"
              aria-expanded={videoOpen}
              className="border-ink-300/70 bg-white/60 text-ink-900 backdrop-blur dark:border-white/20 dark:bg-white/10 dark:text-white"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              ফিচারস গুলো দেখুন
            </Button>
          </div>
        </section>

        {/* Right: animated feature showcase */}
        <aside
          className={`relative mx-auto w-full max-w-2xl transition-all duration-1000 ease-out ${
            entered ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* Floating glow behind the showcase card */}
          <div
            className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-brand-400/20 via-emerald-300/10 to-teal-500/15 blur-2xl dark:from-brand-500/15 dark:via-emerald-400/8 dark:to-teal-400/10"
            aria-hidden="true"
          />
          <HeroShowcase />
        </aside>
      </Container>

      {/* The demo popup itself lives in <DemoVideoModal />, which portals to
          <body> so neither the sticky navbar nor the hero's own stacking
          context can paint over it. One instance, shared with the navbar. */}
      <DemoVideoModal />
    </section>
  );
}
