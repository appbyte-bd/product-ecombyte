import type { ReactNode } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import { ButtonLink, Container, Reveal, SectionHeading } from "./ui";
import { cn } from "../utils/cn";

interface Plan {
  name: string;
  price: string | null;
  period?: string;
  advanceBusinessReport: string;
  setupFee: string;
  popular?: boolean;
  cta: string;
}

interface Feature {
  text: string;
  plans: boolean[];
}

const p = {
  title: "আপনার জন্য সঠিক প্ল্যান বেছে নিন",
  subtitle:
    "আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন। হোস্টিং, আপডেট ও সাপোর্ট সবই অন্তর্ভুক্ত।",
  perYear: "/বছর",
  popular: "জনপ্রিয়",
  custom: "আলোচনার সাপেক্ষে",
  advanceBusinessReport: "অ্যাডভান্স বিজনেস রিপোর্ট",
  setupFee: "সেটআপ ফি",
  plans: [
    {
      name: "প্যাকেজ ১",
      price: "১০,০০০",
      advanceBusinessReport: "রয়েছে",
      setupFee: "নেই",
      cta: "যোগাযোগ করুন",
      popular: true,
    },
    {
      name: "প্যাকেজ ২",
      price: "১০০০",
      period: "/মাস",
      advanceBusinessReport: "রয়েছে",
      setupFee: "৳১,০০০",
      cta: "যোগাযোগ করুন",
    },

    {
      name: "প্যাকেজ ৩",
      price: "৭০০০",
      advanceBusinessReport: "নেই",
      setupFee: "নেই",
      cta: "যোগাযোগ করুন",
    },
  ] as Plan[],
  highlights: [
    { label: "এমপ্লয়ী ম্যানেজমেন্ট", value: "আনলিমিটেড" },
    { label: "অর্ডার প্রসেস", value: "আনলিমিটেড" },
    { label: "এক্সট্রা অর্ডার চার্জ", value: "নেই" },
    { label: "অতিরিক্ত মাসিক চার্জ", value: "নেই" },
  ],
  features: [
    {
      text: "মাত্র ০.১৫ মিলি-সেকেন্ডে সুপারফাস্ট লোডিং।",
      plans: [true, true, true],
    },
    {
      text: "৭ টি কুরিয়ার ডেটা দিয়ে ফেক কাস্টমার অটো ব্লক।",
      plans: [true, true, true],
    },
    {
      text: "অর্ডার কনফার্ম করলেই অটো কুরিয়ার সেন্ড।",
      plans: [true, true, true],
    },
    {
      text: "কুরিয়ারের Return ও Paid প্যানেলে অটো আপডেট।",
      plans: [true, true, true],
    },
    {
      text: "অর্ডারসমূহ Active Employee দের মধ্যে সমানভাবে ভাগ হবে",
      plans: [true, true, true],
    },
    { text: "Unlimited Incomplete অর্ডার", plans: [true, true, true] },
    {
      text: "Return Received রিটার্ন পার্সেল কুরিয়ার থেকে বুঝে নিন",
      plans: [true, true, true],
    },
    {
      text: "ফেসবুক ও টিকটক পিক্সেল সম্পূর্ণ ফ্রি সেটআপ।",
      plans: [true, true, true],
    },
    {
      text: "FB & Tik Tok Conversion API সেটআপ ফ্রি",
      plans: [true, true, false],
    },
    {
      text: "SEO Sitemap Google Indexing (গুগল র‍্যাংকিং)",
      plans: [true, true, true],
    },
    {
      text: "রিয়েল-টাইম FB Catalog আপডেট ও Feed লিংক",
      plans: [true, true, false],
    },
    {
      text: "ল্যান্ডিং পেজের জন্য রেডিমেড টেমপ্লেট সুবিধা।",
      plans: [true, true, true],
    },
    {
      text: "কাস্টমারের নাম্বার টাইপ করলেই ডেটা অটো-ফিল।",
      plans: [true, true, true],
    },
    {
      text: "এক ক্লিকেই কাস্টমারের হোয়াটসঅ্যাপে মেসেজ।",
      plans: [true, true, true],
    },
    {
      text: "যেকোনো মোবাইল নাম্বারে সিঙ্গেল বা বাল্ক SMS সেন্ড।",
      plans: [true, true, false],
    },
    { text: "নিরাপদ OTP এবং SMS রিটার্গেটিং।", plans: [true, true, false] },
    {
      text: "OTP ভেরিফিকেশনের মাধ্যমে ১০০% রিয়েল কাস্টমার যাচাই।",
      plans: [true, true, false],
    },
    {
      text: "স্প্যামিং ও বট হিট ঠেকাতে স্মার্ট IP ব্লকিং সিস্টেম।",
      plans: [true, true, true],
    },
    {
      text: "বারবার ফেইক অর্ডার আটকাতে কাস্টম অর্ডার গ্যাপ ডিউরেশন।",
      plans: [true, true, false],
    },
    {
      text: "Gross Sales ও Net Profit এর অটো রিপোর্ট।",
      plans: [true, true, true],
    },
    { text: "Ads ও কুরিয়ার খরচের নিখুঁত হিসাব।", plans: [true, true, true] },
    {
      text: "ট্রানজিটে থাকা পার্সেল থেকে সম্ভাব্য লাভের হিসাব।",
      plans: [true, true, true],
    },
    {
      text: "ইনভয়েস স্টিকার প্রিন্ট সহ ১০+ রেডি টেমপ্লেট।",
      plans: [true, true, true],
    },
    {
      text: "দ্রুত প্যাকিংয়ের জন্য এক পেজে ৩টি ইনভয়েস প্রিন্ট।",
      plans: [true, true, true],
    },
    { text: "সেলস বাড়াতে আকর্ষণীয় ব্রাইট লেআউট।", plans: [true, true, true] },
    {
      text: "ওয়েবসাইটের হেডার ও কালার থিম কাস্টমাইজেবল।",
      plans: [true, true, true],
    },
    {
      text: "Unlimited ভিজিটর ও ব্যান্ডউইথ (হোস্টিং ফ্রি)।",
      plans: [true, true, true],
    },
    { text: "Unlimited প্রোডাক্ট আপলোড", plans: [true, true, true] },
    {
      text: "ভবিষ্যতের সব নতুন ফিচার আপডেট একদম ফ্রি!",
      plans: [true, true, true],
    },
  ] as Feature[],
  tableTitle: "সব প্যাকেজের ফিচার তুলনা",
  footnote:
    "প্যাকেজ ২-এর মূল্য মাসিক; প্যাকেজ ১ ও প্যাকেজ ৩-এর মূল্য পুরো এক বছরের জন্য। মূল্যে ভ্যাট অন্তর্ভুক্ত।",
};

/* Package card: one column per plan, stacked on mobile and side by side on desktop. */
function PlanCard({ plan, children }: { plan: Plan; children?: ReactNode }) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col items-center rounded-2xl border p-6 text-center",
        plan.popular
          ? "border-brand-300 bg-brand-50 pt-8 dark:border-brand-500/50 dark:bg-brand-950/60"
          : plan.price
            ? "border-ink-100 bg-white shadow-soft"
            : "border-2 border-dashed border-brand-300 bg-white shadow-soft dark:border-brand-500/50",
      )}
    >
      {plan.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-brand-400 px-4 py-1 text-xs font-bold whitespace-nowrap text-white">
          {p.popular}
        </span>
      )}

      <span className="text-sm font-semibold tracking-wide text-ink-500 uppercase">
        {plan.name}
      </span>

      {plan.price ? (
        <span className="mt-2 flex items-end gap-1.5">
          <span
            className={cn(
              "text-xl font-bold",
              plan.popular
                ? "text-brand-700 dark:text-brand-300"
                : "text-brand-600",
            )}
          >
            ৳
          </span>
          <span className="text-3xl font-bold tracking-tight text-ink-900 tabular-nums">
            {plan.price}
          </span>
          <span className="text-sm font-medium text-ink-500">
            {plan.period ?? p.perYear}
          </span>
        </span>
      ) : (
        <span className="mt-2 text-xl font-bold tracking-tight text-ink-900">
          {p.custom}
        </span>
      )}

      <dl
        className={cn(
          "mt-4 w-full space-y-2 border-t pt-4 text-left",
          plan.popular
            ? "border-brand-200 dark:border-brand-500/30"
            : "border-ink-100",
        )}
      >
        {p.highlights.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <dt className="text-ink-500">{row.label}</dt>
            <dd className="font-semibold text-ink-900">{row.value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-2 text-sm">
          <dt className="text-ink-500">{p.advanceBusinessReport}</dt>
          <dd className="font-semibold text-ink-900">
            {plan.advanceBusinessReport}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <dt className="text-ink-500">{p.setupFee}</dt>
          <dd className="font-semibold text-ink-900">{plan.setupFee}</dd>
        </div>
      </dl>

      {children}
    </div>
  );
}

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 py-10 sm:py-16"
      aria-labelledby="pricing-title"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/3 -z-10 h-[30rem] bg-gradient-to-b from-brand-50/80 to-transparent"
      />

      <Container>
        <SectionHeading
          id="pricing-title"
          title={p.title}
          subtitle={p.subtitle}
        />

        <Reveal className="mt-8">
          <h3 className="text-center text-xl font-bold tracking-tight text-ink-900 sm:text-2xl">
            {p.tableTitle}
          </h3>

          {/* stacked on mobile, three side by side on desktop */}
          <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-6">
            {p.plans.map((plan, planIndex) => (
              <PlanCard key={plan.name} plan={plan}>
                <ul
                  className={cn(
                    "mt-4 w-full space-y-3 border-t pt-4 text-left",
                    plan.popular
                      ? "border-brand-200 dark:border-brand-500/30"
                      : "border-ink-100",
                  )}
                >
                  {p.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-3 text-[15px] text-ink-600"
                    >
                      {feature.plans[planIndex] ? (
                        <Check
                          aria-label="অন্তর্ভুক্ত"
                          className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600"
                          strokeWidth={3}
                        />
                      ) : (
                        <X
                          aria-label="অন্তর্ভুক্ত নয়"
                          className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ink-300"
                          strokeWidth={3}
                        />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <ButtonLink
                  href="https://wa.me/8801891614300"
                  variant={plan.popular ? "primary" : "dark"}
                  size="md"
                  className="mt-5 w-full"
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
              </PlanCard>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm text-ink-500">{p.footnote}</p>
        </Reveal>
      </Container>
    </section>
  );
}
