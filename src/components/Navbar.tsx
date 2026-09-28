import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink, Container } from "./ui";
import { openDemoVideo, useDemoVideoOpen } from "./DemoVideo";
import { cn } from "../utils/cn";

// Where every WhatsApp CTA on the page points. Same number as the hero's and
// the drawer's "ট্রাই করে দেখুন" button.
const WHATSAPP_URL = "https://wa.me/8801891614300";

/* `demo` items have no target — they open the video popup. Full-URL items leave
   the page, so the scroll-spy below only watches in-page `#` links. */
const navItems: { href?: string; label: string; demo?: boolean }[] = [
  { href: "#top", label: "হোম" },
  { href: "#landing-pages", label: "ফিচার" },
  { label: "প্রোডাক্ট ডেমো", demo: true },
  { href: "#pricing", label: "প্রাইসিং" },
  { href: "#faq", label: "প্রশ্নোত্তর" },
  { href: WHATSAPP_URL, label: "যোগাযোগ" },
];

function BrandMark() {
  return (
    <img
      src="/images/logo.webp"
      alt=""
      className="h-8 w-8 shrink-0 rounded-xl object-contain"
    />
  );
}

export function Navbar() {
  const videoOpen = useDemoVideoOpen();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const stored = localStorage.getItem("eb-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(({ href }) =>
        href?.startsWith("#") ? document.querySelector(href) : null,
      )
      .filter((section): section is Element => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) => entry.isIntersecting && setActive(`#${entry.target.id}`),
        ),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1000 && setMenuOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("eb-theme", next ? "dark" : "light");
    setDark(next);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 transition-colors duration-300">
      <div
        className={cn(
          "absolute inset-0 -z-10 border-b border-transparent bg-white/70 opacity-0 backdrop-blur-xl transition-opacity duration-300 dark:border-white/10 dark:bg-ink-950/75",
          (scrolled || menuOpen) && "opacity-100",
        )}
      />
      <Container className="flex min-h-[4.5rem] items-center gap-4">
        <a
          href="#top"
          onClick={closeMenu}
          className="inline-flex items-center gap-2.5 font-display text-[1.2rem] font-bold tracking-tight text-ink-900 dark:text-white"
          aria-label="EcomByte হোম পেজ"
        >
          <BrandMark />
          <span>
            Ecom<span className="text-brand-600 dark:text-brand-400">Byte</span>
          </span>
        </a>

        <nav
          className="mx-auto hidden items-center gap-0.5 lg:flex"
          aria-label="প্রধান মেনু"
        >
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-base font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white",
                  active === item.href &&
                    "bg-brand-100/70 text-brand-700 dark:bg-brand-400/15 dark:text-brand-300",
                )}
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={(event) => openDemoVideo(event.currentTarget)}
                aria-haspopup="dialog"
                aria-expanded={videoOpen}
                className="rounded-full px-3.5 py-2 text-base font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white/70 text-ink-700 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-white/15 dark:bg-white/5 dark:text-ink-200 dark:hover:bg-white/10"
            aria-label={dark ? "লাইট মোডে যান" : "ডার্ক মোডে যান"}
          >
            {dark ? (
              <Sun className="h-4.5 w-4.5" aria-hidden="true" />
            ) : (
              <Moon className="h-4.5 w-4.5" aria-hidden="true" />
            )}
          </button>
          <ButtonLink
            href={WHATSAPP_URL}
            size="sm"
            className="hidden sm:inline-flex"
          >
            ট্রাই করে দেখুন
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 bg-white/70 text-ink-700 dark:border-white/15 dark:bg-white/5 dark:text-ink-200 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      <button
        type="button"
        aria-label="মেনু বন্ধ করুন"
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-[60] bg-ink-950/35 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      />
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          "fixed top-0 right-0 z-[70] flex h-dvh w-[70vw] flex-col border-l border-ink-100 bg-white/95 px-5 pt-5 pb-8 shadow-[-18px_0_45px_-24px_rgba(11,18,32,0.45)] backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-ink-950/95 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-100 pb-4 dark:border-white/10">
          <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
            মেনু
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-200 text-ink-700 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-white/15 dark:text-ink-200 dark:hover:bg-white/10"
            aria-label="মেনু বন্ধ করুন"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav className="flex flex-col" aria-label="মোবাইল মেনু">
          {navItems.map((item) =>
            item.href ? (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                aria-current={active === item.href ? "true" : undefined}
                className="border-b border-ink-100 py-3 text-base font-semibold text-ink-900 dark:border-white/10 dark:text-white"
              >
                {item.label}
              </a>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={(event) => {
                  closeMenu();
                  openDemoVideo(event.currentTarget);
                }}
                aria-haspopup="dialog"
                aria-expanded={videoOpen}
                className="border-b border-ink-100 py-3 text-left text-base font-semibold text-ink-900 dark:border-white/10 dark:text-white"
              >
                {item.label}
              </button>
            ),
          )}
          <a
            href={WHATSAPP_URL}
            onClick={closeMenu}
            className="mt-3 inline-flex justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
          >
            ১৪ দিন ফ্রি ট্রায়াল শুরু করুন
          </a>
        </nav>
      </div>
    </header>
  );
}
