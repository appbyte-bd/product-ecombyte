import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useInView } from "framer-motion";
import {
  BellRing,
  Boxes,
  ChevronRight,
  Package,
  PackageSearch,
  ShoppingCart,
  TrendingDown,
  TriangleAlert,
  Warehouse,
} from "lucide-react";
import { Container, Counter, Reveal, SectionHeading } from "./ui";
import { cn } from "../utils/cn";
import { bn } from "../utils/bn";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/*
 * Standalone section for ইনভেন্টরি ও স্টক ম্যানেজমেন্ট. Left side lists what the
 * seller gets when the store dashboard owns the stock; the right side is the real
 * EcomByte inventory screen — the KPI row on top and the inventory-value bar
 * chart below — with the bars nudging on a slow clock so the panel reads as a
 * live dashboard rather than a screenshot.
 */

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: PackageSearch,
    title: "রিয়েল-টাইম স্টক কাউন্ট",
    text: "প্রতিটি বিক্রি, রিটার্ন আর রিস্টক সাথেসাথেই হিসাবে বসে — খাতা মেলানোর দরকার নেই।",
  },
  {
    icon: BellRing,
    title: "লো-স্টক অ্যালার্ট",
    text: "পণ্য ফুরিয়ে যাওয়ার আগেই ড্যাশবোর্ড আর SMS-এ সতর্কবার্তা পাবেন।",
  },
  {
    icon: Warehouse,
    title: "মাল্টি-ওয়্যারহাউস ও শাখা",
    text: "ঢাকা, চট্টগ্রাম বা যেকোনো শাখার স্টক একসাথে — কোন পণ্য কোথায়, এক নজরে।",
  },
  {
    icon: Boxes,
    title: "ভ্যারিয়েন্ট ও ব্যাচ ট্র্যাকিং",
    text: "সাইজ, কালার বা ব্যাচ আলাদা করে ট্র্যাক করুন; কোন ভ্যারিয়েন্ট শেষের পথে জানুন।",
  },
  {
    icon: TrendingDown,
    title: "ডেড স্টক ও ভ্যালুয়েশন রিপোর্ট",
    text: "কোন পণ্যে টাকা আটকে আছে, কোনটা দ্রুত ঘুরছে — রিপোর্ট দেখে সিদ্ধান্ত নিন।",
  },
];

/* Same four tiles as the real dashboard's top row. */
const KPIS: {
  label: string;
  value: number;
  prefix?: string;
  icon?: LucideIcon;
  danger?: boolean;
}[] = [
  { label: "মোট পণ্য", value: 60, icon: Package },
  { label: "মোট বিক্রি", value: 3603590, prefix: "৳" },
  {
    label: "ইউনিট বিক্রি",
    value: 3135,
    icon: ShoppingCart,
  },
  { label: "লো স্টক", value: 3, icon: TriangleAlert, danger: true },
];

/* Category bars, tallest first — the same shape as the real inventory-value chart. */
const CATEGORY_BARS = [
  { name: "খিমার", value: 92 },
  { name: "ইলেকট্রনিক্স", value: 84 },
  { name: "গ্যাজেট", value: 74 },
  { name: "স্মার্ট ওয়াচ", value: 76 },
  { name: "অন্যান্য", value: 60 },
  { name: "হেডফোন", value: 52 },
  { name: "মোবাইল", value: 50 },
  { name: "শার্ট", value: 46 },
  { name: "ফরমাল শু", value: 44 },
  { name: "লেদার গুডস", value: 26 },
  { name: "জ্যাকেট", value: 18 },
  { name: "বোরকা", value: 14 },
  { name: "জুব্বা", value: 12 },
  { name: "কিডস", value: 8 },
];

const Y_AXIS = ["৩২L", "২৪L", "১৬L", "৮L", "০"];

type Share = {
  name: string;
  mark: string;
  tile: string;
  orders: number;
  amount: number;
  color: string;
};

/* Brand + category split, both straight off the real dashboard's donut cards. */
const BRAND_SHARE: Share[] = [
  {
    name: "Comforty",
    mark: "C",
    tile: "bg-violet-500",
    orders: 1000,
    amount: 2079230,
    color: "#7c3aed",
  },
  {
    name: "Fabrica",
    mark: "F",
    tile: "bg-blue-500",
    orders: 226,
    amount: 594590,
    color: "#3b82f6",
  },
  {
    name: "Walton",
    mark: "W",
    tile: "bg-emerald-500",
    orders: 186,
    amount: 471840,
    color: "#10b981",
  },
  {
    name: "Vision",
    mark: "V",
    tile: "bg-amber-500",
    orders: 185,
    amount: 367700,
    color: "#f59e0b",
  },
];

const CATEGORY_SHARE: Share[] = [
  {
    name: "মোবাইল ফোন",
    mark: "মো",
    tile: "bg-violet-500",
    orders: 17,
    amount: 392810,
    color: "#7c3aed",
  },
  {
    name: "ম্যানস জুব্বা",
    mark: "জু",
    tile: "bg-rose-500",
    orders: 111,
    amount: 343670,
    color: "#f43f5e",
  },
  {
    name: "ওমেন খিমার",
    mark: "খি",
    tile: "bg-slate-400",
    orders: 114,
    amount: 335080,
    color: "#94a3b8",
  },
  {
    name: "ওয়্যারড হেডফোন",
    mark: "হে",
    tile: "bg-purple-500",
    orders: 127,
    amount: 279670,
    color: "#a855f7",
  },
  {
    name: "কিডস খিমার",
    mark: "কি",
    tile: "bg-orange-500",
    orders: 111,
    amount: 278360,
    color: "#f97316",
  },
  {
    name: "ফরমাল শু",
    mark: "শু",
    tile: "bg-slate-800",
    orders: 123,
    amount: 274800,
    color: "#1f2937",
  },
];

/* Amounts drive the slice sizes; a hairline gap keeps the slices readable. */
function donutGradient(rows: Share[]) {
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const stops: string[] = [];
  let acc = 0;

  rows.forEach((row, i) => {
    const to = acc + (row.amount / total) * 100;
    const gap = i === rows.length - 1 ? 0 : 0.9;
    stops.push(`${row.color} ${acc.toFixed(2)}% ${(to - gap).toFixed(2)}%`);
    if (gap) {
      stops.push(`transparent ${(to - gap).toFixed(2)}% ${to.toFixed(2)}%`);
    }
    acc = to;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

/* ---------- The dashboard mock ---------- */

function InventoryDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [bars, setBars] = useState(CATEGORY_BARS.map((c) => c.value));

  // The bars keep nudging around their real values so the panel reads as live data.
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      setBars((prev) =>
        prev.map((v, i) => {
          const base = CATEGORY_BARS[i].value;
          return clamp(v + (Math.random() * 10 - 5), base - 9, base + 9);
        }),
      );
    }, 2600);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-ink-200 bg-white shadow-lift dark:border-white/10">
        {/* window chrome */}
        <div className="flex items-center gap-1.5 border-b border-ink-100 bg-ink-50/70 px-4 py-2.5 dark:border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 min-w-0 truncate rounded-md bg-white px-2 py-0.5 text-[10px] text-ink-400">
            app.ecombyte.com/inventory
          </span>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-brand-700">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-brand-500"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            লাইভ সিঙ্ক
          </span>
        </div>

        <div className="relative bg-ink-50/50 p-3.5 sm:p-4 dark:bg-transparent">
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
            {KPIS.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.12 + i * 0.08, duration: 0.5, ease }}
                className="flex items-center gap-2.5 rounded-2xl border border-ink-200/70 bg-white p-2.5 shadow-soft sm:p-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-accent-500/15 bg-accent-500/10 text-accent-500">
                  {kpi.icon ? (
                    <kpi.icon className="h-4 w-4" aria-hidden />
                  ) : (
                    <span className="text-base leading-none font-bold">৳</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-medium text-ink-500">
                    {kpi.label}
                  </span>
                  <span
                    className={cn(
                      "block text-[15px] leading-tight font-bold tracking-tight tabular-nums",
                      kpi.danger ? "text-accent-500" : "text-ink-900",
                    )}
                  >
                    <Counter value={kpi.value} prefix={kpi.prefix} />
                  </span>
                </span>
              </motion.div>
            ))}
          </div>

          {/* inventory value chart */}
          <div className="mt-3 rounded-2xl border border-ink-200/70 bg-white p-3.5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10.5px] font-medium text-ink-500">
                  ইনভেন্টরি ভ্যালু
                </p>
                <p className="mt-0.5 text-lg leading-tight font-bold tracking-tight text-ink-900 tabular-nums">
                  <Counter value={19869824} prefix="৳" />
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink-200 px-2 py-1 text-[10px] font-medium text-ink-600 dark:border-white/15 dark:text-ink-300">
                ক্যাটাগরি অনুযায়ী
                <ChevronRight className="h-3 w-3 rotate-90" aria-hidden />
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              {/* y axis */}
              <div
                className="flex h-28 w-6 shrink-0 flex-col justify-between text-right text-[8px] leading-none text-ink-400"
                aria-hidden
              >
                {Y_AXIS.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>

              <div className="relative h-28 min-w-0 flex-1" aria-hidden>
                {/* dashed grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {Y_AXIS.map((t) => (
                    <span
                      key={t}
                      className="w-full border-t border-dashed border-ink-100"
                    />
                  ))}
                </div>

                {/* bars */}
                <div className="absolute inset-0 flex items-end gap-[3px]">
                  {bars.map((value, i) => (
                    <div
                      key={CATEGORY_BARS[i].name}
                      className="relative h-full min-w-0 flex-1"
                    >
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-[62%] origin-bottom -translate-x-1/2 rounded-t-[3px] bg-green-500"
                        style={{ height: `${value}%` }}
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{
                          scaleY: inView ? 1 : 0,
                          opacity: inView ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          delay: 0.25 + i * 0.035,
                          ease,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* x labels, vertical like the real dashboard */}
            <div
              className="mt-1.5 flex h-24 gap-[3px] overflow-hidden pl-8"
              aria-hidden
            >
              {CATEGORY_BARS.map((c) => (
                <span
                  key={c.name}
                  className="min-w-0 flex-1 overflow-hidden text-[7.5px] leading-tight text-ink-400 [writing-mode:vertical-rl]"
                >
                  {c.name}
                </span>
              ))}
            </div>

            <p className="mt-2 text-[9.5px] text-ink-400">
              {bn(CATEGORY_BARS.length)}টি ক্যাটাগরি — সবচেয়ে বেশি স্টক
              “খিমার”-এ
            </p>
          </div>

          {/* brand + category overview */}
          <div className="mt-3 grid gap-3 xl:grid-cols-2">
            <ShareCard
              title="ব্র্যান্ড ওভারভিউ"
              rows={BRAND_SHARE}
              total={`${bn(1.6)}K`}
              totalAmount={3513360}
            />
            <ShareCard
              title="ক্যাটাগরি ওভারভিউ"
              rows={CATEGORY_SHARE}
              total={bn(803)}
              totalAmount={1904390}
              delay={0.1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareCard({
  title,
  rows,
  total,
  totalAmount,
  delay = 0,
}: {
  title: string;
  rows: Share[];
  total: string;
  totalAmount: number;
  delay?: number;
}) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-3.5 shadow-soft">
      <p className="text-[10.5px] font-medium text-ink-500">{title}</p>

      <div className="mt-3 flex flex-col items-center gap-3.5 sm:flex-row">
        {/* donut */}
        <div className="relative h-28 w-28 shrink-0">
          <motion.div
            className="h-full w-full rounded-full"
            style={{ background: donutGradient(rows) }}
            initial={{ opacity: 0, scale: 0.86, rotate: -14 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay, ease }}
          />
          <div className="pointer-events-none absolute inset-[24%] grid place-items-center rounded-full bg-white text-center">
            <div>
              <p className="text-[11px] leading-tight font-bold text-ink-900">
                {total}
              </p>
              <p className="text-[8px] leading-tight text-ink-500">
                ৳{bn(totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* legend */}
        <ul className="w-full min-w-0 space-y-2">
          {rows.map((row, i) => (
            <motion.li
              key={row.name}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: delay + 0.15 + i * 0.06,
                ease,
              }}
              className="flex items-center gap-2"
            >
              <span
                className={cn(
                  "grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[9px] font-bold text-white",
                  row.tile,
                )}
              >
                {row.mark}
              </span>
              <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-ink-900">
                {row.name}
              </span>
              <span className="shrink-0 text-[9px] text-ink-400 tabular-nums">
                {bn(row.orders)} অর্ডার
              </span>
              <span className="shrink-0 text-right text-[10px] font-bold text-ink-900 tabular-nums">
                ৳{bn(row.amount)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Section ---------- */

export function Inventory() {
  return (
    <section
      id="inventory"
      aria-labelledby="inventory-title"
      className="relative scroll-mt-24 py-10 sm:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />

      <Container>
        <SectionHeading
          id="inventory-title"
          title={
            <>
              স্মার্ট{" "}
              <span className="text-brand-600 dark:text-brand-400">
                ইনভেন্টরি ও স্টক ম্যানেজমেন্ট
              </span>
            </>
          }
          subtitle="আপনার ব্যবসার পুঙ্খানুপুঙ্খ হিসাব রাখতে পারবেন আমাদের এই ড্যাশবোর্ডে।
স্টকে কতটি পণ্য রয়েছে, কতটি পণ্য বিক্রি হয়েছে, এবং কতটি পণ্যের স্টক লো রয়েছে, সবই জানতে পারবেন একই ড্যাশবোর্ডে।"
        />
      </Container>

      <Container className="mt-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <Reveal>
            <ul className="mt-6 space-y-4">
              {BENEFITS.map((benefit, i) => (
                <Reveal
                  as="li"
                  key={benefit.title}
                  delay={0.08 + i * 0.07}
                  y={12}
                  className="flex items-start gap-3.5"
                >
                  {/* Same emerald→teal gradient the Brand app section uses for its
                      feature tiles, so both benefit lists read as one family. */}
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-teal-600 text-white shadow-soft">
                    <benefit.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <b className="block font-display text-sm font-bold text-ink-900">
                      {benefit.title}
                    </b>
                    <span className="text-[13px] leading-relaxed text-ink-500">
                      {benefit.text}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <InventoryDashboard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
