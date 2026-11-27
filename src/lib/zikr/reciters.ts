import type { LangId } from "./types";
import { ayahFile } from "./ayah-audio";

type Line = Record<LangId, string>;

export type Reciter = {
  id: string;
  name: Line;
  form: Line;
  style: Line;
  files: (surah: number) => string[];
  ayahs: (surah: number, ayah: number) => string[];
};

function pad(surah: number) {
  return String(surah).padStart(3, "0");
}

function github(repo: string, tag: string, file: string) {
  return `https://github.com/AslanYusupov/${repo}/releases/download/${tag}/${file}`;
}

function line(ru: string, en: string, ar: string, id: string, tr: string, ur: string): Line {
  return { ru, en, ar, id, tr, ur };
}

const MURATTAL = line("Муратталь", "Murattal", "مرتل", "Murattal", "Murattal", "مرتل");
const MUJAWWAD = line("Муджаввад", "Mujawwad", "مجود", "Mujawwad", "Mücevved", "مجود");

/** Одиннадцать полных чтений Корана. Стиль — только вид чтения и риваят, без оценки голоса. */
const READERS: Reciter[] = [
  {
    id: "dosari",
    name: line("Ясир ад-Дусари", "Yasser al-Dosari", "ياسر الدوسري", "Yasir ad-Dusari", "Yasir ed-Devserî", "یاسر الدوسری"),
    form: MURATTAL,
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    files: (n) => [github("zikr-quran-audio", "quran-dosari", `${pad(n)}.mp3`)],
    ayahs: () => [],
  },
  {
    id: "afasy",
    name: line("Мишари Рашид", "Mishari Rashid", "مشاري راشد", "Mishari Rashid", "Mişari Raşid", "مشاری راشد"),
    form: MURATTAL,
    style: line(
      "Муратталь. Риваят Хафс от Асима.",
      "Murattal. Riwayah of Hafs from Asim.",
      "مرتل. رواية حفص عن عاصم.",
      "Murattal. Riwayat Hafs dari Asim.",
      "Murattal. Hafs rivayeti.",
      "مرتل۔ روایت حفص عن عاصم۔",
    ),
    files: (n) => [github("zikr-quran-afasy", "quran-afasy", `afasy-${pad(n)}.mp3`)],
    ayahs: (s, a) => [`/api/ayah/${ayahFile(s, a)}`],
  },
  {
    id: "sudais",
    name: line("Абдуррахман ас-Судайс", "Abdurrahman as-Sudais", "عبد الرحمن السديس", "Abdurrahman as-Sudais", "Abdurrahman es-Südeys", "عبدالرحمن السدیس"),
    form: MURATTAL,
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "shuraim",
    name: line("Сауд аш-Шурайм", "Saud ash-Shuraim", "سعود الشريم", "Saud asy-Syuraim", "Suud eş-Şureym", "سعود الشریم"),
    form: MURATTAL,
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "muaiqly",
    name: line("Махир аль-Муайкъли", "Maher al-Muayqili", "ماهر المعيقلي", "Maher al-Muaiqly", "Mahir el-Muaykılî", "ماہر المعیقلی"),
    form: MURATTAL,
    style: line(
      "Имам мечети аль-Харам. Муратталь. Риваят Хафс.",
      "Imam of al-Masjid al-Haram. Murattal. Riwayah of Hafs.",
      "إمام المسجد الحرام. مرتل. رواية حفص.",
      "Imam Masjidil Haram. Murattal. Riwayat Hafs.",
      "Mescid-i Haram imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد الحرام۔ مرتل۔ روایت حفص۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "husary",
    name: line("Махмуд аль-Х1усари", "Mahmoud al-Husary", "محمود الحصري", "Mahmud al-Husary", "Mahmud el-Husarî", "محمود الحصری"),
    form: MURATTAL,
    style: line(
      "Учебный муратталь. Риваят Хафс. Медленно, с ясными остановками.",
      "Teaching murattal. Riwayah of Hafs. Slow, with clear stops.",
      "مرتل تعليمي. رواية حفص. ببطء ووقوف واضح.",
      "Murattal untuk belajar. Riwayat Hafs. Pelan, dengan waqaf yang jelas.",
      "Öğretici murattal. Hafs rivayeti. Yavaş, duraklar açık.",
      "تعلیمی مرتل۔ روایت حفص۔ آہستہ، واضح وقفوں کے ساتھ۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "minshawi",
    name: line("Мухаммад аль-Миншави", "Muhammad al-Minshawi", "محمد المنشاوي", "Muhammad al-Minshawi", "Muhammed el-Minşâvî", "محمد المنشاوی"),
    form: MUJAWWAD,
    style: line(
      "Муджаввад. Риваят Хафс. Напевное чтение.",
      "Mujawwad. Riwayah of Hafs. Melodic recitation.",
      "مجود. رواية حفص. تلاوة بالألحان.",
      "Mujawwad. Riwayat Hafs. Bacaan berlagu.",
      "Mücevved. Hafs rivayeti. Makamlı kıraat.",
      "مجود۔ روایت حفص۔ لحنی تلاوت۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "basit",
    name: line("Абдуль-Басит", "Abdul Basit", "عبد الباسط", "Abdul Basit", "Abdülbasit", "عبدالباسط"),
    form: MUJAWWAD,
    style: line(
      "Муджаввад. Риваят Хафс. Напевное чтение.",
      "Mujawwad. Riwayah of Hafs. Melodic recitation.",
      "مجود. رواية حفص. تلاوة بالألحان.",
      "Mujawwad. Riwayat Hafs. Bacaan berlagu.",
      "Mücevved. Hafs rivayeti. Makamlı kıraat.",
      "مجود۔ روایت حفص۔ لحنی تلاوت۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "hudhaify",
    name: line("Али аль-Х1узайфи", "Ali al-Hudhaify", "علي الحذيفي", "Ali al-Hudzaify", "Ali el-Huzayfî", "علی الحذیفی"),
    form: MURATTAL,
    style: line(
      "Имам мечети Пророка ﷺ. Муратталь. Риваят Хафс.",
      "Imam of the Prophet’s Mosque. Murattal. Riwayah of Hafs.",
      "إمام المسجد النبوي. مرتل. رواية حفص.",
      "Imam Masjid Nabawi. Murattal. Riwayat Hafs.",
      "Mescid-i Nebevî imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد نبوی۔ مرتل۔ روایت حفص۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "ayyub",
    name: line("Мухаммад Айюб", "Muhammad Ayyub", "محمد أيوب", "Muhammad Ayyub", "Muhammed Eyyûb", "محمد ایوب"),
    form: MURATTAL,
    style: line(
      "Имам мечети Пророка ﷺ. Муратталь. Риваят Хафс.",
      "Imam of the Prophet’s Mosque. Murattal. Riwayah of Hafs.",
      "إمام المسجد النبوي. مرتل. رواية حفص.",
      "Imam Masjid Nabawi. Murattal. Riwayat Hafs.",
      "Mescid-i Nebevî imamı. Murattal. Hafs rivayeti.",
      "امامِ مسجد نبوی۔ مرتل۔ روایت حفص۔",
    ),
    files: () => [],
    ayahs: () => [],
  },
  {
    id: "luhaydan",
    name: line("Мухаммад аль-Люхайдан", "Muhammad al-Luhaidan", "محمد اللحيدان", "Muhammad al-Luhaidan", "Muhammed el-Luhaydân", "محمد اللحیدان"),
    form: MURATTAL,
    style: line(
      "Муратталь. Риваят Хафс от Асима.",
      "Murattal. Riwayah of Hafs from Asim.",
      "مرتل. رواية حفص عن عاصم.",
      "Murattal. Riwayat Hafs dari Asim.",
      "Murattal. Hafs rivayeti.",
      "مرتل۔ روایت حفص عن عاصم۔",
    ),
    files: (n) => [github("zikr-quran-luhaydan", "quran-luhaydan", `${pad(n)}.mp3`)],
    ayahs: () => [],
  },
];

export const RECITERS = READERS.filter((item) => item.files(1).length > 0);

export function reciterById(id: string): Reciter {
  return RECITERS.find((item) => item.id === id) ?? RECITERS[0]!;
}
