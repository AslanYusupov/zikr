import { useZikr } from "./store";

let iosInput: HTMLInputElement | null = null;

function iosSwitch(): HTMLInputElement {
  if (iosInput) return iosInput;
  const input = document.createElement("input");
  input.type = "checkbox";
  input.tabIndex = -1;
  input.setAttribute("switch", "");
  input.setAttribute("aria-hidden", "true");
  input.style.cssText = "position:fixed;left:0;top:0;width:16px;height:16px;opacity:0;pointer-events:none;margin:0;border:0";
  document.body.append(input);
  iosInput = input;
  return input;
}

function iosTick() {
  iosSwitch().click();
}

export function triggerHaptic(force = false) {
  if (typeof window === "undefined") return;
  if (!force && !useZikr.getState().vibrate) return;
  const ios = document.documentElement.dataset.os === "ios";
  try {
    if (!ios && typeof navigator.vibrate === "function") {
      navigator.vibrate(10);
      return;
    }
    if (ios) iosTick();
  } catch {
    /* отклик не должен останавливать счёт */
  }
}
