import { X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// Demo video that opens from the hero's "ফিচারস গুলো দেখুন" button and the
// navbar's প্রোডাক্ট ডেমো item. `autoplay=1` is what starts playback the moment
// the popup mounts — the click that opened the popup already counts as a user
// gesture, so no second tap is needed.
const VIDEO_ID = "f9HlOycwihw";
const VIDEO_SRC = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/*
 * The popup is one instance, mounted once in <App />. A tiny store lets any
 * button ask for it without prop-drilling, and remembers which element opened
 * it so focus can go back there when it closes.
 */
let open = false;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openDemoVideo(trigger?: HTMLElement | null) {
  opener = trigger ?? (document.activeElement as HTMLElement | null);
  open = true;
  emit();
}

export function closeDemoVideo() {
  open = false;
  emit();
}

export function useDemoVideoOpen() {
  return useSyncExternalStore(subscribe, () => open);
}

export function DemoVideoModal() {
  const open = useDemoVideoOpen();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);
    return () => motionQuery.removeEventListener("change", syncMotion);
  }, []);

  // While the popup is open: Escape closes it, the page behind stops scrolling,
  // focus moves onto the close button and returns to whatever opened it. The
  // video unmounts with the popup, so closing also stops it.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDemoVideo();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="demo-video"
          role="dialog"
          aria-modal="true"
          aria-label="EcomByte ডেমো ভিডিও"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: EASE_OUT }}
        >
          {/* Backdrop: click anywhere outside the video to close */}
          <div
            aria-hidden="true"
            onClick={closeDemoVideo}
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.97, y: 14, filter: "blur(8px)" }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 260, damping: 28, mass: 0.9 }
            }
            className="relative z-10 w-full max-w-3xl"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={closeDemoVideo}
              aria-label="ভিডিও বন্ধ করুন"
              className="absolute -top-11 right-0 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="ring-gradient overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-[0_30px_90px_-26px_rgba(0,0,0,0.85)]">
              <div className="relative aspect-video w-full">
                {/* Sits behind the player while YouTube loads, so the popup
                    never opens as an empty black box. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center"
                >
                  <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
                </span>
                <iframe
                  src={VIDEO_SRC}
                  title="EcomByte ডেমো ভিডিও"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
