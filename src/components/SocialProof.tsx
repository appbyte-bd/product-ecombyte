import {
  Container,
  Counter,
  Reveal,
  SectionHeading,
  SpotlightCard,
  StaggerGroup,
  StaggerItem,
} from "./ui";

const clients = [
  "/images/clients/ecombyte-client-1.avif",
  "/images/clients/ecombyte-client-2.png",
  "/images/clients/ecombyte-client-3.png",
  "/images/clients/ecombyte-client-4.webp",
  "/images/clients/ecombyte-client-5.jpg",
  "/images/clients/ecombyte-client-6.jpg",
  "/images/clients/ecombyte-client-7.png",
  "/images/clients/ecombyte-client-8.jpg",
];

const stats = [
  {
    value: 48,
    prefix: "৳",
    suffix: " লক্ষ+",
    label: "মার্চেন্ট অর্ডার",
  },
  { value: 51, suffix: "+", label: "সক্রিয় স্টোর" },
  { value: 24, suffix: "/৭", label: "কাস্টমার সাপোর্ট" },
  { value: 99.9, suffix: "%", label: "আপটাইম, সবসময় চালু" },
];

export function SocialProof() {
  return (
    <section className="relative" aria-label="Social proof">
      <Container>
        {/* Marquee */}
        <Reveal delay={0.2} className="mt-8">
          <p className="mb-6 text-center font-display text-2xl font-bold">
            আপনার মতো ৫০+ ব্যবসায়ীর ভরসায় Ecom
            <span className="text-brand-600 dark:text-brand-400">Byte</span>
          </p>
          <div className="mask-fade-x pause-on-hover relative overflow-hidden">
            <ul
              className="animate-marquee flex w-max items-center"
              aria-label="আমাদের ক্লায়েন্ট"
            >
              {[...clients, ...clients].map((src, i) => (
                <li
                  key={`${src}-${i}`}
                  className="flex h-16 w-28 shrink-0 items-center justify-center pr-3 sm:h-24 sm:w-40 sm:pr-6"
                >
                  <img
                    src={src}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Stats */}
        <SectionHeading
          title="বাংলাদেশের অনেক অনলাইন ব্যবসার প্রতিদিনের সঙ্গী"
          className="mt-20 sm:mt-24"
        />

        <StaggerGroup
          className="mx-auto mt-10 grid w-full grid-cols-2 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-4"
          delay={0.1}
        >
          {stats.map((st) => (
            <StaggerItem key={st.label}>
              <SpotlightCard className="group rounded-2xl border border-brand-300 bg-white p-5 text-center shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-6">
                <p className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
                  <Counter
                    value={st.value}
                    prefix={st.prefix ?? ""}
                    suffix={st.suffix}
                    decimals={Number.isInteger(st.value) ? 0 : 1}
                  />
                </p>
                <p className="mt-1.5 text-sm text-ink-500">{st.label}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
