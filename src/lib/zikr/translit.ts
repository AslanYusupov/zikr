type Vowel = "" | "a" | "i" | "u" | "an" | "in" | "un";

type Glyph = {
  ch: string;
  v: Vowel;
  sh: boolean;
  long: boolean;
  suk: boolean;
  silah: "" | "u" | "i";
};

const VOWELS: Record<string, Vowel> = {
  "\u064E": "a",
  "\u064F": "u",
  "\u0650": "i",
  "\u064B": "an",
  "\u064C": "un",
  "\u064D": "in",
};

const SUN = new Set(["ت", "ث", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ل", "ن"]);

const RU: Record<string, string> = {
  ب: "б",
  ت: "т",
  ث: "с",
  ج: "дж",
  ح: "хь",
  خ: "х",
  د: "д",
  ذ: "з",
  ر: "р",
  ز: "з",
  س: "с",
  ش: "ш",
  ص: "с",
  ض: "д",
  ط: "т",
  ظ: "з",
  ع: "1",
  غ: "гъ",
  ف: "ф",
  ق: "къ",
  ك: "к",
  ل: "л",
  م: "м",
  ن: "н",
  ه: "х1",
  ة: "т",
  و: "в",
  ي: "й",
  ء: "",
};

const LAT_CONS: Record<string, string> = {
  ب: "b",
  ت: "t",
  ث: "th",
  ج: "j",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "dh",
  ر: "r",
  ز: "z",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "d",
  ط: "t",
  ظ: "z",
  ع: "'",
  غ: "gh",
  ف: "f",
  ق: "q",
  ك: "k",
  ل: "l",
  م: "m",
  ن: "n",
  ه: "h",
  ة: "t",
  و: "w",
  ي: "y",
  ء: "",
};

const MUQ_RU: Record<string, string> = {
  الم: "Алиф лаам миим",
  المص: "Алиф лаам миим саад",
  الر: "Алиф лаам раа",
  المر: "Алиф лаам миим раа",
  كهيعص: "Кааф х1аа йаа 1айн саад",
  طه: "Таа х1аа",
  طسم: "Таа сиин миим",
  طس: "Таа сиин",
  يس: "Йаа сиин",
  ص: "Саад",
  حم: "Хьаа миим",
  عسق: "1айн сиин къааф",
  ق: "Къааф",
  ن: "Нуун",
};

const MUQ_LAT: Record<string, string> = {
  الم: "Alif laam miim",
  المص: "Alif laam miim saad",
  الر: "Alif laam raa",
  المر: "Alif laam miim raa",
  كهيعص: "Kaaf haa yaa 'ayn saad",
  طه: "Taa haa",
  طسم: "Taa siin miim",
  طس: "Taa siin",
  يس: "Yaa siin",
  ص: "Saad",
  حم: "Haa miim",
  عسق: "'Ayn siin qaaf",
  ق: "Qaaf",
  ن: "Nuun",
};

function glyph(ch: string, v: Vowel = "", long = false): Glyph {
  return { ch, v, sh: false, long, suk: false, silah: "" };
}

function isLetter(ch: string): boolean {
  return ((ch >= "\u0621" && ch <= "\u064A") || ch === "\u0671") && ch !== "\u0640";
}

function parseWord(raw: string): Glyph[] {
  const out: Glyph[] = [];
  for (const ch of raw) {
    if (VOWELS[ch]) {
      if (out.length) out[out.length - 1].v = VOWELS[ch];
      continue;
    }
    if (ch === "\u0651") {
      if (out.length) out[out.length - 1].sh = true;
      continue;
    }
    if (ch === "\u0670" || ch === "\u0653") {
      if (out.length) out[out.length - 1].long = true;
      continue;
    }
    if (ch === "\u0652" || ch === "\u06DF") {
      if (out.length) out[out.length - 1].suk = true;
      continue;
    }
    if (ch === "\u06E5") {
      if (out.length) out[out.length - 1].silah = "u";
      continue;
    }
    if (ch === "\u06E6") {
      if (out.length) out[out.length - 1].silah = "i";
      continue;
    }
    if (ch === "\u0654" || ch === "\u0655") {
      out.push(glyph("\u0621"));
      continue;
    }
    if (!isLetter(ch)) continue;
    if (ch === "\u0622") out.push(glyph("\u0627", "a", true));
    else if (ch === "\u0623" || ch === "\u0625") out.push(glyph("\u0627"));
    else if (ch === "\u0671") out.push(glyph("\u0671"));
    else if (ch === "\u0624") out.push(glyph("\u0648"));
    else if (ch === "\u0626") out.push(glyph("\u064A"));
    else out.push(glyph(ch));
  }
  return out;
}

function muqatta(word: string, ru: boolean): string | null {
  if (/[\u064B-\u0652]/.test(word)) return null;
  let sk = "";
  for (const ch of word) {
    if ("\u0627\u0622\u0623\u0625\u0671".includes(ch)) sk += "ا";
    else if (ch === "\u0649") sk += "ي";
    else if (isLetter(ch)) sk += ch;
  }
  return (ru ? MUQ_RU : MUQ_LAT)[sk] ?? null;
}

function waslaVowel(glyphs: Glyph[]): Vowel {
  const rest = glyphs.slice(1);
  if (!rest.length) return "i";
  if (rest[0].ch === "\u0644") return "a";
  const consonants = rest.filter((g) => g.ch !== "\u0627" && g.ch !== "\u0649" && g.ch !== "\u0621");
  if (consonants.length <= 2) return "i";
  const third = consonants[2];
  if (third && (third.v === "u" || third.v === "un")) return "u";
  return "i";
}

function vowelSound(v: Vowel, ru: boolean): string {
  if (!v) return "";
  if (ru) {
    if (v === "a" || v === "an") return v === "an" ? "ан" : "а";
    if (v === "i" || v === "in") return v === "in" ? "ин" : "и";
    return v === "un" ? "ун" : "у";
  }
  if (v === "a" || v === "an") return v === "an" ? "an" : "a";
  if (v === "i" || v === "in") return v === "in" ? "in" : "i";
  return v === "un" ? "un" : "u";
}

function cons(ch: string, ru: boolean): string {
  if (ru) return RU[ch] ?? "";
  return LAT_CONS[ch] ?? "";
}

function stretch(token: string, g: Glyph, ru: boolean): string {
  let out = token;
  if (g.long && (g.v === "a" || g.v === "an" || g.v === "")) out += ru ? "а" : "a";
  if (g.silah === "u") out += ru ? "у" : "u";
  if (g.silah === "i") out += ru ? "и" : "i";
  return out;
}

function hamzaSyl(out: string, syl: string): string {
  if (!syl) return out;
  if (out && !out.endsWith("-")) return `${out}-${syl}`;
  return out + syl;
}

function speakWord(glyphs: Glyph[], ru: boolean, waqf: boolean, elideWasl = false): string {
  if (!glyphs.length) return "";
  const g = glyphs.map((item) => ({ ...item }));
  if (waqf) {
    const last = g[g.length - 1];
    const prev = g.length > 1 ? g[g.length - 2] : null;
    if (last.ch === "\u0629") {
      last.ch = "\u0647";
      last.v = "";
    } else if ((last.ch === "\u0627" || last.ch === "\u0649") && !last.v && prev && prev.v === "an") {
      prev.v = "";
      prev.long = true;
      g.pop();
    } else if (last.v === "an") {
      last.v = "";
      last.long = true;
    } else if (last.v === "a" || last.v === "i" || last.v === "u" || last.v === "in" || last.v === "un") {
      last.v = "";
    }
  }

  let i = 0;
  let out = "";
  if (g[0].ch === "\u0671") {
    if (!elideWasl) out += vowelSound(waslaVowel(g), ru);
    i = 1;
  }

  for (; i < g.length; i++) {
    const cur = g[i];
    const prev = i > 0 ? g[i - 1] : null;
    if (cur.ch === "\u0649" && !cur.v && !cur.sh && !cur.suk) {
      if (prev && prev.v === "an") continue;
      if (prev && (prev.v === "i" || prev.v === "in")) out += ru ? "и" : "i";
      else if (prev && (prev.v === "a" || prev.long)) out += ru ? "а" : "a";
      continue;
    }
    if (cur.ch === "\u0649") cur.ch = "\u064A";
    if (cur.ch === "\u0627" && !cur.v) {
      if (cur.suk) continue;
      if (prev && prev.v === "an") continue;
      if (prev && !prev.long && (prev.v === "a" || prev.v === "an")) out += ru ? "а" : "a";
      else if (!prev && !out) out += ru ? "а" : "a";
      continue;
    }
    if (cur.ch === "\u0627" && cur.v) {
      const syl = vowelSound(cur.v, ru) + (cur.long && cur.v === "a" ? (ru ? "а" : "a") : "");
      out = hamzaSyl(out, syl);
      continue;
    }
    if (cur.ch === "\u0621") {
      out = hamzaSyl(out, vowelSound(cur.v, ru));
      continue;
    }
    if (cur.ch === "\u0648" && !cur.v && !cur.sh && prev && (prev.v === "u" || prev.v === "un" || prev.v === "a" || prev.v === "an")) {
      out += ru ? "у" : "u";
      continue;
    }
    if (cur.ch === "\u064A" && !cur.v && !cur.sh && prev && (prev.v === "i" || prev.v === "in")) {
      out += ru ? "и" : "i";
      continue;
    }
    if (cur.ch === "\u0644" && g[i + 1]?.ch === "\u0644" && g[i + 1]?.sh && g[i + 2]?.ch === "\u0647") {
      const bridge = cur.v ? cons("\u0644", ru) + vowelSound(cur.v, ru) : "";
      const end = stretch(vowelSound(g[i + 2].v, ru), g[i + 2], ru);
      out += `${bridge}${ru ? "ллах1" : "llah"}${end}`;
      i += 2;
      continue;
    }
    const article = !!prev && (prev.ch === "\u0627" || prev.ch === "\u0671") && !cur.v;
    if (cur.ch === "\u0644" && article && g[i + 1] && SUN.has(g[i + 1].ch)) {
      out += `${cons(g[i + 1].ch, ru)}-`;
      g[i + 1].sh = false;
      continue;
    }
    if (cur.ch === "\u0644" && article) {
      out += ru ? "ль-" : "l-";
      continue;
    }
    let token = cons(cur.ch, ru);
    if (!token && cur.v) {
      out = hamzaSyl(out, vowelSound(cur.v, ru));
      continue;
    }
    if (!token) continue;
    if (cur.sh && out) token += token;
    else if (cur.sh && elideWasl) out += `${token}-`;
    out += token;
    out += stretch(vowelSound(cur.v, ru), cur, ru);
  }
  if (ru && out.endsWith("л")) out += "ь";
  return out.replace(/а{3,}/g, "аа").replace(/и{3,}/g, "ии").replace(/у{3,}/g, "уу").replace(/-{2,}/g, "-");
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function skeleton(arabic: string): string {
  let s = "";
  for (const ch of arabic) {
    if ("\u0627\u0622\u0623\u0625\u0671".includes(ch)) s += "ا";
    else if (ch === "\u0649") s += "ي";
    else if (isLetter(ch)) s += ch;
  }
  return s;
}

function wordEnding(glyphs: Glyph[]): "madd-a" | "madd-i" | "madd-u" | "vowel" | "tanwin" | "noon" | "meem" | "suk" {
  if (!glyphs.length) return "suk";
  const last = glyphs[glyphs.length - 1];
  const prev = glyphs.length > 1 ? glyphs[glyphs.length - 2] : null;
  if (last.v === "an" || last.v === "in" || last.v === "un") return "tanwin";
  if ((last.ch === "\u0627" || last.ch === "\u0649") && !last.v && prev?.v === "an") return "tanwin";
  if ((last.ch === "\u0627" || last.ch === "\u0649") && !last.v && prev && (prev.v === "a" || prev.v === "an")) return "madd-a";
  if (last.ch === "\u0648" && !last.v && !last.sh && prev && (prev.v === "u" || prev.v === "un")) return "madd-u";
  if ((last.ch === "\u064A" || last.ch === "\u0649") && !last.v && !last.sh && prev && (prev.v === "i" || prev.v === "in")) return "madd-i";
  if (last.v === "a" || last.v === "i" || last.v === "u") return "vowel";
  if (last.ch === "\u0646" && !last.v) return "noon";
  if (last.ch === "\u0645" && !last.v) return "meem";
  return "suk";
}

function shortenMadd(text: string, kind: "madd-a" | "madd-i" | "madd-u", ru: boolean): string {
  const long = ru ? (kind === "madd-a" ? "аа" : kind === "madd-i" ? "ии" : "уу") : kind === "madd-a" ? "aa" : kind === "madd-i" ? "ii" : "uu";
  return text.endsWith(long) ? text.slice(0, -1) : text;
}

const IDGHAM_GHUNNA = new Set(["ي", "ى", "ن", "م", "و"]);
const IDGHAM_PLAIN = new Set(["ل", "ر"]);

function firstSound(glyphs: Glyph[]): string {
  for (const g of glyphs) {
    if (g.ch === "\u0671") continue;
    if ((g.ch === "\u0627" || g.ch === "\u0649") && !g.v) continue;
    return g.ch;
  }
  return "";
}

function bridge(next: string, ru: boolean): string {
  const digraphs = ru ? ["дж", "гъ", "къ", "хь", "х1"] : ["th", "dh", "sh", "kh", "gh"];
  let head = next.slice(0, 1);
  for (const item of digraphs) {
    if (next.startsWith(item)) head = item;
  }
  return head ? `${head}-${next}` : next;
}

function dropNoon(text: string, ru: boolean): string {
  const n = ru ? "н" : "n";
  return text.endsWith(n) ? text.slice(0, -1) : text;
}

export function transliterate(arabic: string, lang: "ru" | "lat"): string {
  const ru = lang === "ru";
  if (skeleton(arabic) === "بسماللهالرحمنالرحيم") {
    return ru ? "Бисмилляах1ир-Рахьмаанир-Рахьиим" : "Bismillaahir-Rahmaanir-Rahiim";
  }
  const words = arabic.split(/\s+/).filter(Boolean);
  const parsed = words.map((word) => parseWord(word));
  const named = words.map((word) => muqatta(word, ru));
  const last = words.length - 1;
  const parts: string[] = [];
  for (let index = 0; index < words.length; index += 1) {
    const glyphs = parsed[index];
    if (!glyphs.length && !named[index]) continue;
    const prev = index > 0 ? parsed[index - 1] : null;
    const prevEnd = prev?.length ? wordEnding(prev) : "suk";
    const wasl = glyphs[0]?.ch === "\u0671";
    const carry = !!prev?.length && !named[index - 1] && !named[index] && wasl && (prevEnd === "vowel" || prevEnd.startsWith("madd"));
    const said = named[index] ?? speakWord(glyphs, ru, index === last, carry);
    if (!said) continue;
    if (carry && parts.length) {
      let head = parts.pop() ?? "";
      if (prevEnd === "madd-a" || prevEnd === "madd-i" || prevEnd === "madd-u") head = shortenMadd(head, prevEnd, ru);
      parts.push(head + said);
      continue;
    }
    const sound = prev?.length ? firstSound(glyphs) : "";
    const mergeNoon = !!prev?.length && !named[index - 1] && !named[index] && !wasl && (prevEnd === "noon" || prevEnd === "tanwin") && (IDGHAM_GHUNNA.has(sound) || IDGHAM_PLAIN.has(sound));
    const mergeMeem = !!prev?.length && !named[index - 1] && !named[index] && !wasl && prevEnd === "meem" && sound === "\u0645";
    if ((mergeNoon || mergeMeem) && parts.length) {
      let head = parts.pop() ?? "";
      if (mergeNoon) head = dropNoon(head, ru);
      parts.push(mergeMeem ? `${head}-${said}` : head + bridge(said, ru));
      continue;
    }
    if (prevEnd === "noon" && sound === "\u0628" && parts.length && !named[index] && !wasl) {
      const head = parts.pop() ?? "";
      const n = ru ? "н" : "n";
      const m = ru ? "м" : "m";
      parts.push(`${head.endsWith(n) ? head.slice(0, -1) + m : head} ${said}`);
      continue;
    }
    parts.push(said);
  }
  const text = parts
    .join(" ")
    .replace(ru ? /(^|[\s-])аллах1/g : /(^|[\s-])allah/g, (_m, p: string) => `${p}${ru ? "Аллах1" : "Allah"}`)
    .replace(/а{3,}/g, "аа")
    .replace(/и{3,}/g, "ии")
    .replace(/у{3,}/g, "уу")
    .replace(/-{2,}/g, "-");
  return capitalize(text);
}
