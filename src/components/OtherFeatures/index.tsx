import { motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Container,
  SectionHeading,
  SpotlightCard,
  StaggerGroup,
  StaggerItem,
} from "../ui";
import { bn } from "../../utils/bn";

/*
 * Standalone section for "আরও ফিচার". These are the Storola feature cards that
 * the site did not already cover in a section of its own (courier, fake order,
 * stock, landing page, mobile app, server tracking and so on live higher up the
 * page). The card shape follows the reference grid — a numbered tile, an
 * illustration and a title — but it is re-skinned in the site's green brand
 * palette and given a short one-line description.
 *
 * Illustrations were downloaded to /public/images/other-features, so nothing is
 * hot-linked from the source site at runtime.
 */

type Feature = {
  img: string;
  title: string;
  text: string;
};

const FEATURES: Feature[] = [
  {
    img: "/images/other-features/delivery-charge-management.webp",
    title: "ডেলিভারি চার্জ ম্যানেজমেন্ট",
    text: "৬৪ জেলার জন্য জোনভিত্তিক ডেলিভারি চার্জ — একবার সেট করলেই অর্ডারে অটো বসে যায়।",
  },
  {
    img: "/images/other-features/advance-payment-system.webp",
    title: "অ্যাডভান্সড পেমেন্ট সিস্টেম",
    text: "bKash, Nagad বা Rocket-এ অ্যাডভান্স টাকা নিন, প্রুফ যাচাই করে অর্ডার কনফার্ম করুন।",
  },
  {
    img: "/images/other-features/coupon-voucher-management.webp",
    title: "কুপন এবং ভাউচার ম্যানেজমেন্ট",
    text: "পারসেন্টেজ বা ফিক্সড ডিসকাউন্ট, কুপন কোড, মেয়াদ ও ব্যবহারের সীমা — সব নিজের হাতে।",
  },
  {
    img: "/images/other-features/telegram-order-alert.webp",
    title: "অর্ডার এলার্ট Notification",
    text: "নতুন অর্ডার এলেই নোটিফিকেশন — ফোন না খুলেই অর্ডার হ্যান্ডেল।",
  },
  {
    img: "/images/other-features/payment-gateway-integration.webp",
    title: "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
    text: "জনপ্রিয় পেমেন্ট গেটওয়ে যুক্ত করে অনলাইনেই টাকা নিন — COD-নির্ভরতা কমান।",
  },
  {
    img: "/images/other-features/google-tag-manager-analytics.webp",
    title: "গুগল ট্যাগ ম্যানেজার ও অ্যানালাইটিক",
    text: "GTM আর Google Analytics সহজ সেটআপ — ট্রাফিক ও কনভার্শন মাপুন নির্ভুলভাবে।",
  },
  {
    img: "/images/other-features/dynamic-theme-layout-manager.webp",
    title: "ডায়নামিক থিম লেআউট ম্যানেজার",
    text: "কোড ছাড়াই হেডার, ফুটার ও সেকশনের সাজ বদলান — এক ক্লিকে নতুন লুক।",
  },
  {
    img: "/images/other-features/marketing-friendly.webp",
    title: "মার্কেটিং ফ্রেন্ডলি",
    text: "ক্যাম্পেইন, পিক্সেল আর অফার — বিজ্ঞাপন চালানোর সব সরঞ্জাম আগে থেকেই রেডি।",
  },
  {
    img: "/images/other-features/powerful-admin-dashboard.webp",
    title: "পাওয়ারফুল অ্যাডমিন ড্যাশবোর্ড",
    text: "সেলস, স্টক, কুরিয়ার আর খরচ — পুরো ব্যবসার ছবি একটাই শক্তিশালী ড্যাশবোর্ডে।",
  },
  {
    img: "/images/other-features/multiple-chat-widget.webp",
    title: "মাল্টিপল চ্যাট উইজেট",
    text: "WhatsApp, Messenger ও লাইভ চ্যাট — গ্রাহক যেখানে স্বাচ্ছন্দ্য, সেখানেই যোগাযোগ।",
  },
  {
    img: "/images/other-features/staff-management.webp",
    title: "স্টাফ ম্যানেজমেন্ট",
    text: "অ্যাডমিন, ম্যানেজার আর এমপ্লয়ি — আলাদা রোল ও পারমিশন দিয়ে টিম চালান নিরাপদে।",
  },
  {
    img: "/images/other-features/auto-invoice.webp",
    title: "অটো ইনভয়েস",
    text: "প্রতিটি অর্ডারের ইনভয়েস অটো তৈরি — এক ক্লিকে প্রিন্ট বা PDF ডাউনলোড করুন।",
  },
  {
    img: "/images/other-features/seo-friendly.webp",
    title: "এসইও ফ্রেন্ডলি",
    text: "JSON-LD, Open Graph, sitemap আর canonical — গুগলে র‍্যাংক করার সবকিছু অটো রেডি।",
  },
  {
    img: "/images/other-features/cloud-hosting-ssl.webp",
    title: "ক্লাউড হোস্টিং ও এসএসএল সার্টিফিকেট",
    text: "ফ্রি ক্লাউড হোস্টিং আর ফ্রি SSL — সাইট সবসময় চালু, ডেটা সবসময় নিরাপদ।",
  },
  {
    img: "/images/other-features/product-quotation-manager.webp",
    title: "প্রোডাক্ট কোটেশন ম্যানেজার",
    text: "বাল্ক অর্ডারের জন্য কোটেশন তৈরি, পাঠান আর ট্র্যাক করুন — B2B বিক্রি সহজ।",
  },
  {
    img: "/images/other-features/product-review-manager.webp",
    title: "প্রোডাক্ট রিভিউ ম্যানেজার",
    text: "গ্রাহকের রিভিউ ও ৫-স্টার রেটিং — মডারেট করে পাবলিশ করুন, বিশ্বাস বাড়ান।",
  },
  {
    img: "/images/other-features/group-product-checkout.webp",
    title: "গ্রুপ প্রোডাক্ট চেকআউট",
    text: "একাধিক পণ্য বান্ডল করে অর্ডার — গ্রাহক এক ক্লিকেই পুরো সেট কিনতে পারে।",
  },
  {
    img: "/images/other-features/statistical-product-page-view.webp",
    title: "স্ট্র্যাটেজিক প্রোডাক্ট পেজ ভিউ",
    text: "কোন পণ্য কতবার দেখা হচ্ছে — ভিউ ডেটা দেখে বুঝুন আগামী সেরা বিক্রি কী।",
  },
  {
    img: "/images/other-features/guest-order-tracking.webp",
    title: "অর্ডার ট্র্যাকিং",
    text: "লগইন ছাড়াই সিকিউর লিংকে অর্ডার ট্র্যাক — গ্রাহক নিজেই স্ট্যাটাস দেখতে পারে।",
  },
  {
    img: "/images/other-features/min-max-quantity-control.webp",
    title: "মিনিমাম/ম্যাক্সিমাম কোয়ান্টিটি কন্ট্রোল",
    text: "প্রতিটি পণ্যে সর্বনিম্ন ও সর্বোচ্চ অর্ডার লিমিট — লস আর ভুল অর্ডার কমে।",
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <StaggerItem className="h-full">
      <SpotlightCard className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-glow sm:p-6 dark:border-white/10">
        {/* green wash behind the illustration, warmed on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-50/80 to-transparent transition-opacity duration-500 group-hover:from-brand-100/90 dark:from-brand-500/10"
        />
        {/* thin top accent that grows out from the left on hover */}
        <span
          aria-hidden
          className="absolute inset-x-5 top-0 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-500 to-sky-400 transition-transform duration-500 group-hover:scale-x-100"
        />

        <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-200/70 bg-white/80 px-2.5 py-1 text-[10.5px] font-bold text-brand-700 tabular-nums shadow-soft backdrop-blur dark:border-brand-400/25 dark:bg-white/5 dark:text-brand-300">
          <Check className="h-3 w-3" aria-hidden />
          {bn(index + 1)}
        </span>

        <div className="relative mx-auto grid h-32 w-full place-items-center sm:h-36">
          <motion.img
            src={feature.img}
            alt=""
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-[78%] object-contain drop-shadow-[0_10px_24px_rgba(4,120,87,0.16)] transition-transform duration-500 group-hover:scale-[1.06]"
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <h3 className="relative mt-4 text-[15px] leading-snug font-bold tracking-tight text-ink-900">
          {feature.title}
        </h3>
        <p className="relative mt-1.5 text-[12.5px] leading-relaxed text-ink-500">
          {feature.text}
        </p>
      </SpotlightCard>
    </StaggerItem>
  );
}

export function OtherFeatures() {
  return (
    <section
      id="other-features"
      aria-labelledby="other-features-title"
      className="relative scroll-mt-24 py-10 sm:py-16"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ink-200 to-transparent"
      />
      <div
        aria-hidden
        className="absolute top-1/4 left-1/2 -z-10 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-brand-400/10 blur-[130px]"
      />

      <Container>
        <SectionHeading
          id="other-features-title"
          title={
            <>
              আরও যা যা ফিচার থাকছে{" "}
              <span className="text-brand-600 dark:text-brand-400">
                আমাদের এই EcomByte সিস্টেমে
              </span>
            </>
          }
          subtitle="পেমেন্ট ও কুপন থেকে শুরু করে চ্যাট উইজেট, স্টাফ ম্যানেজমেন্ট আর এসইও — ছোট ছোট ফিচারগুলোই দৈনন্দিন কাজ সহজ করে, আর সবটাই একই প্ল্যাটফর্মে।"
        />
      </Container>

      <Container className="mt-10">
        <StaggerGroup
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          delay={0.06}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
