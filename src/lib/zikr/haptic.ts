import { useZikr } from "./store";

let iosLabel: HTMLLabelElement | null = null;
let lastFire = 0;
let lastKind = "";

function vibrateOn() {
  try {
    if (useZikr.getState().vibrate === false) return false;
    if (useZikr.getState().vibrate === true) return true;
  } catch {
    /* настройки ещё не поднялись */
  }
  try {
    const raw = localStorage.getItem("nur-zikr-v1");
    if (!raw) return true;
    const state = JSON.parse(raw).state;
    return state?.vibrate !== false;
  } catch {
    return true;
  }
}

function isIos() {
  if (document.documentElement.dataset.os === "ios") return true;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function iosTick() {
  if (!iosLabel || !iosLabel.isConnected) {
    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;opacity:0;overflow:hidden;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    input.setAttribute("switch", "");
    label.append(input);
    (document.body || document.documentElement).append(label);
    iosLabel = label;
  }
  iosLabel.click();
}

export function triggerHaptic(from: boolean | "down" | "click" = "click") {
  if (typeof window === "undefined") return;
  const forced = from === true;
  const kind = from === "down" ? "down" : "click";
  if (!forced && !vibrateOn()) return;
  const now = Date.now();
  const ios = isIos();
  try {
    if (!ios) {
      if (!forced && now - lastFire < 280) return;
      lastFire = now;
      lastKind = kind;
      if (typeof navigator.vibrate === "function") navigator.vibrate(12);
      return;
    }
    if (!forced && kind === lastKind && now - lastFire < 50) return;
    lastFire = now;
    lastKind = kind;
    iosTick();
  } catch {
    /* отклик не должен останавливать счёт */
  }
}
