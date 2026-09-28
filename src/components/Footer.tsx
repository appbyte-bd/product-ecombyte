import { Globe, Phone, Mail } from "lucide-react";
import type { SVGProps } from "react";
import { Container } from "./ui";

type IconProps = SVGProps<SVGSVGElement>;
const Facebook = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.4c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V14h2.8v8h3.3z" />
  </svg>
);
const Instagram = (p: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
  </svg>
);
const Youtube = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
  </svg>
);
const socials = [
  {
    icon: Facebook,
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61581379350465",
  },
  {
    icon: Instagram,
    label: "Instagram",
    url: "https://www.instagram.com/appbytebd",
  },
  {
    icon: Youtube,
    label: "YouTube",
    url: "https://www.youtube.com/@appByte-bd",
  },
  { icon: Globe, label: "Website", url: "https://appbyte.net/" },
];

const waHref = "https://wa.me/8801891614300";

const f = {
  tagline: "শুধুমাত্র বাংলাদেশের জন্য তৈরি ই‑কমার্স সলিউশন।",
  columns: [
    {
      title: "প্রোডাক্ট",
      links: ["ফিচার", "প্রাইসিং", "ইন্টিগ্রেশন", "মোবাইল অ্যাপ", "চেঞ্জলগ"],
    },
    {
      title: "রিসোর্স",
      links: [
        "হেল্প সেন্টার",
        "সেলার একাডেমি",
        "ব্লগ",
        "ট্রেড লাইসেন্স গাইড",
        "বিকাশ মার্চেন্ট গাইড",
        "API ডকস",
      ],
    },
    {
      title: "কোম্পানি",
      links: ["আমাদের সম্পর্কে", "ক্যারিয়ার", "পার্টনার", "প্রেস", "যোগাযোগ"],
    },
    {
      title: "আইনি",
      links: [
        "সেবার শর্তাবলি",
        "গোপনীয়তা নীতি",
        "রিফান্ড নীতি",
        "ডেটা নিরাপত্তা",
      ],
    },
  ],
  phone: "01891-614300",
  email: "business.appbyte@gmail.com",
  copyright: `© ${new Date().getFullYear()} appByte Technologies Ltd`,
};

export function Footer() {
  return (
    <footer className="relative border-t border-ink-100 bg-white pt-16 pb-8">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <img
                src="/images/logo.webp"
                alt=""
                className="h-9 w-9 rounded-xl object-contain"
              />
              <span className="font-display text-[1.2rem] font-bold tracking-tight text-ink-900">
                Ecom<span className="text-brand-600">Byte</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              {f.tagline}
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-ink-600">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-600" />
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink-900"
                >
                  {f.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-600" />
                <a href={`mailto:${f.email}`} className="hover:text-ink-900">
                  {f.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target={s.url.startsWith("http") ? "_blank" : undefined}
                  rel={s.url.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {f.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-bold tracking-tight text-ink-900">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-ink-500 transition-colors hover:text-brand-700"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-5 text-sm text-ink-400 ">{f.copyright}</p>
      </Container>
    </footer>
  );
}
