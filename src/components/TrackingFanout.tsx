import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Globe, Server, ShieldCheck } from "lucide-react";
import { bn } from "../utils/bn";

/*
 * Server-side tracking in one picture: the website captures an event and ships
 * it to the server (leg 1), and the server fans that same event out to the ad
 * platforms — Facebook → Instagram → TikTok → Google (leg 2).
 *
 * Both legs are built from the same parts — BAR_H / BAR_V for the dashed bar and
 * DOT / DOT_TRAVEL for the moving dot — so the website → server run and the
 * server → platform runs are the same animation, on one clock (TRACK_DOT /
 * TRACK_STAGGER). The dots, the landing flashes and the logo pulses stay in step
 * with no state or extra timers.
 *
 * The same block is slide 6 of the hero carousel and the standalone section, so
 * the two can never drift apart.
 */
const TRACK_EVENTS = ["PageView", "Add to Cart", "Purchase", "Checkout"];

// Where the server hands the data on to; the marks live in the repo at
// public/images/platforms (same idea as the courier logos on slide 4).
const PLATFORMS = [
  { name: "Facebook", src: "/images/platforms/facebook.svg" },
  { name: "Instagram", src: "/images/platforms/instagram.svg" },
  { name: "TikTok", src: "/images/platforms/tiktok.svg" },
  { name: "Google", src: "/images/platforms/google.svg" },
];

// A platform pill is a 36px row with a 6px gap (h-9 / gap-1.5 below), so its
// centre sits at 18 + i·42px and the spine runs first centre to last centre.
const PILL_H = 36;
const PILL_GAP = 6;
// One clock for both legs: a dot takes TRACK_DOT ms to cross its bar, and dots
// leave TRACK_STAGGER ms apart — leg 2 staggers one dot per platform.
const TRACK_DOT = 1700;
const TRACK_STAGGER = 550;
// The bar and the dot are shared by both legs, so neither can end up looking or
// moving differently from the other.
const BAR_H = "h-0 border-t-2 border-dashed border-ink-200 dark:border-white/15";
const BAR_V = "border-l-2 border-dashed border-ink-200 dark:border-white/15";
const DOT =
  "absolute h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]";
const DOT_TRAVEL = { left: ["0%", "100%"], opacity: [0, 1, 1, 0] };
// Equal at every width: leg 1 and the fan-out leg are the same flex item —
// flex-1 with the same margins — so each bar takes an equal share of the spare
// width and the server sits exactly midway between the website and the
// platforms. The bars grow on big screens; the platform pills stay a fixed
// width so they don't swallow the row.
const LEG = "mx-1.5 min-w-[36px] flex-1 sm:mx-2.5 sm:min-w-[84px]";

export function TrackingFanout({ reduced }: { reduced: boolean }) {
  const [events, setEvents] = useState(reduced ? 1284 : 0);
  const [ev, setEv] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setEvents((e) => e + 1 + Math.floor(Math.random() * 3)),
      650,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setEv((i) => (i + 1) % TRACK_EVENTS.length),
      1400,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <div className="flex items-center">
        <div className="flex h-16 w-[76px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-ink-100 bg-white shadow-sm sm:h-20 sm:w-[104px] dark:border-white/10 dark:bg-white/[0.05]">
          <Globe
            className="h-6 w-6 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold text-ink-700 dark:text-ink-200">
            ওয়েবসাইট
          </span>
        </div>

        <div className={`relative ${LEG}`}>
          <AnimatePresence mode="wait">
            <motion.span
              key={ev}
              initial={reduced ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md border border-ink-100 bg-white px-1.5 py-0.5 font-mono text-[9px] font-bold whitespace-nowrap text-ink-600 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-ink-200"
            >
              {TRACK_EVENTS[ev]}
            </motion.span>
          </AnimatePresence>
          <div className={BAR_H} />
          {[0, 1, 2].map((i) =>
            reduced ? (
              <span
                key={i}
                className={`-top-1 ${DOT}`}
                style={{ left: `${25 + i * 25}%` }}
              />
            ) : (
              <motion.span
                key={i}
                className={`-top-1 left-0 ${DOT}`}
                animate={DOT_TRAVEL}
                transition={{
                  duration: TRACK_DOT / 1000,
                  repeat: Infinity,
                  delay: (i * TRACK_STAGGER) / 1000,
                  ease: "linear",
                }}
              />
            ),
          )}
        </div>

        <div className="flex h-16 w-[76px] shrink-0 flex-col justify-center gap-1.5 rounded-xl border border-ink-100 bg-white p-2 shadow-sm sm:h-20 sm:w-[104px] dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex items-center gap-1.5">
            <Server
              className="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold text-ink-700 dark:text-ink-200">
              সার্ভার
            </span>
          </div>
          <div className="flex gap-1 pl-0.5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                animate={reduced ? undefined : { opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* Fan-out: the same events go on from the server to the ad platforms,
            one dot per platform — Facebook → Instagram → TikTok → Google. Same
            gap, same bar and same dot animation as the leg on the left. */}
        {/* flex-[1.5] vs the left bar's flex-1: the pills eat into this column,
            so it needs the bigger share for the two bars to look equal — and
            the server to sit left of centre, nearer the website. */}
        <div className="flex min-w-0 flex-[1.5] flex-col gap-1.5">
          <span className="text-center text-[9px] font-bold text-ink-400 dark:text-ink-500">
            অ্যাড প্ল্যাটফর্ম
          </span>

          <div className="flex">
            <div className={`relative ${LEG}`} aria-hidden="true">
              {/* stub: server → spine */}
              <span className={`absolute top-1/2 left-0 w-1/2 ${BAR_H}`} />
              {/* spine: first platform centre → last platform centre */}
              <span
                className={`absolute left-1/2 ${BAR_V}`}
                style={{ top: PILL_H / 2, bottom: PILL_H / 2 }}
              />
              {/* one drop per platform, each carrying a dot */}
              {PLATFORMS.map((platform, i) => (
                <span
                  key={platform.name}
                  className={`absolute left-1/2 w-1/2 ${BAR_H}`}
                  style={{ top: PILL_H / 2 + i * (PILL_H + PILL_GAP) }}
                >
                  {reduced ? (
                    <span className={`-top-1 left-1/2 ${DOT}`} />
                  ) : (
                    <motion.span
                      className={`-top-1 left-0 ${DOT}`}
                      animate={DOT_TRAVEL}
                      transition={{
                        duration: TRACK_DOT / 1000,
                        repeat: Infinity,
                        delay: (i * TRACK_STAGGER) / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                </span>
              ))}
            </div>

            {/* the platforms, white in dark mode too like the courier row, so
                the black TikTok mark keeps its contrast. Fixed width instead of
                flex-1: the pills shouldn't stretch across the whole card — the
                spare width belongs to the animated bars. */}
            <div className="flex w-[120px] shrink-0 flex-col gap-1.5 sm:w-[160px]">
              {PLATFORMS.map((platform, i) => (
                <div
                  key={platform.name}
                  className="relative flex h-9 items-center gap-2 rounded-lg border border-ink-100 bg-white px-2.5 shadow-sm dark:border-white/10"
                >
                  <motion.img
                    src={platform.src}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="h-4 w-4 shrink-0 object-contain"
                    animate={reduced ? undefined : { scale: [1, 1.18, 1] }}
                    transition={{
                      duration: 0.5,
                      times: [0, 0.15, 1],
                      repeat: Infinity,
                      repeatDelay: (TRACK_DOT - 500) / 1000,
                      delay: (i * TRACK_STAGGER + TRACK_DOT) / 1000,
                    }}
                  />
                  <span className="hidden min-w-0 truncate text-[11px] font-bold text-ink-700 sm:block dark:text-ink-200">
                    {platform.name}
                  </span>
                  {!reduced && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-lg border-2 border-emerald-400"
                      animate={{ opacity: [0, 0.85, 0] }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.15, 1],
                        repeat: Infinity,
                        repeatDelay: (TRACK_DOT - 500) / 1000,
                        delay: (i * TRACK_STAGGER + TRACK_DOT) / 1000,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-[11px] font-bold text-ink-800 shadow-sm tabular-nums dark:border-white/10 dark:bg-white/5 dark:text-ink-100">
          <Activity
            className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
            aria-hidden="true"
          />
          {bn(events)} ইভেন্ট ট্র্যাক হয়েছে
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00694d] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          অ্যাড-ব্লকার প্রুফ
        </span>
      </div>

      <p className="text-center text-[10.5px] leading-relaxed text-ink-500 dark:text-ink-400">
        ব্রাউজার বাইপাস করে সার্ভার থেকেই সব ডেটা — ১০০% নির্ভুল ট্র্যাকিং
      </p>
    </div>
  );
}
