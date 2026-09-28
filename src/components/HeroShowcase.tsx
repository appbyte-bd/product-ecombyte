import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Package,
  Phone,
  Send,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { bn } from "../utils/bn";
import { LandingPageVisual } from "./LandingPageVisual";
import { TrackingFanout } from "./TrackingFanout";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// How long one slide stays on screen before auto-advancing.
const SLIDE_MS = 5200;

// Shortest horizontal drag that counts as a swipe rather than a tap.
const SWIPE_PX = 48;

/*
 * Slide 1 — Fast load. A ready-made animated SVG (public/website.svg, with
 * its own SMIL animations) stands in for the built visual.
 */
function WebsiteVisual() {
  return (
    <div className="h-full w-full">
      {/* The file's own width/height="100%" attrs made percentage sizing
          resolve circularly, so the box size is pinned in px. */}
      <img
        src="/website.svg"
        alt=""
        aria-hidden="true"
        className="h-[260px] w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

/*
 * Slide 3 — Fake order block. A realistic order (customer + line items + COD
 * total) slides onto the scanner bed, a robot scan beam sweeps it, then a
 * verdict stamp lands and the card flies to ব্লকড or কনফার্মড.
 */
type FakeOrder = {
  name: string;
  phone: string;
  items: string[];
  total: string;
  fake: boolean;
  reason: string;
};

const FAKE_ORDERS: FakeOrder[] = [
  {
    name: "রাকিব হাসান",
    phone: "০১৭১২-৩৪৫৬৭৮",
    items: ["জামদানি শাড়ি × ১", "সিল্ক স্কার্ফ × ১"],
    total: "৳১,৮৫০",
    fake: false,
    reason: "",
  },
  {
    name: "আরিফুল ইসলাম",
    phone: "০১৩০০-০০০০০০",
    items: ["স্মার্টওয়াচ × ৩"],
    total: "৳৯,৯৯৯",
    fake: true,
    reason: "ভুয়া নম্বর",
  },
  {
    name: "সুমাইয়া আক্তার",
    phone: "০১৮২২-৪৫৬৭৮৯",
    items: ["বিউটি বক্স × ২"],
    total: "৳২,৪০০",
    fake: false,
    reason: "",
  },
  {
    name: "মেহেদী হাসান",
    phone: "০১৭১২-৩৪৫৬৭৮",
    items: ["ইয়ারবাডস × ২"],
    total: "৳৩,২০০",
    fake: true,
    reason: "ডুপ্লিকেট",
  },
];

function FakeOrderVisual({ reduced }: { reduced: boolean }) {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState(reduced ? 2 : 0);
  const [blocked, setBlocked] = useState(reduced ? 3 : 0);
  const [passed, setPassed] = useState(reduced ? 7 : 0);
  const order = FAKE_ORDERS[cycle % FAKE_ORDERS.length];

  useEffect(() => {
    if (reduced) return;
    setPhase(0);
    const timers = [
      window.setTimeout(() => setPhase(1), 500), // card arrives, robot scan starts
      window.setTimeout(() => setPhase(2), 1800), // verdict stamp lands
      window.setTimeout(() => {
        setPhase(3);
        if (order.fake) setBlocked((b) => b + 1);
        else setPassed((p) => p + 1);
      }, 2700), // card flies to its outcome
      window.setTimeout(() => setCycle((c) => c + 1), 3900),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
    // `order` is derived from `cycle`, which is already a dependency.
  }, [cycle, reduced]);

  const scanned = phase >= 2;
  const flying = phase >= 3;

  return (
    <div className="relative h-full">
      {/* outcome panels */}
      <div className="absolute right-0 top-0 w-[112px]">
        <MiniPanel
          tone="rose"
          label="ব্লকড"
          count={blocked}
          icon={<X className="h-3 w-3" aria-hidden="true" />}
          reduced={reduced}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-[112px]">
        <MiniPanel
          tone="emerald"
          label="কনফার্মড"
          count={passed}
          icon={<Check className="h-3 w-3" aria-hidden="true" />}
          reduced={reduced}
        />
      </div>

      {/* the order card, scanned in place like a document on a scanner bed */}
      <div className="absolute left-0 top-1/2 z-10 -mt-16 w-[196px]">
        <motion.div
          key={cycle}
          className={`relative min-h-[126px] rounded-xl border-2 bg-white p-2.5 shadow-lg dark:bg-[#0d1f18] ${
            scanned
              ? order.fake
                ? "border-rose-300 dark:border-rose-400/40"
                : "border-emerald-300 dark:border-emerald-400/40"
              : "border-ink-100 dark:border-white/10"
          }`}
          initial={reduced ? false : { x: -96, opacity: 0 }}
          animate={
            reduced
              ? { x: 14, y: 0, rotate: 0, opacity: 1 }
              : flying
                ? { x: 70, y: order.fake ? -54 : 54, rotate: order.fake ? -8 : 8, scale: 0.55, opacity: [1, 1, 0] }
                : { x: 14, y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ type: "spring", stiffness: 210, damping: 22 }}
        >
          {/* scanner target brackets */}
          {phase <= 1 &&
            !reduced &&
            [
              "-left-1.5 -top-1.5 border-l-2 border-t-2 rounded-tl-md",
              "-right-1.5 -top-1.5 border-r-2 border-t-2 rounded-tr-md",
              "-left-1.5 -bottom-1.5 border-l-2 border-b-2 rounded-bl-md",
              "-right-1.5 -bottom-1.5 border-r-2 border-b-2 rounded-br-md",
            ].map((pos) => (
              <motion.span
                key={pos}
                className={`absolute h-4 w-4 border-[#00694d] dark:border-emerald-400 ${pos}`}
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ))}

          {/* robot scan beam sweeping the card */}
          {phase === 1 && !reduced && (
            <motion.div
              className="absolute inset-x-1 z-10 h-[3px] rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_14px_rgba(16,185,129,0.8)]"
              initial={{ top: "6%" }}
              animate={{ top: ["6%", "92%", "6%"] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          )}

          {/* customer */}
          <div className="flex items-center gap-1.5">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#587065] text-[10px] font-bold text-white">
              {Array.from(order.name)[0]}
            </span>
            <b className="min-w-0 truncate text-[11px] font-bold text-ink-900 dark:text-white">
              {order.name}
            </b>
          </div>
          <div
            className={`mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
              scanned && order.fake
                ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300"
                : "bg-ink-50 text-ink-500 dark:bg-white/5 dark:text-ink-400"
            }`}
          >
            <Phone className="h-2.5 w-2.5" aria-hidden="true" />
            {order.phone}
          </div>

          {/* line items */}
          <div className="mt-1.5 space-y-1 border-t border-dashed border-ink-100 pt-1.5 dark:border-white/10">
            {order.items.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-[9.5px] text-ink-600 dark:text-ink-300"
              >
                <Package
                  className="h-2.5 w-2.5 shrink-0 text-ink-400"
                  aria-hidden="true"
                />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* COD total */}
          <div className="mt-1.5 flex items-center justify-between border-t border-ink-100 pt-1.5 dark:border-white/10">
            <span className="text-[9px] font-bold uppercase tracking-wide text-ink-400">
              COD মোট
            </span>
            <span className="text-[10px] font-extrabold text-ink-900 dark:text-white">
              {order.total}
            </span>
          </div>

          {/* scan result line */}
          {scanned && (
            <p
              className={`mt-1 text-[9px] font-bold ${
                order.fake
                  ? "text-rose-500"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {order.fake ? `কারণ: ${order.reason}` : "সব যাচাই সম্পন্ন ✓"}
            </p>
          )}

          {/* verdict stamp */}
          <AnimatePresence>
            {scanned && (
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 1.9, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -10 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 16 }}
                className={`absolute -right-2.5 -top-3.5 rounded-md border-2 bg-white/95 px-2 py-0.5 text-[11px] font-black shadow-md dark:bg-[#0d1f18]/95 ${
                  order.fake
                    ? "border-rose-500 text-rose-600 dark:text-rose-400"
                    : "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {order.fake ? "ব্লকড ✕" : "কনফার্মড ✓"}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* scanner status */}
        <AnimatePresence>
          {phase <= 1 && !flying && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900/85 px-2.5 py-1 text-[9.5px] font-bold text-white backdrop-blur dark:bg-white/10"
            >
              <span className="inline-flex items-center gap-1.5">
                <Loader2
                  className="h-3 w-3 animate-spin text-emerald-400"
                  aria-hidden="true"
                />
                রোবট স্ক্যান চলছে…
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MiniPanel({
  tone,
  label,
  count,
  icon,
  reduced,
}: {
  tone: "rose" | "emerald";
  label: string;
  count: number;
  icon: ReactNode;
  reduced: boolean;
}) {
  const cls =
    tone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300"
      : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300";
  return (
    <div className={`flex items-center gap-1.5 rounded-lg border px-2 py-2 ${cls}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={reduced || count === 0 ? false : { scale: 1.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="ml-auto text-[11px] font-extrabold tabular-nums"
        >
          {bn(count)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/*
 * Slide 4 — One-click courier. The send button presses itself, a connector
 * tree grows down to the four courier logos, and the picked one confirms.
 */
const COURIERS = [
  { name: "Steadfast", src: "/images/courier/steadfast.png" },
  { name: "Pathao", src: "/images/courier/pathao.png" },
  { name: "RedX", src: "/images/courier/redx.png" },
  { name: "CarryBee", src: "/images/courier/carrybee.webp" },
];

function CourierVisual({ reduced }: { reduced: boolean }) {
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState(reduced ? 3 : 0);
  const pick = cycle % COURIERS.length;

  useEffect(() => {
    if (reduced) return;
    setPhase(0);
    const timers = [
      window.setTimeout(() => setPhase(1), 450),
      window.setTimeout(() => setPhase(2), 850),
      window.setTimeout(() => setPhase(3), 1900),
      window.setTimeout(() => setCycle((c) => c + 1), 3300),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [cycle, reduced]);

  return (
    <div className="flex h-full flex-col">
      {/* order chip */}
      <div className="flex items-start justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-2.5 py-1 text-[10px] font-semibold text-ink-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-ink-200">
          <Package
            className="h-3 w-3 text-brand-600 dark:text-brand-400"
            aria-hidden="true"
          />
          অর্ডার #১০২৪ • ঢাকা
        </div>

        {/* status chip */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={reduced ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
            >
              <Check className="h-3 w-3" aria-hidden="true" />
              সেন্ড সম্পন্ন — {COURIERS[pick].name}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* auto-pressed button */}
      <div className="mt-3 flex justify-center">
        <motion.div
          animate={
            reduced
              ? undefined
              : { scale: phase === 1 ? [1, 0.92, 1] : 1 }
          }
          transition={
            phase === 1
              ? { duration: 0.3, times: [0, 0.5, 1] }
              : { duration: 0.2 }
          }
          className="relative"
        >
          {phase === 1 && !reduced && (
            <motion.span
              key={cycle}
              className="absolute inset-0 rounded-xl border-2 border-[#00694d]"
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.6 }}
              transition={{ duration: 0.7 }}
            />
          )}
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#00694d] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_24px_-10px_#00694d]">
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            কুরিয়ার পাঠান
          </div>
        </motion.div>
      </div>

      {/* connector tree, drawn like an org chart: a stub falls from the
          button to the bus, the bus and the two outer drops are one rounded
          bracket, and the two inner columns hang from T-drops. Everything is
          positioned in percentages of this area — courier columns sit at
          12.5 / 37.5 / 62.5 / 87.5% — so every drop lands on its box center
          at any width. */}
      <div className="relative mt-1 min-h-[72px] flex-1">
        {/* stub: button → bus */}
        <div className="absolute left-1/2 top-0 h-[26%] w-[2px] -translate-x-1/2">
          <motion.div
            className="h-full w-full origin-top rounded-full bg-emerald-600/40 dark:bg-emerald-400/30"
            initial={reduced ? false : { scaleY: 0 }}
            animate={{ scaleY: phase >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* bus + outer drops as one bracket, revealed outward from where the
            stub lands */}
        <motion.div
          className="absolute bottom-0 left-[12.5%] right-[12.5%] top-[26%] rounded-t-2xl border-2 border-b-0 border-emerald-600/40 dark:border-emerald-400/30"
          initial={reduced ? false : { clipPath: "inset(0px 50% 100% 50%)" }}
          animate={{
            clipPath:
              phase >= 2 ? "inset(0px 0% 0% 0%)" : "inset(0px 50% 100% 50%)",
          }}
          transition={{ duration: 0.35, delay: phase >= 2 ? 0.12 : 0 }}
        />

        {/* T-drops for the two inner couriers */}
        {[37.5, 62.5].map((x, i) => (
          <div
            key={x}
            className="absolute bottom-0 top-[26%] w-[2px]"
            style={{ left: `${x}%`, marginLeft: -1 }}
          >
            <motion.div
              className="h-full w-full origin-top rounded-full bg-emerald-600/40 dark:bg-emerald-400/30"
              initial={reduced ? false : { scaleY: 0 }}
              animate={{ scaleY: phase >= 2 ? 1 : 0 }}
              transition={{
                duration: 0.3,
                delay: phase >= 2 ? 0.3 + i * 0.1 : 0,
              }}
            />
          </div>
        ))}

        {/* parcel dot travels the picked courier's drop */}
        {phase >= 3 && !reduced && (
          <motion.span
            key={cycle}
            className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500"
            style={{ left: `${12.5 + pick * 25}%`, marginLeft: -3 }}
            initial={{ top: "26%", opacity: 1 }}
            animate={{ top: "94%", opacity: [1, 1, 0.4] }}
            transition={{ duration: 0.55, ease: "easeIn" }}
          />
        )}
      </div>

      {/* courier logo boxes, one under each drop. They stay white in dark
          mode too, so the dark logo marks keep their contrast. */}
      <div className="relative h-12 shrink-0">
        {COURIERS.map((courier, i) => {
          const active = phase >= 3 && i === pick;
          return (
            <div
              key={courier.name}
              className="absolute top-0 h-full w-[25%]"
              style={{ left: `${i * 25}%` }}
            >
              <div
                className={`relative flex h-full items-center justify-center rounded-xl border bg-white px-1.5 transition-colors ${
                  active
                    ? "border-emerald-300 shadow-[0_0_0_3px_rgba(16,185,129,0.12)] dark:border-emerald-400/40"
                    : "border-ink-100 shadow-sm dark:border-white/10"
                }`}
              >
                <img
                  src={courier.src}
                  alt=""
                  aria-hidden="true"
                  className="max-h-7 max-w-[82%] object-contain"
                  loading="eager"
                  decoding="async"
                />
                {active && (
                  <motion.span
                    initial={reduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white"
                  >
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </motion.span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/*
 * Slide 5 — Fraud checking. A customer never arrives on their own in a real
 * store, so every lead carries its order: the product lines and the subtotal
 * sit under the customer and the whole block goes on the scanner together.
 * Check items resolve one by one, then the risk meter and verdict land. Every
 * third cycle shows a flagged order so the "catching" is visible, not implied.
 *
 * Line price is the unit price, so the subtotal is qty × price — two lines per
 * lead keep the card the same height as it cycles.
 */
type FraudLead = {
  name: string;
  phone: string;
  area: string;
  items: { name: string; qty: number; price: number }[];
  risk: number;
  safe: boolean;
  checks: string[];
};

const FRAUD_LEADS: FraudLead[] = [
  {
    name: "করিম উদ্দিন",
    phone: "০১৭১২-৩৪৫৬৭৮",
    area: "মিরপুর, ঢাকা",
    items: [
      { name: "সিল্ক পাঞ্জাবি", qty: 1, price: 1450 },
      { name: "সিল্ক স্কার্ফ", qty: 2, price: 200 },
    ],
    risk: 12,
    safe: true,
    checks: ["নম্বর ভেরিফাইড", "ঠিকানা যাচাই", "অর্ডার হিস্ট্রি"],
  },
  {
    name: "সুমাইয়া আক্তার",
    phone: "০১৮২২-৪৫৬৭৮৯",
    area: "আগ্রাবাদ, চট্টগ্রাম",
    items: [
      { name: "বিউটি বক্স", qty: 2, price: 1200 },
      { name: "ফেসওয়াশ", qty: 1, price: 350 },
    ],
    risk: 8,
    safe: true,
    checks: ["নম্বর ভেরিফাইড", "ঠিকানা যাচাই", "অর্ডার হিস্ট্রি"],
  },
  {
    name: "আরিফুল ইসলাম",
    phone: "০১৩০০-০০০০০০",
    area: "অজানা ঠিকানা",
    items: [
      { name: "স্মার্টওয়াচ", qty: 2, price: 3333 },
      { name: "ফিটনেস ব্যান্ড", qty: 1, price: 3333 },
    ],
    risk: 78,
    safe: false,
    checks: ["নম্বর মেলেনি", "ঠিকানা অস্পষ্ট", "ডুপ্লিকেট নম্বর"],
  },
];

function FraudVisual({ reduced }: { reduced: boolean }) {
  const [cycle, setCycle] = useState(0);
  const lead = FRAUD_LEADS[cycle % FRAUD_LEADS.length];
  const subtotal = lead.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0,
  );

  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setCycle((c) => c + 1), 3600);
    return () => window.clearTimeout(id);
  }, [cycle, reduced]);

  const slideIn = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: 12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay, duration: 0.35, ease: EASE_OUT },
        };

  return (
    <div key={cycle} className="flex h-full items-stretch gap-3">
      {/* profile under scan */}
      <div className="relative w-[45%] overflow-hidden rounded-xl border border-ink-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
        {!reduced && (
          <>
            <motion.div
              className="absolute inset-0 bg-emerald-400/5"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-x-2 z-10 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              // Percentages, so the beam still covers the whole block as the
              // order lines below grow the card.
              initial={{ top: "6%" }}
              animate={{ top: ["6%", "94%"] }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          </>
        )}
        <div className="relative flex items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#587065] to-[#00694d] text-sm font-bold text-white">
            {Array.from(lead.name)[0]}
          </span>
          <div className="min-w-0">
            <b className="block truncate text-[12px] font-bold text-ink-900 dark:text-white">
              {lead.name}
            </b>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">
              নতুন অর্ডার
            </span>
          </div>
        </div>
        <div className="relative mt-2.5 space-y-1.5 text-[10px] text-ink-600 dark:text-ink-300">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0 text-ink-400" aria-hidden="true" />
            {lead.phone}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-ink-400" aria-hidden="true" />
            <span className="truncate">{lead.area}</span>
          </div>
        </div>

        {/* the order itself: product, quantity, unit price … */}
        <div className="relative mt-2.5 space-y-1 border-t border-dashed border-ink-100 pt-2 dark:border-white/10">
          {lead.items.map((item) => (
            <div
              key={item.name}
              className="flex items-baseline gap-1 text-[9.5px] text-ink-600 dark:text-ink-300"
            >
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <span className="shrink-0 text-[9px] text-ink-400">
                ×{bn(item.qty)}
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-ink-700 dark:text-ink-200">
                ৳{bn(item.price)}
              </span>
            </div>
          ))}
        </div>

        {/* … totalled up at the bottom */}
        <div className="relative mt-1.5 flex items-center justify-between border-t border-ink-100 pt-1.5 dark:border-white/10">
          <span className="text-[9px] font-bold tracking-wide text-ink-400">
            সাবটোটাল
          </span>
          <span className="text-[10px] font-extrabold tabular-nums text-ink-900 dark:text-white">
            ৳{bn(subtotal)}
          </span>
        </div>
      </div>

      {/* checks, risk meter, verdict */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="space-y-1.5">
          {lead.checks.map((label, i) => (
            <motion.div
              key={label}
              {...slideIn(0.35 + i * 0.3)}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] font-semibold ${
                lead.safe
                  ? "border-emerald-100 bg-emerald-50/60 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                  : "border-rose-100 bg-rose-50/60 text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-300"
              }`}
            >
              <motion.span
                initial={reduced ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45 + i * 0.3, type: "spring", stiffness: 400, damping: 18 }}
                className={`grid h-4 w-4 shrink-0 place-items-center rounded-full text-white ${
                  lead.safe ? "bg-emerald-500" : "bg-rose-500"
                }`}
              >
                {lead.safe ? (
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                ) : (
                  <X className="h-2.5 w-2.5" aria-hidden="true" />
                )}
              </motion.span>
              <span className="truncate">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto rounded-lg border border-ink-100 bg-white p-2 dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex items-center justify-between text-[10px] font-semibold text-ink-600 dark:text-ink-300">
            <span>রিস্ক স্কোর</span>
            <motion.span
              initial={reduced ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7, duration: 0.25 }}
              className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                lead.safe
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300"
              }`}
            >
              {lead.safe ? "কম" : "উচ্চ"}
            </motion.span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
            <motion.div
              className={`h-full rounded-full ${lead.safe ? "bg-emerald-500" : "bg-rose-500"}`}
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${lead.risk}%` }}
              transition={{ delay: 1.5, duration: 0.7, ease: EASE_OUT }}
            />
          </div>
        </div>

        <motion.div
          {...slideIn(2.1)}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-extrabold text-white ${
            lead.safe ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {lead.safe ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          {lead.safe ? "অর্ডার নিরাপদ — এগিয়ে যান" : "সন্দেহজনক — ম্যানুয়াল রিভিউ"}
        </motion.div>
      </div>
    </div>
  );
}

interface Slide {
  title: string;
  Visual: (props: { reduced: boolean }) => ReactNode;
}

const SLIDES: Slide[] = [
  {
    title: "চোখের পলকেই লোড হবে আপনার ওয়েবসাইট",
    Visual: WebsiteVisual,
  },
  {
    title: "আনলিমিটেড ল্যান্ডিং পেজ ডিজাইন",
    Visual: LandingPageVisual,
  },
  {
    title: "ফেক অর্ডার ব্লক",
    Visual: FakeOrderVisual,
  },
  {
    title: "এক ক্লিকেই কুরিয়ার ইন্টিগ্রেশন",
    Visual: CourierVisual,
  },
  {
    title: "অ্যাডভান্সড ফ্রড চেকিং সিস্টেম",
    Visual: FraudVisual,
  },
  {
    title: "আনলিমিটেড সার্ভার-সাইড ট্র্যাকিং",
    Visual: TrackingFanout,
  },
];

export function HeroShowcase() {
  const [slide, setSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Auto-advance. Keyed on `slide`, so the timer restarts after every change —
  // automatic or manual — and one cycle is exactly one slide. Deliberately not
  // tied to prefers-reduced-motion: that setting silences the transitions, but
  // the carousel itself still has to move.
  useEffect(() => {
    const id = window.setTimeout(
      () => setSlide((s) => (s + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => window.clearTimeout(id);
  }, [slide]);

  const step = (dir: 1 | -1) =>
    setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);

  const current = SLIDES[slide];
  return (
    <article
      aria-roledescription="ক্যারোসেল"
      aria-label="EcomByte ফিচার স্লাইডশো"
      // Swipe left/right to move one slide. A mostly-vertical drag is left alone,
      // and nothing calls preventDefault, so the page still scrolls normally.
      onTouchStart={(event) => {
        const touch = event.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
        step(dx < 0 ? 1 : -1);
      }}
      className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-5 font-bangla shadow-[0_24px_80px_-20px_rgba(0,80,50,0.22),0_0_0_1px_rgba(255,255,255,0.1)_inset] backdrop-blur-xl dark:border-white/10 dark:bg-[#0d1f18]/80 dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/40 via-transparent to-transparent dark:from-white/5" />

      {/* slide header */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="min-h-[62px] min-w-0 flex-1 sm:min-h-0">
          {/* Keyed, so the new title fades in. No AnimatePresence here: waiting
              for an exit animation to finish is what blanked the card when
              slides changed in quick succession. */}
          <motion.h3
            key={slide}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="text-[1.35rem] font-extrabold leading-snug text-ink-900 dark:text-white"
          >
            {current.title}
          </motion.h3>
        </div>

        {/* prev / next controls */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="আগের স্লাইড"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-ink-200 bg-white/80 text-ink-600 transition-all hover:bg-ink-50 active:scale-90 dark:border-white/15 dark:bg-white/5 dark:text-ink-300 dark:hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="পরের স্লাইড"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-ink-200 bg-white/80 text-ink-600 transition-all hover:bg-ink-50 active:scale-90 dark:border-white/15 dark:bg-white/5 dark:text-ink-300 dark:hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* slide visual */}
      <div className="relative mt-4 h-[260px]" aria-hidden="true">
        {/* Default (synchronous) mode: the incoming slide mounts on the same
            render as the click, so a control press always paints immediately,
            while the outgoing one crossfades away underneath. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide}
            className="absolute inset-0"
            initial={{ opacity: 0, x: 42 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -42 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          >
            {/* Always animated. These mockups are the product proof, so the
                visitor's reduced-motion setting — which still silences the
                page's decorative motion — must not freeze them. */}
            <current.Visual reduced={false} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* footer: dots + counter */}
      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, i) => {
            const active = i === slide;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`${s.title} — স্লাইড ${bn(i + 1)}`}
                aria-current={active ? "true" : undefined}
                className={`relative cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
                  active
                    ? "h-2 w-7 bg-[#00694d]"
                    : "h-2 w-2 bg-ink-200 hover:bg-ink-300 dark:bg-white/15 dark:hover:bg-white/25"
                }`}
              >
                {active && (
                  <span
                    // Remounts with every slide, which restarts the fill. Always
                    // animated — it is the cue that the next slide is coming.
                    key={slide}
                    className="absolute inset-y-0 left-0 bg-white/50"
                    style={{
                      animation: `showcaseProgress ${SLIDE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <span className="text-[11px] font-bold tabular-nums text-ink-400 dark:text-ink-500">
          {bn(slide + 1)} / {bn(SLIDES.length)}
        </span>
      </div>

      <style>{`@keyframes showcaseProgress { from { width: 0%; } to { width: 100%; } }`}</style>
    </article>
  );
}
