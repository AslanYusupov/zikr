import { useEffect, useId, useRef, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useZikr } from "@/lib/zikr/store";
import { tx } from "@/lib/zikr/i18n";
import { cn } from "@/lib/cn";

export function Arch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M16 86 V46 C16 26 32 14 50 14 C68 14 84 26 84 46 V86" />
      <path d="M30 86 V48 C30 34 39 26 50 26 C61 26 70 34 70 48 V86" opacity="0.65" />
    </svg>
  );
}

export function Crescent({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="white" />
          <circle cx="64" cy="44" r="28" fill="black" />
        </mask>
      </defs>
      <circle cx="46" cy="50" r="32" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  );
}

const FLOW = [
  [8, 1.4, 0, 34],
  [16, 2.2, 6, 42],
  [24, 1.1, 11, 28],
  [33, 1.8, 3, 38],
  [41, 2.6, 14, 46],
  [49, 1.2, 8, 32],
  [57, 1.7, 1, 36],
  [64, 2.1, 17, 44],
  [72, 1, 5, 30],
  [80, 1.9, 12, 40],
  [88, 1.3, 9, 33],
  [12, 2.4, 15, 48],
  [28, 1.5, 4, 35],
  [45, 1.1, 19, 29],
  [61, 2, 7, 41],
  [76, 1.6, 13, 37],
  [93, 1.2, 2, 31],
  [20, 2.3, 10, 45],
  [53, 1.4, 16, 39],
  [69, 1.8, 6, 34],
] as const;

const RAIN = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + (i % 3) * 11) % 100,
  delay: (i * 0.17) % 1.4,
  dur: 0.9 + (i % 7) * 0.22,
  len: 8 + (i % 4) * 4,
}));

function Rain() {
  const on = useZikr((s) => s.rain);
  if (!on) return null;
  return (
    <div className="rain">
      {RAIN.map((drop, i) => (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            height: drop.len,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.dur}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Backdrop() {
  const stars = useZikr((s) => s.starFlow);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="scene-stars" />
      <div className="scene-dawn" />
      <div className="scene-horizon" />
      <div className="scene-roses" />
      <div className="scene-shore">
        <span className="photo-sheen" />
        <span className="photo-glint" />
        <span className="photo-rays" />
      </div>
      <div className="scene-desert">
        <span className="photo-sheen photo-sheen-warm" />
        <span className="photo-dust" />
        <span className="photo-rays" />
      </div>
      <div className="scene-cosmos">
        <span className="photo-stars" />
        <span className="photo-nebula" />
      </div>
      <div className="scene-peaks">
        <span className="photo-mist" />
        <span className="photo-mist photo-mist-late" />
      </div>
      <div className="scene-lake">
        <span className="photo-sheen photo-sheen-lake" />
        <span className="photo-sun" />
        <span className="photo-rays" />
      </div>
      <div className="scene-jungle">
        <span className="photo-rays" />
        <span className="photo-glint photo-glint-leaf" />
      </div>
      <Rain />
      {stars && (
        <div className="star-flow">
          {FLOW.map(([left, size, delay, dur], i) => (
            <span
              key={i}
              className="star-dot"
              style={{
                left: `${left}%`,
                width: size,
                height: size,
                animationDelay: `${delay}s`,
                animationDuration: `${dur}s`,
              }}
            />
          ))}
        </div>
      )}
      {stars && (
        <>
          <span className="comet comet-a" style={{ ["--tilt" as string]: "-16deg" }} aria-hidden>
            <span className="comet-tail" />
            <span className="comet-head" />
          </span>
          <span className="comet comet-b" style={{ ["--tilt" as string]: "-22deg" }} aria-hidden>
            <span className="comet-tail" />
            <span className="comet-head" />
          </span>
          <span className="comet comet-c" style={{ ["--tilt" as string]: "-12deg" }} aria-hidden>
            <span className="comet-tail" />
            <span className="comet-head" />
          </span>
        </>
      )}
    </div>
  );
}

export function Emblem({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Crescent className="h-6 w-6" />
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const pane = useRef<HTMLDivElement>(null);
  const lang = useZikr((s) => s.lang);
  useEffect(() => {
    if (pane.current) pane.current.scrollTop = 0;
  }, []);

  return (
    <div className="sheet">
      <div className="flex shrink-0 items-center gap-2 border-b border-line px-3 pt-[max(0.65rem,env(safe-area-inset-top))] pb-2">
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 min-w-0 flex-1 items-center gap-1 rounded-full border border-line bg-chip px-3 text-sm text-gold"
        >
          <ChevronLeft className="size-5 shrink-0" strokeWidth={1.6} />
          <span className="truncate">{tx(lang, "home")}</span>
        </button>
        <p className="max-w-[40%] shrink-0 truncate text-sm text-fg">{title}</p>
      </div>
      <div ref={pane} className="pane px-4 pt-3 pb-4">{children}</div>
      <div className="border-t border-line px-4 pt-2 pb-[max(0.8rem,env(safe-area-inset-bottom))]">
        <button type="button" onClick={onClose} className="h-12 w-full rounded-full bg-gold text-sm text-ink">
          {tx(lang, "backZikr")}
        </button>
      </div>
    </div>
  );
}
