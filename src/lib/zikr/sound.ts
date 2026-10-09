import type { TapVoice } from "./types";

let ctx: AudioContext | null = null;
let active = 0;

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && ctx && ctx.state === "running") void ctx.suspend();
  });
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended" && document.visibilityState === "visible") void ctx.resume();
  return ctx;
}

function noiseBurst(c: AudioContext, seconds: number, shape: number): AudioBuffer {
  const length = Math.max(1, Math.floor(c.sampleRate * seconds));
  const buffer = c.createBuffer(1, length, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, shape);
  }
  return buffer;
}

function tone(
  c: AudioContext,
  master: GainNode,
  now: number,
  from: number,
  to: number,
  attack: number,
  dur: number,
  type: OscillatorType,
  gain: number,
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(1, from), now);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), now + Math.max(0.01, dur));
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), now + Math.max(0.004, attack));
  g.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(attack + 0.01, dur));
  osc.connect(g);
  g.connect(master);
  osc.start(now);
  osc.stop(now + dur + 0.03);
}

function click(c: AudioContext, master: GainNode, now: number, freq: number, dur: number, gain: number) {
  const src = c.createBufferSource();
  src.buffer = noiseBurst(c, Math.max(0.01, dur), 2.4);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(Math.max(80, freq), now);
  filter.Q.setValueAtTime(0.8, now);
  const g = c.createGain();
  g.gain.setValueAtTime(Math.max(0.0002, gain), now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.012, dur));
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(now);
  src.stop(now + dur + 0.02);
}

export function playTap(voice: TapVoice | "off", volume: number) {
  try {
    playTapNow(voice, volume);
  } catch {
    /* звук не должен останавливать зикр */
  }
}

function playTapNow(voice: TapVoice | "off", volume: number) {
  if (voice === "off" || volume <= 0 || active > 8) return;
  const c = audio();
  if (!c) return;
  const now = c.currentTime;
  const level = Math.min(0.9, Math.max(0.05, volume));
  const master = c.createGain();
  master.gain.setValueAtTime(level, now);
  master.connect(c.destination);
  active += 1;
  window.setTimeout(() => {
    active = Math.max(0, active - 1);
  }, 180);

  if (voice === "soft") {
    tone(c, master, now, 523, 784, 0.008, 0.09, "sine", 0.28);
    click(c, master, now, 1800, 0.012, 0.04);
  } else if (voice === "wood") {
    tone(c, master, now, 392, 587, 0.008, 0.08, "sine", 0.26);
    click(c, master, now, 900, 0.016, 0.045);
  } else if (voice === "drop") {
    tone(c, master, now, 494, 880, 0.01, 0.11, "sine", 0.26);
    click(c, master, now, 1400, 0.01, 0.03);
  } else if (voice === "stone") {
    tone(c, master, now, 330, 494, 0.01, 0.1, "sine", 0.28);
    click(c, master, now, 620, 0.016, 0.04);
  } else if (voice === "bead") {
    tone(c, master, now, 440, 660, 0.006, 0.07, "sine", 0.32);
    click(c, master, now, 1100, 0.012, 0.05);
  } else if (voice === "clay") {
    tone(c, master, now, 280, 420, 0.01, 0.1, "sine", 0.34);
    click(c, master, now, 480, 0.018, 0.05);
  } else if (voice === "breath") {
    tone(c, master, now, 360, 540, 0.02, 0.14, "sine", 0.22);
  } else if (voice === "sand") {
    click(c, master, now, 2400, 0.03, 0.06);
    tone(c, master, now, 520, 700, 0.008, 0.06, "sine", 0.16);
  } else if (voice === "water") {
    tone(c, master, now, 620, 980, 0.008, 0.12, "sine", 0.3);
    click(c, master, now, 1600, 0.01, 0.035);
  } else {
    tone(c, master, now, 659, 988, 0.006, 0.07, "sine", 0.24);
    click(c, master, now, 2200, 0.008, 0.028);
  }
}

/** Мягкий звук открытия достижения. Не мелодия: два тихих тона. */
export function playAchievement(volume: number) {
  try {
    playAchievementNow(volume);
  } catch {
    /* звук не должен останавливать зикр */
  }
}

function playAchievementNow(volume: number) {
  if (volume <= 0) return;
  const c = audio();
  if (!c) return;
  const now = c.currentTime;
  const level = Math.min(0.55, Math.max(0.04, volume * 0.45));
  const master = c.createGain();
  master.gain.setValueAtTime(level, now);
  master.connect(c.destination);
  tone(c, master, now, 392, 392, 0.03, 0.32, "sine", 0.2);
  tone(c, master, now, 523, 523, 0.04, 0.38, "sine", 0.12);
}
