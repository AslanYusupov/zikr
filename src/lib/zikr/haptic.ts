import { useZikr } from "./store";

let iosLabel: HTMLLabelElement | null = null;

function iosTick() {
  if (!iosLabel) {
    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.cssText = "position:fixed;left:0;top:0;width:0;height:0;opacity:0;overflow:hidden;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.tabIndex = -1;
    input.setAttribute("switch", "");
    label.append(input);
    document.documentElement.append(label);
    iosLabel = label;
  }
  iosLabel.click();
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
