import type { LangId } from "./types";

export type QuranHadith = {
  ar: string;
  text: Record<LangId, string>;
  src: Record<LangId, string>;
};

const SRC = {
  tirmidhi: { ru: "ат-Тирмизи", en: "At-Tirmidhi", ar: "الترمذي", id: "At-Tirmidzi", tr: "Tirmizî", ur: "ترمذی" },
  muslim: { ru: "Сахих Муслим", en: "Sahih Muslim", ar: "صحيح مسلم", id: "Sahih Muslim", tr: "Sahih Müslim", ur: "صحیح مسلم" },
  bukhari: { ru: "Сахих аль-Бухари", en: "Sahih al-Bukhari", ar: "صحيح البخاري", id: "Sahih al-Bukhari", tr: "Sahihü'l-Buhârî", ur: "صحیح البخاری" },
  both: { ru: "Сахих аль-Бухари, Сахих Муслим", en: "Sahih al-Bukhari, Sahih Muslim", ar: "صحيح البخاري وصحيح مسلم", id: "Sahih al-Bukhari, Sahih Muslim", tr: "Buhârî, Müslim", ur: "صحیح البخاری، صحیح مسلم" },
  dawud: { ru: "Абу Давуд, ат-Тирмизи", en: "Abu Dawud, At-Tirmidhi", ar: "أبو داود والترمذي", id: "Abu Dawud, At-Tirmidzi", tr: "Ebû Dâvûd, Tirmizî", ur: "ابو داؤد، ترمذی" },
} as const;

export const QURAN_HADITHS: QuranHadith[] = [
  {
    ar: "«مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا، لَا أَقُولُ: الم حَرْفٌ، وَلَكِنْ أَلِفٌ حَرْفٌ، وَلَامٌ حَرْفٌ، وَمِيمٌ حَرْفٌ»",
    text: {
      ru: "Кто прочитает букву из Книги Аллах1а, тому запишут благое дело, а благое дело воздаётся десятикратно. Я не говорю, что «алиф лам мим» — одна буква. Алиф — буква, лам — буква, мим — буква.",
      en: "Whoever recites a letter from the Book of Allah has a good deed, and a good deed is rewarded tenfold. I do not say that Alif Lam Mim is one letter. Alif is a letter, Lam is a letter, and Mim is a letter.",
      ar: "من قرأ حرفًا من كتاب الله فله به حسنة، والحسنة بعشر أمثالها. لا أقول: الم حرف، ولكن ألف حرف، ولام حرف، وميم حرف.",
      id: "Siapa membaca satu huruf dari Kitab Allah, dicatat satu kebaikan, dan setiap kebaikan dibalas sepuluh kali lipat. Aku tidak mengatakan Alif Lam Mim itu satu huruf. Alif satu huruf, Lam satu huruf, dan Mim satu huruf.",
      tr: "Allah'ın Kitabından bir harf okuyana bir iyilik yazılır, her iyiliğe de on kat karşılık verilir. Elif Lâm Mîm bir harftir demiyorum. Elif bir harf, Lâm bir harf, Mîm bir harftir.",
      ur: "جو اللہ کی کتاب کا ایک حرف پڑھے، اس کے لیے ایک نیکی لکھی جاتی ہے، اور ہر نیکی کا بدلہ دس گنا ہے۔ میں نہیں کہتا کہ الم ایک حرف ہے۔ الف ایک حرف ہے، لام ایک حرف ہے، اور میم ایک حرف ہے۔",
    },
    src: SRC.tirmidhi,
  },
  {
    ar: "«أَيَعْجِزُ أَحَدُكُمْ أَنْ يَقْرَأَ فِي لَيْلَةٍ ثُلُثَ الْقُرْآنِ؟ قَالُوا: وَكَيْفَ يَقْرَأُ ثُلُثَ الْقُرْآنِ؟ قَالَ: قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ»",
    text: {
      ru: "Не способен ли кто-нибудь из вас прочитать за ночь треть Корана? Спросили: как же прочитать треть Корана? Он сказал: «Скажи: Он — Аллах1, Един» — она равна трети Корана.",
      en: "Is one of you unable to recite a third of the Quran in a night? They said: How could he recite a third of the Quran? He said: “Say: He is Allah, One” equals a third of the Quran.",
      ar: "أيعجز أحدكم أن يقرأ في ليلة ثلث القرآن؟ قالوا: وكيف يقرأ ثلث القرآن؟ قال: قل هو الله أحد تعدل ثلث القرآن.",
      id: "Tidakkah seorang dari kalian mampu membaca sepertiga Quran dalam semalam? Mereka bertanya: bagaimana membaca sepertiga Quran? Beliau bersabda: “Qul huwallahu ahad” menyamai sepertiga Quran.",
      tr: "Sizden biri bir gecede Kur'an'ın üçte birini okumaktan âciz midir? Dediler: Kur'an'ın üçte biri nasıl okunur? Buyurdu: “Kul huvallâhu ehad” Kur'an'ın üçte birine denktir.",
      ur: "کیا تم میں سے کوئی ایک رات میں قرآن کا تہائی پڑھنے سے عاجز ہے؟ لوگوں نے پوچھا: تہائی قرآن کیسے پڑھا جائے؟ فرمایا: قل ہو اللہ احد قرآن کے تہائی کے برابر ہے۔",
    },
    src: SRC.muslim,
  },
  {
    ar: "«خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ»",
    text: {
      ru: "Лучшие из вас — те, кто изучает Коран и обучает ему.",
      en: "The best of you are those who learn the Quran and teach it.",
      ar: "خيركم من تعلم القرآن وعلمه.",
      id: "Sebaik-baik kalian adalah yang belajar Quran dan mengajarkannya.",
      tr: "Sizin en hayırlınız Kur'an'ı öğrenen ve öğretendir.",
      ur: "تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
    },
    src: SRC.bukhari,
  },
  {
    ar: "«اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ»",
    text: {
      ru: "Читайте Коран, ибо он придёт в День воскресения заступником за тех, кто его читал.",
      en: "Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.",
      ar: "اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعًا لأصحابه.",
      id: "Bacalah Quran, karena ia datang pada Hari Kiamat sebagai pemberi syafaat bagi pembacanya.",
      tr: "Kur'an okuyun. O, kıyamet günü ashabına şefaatçi olarak gelir.",
      ur: "قرآن پڑھو، کیونکہ وہ قیامت کے دن اپنے پڑھنے والوں کے لیے سفارش کرنے والا بن کر آئے گا۔",
    },
    src: SRC.muslim,
  },
  {
    ar: "«الْمَاهِرُ بِالْقُرْآنِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ، وَالَّذِي يَقْرَأُ الْقُرْآنَ وَيَتَتَعْتَعُ فِيهِ وَهُوَ عَلَيْهِ شَاقٌّ لَهُ أَجْرَانِ»",
    text: {
      ru: "Умелый в Коране будет вместе с благородными и праведными ангелами-посланцами. А кто читает Коран, запинаясь, и это ему трудно, тому две награды.",
      en: "The one skilled in the Quran will be with the noble and righteous angels. The one who recites it with difficulty and it is hard for him has a double reward.",
      ar: "الماهر بالقرآن مع السفرة الكرام البررة، والذي يقرأ القرآن ويتتعتع فيه وهو عليه شاق له أجران.",
      id: "Orang yang mahir membaca Quran bersama para malaikat yang mulia dan baik. Orang yang membaca Quran dengan terbata-bata dan itu berat baginya mendapat dua pahala.",
      tr: "Kur'an'a hâkim olan, değerli ve iyi elçilerledir. Kur'an'ı kekeleyerek okuyan ve bu ona zor gelen kimseye iki ecir vardır.",
      ur: "قرآن کا ماہر معزز نیک فرشتوں کے ساتھ ہوگا، اور جو قرآن پڑھے اور اس میں اٹکتا رہے اور یہ اس پر گراں ہو، اس کے لیے دو اجر ہیں۔",
    },
    src: SRC.both,
  },
  {
    ar: "«يُقَالُ لِصَاحِبِ الْقُرْآنِ: اقْرَأْ وَارْتَقِ وَرَتِّلْ كَمَا كُنْتَ تُرَتِّلُ فِي الدُّنْيَا، فَإِنَّ مَنْزِلَتَكَ عِنْدَ آخِرِ آيَةٍ تَقْرَأُ بِهَا»",
    text: {
      ru: "Читателю Корана скажут: читай, поднимайся и читай размеренно, как читал в этом мире. Твоя степень — у последнего аята, который ты прочитаешь.",
      en: "The companion of the Quran will be told: Recite, ascend, and recite with care as you recited in the world. Your station is at the last verse you recite.",
      ar: "يقال لصاحب القرآن: اقرأ وارتق ورتل كما كنت ترتل في الدنيا، فإن منزلك عند آخر آية تقرأها.",
      id: "Kepada sahabat Quran dikatakan: Bacalah, naiklah, dan bacalah dengan tartil sebagaimana engkau membaca di dunia. Tempatmu ada pada ayat terakhir yang engkau baca.",
      tr: "Kur'an ehline denilir: Oku, yüksel ve dünyada tertil ettiğin gibi tertil et. Senin makamın, okuduğun son ayettedir.",
      ur: "قرآن والے سے کہا جائے گا: پڑھ اور چڑھ، اور اسی ترتیل سے پڑھ جیسے دنیا میں پڑھتا تھا۔ تیرا ٹھکانہ آخری آیت کے پاس ہے جسے تو پڑھے گا۔",
    },
    src: SRC.dawud,
  },
  {
    ar: "«لَا تَجْعَلُوا بُيُوتَكُمْ مَقَابِرَ، إِنَّ الشَّيْطَانَ يَنْفِرُ مِنَ الْبَيْتِ الَّذِي تُقْرَأُ فِيهِ سُورَةُ الْبَقَرَةِ»",
    text: {
      ru: "Не превращайте дома ваши в могилы. Поистине, шайтан бежит из дома, в котором читают суру аль-Бакара.",
      en: "Do not make your houses graves. Shaytan flees from the house in which Surah al-Baqarah is recited.",
      ar: "لا تجعلوا بيوتكم مقابر، إن الشيطان ينفر من البيت الذي تُقرأ فيه سورة البقرة.",
      id: "Jangan jadikan rumah kalian kuburan. Setan lari dari rumah yang dibacakan surah al-Baqarah.",
      tr: "Evlerinizi kabirlere çevirmeyin. Şeytan, Bakara suresinin okunduğu evden kaçar.",
      ur: "اپنے گھروں کو قبرستان نہ بناؤ۔ شیطان اس گھر سے بھاگتا ہے جس میں سورۃ البقرہ پڑھی جائے۔",
    },
    src: SRC.muslim,
  },
  {
    ar: "«مَنْ قَرَأَ بِالْآيَتَيْنِ مِنْ آخِرِ سُورَةِ الْبَقَرَةِ فِي لَيْلَةٍ كَفَتَاهُ»",
    text: {
      ru: "Кто прочитает два последних аята суры аль-Бакара ночью, этого будет ему достаточно.",
      en: "Whoever recites the last two verses of Surah al-Baqarah at night, they will suffice him.",
      ar: "من قرأ بالآيتين من آخر سورة البقرة في ليلة كفتاه.",
      id: "Siapa membaca dua ayat terakhir surah al-Baqarah pada malam hari, keduanya mencukupinya.",
      tr: "Kim Bakara suresinin son iki ayetini gece okursa, o ikisi ona yeter.",
      ur: "جو رات کو سورۃ البقرہ کی آخری دو آیتیں پڑھے، وہ اس کے لیے کافی ہو جائیں گی۔",
    },
    src: SRC.both,
  },
];

const TAB: Record<LangId, string> = {
  ru: "Хадисы",
  en: "Hadiths",
  ar: "فضائل",
  id: "Hadis",
  tr: "Hadis",
  ur: "احادیث",
};

const THIRD: Record<LangId, string> = {
  ru: "треть Корана",
  en: "a third of the Quran",
  ar: "ثلث القرآن",
  id: "sepertiga Quran",
  tr: "Kur'an'ın üçte biri",
  ur: "قرآن کا تہائی",
};

const HEAD: Record<LangId, { ar: string; title: string }> = {
  ru: { ar: "فَضَائِلُ الْقُرْآنِ", title: "Достоинства Корана" },
  en: { ar: "فَضَائِلُ الْقُرْآنِ", title: "Virtues of the Quran" },
  id: { ar: "فَضَائِلُ الْقُرْآنِ", title: "Keutamaan Quran" },
  tr: { ar: "فَضَائِلُ الْقُرْآنِ", title: "Kur'an'ın fazileti" },
  ur: { ar: "فَضَائِلُ الْقُرْآنِ", title: "قرآن کی فضیلت" },
  ar: { ar: "فَضَائِلُ الْقُرْآنِ", title: "فضائل القرآن" },
};

export function hadithTab(lang: LangId) {
  return TAB[lang] ?? TAB.ru;
}

export function thirdWord(lang: LangId) {
  return THIRD[lang] ?? THIRD.ru;
}

export function hadithHead(lang: LangId) {
  return HEAD[lang] ?? HEAD.ru;
}
