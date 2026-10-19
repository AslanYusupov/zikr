import type { SunnahQuest } from "./quests";
import type { LangId } from "./types";

const LABELS: Record<string, Record<LangId, string>> = {
  "Утром": { ru: "Утром", en: "Morning", ar: "صباحًا", id: "Pagi", tr: "Sabah", ur: "صبح" },
  "Вечером": { ru: "Вечером", en: "Evening", ar: "مساءً", id: "Petang", tr: "Akşam", ur: "شام" },
  "Астаг1фируллах1": { ru: "Астаг1фируллах1", en: "Astaghfirullah", ar: "أستغفر الله", id: "Astaghfirullah", tr: "Estağfirullah", ur: "أستغفر الله" },
  "Антас-салям": { ru: "Антас-салям", en: "Antas-salam", ar: "أنت السلام", id: "Antas-salam", tr: "Entes-selam", ur: "أنت السلام" },
  "Сотый раз": { ru: "Сотый раз", en: "The hundredth", ar: "المرة المتممة للمئة", id: "Yang keseratus", tr: "Yüzüncü", ur: "سوواں" },
};

type Line = { title: string; note: string };

const COPY: Record<string, Record<Exclude<LangId, "ru">, Line>> = {
  "raditu-morning": {
    en: { title: "Raditu billahi", note: "Three times: “I am pleased with Allah as Lord, with Islam as religion, and with Muhammad as prophet.” Morning and evening are separate: three now, and three again in the evening." },
    ar: { title: "رضيت بالله", note: "ثلاث مرات: «رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد نبيًا». الصباح والمساء كلٌّ على حدة: الآن ثلاث، وفي المساء ثلاث أخرى." },
    id: { title: "Raditu billahi", note: "Tiga kali: “Aku rida Allah sebagai Tuhan, Islam sebagai agama, dan Muhammad sebagai nabi.” Pagi dan petang terpisah: sekarang tiga, petang nanti tiga lagi." },
    tr: { title: "Radîtu billâhi", note: "Üç kez: “Allah’ı Rab, İslam’ı din, Muhammed’i peygamber olarak seçtim.” Sabah ve akşam ayrıdır: şimdi üç, akşam yine üç." },
    ur: { title: "رضیت باللہ", note: "تین بار: «میں نے اللہ کو رب، اسلام کو دین اور محمد ﷺ کو نبی مان کر رضا مندی ظاہر کی». صبح اور شام الگ ہیں: اب تین، شام کو پھر تین۔" },
  },
  juwayriya: {
    en: { title: "The dhikr of Juwayriyyah, may Allah be pleased with her", note: "Three times: as many as the creation, as much as pleases Him, as the weight of the Throne, and as the ink of Allah’s words." },
    ar: { title: "ذكر جويرية رضي الله عنها", note: "ثلاث مرات: عدد الخلق، ورضا نفسه، وزنة العرش، ومداد كلماته." },
    id: { title: "Zikir Juwairiyah radhiyallahu anha", note: "Tiga kali: sebanyak ciptaan, sesuai keridaan-Nya, seberat Arasy, dan sebanyak tinta kalimat Allah." },
    tr: { title: "Cüveyriye’nin zikri, radıyallahu anhâ", note: "Üç kez: yaratılanlar sayısınca, rızasınca, arşın ağırlığınca ve kelimelerinin mürekkebince." },
    ur: { title: "جویریہ رضی اللہ عنہا کا ذکر", note: "تین بار: مخلوق کی گنتی، اس کی رضا، عرش کے وزن اور اس کے کلمات کی روشنائی کے برابر۔" },
  },
  ainni: {
    en: { title: "A'inni ala dhikrika", note: "After the prayer, as the Prophet ﷺ taught Muadh, may Allah be pleased with him." },
    ar: { title: "أعني على ذكرك", note: "بعد الصلاة، كما علّم النبي ﷺ معاذًا رضي الله عنه." },
    id: { title: "A'inni ala dzikrika", note: "Setelah salat, sebagaimana Nabi ﷺ mengajar Mu'adz radhiyallahu anhu." },
    tr: { title: "A'innî alâ zikrike", note: "Namazdan sonra, Peygamber ﷺ’in Muâz’a, radıyallahu anh, öğrettiği gibi." },
    ur: { title: "أعني على ذكرك", note: "نماز کے بعد، جیسا نبی ﷺ نے معاذ رضی اللہ عنہ کو سکھایا۔" },
  },
  "antas-salam": {
    en: { title: "Astaghfirullah and Antas-salam", note: "Three times “Astaghfirullah”, then “Antas-salam”." },
    ar: { title: "أستغفر الله وأنت السلام", note: "ثلاثًا «أستغفر الله»، ثم «أنت السلام»." },
    id: { title: "Astaghfirullah dan Antas-salam", note: "Tiga kali “Astaghfirullah”, lalu “Antas-salam”." },
    tr: { title: "Estağfirullah ve Entes-selam", note: "Üç kez “Estağfirullah”, sonra “Entes-selam”." },
    ur: { title: "أستغفر الله اور أنت السلام", note: "تین بار «أستغفر الله»، پھر «أنت السلام»." },
  },
  "la-yadurru": {
    en: { title: "La yadurru", note: "Three times. Morning and evening are separate: three now, and three again in the evening." },
    ar: { title: "لا يضر", note: "ثلاث مرات. الصباح والمساء كلٌّ على حدة: الآن ثلاث، وفي المساء ثلاث أخرى." },
    id: { title: "La yadurru", note: "Tiga kali. Pagi dan petang terpisah: sekarang tiga, petang nanti tiga lagi." },
    tr: { title: "Lâ yadurru", note: "Üç kez. Sabah ve akşam ayrıdır: şimdi üç, akşam yine üç." },
    ur: { title: "لا يضر", note: "تین بار۔ صبح اور شام الگ ہیں: اب تین، شام کو پھر تین۔" },
  },
  kalimat: {
    en: { title: "Kalimatillah", note: "Three times in the evening: I seek refuge in the perfect words of Allah from the evil of what He created." },
    ar: { title: "كلمات الله", note: "ثلاثًا في المساء: أعوذ بكلمات الله التامات من شر ما خلق." },
    id: { title: "Kalimatillah", note: "Tiga kali di petang: aku berlindung dengan kalimat Allah yang sempurna dari kejahatan makhluk-Nya." },
    tr: { title: "Kelimâtillah", note: "Akşam üç kez: Allah’ın eksiksiz kelimelerine, yarattığının şerrinden sığınırım." },
    ur: { title: "کلمات اللہ", note: "شام کو تین بار: میں اللہ کے کامل کلمات کی پناہ چاہتا ہوں اس کے پیدا کردہ کے شر سے۔" },
  },
  "sayyid-morning": {
    en: { title: "Sayyidul-istighfar", note: "Once in the morning." },
    ar: { title: "سيد الاستغفار", note: "مرة في الصباح." },
    id: { title: "Sayyidul-istighfar", note: "Satu kali di pagi hari." },
    tr: { title: "Seyyidü’l-istiğfar", note: "Sabah bir kez." },
    ur: { title: "سید الاستغفار", note: "صبح ایک بار۔" },
  },
  "after-ten": {
    en: { title: "Ten after the prayer", note: "After the prayer: ten “Subhanallah”, ten “Alhamdulillah”, and ten “Allahu Akbar”. Over five prayers that is one hundred and fifty on the tongue and one thousand five hundred on the Scale." },
    ar: { title: "عشر بعد الصلاة", note: "بعد الصلاة: عشر «سبحان الله»، وعشر «الحمد لله»، وعشر «الله أكبر». في الصلوات الخمس مئة وخمسون باللسان، وألف وخمسمئة في الميزان." },
    id: { title: "Sepuluh setelah salat", note: "Setelah salat: sepuluh “Subhanallah”, sepuluh “Alhamdulillah”, dan sepuluh “Allahu Akbar”. Untuk lima salat: seratus lima puluh di lisan dan seribu lima ratus di timbangan." },
    tr: { title: "Namazdan sonra onar", note: "Namazdan sonra on “Sübhanallah”, on “Elhamdülillah”, on “Allahu ekber”. Beş vakit: dilde yüz elli, mizanda bin beş yüz." },
    ur: { title: "نماز کے بعد دس دس", note: "نماز کے بعد دس «سبحان اللہ»، دس «الحمد للہ» اور دس «اللہ اکبر»۔ پانچ نمازوں میں زبان پر ڈیڑھ سو، اور ترازو میں پندرہ سو۔" },
  },
  fatimah: {
    en: { title: "The tasbih of Fatimah, may Allah be pleased with her", note: "After the prayer: “Subhanallah” 33, “Alhamdulillah” 33, “Allahu Akbar” 34." },
    ar: { title: "تسبيح فاطمة رضي الله عنها", note: "بعد الصلاة: «سبحان الله» 33، «الحمد لله» 33، «الله أكبر» 34." },
    id: { title: "Tasbih Fatimah radhiyallahu anha", note: "Setelah salat: “Subhanallah” 33, “Alhamdulillah” 33, “Allahu Akbar” 34." },
    tr: { title: "Fâtıma’nın tesbihi, radıyallahu anhâ", note: "Namazdan sonra: “Sübhanallah” 33, “Elhamdülillah” 33, “Allahu ekber” 34." },
    ur: { title: "فاطمہ رضی اللہ عنہا کا تسبیح", note: "نماز کے بعد: «سبحان اللہ» 33، «الحمد للہ» 33، «اللہ اکبر» 34۔" },
  },
  "istighfar-70": {
    en: { title: "Seventy “Astaghfirullah”", note: "The Prophet ﷺ sought Allah’s forgiveness and repented to Him more than seventy times in a day. (Bukhari)" },
    ar: { title: "سبعون «أستغفر الله»", note: "كان النبي ﷺ يستغفر الله ويتوب إليه في اليوم أكثر من سبعين مرة. (البخاري)" },
    id: { title: "Tujuh puluh “Astaghfirullah”", note: "Nabi ﷺ memohon ampunan kepada Allah dan bertobat kepada-Nya lebih dari tujuh puluh kali dalam sehari. (Bukhari)" },
    tr: { title: "Yetmiş “Estağfirullah”", note: "Peygamber ﷺ günde yetmişten fazla Allah’tan bağışlanma diler ve O’na tövbe ederdi. (Buhârî)" },
    ur: { title: "ستر «أستغفر الله»", note: "نبی ﷺ دن میں ستر سے زیادہ بار اللہ سے بخشش مانگتے اور اس کی طرف توبہ کرتے تھے۔ (بخاری)" },
  },
  "subhan-100": {
    en: { title: "One hundred “Subhanallah”", note: "Whoever says “Subhanallah” one hundred times, a thousand good deeds are written for him or a thousand sins are forgiven." },
    ar: { title: "مئة «سبحان الله»", note: "من قال «سبحان الله» مئة مرة كُتبت له ألف حسنة أو حُطت عنه ألف سيئة." },
    id: { title: "Seratus “Subhanallah”", note: "Siapa mengucapkan “Subhanallah” seratus kali, dicatat untuknya seribu kebaikan atau dihapus seribu keburukan." },
    tr: { title: "Yüz “Sübhanallah”", note: "Kim “Sübhanallah”ı yüz kez söylerse ona bin sevap yazılır veya bin günahı silinir." },
    ur: { title: "سو «سبحان اللہ»", note: "جو سو بار «سبحان اللہ» کہے، اس کے لیے ہزار نیکیاں لکھی جاتی ہیں یا اس کے ہزار گناہ معاف کیے جاتے ہیں۔" },
  },
  "hamd-100": {
    en: { title: "One hundred “Subhanallahi wa bihamdihi”", note: "One hundred times in a day: “Glory and praise be to Allah.”" },
    ar: { title: "مئة «سبحان الله وبحمده»", note: "مئة مرة في اليوم: «سبحان الله وبحمده»." },
    id: { title: "Seratus “Subhanallahi wa bihamdihi”", note: "Seratus kali dalam sehari: “Mahasuci Allah dan segala puji bagi-Nya.”" },
    tr: { title: "Yüz “Sübhanallahi ve bihamdihi”", note: "Günde yüz kez: “Allah’ı hamdiyle tenzih ederim.”" },
    ur: { title: "سو «سبحان اللہ وبحمدہ»", note: "دن میں سو بار: «سبحان اللہ وبحمدہ»." },
  },
  "wahdahu-100": {
    en: { title: "One hundred “la sharika lah”", note: "One hundred times: “None has the right to be worshipped but Allah alone, with no partner. His is the dominion and praise, and He is over all things competent.”" },
    ar: { title: "مئة «لا شريك له»", note: "مئة مرة: «لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير»." },
    id: { title: "Seratus “la syarika lah”", note: "Seratus kali: “Tidak ada tuhan selain Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.”" },
    tr: { title: "Yüz “lâ şerîke leh”", note: "Yüz kez: “Allah’tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O’nundur, hamd O’nadır, O her şeye gücü yetendir.”" },
    ur: { title: "سو «لا شريك له»", note: "سو بار: «لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير»." },
  },
  "after-prayer": {
    en: { title: "33, 33, 33, then la sharika lah", note: "After the prayer: “Subhanallah” 33, “Alhamdulillah” 33, “Allahu Akbar” 33, then once “None has the right to be worshipped but Allah alone, with no partner…”" },
    ar: { title: "33 و33 و33 ثم لا شريك له", note: "بعد الصلاة: «سبحان الله» 33، «الحمد لله» 33، «الله أكبر» 33، ثم مرة: «لا إله إلا الله وحده لا شريك له…»." },
    id: { title: "33, 33, 33, lalu la syarika lah", note: "Setelah salat: “Subhanallah” 33, “Alhamdulillah” 33, “Allahu Akbar” 33, lalu sekali “La ilaha illallahu wahdahu la syarika lah…”" },
    tr: { title: "33, 33, 33, sonra lâ şerîke leh", note: "Namazdan sonra: “Sübhanallah” 33, “Elhamdülillah” 33, “Allahu ekber” 33, sonra bir kez “Lâ ilâhe illallahu vahdehu lâ şerîke leh…”" },
    ur: { title: "33، 33، 33 پھر لا شريك له", note: "نماز کے بعد: «سبحان اللہ» 33، «الحمد للہ» 33، «اللہ اکبر» 33، پھر ایک بار «لا إله إلا الله وحده لا شريك له…»." },
  },
};

export function questText(quest: SunnahQuest, lang: LangId): { title: string; note: string; label: (raw?: string) => string } {
  const line = lang === "ru" ? undefined : COPY[quest.id]?.[lang];
  return {
    title: line?.title ?? quest.title,
    note: line?.note ?? quest.note,
    label: (raw) => (raw ? LABELS[raw]?.[lang] ?? raw : ""),
  };
}