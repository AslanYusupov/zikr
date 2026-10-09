import type { LangId } from "./types";

export type QuranAyah = { n: number; t: string; p: number; l: number };
export type QuranSurah = { n: number; name: string; ru: string; en: string; ayahs: QuranAyah[] };
export type QuranBook = { bismillah: string; bismillahLetters: number; surahs: QuranSurah[] };

const COPY: Record<LangId, { dhikr: string; quran: string; back: string; loading: string; fail: string; retry: string; hadithAr: string; hadith: string; source: string; page: string; pageBtn: string; surahBtn: string; wait: string; taken: string; again: string; letters: string; surahs: string; tajweed: string }> = {
  ru: {
    dhikr: "Поминание Аллах1а",
    quran: "Священный Коран",
    back: "К сурам",
    loading: "Открывается Коран",
    fail: "Не удалось открыть текст. Проверь связь и нажми ещё раз.",
    retry: "Открыть снова",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "«Тому, кто прочитает букву из Книги Аллах1а, запишется благое дело, а за каждое благое дело воздаётся десятикратно...»",
    source: "ат-Тирмизи",
    page: "Страница",
    pageBtn: "Прочитал страницу",
    surahBtn: "Прочитал суру",
    wait: "Не спеши. Сначала дочитай.",
    taken: "За эти буквы награда уже записана. Повторно она не прибавляется.",
    again: "Прочитать снова",
    letters: "букв",
    surahs: "Суры",
    tajweed: "Таджвид",
  },
  en: {
    dhikr: "Remembrance of Allah",
    quran: "The Holy Quran",
    back: "All surahs",
    loading: "Opening the Quran",
    fail: "The text could not be opened. Check the connection and try again.",
    retry: "Open again",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "“Whoever recites a letter from the Book of Allah has a good deed recorded for it, and every good deed is rewarded tenfold...”",
    source: "At-Tirmidhi",
    page: "Page",
    pageBtn: "I have read the page",
    surahBtn: "I have read the surah",
    wait: "Do not rush. Finish the recitation first.",
    taken: "These letters are already recorded. They are not added again.",
    again: "Read again",
    letters: "letters",
    surahs: "Surahs",
    tajweed: "Tajweed",
  },
  ar: {
    dhikr: "ذكر الله",
    quran: "القرآن الكريم",
    back: "السور",
    loading: "يُفتح القرآن",
    fail: "تعذّر فتح النص. تحقق من الاتصال ثم أعد المحاولة.",
    retry: "فتح مرة أخرى",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "«من قرأ حرفًا من كتاب الله فله به حسنة، والحسنة بعشر أمثالها...»",
    source: "الترمذي",
    page: "صفحة",
    pageBtn: "قرأت الصفحة",
    surahBtn: "قرأت السورة",
    wait: "تمهّل. أتمّ القراءة أولًا.",
    taken: "هذه الحروف سُجّلت من قبل، ولا تُزاد مرة أخرى.",
    again: "اقرأ مرة أخرى",
    letters: "حرفًا",
    surahs: "السور",
    tajweed: "التجويد",
  },
  id: {
    dhikr: "Zikir kepada Allah",
    quran: "Al-Qur'an",
    back: "Daftar surah",
    loading: "Membuka Al-Qur'an",
    fail: "Teks belum terbuka. Periksa sambungan, lalu coba lagi.",
    retry: "Buka lagi",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "“Siapa membaca satu huruf dari Kitab Allah, dicatat satu kebaikan, dan setiap kebaikan dibalas sepuluh kali lipat...”",
    source: "At-Tirmidzi",
    page: "Halaman",
    pageBtn: "Saya telah membaca halaman",
    surahBtn: "Saya telah membaca surah",
    wait: "Jangan terburu. Selesaikan bacaan dahulu.",
    taken: "Huruf ini sudah tercatat. Tidak ditambahkan lagi.",
    again: "Baca lagi",
    letters: "huruf",
    surahs: "Surah",
    tajweed: "Tajwid",
  },
  tr: {
    dhikr: "Allah'ı anmak",
    quran: "Kur'an-ı Kerim",
    back: "Sureler",
    loading: "Kur'an açılıyor",
    fail: "Metin açılmadı. Bağlantıyı kontrol edip yeniden dene.",
    retry: "Yeniden aç",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "“Allah'ın Kitabından bir harf okuyana bir iyilik yazılır, her iyiliğe de on kat karşılık verilir...”",
    source: "Tirmizî",
    page: "Sayfa",
    pageBtn: "Sayfayı okudum",
    surahBtn: "Sureyi okudum",
    wait: "Acele etme. Önce okumayı bitir.",
    taken: "Bu harfler zaten yazıldı. Yeniden eklenmez.",
    again: "Yeniden oku",
    letters: "harf",
    surahs: "Sureler",
    tajweed: "Tecvid",
  },
  ur: {
    dhikr: "اللہ کا ذکر",
    quran: "قرآنِ کریم",
    back: "ساری سورتیں",
    loading: "قرآن کھل رہا ہے",
    fail: "متن نہیں کھلا۔ رابطہ دیکھ کر دوبارہ کوشش کریں۔",
    retry: "دوبارہ کھولیں",
    hadithAr: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا...»",
    hadith: "«جو اللہ کی کتاب کا ایک حرف پڑھے، اس کے لیے ایک نیکی لکھی جاتی ہے، اور ہر نیکی کا بدلہ دس گنا ہے...»",
    source: "ترمذی",
    page: "صفحہ",
    pageBtn: "میں نے صفحہ پڑھ لیا",
    surahBtn: "میں نے سورت پڑھ لی",
    wait: "جلدی نہ کریں۔ پہلے پڑھ لیں۔",
    taken: "یہ حروف پہلے لکھے جا چکے ہیں۔ دوبارہ نہیں بڑھتے۔",
    again: "دوبارہ پڑھیں",
    letters: "حروف",
    surahs: "سورتیں",
    tajweed: "تجوید",
  },
};

export function quranCopy(lang: LangId) {
  return COPY[lang] ?? COPY.ru;
}

export function readWait(letters: number, page = false): number {
  if (page) return Math.min(36000, Math.max(6000, Math.round(letters * 55)));
  return Math.min(10000, Math.max(900, Math.round(letters * 110)));
}

let memory: QuranBook | null = null;

export async function loadQuran(): Promise<QuranBook> {
  if (memory) return memory;
  const cacheName = "zikr-quran-v1";
  try {
    const cache = await caches.open(cacheName);
    const hit = await cache.match("/quran.json");
    if (hit) {
      const saved = (await hit.json()) as QuranBook;
      if (saved?.surahs?.length === 114) {
        memory = saved;
        return saved;
      }
    }
  } catch {
    /* cache is optional */
  }
  const res = await fetch("/quran.json");
  if (!res.ok) throw new Error("quran");
  const data = (await res.json()) as QuranBook;
  if (!data?.surahs || data.surahs.length !== 114 || !data.bismillah) throw new Error("quran");
  memory = data;
  try {
    const cache = await caches.open(cacheName);
    await cache.put("/quran.json", new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } }));
  } catch {
    /* private mode */
  }
  return data;
}

export type QuranMeaning = { src: string; surahs: string[][] };

const meanings = new Map<string, QuranMeaning>();

export async function loadMeaning(lang: string): Promise<QuranMeaning | null> {
  if (lang === "ar") return null;
  const saved = meanings.get(lang);
  if (saved) return saved;
  const file = lang === "ru" || lang === "en" || lang === "id" || lang === "tr" || lang === "ur" ? lang : "en";
  const path = `/quran-mean/${file}.json`;
  const cacheName = "zikr-mean-v2";
  try {
    const cache = await caches.open(cacheName);
    const hit = await cache.match(path);
    if (hit) {
      const saved = (await hit.json()) as QuranMeaning;
      if (saved?.surahs?.length === 114) {
        meanings.set(lang, saved);
        return saved;
      }
    }
  } catch {
    /* cache is optional */
  }
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const data = (await res.json()) as QuranMeaning;
    if (!data?.surahs || data.surahs.length !== 114) return null;
    meanings.set(lang, data);
    try {
      const cache = await caches.open(cacheName);
      await cache.put(path, new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } }));
    } catch {
      /* private mode */
    }
    return data;
  } catch {
    return null;
  }
}
