import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  type ReactNode,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import { cn } from "../../utils/cn";

/* ---------- Layout ---------- */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---------- Scroll reveal ---------- */
const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: easeOut },
  },
};

export const stagger = (delay = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
});

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "p" | "h1" | "h2" | "h3";
  y?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 28,
  once = true,
}: RevealProps) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px 0px" }}
      transition={{ duration: 0.8, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </Comp>
  );
}

export function StaggerGroup({
  children,
  className,
  delay = 0.08,
  delayChildren = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  delayChildren?: number;
}) {
  return (
    <motion.div
      variants={stagger(delay, delayChildren)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px 0px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/* ---------- Typography ---------- */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-brand-700 uppercase",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  dark = false,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  dark?: boolean;
  id?: string;
}) {
  return (
    <StaggerGroup
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <StaggerItem>
          <Eyebrow
            className={dark ? "border-white/15 bg-white/5 text-brand-300" : ""}
          >
            {eyebrow}
          </Eyebrow>
        </StaggerItem>
      )}
      <StaggerItem>
        <h2
          id={id}
          className={cn(
            "mt-3 text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
            dark ? "text-white" : "text-ink-900",
          )}
        >
          {title}
        </h2>
      </StaggerItem>
      {subtitle && (
        <StaggerItem>
          <p
            className={cn(
              "mt-3 text-base leading-relaxed text-pretty sm:text-lg",
              dark ? "text-ink-300" : "text-ink-500",
            )}
          >
            {subtitle}
          </p>
        </StaggerItem>
      )}
    </StaggerGroup>
  );
}

/* ---------- Buttons ---------- */
type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "white";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "btn-shine bg-brand-600 text-white shadow-[0_8px_24px_-8px_rgba(5,150,105,0.6)] hover:bg-brand-700 hover:shadow-[0_12px_32px_-8px_rgba(5,150,105,0.7)]",
  secondary:
    "bg-white text-ink-900 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 shadow-soft",
  ghost: "text-ink-700 hover:bg-ink-100/70",
  dark: "btn-shine bg-ink-900 text-white hover:bg-ink-800 shadow-lift",
  white: "btn-shine bg-white text-brand-800 hover:bg-brand-50 shadow-lift",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

const baseButton =
  "group inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(
        baseButton,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <a
      className={cn(
        baseButton,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (!ref.current) return;
      const formatted = v.toLocaleString("bn-BD", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      ref.current.textContent = `${prefix}${formatted}${suffix}`;
    });
    return unsub;
  }, [spring, prefix, suffix, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- Tilt card (mouse-follow highlight) ---------- */
export function SpotlightCard({
  children,
  className,
  spotColor = "rgba(16,185,129,0.14)",
}: {
  children: ReactNode;
  className?: string;
  spotColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group/spot relative overflow-hidden", className)}
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--mx) var(--my), ${spotColor}, transparent 60%)`,
        }}
      />
      <div className="relative flex h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
