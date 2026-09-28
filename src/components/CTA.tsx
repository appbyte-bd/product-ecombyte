import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Container, Reveal } from "./ui";

export function CTA() {
  return (
    <section
      id="cta"
      className="relative scroll-mt-24 pb-18 sm:pb-24 lg:pb-30"
      aria-labelledby="cta-title"
    >
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[clamp(24px,4vw,40px)] bg-[linear-gradient(140deg,#04382A,#00694D)] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,7vw,5.5rem)] text-center text-[#EAF6F0] shadow-[0_2px_4px_rgba(6,40,29,0.05),0_40px_70px_-30px_rgba(6,70,50,0.42)] dark:bg-[linear-gradient(140deg,#021c15,#003b2c)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_40px_70px_-30px_rgba(0,0,0,0.7)]">
            {/* aurora */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <i
                className="animate-drift absolute -top-32 -left-40 h-144 w-144 rounded-full bg-[radial-gradient(circle,rgba(32,197,146,0.5),transparent_68%)] blur-[72px]"
                style={{ animationDuration: "24s" }}
              />
              <i
                className="animate-drift absolute -top-8 -right-32 h-120 w-120 rounded-full bg-[radial-gradient(circle,rgba(228,161,42,0.35),transparent_68%)] blur-[72px]"
                style={{ animationDuration: "30s", animationDelay: "-8s" }}
              />

              {/* dot field */}
              <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_90%_at_50%_50%,#000_10%,transparent_75%)]">
                <i className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.16)_1.3px,transparent_1.8px)] [background-size:26px_26px]" />
                <i className="absolute inset-0 animate-[hero-scan_11s_linear_infinite] bg-[radial-gradient(circle,#7CEBC6_1.8px,transparent_2.4px)] [background-size:26px_26px] [mask-image:linear-gradient(105deg,transparent_42%,#000_50%,transparent_58%)] [mask-size:300%_100%]" />
              </div>
            </div>

            <div className="relative mx-auto max-w-[44rem]">
              <motion.h2
                id="cta-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-[clamp(1.9rem,4.6vw,3.3rem)] leading-[1.15] font-extrabold tracking-tight text-white text-balance"
              >
                আজই ডিজিটাল করুন আপনার ব্যবসাকে
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mx-auto mt-5 max-w-[36rem] text-[1.15rem] text-[#EAF6F0]/85"
              >
                আপনার সফলতার গল্প লিখুন EcomByte এর মাধ্যমে
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <ButtonLink
                  href="https://wa.me/8801891614300"
                  variant="white"
                  size="lg"
                  className="w-full text-brand-800 dark:text-white sm:w-auto"
                >
                  ফ্রি ট্রায়াল শুরু করুন
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
