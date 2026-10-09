const GAP_MS = 20_000;
const PULSE_MS = 2_000;

let since = 0;
let last = 0;
let lastPulse = 0;
let pulse: (() => void) | null = null;

export function bindTapPulse(fn: () => void) {
  pulse = fn;
  return () => {
    if (pulse === fn) pulse = null;
  };
}

export function noteTap() {
  const now = Date.now();
  if (!last || now - last > GAP_MS) since = now;
  last = now;
  if (pulse && now - lastPulse > PULSE_MS) {
    lastPulse = now;
    pulse();
  }
}

export function currentTapSince(): number {
  if (!last || Date.now() - last > GAP_MS) return 0;
  return since;
}
