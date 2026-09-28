/*
 * Unlimited landing pages. A ready-made animated GIF (public/landingpage.gif)
 * stands in for the built visual.
 *
 * Shared by slide 2 of the hero carousel and the standalone section, so the two
 * can never drift apart. The default size fits the carousel's h-[260px] stage;
 * the section passes a larger className for its taller stage.
 */
export function LandingPageVisual({
  className = "h-[240px] w-[240px] object-contain",
}: {
  className?: string;
  /** Carousel slides pass this for interface parity; the GIF is always animated. */
  reduced?: boolean;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <img
        src="/landingpage.gif"
        alt=""
        aria-hidden="true"
        className={className}
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
