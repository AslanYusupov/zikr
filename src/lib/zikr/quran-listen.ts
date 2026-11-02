import { create } from "zustand";
import { ayahCount } from "./ayah-audio";
import { RECITERS, reciterById } from "./reciters";

export type ListenMode = "ayah" | "whole";

type Spot = {
  reciterId: string;
  mode: ListenMode;
  surah: number;
  ayah: number;
  playing: boolean;
  fail: boolean;
  loop: boolean;
  now: number;
  dur: number;
  started: boolean;
  onScreen: boolean;
  focus: number;
};

let audio: HTMLAudioElement | null = null;
let token = 0;
let want = false;

export const useListen = create<Spot>(() => ({
  reciterId: RECITERS[0]!.id,
  mode: "whole",
  surah: 1,
  ayah: 1,
  playing: false,
  fail: false,
  loop: false,
  now: 0,
  dur: 0,
  started: false,
  onScreen: false,
  focus: 0,
}));

function node(): HTMLAudioElement {
  if (audio) return audio;
  const el = document.createElement("audio");
  el.preload = "auto";
  el.setAttribute("playsinline", "");
  el.style.display = "none";
  document.body.appendChild(el);
  el.addEventListener("timeupdate", () => {
    const length = el.duration;
    useListen.setState({ now: el.currentTime || 0, dur: Number.isFinite(length) ? length : 0 });
  });
  el.addEventListener("ended", () => {
    const here = useListen.getState();
    if (here.loop) {
      playListen(here.reciterId, here.surah, here.mode === "ayah" ? here.ayah : 1, here.mode);
      return;
    }
    if (here.mode === "ayah" && here.ayah < ayahCount(here.surah)) {
      playListen(here.reciterId, here.surah, here.ayah + 1, "ayah");
      return;
    }
    el.currentTime = 0;
    useListen.setState({ playing: false, now: 0, ayah: here.mode === "ayah" ? 1 : here.ayah });
  });
  audio = el;
  return el;
}

export function playListen(id: string, nextSurah: number, nextAyah: number, nextMode: ListenMode) {
  const el = node();
  const reciter = reciterById(id);
  const n = Math.min(114, Math.max(1, nextSurah));
  const count = ayahCount(n);
  const a = Math.min(count || 1, Math.max(1, nextAyah));
  const urls = nextMode === "whole" ? reciter.files(n) : reciter.ayahs(n, a);
  const mine = ++token;
  let step = 0;
  want = true;
  useListen.setState({
    reciterId: id,
    mode: nextMode,
    surah: n,
    ayah: a,
    fail: false,
    now: 0,
    dur: 0,
    playing: true,
    started: true,
  });
  const attempt = () => {
    if (mine !== token) return;
    if (step >= urls.length) {
      useListen.setState({ playing: false, fail: true });
      return;
    }
    const url = urls[step]!;
    step += 1;
    let moved = false;
    const move = () => {
      if (moved || mine !== token) return;
      moved = true;
      attempt();
    };
    el.onerror = () => {
      if (mine !== token || el.error?.code === MediaError.MEDIA_ERR_ABORTED) return;
      move();
    };
    el.src = url;
    void el.play().then(() => {
      if (mine !== token) return;
      if (!want) el.pause();
    }).catch((error: unknown) => {
      const name = error instanceof DOMException ? error.name : "";
      if (mine !== token || name === "AbortError") return;
      if (name === "NotAllowedError") {
        useListen.setState({ playing: false });
        return;
      }
      move();
    });
  };
  attempt();
}

export function toggleListen() {
  const el = audio;
  const here = useListen.getState();
  if (here.playing && el && !el.paused) {
    want = false;
    el.pause();
    useListen.setState({ playing: false });
    return;
  }
  if (el && el.src && el.paused && el.currentTime > 0 && !here.fail) {
    want = true;
    void el.play().then(() => useListen.setState({ playing: true })).catch(() => playListen(here.reciterId, here.surah, here.ayah, here.mode));
    return;
  }
  playListen(here.reciterId, here.surah, here.mode === "ayah" ? here.ayah : 1, here.mode);
}

export function seekListen(value: number) {
  const el = audio;
  if (!el || !Number.isFinite(el.duration) || el.duration <= 0) return;
  el.currentTime = Math.min(el.duration, Math.max(0, value * el.duration));
}

export function setListenLoop(loop: boolean) {
  useListen.setState({ loop });
}

export function setListenMode(mode: ListenMode) {
  useListen.setState({ mode });
}

export function setListenScreen(onScreen: boolean) {
  useListen.setState({ onScreen });
}

export function focusListen() {
  useListen.setState((state) => ({ focus: state.focus + 1 }));
}
