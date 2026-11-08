import { TAJWEED_COURSE, type CourseLesson, type TajQuiz } from "./tajweed-course";
import type { LangId } from "./types";

type L = Record<LangId, string>;

function L(ru: string, en: string, ar: string, id: string, tr: string, ur: string): L {
  return { ru, en, ar, id, tr, ur };
}

function Q(q: L, a: L, b: L, c: L, answer: 0 | 1 | 2): TajQuiz {
  return { q, choices: [a, b, c], answer };
}

const byId = new Map(TAJWEED_COURSE.flatMap((mod) => mod.lessons).map((lesson) => [lesson.id, lesson]));

function take(id: string): CourseLesson {
  const lesson = byId.get(id);
  if (!lesson) throw new Error(id);
  return lesson;
}

function withQuiz(id: string, extra: TajQuiz[]): CourseLesson {
  const lesson = take(id);
  return { ...lesson, quiz: [...lesson.quiz, ...extra] };
}

const letters: CourseLesson = {
  id: "letters",
  tone: "plain",
  title: L("28 букв", "The 28 letters", "الحروف الثمانية والعشرون", "28 huruf", "28 harf", "۲۸ حروف"),
  definition: L(
    "В арабском 28 букв. Сначала узнай форму, потом звук. Буква сама по себе не имеет гласного: «б», не «ба».",
    "Arabic has 28 letters. Learn the shape first, then the sound. A letter by itself has no vowel: b, not ba.",
    "في العربية ثمانية وعشرون حرفًا. تُعرف الصورة أولًا ثم الصوت. والحرف وحده بلا حركة.",
    "Bahasa Arab ada 28 huruf. Kenali bentuk dahulu, kemudian bunyi. Huruf sendiri tiada vokal.",
    "Arapçada 28 harf vardır. Önce şekil, sonra ses. Harfin kendisinde sesli yoktur.",
    "عربی میں ۲۸ حروف ہیں۔ پہلے شکل، پھر آواز۔ حرف خود بغیر حرکت کے ہوتا ہے۔",
  ),
  letters: "ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي",
  mechanism: L(
    "Читай ряд слева направо только чтобы узнать порядок. В слове читают справа налево.\nПохожие формы: ب ت ث отличаются точками. ج ح خ тоже. د ذ, ر ز, س ش, ص ض, ط ظ, ع غ.",
    "Read the row from left to right only to learn the order. In a word, reading goes from right to left.\nSimilar shapes: ba, ta and tha differ by the dots. So do jim, ha and kha. Also dal and dhal, ra and zay, sin and shin, sad and dad, ta and za, ayn and ghayn.",
    "يُقرأ ترتيب الحروف للمعرفة. وفي الكلمة القراءة من اليمين.\nب ت ث تختلف بالنقط، وكذلك ج ح خ، ود ذ، ور ز، وس ش، وص ض، وط ظ، وع غ.",
    "Baris itu untuk hafal urutan. Dalam kata, bacaan dari kanan ke kiri.\nBa, ta dan tsa bezanya titik. Begitu juga jim ha kha, dal dzal, ra zay, sin syin, sad dad, ta za, ain ghain.",
    "Sıra, harfleri tanımak içindir. Kelimede okuyuş sağdan sola gider.\nBe, te ve se noktalarıyla ayrılır. Cim ha hı, dal zel, ra ze, sin şin, sad dad, tı zı, ayn ğayn da öyle.",
    "قطار ترتیب یاد کرنے کے لیے ہے۔ لفظ میں پڑھائی دائیں سے بائیں۔\nب ت ث نقطوں سے الگ ہیں۔ اسی طرح ج ح خ، د ذ، ر ز، س ش، ص ض، ط ظ، ع غ۔",
  ),
  examples: [
    { ar: "ب", read: "б — точка снизу", lat: "b — a dot below", where: "знак" },
    { ar: "ت", read: "т — две точки сверху", lat: "t — two dots above", where: "знак" },
    { ar: "ث", read: "с между зубами — три точки", lat: "th — three dots", where: "знак" },
  ],
  mistakes: L(
    "Не читай букву сразу со звуком а. Сначала голая буква. Точки — часть буквы, не украшение.",
    "Do not read the letter with a at once. First the bare letter. The dots are part of the letter, not decoration.",
    "لا تقرأ الحرف بالفتح فورًا. النقط جزء من الحرف.",
    "Jangan baca huruf terus dengan a. Titik adalah sebahagian huruf.",
    "Harfi hemen a ile okuma. Noktalar harfin parçasıdır.",
    "حرف کو فوراً الف کے ساتھ نہ پڑھیں۔ نقطے حرف کا حصہ ہیں۔",
  ),
  quiz: [
    Q(
      L("Сколько букв в арабском?", "How many Arabic letters are there?", "كم حرفًا في العربية؟", "Berapa huruf Arab?", "Arapçada kaç harf vardır?", "عربی میں کتنے حروف ہیں؟"),
      L("28", "28", "٢٨", "28", "28", "۲۸"),
      L("26", "26", "٢٦", "26", "26", "۲۶"),
      L("30", "30", "٣٠", "30", "30", "۳۰"),
      0,
    ),
    Q(
      L("Чем отличаются ب и ت?", "What separates ba and ta?", "بم تختلف الباء والتاء؟", "Apa bezanya ba dan ta?", "Be ile te nasıl ayrılır?", "ب اور ت میں کیا فرق ہے؟"),
      L("Точками", "The dots", "بالنقط", "Titik", "Noktalarla", "نقطوں سے"),
      L("Длиной", "The length", "بالمد", "Panjang", "Uzunlukla", "لمبائی سے"),
      L("Ничем", "Nothing", "لا شيء", "Tiada apa", "Hiçbir şeyle", "کچھ نہیں"),
      0,
    ),
    Q(
      L("Буква без знака — это?", "A letter with no sign is?", "الحرف بلا علامة هو؟", "Huruf tanpa tanda ialah?", "İşaretsiz harf nedir?", "بغیر نشان کا حرف کیا ہے؟"),
      L("Голый согласный", "A bare consonant", "حرف بلا حركة", "Konsonan tanpa vokal", "Yalın ünsüz", "بغیر حرکت کا حرف"),
      L("Обязательно «ба»", "Always ba", "دائمًا بَ", "Sentiasa ba", "Hep ba", "ہمیشہ بَ"),
      L("Долгий а", "A long a", "ألف مد", "A panjang", "Uzun a", "لمبی ا"),
      0,
    ),
  ],
};

const forms: CourseLesson = {
  id: "forms",
  tone: "plain",
  title: L("Четыре формы", "The four shapes", "الأشكال الأربعة", "Empat bentuk", "Dört şekil", "چار شکلیں"),
  definition: L(
    "У соединяющихся букв четыре формы: одна, в начале, в середине и в конце. Шесть букв не соединяются со следующей: ا د ذ ر ز و. У них нет середины.",
    "A letter that joins has four shapes: alone, at the start, in the middle, and at the end. Six letters do not join to the next one: alif, dal, dhal, ra, zay and waw. They have no middle shape.",
    "للحرف المتصل أربعة أشكال: مفرد، أول، وسط، آخر. وستة لا تتصل بما بعدها: ا د ذ ر ز و.",
    "Huruf yang bersambung ada empat bentuk: sendirian, awal, tengah dan akhir. Enam huruf tidak bersambung ke huruf berikut: alif, dal, dzal, ra, zay dan waw.",
    "Bağlanan harfin dört şekli vardır: tek, başta, ortada ve sonda. Altı harf sonrakine bağlanmaz: elif, dal, zel, ra, ze ve vav.",
    "جڑنے والے حرف کی چار شکلیں ہیں: اکیلے، شروع، بیچ اور آخر۔ چھ حروف اگلے سے نہیں جڑتے: ا د ذ ر ز و۔",
  ),
  letters: "ب بـ ـبـ ـب",
  mechanism: L(
    "ب одна. بـ начало. ـبـ середина. ـب конец.\nПосле ا د ذ ر ز و следующая буква пишется отдельно, как в начале: «دَرَسَ» — после د буква ر стоит отдельно.",
    "Ba alone. Ba at the start. Ba in the middle. Ba at the end.\nAfter alif, dal, dhal, ra, zay or waw the next letter is written as if it starts again. In darasa, ra stands alone after dal.",
    "ب مفردة، وبـ في الأول، وـبـ في الوسط، وـب في الآخر.\nوبعد ا د ذ ر ز و تُكتب التالية كأنها في الأول.",
    "Ba sendirian, di awal, di tengah dan di hujung.\nSelepas alif, dal, dzal, ra, zay atau waw, huruf berikut ditulis seperti di awal.",
    "Be tek, başta, ortada ve sonda.\nElif, dal, zel, ra, ze veya vavdan sonra sonraki harf baştaymış gibi yazılır.",
    "ب اکیلے، شروع میں، بیچ میں اور آخر میں۔\nا د ذ ر ز و کے بعد اگلا حرف شروع کی طرح لکھا جاتا ہے۔",
  ),
  examples: [
    { ar: "بَـبْـبِـبْ", read: "баб-биб — б в четырёх местах", lat: "the b in four places", where: "мера" },
    { ar: "دَرَسَ", read: "дараса — د и ر не тянут хвост к следующей", lat: "darasa — dal and ra do not join forward", where: "знак" },
    { ar: "يَكْتُبُ", read: "йактубу — ك ت ب соединены", lat: "yaktubu — kaf, ta and ba are joined", where: "знак" },
  ],
  mistakes: L(
    "Не ищи у د ذ ر ز و форму середины. Их нет. И не отрывай ب ت ث ج, когда они в середине слова.",
    "Do not look for a middle shape of dal, dhal, ra, zay or waw. There is none. And do not split ba, ta, tha or jim when they are in the middle of a word.",
    "لا تطلب للدال والذال والراء والزاي والواو شكل الوسط. ولا تفصل الباء ونحوها في وسط الكلمة.",
    "Jangan cari bentuk tengah untuk dal, dzal, ra, zay dan waw. Dan jangan pisahkan ba di tengah kata.",
    "Dal, zel, ra, ze ve vav için orta şekil arama. Kelime ortasında be'yi ayırma.",
    "د ذ ر ز و کی درمیانی شکل مت ڈھونڈیں۔ اور لفظ کے بیچ میں ب کو مت توڑیں۔",
  ),
  quiz: [
    Q(
      L("Сколько форм у ب?", "How many shapes does ba have?", "كم شكلًا للباء؟", "Berapa bentuk ba?", "Be'nin kaç şekli vardır?", "ب کی کتنی شکلیں ہیں؟"),
      L("Четыре", "Four", "أربعة", "Empat", "Dört", "چار"),
      L("Одна", "One", "واحد", "Satu", "Bir", "ایک"),
      L("Две", "Two", "اثنان", "Dua", "İki", "دو"),
      0,
    ),
    Q(
      L("Какая буква не соединяется со следующей?", "Which letter does not join to the next?", "أي حرف لا يتصل بما بعده؟", "Huruf mana tidak bersambung ke berikut?", "Hangi harf sonrakine bağlanmaz?", "کون سا حرف اگلے سے نہیں جڑتا؟"),
      L("ر", "Ra", "ر", "Ra", "Ra", "ر"),
      L("ب", "Ba", "ب", "Ba", "Be", "ب"),
      L("م", "Mim", "م", "Mim", "Mim", "م"),
      0,
    ),
    Q(
      L("Что значит ـبـ?", "What is the middle ba?", "ما معنى ـبـ؟", "Apa maksud ba di tengah?", "Ortadaki be ne demektir?", "ـبـ کا کیا مطلب ہے؟"),
      L("Б в середине слова", "Ba in the middle of a word", "باء في وسط الكلمة", "Ba di tengah kata", "Kelimenin ortasında be", "لفظ کے بیچ میں ب"),
      L("Отдельная буква", "A letter alone", "حرف مفرد", "Huruf sendirian", "Tek harf", "اکیلا حرف"),
      L("Долгий а", "A long a", "مد", "Mad", "Med", "مد"),
      0,
    ),
  ],
};

const readShort: CourseLesson = {
  id: "read-short",
  tone: "madd",
  title: L("Аль-Фатиха и Аль-Ихлас", "Al-Fatiha and Al-Ikhlas", "الفاتحة والإخلاص", "Al-Fatihah dan Al-Ikhlas", "Fatiha ve İhlas", "فاتحہ اور اخلاص"),
  definition: L(
    "Здесь собран путь: буква, гласный, место звука, нун, протяжка и остановка. Читай вслух медленно. Цвет в уроках выше — тот же смысл: протяжка, носовой н, отскок, ясный н.",
    "This gathers the path: the letter, the vowel, the place of the sound, the nun, the lengthening and the stop. Read aloud, slowly. The colours in the lessons above mean the same thing: lengthening, a nasal n, a bounce, a clear n.",
    "هنا يجتمع الطريق: الحرف والحركة والمخرج والنون والمد والوقف. اقرأ بصوت مرتفع متمهلًا.",
    "Di sini jalannya berkumpul: huruf, vokal, tempat bunyi, nun, mad dan waqaf. Baca dengan suara, perlahan.",
    "Burada yol toplanır: harf, hareke, mahreç, nun, med ve vakıf. Sesli ve yavaş oku.",
    "یہاں راستہ اکٹھا ہے: حرف، حرکت، مخرج، نون، مد اور وقف۔ آواز سے آہستہ پڑھیں۔",
  ),
  letters: "الْحَمْدُ · قُلْ هُوَ اللَّهُ أَحَدٌ",
  mechanism: L(
    "Аль-Фатиха, 1:2. «Аль» — лям без гласного, потом хь из середины горла. На остановке «хьамд» закрывается.\nАль-Ихлас, 112:1. «Къуль» — къ из глубины, лям без гласного. «Ахьад» на остановке: д с лёгким отскоком, без лишнего гласного.\nНе начинай слово с огласовки. Сначала буква.",
    "Al-Fatiha, 1:2. Al has a lam with no vowel, then ha from the middle of the throat. At a stop, hamd is closed.\nAl-Ikhlas, 112:1. Qul is qaf from deep back, and lam with no vowel. At a stop, ahad has a light bounce on the d, with no extra vowel.\nDo not start a word from the vowel. The letter comes first.",
    "الفاتحة ٢: ألف لام ساكنة ثم حاء. وعند الوقف يُسكن الحمد.\nالإخلاص ١: قاف عميقة ولام ساكنة. وعلى الوقف في «أحد» قلقلة خفيفة بلا حركة زائدة.",
    "Al-Fatihah 1:2. Lam tanpa vokal, kemudian ha dari tengah halkum. Pada waqaf, hamd ditutup.\nAl-Ikhlas 112:1. Qaf dalam, lam tanpa vokal. Pada waqaf, dal pada ahad ada pantulan ringan.",
    "Fatiha 1:2. Lam sessizdir, sonra boğazın ortasından ha. Durunca hamd kapanır.\nİhlas 112:1. Derin qaf, sessiz lam. Durunca ahad'daki dal hafif kalkale alır.",
    "فاتحہ ۱:۲۔ لام ساکن، پھر حلق کے بیچ سے ح۔ وقف پر حمد بند ہوتا ہے۔\nاخلاص ۱۱۲:۱۔ گہری قاف، ساکن لام۔ وقف پر احد کی دال ہلکی قلقلہ۔",
  ),
  examples: [
    { ar: "الْحَمْدُ", read: "аль-хьамду — лям тихая, ح из горла", lat: "al-hamdu — a quiet lam, ha from the throat", where: "1:2" },
    { ar: "قُلْ", read: "къуль — къ глубокая, лям без гласного", lat: "qul — a deep qaf, lam with no vowel", where: "112:1" },
    { ar: "أَحَدٌ", read: "на остановке: ахьад — д с отскоком", lat: "at a stop: ahad — d with a bounce", where: "112:1" },
  ],
  mistakes: L(
    "Не тяни короткий гласный и не глотай шадду в «Аллах1». На отскоке не добавляй а, и или у.",
    "Do not stretch a short vowel, and do not swallow the shadda in Allah. Do not add a, i or u to the bounce.",
    "لا تمد الحركة القصيرة ولا تسقط شدة لفظ الجلالة. ولا تزد حركة على القلقلة.",
    "Jangan panjangkan vokal pendek dan jangan telan syaddah pada Allah. Jangan tambah vokal pada pantulan.",
    "Kısa harekeyi uzatma ve Allah lafzındaki şeddeyi yutma. Kalkaleye ses ekleme.",
    "مختصر حرکت کو نہ کھینچیں اور اللہ کی شدہ نہ نگلیں۔ قلقلہ پر حرکت نہ بڑھائیں۔",
  ),
  quiz: [
    Q(
      L("С чего начинается слово?", "What does a word start with?", "بم تبدأ الكلمة؟", "Kata bermula dengan apa?", "Kelime neyle başlar?", "لفظ کس سے شروع ہوتا ہے؟"),
      L("С буквы", "With the letter", "بالحرف", "Dengan huruf", "Harfle", "حرف سے"),
      L("С гласного", "With the vowel", "بالحركة", "Dengan vokal", "Harekeden", "حرکت سے"),
      L("С точки", "With the dot", "بالنقطة", "Dengan titik", "Noktayla", "نقطے سے"),
      0,
    ),
    Q(
      L("Что делать с «ахьад» на остановке?", "What happens to ahad at a stop?", "ماذا في «أحد» عند الوقف؟", "Apa pada ahad ketika waqaf?", "Durunca ahad'da ne olur?", "وقف پر احد میں کیا ہو؟"),
      L("Д с лёгким отскоком", "A light bounce on the d", "قلقلة خفيفة على الدال", "Pantulan ringan pada dal", "Dal üzerinde hafif kalkale", "دال پر ہلکی قلقلہ"),
      L("Добавить гласный у", "Add the vowel u", "تُزاد ضمة", "Tambah vokal u", "U sesi eklenir", "اُ بڑھاؤ"),
      L("Убрать д", "Drop the d", "تُحذف الدال", "Buang dal", "Dal düşer", "دال ہٹاؤ"),
      0,
    ),
    Q(
      L("Лям в «аль-хьамду» — какая?", "What is the lam in al-hamdu?", "كيف لام «الحمد»؟", "Bagaimana lam pada al-hamdu?", "El-hamdü'deki lam nasıldır?", "الحمد کی لام کیسی ہے؟"),
      L("Без гласного, ясно", "With no vowel, and clear", "ساكنة مظهرة", "Tanpa vokal, jelas", "Sessiz ve açık", "ساکن اور واضح"),
      L("Пропущена", "It is skipped", "محذوفة", "Digugurkan", "Atlanır", "چھوڑ دی جاتی ہے"),
      L("Всегда шесть мер", "Always six counts", "ست حركات دائمًا", "Sentiasa enam", "Hep altı miktar", "ہمیشہ چھ حرکت"),
      0,
    ),
  ],
};

const extra: Record<string, TajQuiz[]> = {
  what: [
    Q(L("Чей это риваят?", "Whose riwayah is this?", "رواية من هذه؟", "Riwayat siapa ini?", "Bu kimin rivayetidir?", "یہ کس کی روایت ہے؟"), L("Хафс от Асыма", "Hafs from Asim", "حفص عن عاصم", "Hafs dari Asim", "Hafs, Asım'dan", "حفص عن عاصم"), L("Любое чтение", "Any reading", "أي قراءة", "Sebarang bacaan", "Herhangi bir kıraat", "کوئی بھی قراءت"), L("Только перевод", "Only the translation", "الترجمة فقط", "Terjemahan sahaja", "Yalnızca meal", "صرف ترجمہ"), 0),
    Q(L("Что сказано в 73:4?", "What does 73:4 say?", "ماذا في ٧٣:٤؟", "Apa kata 73:4?", "73:4 ne der?", "۷۳:۴ میں کیا ہے؟"), L("Читай Коран размеренно", "Recite the Quran in a measured way", "رتّل القرآن", "Bacalah dengan tartil", "Kur'an'ı tertil ile oku", "قرآن کو ٹھہر ٹھہر کر پڑھو"), L("Пропускай буквы", "Skip the letters", "تجاوز الحروف", "Langkau huruf", "Harfleri atla", "حروف چھوڑ دو"), L("Читай только смысл", "Read only the meaning", "اقرأ المعنى فقط", "Baca makna sahaja", "Yalnızca manayı oku", "صرف معنی پڑھو"), 0),
  ],
  marks: [
    Q(L("Черта сверху — это?", "A stroke above is?", "الفتحة هي؟", "Garis di atas ialah?", "Üstteki çizgi nedir?", "اوپر لکیر کیا ہے؟"), L("Звук а", "The sound a", "فتحة", "Bunyi a", "A sesi", "ا کی آواز"), L("Без гласного", "No vowel", "سكون", "Tanpa vokal", "Sessiz", "بغیر حرکت"), L("Буква дважды", "The letter twice", "شدة", "Huruf dua kali", "Harf iki kez", "حرف دو بار"), 0),
    Q(L("Шадда значит?", "What does shadda mean?", "ما معنى الشدة؟", "Apa maksud syaddah?", "Şedde ne demektir?", "شدہ کا کیا مطلب ہے؟"), L("Буква дважды", "The letter twice", "الحرف مرتان", "Huruf dua kali", "Harf iki kez", "حرف دو بار"), L("Долгий а", "A long a", "مد", "Mad", "Med", "مد"), L("Остановка", "A stop", "وقف", "Waqaf", "Vakıf", "وقف"), 0),
  ],
  "ms-madd": [
    Q(L("Какие буквы тянут гласный?", "Which letters lengthen a vowel?", "ما حروف المد؟", "Huruf mad yang mana?", "Med harfleri hangileridir?", "مد کے حروف کون سے ہیں؟"), L("Алиф, вав, йа", "Alif, waw and ya", "الألف والواو والياء", "Alif, waw dan ya", "Elif, vav ve ya", "الف، واو اور یا"), L("Только нун", "Only nun", "النون فقط", "Nun sahaja", "Yalnızca nun", "صرف نون"), L("Только мим", "Only mim", "الميم فقط", "Mim sahaja", "Yalnızca mim", "صرف میم"), 0),
    Q(L("Сколько у обычной протяжки?", "How long is the ordinary lengthening?", "كم المد الطبيعي؟", "Berapa mad tabi'i?", "Tabii med kaçtır?", "مد طبیعی کتنی ہے؟"), L("Две меры", "Two counts", "حركتان", "Dua harakat", "İki miktar", "دو حرکت"), L("Шесть всегда", "Always six", "ست دائمًا", "Sentiasa enam", "Hep altı", "ہمیشہ چھ"), L("Одна", "One", "واحدة", "Satu", "Bir", "ایک"), 0),
  ],
  "ms-shadda": [
    Q(L("Как читать шадду?", "How is shadda read?", "كيف تُقرأ الشدة؟", "Bagaimana syaddah dibaca?", "Şedde nasıl okunur?", "شدہ کیسے پڑھی جاتی ہے؟"), L("Сначала без гласного, сразу с гласным", "First with no vowel, then at once with the vowel", "بلا حركة ثم بالحركة", "Tanpa vokal, terus dengan vokal", "Önce sessiz, hemen harekesiyle", "پہلے ساکن، پھر حرکت کے ساتھ"), L("Как одну слабую букву", "As one weak letter", "حرفًا ضعيفًا", "Satu huruf lemah", "Zayıf bir harf gibi", "ایک کمزور حرف"), L("Как долгий а", "As a long a", "كالمد", "Seperti mad", "Med gibi", "مد کی طرح"), 0),
    Q(L("Шадду можно пропустить?", "May a shadda be skipped?", "هل تُسقط الشدة؟", "Bolehkah syaddah digugurkan?", "Şedde atlanır mı?", "کیا شدہ چھوڑی جا سکتی ہے؟"), L("Нет", "No", "لا", "Tidak", "Hayır", "نہیں"), L("Да, если спешишь", "Yes, if you hurry", "نعم إن أسرعت", "Ya, jika tergesa", "Acele edersen evet", "جلدی میں ہاں"), L("Только в конце", "Only at the end", "في الآخر فقط", "Di hujung sahaja", "Yalnızca sonda", "صرف آخر میں"), 0),
  ],
  "ms-tanwin": [
    Q(L("Танвин — это звук?", "Tanwin is the sound of?", "التنوين صوت ماذا؟", "Tanwin bunyi apa?", "Tenvin hangi sestir?", "تنوین کس آواز کی ہے؟"), L("Н на конце", "An n at the end", "نون في الآخر", "N di hujung", "Sonda bir n", "آخر میں ن"), L("М всегда", "Always m", "ميم دائمًا", "M sentiasa", "Hep m", "ہمیشہ م"), L("Долгий у", "A long u", "واو مد", "U panjang", "Uzun u", "لمبی و"), 0),
    Q(L("Где пишется танвин?", "Where is tanwin written?", "أين يُكتب التنوين؟", "Di mana tanwin ditulis?", "Tenvin nerede yazılır?", "تنوین کہاں لکھی جاتی ہے؟"), L("На конце слова", "At the end of the word", "في آخر الكلمة", "Di hujung kata", "Kelimenin sonunda", "لفظ کے آخر میں"), L("В начале", "At the start", "في الأول", "Di awal", "Başta", "شروع میں"), L("На каждой букве", "On every letter", "على كل حرف", "Pada setiap huruf", "Her harfte", "ہر حرف پر"), 0),
  ],
  throat: [
    Q(L("Сколько букв из горла?", "How many letters come from the throat?", "كم حرفًا من الحلق؟", "Berapa huruf dari halkum?", "Boğazdan kaç harf çıkar?", "حلق سے کتنے حروف ہیں؟"), L("Шесть", "Six", "ستة", "Enam", "Altı", "چھ"), L("Две", "Two", "اثنان", "Dua", "İki", "دو"), L("Десять", "Ten", "عشرة", "Sepuluh", "On", "دس"), 0),
    Q(L("ع и ح выходят из?", "Ayn and ha come from?", "من أين العين والحاء؟", "Ain dan ha dari mana?", "Ayn ve ha nereden?", "ع اور ح کہاں سے؟"), L("Середины горла", "The middle of the throat", "وسط الحلق", "Tengah halkum", "Boğazın ortası", "حلق کے بیچ سے"), L("Губ", "The lips", "الشفتين", "Bibir", "Dudaklardan", "ہونٹوں سے"), L("Носа", "The nose", "الخيشوم", "Hidung", "Burundan", "ناک سے"), 0),
  ],
  tongue: [
    Q(L("Дад — это?", "Dad is?", "الضاد هي؟", "Dad ialah?", "Dad nedir?", "ض کیا ہے؟"), L("Край языка, не обычное д", "The side of the tongue, not an ordinary d", "حافة اللسان، ليست دالًا", "Tepi lidah, bukan d biasa", "Dil kenarı, sıradan d değil", "زبان کا کنارہ، عام د نہیں"), L("Губы", "The lips", "الشفتان", "Bibir", "Dudaklar", "ہونٹ"), L("Нос", "The nose", "الأنف", "Hidung", "Burun", "ناک"), 0),
    Q(L("Къ глубже, чем?", "Qaf is deeper than?", "القاف أعمق من؟", "Qaf lebih dalam daripada?", "Qaf neden daha derindir?", "ق کس سے گہری ہے؟"), L("К", "Kaf", "الكاف", "Kaf", "Kaf", "ک"), L("Б", "Ba", "الباء", "Ba", "Be", "ب"), L("М", "Mim", "الميم", "Mim", "Mim", "م"), 0),
  ],
  lips: [
    Q(L("Какие буквы с губ?", "Which letters are from the lips?", "ما حروف الشفتين؟", "Huruf bibir yang mana?", "Dudak harfleri hangileridir?", "ہونٹ کے حروف کون سے ہیں؟"), L("ب م و и ф", "Ba, mim, waw and fa", "ب م و ف", "Ba, mim, waw dan fa", "Be, mim, vav ve fe", "ب م و ف"), L("Только нун", "Only nun", "النون فقط", "Nun sahaja", "Yalnızca nun", "صرف نون"), L("Только къ", "Only qaf", "القاف فقط", "Qaf sahaja", "Yalnızca qaf", "صرف ق"), 0),
    Q(L("Носовой звук выходит из?", "The nasal sound comes from?", "الغنة من أين؟", "Ghunnah dari mana?", "Gunne nereden çıkar?", "غنہ کہاں سے نکلتی ہے؟"), L("Носа", "The nose", "الخيشوم", "Hidung", "Burundan", "ناک سے"), L("Края языка", "The side of the tongue", "حافة اللسان", "Tepi lidah", "Dil kenarından", "زبان کے کنارے سے"), L("Низа горла", "The bottom of the throat", "أقصى الحلق", "Pangkal halkum", "Boğazın altından", "حلق کے نیچے سے"), 0),
  ],
  pairs: [
    Q(L("Тяжёлая буква читается?", "A heavy letter is read?", "الحرف المفخم يُقرأ؟", "Huruf tebal dibaca?", "Kalın harf nasıl okunur?", "موٹا حرف کیسے پڑھا جاتا ہے؟"), L("Полным ртом", "With a full mouth", "بامتلاء الفم", "Dengan mulut penuh", "Ağız dolu olarak", "بھرے منہ سے"), L("Как шёпот", "Like a whisper", "كالهمس", "Seperti bisikan", "Fısıltı gibi", "سرگوشی کی طرح"), L("Без звука", "With no sound", "بلا صوت", "Tanpa bunyi", "Sessizce", "بغیر آواز"), 0),
    Q(L("Свойство с парой значит?", "A quality with an opposite means?", "الصفة ذات الضد تعني؟", "Sifat berlawanan maksudnya?", "Zıddı olan sıfat ne demektir?", "جوڑی والی صفت کا مطلب؟"), L("У него есть противоположность", "It has an opposite", "لها ضد", "Ada lawannya", "Bir zıddı vardır", "اس کی ضد ہے"), L("Его нельзя произнести", "It cannot be said", "لا تُنطق", "Tidak boleh disebut", "Söylenemez", "پڑھی نہیں جا سکتی"), L("Это знак остановки", "It is a stop sign", "علامة وقف", "Tanda waqaf", "Vakıf işareti", "وقف کا نشان"), 0),
  ],
  izhar: [
    Q(L("Изхар нуна — это?", "Izhar of nun is?", "إظهار النون هو؟", "Izhar nun ialah?", "Nun'un izharı nedir?", "نون کا اظہار کیا ہے؟"), L("Ясный н, без носового слияния", "A clear n, with no nasal merging", "نون واضحة بلا غنة إدغام", "N yang jelas, tanpa lebur", "Açık n, buruna karışmadan", "واضح ن، بغیر گھلنے کے"), L("Н превращается в м", "The n becomes m", "تقلب ميمًا", "N menjadi m", "N, m olur", "ن م بن جاتی ہے"), L("Н пропадает", "The n disappears", "تسقط", "N hilang", "N düşer", "ن ختم ہو جاتی ہے"), 0),
    Q(L("Перед какими буквами изхар?", "Izhar comes before which letters?", "الإظهار قبل أي حروف؟", "Izhar sebelum huruf mana?", "İzhar hangi harflerden önce?", "اظہار کن حروف سے پہلے؟"), L("Перед горловыми", "Before the throat letters", "قبل حروف الحلق", "Sebelum huruf halkum", "Boğaz harflerinden önce", "حلق کے حروف سے پہلے"), L("Перед ب م و", "Before ba, mim and waw", "قبل ب م و", "Sebelum ba mim waw", "Be, mim ve vavdan önce", "ب م و سے پہلے"), L("Перед всеми", "Before all of them", "قبل الجميع", "Sebelum semua", "Hepsinden önce", "سب سے پہلے"), 0),
  ],
  "idgham-nun": [
    Q(L("Идгам нуна значит?", "Idgham of nun means?", "إدغام النون يعني؟", "Idgham nun maksudnya?", "Nun'un idgamı ne demektir?", "نون کا ادغام کیا ہے؟"), L("Н входит в следующую букву", "The n enters the next letter", "تدخل النون في التالي", "N masuk ke huruf berikut", "N sonraki harfe girer", "ن اگلے حرف میں داخل ہوتی ہے"), L("Н всегда ясный", "The n is always clear", "واضحة دائمًا", "Sentiasa jelas", "Hep açık", "ہمیشہ واضح"), L("Н становится къ", "The n becomes qaf", "تصير قافًا", "N menjadi qaf", "N, qaf olur", "ن قاف بنتی ہے"), 0),
    Q(L("В «мин рабби» что слышно?", "In min rabbi, what is heard?", "ماذا يُسمع في «من رب»؟", "Apa kedengaran pada min rabbi?", "Min rabbi'de ne duyulur?", "من رب میں کیا سنائی دیتا ہے؟"), L("Н вошёл в р", "The n has entered the r", "أُدغمت في الراء", "N masuk ke ra", "N, ra'ya girdi", "ن ر میں داخل ہوئی"), L("Отдельное «нан»", "A separate nan", "نون منفصلة", "Nan yang terpisah", "Ayrı bir nan", "الگ نان"), L("Буква м", "The letter m", "ميم", "Huruf m", "M harfi", "حرف م"), 0),
  ],
  iqlab: [
    Q(L("Икляб бывает перед?", "Iqlab comes before?", "الإقلاب قبل ماذا؟", "Iqlab sebelum apa?", "İklab neden önce olur?", "اقلاب کس سے پہلے؟"), L("Только перед ب", "Only before ba", "قبل الباء فقط", "Hanya sebelum ba", "Yalnızca be'den önce", "صرف ب سے پہلے"), L("Перед всеми горловыми", "Before all throat letters", "قبل كل الحلق", "Sebelum semua halkum", "Bütün boğaz harflerinden önce", "تمام حلق سے پہلے"), L("Перед алифом", "Before alif", "قبل الألف", "Sebelum alif", "Eliften önce", "الف سے پہلے"), 0),
    Q(L("Нун при иклябе звучит как?", "At iqlab the nun sounds like?", "النون عند الإقلاب تُسمع؟", "Nun pada iqlab kedengaran?", "İklabda nun nasıl duyulur?", "اقلاب میں نون کیسی سنائی دیتی ہے؟"), L("Как м", "Like m", "كميم", "Seperti m", "M gibi", "م کی طرح"), L("Как къ", "Like qaf", "كقاف", "Seperti qaf", "Qaf gibi", "قاف کی طرح"), L("Никак", "Not at all", "لا تُسمع", "Tidak kedengaran", "Hiç duyulmaz", "بالکل نہیں"), 0),
  ],
  ikhfa: [
    Q(L("Ихфа — это?", "Ikhfa is?", "الإخفاء هو؟", "Ikhfa ialah?", "İhfa nedir?", "اخفاء کیا ہے؟"), L("Скрытый н, между ясным и слитым", "A hidden n, between clear and merged", "نون خفية بين الإظهار والإدغام", "N tersembunyi, antara jelas dan lebur", "Açık ile karışık arasında gizli n", "واضح اور ملے ہوئے کے بیچ چھپی ن"), L("Полное исчезновение буквы", "The letter vanishes", "سقوط الحرف", "Huruf hilang terus", "Harf tamamen düşer", "حرف بالکل ختم"), L("Замена на вав", "A change into waw", "قلب واو", "Bertukar jadi waw", "Vav olur", "واو بن جاتی ہے"), 0),
    Q(L("Сколько примерно букв ихфа нуна?", "About how many letters take ikhfa of nun?", "كم حرفًا لإخفاء النون تقريبًا؟", "Berapa huruf ikhfa nun?", "Nun'un ihfası kaç harftedir?", "نون کے اخفاء کے حروف کتنے ہیں؟"), L("Пятнадцать", "Fifteen", "خمسة عشر", "Lima belas", "On beş", "پندرہ"), L("Одна", "One", "واحد", "Satu", "Bir", "ایک"), L("Шесть", "Six", "ستة", "Enam", "Altı", "چھ"), 0),
  ],
  meem: [
    Q(L("Мим с сукуном перед ب — это?", "Meem with sukun before ba is?", "الميم الساكنة قبل الباء؟", "Mim sukun sebelum ba?", "Sükûnlu mim, be'den önce?", "ساکن میم ب سے پہلے؟"), L("Скрытый м, с гунной", "A hidden m, with ghunnah", "إخفاء شفوي بغنة", "M tersembunyi, dengan ghunnah", "Gizli m, gunneli", "چھپی م، غنہ کے ساتھ"), L("Изхар без всего", "Izhar with nothing", "إظهار بلا شيء", "Izhar tanpa apa-apa", "Düz izhar", "سادہ اظہار"), L("Буква удаляется", "The letter is removed", "تُحذف", "Dibuang", "Silinir", "ہٹا دی جاتی ہے"), 0),
    Q(L("Мим перед мимом — это?", "Meem before meem is?", "الميم قبل الميم؟", "Mim sebelum mim?", "Mimden önceki mim?", "میم سے پہلے میم؟"), L("Слияние с гунной", "Merging, with ghunnah", "إدغام بغنة", "Lebur dengan ghunnah", "Gunne ile idgam", "غنہ کے ساتھ ادغام"), L("Калькаля", "Qalqalah", "قلقلة", "Qalqalah", "Kalkale", "قلقلہ"), L("Долгий а", "A long a", "مد", "Mad", "Med", "مد"), 0),
  ],
  ghunnah: [
    Q(L("Сколько длится гунна?", "How long is ghunnah?", "كم الغنة؟", "Berapa lama ghunnah?", "Gunne ne kadardır?", "غنہ کتنی ہے؟"), L("Две меры", "Two counts", "حركتان", "Dua harakat", "İki miktar", "دو حرکت"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), L("Полмеры", "Half a count", "نصف حركة", "Setengah harakat", "Yarım miktar", "آدھی حرکت"), 0),
    Q(L("Гунна слышна через?", "Ghunnah is heard through?", "الغنة تُسمع من؟", "Ghunnah kedengaran dari?", "Gunne nereden duyulur?", "غنہ کہاں سے سنائی دیتی ہے؟"), L("Нос", "The nose", "الأنف", "Hidung", "Burun", "ناک"), L("Живот", "The stomach", "البطن", "Perut", "Karın", "پیٹ"), L("Только губы без носа", "The lips only, with no nose", "الشفتين بلا أنف", "Bibir sahaja, tanpa hidung", "Yalnızca dudak, burunsuz", "صرف ہونٹ، بغیر ناک"), 0),
  ],
  "madd-short": [
    Q(L("Протяжка в одном слове из-за хамзы — сколько в Хафсе?", "A lengthening in the same word because of hamza is how long in Hafs?", "مد الهمزة في الكلمة نفسها عند حفص؟", "Mad kerana hamzah dalam kata yang sama, dalam Hafs?", "Aynı kelimede hemze meddi Hafs'ta ne kadar?", "اسی لفظ میں ہمزے کی مد حفص میں کتنی؟"), L("Четыре или пять", "Four or five", "أربع أو خمس", "Empat atau lima", "Dört veya beş", "چار یا پانچ"), L("Всегда одна", "Always one", "واحدة دائمًا", "Sentiasa satu", "Hep bir", "ہمیشہ ایک"), L("Десять", "Ten", "عشر", "Sepuluh", "On", "دس"), 0),
    Q(L("В одном чтении меру?", "In one sitting, the count is?", "في المجلس الواحد المقدار؟", "Dalam satu bacaan, kadarnya?", "Bir oturuşta miktar?", "ایک نشست میں مقدار؟"), L("Держи одну выбранную", "Keep the one you chose", "الزم وجهًا واحدًا", "Pegang satu pilihan", "Seçtiğin birini tut", "ایک ہی اختیار رکھیں"), L("Меняй каждый аят", "Change it every ayah", "غيّره كل آية", "Tukar setiap ayat", "Her ayette değiştir", "ہر آیت میں بدلیں"), L("Не считай", "Do not count", "لا تعد", "Jangan hitung", "Sayma", "مت گنو"), 0),
  ],
  "madd-long": [
    Q(L("Какую протяжку нельзя укоротить?", "Which lengthening cannot be shortened?", "أي مد لا يُقصر؟", "Mad mana tidak boleh dipendekkan?", "Hangi med kısaltılamaz?", "کون سی مد چھوٹی نہیں ہوتی؟"), L("Обязательную на шесть", "The required one of six", "اللازم ستًّا", "Yang wajib enam", "Altılık lazım med", "لازمی چھ"), L("Обычную на две", "The ordinary one of two", "الطبيعي", "Yang biasa dua", "İkilik tabii med", "عام دو"), L("Любую", "Any of them", "أي مد", "Mana-mana", "Herhangi biri", "کوئی بھی"), 0),
    Q(L("В «алиф лам мим» тянутся?", "In Alif Lam Mim, what is lengthened?", "في «الم» ماذا يُمد؟", "Dalam alif lam mim, apa dipanjangkan?", "Elif Lâm Mîm'de ne uzar?", "الم میں کیا کھینچا جاتا ہے؟"), L("Лам и мим", "Lam and mim", "اللام والميم", "Lam dan mim", "Lam ve mim", "لام اور میم"), L("Только алиф", "Only the alif", "الألف فقط", "Alif sahaja", "Yalnızca elif", "صرف الف"), L("Ничего", "Nothing", "لا شيء", "Tiada", "Hiçbiri", "کچھ نہیں"), 0),
  ],
  heavy: [
    Q(L("Лям в имени Аллах1 после а или у?", "The lam in Allah after a or u?", "لام لفظ الجلالة بعد الفتح أو الضم؟", "Lam pada Allah selepas a atau u?", "Allah lafzındaki lam, a veya u'dan sonra?", "اللہ کی لام ا یا اُ کے بعد؟"), L("Твёрдая", "Heavy", "مغلظة", "Tebal", "Kalın", "موٹی"), L("Всегда мягкая", "Always light", "مرفقة دائمًا", "Sentiasa nipis", "Hep ince", "ہمیشہ پتلی"), L("Пропадает", "It disappears", "تسقط", "Hilang", "Düşer", "ختم"), 0),
    Q(L("Ра с фатхой обычно?", "Ra with a fat-ha is usually?", "الراء المفتوحة غالبًا؟", "Ra berfat-hah biasanya?", "Fethalı ra genellikle?", "فتحہ والی را عموماً؟"), L("Твёрдая", "Heavy", "مفخمة", "Tebal", "Kalın", "موٹی"), L("Всегда как й", "Always like ya", "كياء دائمًا", "Sentiasa seperti ya", "Hep ya gibi", "ہمیشہ یا کی طرح"), L("Без звука", "Silent", "بلا صوت", "Senyap", "Sessiz", "بغیر آواز"), 0),
  ],
  signs: [
    Q(L("Знак «м» над аятом значит?", "The mark mim over a place means?", "علامة «م» تعني؟", "Tanda mim maksudnya?", "Mim işareti ne demektir?", "نشان م کا مطلب؟"), L("Остановись", "Stop", "قف", "Berhenti", "Dur", "رکو"), L("Не останавливайся", "Do not stop", "لا تقف", "Jangan berhenti", "Durma", "مت رکو"), L("Повтори аят", "Repeat the ayah", "أعد الآية", "Ulang ayat", "Ayeti tekrarla", "آیت دہراؤ"), 0),
    Q(L("Знак «ля» значит?", "The mark la means?", "علامة «لا» تعني؟", "Tanda la maksudnya?", "Lâ işareti ne demektir?", "نشان لا کا مطلب؟"), L("Здесь не останавливайся", "Do not stop here", "لا تقف هنا", "Jangan berhenti di sini", "Burada durma", "یہاں مت رکو"), L("Обязательная остановка", "A required stop", "وقف لازم", "Waqaf wajib", "Zorunlu duruş", "لازمی وقف"), L("Конец суры", "The end of the surah", "نهاية السورة", "Hujung surah", "Surenin sonu", "سورۃ کا اختتام"), 0),
  ],
  "stop-start": [
    Q(L("На остановке танвин с а даёт?", "At a stop, tanwin with a gives?", "تنوين الفتح عند الوقف؟", "Tanwin a pada waqaf menjadi?", "Durunca fethalı tenvin ne verir?", "وقف پر فتح کا تنوین کیا دیتا ہے؟"), L("Алиф", "An alif", "ألفًا", "Alif", "Elif", "الف"), L("Нун вслух", "A spoken nun", "نونًا ظاهرة", "Nun yang disebut", "Sesli nun", "بولی جانے والی نون"), L("Мим", "A mim", "ميمًا", "Mim", "Mim", "میم"), 0),
    Q(L("Хамза соединения в начале чтения?", "The joining hamza at the start of reading?", "همزة الوصل عند الابتداء؟", "Hamzah wasal ketika memulai?", "Başlarken vasıl hemzesi?", "شروع میں ہمزہ وصل؟"), L("Произносится, чтобы начать", "It is pronounced, so you can start", "تُنطق للابتداء", "Disebut untuk memulai", "Başlamak için söylenir", "شروع کرنے کے لیے بولی جاتی ہے"), L("Никогда не читается", "It is never read", "لا تُقرأ أبدًا", "Tidak pernah dibaca", "Hiç okunmaz", "کبھی نہیں پڑھی جاتی"), L("Всегда шесть мер", "Always six counts", "ست دائمًا", "Sentiasa enam", "Hep altı", "ہمیشہ چھ"), 0),
  ],
  "ms-qalqala": [
    Q(L("Буквы калькаля?", "The qalqalah letters?", "حروف القلقلة؟", "Huruf qalqalah?", "Kalkale harfleri?", "قلقلہ کے حروف؟"), L("ق ط ب ج د", "Qaf, ta, ba, jim and dal", "ق ط ب ج د", "Qaf ta ba jim dal", "Qaf tı be cim dal", "ق ط ب ج د"), L("ا و ي", "Alif, waw and ya", "ا و ي", "Alif waw ya", "Elif vav ya", "ا و ي"), L("ث ذ ظ", "Tha, dhal and za", "ث ذ ظ", "Tsa dzal za", "Se zel zı", "ث ذ ظ"), 0),
    Q(L("На отскок добавляют гласный?", "Is a vowel added to the bounce?", "هل تُزاد حركة على القلقلة؟", "Adakah vokal ditambah pada pantulan?", "Kalkaleye hareke eklenir mi?", "کیا قلقلہ پر حرکت بڑھائی جاتی ہے؟"), L("Нет", "No", "لا", "Tidak", "Hayır", "نہیں"), L("Всегда а", "Always a", "فتحة دائمًا", "Sentiasa a", "Hep a", "ہمیشہ ا"), L("Всегда у", "Always u", "ضمة دائمًا", "Sentiasa u", "Hep u", "ہمیشہ اُ"), 0),
  ],
  hafs: [
    Q(L("Сакт у Хафса — это?", "Sakt in Hafs is?", "السكت عند حفص هو؟", "Sakt dalam Hafs ialah?", "Hafs'ta sekt nedir?", "حفص میں سکت کیا ہے؟"), L("Короткая остановка без дыхания", "A short stop without a breath", "وقف يسير بلا تنفس", "Hentian singkat tanpa nafas", "Nefessiz kısa duruş", "سانس لیے بغیر مختصر وقف"), L("Долгий выдох", "A long breath", "تنفس طويل", "Hembusan panjang", "Uzun nefes", "لمبا سانس"), L("Пропуск аята", "Skipping an ayah", "تجاوز الآية", "Melangkau ayat", "Ayeti atlamak", "آیت چھوڑنا"), 0),
    Q(L("Эти места читают как?", "These places are read as?", "هذه المواضع تُقرأ كما؟", "Tempat ini dibaca seperti?", "Bu yerler nasıl okunur?", "یہ جگہیں کیسے پڑھی جاتی ہیں؟"), L("Как в риваяте Хафса", "As in the riwayah of Hafs", "كرواية حفص", "Seperti riwayat Hafs", "Hafs rivayeti gibi", "روایت حفص کی طرح"), L("Как удобно", "However is easy", "كما يتيسر", "Ikut senang", "Kolayına göre", "جیسے آسان ہو"), L("Без этих правил", "Without these rules", "بلا هذه الأحكام", "Tanpa hukum ini", "Bu hükümler olmadan", "ان احکام کے بغیر"), 0),
  ],
};

export type PathModule = {
  id: string;
  title: L;
  badge: L;
  lessons: CourseLesson[];
};

export const TAJWEED_PATH: PathModule[] = [
  {
    id: "alpha",
    title: L("1. Буквы", "1. The letters", "١. الحروف", "1. Huruf", "1. Harfler", "١. حروف"),
    badge: L("Мастер букв", "Master of the letters", "متقن الحروف", "Penguasa huruf", "Harflerin ustası", "حروف کا ماہر"),
    lessons: [letters, forms, withQuiz("what", extra.what)],
  },
  {
    id: "vowels",
    title: L("2. Огласовки", "2. The vowels", "٢. الحركات", "2. Vokal", "2. Harekeler", "٢. حرکات"),
    badge: L("Знаток огласовок", "Master of the vowels", "متقن الحركات", "Penguasa vokal", "Harekelerin ustası", "حرکات کا ماہر"),
    lessons: [withQuiz("marks", extra.marks), withQuiz("ms-madd", extra["ms-madd"]), withQuiz("ms-shadda", extra["ms-shadda"]), withQuiz("ms-tanwin", extra["ms-tanwin"])],
  },
  {
    id: "makhraj",
    title: L("3. Место звука", "3. Where the sound is made", "٣. المخارج", "3. Makhraj", "3. Mahreç", "٣. مخارج"),
    badge: L("Мастер махариджа", "Master of the makhraj", "متقن المخارج", "Penguasa makhraj", "Mahreç ustası", "مخارج کا ماہر"),
    lessons: [withQuiz("throat", extra.throat), withQuiz("tongue", extra.tongue), withQuiz("lips", extra.lips), withQuiz("pairs", extra.pairs)],
  },
  {
    id: "nun",
    title: L("4. Нун, танвин и мим", "4. Nun, tanwin and meem", "٤. النون والتنوين والميم", "4. Nun, tanwin dan mim", "4. Nun, tenvin ve mim", "٤. نون، تنوین اور میم"),
    badge: L("Хранитель таджвида", "Keeper of tajweed", "حافظ التجويد", "Penjaga tajwid", "Tecvidin bekçisi", "تجوید کا محافظ"),
    lessons: [withQuiz("izhar", extra.izhar), withQuiz("idgham-nun", extra["idgham-nun"]), withQuiz("iqlab", extra.iqlab), withQuiz("ikhfa", extra.ikhfa), withQuiz("meem", extra.meem), withQuiz("ghunnah", extra.ghunnah)],
  },
  {
    id: "madd",
    title: L("5. Протяжка, ра и лям", "5. Lengthening, ra and lam", "٥. المد والراء واللام", "5. Mad, ra dan lam", "5. Med, ra ve lam", "٥. مد، را اور لام"),
    badge: L("Мастер протяжки", "Master of the lengthening", "متقن المد", "Penguasa mad", "Med ustası", "مد کا ماہر"),
    lessons: [withQuiz("madd-short", extra["madd-short"]), withQuiz("madd-long", extra["madd-long"]), withQuiz("heavy", extra.heavy)],
  },
  {
    id: "waqf",
    title: L("6. Остановка и короткие суры", "6. The stop, and the short surahs", "٦. الوقف والسور القصار", "6. Waqaf dan surah pendek", "6. Vakıf ve kısa sureler", "٦. وقف اور چھوٹی سورتیں"),
    badge: L("Читает Коран", "Reads the Quran", "قارئ", "Membaca Al-Qur'an", "Kur'an okur", "قرآن پڑھتا ہے"),
    lessons: [withQuiz("signs", extra.signs), withQuiz("stop-start", extra["stop-start"]), withQuiz("ms-qalqala", extra["ms-qalqala"]), withQuiz("hafs", extra.hafs), readShort],
  },
];

export const TAJWEED_PATH_FLAT: CourseLesson[] = TAJWEED_PATH.flatMap((mod) => mod.lessons);
