import { useEffect, useId, useRef, useState, type ReactNode } from "react";
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
  [3, 1.2, 0, 28],
  [8, 1.6, 6, 34],
  [13, 1.1, 2, 24],
  [18, 1.9, 11, 32],
  [23, 1.3, 4, 26],
  [28, 1.7, 15, 36],
  [33, 1.2, 1, 23],
  [38, 2, 9, 33],
  [43, 1.4, 13, 29],
  [48, 1.1, 5, 25],
  [53, 1.8, 17, 35],
  [58, 1.3, 3, 27],
  [63, 2.1, 12, 31],
  [68, 1.2, 7, 24],
  [73, 1.6, 16, 34],
  [78, 1.4, 8, 28],
  [83, 1.9, 1, 30],
  [88, 1.1, 14, 26],
  [93, 1.7, 4, 33],
  [97, 1.3, 10, 29],
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

const PASSES = [
  { x: "108vw", y: "8vh", x2: "-36vw", y2: "40vh", rot: "-16deg", dur: "0.78s" },
  { x: "112vw", y: "2vh", x2: "-40vw", y2: "16vh", rot: "-8deg", dur: "0.78s" },
  { x: "100vw", y: "-8vh", x2: "-30vw", y2: "58vh", rot: "-28deg", dur: "0.78s" },
  { x: "-40vw", y: "10vh", x2: "112vw", y2: "38vh", rot: "-158deg", dur: "0.78s" },
  { x: "-36vw", y: "-4vh", x2: "108vw", y2: "52vh", rot: "-143deg", dur: "0.78s" },
  { x: "-42vw", y: "32vh", x2: "110vw", y2: "64vh", rot: "-155deg", dur: "0.78s" },
  { x: "30vw", y: "-18vh", x2: "64vw", y2: "114vh", rot: "-97deg", dur: "0.78s" },
  { x: "72vw", y: "-16vh", x2: "34vw", y2: "114vh", rot: "-81deg", dur: "0.78s" },
  { x: "10vw", y: "-14vh", x2: "80vw", y2: "110vh", rot: "-106deg", dur: "0.78s" },
  { x: "90vw", y: "-12vh", x2: "16vw", y2: "110vh", rot: "0deg", dur: "0.78s" },
  { x: "118vw", y: "-6vh", x2: "-22vw", y2: "86vh", rot: "0deg", dur: "0.78s" },
  { x: "-30vw", y: "-12vh", x2: "104vw", y2: "92vh", rot: "0deg", dur: "0.78s" },
  { x: "54vw", y: "-22vh", x2: "6vw", y2: "118vh", rot: "0deg", dur: "0.78s" },
] as const;

/** Голова при нуле смотрит влево. Угол — по тем же vw/vh, что и сам полёт. */
function flightAim(x: string, y: string, x2: string, y2: string): string {
  const w = window.innerWidth || 390;
  const h = window.innerHeight || 844;
  const px = (value: string) => {
    const n = parseFloat(value);
    if (!Number.isFinite(n)) return 0;
    return (n / 100) * (value.endsWith("vw") ? w : h);
  };
  const dx = px(x2) - px(x);
  const dy = px(y2) - px(y);
  if (!dx && !dy) return "-16deg";
  const heading = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (!Number.isFinite(heading)) return "-16deg";
  return `${(heading - 180).toFixed(1)}deg`;
}

/** Тот же выбор пути, что у звезды на экране тапа. */
export function randomStarPass() {
  const base = PASSES[Math.floor(Math.random() * PASSES.length)]!;
  const nudge = (value: string, spread: number) => {
    const unit = value.endsWith("vw") ? "vw" : "vh";
    return `${(parseFloat(value) + (Math.random() * 2 - 1) * spread).toFixed(1)}${unit}`;
  };
  const pass = {
    x: nudge(base.x, 7),
    y: nudge(base.y, 5),
    x2: nudge(base.x2, 7),
    y2: nudge(base.y2, 5),
    dur: "0.78s",
  };
  return { pass, rot: flightAim(pass.x, pass.y, pass.x2, pass.y2) };
}

function TapStar() {
  const [shot, setShot] = useState<{ id: number; pass: { x: string; y: string; x2: string; y2: string; dur: string }; rot: string } | null>(null);
  const nextAt = useRef(0);
  const last = useRef(-1);
  useEffect(() => {
    let timer = 0;
    const fly = () => {
      const now = Date.now();
      if (now < nextAt.current) return;
      nextAt.current = now + 10_000 + Math.floor(Math.random() * 5_001);
      let index = Math.floor(Math.random() * PASSES.length);
      if (index === last.current) index = (index + 1 + Math.floor(Math.random() * (PASSES.length - 1))) % PASSES.length;
      last.current = index;
      const base = PASSES[index]!;
      const nudge = (value: string, spread: number) => {
        const unit = value.endsWith("vw") ? "vw" : "vh";
        return `${(parseFloat(value) + (Math.random() * 2 - 1) * spread).toFixed(1)}${unit}`;
      };
      const pass = {
        x: nudge(base.x, 7),
        y: nudge(base.y, 5),
        x2: nudge(base.x2, 7),
        y2: nudge(base.y2, 5),
        dur: "0.78s",
      };
      try {
        setShot({ id: now, pass, rot: flightAim(pass.x, pass.y, pass.x2, pass.y2) });
      } catch {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShot(null), 1500);
    };
    window.addEventListener("zikr-star", fly);
    return () => {
      window.removeEventListener("zikr-star", fly);
      window.clearTimeout(timer);
    };
  }, []);
  if (!shot) return null;
  const pass = shot.pass;
  return (
    <span
      key={shot.id}
      className="comet comet-live tap-star"
      style={{
        ["--x" as string]: pass.x,
        ["--y" as string]: pass.y,
        ["--x2" as string]: pass.x2,
        ["--y2" as string]: pass.y2,
        ["--rot" as string]: shot.rot,
        ["--dur" as string]: pass.dur,
        ["--len" as string]: "11rem",
        ["--bright" as string]: "0.9",
      }}
    >
      <span className="comet-tail" />
      <span className="comet-head" />
    </span>
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
      <div className="scene-wine" />
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
      {stars && <TapStar />}
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
