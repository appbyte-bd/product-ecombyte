import { Fragment, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  BatteryFull,
  Bell,
  Check,
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  MapPin,
  MousePointerClick,
  Plus,
  Search,
  ShoppingCart,
  Signal,
  Smartphone,
  Sparkles,
  Star,
  User,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { Container, Reveal, SectionHeading } from "./ui";
import { cn } from "../utils/cn";
import { bn } from "../utils/bn";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/*
 * Standalone section for "এমন মোবাইল অ্যাপ, যেটা Brand তৈরি করে". The phone on
 * the right is a full mock of the seller's own white-label storefront app —
 * brand header, search, category rail, promo banner and an endlessly scrolling
 * product feed built from the real product shots already in /public/images.
 *
 * The whole app reads its name and colour from a single BRAND object, so
 * dropping in a real store's identity later is a one-object change.
 */

type Brand = {
  key: string;
  name: string;
  area: string;
  accent: string;
  from: string;
  to: string;
};

const BRAND: Brand = {
  key: "brand",
  name: "আপনার ব্র্যান্ড",
  area: "অনলাইন স্টোর",
  accent: "#059669",
  from: "#10b981",
  to: "#0d9488",
};

type Product = {
  img: string;
  name: string;
  price: number;
  tag?: string;
  rating: number;
  sold: number;
};

// The shop's own catalogue — same shots the storefront mock uses.
const PRODUCTS: Product[] = [
  {
    img: "/images/product-jamdani.webp",
    name: "জামদানি শাড়ি",
    price: 4850,
    tag: "বেস্ট সেলার",
    rating: 4.9,
    sold: 312,
  },
  {
    img: "/images/product-panjabi.jpg",
    name: "কটন পাঞ্জাবি",
    price: 1690,
    tag: "নতুন",
    rating: 4.8,
    sold: 208,
  },
  {
    img: "/images/product-sneaker.jpeg",
    name: "রানিং স্নিকার",
    price: 2990,
    rating: 4.7,
    sold: 154,
  },
  {
    img: "/images/product-shirt.jpg",
    name: "ক্যাজুয়াল শার্ট",
    price: 1250,
    tag: "ছাড়",
    rating: 4.6,
    sold: 421,
  },
  {
    img: "/images/product-blander.png",
    name: "হ্যান্ড ব্লেন্ডার",
    price: 3490,
    rating: 4.8,
    sold: 96,
  },
  {
    img: "/images/product-mackbook.jpg",
    name: "স্লিম ল্যাপটপ",
    price: 89900,
    tag: "প্রিমিয়াম",
    rating: 5,
    sold: 27,
  },
];

const CATEGORIES = ["সব", "শাড়ি", "পাঞ্জাবি", "জুতা", "গ্যাজেট"];

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Zap,
    title: "আল্ট্রা-ফাস্ট অ্যাপ",
    text: "নেট স্লো হলেও অ্যাপ চলবে স্মুথ — লোডশেডিংয়ের ফাঁকেও কাজ শেষ।",
  },
  {
    icon: WifiOff,
    title: "অফলাইন-ফ্রেন্ডলি অর্ডার এন্ট্রি",
    text: "নেট না থাকলেও অর্ডার নিন, অনলাইন হলেই নিজে থেকেই সিঙ্ক হবে।",
  },
  {
    icon: Smartphone,
    title: "সব Android ও iOS ফোনে",
    text: "একই ব্র্যান্ড, একটাই অ্যাপ — গ্রাহকের হাতের মুঠোয় আপনার দোকান।",
  },
  {
    icon: MousePointerClick,
    title: "এক ট্যাপে সহজ অর্ডার",
    text: "ঝামেলাহীন চেকআউট — কম ধাপেই পণ্য বাছাই থেকে অর্ডার কনফার্ম, দ্রুত ও সহজ।",
  },
];

/* ---------- Pieces of the phone ---------- */

function PromoBanner({ brand }: { brand: Brand }) {
  return (
    <div
      className="relative col-span-2 overflow-hidden rounded-2xl p-3 text-white shadow-sm"
      style={{
        background: `linear-gradient(120deg, ${brand.from}, ${brand.to})`,
      }}
    >
      <motion.span
        aria-hidden
        className="absolute -top-8 -right-6 h-24 w-24 rounded-full bg-white/20"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        aria-hidden
        className="absolute -bottom-10 right-8 h-20 w-20 rounded-full bg-white/10"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="relative flex items-center gap-1 text-[9px] font-bold tracking-wider text-white/85 uppercase">
        <Sparkles className="h-2.5 w-2.5" aria-hidden />
        ঈদ ধামাকা অফার
      </p>
      <p className="relative mt-1 text-[14px] leading-tight font-black">
        সব পণ্যে {bn(40)}% পর্যন্ত ছাড়
      </p>
      <span
        className="relative mt-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[9.5px] font-black"
        style={{ color: brand.accent }}
      >
        এখনই কিনুন
        <ChevronRight className="h-3 w-3" aria-hidden />
      </span>
    </div>
  );
}

function ProductCard({ product, brand }: { product: Product; brand: Brand }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_10px_-4px_rgba(11,18,32,0.16)]">
      <div className="relative aspect-square overflow-hidden bg-ink-50">
        <img
          src={product.img}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {product.tag && (
          <span
            className="absolute top-1.5 left-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-black text-white shadow-sm"
            style={{ background: brand.accent }}
          >
            {product.tag}
          </span>
        )}
        <span className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-ink-400 shadow-sm">
          <Heart className="h-2.5 w-2.5" aria-hidden />
        </span>
      </div>
      <div className="p-2">
        <p className="truncate text-[10.5px] font-bold text-ink-900">
          {product.name}
        </p>
        <div className="mt-0.5 flex items-center gap-1 text-[9px] text-ink-400">
          <Star
            className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
            aria-hidden
          />
          <span className="font-semibold text-ink-500 tabular-nums">
            {bn(product.rating)}
          </span>
          <span className="truncate">· {bn(product.sold)} বিক্রি</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span className="text-[11px] font-extrabold text-ink-900 tabular-nums">
            ৳{bn(product.price)}
          </span>
          <span
            className="grid h-6 w-6 place-items-center rounded-full text-white shadow-sm"
            style={{ background: brand.accent }}
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </div>
    </div>
  );
}

/*
 * The app itself. Its feed never stops moving — the two halves of the grid are
 * identical, so translating by exactly -50% rewinds onto the same pixel and the
 * scroll reads as endless. A simulated add-to-cart keeps the cart badge and the
 * toast alive on their own clock.
 */
function BrandPhone({ brand }: { brand: Brand }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [cart, setCart] = useState(3);
  const [added, setAdded] = useState<number | null>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => setBeat((b) => b + 1), 2700);
    return () => window.clearInterval(id);
  }, [inView]);

  // Every beat a different product drops into the cart: the badge bumps and a
  // toast slides under the header, then fades on its own.
  useEffect(() => {
    if (!inView) return;
    const index = beat % PRODUCTS.length;
    setAdded(index);
    setCart((c) => c + 1);
    const id = window.setTimeout(() => setAdded(null), 1750);
    return () => window.clearTimeout(id);
  }, [beat, inView]);

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full opacity-60 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${brand.accent}55, transparent 70%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -5 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease }}
      >
        <motion.div
          animate={inView ? { y: [0, -12, 0] } : undefined}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-[600px] w-[286px] rounded-[2.75rem] bg-ink-950 p-2 shadow-[0_45px_90px_-35px_rgba(2,44,34,0.65)] sm:h-[664px] sm:w-[318px] sm:rounded-[3rem] sm:p-2.5"
        >
          {/* side buttons */}
          <span
            aria-hidden
            className="absolute top-28 -left-[3px] h-12 w-[3px] rounded-l-full bg-ink-800"
          />
          <span
            aria-hidden
            className="absolute top-44 -left-[3px] h-16 w-[3px] rounded-l-full bg-ink-800"
          />
          <span
            aria-hidden
            className="absolute top-36 -right-[3px] h-20 w-[3px] rounded-r-full bg-ink-800"
          />

          {/* screen */}
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.15rem] bg-ink-50 sm:rounded-[2.4rem]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-40 transition-colors duration-700"
              style={{
                background: `linear-gradient(180deg, ${brand.accent}1f, transparent)`,
              }}
            />
            {/* dynamic island */}
            <span
              aria-hidden
              className="absolute top-2 left-1/2 z-30 h-[22px] w-[78px] -translate-x-1/2 rounded-full bg-ink-950"
            />

            {/* status bar */}
            <div className="relative flex items-center justify-between px-5 pt-3 text-[10px] font-bold text-ink-900">
              <span className="tabular-nums">
                {bn(9)}:{bn(41)}
              </span>
              <span className="flex items-center gap-1.5">
                <Signal className="h-3 w-3" aria-hidden />
                <Wifi className="h-3 w-3" aria-hidden />
                <BatteryFull className="h-[13px] w-[13px]" aria-hidden />
              </span>
            </div>

            {/* brand app bar */}
            <div className="relative mt-2 flex items-center gap-2.5 px-4">
              <motion.span
                key={brand.key}
                initial={{ scale: 0.5, rotate: -14, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 340, damping: 20 }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[0.9rem] text-[15px] font-black text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${brand.from}, ${brand.to})`,
                }}
              >
                {Array.from(brand.name)[0]}
              </motion.span>
              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={brand.key}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease }}
                  >
                    <p className="truncate text-[13px] font-extrabold text-ink-900">
                      {brand.name}
                    </p>
                    <p className="flex items-center gap-0.5 text-[9.5px] text-ink-500">
                      <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden />
                      <span className="truncate">{brand.area}</span>
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                <Bell className="h-4 w-4 text-ink-600" aria-hidden />
                <span
                  className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: brand.accent }}
                />
              </span>
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-sm">
                <ShoppingCart className="h-4 w-4 text-ink-600" aria-hidden />
                <motion.span
                  key={cart}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 16 }}
                  className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-black text-white"
                  style={{ background: brand.accent }}
                >
                  {bn(cart)}
                </motion.span>
              </span>
            </div>

            {/* cart toast */}
            <AnimatePresence>
              {added !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.32, ease }}
                  className="absolute inset-x-4 top-[5.6rem] z-20 flex items-center gap-2 rounded-2xl bg-ink-950/92 px-3 py-2 text-white shadow-lg backdrop-blur"
                >
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full"
                    style={{ background: brand.accent }}
                  >
                    <Check className="h-3 w-3" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[10.5px] font-semibold">
                    কার্টে যোগ হয়েছে · {PRODUCTS[added].name}
                  </span>
                  <span className="shrink-0 text-[10px] font-bold text-white/90 tabular-nums">
                    ৳{bn(PRODUCTS[added].price)}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* search */}
            <div className="relative mx-4 mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm">
              <Search className="h-3.5 w-3.5 text-ink-400" aria-hidden />
              <span className="text-[11px] text-ink-400">পণ্য খুঁজুন…</span>
            </div>

            {/* category rail */}
            <div className="relative mt-3 flex gap-2 overflow-hidden px-4">
              {CATEGORIES.map((c, i) => (
                <span
                  key={c}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[10.5px] font-bold transition-colors duration-500",
                    i === 0 ? "text-white shadow-sm" : "bg-white text-ink-500",
                  )}
                  style={i === 0 ? { background: brand.accent } : undefined}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* endless product feed */}
            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden">
              <motion.div
                className="grid grid-cols-2 gap-3 px-4"
                animate={inView ? { y: ["0%", "-50%"] } : undefined}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              >
                {[0, 1].map((copy) => (
                  <Fragment key={copy}>
                    <PromoBanner brand={brand} />
                    <div className="col-span-2 flex items-center justify-between">
                      <p className="text-[12px] font-extrabold text-ink-900">
                        জনপ্রিয় পণ্য
                      </p>
                      <span
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold"
                        style={{ color: brand.accent }}
                      >
                        সব দেখুন
                        <ChevronRight className="h-3 w-3" aria-hidden />
                      </span>
                    </div>
                    {PRODUCTS.map((p) => (
                      <ProductCard key={p.img} product={p} brand={brand} />
                    ))}
                  </Fragment>
                ))}
              </motion.div>

              {/* fade so the feed slides under the tab bar instead of cutting */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-50 via-ink-50/80 to-transparent"
              />
            </div>

            {/* bottom tab bar */}
            <div className="relative z-10 flex items-center justify-around bg-white px-4 pt-2 pb-2.5 shadow-[0_-10px_28px_-16px_rgba(11,18,32,0.25)]">
              {[
                { icon: Home, label: "হোম", active: true },
                { icon: LayoutGrid, label: "ক্যাটাগরি", active: false },
                { icon: ShoppingCart, label: "কার্ট", active: false },
                { icon: User, label: "প্রোফাইল", active: false },
              ].map((tab) => (
                <span
                  key={tab.label}
                  className="flex flex-col items-center gap-1"
                  style={{ color: tab.active ? brand.accent : "#94a3b8" }}
                >
                  <tab.icon className="h-4 w-4" aria-hidden />
                  <span className="text-[8.5px] font-bold">{tab.label}</span>
                </span>
              ))}
              <span
                aria-hidden
                className="absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-ink-200"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ---------- Section ---------- */

export function BrandApp() {
  const brand = BRAND;

  return (
    <section
      id="brand-app"
      aria-labelledby="brand-app-title"
      className="relative scroll-mt-24 py-10 sm:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />
      <div
        aria-hidden
        className="absolute top-1/3 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full opacity-40 blur-[130px] transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, ${brand.accent}44, transparent 70%)`,
        }}
      />

      <Container>
        <SectionHeading
          id="brand-app-title"
          title={
            <>
              এমন মোবাইল অ্যাপ, যেটা{" "}
              <span className="text-brand-600 dark:text-brand-400">
                Brand তৈরি করে
              </span>
            </>
          }
          subtitle="নিজের ব্র্যান্ডের নাম, রঙ আর লোগোয় সাজানো আলাদা ই-কমার্স অ্যাপ — গ্রাহকের ফোনে রোজকার কেনাকাটার অ্যাপ হয়ে থাকবে আপনার মোবাইল অ্যাপ"
        />
      </Container>

      <Container className="mt-10">
        {/* The text column is pinned to its own width instead of taking a 1fr
            share, so the phone sits right beside the copy with only a normal
            gap between them — a 1fr track left a wide empty stretch in front
            of the device. The pair is then centred in the container. */}
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,34rem)_auto] lg:justify-center lg:gap-10">
          <Reveal className="max-w-2xl">
            <ul className="mt-7 space-y-4">
              {FEATURES.map((feature, i) => (
                <Reveal
                  as="li"
                  key={feature.title}
                  delay={0.1 + i * 0.08}
                  y={12}
                  className="flex items-start gap-3.5"
                >
                  <span
                    className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white shadow-soft transition-colors duration-700"
                    style={{
                      background: `linear-gradient(135deg, ${brand.from}, ${brand.to})`,
                    }}
                  >
                    <feature.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <b className="block font-display text-sm font-bold text-ink-900">
                      {feature.title}
                    </b>
                    <span className="text-[13px] leading-relaxed text-ink-500">
                      {feature.text}
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="justify-self-center">
            <BrandPhone brand={brand} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
