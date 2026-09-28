import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCheck,
  CheckCircle2,
  Copy,
  Send,
  ShieldAlert,
  Sparkles,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Container,
  Counter,
  Reveal,
  SectionHeading,
  SpotlightCard,
} from "./ui";
import { cn } from "../utils/cn";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const bn = (n: number) => n.toLocaleString("bn-BD", { useGrouping: false });

/* ---------- Shared bits ---------- */

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  activeClassName,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  activeClassName?: (value: T) => string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex w-full gap-1 rounded-full border border-ink-100 bg-ink-50 p-1 dark:bg-white/5"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-full px-2 py-1.5 text-center text-xs leading-tight font-semibold transition-all duration-300 sm:text-[13px]",
              active
                ? cn(
                    "bg-white text-ink-900 shadow-soft dark:bg-ink-800 dark:text-ink-50",
                    activeClassName?.(o.value),
                  )
                : "text-ink-500 hover:text-ink-700",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- 1. Courier booking ---------- */

type Courier = {
  value: string;
  slug: string;
  prefix: string;
  ext: string;
};

const couriers: Courier[] = [
  { value: "Steadfast", slug: "steadfast", prefix: "SF", ext: "png" },
  { value: "Pathao", slug: "pathao", prefix: "PT", ext: "png" },
  { value: "RedX", slug: "redx", prefix: "RX", ext: "png" },
  { value: "Carrybee", slug: "carrybee", prefix: "CB", ext: "webp" },
];

// The known file is tried first; a couple of other spellings follow before the
// card falls back to the courier's name, so a renamed file never breaks it.
const LOGO_EXT = ["png", "webp", "svg", "jpg"];

function logoSources(slug: string, ext: string) {
  const order = [ext, ...LOGO_EXT.filter((e) => e !== ext)];
  return [slug, `${slug}-logo`, `${slug}_logo`].flatMap((n) =>
    order.map((e) => `/images/courier/${n}.${e}`),
  );
}

function CourierLogo({
  courier,
  className,
}: {
  courier: Courier;
  className?: string;
}) {
  const sources = useMemo(
    () => logoSources(courier.slug, courier.ext),
    [courier.slug, courier.ext],
  );
  const [i, setI] = useState(0);

  if (i >= sources.length) {
    // Height utilities from the caller are dropped so a missing file can never
    // stretch the text fallback into an odd shape.
    return (
      <span
        className={cn(
          "h-auto w-auto max-w-full truncate text-[10px] leading-none font-bold tracking-tight text-ink-700",
          className,
        )}
      >
        {courier.value}
      </span>
    );
  }

  return (
    <img
      src={sources[i]}
      alt={courier.value}
      loading="lazy"
      decoding="async"
      onError={() => setI((n) => n + 1)}
      className={cn("object-contain", className)}
    />
  );
}

const steps = ["অর্ডার কনফার্ম", "প্যাকড", "কুরিয়ারে", "ডেলিভারড"];

const statuses = [
  { label: "ড্রাফট", tone: "bg-ink-100 text-ink-500 dark:bg-white/10" },
  { label: "কনফার্মড", tone: "bg-brand-50 text-brand-700" },
  { label: "প্যাকড", tone: "bg-brand-50 text-brand-700" },
  { label: "কুরিয়ারে", tone: "bg-amber-50 text-amber-700" },
  { label: "ডেলিভারড", tone: "bg-brand-600 text-white" },
];

const parcel = [
  { label: "প্রাপক", value: "জান্নাতুল ফেরদৌস" },
  { label: "মোবাইল", value: "০১৮৯১৬১৪৩০০" },
  { label: "ঠিকানা", value: "খিলগাঁও, ঢাকা-১২১৯" },
  { label: "পার্সেল", value: "১টি · জামদানি শাড়ি" },
  { label: "COD অ্যামাউন্ট", value: "৳৪,৮০০", strong: true },
];

// How long one courier holds the stage before the next takes over, and how
// fast the dispatch steps tick along underneath it.
const HOLD_MS = 3600;
const STEP_MS = 430;

function CourierTile() {
  // Deliberately ignores prefers-reduced-motion: some Windows machines ship
  // with the OS "Animation effects" toggle off, which makes every browser
  // report reduced motion — and then the demo would never animate at all.
  const cardRef = useRef<HTMLDivElement>(null);
  // The demo only runs while the card is on screen, and starts over the moment
  // the card scrolls back in, so a visitor who went down the page never comes
  // back to a card that looks stopped.
  const inView = useInView(cardRef, { margin: "-80px" });
  const [index, setIndex] = useState(0);
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [booked, setBooked] = useState(false);

  const courier = couriers[index];
  const status = statuses[Math.min(progress, steps.length)];
  const bookingId = `${courier.prefix}-${bn(482191 + cycle * 733)}`;

  // Couriers rotate on their own until the visitor picks one. The timer is keyed
  // on the current courier, so each switch gets a full turn instead of picking
  // up a stale interval — and nothing about the cursor can stall it, because a
  // resting pointer must never freeze the demo.
  useEffect(() => {
    if (!auto || !inView) return;
    const id = window.setTimeout(
      () => setIndex((i) => (i + 1) % couriers.length),
      HOLD_MS,
    );
    return () => window.clearTimeout(id);
  }, [auto, inView, index]);

  // Every pick (a fresh booking, or the card scrolling back into view) replays
  // the dispatch steps, so the card keeps demonstrating the one-tap flow.
  useEffect(() => {
    if (!inView) return;
    setBooked(false);
    setProgress(0);
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setProgress(n);
      if (n >= steps.length) {
        window.clearInterval(id);
        setBooked(true);
      }
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [index, cycle, inView]);

  const pick = (i: number) => {
    setAuto(false);
    setIndex(i);
  };

  const railWidth = `${(
    (Math.max(progress - 1, 0) / (steps.length - 1)) *
    75
  ).toFixed(2)}%`;

  return (
    <SpotlightCard className="rounded-[2rem] border border-ink-100 bg-white p-6 shadow-lift transition-all duration-500 hover:border-brand-200 sm:p-9 lg:p-10">
      <div
        ref={cardRef}
        className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12"
      >
        {/* ---------- Left: booking controls ---------- */}
        <div>
          <div
            role="group"
            aria-label="কুরিয়ার বেছে নিন"
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {couriers.map((c, i) => {
              const active = i === index;
              return (
                <motion.button
                  key={c.value}
                  type="button"
                  aria-pressed={active}
                  aria-label={c.value}
                  onClick={() => pick(i)}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    "group/logo relative flex h-16 items-center justify-center rounded-2xl border bg-white px-4 transition-all duration-300 sm:h-18",
                    active
                      ? "border-brand-400 shadow-lift ring-1 ring-brand-400"
                      : "border-ink-100 opacity-60 grayscale hover:-translate-y-0.5 hover:border-ink-200 hover:opacity-100 hover:grayscale-0",
                  )}
                >
                  <CourierLogo
                    courier={c}
                    className="h-6 w-auto max-w-full transition-transform duration-300 group-hover/logo:scale-105 sm:h-8"
                  />
                  {active && (
                    <motion.span
                      layoutId="courier-pick"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 26,
                      }}
                      className="absolute -top-2 -right-2 grid h-5.5 w-5.5 place-items-center rounded-full bg-brand-600 text-white shadow-soft"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Dispatch rail */}
          <div className="relative mt-8">
            <span
              aria-hidden
              className="absolute top-3.5 right-[12.5%] left-[12.5%] h-0.5 rounded-full bg-ink-100 dark:bg-white/10"
            />
            <motion.span
              aria-hidden
              initial={false}
              animate={{ width: railWidth }}
              transition={{ duration: 0.5, ease }}
              className="absolute top-3.5 left-[12.5%] h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-sky-400"
            />
            <ol
              className="relative grid grid-cols-4 gap-1"
              aria-label="ডেলিভারির ধাপ"
            >
              {steps.map((s, i) => {
                const done = i < progress;
                return (
                  <li
                    key={s}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <motion.span
                      aria-hidden
                      animate={done ? { scale: [1, 1.22, 1] } : { scale: 1 }}
                      transition={{ duration: 0.4, ease }}
                      className={cn(
                        "grid h-7 w-7 place-items-center rounded-full border-2 transition-colors duration-500",
                        done
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-ink-200 bg-white",
                      )}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-200" />
                      )}
                    </motion.span>
                    <span
                      className={cn(
                        "text-[11px] leading-tight transition-colors duration-500 sm:text-xs",
                        done ? "font-semibold text-ink-900" : "text-ink-400",
                      )}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-8 flex flex-nowrap items-center gap-3">
            <Button
              size="md"
              className="shrink-0"
              onClick={() => setCycle((c) => c + 1)}
            >
              {booked
                ? `${courier.value}-এ আবার বুক করুন`
                : `${courier.value}-এ বুক করুন`}
            </Button>
            <span
              className="min-w-0 truncate text-xs text-ink-400"
              aria-live="polite"
            >
              {booked ? "বুকিং সম্পন্ন" : "বুকিং হচ্ছে…"}
            </span>
          </div>
        </div>

        {/* ---------- Right: auto-filled dispatch sheet ---------- */}
        <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-brand-50/60 p-5 shadow-soft sm:p-6 dark:from-white/5 dark:via-transparent dark:to-brand-950/20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-brand-300/25 blur-3xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-white px-2.5 shadow-soft dark:bg-ink-800">
                <CourierLogo
                  courier={courier}
                  className="h-4 w-auto max-w-24"
                />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-ink-900">
                  ডিসপ্যাচ শিট
                </p>
                <p className="text-[11px] text-ink-500">অর্ডার #৪৮২১৯</p>
              </div>
            </div>
            <motion.span
              key={status.label}
              initial={{ opacity: 0, y: -8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease }}
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                status.tone,
              )}
            >
              {status.label}
            </motion.span>
          </div>

          <dl className="relative mt-5 grid gap-2">
            {parcel.map((row, i) => (
              <motion.div
                key={`${courier.slug}-${row.label}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  backgroundColor: [
                    "rgba(16,185,129,0.18)",
                    "rgba(16,185,129,0.18)",
                    "rgba(16,185,129,0)",
                  ],
                }}
                transition={{ duration: 0.7, delay: i * 0.09, ease }}
                className="flex items-center justify-between gap-4 rounded-xl bg-white/80 px-3.5 py-2.5 dark:bg-white/5"
              >
                <dt className="text-xs whitespace-nowrap text-ink-500">
                  {row.label}
                </dt>
                <dd
                  className={cn(
                    "truncate text-sm font-semibold text-ink-900",
                    row.strong &&
                      "text-base font-bold text-brand-700 sm:text-lg",
                  )}
                >
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </dl>

          <div className="relative mt-4 flex flex-col gap-3">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-700">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              অর্ডার থেকে তথ্য নিজে থেকেই বসে গেছে
            </p>
            {/* Always mounted, only faded: a mounting chip would resize the card
                on every booking cycle and shove the sections below it around. */}
            <motion.p
              initial={false}
              animate={{ opacity: booked ? 1 : 0, scale: booked ? 1 : 0.94 }}
              transition={{ duration: 0.3, ease }}
              aria-hidden={!booked}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-950 px-3.5 py-1.5 text-[11px] font-semibold text-white"
            >
              <Check className="h-3.5 w-3.5 shrink-0 text-brand-300" />
              {courier.value}-এ বুক হয়েছে · #{bookingId}
            </motion.p>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}

/* ---------- 2. Fake order shield ---------- */

type Tone = "safe" | "warn" | "danger";

interface RiskProfile {
  // Success score, not risk score: higher is a safer buyer, and the gauge arc
  // fills up as it climbs. See the reversal note on `risks` below.
  success: number;
  label: string;
  action: string;
  cta: string;
  variant: "primary" | "dark" | "secondary";
  ctaClass: string;
  color: string;
  chip: string;
  tone: Tone;
  buyer: string;
  signals: { label: string; weight: number }[];
}

// Success scores, not risk scores: a safe buyer scores above 90 while fraud sits
// near the floor. The middle profile keeps its original number — only the
// gauge's meaning was reversed, the analysis panel is unchanged.
const risks: Record<"ok" | "mid" | "bad", RiskProfile> = {
  ok: {
    success: 94,
    label: "নিরাপদ",
    action: "অটো কনফার্ম হবে",
    cta: "এক ক্লিকে কনফার্ম করুন",
    variant: "primary",
    ctaClass: "",
    color: "#10b981",
    chip: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
    tone: "safe",
    buyer: "সাদিয়া ইসলাম · ঢাকা",
    // Every row is one courier's record of this buyer, in the order
    // Steadfast, Pathao, RedX, Carrybee — the logo is picked by row index.
    signals: [
      { label: "৯টি পার্সেল, সব ডেলিভারড", weight: 96 },
      { label: "৭টি পার্সেল, ১টি রিটার্ন", weight: 90 },
      { label: "নম্বরটি ভেরিফায়েড, ২ বছর পুরনো", weight: 94 },
      { label: "গড় ডেলিভারি সময় ৩৬ ঘণ্টা", weight: 88 },
    ],
  },
  mid: {
    success: 56,
    label: "সতর্ক",
    action: "ফোনে যাচাই করুন",
    cta: "কল দিয়ে যাচাই করুন",
    variant: "dark",
    ctaClass: "",
    color: "#e4a12a",
    chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    tone: "warn",
    buyer: "আরিফ চৌধুরী · ময়মনসিংহ",
    signals: [
      { label: "৫টি পার্সেলের ২টি রিটার্ন", weight: 52 },
      { label: "কোনো অর্ডার হিস্ট্রি নেই", weight: 62 },
      { label: "নম্বরটি মাত্র ৩ দিনের পুরনো", weight: 58 },
      { label: "ডেলিভারি ঠিকানা যাচাই হয়নি", weight: 44 },
    ],
  },
  bad: {
    success: 7,
    label: "ঝুঁকিপূর্ণ",
    action: "অর্ডার আটকে দিন",
    cta: "অর্ডার আটকে দিন",
    variant: "secondary",
    ctaClass:
      "border-accent-500 bg-accent-500 text-white hover:border-accent-600 hover:bg-accent-600",
    color: "#f43f5e",
    chip: "bg-accent-500/10 text-accent-600 ring-1 ring-accent-500/30",
    tone: "danger",
    buyer: "একই ঠিকানায় ৪টি নাম",
    signals: [
      { label: "গত ৩০ দিনে ৩টি রিটার্ন", weight: 95 },
      { label: "৩টি COD পেমেন্ট নেওয়া হয়নি", weight: 91 },
      { label: "একই ঠিকানায় ৪টি আলাদা নাম", weight: 88 },
      { label: "ভেরিফিকেশন কলে সাড়া দেননি", weight: 84 },
    ],
  },
};

type RiskKey = keyof typeof risks;

const toneStyles: Record<
  Tone,
  {
    bar: string;
    chip: string;
    tab: string;
    dot: string;
    chipLabel: string;
    Icon: LucideIcon;
  }
> = {
  safe: {
    bar: "bg-gradient-to-r from-brand-500 to-emerald-400",
    chip: "bg-brand-50 text-brand-700",
    tab: "bg-[#10b981] text-white",
    dot: "bg-brand-500",
    chipLabel: "পরিষ্কার",
    Icon: CheckCircle2,
  },
  warn: {
    bar: "bg-gradient-to-r from-amber-500 to-amber-300",
    chip: "bg-amber-50 text-amber-700",
    tab: "bg-[#e4a12a] text-white",
    dot: "bg-amber-500",
    chipLabel: "যাচাই",
    Icon: AlertTriangle,
  },
  danger: {
    bar: "bg-gradient-to-r from-accent-600 to-accent-400",
    chip: "bg-accent-500/10 text-accent-600",
    tab: "bg-[#f43f5e] text-white",
    dot: "bg-accent-500",
    chipLabel: "ঝুঁকি",
    Icon: XCircle,
  },
};

const profileOptions: { value: RiskKey; label: string }[] = [
  { value: "ok", label: "নিরাপদ" },
  { value: "mid", label: "মাঝারি ঝুঁকি" },
  { value: "bad", label: "ফ্রড" },
];

const profileOrder: RiskKey[] = profileOptions.map((o) => o.value);

function ShieldTile() {
  // Always animates — see the note on CourierTile about OS-level reduced motion.
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-80px" });
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [scanning, setScanning] = useState(true);
  const [blocked, setBlocked] = useState(7);
  const timer = useRef<number | null>(null);

  const key = profileOrder[step];
  const risk = risks[key];
  const tone = toneStyles[risk.tone];
  // Signals cascade in only once the sweep has passed over them.
  const hold = 0.72;

  const scan = useCallback(() => {
    setScanning(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setScanning(false), 750);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  // Buyer profiles cycle on their own, exactly like the courier card: একটার পর
  // একটা, with each sweep and cascade. Only a click stops the rotation — a
  // resting cursor must not, or the demo looks frozen.
  useEffect(() => {
    if (!auto || !inView) return;
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % profileOrder.length),
      4200,
    );
    return () => window.clearInterval(id);
  }, [auto, inView]);

  // Every profile — the first one included — gets its own sweep, score and
  // signal cascade as soon as it becomes the active tab.
  useEffect(() => {
    if (inView) scan();
  }, [inView, scan, step]);

  const pick = (next: RiskKey) => {
    setAuto(false);
    if (next === key) scan();
    else setStep(profileOrder.indexOf(next));
  };

  const decide = () => {
    if (risk.tone === "danger") setBlocked((b) => b + 1);
    scan();
  };

  return (
    <div ref={wrapRef}>
      <SpotlightCard className="rounded-[2rem] border border-ink-100 bg-white p-6 shadow-lift transition-all duration-500 hover:border-brand-200 sm:p-9 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* ---------- Left: verdict ---------- */}
          <div>
            <Segmented
              label="ক্রেতার ধরন"
              options={profileOptions}
              value={key}
              onChange={pick}
              activeClassName={(value) => toneStyles[risks[value].tone].tab}
            />

            <div className="relative mx-auto mt-8 w-52 sm:w-60">
              <svg
                viewBox="0 0 120 66"
                aria-hidden
                className="w-full overflow-visible"
              >
                <path
                  d="M10 60 A50 50 0 0 1 110 60"
                  pathLength={100}
                  fill="none"
                  strokeWidth={9}
                  strokeLinecap="round"
                  className="stroke-ink-100 dark:stroke-white/10"
                />
                <motion.path
                  d="M10 60 A50 50 0 0 1 110 60"
                  pathLength={100}
                  fill="none"
                  strokeWidth={9}
                  strokeLinecap="round"
                  initial={false}
                  animate={{
                    strokeDashoffset: scanning ? 100 : 100 - risk.success,
                    stroke: risk.color,
                  }}
                  transition={{ duration: 0.9, ease }}
                  style={{ strokeDasharray: 100 }}
                />
              </svg>
              <div className="absolute inset-x-0 bottom-2.5 text-center">
                <p className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  {scanning ? "…" : <Counter value={risk.success} suffix="%" />}
                </p>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-ink-400 uppercase">
                  সফলতার স্কোর
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <motion.span
                key={`${key}-${scanning}`}
                initial={{ opacity: 0, y: -6, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease }}
                className={cn(
                  "inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-center text-xs font-bold",
                  scanning
                    ? "bg-ink-100 text-ink-500 dark:bg-white/10"
                    : risk.chip,
                )}
              >
                {scanning ? (
                  <>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="h-2 w-2 shrink-0 rounded-full bg-current"
                    />
                    যাচাই চলছে…
                  </>
                ) : (
                  <>
                    <tone.Icon className="h-3.5 w-3.5 shrink-0" />
                    {risk.label} · {risk.action}
                  </>
                )}
              </motion.span>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant={risk.variant}
                className={risk.ctaClass}
                onClick={decide}
              >
                {risk.cta}
              </Button>
            </div>

            <p className="mt-4 text-center text-[11px] text-ink-400">
              স্কোর ৭০% ছাড়ালে অর্ডার নিজে থেকেই আটকে যায়, আর নিরাপদ ক্রেতা
              অটো কনফার্ম হয়।
            </p>
          </div>

          {/* ---------- Right: live scan ---------- */}
          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-violet-50/70 p-5 shadow-soft sm:p-6 dark:from-white/5 dark:via-transparent dark:to-brand-950/20">
            {scanning && (
              <motion.span
                aria-hidden
                initial={{ x: "-45%" }}
                animate={{ x: "150%" }}
                transition={{ duration: 0.7, ease }}
                className="pointer-events-none absolute inset-y-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
              />
            )}

            <div className="relative flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-sm font-bold text-ink-900">
                  ঝুঁকি বিশ্লেষণ
                </p>
                <p className="truncate text-[11px] text-ink-500">
                  ক্রেতা: {risk.buyer}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold whitespace-nowrap",
                  scanning
                    ? "bg-ink-100 text-ink-500 dark:bg-white/10"
                    : tone.chip,
                )}
              >
                {scanning
                  ? "স্ক্যান হচ্ছে"
                  : `${bn(couriers.length)}টি কুরিয়ার রিপোর্ট`}
              </span>
            </div>

            <ul
              className={cn(
                "relative mt-5 grid gap-2.5 transition-all duration-300",
                scanning && "opacity-40 blur-[2px]",
              )}
            >
              {risk.signals.map((s, i) => (
                <motion.li
                  key={`${key}-${s.label}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: hold + i * 0.09, ease }}
                  className="flex items-center gap-3 rounded-xl bg-white/80 px-3.5 py-2.5 dark:bg-white/5"
                >
                  {/* The row is a courier's report, so the courier's mark leads it
                      and the verdict rides along as a corner badge. */}
                  <span className="relative flex h-9 w-14 shrink-0 items-center justify-center rounded-xl bg-white px-1.5 shadow-soft dark:bg-ink-800">
                    <CourierLogo
                      courier={couriers[i % couriers.length]}
                      className="h-4 w-auto max-w-full"
                    />
                    <span
                      className={cn(
                        "absolute -right-1 -bottom-1 grid h-3.5 w-3.5 place-items-center rounded-full text-white ring-2 ring-white dark:ring-ink-900",
                        tone.dot,
                      )}
                    >
                      <tone.Icon className="h-2.5 w-2.5" />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-ink-800 sm:text-[13px]">
                      {s.label}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: `${s.weight}%` }}
                        transition={{
                          duration: 0.7,
                          delay: hold + i * 0.09,
                          ease,
                        }}
                        className={cn("block h-full rounded-full", tone.bar)}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      tone.chip,
                    )}
                  >
                    {tone.chipLabel}
                  </span>
                </motion.li>
              ))}
            </ul>

            <div className="relative mt-5 flex flex-col gap-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-500">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-600" />
                চার কুরিয়ারের ডেলিভারি রিপোর্ট মিলিয়ে ঝুঁকির হিসাব হয়
              </p>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-950 px-3.5 py-1.5 text-[11px] font-semibold text-white">
                <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-accent-400" />
                আজ আটকানো ফেক অর্ডার
                <motion.b
                  key={blocked}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 20 }}
                  className="text-brand-300"
                >
                  {bn(blocked)}টি
                </motion.b>
              </span>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

/* ---------- 3. Cart recovery ---------- */

type Channel = "WhatsApp" | "SMS";

const channels: { value: Channel; label: string }[] = [
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "SMS", label: "SMS" },
];

const channelStyles: Record<
  Channel,
  { out: string; badge: string; tab: string }
> = {
  WhatsApp: {
    out: "bg-brand-600 text-white",
    badge: "bg-brand-50 text-brand-700",
    tab: "bg-brand-600 text-white",
  },
  SMS: {
    out: "bg-[#2f6fce] text-white",
    badge: "bg-ink-100 text-ink-600 dark:bg-white/10 dark:text-ink-300",
    tab: "bg-[#2f6fce] text-white",
  },
};

// One abandoned cart, played out beat by beat: the shop's reminder goes out,
// the buyer answers, the payment lands. `at` is the beat a line shows up on.
const thread: {
  at: number;
  kind: "note" | "out" | "in" | "success";
  text: string;
}[] = [
  { at: 1, kind: "note", text: "৪৫ মিনিট আগে অর্ডারে রেখে গেছেন · ৳৪,৮০০" },
  {
    at: 2,
    kind: "out",
    text: "আপনার অর্ডারে ১টি জামদানি শাড়ি রয়ে গেছে। এখন অর্ডার করলে ডেলিভারি ফ্রি।",
  },
  { at: 4, kind: "in", text: "অর্ডার কনফার্ম করুন" },
  { at: 5, kind: "out", text: "অর্ডার সম্পন্ন, ৳৪,৮০০ bKash-এ পেইড" },
  { at: 6, kind: "success", text: "রিকভারি সফল · ৳৪,৮০০ ফিরে এসেছে" },
];

const TYPING_BEAT = 3;
const LAST_BEAT = 6;

function RecoveryTile() {
  // Always animates — see the note on CourierTile about OS-level reduced motion.
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-80px" });
  const [channel, setChannel] = useState<Channel>("WhatsApp");
  // Starts on the first beat so the thread is never an empty panel.
  const [beat, setBeat] = useState(1);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const [revenue, setRevenue] = useState(68400);
  const [orders, setOrders] = useState(14);
  const tone = channelStyles[channel];

  // The whole reminder replays on a loop — একটার পর একটা, like the other two
  // cards. `run` remounts the thread so every cycle animates in from scratch.
  useEffect(() => {
    if (!inView) return;
    const done = beat >= LAST_BEAT;
    const id = window.setTimeout(
      () => {
        if (done) {
          setBeat(1);
          setRun((r) => r + 1);
        } else {
          setBeat((b) => b + 1);
        }
      },
      done ? 3000 : 950,
    );
    return () => window.clearTimeout(id);
  }, [beat, inView]);

  // The payment landing is what the recovered-revenue counters count.
  useEffect(() => {
    if (beat === LAST_BEAT) {
      setRevenue((v) => v + 4800);
      setOrders((v) => v + 1);
    }
  }, [beat]);

  const replay = (next?: Channel) => {
    if (next) setChannel(next);
    setBeat(1);
    setRun((r) => r + 1);
  };

  const copy = () => {
    try {
      navigator.clipboard?.writeText("WELCOME10").catch(() => {});
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div ref={wrapRef}>
      <SpotlightCard className="rounded-[2rem] border border-ink-100 bg-white p-6 shadow-lift transition-all duration-500 hover:border-brand-200 sm:p-9 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
          {/* ---------- Left: the offer ---------- */}
          <div>
            <Segmented
              label="রিমাইন্ডার কোন চ্যানেলে যাবে"
              options={channels}
              value={channel}
              onChange={(v) => replay(v)}
              activeClassName={(value) => channelStyles[value].tab}
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-3.5 dark:bg-white/5">
                <p className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
                  <Counter value={revenue} prefix="৳" />
                </p>
                <p className="mt-0.5 text-[11px] text-ink-500">
                  এই মাসে ফিরে পাওয়া বিক্রি
                </p>
              </div>
              <div className="rounded-2xl border border-ink-100 bg-ink-50 p-3.5 dark:bg-white/5">
                <p className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">
                  <motion.span
                    key={orders}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 20 }}
                    className="inline-block"
                  >
                    {bn(orders)}টি
                  </motion.span>
                </p>
                <p className="mt-0.5 text-[11px] text-ink-500">
                  ফিরে পাওয়া অর্ডার
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border-[1.5px] border-dashed border-ink-200 bg-ink-50 px-4 py-3 dark:bg-white/5">
              <div className="min-w-0">
                <code className="font-mono text-sm font-extrabold tracking-wider text-ink-900">
                  WELCOME10
                </code>
                <small className="block truncate text-xs text-ink-500">
                  রিমাইন্ডারের সাথেই কোডটা নিজে থেকেই যায়
                </small>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={copy}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-brand-600" />
                    কপি হয়েছে
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    কপি করুন
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ---------- Right: the reminder thread ---------- */}
          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-brand-50/60 p-4 shadow-soft sm:p-5 dark:from-white/5 dark:via-transparent dark:to-brand-950/20">
            <div className="relative flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-400 text-xs font-bold text-white">
                জা
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-900">
                  জান্নাতুল ফেরদৌস
                </p>
                <p className="truncate text-[11px] text-ink-500">
                  অনলাইন · অর্ডার #৪৮২১৯
                </p>
              </div>
              <span
                className={cn(
                  "ml-auto shrink-0 rounded-full px-3 py-1 text-[11px] font-bold",
                  tone.badge,
                )}
              >
                {channel}
              </span>
            </div>

            {/* Fixed height: the loop can grow and clear the thread without ever
                resizing the card or shoving the sections below it. */}
            <div
              key={run}
              className="dot-pattern relative mt-4 flex h-[21rem] flex-col justify-end gap-2 overflow-hidden rounded-2xl border border-ink-100 bg-white/70 p-3.5 dark:bg-white/5"
            >
              {thread.map((m) => {
                if (beat < m.at) return null;

                if (m.kind === "note") {
                  return (
                    <motion.p
                      key={m.text}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="mx-auto max-w-[85%] rounded-full bg-ink-100/80 px-3 py-1.5 text-center text-[10px] font-medium text-ink-500 dark:bg-white/10"
                    >
                      {m.text}
                    </motion.p>
                  );
                }

                if (m.kind === "success") {
                  return (
                    <motion.p
                      key={m.text}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      }}
                      className="mx-auto flex max-w-[85%] items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-center text-[10px] font-bold text-brand-700"
                    >
                      <Check className="h-3 w-3 shrink-0" />
                      {m.text}
                    </motion.p>
                  );
                }

                const outgoing = m.kind === "out";
                return (
                  <motion.p
                    key={m.text}
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26 }}
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                      outgoing
                        ? cn("ml-auto rounded-br-[5px]", tone.out)
                        : "rounded-bl-[5px] border border-ink-100 bg-white font-medium text-ink-800 dark:bg-ink-800 dark:text-ink-100",
                    )}
                  >
                    {m.text}
                    {outgoing && (
                      <span className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-80">
                        <CheckCheck className="h-3 w-3 shrink-0" />
                        পাঠানো হয়েছে
                      </span>
                    )}
                  </motion.p>
                );
              })}

              {beat === TYPING_BEAT && (
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-[5px] border border-ink-100 bg-white px-3.5 py-3 dark:bg-ink-800"
                >
                  <span className="sr-only">ক্রেতা লিখছেন</span>
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      aria-hidden
                      animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: d * 0.15,
                      }}
                      className="h-1.5 w-1.5 rounded-full bg-ink-300"
                    />
                  ))}
                </motion.span>
              )}
            </div>

            <div className="relative mt-3 flex items-center gap-2 rounded-full border border-ink-100 bg-white/80 px-3.5 py-2.5 dark:bg-white/5">
              <Send className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              <span className="truncate text-[11px] text-ink-400">
                ২য় রিমাইন্ডার নিজে থেকেই যাবে — ২৪ ঘণ্টা পরে
              </span>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}

/* ---------- Section ---------- */

export function OrderTools() {
  return (
    <section
      id="order-tools"
      className="relative scroll-mt-24 py-10 sm:py-16"
      aria-labelledby="order-tools-title"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />
      <Container>
        <SectionHeading
          id="order-tools-title"
          title={
            <>
              এক ক্লিকেই{" "}
              <span className="text-brand-600 dark:text-brand-400">
                কুরিয়ার ইন্টিগ্রেশন
              </span>
            </>
          }
          subtitle="কুরিয়ার বুকিং, ফেক অর্ডার যাচাই আর হারানো অর্ডার ফেরানো — নিচের কার্ডগুলো একবার ঘুরে দেখুন।"
        />
      </Container>

      {/* One card per row, all sharing the site's container width so they line up
          with the hero, the features and every other section. */}
      <Container className="mt-8 grid gap-5">
        <Reveal>
          <CourierTile />
        </Reveal>
      </Container>

      <Container className="mt-14">
        <SectionHeading
          title={
            <>
              <span className="text-red-600 dark:text-red-400">ফেক অর্ডার</span>{" "}
              ব্লক এবং অ্যাডভান্সড{" "}
              <span className="text-red-600 dark:text-red-400">ফ্রড চেকিং</span>{" "}
              সিস্টেম
            </>
          }
          subtitle="EcomByte ফ্রড গার্ড সিস্টেম অটোমেটিক ফেক অর্ডারগুলোকে শনাক্ত করবে।"
        />
      </Container>

      <Container className="mt-8 grid gap-5">
        <Reveal>
          <ShieldTile />
        </Reveal>
      </Container>

      <Container className="mt-14">
        <SectionHeading
          title={
            <>
              এক ক্লিকেই <span className="text-[#25D366]">WhatsApp</span> কিংবা{" "}
              <span className="text-sky-600 dark:text-sky-400">
                মোবাইল নাম্বারে
              </span>{" "}
              মেসেজ পাঠাতে পারবেন।
            </>
          }
        />
      </Container>

      <Container className="mt-8 grid gap-5">
        <Reveal>
          <RecoveryTile />
        </Reveal>
      </Container>
    </section>
  );
}
