const SURAH_AYAHS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6,
];

export function ayahFile(surah: number, ayah: number) {
  return `${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}`;
}

export function parseAyahFile(file: string): { surah: number; ayah: number } | null {
  const match = /^(\d{3})(\d{3})$/.exec(file);
  if (!match) return null;
  const surah = Number(match[1]);
  const ayah = Number(match[2]);
  const count = SURAH_AYAHS[surah - 1] ?? 0;
  if (surah < 1 || surah > 114 || ayah < 1 || ayah > count) return null;
  return { surah, ayah };
}

export function globalAyah(surah: number, ayah: number) {
  if (!parseAyahFile(ayahFile(surah, ayah))) return 0;
  let n = ayah;
  for (let i = 0; i < surah - 1; i++) n += SURAH_AYAHS[i] ?? 0;
  return n;
}

export function remoteAyahUrls(surah: number, ayah: number) {
  const file = ayahFile(surah, ayah);
  const id = globalAyah(surah, ayah);
  return [
    `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${id}.mp3`,
    `https://audio.qurancdn.com/Alafasy/mp3/${file}.mp3`,
    `https://verses.quran.com/Alafasy/mp3/${file}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${file}.mp3`,
  ];
}

export function ayahSources(surah: number, ayah: number) {
  return [`/api/ayah/${ayahFile(surah, ayah)}`, ...remoteAyahUrls(surah, ayah)];
}

export function ayahCount(surah: number) {
  return SURAH_AYAHS[surah - 1] ?? 0;
}

const STORE = "mp3";

function openAyahDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("zikr-ayah", 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readAyah(file: string): Promise<Blob | null> {
  try {
    const db = await openAyahDb();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(file);
      req.onsuccess = () => {
        const saved = req.result;
        resolve(saved instanceof Blob && saved.size > 800 ? saved : null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function writeAyah(file: string, blob: Blob) {
  try {
    const db = await openAyahDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(blob, file);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
    void navigator.storage?.persist?.();
  } catch {
    /* the ayah still plays this time */
  }
}

export async function keepAyah(surah: number, ayah: number): Promise<Blob | null> {
  const file = ayahFile(surah, ayah);
  const saved = await readAyah(file);
  if (saved) return saved;
  for (const src of ayahSources(surah, ayah)) {
    try {
      const res = await fetch(src, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 800) continue;
      const blob = new Blob([buf], { type: "audio/mpeg" });
      await writeAyah(file, blob);
      return blob;
    } catch {
      /* the next copy */
    }
  }
  return null;
}

export const AYAHS_TOTAL = SURAH_AYAHS.reduce((sum, n) => sum + n, 0);

export async function savedAyahFiles(): Promise<Set<string>> {
  try {
    const db = await openAyahDb();
    return await new Promise((resolve) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).getAllKeys();
      req.onsuccess = () => {
        const keys = Array.isArray(req.result) ? req.result.filter((key): key is string => typeof key === "string") : [];
        resolve(new Set(keys));
      };
      req.onerror = () => resolve(new Set());
    });
  } catch {
    return new Set();
  }
}

export async function downloadAyahs(
  jobs: { surah: number; ayah: number }[],
  onStep: (done: number) => void,
  signal: AbortSignal,
) {
  let done = 0;
  for (const job of jobs) {
    if (signal.aborted) return;
    const file = ayahFile(job.surah, job.ayah);
    const already = await readAyah(file);
    if (!already && typeof navigator !== "undefined" && navigator.onLine === false) return;
    if (!already) await keepAyah(job.surah, job.ayah);
    done += 1;
    onStep(done);
  }
}

export async function loadAyahUrl(surah: number, ayah: number): Promise<string | null> {
  const blob = await keepAyah(surah, ayah);
  return blob ? URL.createObjectURL(blob) : null;
}
