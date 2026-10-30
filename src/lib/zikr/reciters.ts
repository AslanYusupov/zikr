import type { LangId } from "./types";
import { ayahFile, globalAyah } from "./ayah-audio";

type Line = Record<LangId, string>;

export type Reciter = {
  id: string;
  name: Line;
  style: Line;
  urls: (surah: number, ayah: number) => string[];
};

function every(folder: string, surah: number, ayah: number) {
  return `https://everyayah.com/data/${folder}/${ayahFile(surah, ayah)}.mp3`;
}

function islamic(edition: string, bitrate: 64 | 128, surah: number, ayah: number) {
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalAyah(surah, ayah)}.mp3`;
}

function line(ru: string, en: string, ar: string, id: string, tr: string, ur: string): Line {
  return { ru, en, ar, id, tr, ur };
}

/** Десять полных чтений Корана. Стиль — только вид чтения и риваят, без оценки голоса. */
export const RECITERS: Reciter[] = [
  {
    id: "afasy",
    name: line("Мишари Рашид", "Mishari Rashid", "مشاري راشد", "Mishari Rashid", "Mişari Raşid", "مشاری راشد"),
    style: line(
      "Муратталь. Риваят Хафс от Асима. Аят за аятом.",
      "Murattal. Riwayah of Hafs from Asim. Ayah by ayah.",
      "مرتل. رواية حفص عن عاصم. آية آية.",
      "Murattal. Riwayat Hafs dari Asim. Ayat demi ayat.",
      "Murattal. Hafs rivayeti. Ayet ayet.",
      "مرتل۔ روایت حفص عن عاصم۔ آیت در آیت۔",
    ),
    urls: (s, a) => [every("Alafasy_128kbps", s, a), islamic("ar.alafasy", 128, s, a)],
  },
  {
    id: "sudais",
    name: line("Абдуррахман ас-Судайс", "Abdurrahman as-Sudais", "عبد الرحمن السديس", "Abdurrahman as-Sudais", "Abdurrahman es-Südeys", "عبدالرحمن السدیس"),
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("Abdurrahmaan_As-Sudais_192kbps", s, a), islamic("ar.abdurrahmaansudais", 64, s, a)],
  },
  {
    id: "shuraim",
    name: line("Сауд аш-Шурайм", "Saud ash-Shuraim", "سعود الشريم", "Saud asy-Syuraim", "Suud eş-Şureym", "سعود الشریم"),
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("Saood_ash-Shuraym_128kbps", s, a), islamic("ar.saoodshuraym", 64, s, a)],
  },
  {
    id: "muaiqly",
    name: line("Махир аль-Муайкъли", "Maher al-Muayqili", "ماهر المعيقلي", "Maher al-Muaiqly", "Mahir el-Muaykılî", "ماہر المعیقلی"),
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("MaherAlMuaiqly128kbps", s, a), islamic("ar.mahermuaiqly", 128, s, a)],
  },
  {
    id: "husary",
    name: line("Махмуд аль-Х1усари", "Mahmoud al-Husary", "محمود الحصري", "Mahmud al-Husary", "Mahmud el-Husarî", "محمود الحصری"),
    style: line(
      "Учебный муратталь. Риваят Хафс. Медленно, с ясными остановками.",
      "Teaching murattal. Riwayah of Hafs. Slow, with clear stops.",
      "مرتل تعليمي. رواية حفص. ببطء ووقوف واضح.",
      "Murattal untuk belajar. Riwayat Hafs. Pelan, dengan waqaf yang jelas.",
      "Öğretici murattal. Hafs rivayeti. Yavaş, duraklar açık.",
      "تعلیمی مرتل۔ روایت حفص۔ آہستہ، واضح وقفوں کے ساتھ۔",
    ),
    urls: (s, a) => [every("Husary_128kbps", s, a), islamic("ar.husary", 128, s, a)],
  },
  {
    id: "minshawi",
    name: line("Мухаммад аль-Миншави", "Muhammad al-Minshawi", "محمد المنشاوي", "Muhammad al-Minshawi", "Muhammed el-Minşâvî", "محمد المنشاوی"),
    style: line(
      "Муджаввад. Риваят Хафс. Напевное чтение.",
      "Mujawwad. Riwayah of Hafs. Melodic recitation.",
      "مجود. رواية حفص. تلاوة بالألحان.",
      "Mujawwad. Riwayat Hafs. Bacaan berlagu.",
      "Mücevved. Hafs rivayeti. Makamlı kıraat.",
      "مجود۔ روایت حفص۔ لحنی تلاوت۔",
    ),
    urls: (s, a) => [islamic("ar.minshawimujawwad", 64, s, a)],
  },
  {
    id: "basit",
    name: line("Абдуль-Басит", "Abdul Basit", "عبد الباسط", "Abdul Basit", "Abdülbasit", "عبدالباسط"),
    style: line(
      "Муджаввад. Риваят Хафс. Напевное чтение.",
      "Mujawwad. Riwayah of Hafs. Melodic recitation.",
      "مجود. رواية حفص. تلاوة بالألحان.",
      "Mujawwad. Riwayat Hafs. Bacaan berlagu.",
      "Mücevved. Hafs rivayeti. Makamlı kıraat.",
      "مجود۔ روایت حفص۔ لحنی تلاوت۔",
    ),
    urls: (s, a) => [every("Abdul_Basit_Mujawwad_128kbps", s, a)],
  },
  {
    id: "hudhaify",
    name: line("Али аль-Х1узайфи", "Ali al-Hudhaify", "علي الحذيفي", "Ali al-Hudzaify", "Ali el-Huzayfî", "علی الحذیفی"),
    style: line(
      "Имам мечети Пророка ﷺ. Муратталь. Риваят Хафс.",
      "Imam of the Prophet’s Mosque. Murattal. Riwayah of Hafs.",
      "إمام المسجد النبوي. مرتل. رواية حفص.",
      "Imam Masjid Nabawi. Murattal. Riwayat Hafs.",
      "Mescid-i Nebevî imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد نبوی۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("Hudhaify_128kbps", s, a), islamic("ar.hudhaify", 128, s, a)],
  },
  {
    id: "dosari",
    name: line("Ясир ад-Дусари", "Yasser al-Dosari", "ياسر الدوسري", "Yasir ad-Dusari", "Yasir ed-Devserî", "یاسر الدوسری"),
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("Yasser_Ad-Dussary_128kbps", s, a)],
  },
  {
    id: "ayyub",
    name: line("Мухаммад Айюб", "Muhammad Ayyub", "محمد أيوب", "Muhammad Ayyub", "Muhammed Eyyûb", "محمد ایوب"),
    style: line(
      "Имам мечети Пророка ﷺ. Муратталь. Риваят Хафс.",
      "Imam of the Prophet’s Mosque. Murattal. Riwayah of Hafs.",
      "إمام المسجد النبوي. مرتل. رواية حفص.",
      "Imam Masjid Nabawi. Murattal. Riwayat Hafs.",
      "Mescid-i Nebevî imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد نبوی۔ مرتل۔ روایت حفص۔",
    ),
    urls: (s, a) => [every("Muhammad_Ayyoub_128kbps", s, a), islamic("ar.muhammadayyoub", 128, s, a)],
  },
];

export function reciterById(id: string): Reciter {
  return RECITERS.find((item) => item.id === id) ?? RECITERS[0]!;
}
