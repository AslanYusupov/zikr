import type { LangId } from "./types";

type L = Record<LangId, string>;

function L(ru: string, en: string, ar: string, id: string, tr: string, ur: string): L {
  return { ru, en, ar, id, tr, ur };
}

export type TajExample = { ar: string; read: string; lat: string; where: string };
export type TajQuiz = { q: L; choices: [L, L, L]; answer: 0 | 1 | 2 };

export type CourseLesson = {
  id: string;
  tone: "madd" | "ghunnah" | "qalqala" | "izhar" | "plain";
  title: L;
  definition: L;
  letters: string;
  mechanism: L;
  examples: TajExample[];
  mistakes: L;
  quiz: TajQuiz[];
};

export type CourseModule = { id: string; title: L; lessons: CourseLesson[] };

const A = (n: 0 | 1 | 2) => n;

export const TAJWEED_COURSE: CourseModule[] = [
  {
    id: "m1",
    title: L("1. Место буквы", "1. Where the letter is made", "١. المخرج", "1. Tempat huruf", "1. Mahreç", "١. مخرج"),
    lessons: [
      {
        id: "what",
        tone: "plain",
        title: L("Что такое таджвид", "What tajweed is", "ما التجويد", "Apa itu tajwid", "Tecvid nedir", "تجوید کیا ہے"),
        definition: L(
          "Таджвид — читать Коран так, как он ниспослан: каждую букву из своего места, с её свойством и мерой. Это риваят Хафса от Асыма, как в Мусхафе Медины.",
          "Tajweed is reciting the Quran as it was sent down: each letter from its place, with its quality and its length. This is the riwayah of Hafs from Asim, as in the Madinah mushaf.",
          "التجويد قراءة القرآن كما أُنزل: كل حرف من مخرجه بصفته ومقداره. وهذه رواية حفص عن عاصم كما في مصحف المدينة.",
          "Tajwid ialah membaca Al-Qur'an sebagaimana diturunkan: setiap huruf dari tempatnya, dengan sifat dan kadarnya. Ini riwayat Hafs dari Asim, seperti mushaf Madinah.",
          "Tecvid, Kur'an'ı indirildiği gibi okumaktır: her harf yerinden, sıfatı ve miktarıyla. Bu, Medine mushafındaki Hafs'ın Asım'dan rivayetidir.",
          "تجوید قرآن کو اسی طرح پڑھنا ہے جس طرح وہ نازل ہوا: ہر حرف اپنی جگہ سے، اپنی صفت اور مقدار کے ساتھ۔ یہ حفص عن عاصم ہے، جیسا کہ مصحف مدینہ میں ہے۔",
        ),
        letters: "—",
        mechanism: L(
          "Одна мера — время короткого а, как в «ба». Две меры — «баа». Сначала буква, потом гласный, потом слово. Аллах1 сказал: «и читай Коран размеренно» (73:4).",
          "One count is the time of a short a, as in ba. Two counts are baa. First the letter, then the vowel, then the word. Allah said: “And recite the Quran in a measured way” (73:4).",
          "الحركة مقدارها كـ«بَ»، والحركتان كـ«بَا». الحرف، ثم الحركة، ثم الكلمة. قال الله: «وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا» (73:4).",
          "Satu harakat ialah masa a yang pendek, seperti ba. Dua harakat ialah baa. Huruf, lalu vokal, lalu kata. Allah berfirman: “Dan bacalah Al-Qur'an dengan tartil” (73:4).",
          "Bir miktar kısa a kadardır, ba gibi. İki miktar baa'dır. Harf, sonra hareke, sonra kelime. Allah buyurdu: “Kur'an'ı tertil ile oku” (73:4).",
          "ایک حرکت چھوٹی ا جتنی ہے، جیسے بَ۔ دو حرکت بَا۔ پہلے حرف، پھر حرکت، پھر لفظ۔ اللہ نے فرمایا: «اور قرآن کو ٹھہر ٹھہر کر پڑھو» (73:4)۔",
        ),
        examples: [
          { ar: "بَ", read: "ба — одна мера", lat: "ba — one count", where: "мера" },
          { ar: "قَالَ", read: "къаля — а на две меры", lat: "qala — the a is two counts", where: "2:30" },
        ],
        mistakes: L(
          "Не глотай букву и не добавляй гласный там, где его нет. Не читай быстрее, чем успеваешь удержать место звука.",
          "Do not swallow a letter or add a vowel where there is none. Do not read faster than you can keep the place of the sound.",
          "لا تبتلع حرفًا ولا تزد حركة حيث لا حركة. لا تسرع أكثر مما يضبط به المخرج.",
          "Jangan telan huruf dan jangan tambah vokal di tempat yang tidak ada. Jangan lebih laju daripada tempat bunyi yang masih terjaga.",
          "Harfi yutma ve olmayan yere hareke ekleme. Sesin yerini tutamayacağın kadar hızlanma.",
          "حرف نہ نگلیں اور جہاں حرکت نہیں وہاں حرکت نہ بڑھائیں۔ آواز کی جگہ سنبھلنے سے زیادہ تیز نہ پڑھیں۔",
        ),
        quiz: [
          {
            q: L("Сколько длится одна мера?", "How long is one count?", "كم مقدار الحركة؟", "Berapa lama satu harakat?", "Bir miktar ne kadardır?", "ایک حرکت کتنی ہے؟"),
            choices: [
              L("Как короткое а в «ба»", "Like the short a in ba", "كـ«بَ»", "Seperti a pendek pada ba", "Ba'daki kısa a kadar", "بَ کی چھوٹی ا جتنی"),
              L("Всегда шесть", "Always six", "ست دائمًا", "Selalu enam", "Hep altı", "ہمیشہ چھ"),
              L("Сколько успеешь", "As long as you like", "كما تشاء", "Seberapa sempat", "Yetiştiğin kadar", "جتنا ہو سکے"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "throat",
        tone: "plain",
        title: L("Пустота рта и горло", "The mouth and the throat", "الجوف والحلق", "Rongga dan halkum", "Boşluk ve boğaz", "جوف اور حلق"),
        definition: L(
          "Долгие алиф, вав и йа выходят из пустоты рта. Шесть букв выходят из горла, по две из трёх мест.",
          "The long alif, waw and ya come from the empty space of the mouth. Six letters come from the throat, two from each of three places.",
          "ألف المد وواوه وياؤه من الجوف. وستة أحرف من الحلق، اثنان من كل موضع من ثلاثة.",
          "Alif, waw dan ya yang panjang keluar dari rongga mulut. Enam huruf keluar dari halkum, dua-dua dari tiga tempat.",
          "Uzun elif, vav ve ya ağız boşluğundan çıkar. Altı harf boğazdan çıkar, üç yerin her birinden ikişer.",
          "لمبی الف، واو اور یا منہ کی جگہ سے نکلتی ہیں۔ چھ حرف حلق سے، تین جگہوں میں سے ہر ایک سے دو۔",
        ),
        letters: "ا و ي · ء ه · ع ح · غ خ",
        mechanism: L(
          "Низ горла: хамза и ه. Середина: ع и ح. Верх, ближе ко рту: غ и خ. ح — тихий хь, не х. ع — сжатие, не хамза. خ — х, не خь.",
          "The bottom of the throat: hamza and ha. The middle: ayn and ha. The top, nearer the mouth: ghayn and kha. Ha is a soft h, not kh. Ayn is a squeeze, not a hamza. Kha is kh.",
          "أقصى الحلق: الهمزة والهاء. وسطه: العين والحاء. أدناه: الغين والخاء. الحاء ليست خاء، والعين ليست همزة.",
          "Pangkal halkum: hamzah dan ha. Tengah: ain dan ha. Hujung, dekat mulut: ghain dan kha. Ha bukan kh. Ain bukan hamzah.",
          "Boğazın en altı: hemze ve he. Ortası: ayn ve ha. Üstü, ağıza yakın: ğayn ve ha. Ha, kh değildir. Ayn hemze değildir.",
          "حلق کا نیچے: ہمزہ اور ہ۔ بیچ: ع اور ح۔ اوپر، منہ کے قریب: غ اور خ۔ ح خ نہیں۔ ع ہمزہ نہیں۔",
        ),
        examples: [
          { ar: "قَالَ", read: "къаля — долгий алиф", lat: "qala — a long alif", where: "2:30" },
          { ar: "أَنْعَمْتَ", read: "ан1амта — хамза и ع", lat: "an'amta — hamza and ayn", where: "1:7" },
          { ar: "الْحَمْدُ", read: "аль-хьамду — ح", lat: "al-hamdu — ha", where: "1:2" },
        ],
        mistakes: L(
          "Не подменяй ح на خ и ع на хамзу. Долгий гласный не бери из горла.",
          "Do not swap ha for kha, or ayn for hamza. Do not take a long vowel from the throat.",
          "لا تبدل الحاء خاءً ولا العين همزة. لا تخرج المد من الحلق.",
          "Jangan tukar ha dengan kha, atau ain dengan hamzah. Mad jangan diambil dari halkum.",
          "Ha'yı ha ile, ayn'ı hemze ile değiştirme. Uzatmayı boğazdan alma.",
          "ح کو خ اور ع کو ہمزہ نہ بنائیں۔ مد حلق سے نہ نکالیں۔",
        ),
        quiz: [
          {
            q: L("Откуда выходит ح?", "Where does ha come from?", "من أين تخرج الحاء؟", "Dari mana ha keluar?", "Ha nereden çıkar?", "ح کہاں سے نکلتی ہے؟"),
            choices: [
              L("Середина горла", "The middle of the throat", "وسط الحلق", "Tengah halkum", "Boğazın ortası", "حلق کا بیچ"),
              L("Губы", "The lips", "الشفتان", "Bibir", "Dudaklar", "ہونٹ"),
              L("Кончик языка", "The tip of the tongue", "طرف اللسان", "Hujung lidah", "Dil ucu", "زبان کی نوک"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "tongue",
        tone: "plain",
        title: L("Язык", "The tongue", "اللسان", "Lidah", "Dil", "زبان"),
        definition: L(
          "Большая часть букв выходит из языка. У къ, к, дж, ш, й, д, л, н, р и у зубных букв места рядом, но не одни.",
          "Most letters come from the tongue. Qaf, kaf, jim, shin, ya, dad, lam, nun, ra and the dental letters sit near each other, but not in the same place.",
          "أكثر الحروف من اللسان. القاف والكاف والجيم والشين والياء والضاد واللام والنون والراء وحروف الأسنان مواضعها متقاربة، وليست واحدة.",
          "Kebanyakan huruf keluar dari lidah. Qaf, kaf, jim, syin, ya, dad, lam, nun, ra dan huruf gigi berdekatan, tetapi bukan satu tempat.",
          "Harflerin çoğu dildendir. Qaf, kaf, cim, şin, ya, dad, lam, nun, ra ve diş harfleri yakındır, ama yerleri bir değildir.",
          "زیادہ حروف زبان سے ہیں۔ ق، ک، ج، ش، ی، ض، ل، ن، ر اور دانت والے حروف قریب ہیں، مگر ایک جگہ نہیں۔",
        ),
        letters: "ق ك · ج ش ي · ض · ل ن ر · ط د ت · ص س ز · ظ ذ ث",
        mechanism: L(
          "Къ глубже к. Дад — край языка, не твёрдая да. Лям, нун и ра — кончик, у каждой своя точка. ث ذ ظ — язык между зубами. ص س ز — щель и свист, сад твёрже.",
          "Qaf is deeper than kaf. Dad is the side of the tongue, not the heavy da. Lam, nun and ra are the tip, each at its own point. Tha, dhal and za are the tongue between the teeth. Sad, sin and zay are a gap and a whistle; sad is heavier.",
          "القاف أعمق من الكاف. الضاد من حافة اللسان، ليست طاء. اللام والنون والراء من الطرف، ولكل موضع. والثاء والذال والظاء من بين الأسنان. والصاد والسين والزاي بصفير، والصاد أغلظ.",
          "Qaf lebih dalam daripada kaf. Dad ialah tepi lidah, bukan ta yang berat. Lam, nun dan ra di hujung, masing-masing ada titiknya. Tsa, dzal dan za: lidah di antara gigi. Sad, sin dan zay bersiul; sad lebih tebal.",
          "Qaf, kaf'tan daha derindedir. Dad dil kenarıdır, kalın ta değildir. Lam, nun ve ra uçtadır, her birinin yeri ayrıdır. Se, zel ve zı dişler arasındadır. Sad, sin ve ze ıslıklıdır; sad daha kalındır.",
          "ق ک سے گہری ہے۔ ض زبان کا کنارہ ہے، بھاری ط نہیں۔ ل ن ر نوک پر ہیں، ہر ایک کی جگہ الگ۔ ث ذ ظ دانتوں کے بیچ۔ ص س ز سیٹی، ص موٹی۔",
        ),
        examples: [
          { ar: "قُلْ", read: "къуль — къ из глубины", lat: "qul — q from deep back", where: "112:1" },
          { ar: "الضَّالِّينَ", read: "ад-даллин — дад", lat: "ad-dallin — dad", where: "1:7" },
          { ar: "الثَّمَرَاتِ", read: "ас-самарати — са между зубами", lat: "ath-thamarat — tha between the teeth", where: "2:22" },
        ],
        mistakes: L(
          "Не делай дад обычным д и не дрожи ра. Къ не опускай на место к.",
          "Do not make dad an ordinary d, and do not trill the ra. Do not drop qaf down to the place of kaf.",
          "لا تجعل الضاد دالًا عادية ولا تكرر الراء. لا تنزل القاف إلى مخرج الكاف.",
          "Jangan jadikan dad sebagai d biasa, dan jangan getarkan ra. Jangan turunkan qaf ke tempat kaf.",
          "Dad'ı sıradan d yapma ve ra'yı titretme. Qaf'ı kaf'ın yerine indirme.",
          "ض کو عام د نہ بنائیں اور ر کو نہ ہلائیں۔ ق کو ک کی جگہ نہ لائیں۔",
        ),
        quiz: [
          {
            q: L("Где къ относительно к?", "Where is qaf compared with kaf?", "أين القاف من الكاف؟", "Di mana qaf dibanding kaf?", "Qaf, kaf'a göre nerede?", "ق ک سے کہاں ہے؟"),
            choices: [
              L("Глубже", "Deeper", "أعمق", "Lebih dalam", "Daha derin", "زیادہ گہری"),
              L("На губах", "On the lips", "على الشفتين", "Di bibir", "Dudakta", "ہونٹوں پر"),
              L("Между зубами", "Between the teeth", "بين الأسنان", "Antara gigi", "Dişler arasında", "دانتوں کے بیچ"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "lips",
        tone: "ghunnah",
        title: L("Губы и нос", "The lips and the nose", "الشفتان والخيشوم", "Bibir dan hidung", "Dudaklar ve burun", "ہونٹ اور ناک"),
        definition: L(
          "Фа — нижняя губа и верхние зубы. Ба, мим и вав — губы. Гунна н и м — нос.",
          "Fa is the lower lip and the upper teeth. Ba, mim and waw are the lips. The ghunnah of nun and mim is the nose.",
          "الفاء من باطن الشفة السفلى وأطراف الثنايا. والباء والميم والواو من الشفتين. وغنة النون والميم من الخيشوم.",
          "Fa ialah bibir bawah dan gigi atas. Ba, mim dan waw ialah bibir. Ghunnah nun dan mim ialah hidung.",
          "Fa alt dudak ve üst dişlerdir. Ba, mim ve vav dudaklardır. Nun ve mim'in gunnesi burundandır.",
          "ف نیچے کا ہونٹ اور اوپر کے دانت۔ ب م و ہونٹ۔ ن اور م کی غنہ ناک۔",
        ),
        letters: "ف · ب م و · نّ مّ",
        mechanism: L(
          "У вав губы круглые, не смыкаются до конца, как у ба. Гунна слышна в носу две меры, когда н или м с шаддой или когда правило её требует.",
          "For waw the lips are round and do not close fully, as they do for ba. Ghunnah is heard in the nose for two counts when nun or mim has shadda, or when a rule requires it.",
          "في الواو الشفتان مستديرتان ولا تنطبقان كانطباق الباء. والغنة تُسمع من الأنف حركتين في النون والميم المشددتين أو حيث يوجبها الحكم.",
          "Pada waw bibir membulat dan tidak rapat seperti ba. Ghunnah kedengaran di hidung dua harakat pada nun atau mim bersyaddah, atau bila hukum menuntutnya.",
          "Vavda dudaklar yuvarlaktır, ba gibi tam kapanmaz. Gunne, şeddeli nun veya mimde ya da hüküm istediğinde burunda iki miktar duyulur.",
          "و میں ہونٹ گول ہوتے ہیں، ب کی طرح پوری طرح نہیں ملتے۔ غنہ ن یا م پر شدہ ہو یا حکم مانگے تو ناک میں دو حرکت سنائی دیتی ہے۔",
        ),
        examples: [
          { ar: "فِيهَا", read: "фиха — ф", lat: "fiha — fa", where: "2:25" },
          { ar: "إِنَّ", read: "инна — гунна", lat: "inna — ghunnah", where: "2:6" },
          { ar: "ثُمَّ", read: "сумма — гунна", lat: "thumma — ghunnah", where: "2:28" },
        ],
        mistakes: L(
          "Не закрывай губы на вав так, будто это ба. Гунну не удлиняй больше двух мер и не убирай её у н и м с шаддой.",
          "Do not close the lips on waw as if it were ba. Do not hold ghunnah longer than two counts, and do not drop it from nun and mim with shadda.",
          "لا تطبق الشفتين على الواو كالباء. لا تزد الغنة على حركتين ولا تحذفها من النون والميم المشددتين.",
          "Jangan rapatkan bibir pada waw seolah ba. Jangan panjangkan ghunnah lebih daripada dua, dan jangan buang pada nun dan mim bersyaddah.",
          "Vavda dudakları ba gibi kapatma. Gunneyi iki miktardan fazla tutma ve şeddeli nun ile mimden düşürme.",
          "و پر ہونٹ ب کی طرح نہ بند کریں۔ غنہ کو دو سے زیادہ نہ کھینچیں اور شدہ والی ن اور م سے نہ ہٹائیں۔",
        ),
        quiz: [
          {
            q: L("Откуда гунна?", "Where does ghunnah come from?", "من أين الغنة؟", "Dari mana ghunnah?", "Gunne nereden?", "غنہ کہاں سے؟"),
            choices: [
              L("Из носа", "From the nose", "من الخيشوم", "Dari hidung", "Burundan", "ناک سے"),
              L("Из горла", "From the throat", "من الحلق", "Dari halkum", "Boğazdan", "حلق سے"),
              L("Из края языка", "From the side of the tongue", "من حافة اللسان", "Dari tepi lidah", "Dil kenarından", "زبان کے کنارے سے"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m2",
    title: L("2. Свойства букв", "2. The qualities", "٢. الصفات", "2. Sifat", "2. Sıfatlar", "٢. صفات"),
    lessons: [
      {
        id: "pairs",
        tone: "plain",
        title: L("Свойства с парой", "Qualities that have an opposite", "صفات لها ضد", "Sifat yang berlawanan", "Zıddı olan sıfatlar", "جوڑی والی صفتیں"),
        definition: L(
          "Свойство отличает буквы одного места. Здесь только пары, которые меняют чтение.",
          "A quality is what separates letters of one place. Here are only the pairs that change the reading.",
          "الصفة تميز حروف المخرج الواحد. هنا الأزواج التي تغير القراءة فقط.",
          "Sifat membezakan huruf satu tempat. Di sini hanya pasangan yang mengubah bacaan.",
          "Sıfat, aynı yerdeki harfleri ayırır. Burada yalnız okuyuşu değiştiren çiftler var.",
          "صفت ایک جگہ کے حروف کو الگ کرتی ہے۔ یہاں صرف وہ جوڑیاں ہیں جو قراءت بدلتی ہیں۔",
        ),
        letters: "همس/جهر · شدة/رخاوة · استعلاء/استفال · إطباق/انفتاح",
        mechanism: L(
          "Шёпот, воздух идёт: ف ح ث ه ش خ ص س ك ت. Смычка, звук собран: ء ج د ق ط ب ك ت. Между ними, звук идёт не до конца: ل ن ع م ر. Всегда толще: خ ص ض غ ط ق ظ. Ещё закрытее: ص ض ط ظ. Остальные тонкие, пока отдельное правило не утолщит ра или лям.",
          "A whisper, the breath continues: fa, ha, tha, ha, shin, kha, sad, sin, kaf, ta. A stop, the sound is held shut: hamza, jim, dal, qaf, ta, ba, kaf, ta. Between them, the sound neither stops nor runs free: lam, nun, ayn, mim, ra. Always heavy: kha, sad, dad, ghayn, ta, qaf, za. More closed still: sad, dad, ta, za. The rest are light, unless a separate rule thickens ra or lam.",
          "الهمس يجري فيه النفس: ف ح ث ه ش خ ص س ك ت. والشدة ينحبس فيها الصوت: ء ج د ق ط ب ك ت. وبينهما توسط، لا ينحبس الصوت ولا يجري تمامًا: ل ن ع م ر. الاستعلاء دائمًا أغلظ: خ ص ض غ ط ق ظ. والإطباق أشد إغلاقًا: ص ض ط ظ. وسائر الحروف مستفلة حتى يفخّم حكمٌ الراء أو اللام.",
          "Hams, napas berjalan: fa ha tsa ha syin kha sad sin kaf ta. Syaddah, bunyi tertahan: hamzah jim dal qaf ta ba kaf ta. Antaranya, bunyi tidak tertahan dan tidak bebas: lam nun ain mim ra. Sentiasa tebal: kha sad dad ghain ta qaf za. Lebih tertutup: sad dad ta za. Yang lain nipis, kecuali hukum menebalkan ra atau lam.",
          "Hems, nefes gider: fe ha se he şin ha sad sin kef te. Şiddet, ses tutulur: hemze cim dal kaf tı be kef te. İkisinin arası, ses ne kapanır ne serbest akar: lam nun ayn mim ra. Hep kalın: ha sad dad ğayn tı kaf zı. Daha kapalı: sad dad tı zı. Diğerleri incedir, ta ki bir hüküm ra veya lamı kalınlaştırana kadar.",
          "ہمس، سانس جاتا ہے: ف ح ث ه ش خ ص س ك ت۔ شدت، آواز رکتی ہے: ء ج د ق ط ب ك ت۔ ان کے بیچ، آواز نہ رکتی ہے نہ پوری چلتی: ل ن ع م ر۔ ہمیشہ موٹے: خ ص ض غ ط ق ظ۔ اور بند: ص ض ط ظ۔ باقی پتلے، جب تک الگ حکم ر یا ل کو موٹا نہ کرے۔",
        ),
        examples: [
          { ar: "صِرَاطَ", read: "сырата — сад твёрдый", lat: "sirata — sad is heavy", where: "1:6" },
          { ar: "كَتَبَ", read: "катаба — к тонкий", lat: "kataba — kaf is light", where: "2:79" },
        ],
        mistakes: L(
          "Не делай все горловые твёрдыми. Твёрдые всегда только семь: خ ص ض غ ط ق ظ.",
          "Do not make every throat letter heavy. Only seven are always heavy: kha, sad, dad, ghayn, ta, qaf and za.",
          "لا تفخم كل حروف الحلق. الغليظة دائمًا سبع: خ ص ض غ ط ق ظ.",
          "Jangan tebalkan semua huruf halkum. Yang sentiasa tebal hanya tujuh: kha sad dad ghain ta qaf za.",
          "Her boğaz harfini kalın okuma. Hep kalın olan yedi tanedir: ha sad dad ğayn tı kaf zı.",
          "ہر حلق والے حرف کو موٹا نہ کریں۔ ہمیشہ موٹے صرف سات ہیں: خ ص ض غ ط ق ظ۔",
        ),
        quiz: [
          {
            q: L("Какая буква всегда твёрдая?", "Which letter is always heavy?", "أي حرف دائم التفخيم؟", "Huruf mana yang sentiasa tebal?", "Hangi harf hep kalındır?", "کون سا حرف ہمیشہ موٹا ہے؟"),
            choices: [
              L("ص", "sad", "ص", "sad", "sad", "ص"),
              L("س", "sin", "س", "sin", "sin", "س"),
              L("ح", "ha", "ح", "ha", "ha", "ح"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "solo",
        tone: "qalqala",
        title: L("Свойства без пары", "Qualities without an opposite", "صفات لا ضد لها", "Sifat tanpa lawan", "Zıddı olmayan sıfatlar", "بغیر جوڑی کی صفتیں"),
        definition: L(
          "Эти свойства не делят алфавит пополам. Они есть только у своих букв.",
          "These qualities do not split the alphabet in two. They belong only to their own letters.",
          "هذه الصفات لا تقسم الحروف قسمين. هي لحروفها فقط.",
          "Sifat ini tidak membahagi huruf dua. Ia hanya pada hurufnya sendiri.",
          "Bu sıfatlar alfabeyi ikiye bölmez. Yalnız kendi harflerindedir.",
          "یہ صفتیں حروف کو دو حصوں میں نہیں بانٹتیں۔ صرف اپنے حروف پر ہیں۔",
        ),
        letters: "ق ط ب ج د · ص س ز · و ي · ل ر · ش · ض",
        mechanism: L(
          "Отскок — короткий толчок, не гласный: къ, твёрдая та, б, дж, д, если нет гласного или ты на них остановился. Свист: сад, син, зайн. Мягкость: вав и йа без гласного после а, их не тянут, пока не остановился. Шин расходится по языку. Дад тянется вдоль края языка. Ра ударяет один раз, без дрожи.",
          "The echo is a short push, not a vowel: qaf, the heavy ta, ba, jim and dal, when they have no vowel or you stop on them. A whistle: sad, sin, zay. Softness: a vowelless waw or ya after a; they are not held until you stop. Shin spreads across the tongue. Dad runs along the side of the tongue. Ra taps once, without a trill.",
          "القلقلة دفعة قصيرة ليست حركة: ق ط ب ج د إذا سكنت أو وقفت عليها. والصفير: ص س ز. واللين: واو وياء ساكنتان بعد فتح، ولا تُمدان إلا عند الوقف. والشين تتفشى. والضاد تستطيل. والراء تُقر مرة بلا تكرار.",
          "Pantulan ialah tolakan pendek, bukan vokal: qaf, ta berat, ba, jim dan dal, bila sukun atau anda berhenti. Siul: sad, sin, zay. Lunak: waw dan ya sukun selepas a; jangan dipanjangkan kecuali ketika berhenti. Syin tersebar. Dad memanjang di tepi lidah. Ra diketuk sekali, tanpa getar.",
          "Sekme kısa bir itiştir, hareke değildir: kaf, kalın tı, be, cim ve dal, sükûnlularsa veya üzerlerinde durursan. Islık: sad, sin, ze. Yumuşaklık: a'dan sonra sükûnlu vav ve ya; durmadan uzatılmaz. Şin yayılır. Dad dil kenarında uzar. Ra bir kez vurur, titretilmez.",
          "پلٹ چھوٹا دھکا ہے، حرکت نہیں: ق ط ب ج د، جب ساکن ہوں یا آپ رکیں۔ سیٹی: ص س ز۔ نرمی: ا کے بعد ساکن و اور ی؛ جب تک نہ رکیں نہ کھینچیں۔ ش پھیلتی ہے۔ ض کنارے پر لمبی ہوتی ہے۔ ر ایک بار لگتی ہے، بغیر کپکپاہٹ۔",
        ),
        examples: [
          { ar: "قَدْ أَفْلَحَ", read: "къад афляхьа — отскок на д", lat: "qad aflaha — echo on dal", where: "23:1" },
          { ar: "خَوْفٌ", read: "хауфун — вав мягкий, не тяни", lat: "khawfun — a soft waw, do not hold it", where: "2:38" },
          { ar: "الصِّرَاطَ", read: "ас-сырата — свист сада", lat: "as-sirata — the whistle of sad", where: "1:6" },
        ],
        mistakes: L(
          "Отскок не превращай в гласный «а» или «и». Ра не кати несколько раз.",
          "Do not turn the echo into a vowel a or i. Do not roll the ra several times.",
          "لا تجعل القلقلة فتحة أو كسرة. لا تكرر الراء مرات.",
          "Jangan jadikan pantulan vokal a atau i. Jangan gulingkan ra berkali-kali.",
          "Sekmeyi a veya i harekesine çevirme. Ra'yı birkaç kez yuvarlama.",
          "پلٹ کو ا یا اِ کی حرکت نہ بنائیں۔ ر کو کئی بار نہ گھمائیں۔",
        ),
        quiz: [
          {
            q: L("У каких букв отскок?", "Which letters have the echo?", "ما حروف القلقلة؟", "Huruf pantulan yang mana?", "Sekme hangi harflerde?", "پلٹ کن حروف پر ہے؟"),
            choices: [
              L("ق ط ب ج د", "qaf ta ba jim dal", "ق ط ب ج د", "qaf ta ba jim dal", "kaf tı be cim dal", "ق ط ب ج د"),
              L("ص س ز", "sad sin zay", "ص س ز", "sad sin zay", "sad sin ze", "ص س ز"),
              L("خ ص ض", "kha sad dad", "خ ص ض", "kha sad dad", "ha sad dad", "خ ص ض"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "heavy",
        tone: "plain",
        title: L("Ра и лям в Аллах1", "Ra, and the lam of Allah", "الراء ولام الله", "Ra dan lam Allah", "Ra ve Allah'ın lamı", "را اور اللہ کی لام"),
        definition: L(
          "Семь букв толстые всегда. Ра и лям в имени Аллах1 бывают толстыми или тонкими по гласному рядом.",
          "Seven letters are always heavy. Ra, and the lam in the name of Allah, are heavy or light according to the vowel beside them.",
          "سبعة أحرف مفخمة دائمًا. والراء ولام لفظ الجلالة تفخمان أو ترققان بحسب الحركة المجاورة.",
          "Tujuh huruf sentiasa tebal. Ra dan lam pada nama Allah tebal atau nipis mengikut vokal di sebelahnya.",
          "Yedi harf hep kalındır. Ra ve Allah lafzındaki lam, yanındaki harekeye göre kalın ya da incedir.",
          "سات حرف ہمیشہ موٹے ہیں۔ را اور اللہ کے نام کی لام ساتھ کی حرکت کے حساب سے موٹی یا پتلی ہوتی ہے۔",
        ),
        letters: "ر · ل",
        mechanism: L(
          "Ра с а и у — толще, с и — тоньше. Если на ра нет гласного, смотри гласный перед ней. Короткий и в самом начале слова её не утоньшает. Твёрдая буква сразу после неё в том же слове делает её толстой. На остановке после и или после й без гласного она тонкая. Лям в «Аллах1» толще после а и у и тоньше после и.",
          "Ra with a and u is heavier, with i it is lighter. If ra has no vowel, look at the vowel before it. A short i at the very start of the word does not make it light. A heavy letter right after it in the same word makes it heavy. When you stop after i, or after a vowelless ya, it is light. The lam in Allah is heavier after a and u, and lighter after i.",
          "الراء مع الفتح والضم أغلظ، ومع الكسر أدق. فإن سكنت فانظر إلى ما قبلها. وكسرة الابتداء لا ترققها، وحرف الاستعلاء بعدها في كلمتها يفخمها. وعند الوقف بعد الكسر أو الياء الساكنة ترقق. ولام «الله» أغلظ بعد الفتح والضم وأدق بعد الكسر.",
          "Ra dengan a dan u lebih tebal, dengan i lebih nipis. Jika ra sukun, lihat vokal sebelumnya. I pendek di awal kata tidak menipiskannya. Huruf tebal terus selepasnya dalam kata yang sama menebalkannya. Berhenti selepas i atau ya sukun: nipis. Lam pada Allah lebih tebal selepas a dan u, lebih nipis selepas i.",
          "Ra a ve u ile kalın, i ile incedir. Ra sükûnluysa öncesine bak. Kelime başındaki kısa i onu inceltmez. Aynı kelimede hemen sonraki kalın harf onu kalınlaştırır. İ'den veya sessiz ya'dan sonra durunca incedir. Allah'taki lam a ve u'dan sonra kalın, i'den sonra incedir.",
          "را ا اور اُ کے ساتھ موٹی، اِ کے ساتھ پتلی۔ را ساکن ہو تو پہلے والی حرکت دیکھیں۔ لفظ کے شروع کی چھوٹی اِ اسے پتلا نہیں کرتی۔ اسی لفظ میں فوراً بعد بھارا حرف اسے موٹا کرتا ہے۔ اِ یا ساکن ی کے بعد رکیں تو پتلی۔ اللہ کی لام ا اور اُ کے بعد موٹی، اِ کے بعد پتلی۔",
        ),
        examples: [
          { ar: "رَبِّ", read: "рабби — ра твёрдая", lat: "rabbi — ra is heavy", where: "1:2" },
          { ar: "فِرْعَوْنَ", read: "фир1авна — ра мягкая", lat: "fir'awna — ra is light", where: "20:24" },
          { ar: "قِرْطَاسٍ", read: "къиртасин — ра твёрдая", lat: "qirtasin — ra is heavy", where: "6:7" },
          { ar: "اللَّهُ", read: "Аллах1у — лям твёрдый", lat: "Allahu — the lam is heavy", where: "1:1" },
          { ar: "بِاللَّهِ", read: "биллах1и — лям мягкий", lat: "billahi — the lam is light", where: "2:8" },
        ],
        mistakes: L(
          "Не делай лям в «Аллах1» всегда толстым. После и он тонкий.",
          "Do not make the lam in Allah always heavy. After i it is light.",
          "لا تفخم لام «الله» دائمًا. بعد الكسر هي مرققة.",
          "Jangan tebalkan lam pada Allah selalu. Selepas i ia nipis.",
          "Allah'taki lamı hep kalın okuma. İ'den sonra incedir.",
          "اللہ کی لام کو ہمیشہ موٹا نہ کریں۔ اِ کے بعد وہ پتلی ہے۔",
        ),
        quiz: [
          {
            q: L("Какая лям в «биллах1и»?", "How is the lam in billahi?", "كيف لام «بالله»؟", "Bagaimana lam pada billahi?", "Billahi'deki lam nasıl?", "باللہ میں لام کیسی ہے؟"),
            choices: [
              L("Тонкая", "Light", "مرققة", "Nipis", "İnce", "پتلی"),
              L("Всегда толстая", "Always heavy", "مفخمة دائمًا", "Sentiasa tebal", "Hep kalın", "ہمیشہ موٹی"),
              L("Её нет", "It is silent", "لا تُنطق", "Tidak disebut", "Okunmaz", "پڑھی نہیں جاتی"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m3",
    title: L("3. Нун и танвин", "3. Nun and tanwin", "٣. النون والتنوين", "3. Nun dan tanwin", "3. Nun ve tenvin", "٣. نون اور تنوین"),
    lessons: [
      {
        id: "izhar",
        tone: "izhar",
        title: L("Изхар — ясно", "Izhar — clear", "الإظهار", "Izhar — jelas", "İzhar — açık", "اظہار — واضح"),
        definition: L(
          "Нун без гласного и танвин читаются ясно, если сразу после них горловая буква.",
          "A vowelless nun and tanwin are read clearly when a throat letter comes right after them.",
          "تُظهر النون الساكنة والتنوين إذا وليهما حرف حلق.",
          "Nun sukun dan tanwin dibaca jelas bila huruf halkum terus menyusul.",
          "Sükûnlu nun ve tenvin, hemen ardından boğaz harfi gelirse açık okunur.",
          "نون ساکن اور تنوین واضح پڑھی جاتی ہیں جب فوراً بعد حلق کا حرف ہو۔",
        ),
        letters: "ء ه ع ح غ خ",
        mechanism: L(
          "Н слышен полностью, из кончика языка. Гунну здесь не держи. Танвин — это тот же н на конце слова.",
          "The n is heard fully, from the tip of the tongue. Do not hold a ghunnah here. Tanwin is the same n at the end of a word.",
          "تُسمع النون كاملة من طرف اللسان. لا تُثبت غنة هنا. والتنوين نون في آخر الكلمة.",
          "N kedengaran penuh, dari hujung lidah. Jangan tahan ghunnah di sini. Tanwin ialah n yang sama di hujung kata.",
          "N dil ucundan tam duyulur. Burada gunne tutma. Tenvin kelime sonundaki aynı n'dir.",
          "ن زبان کی نوک سے پوری سنائی دے۔ یہاں غنہ نہ روکیں۔ تنوین لفظ کے آخر کا وہی ن ہے۔",
        ),
        examples: [
          { ar: "أَنْعَمْتَ", read: "ан1амта — н ясен", lat: "an'amta — the n is clear", where: "1:7" },
          { ar: "مِنْ هَادٍ", read: "мин хадин — н ясен", lat: "min hadin — the n is clear", where: "13:33" },
          { ar: "عَذَابٌ أَلِيمٌ", read: "1азабун алимун — н между словами ясен", lat: "adhabun alimun — the n between the words is clear", where: "2:10" },
        ],
        mistakes: L(
          "Не прячь н в нос перед этими шестью. Не вставляй гласный между н и следующей буквой.",
          "Do not hide the n in the nose before these six. Do not insert a vowel between the n and the next letter.",
          "لا تخفِ النون في الأنف قبل هذه الستة. لا تدخل حركة بين النون والحرف الذي يليها.",
          "Jangan sembunyikan n di hidung sebelum enam ini. Jangan selitkan vokal antara n dan huruf berikut.",
          "Bu altısından önce n'yi burunda gizleme. N ile sonraki harfin arasına hareke sokma.",
          "ان چھ سے پہلے ن کو ناک میں نہ چھپائیں۔ ن اور اگلے حرف کے بیچ حرکت نہ ڈالیں۔",
        ),
        quiz: [
          {
            q: L("Что с н в «ан1амта»?", "What happens to the n in an'amta?", "ما شأن النون في «أنعمت»؟", "Apa pada n dalam an'amta?", "An'amta'daki n ne olur?", "انْعَمْتَ میں ن کا کیا ہوتا ہے؟"),
            choices: [
              L("Слышен ясно", "It is clearly heard", "تُظهر", "Jelas", "Açık duyulur", "واضح سنائی دیتی ہے"),
              L("Уходит в нос", "It goes into the nose", "تُخفى", "Masuk ke hidung", "Buruna gizlenir", "ناک میں چلی جاتی ہے"),
              L("Становится м", "It becomes m", "تُقلب ميمًا", "Menjadi m", "M olur", "م بن جاتی ہے"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "idgham-nun",
        tone: "ghunnah",
        title: L("Идгам нуна", "Idgham of nun", "إدغام النون", "Idgham nun", "Nun'un idgamı", "نون کا ادغام"),
        definition: L(
          "Нун без гласного и танвин входят в следующую букву, если это й, н, м, в, л или р. В одном слове не входят.",
          "A vowelless nun and tanwin enter the next letter when it is ya, nun, mim, waw, lam or ra. They do not enter it inside one word.",
          "تُدغم النون الساكنة والتنوين في الذي يليهما إذا كان ياءً أو نونًا أو ميمًا أو واوًا أو لامًا أو راءً. وفي الكلمة الواحدة لا تُدغمان.",
          "Nun sukun dan tanwin masuk ke huruf berikut bila ia ya, nun, mim, waw, lam atau ra. Dalam satu kata tidak masuk.",
          "Sükûnlu nun ve tenvin, sonraki harf ya, nun, mim, vav, lam veya ra ise ona girer. Tek kelimede girmez.",
          "نون ساکن اور تنوین اگلے حرف میں داخل ہوتے ہیں جب وہ ی، ن، م، و، ل یا ر ہو۔ ایک لفظ کے اندر داخل نہیں ہوتے۔",
        ),
        letters: "ي ن م و · ل ر",
        mechanism: L(
          "В й, н, м и в вход с гунной, две меры. В л и р вход полный, без гунны. Четыре слова не сливаются: الدُّنْيَا، بُنْيَان، قِنْوَان، صِنْوَان. Там н остаётся ясным.",
          "Into ya, nun, mim and waw the entry is with ghunnah, two counts. Into lam and ra the entry is complete, without ghunnah. Four words do not merge: ad-dunya, bunyan, qinwan, sinwan. There the n stays clear.",
          "في ي ن م و الإدغام بغنة حركتين. وفي ل ر الإدغام كامل بلا غنة. وأربع كلمات لا تُدغم: الدنيا وبنيان وقنوان وصنوان. النون فيها مظهرة.",
          "Ke ya, nun, mim dan waw masuk dengan ghunnah, dua harakat. Ke lam dan ra masuk penuh, tanpa ghunnah. Empat kata tidak lebur: ad-dunya, bunyan, qinwan, sinwan. Di situ n kekal jelas.",
          "Ya, nun, mim ve vav'a giriş gunneyle, iki miktar. Lam ve ra'ya giriş tamdır, gunnesiz. Dört kelime kaynaşmaz: ed-dünya, bünyan, kınvan, sınvan. Orada n açık kalır.",
          "ی ن م و میں داخل ہونا غنہ کے ساتھ، دو حرکت۔ ل ر میں پورا داخل ہونا، بغیر غنہ۔ چار لفظ نہیں ملتے: الدنیا، بنیان، قنوان، صنوان۔ وہاں ن واضح رہتی ہے۔",
        ),
        examples: [
          { ar: "مَن يَقُولُ", read: "май-йакъулю — с гунной", lat: "may-yaqulu — with ghunnah", where: "2:8" },
          { ar: "مِن رَّبِّهِمْ", read: "мир-раббихим — без гунны", lat: "mir-rabbihim — without ghunnah", where: "2:5" },
          { ar: "الدُّنْيَا", read: "ад-дунья — н остаётся", lat: "ad-dunya — the n stays", where: "2:86" },
        ],
        mistakes: L(
          "Не оставляй ясный н перед й, н, м, в, л и р между словами. И не сливай н в «ад-дунья».",
          "Do not leave a clear n before ya, nun, mim, waw, lam and ra between words. And do not merge the n in ad-dunya.",
          "لا تبقِ النون مظهرة قبل ي ن م و ل ر بين كلمتين. ولا تدغم نون «الدنيا».",
          "Jangan biarkan n jelas sebelum ya, nun, mim, waw, lam dan ra antara dua kata. Dan jangan leburkan n pada ad-dunya.",
          "Kelimeler arasında ya, nun, mim, vav, lam ve ra'dan önce n'yi açık bırakma. Ed-dünya'daki n'yi de kaynaştırma.",
          "دو لفظوں کے بیچ ی ن م و ل ر سے پہلے ن کو واضح نہ چھوڑیں۔ اور دنیا کی ن کو نہ ملائیں۔",
        ),
        quiz: [
          {
            q: L("Входит ли н в р с гунной?", "Does the n enter ra with ghunnah?", "هل تُدغم النون في الراء بغنة؟", "Adakah n masuk ke ra dengan ghunnah?", "N, ra'ya gunneyle girer mi?", "کیا ن ر میں غنہ کے ساتھ داخل ہوتی ہے؟"),
            choices: [
              L("Нет, без гунны", "No, without ghunnah", "لا، بلا غنة", "Tidak, tanpa ghunnah", "Hayır, gunnesiz", "نہیں، بغیر غنہ"),
              L("Да, две меры", "Yes, two counts", "نعم، حركتين", "Ya, dua harakat", "Evet, iki miktar", "ہاں، دو حرکت"),
              L("Н остаётся ясным", "The n stays clear", "تبقى مظهرة", "N kekal jelas", "N açık kalır", "ن واضح رہتی ہے"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "iqlab",
        tone: "ghunnah",
        title: L("Икляб — замена на м", "Iqlab — it becomes m", "الإقلاب", "Iqlab — menjadi m", "İklab — m olur", "اقلاب — م بننا"),
        definition: L(
          "Перед б нун без гласного и танвин меняются на м с гунной.",
          "Before ba, a vowelless nun and tanwin change into mim with ghunnah.",
          "قبل الباء تُقلب النون الساكنة والتنوين ميمًا بغنة.",
          "Sebelum ba, nun sukun dan tanwin bertukar menjadi mim dengan ghunnah.",
          "Ba'dan önce sükûnlu nun ve tenvin, gunneyle mim'e döner.",
          "ب سے پہلے نون ساکن اور تنوین غنہ کے ساتھ م بن جاتے ہیں۔",
        ),
        letters: "ب",
        mechanism: L(
          "Губы готовятся к м, не к ясному н. Гунна две меры. В Мусхафе над н часто стоит маленький мим.",
          "The lips prepare for m, not for a clear n. The ghunnah is two counts. In the mushaf a small mim often stands over the nun.",
          "الشفتان تتهيآن للميم لا لنون مظهرة. الغنة حركتان. وفي المصحف كثيرًا ما توضع ميم صغيرة فوق النون.",
          "Bibir bersedia untuk m, bukan untuk n yang jelas. Ghunnah dua harakat. Dalam mushaf sering ada mim kecil di atas nun.",
          "Dudaklar açık n için değil, m için hazırlanır. Gunne iki miktardır. Mushafta nun'un üstünde çoğu zaman küçük bir mim durur.",
          "ہونٹ واضح ن کے لیے نہیں، م کے لیے تیار ہوتے ہیں۔ غنہ دو حرکت۔ مصحف میں ن کے اوپر اکثر چھوٹی م ہوتی ہے۔",
        ),
        examples: [
          { ar: "مِن بَعْدِ", read: "мим ба1ди", lat: "mim ba'di", where: "2:27" },
          { ar: "سَمِيعٌ بَصِيرٌ", read: "сами1ум басир", lat: "sami'um basir", where: "17:1" },
        ],
        mistakes: L(
          "Не читай ясный н перед б и не смыкай губы так сильно, чтобы гунна пропала.",
          "Do not read a clear n before ba, and do not close the lips so hard that the ghunnah disappears.",
          "لا تظهر النون قبل الباء ولا تطبق الشفتين حتى تسقط الغنة.",
          "Jangan zahirkan n sebelum ba, dan jangan rapatkan bibir hingga ghunnah hilang.",
          "Ba'dan önce n'yi açık okuma ve gunne kaybolacak kadar dudakları sıkma.",
          "ب سے پہلے ن کو واضح نہ پڑھیں اور ہونٹ اتنے سخت نہ ملائیں کہ غنہ ختم ہو جائے۔",
        ),
        quiz: [
          {
            q: L("На что меняется н перед б?", "What does the n become before ba?", "إلام تُقلب النون قبل الباء؟", "N menjadi apa sebelum ba?", "Ba'dan önce n neye döner?", "ب سے پہلے ن کس میں بدلتی ہے؟"),
            choices: [
              L("На м с гунной", "Into m with ghunnah", "ميمًا بغنة", "Menjadi m dengan ghunnah", "Gunneyle m'e", "غنہ کے ساتھ م میں"),
              L("Остаётся ясным", "It stays clear", "تبقى مظهرة", "Kekal jelas", "Açık kalır", "واضح رہتی ہے"),
              L("Пропадает без следа", "It vanishes without a trace", "تسقط بلا أثر", "Hilang tanpa bekas", "İzsiz düşer", "بغیر نشان کے گرتی ہے"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "ikhfa",
        tone: "ghunnah",
        title: L("Ихфа — скрытый н", "Ikhfa — the n is hidden", "الإخفاء", "Ikhfa — n tersembunyi", "İhfa — n gizlenir", "اخفاء — ن چھپتی ہے"),
        definition: L(
          "Перед остальными пятнадцатью буквами н без гласного и танвин не ясны и не входят полностью. Они остаются в носу.",
          "Before the other fifteen letters, a vowelless nun and tanwin are neither clear nor fully merged. They stay in the nose.",
          "قبل الخمسة عشر الباقية لا تُظهر النون الساكنة والتنوين ولا تُدغمان كاملًا. تبقيان في الأنف.",
          "Sebelum lima belas huruf yang lain, nun sukun dan tanwin tidak jelas dan tidak lebur penuh. Ia kekal di hidung.",
          "Kalan on beş harften önce sükûnlu nun ve tenvin ne açıktır ne de tam girer. Burunda kalır.",
          "باقی پندرہ حروف سے پہلے نون ساکن اور تنوین نہ واضح ہوتی ہیں نہ پوری داخل۔ ناک میں رہتی ہیں۔",
        ),
        letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
        mechanism: L(
          "Кончик языка не ставит ясный н. Гунна две меры. Перед твёрдой буквой этот носовой звук толще, перед тонкой — тоньше.",
          "The tip of the tongue does not place a clear n. The ghunnah is two counts. Before a heavy letter this nasal sound is thicker, and before a light letter it is thinner.",
          "لا يضع طرف اللسان نونًا مظهرة. الغنة حركتان. وقبل حرف الاستعلاء تكون أغنى وأغلظ، وقبل المستفل أرق.",
          "Hujung lidah tidak meletakkan n yang jelas. Ghunnah dua harakat. Sebelum huruf tebal bunyi hidung ini lebih tebal, sebelum huruf nipis lebih nipis.",
          "Dil ucu açık bir n koymaz. Gunne iki miktardır. Kalın harften önce bu geniz sesi daha kalın, ince harften önce daha incedir.",
          "زبان کی نوک واضح ن نہیں لگاتی۔ غنہ دو حرکت۔ بھاری حرف سے پہلے یہ ناک والی آواز موٹی، پتلے سے پہلے پتلی۔",
        ),
        examples: [
          { ar: "مِن شَرِّ", read: "мин шарри — н в носу", lat: "min sharri — the n is in the nose", where: "113:2" },
          { ar: "أَنتُمْ", read: "антум — н скрыт", lat: "antum — the n is hidden", where: "2:85" },
          { ar: "مَنصُورًا", read: "мансура — носовой звук толще", lat: "mansura — the nasal sound is thicker", where: "17:33" },
        ],
        mistakes: L(
          "Не произноси отдельный ясный н и не сливай его в следующую букву до конца.",
          "Do not pronounce a separate clear n, and do not merge it fully into the next letter.",
          "لا تنطق نونًا مظهرة مستقلة ولا تدغمها في الذي يليها إدغامًا كاملًا.",
          "Jangan sebut n yang jelas dan terpisah, dan jangan leburkannya penuh ke huruf berikut.",
          "Ayrı açık bir n söyleme ve onu sonraki harfe sonuna kadar kaynaştırma.",
          "الگ واضح ن نہ بولیں اور اسے اگلے حرف میں پورا نہ ملائیں۔",
        ),
        quiz: [
          {
            q: L("Где звук н в «мин шарри»?", "Where is the n in min sharri?", "أين صوت النون في «من شر»؟", "Di mana bunyi n pada min sharri?", "Min şerri'de n'nin sesi nerede?", "مِن شَرِّ میں ن کی آواز کہاں ہے؟"),
            choices: [
              L("В носу, две меры", "In the nose, two counts", "في الأنف حركتين", "Di hidung, dua harakat", "Burunda, iki miktar", "ناک میں، دو حرکت"),
              L("Ясный на языке", "Clear, on the tongue", "مظهرة على اللسان", "Jelas, di lidah", "Açık, dilde", "واضح، زبان پر"),
              L("Его нет", "It is gone", "لا صوت لها", "Tidak ada", "Yoktur", "ہے ہی نہیں"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m4",
    title: L("4. Мим с сукуном", "4. Meem with sukun", "٤. الميم الساكنة", "4. Mim sukun", "4. Sükûnlu mim", "٤. میم ساکن"),
    lessons: [
      {
        id: "meem",
        tone: "ghunnah",
        title: L("Три правила мима", "The three rules of meem", "أحكام الميم الثلاثة", "Tiga hukum mim", "Mim'in üç hükmü", "میم کے تین حکم"),
        definition: L(
          "Мим без гласного скрыт перед б, входит в другой мим и ясен перед остальными буквами.",
          "A vowelless meem is hidden before ba, enters another meem, and is clear before the other letters.",
          "الميم الساكنة تُخفى قبل الباء، وتُدغم في ميم أخرى، وتُظهر قبل سائر الحروف.",
          "Mim sukun tersembunyi sebelum ba, masuk ke mim yang lain, dan jelas sebelum huruf yang lain.",
          "Sükûnlu mim ba'dan önce gizlenir, başka bir mim'e girer ve diğer harflerden önce açıktır.",
          "میم ساکن ب سے پہلے چھپتی ہے، دوسری میم میں داخل ہوتی ہے، اور باقی حروف سے پہلے واضح ہے۔",
        ),
        letters: "ب · م · سائر الحروف",
        mechanism: L(
          "Перед б губы почти сомкнуты, гунна две меры. Перед м губы смыкаются в один мим с гунной. Перед остальными мим ясен. Особенно не отпускай его в нос перед в и ф.",
          "Before ba the lips are nearly closed, with ghunnah for two counts. Before mim the lips close into one mim with ghunnah. Before the rest the meem is clear. In particular do not let it slip into the nose before waw and fa.",
          "قبل الباء الشفتان تكادان تنطبقان بغنة حركتين. وقبل الميم تنطبقان على ميم واحدة بغنة. وقبل الباقي تُظهر. وخاصة لا تسرّبها إلى الأنف قبل الواو والفاء.",
          "Sebelum ba bibir hampir rapat, ghunnah dua harakat. Sebelum mim bibir rapat menjadi satu mim dengan ghunnah. Sebelum yang lain mim jelas. Terutama jangan biarkan ia masuk ke hidung sebelum waw dan fa.",
          "Ba'dan önce dudaklar neredeyse kapanır, gunne iki miktar. Mimden önce dudaklar gunneyle tek mimde kapanır. Diğerlerinden önce mim açıktır. Özellikle vav ve fa'dan önce onu buruna kaçırma.",
          "ب سے پہلے ہونٹ تقریباً ملتے ہیں، غنہ دو حرکت۔ م سے پہلے ہونٹ ایک میم پر غنہ کے ساتھ ملتے ہیں۔ باقی سے پہلے میم واضح ہے۔ خاص طور پر و اور ف سے پہلے اسے ناک میں نہ جانے دیں۔",
        ),
        examples: [
          { ar: "تَرْمِيهِم بِحِجَارَةٍ", read: "тармихим бихьиджара — мим скрыт", lat: "tarmihim bihijara — meem is hidden", where: "105:4" },
          { ar: "لَهُم مَّا", read: "ляхум-ма — вошёл", lat: "lahum-ma — it entered", where: "2:25" },
          { ar: "أَنْعَمْتَ", read: "ан1амта — мим ясен", lat: "an'amta — meem is clear", where: "1:7" },
        ],
        mistakes: L(
          "Не читай ясный мим перед б. И не делай гунну у ясного мима перед в и ф.",
          "Do not read a clear meem before ba. And do not put a ghunnah on a clear meem before waw and fa.",
          "لا تظهر الميم قبل الباء. ولا تجعل غنة للميم المظهرة قبل الواو والفاء.",
          "Jangan zahirkan mim sebelum ba. Dan jangan letakkan ghunnah pada mim yang jelas sebelum waw dan fa.",
          "Ba'dan önce açık mim okuma. Ve vav ile fa'dan önce açık mime gunne koyma.",
          "ب سے پہلے واضح میم نہ پڑھیں۔ اور و اور ف سے پہلے واضح میم پر غنہ نہ کریں۔",
        ),
        quiz: [
          {
            q: L("Мим перед б…", "Meem before ba…", "الميم قبل الباء…", "Mim sebelum ba…", "Ba'dan önce mim…", "ب سے پہلے میم…"),
            choices: [
              L("скрыт, с гунной", "is hidden, with ghunnah", "تُخفى بغنة", "tersembunyi, dengan ghunnah", "gizlenir, gunneyle", "چھپتی ہے، غنہ کے ساتھ"),
              L("ясен", "is clear", "تُظهر", "jelas", "açıktır", "واضح ہے"),
              L("пропадает", "disappears", "تسقط", "hilang", "düşer", "گر جاتی ہے"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m5",
    title: L("5. Гунна", "5. Ghunnah", "٥. الغنة", "5. Ghunnah", "5. Gunne", "٥. غنہ"),
    lessons: [
      {
        id: "ghunnah",
        tone: "ghunnah",
        title: L("Две меры через нос", "Two counts through the nose", "حركتان من الأنف", "Dua harakat dari hidung", "Burundan iki miktar", "ناک سے دو حرکت"),
        definition: L(
          "Гунна — звук н и м через нос. Где её держат, она длится две меры. Сила не одна, длина одна.",
          "Ghunnah is the sound of nun and mim through the nose. Where it is held, it lasts two counts. The strength is not all the same; the length is.",
          "الغنة صوت النون والميم من الأنف. حيث تُثبت فمقدارها حركتان. القوة تتفاوت، والمقدار واحد.",
          "Ghunnah ialah bunyi nun dan mim melalui hidung. Di tempat ia ditahan, ia dua harakat. Kekuatannya tidak sama, kadarnya sama.",
          "Gunne, nun ve mim'in burundan gelen sesidir. Tutulduğu yerde iki miktar sürer. Güç aynı değildir, süre aynıdır.",
          "غنہ ن اور م کی ناک سے آواز ہے۔ جہاں اسے روکیں، دو حرکت رہتی ہے۔ طاقت ایک نہیں، لمبائی ایک ہے۔",
        ),
        letters: "نّ مّ · ي ن م و · ب · حروف الإخفاء",
        mechanism: L(
          "Сильнее всего у н и м с шаддой. Затем когда н входит в й, н, м, в. Затем когда н скрыт, когда он стал м перед б, и когда мим скрыт перед б. Зажми нос: если кусок слова пропал, это гунна. Её нет у ясного н и когда н вошёл в л или р.",
          "It is strongest on nun and mim with shadda. Then when nun enters ya, nun, mim or waw. Then when nun is hidden, when it became mim before ba, and when meem is hidden before ba. Pinch your nose: if a piece of the word disappears, that is ghunnah. It is not there on a clear nun, nor when nun entered lam or ra.",
          "أقواها في النون والميم المشددتين. ثم إذا دخلت النون في ي ن م و. ثم إذا خُفيت، وإذا قُلبت ميمًا قبل الباء، وإذا خُفيت الميم قبل الباء. أمسك أنفك: إن سقط جزء الكلمة فهي الغنة. ولا تكون في النون المظهرة، ولا إذا دخلت في ل أو ر.",
          "Paling kuat pada nun dan mim bersyaddah. Kemudian bila nun masuk ke ya, nun, mim atau waw. Kemudian bila nun tersembunyi, bila ia menjadi mim sebelum ba, dan bila mim tersembunyi sebelum ba. Picit hidung: jika sebahagian kata hilang, itulah ghunnah. Tidak ada pada nun yang jelas, dan tidak bila nun masuk ke lam atau ra.",
          "En güçlüsü şeddeli nun ve mimdedir. Sonra nun; ya, nun, mim veya vav'a girince. Sonra nun gizlenince, ba'dan önce mim olunca ve mim ba'dan önce gizlenince. Burnunu kapat: kelimenin bir parçası düşerse o gunnedir. Açık nunde yoktur. Nun lam veya ra'ya girince de yoktur.",
          "سب سے مضبوط شدہ والی ن اور م پر۔ پھر جب ن ی ن م و میں داخل ہو۔ پھر جب ن چھپی ہو، جب ب سے پہلے م بنے، اور جب میم ب سے پہلے چھپے۔ ناک دبائیں: اگر لفظ کا ٹکڑا گر جائے تو یہ غنہ ہے۔ واضح ن پر نہیں۔ جب ن ل یا ر میں جائے تب بھی نہیں۔",
        ),
        examples: [
          { ar: "إِنَّ", read: "инна — две меры", lat: "inna — two counts", where: "2:6" },
          { ar: "ثُمَّ", read: "сумма — две меры", lat: "thumma — two counts", where: "2:28" },
          { ar: "مِن رَّبِّ", read: "мир-рабби — без гунны", lat: "mir-rabbi — no ghunnah", where: "2:5" },
        ],
        mistakes: L(
          "Не тяни гунну на четыре и не убирай её у «инна» и «сумма».",
          "Do not hold ghunnah for four counts, and do not drop it from inna and thumma.",
          "لا تمد الغنة أربع حركات ولا تحذفها من «إن» و«ثم».",
          "Jangan panjangkan ghunnah empat harakat, dan jangan buang dari inna dan tsumma.",
          "Gunneyi dört miktar uzatma ve inne ile sümme'den düşürme.",
          "غنہ کو چار حرکت نہ کھینچیں اور انّ اور ثمّ سے نہ ہٹائیں۔",
        ),
        quiz: [
          {
            q: L("Сколько мер у гунны в «инна»?", "How many counts is the ghunnah in inna?", "كم غنة «إن»؟", "Berapa harakat ghunnah pada inna?", "İnne'deki gunne kaç miktar?", "انَّ کی غنہ کتنی حرکت ہے؟"),
            choices: [
              L("Две", "Two", "حركتان", "Dua", "İki", "دو"),
              L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"),
              L("Её нет", "There is none", "لا غنة", "Tidak ada", "Yoktur", "ہے ہی نہیں"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m6",
    title: L("6. Слияние букв", "6. When one letter enters the next", "٦. إدغام الحروف", "6. Peleburan huruf", "6. Harflerin idgamı", "٦. حروف کا ادغام"),
    lessons: [
      {
        id: "kinds",
        tone: "plain",
        title: L("Одинаковые, соседние, близкие", "The same, the shared, the near", "المتماثل والمتجانس والمتقارب", "Sama, sejenis, berdekatan", "Aynı, cins ve yakın", "ایک جیسے، ہم جنس اور قریب"),
        definition: L(
          "Буква без гласного входит в следующую, и слышна одна. Это не только правило нуна.",
          "A letter with no vowel enters the next one, and you hear one. This is not only the rule of nun.",
          "الحرف الساكن يدخل في الذي يليه فيُسمع واحد. وهذا ليس حكم النون وحدها.",
          "Huruf sukun masuk ke huruf berikut dan yang kedengaran satu. Ini bukan hukum nun sahaja.",
          "Sükûnlu harf sonrakine girer ve bir tane duyulur. Bu yalnız nun'un hükmü değildir.",
          "ساکن حرف اگلے میں داخل ہوتا ہے اور ایک سنائی دیتا ہے۔ یہ صرف نون کا حکم نہیں۔",
        ),
        letters: "مثل · ط د ت · ظ ذ ث · ب م · ق ك",
        mechanism: L(
          "Одинаковые входят полностью: قُل لَّا. Из одного места: د входит в ت, как قَد تَّبَيَّنَ. Твёрдая ط в أَحَطتُ оставляет след, слышно ахатту. ب входит в м: ارْكَب مَّعَنَا. У Хафса ق входит в ك в نَخْلُقكُّمْ, слышно нахьлукъкум.",
          "Two of the same letter enter completely: qul la. From one place: dal enters ta, as in qad tabayyana. The heavy ta in ahattu leaves a trace, and it is heard ahattu. Ba enters mim: irkam ma'ana. In Hafs, qaf enters kaf in nakhlukkum, heard nakhlukkum.",
          "المتماثلان يدخلان كاملًا: قل لا. ومن مخرج واحد: الدال في التاء، كـ«قد تبين». والطاء في «أحطت» يبقى أثرها: أحطّ. والباء في الميم: اركب معنا. وعند حفص تدخل القاف في الكاف في «نخلقكم»، فتُسمع نخلّكم.",
          "Dua huruf sama masuk penuh: qul la. Dari satu tempat: dal masuk ke ta, seperti qad tabayyana. Ta yang berat pada ahattu meninggalkan bekas. Ba masuk ke mim: irkam ma'ana. Pada Hafs, qaf masuk ke kaf dalam nakhlukkum.",
          "Aynı iki harf tam girer: kul la. Aynı yerden: dal, ta'ya girer, qad tabeyyene gibi. Ahattu'daki kalın tı iz bırakır. Ba, mim'e girer: irkam meana. Hafs'ta qaf, nahlukküm'de kaf'a girer.",
          "ایک جیسے حرف پورا داخل ہوتے ہیں: قُل لَّا۔ ایک جگہ سے: د ت میں داخل، جیسے قَد تَّبَيَّنَ۔ أَحَطتُ کی بھاری ط نشان چھوڑتی ہے۔ ب م میں داخل: ارْكَب مَّعَنَا۔ حفص میں ق ک میں داخل ہوتی ہے نَخْلُقكُّمْ میں۔",
        ),
        examples: [
          { ar: "قُل لَّا", read: "къул-ля — одинаковые", lat: "qul la — the same letter", where: "109:2" },
          { ar: "قَد تَّبَيَّنَ", read: "къат-табаййана", lat: "qat-tabayyana", where: "2:256" },
          { ar: "أَحَطتُ", read: "ахатту — след та остался", lat: "ahattu — a trace of the ta remains", where: "27:22" },
          { ar: "ارْكَب مَّعَنَا", read: "иркам-ма1ана", lat: "irkam ma'ana", where: "11:42" },
        ],
        mistakes: L(
          "Не оставляй первую букву отдельным звуком там, где она вошла. И не стирай след твёрдой та в «ахатту».",
          "Do not leave the first letter as a separate sound where it has entered. And do not erase the trace of the heavy ta in ahattu.",
          "لا تبقِ الحرف الأول صوتًا مستقلًا حيث دخل. ولا تمحُ أثر الطاء في «أحطت».",
          "Jangan biarkan huruf pertama sebagai bunyi yang tersendiri di tempat ia sudah masuk. Dan jangan hapus bekas ta yang berat pada ahattu.",
          "Girdiği yerde ilk harfi ayrı bir ses olarak bırakma. Ve ahattu'daki kalın tı'nın izini silme.",
          "جہاں حرف داخل ہو چکا ہو وہاں پہلے حرف کو الگ آواز نہ چھوڑیں۔ اور أَحَطتُ میں بھاری ط کا نشان نہ مٹائیں۔",
        ),
        quiz: [
          {
            q: L("Что слышно в «ахатту»?", "What is heard in ahattu?", "ماذا يُسمع في «أحطت»؟", "Apa yang kedengaran pada ahattu?", "Ahattu'da ne duyulur?", "أَحَطتُ میں کیا سنائی دیتا ہے؟"),
            choices: [
              L("т, и след твёрдой та", "t, with a trace of the heavy ta", "تاء مع أثر الطاء", "t, dengan bekas ta yang berat", "t, kalın tı'nın iziyle", "ت، اور بھاری ط کا نشان"),
              L("ясные та и та подряд", "a clear ta and then ta", "طاء ثم تاء واضحتان", "ta lalu ta, keduanya jelas", "açık tı sonra te", "واضح ط پھر ت"),
              L("только къ", "only qaf", "قاف فقط", "hanya qaf", "yalnız qaf", "صرف ق"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m7",
    title: L("7. Протяжка", "7. Lengthening", "٧. المد", "7. Mad", "7. Med", "٧. مد"),
    lessons: [
      {
        id: "madd-short",
        tone: "madd",
        title: L("Две, четыре и пять", "Two, four and five", "اثنتان وأربع وخمس", "Dua, empat dan lima", "İki, dört ve beş", "دو، چار اور پانچ"),
        definition: L(
          "Тяни гласный, если после а стоит алиф, после у — вав без гласного, после и — йа без гласного.",
          "Hold the vowel when alif follows a, a vowelless waw follows u, or a vowelless ya follows i.",
          "امدد الحركة إذا جاء بعد الفتح ألف، وبعد الضم واو ساكنة، وبعد الكسر ياء ساكنة.",
          "Panjangkan vokal bila selepas a ada alif, selepas u ada waw sukun, selepas i ada ya sukun.",
          "A'dan sonra elif, u'dan sonra sükûnlu vav, i'den sonra sükûnlu ya varsa harekeyi tut.",
          "جب ا کے بعد الف، اُ کے بعد ساکن واو، اِ کے بعد ساکن یا ہو تو حرکت کھینچیں۔",
        ),
        letters: "ا و ي",
        mechanism: L(
          "Обычная протяжка — две меры: قَالَ. Хамза в том же слове — четыре или пять: جَاءَ. Хамза в следующем слове — две, четыре или пять: إِنَّا أَعْطَيْنَاكَ. Хамза, а потом буква протяжки — только две: آمَنَ. На остановке танвин с а даёт две: عَلِيمًا. Буква ه между гласными тянется на две, а если дальше отдельная хамза — как протяжка через слово. Если дальше хамза «аль», эту ه не тяни.",
          "The ordinary length is two counts: qala. A hamza in the same word is four or five: jaa. A hamza in the next word is two, four or five: inna a'taynaka. A hamza and then a letter of lengthening is only two: amana. When you stop, tanwin with a gives two: alima. The letter ha between vowels is held for two, and if a separate hamza follows it is like a lengthening across the word. If the hamza of al- follows, do not hold that ha.",
          "المد الطبيعي حركتان: قال. والهمزة في الكلمة نفسها أربع أو خمس: جاء. والهمزة في الكلمة التالية اثنتان أو أربع أو خمس: إنا أعطيناك. والهمزة ثم حرف المد حركتان فقط: آمن. والوقف على تنوين الفتح حركتان: عليما. والهاء بين حركتين تُمد حركتين، فإن جاءت بعدها همزة مستقلة فكالمد المنفصل. وإن جاءت همزة «ال» فلا تمد هذه الهاء.",
          "Mad biasa dua: qala. Hamzah dalam kata yang sama empat atau lima: jaa. Hamzah dalam kata berikut dua, empat atau lima: inna a'taynaka. Hamzah lalu huruf mad hanya dua: amana. Berhenti pada tanwin ber-a memberi dua: alima. Ha di antara vokal dua; jika hamzah tersendiri menyusul ia seperti mad yang terpisah. Jika hamzah al- menyusul, ha itu jangan dipanjangkan.",
          "Olağan med iki: qale. Hemze aynı kelimedeyse dört veya beş: cae. Hemze sonraki kelimedeyse iki, dört veya beş: inna a'taynake. Hemzeden sonra uzatma harfi yalnız iki: amene. A'lı tenvinde durunca iki: alima. İki hareke arasındaki he iki tutulur; ayrı bir hemze gelirse kelimeler arası med gibidir. El-'in hemzesi gelirse o he'yi uzatma.",
          "عام مد دو: قَالَ۔ ہمزہ اسی لفظ میں ہو تو چار یا پانچ: جَاءَ۔ ہمزہ اگلے لفظ میں ہو تو دو، چار یا پانچ: إِنَّا أَعْطَيْنَاكَ۔ ہمزہ پھر مد کا حرف صرف دو: آمَنَ۔ ا والے تنوین پر رکیں تو دو: عَلِيمًا۔ دو حرکتوں کے بیچ کی ہ دو؛ الگ ہمزہ آئے تو الگ لفظ والی مد کی طرح۔ ال کی ہمزہ آئے تو اس ہ کو نہ کھینچیں۔",
        ),
        examples: [
          { ar: "قَالَ", read: "къаля — две", lat: "qala — two", where: "2:30" },
          { ar: "جَاءَ", read: "джаа — четыре или пять", lat: "jaa — four or five", where: "110:1" },
          { ar: "آمَنَ", read: "амана — две", lat: "amana — two", where: "2:62" },
          { ar: "بِهِ إِنَّ", read: "бихи инна — две, четыре или пять", lat: "bihi inna — two, four or five", where: "2:26" },
        ],
        mistakes: L(
          "Не тяни обычное «къаля» на четыре. И не тяни «амана» больше двух.",
          "Do not hold an ordinary qala for four. And do not hold amana for more than two.",
          "لا تمد «قال» أربعًا. ولا تزد «آمن» على حركتين.",
          "Jangan panjangkan qala yang biasa menjadi empat. Dan jangan panjangkan amana lebih daripada dua.",
          "Olağan qale'yi dört tutma. Amene'yi de ikiden fazla tutma.",
          "عام قَالَ کو چار نہ کھینچیں۔ اور آمَنَ کو دو سے زیادہ نہ کھینچیں۔",
        ),
        quiz: [
          {
            q: L("Сколько в «джаа»?", "How many in jaa?", "كم في «جاء»؟", "Berapa pada jaa?", "Cae'de kaç?", "جَاءَ میں کتنی؟"),
            choices: [
              L("Четыре или пять", "Four or five", "أربع أو خمس", "Empat atau lima", "Dört veya beş", "چار یا پانچ"),
              L("Всегда две", "Always two", "اثنتان دائمًا", "Selalu dua", "Hep iki", "ہمیشہ دو"),
              L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "madd-long",
        tone: "madd",
        title: L("Шесть и остановка", "Six, and when you stop", "الست والوقف", "Enam, dan ketika berhenti", "Altı, ve durunca", "چھ، اور وقف"),
        definition: L(
          "Если после буквы протяжки стоит сукун, который есть и при чтении дальше, тяни шесть. Если сукун появляется только потому, что ты остановился, мера на выбор.",
          "If a sukun that is still there when you continue comes after a letter of lengthening, hold it for six. If the sukun appears only because you stopped, you choose the length.",
          "إذا جاء بعد حرف المد سكون ثابت وصلًا فامدد ستًا. وإذا جاء السكون لأنك وقفت فالمقدار لك.",
          "Jika selepas huruf mad ada sukun yang tetap ketika disambung, panjangkan enam. Jika sukun itu hanya kerana anda berhenti, kadarnya pilihan anda.",
          "Uzatma harfinden sonra, bağlayınca da duran bir sükûn varsa altı tut. Sükûn yalnız durduğun için geliyorsa miktarı sen seçersin.",
          "اگر مد کے حرف کے بعد وہ سکون ہو جو جوڑنے پر بھی رہے تو چھ کھینچیں۔ اگر سکون صرف اس لیے آیا کہ آپ رکے تو مقدار آپ کی مرضی۔",
        ),
        letters: "ا و ي + سكون",
        mechanism: L(
          "Шесть в الضَّالِّينَ и в буквах начала суры, которые тянутся: لام и ميم в الم. Если буква начала сливается со следующей, это тяжёлый вид, если нет — лёгкий. Длина та же, шесть. Остановился и последняя буква без гласного: две, четыре или шесть, ровно. Вав и йа после а, как в خَوْف, тяни только на остановке: тоже две, четыре или шесть.",
          "Six in ad-dallin, and in the opening letters of a surah that are lengthened: lam and mim in alif lam mim. If an opening letter merges into the next, that is the heavy kind; if not, the light kind. The length is the same, six. If you stop and the last letter has no vowel: two, four or six, evenly. A waw or ya after a, as in khawf, is held only when you stop: also two, four or six.",
          "ست في «الضالين» وفي حروف أوائل السور التي تُمد: لام وميم «الم». فإن أُدغم حرف البداية فيما بعده فهو المثقل، وإلا فالمخفف. والمقدار واحد: ست. وإن وقفت والأخير ساكن: اثنتان أو أربع أو ست، باعتدال. والواو والياء بعد الفتح، كـ«خوف»، تُمدان عند الوقف فقط: اثنتان أو أربع أو ست.",
          "Enam pada ad-dallin, dan pada huruf awal surah yang dipanjangkan: lam dan mim pada alif lam mim. Jika huruf awal lebur ke yang berikut, itu jenis berat; jika tidak, jenis ringan. Kadarnya sama, enam. Berhenti dan huruf terakhir sukun: dua, empat atau enam, rata. Waw dan ya selepas a, seperti khawf, dipanjangkan hanya ketika berhenti: juga dua, empat atau enam.",
          "Ad-dallin'de ve sure başında uzatılan harflerde altı: elif lam mim'deki lam ve mim. Baş harfi sonrakine kaynaşırsa ağır türdür, kaynaşmazsa hafif tür. Süre aynıdır, altı. Durup son harf sessizse: iki, dört veya altı, düzgün. A'dan sonraki vav ve ya, havf gibi, yalnız durunca uzar: yine iki, dört veya altı.",
          "چھ الضَّالِّينَ میں، اور سورت کے شروع کے ان حروف میں جو کھینچے جاتے ہیں: الم کی لام اور میم۔ اگر شروع کا حرف اگلے میں ملے تو بھاری قسم، ورنہ ہلکی۔ لمبائی وہی، چھ۔ رکیں اور آخری حرف ساکن ہو: دو، چار یا چھ، برابر۔ ا کے بعد و اور ی، جیسے خَوْف، صرف وقف پر کھینچیں: پھر بھی دو، چار یا چھ۔",
        ),
        examples: [
          { ar: "الضَّالِّينَ", read: "ад-даллин — шесть", lat: "ad-dallin — six", where: "1:7" },
          { ar: "الم", read: "алиф лам мим — шесть", lat: "alif lam mim — six", where: "2:1" },
          { ar: "الْعَالَمِينَ", read: "на остановке две, четыре или шесть", lat: "when stopping: two, four or six", where: "1:2" },
        ],
        mistakes: L(
          "«Ад-даллин» не сокращай до двух. И не тяни мягкий вав в «хауф», пока не остановился.",
          "Do not shorten ad-dallin to two. And do not hold the soft waw in khawf until you have stopped.",
          "لا تقصر «الضالين» إلى حركتين. ولا تمد واو اللين في «خوف» قبل الوقف.",
          "Jangan pendekkan ad-dallin menjadi dua. Dan jangan panjangkan waw lunak pada khawf sebelum berhenti.",
          "Ad-dallin'i ikiye indirme. Ve durmadan havf'teki yumuşak vavı uzatma.",
          "الضَّالِّينَ کو دو تک نہ گھٹائیں۔ اور جب تک نہ رکیں خَوْف کی نرم و کو نہ کھینچیں۔",
        ),
        quiz: [
          {
            q: L("Сколько в «ад-даллин»?", "How many in ad-dallin?", "كم في «الضالين»؟", "Berapa pada ad-dallin?", "Ad-dallin'de kaç?", "الضَّالِّينَ میں کتنی؟"),
            choices: [
              L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"),
              L("Две", "Two", "اثنتان", "Dua", "İki", "دو"),
              L("Четыре или пять", "Four or five", "أربع أو خمس", "Empat atau lima", "Dört veya beş", "چار یا پانچ"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m8",
    title: L("8. Остановка и начало", "8. Stopping and starting", "٨. الوقف والابتداء", "8. Waqaf dan ibtida", "8. Vakıf ve ibtida", "٨. وقف اور ابتدا"),
    lessons: [
      {
        id: "signs",
        tone: "plain",
        title: L("Знаки Мусхафа", "The signs in the mushaf", "علامات المصحف", "Tanda mushaf", "Mushaf işaretleri", "مصحف کی علامات"),
        definition: L(
          "Знак говорит, остановиться здесь или идти дальше. Это помощь в смысле, не отдельное правило звука.",
          "A sign says whether to stop here or to go on. It is a help for the meaning, not a separate rule of sound.",
          "العلامة تبين الوقف أو الوصل. هي عون على المعنى، وليست حكم صوت مستقلًا.",
          "Tanda memberitahu berhenti atau sambung. Ia bantuan makna, bukan hukum bunyi yang tersendiri.",
          "İşaret burada durulacağını ya da geçileceğini söyler. Anlam için yardımdır, ayrı bir ses hükmü değildir.",
          "نشان بتاتا ہے یہاں رکنا ہے یا آگے بڑھنا۔ یہ معنی کی مدد ہے، آواز کا الگ حکم نہیں۔",
        ),
        letters: "م · لا · ج · صلي · قلي · ∴ · س",
        mechanism: L(
          "م — здесь останавливаются. لا — здесь не останавливаются. ج — можно и так, и так. صلى — лучше идти дальше. قلى — лучше остановиться. Три точки — остановись на одной из двух, не на обеих. س — короткая задержка без вдоха.",
          "Mim: stop here. La: do not stop here. Jim: either is allowed. Sila: it is better to continue. Qala: it is better to stop. Three dots: stop at one of the two, not at both. Sin: a short hold, without taking a breath.",
          "م يوقف عندها. لا لا يوقف عندها. ج يجوز الوجهان. صلى الوصل أولى. قلى الوقف أولى. النقاط الثلاث: قف عند إحداهما لا عند كلتيهما. س سكتة قصيرة بلا تنفس.",
          "Mim: berhenti di situ. La: jangan berhenti. Jim: keduanya boleh. Sila: lebih baik disambung. Qala: lebih baik berhenti. Tiga titik: berhenti di salah satu, bukan di keduanya. Sin: hentian pendek tanpa menarik napas.",
          "Mim: burada durulur. La: burada durulmaz. Cim: ikisi de olur. Sıla: geçmek daha iyidir. Kalâ: durmak daha iyidir. Üç nokta: ikisinden birinde dur, ikisinde birden değil. Sin: nefes almadan kısa duruş.",
          "م: یہاں رکنا ہے۔ لا: یہاں نہ رکنا ہے۔ ج: دونوں ہو سکتے ہیں۔ صلى: آگے بڑھنا بہتر ہے۔ قلى: رکنا بہتر ہے۔ تین نقطے: دونوں میں سے ایک پر رکیں، دونوں پر نہیں۔ س: سانس لیے بغیر چھوٹی رکاوٹ۔",
        ),
        examples: [
          { ar: "م", read: "остановись", lat: "stop", where: "знак" },
          { ar: "لا", read: "не останавливайся", lat: "do not stop", where: "знак" },
          { ar: "∴", read: "одна из двух", lat: "one of the two", where: "знак" },
        ],
        mistakes: L(
          "Не останавливайся на لا и не стой на обеих точках сразу.",
          "Do not stop at la, and do not stop at both dotted places at once.",
          "لا تقف عند «لا» ولا تقف عند موضعي النقاط معًا.",
          "Jangan berhenti pada la, dan jangan berhenti di kedua tempat bertitik sekali gus.",
          "La'da durma ve iki noktalı yerde birden durma.",
          "لا پر نہ رکیں اور دونوں نقطوں پر ایک ساتھ نہ رکیں۔",
        ),
        quiz: [
          {
            q: L("Что значит صلى?", "What does sila mean?", "ماذا تعني صلى؟", "Apa makna sila?", "Sıla ne demektir?", "صلى کا کیا مطلب ہے؟"),
            choices: [
              L("Лучше идти дальше", "It is better to continue", "الوصل أولى", "Lebih baik disambung", "Geçmek daha iyidir", "آگے بڑھنا بہتر ہے"),
              L("Обязательно стоять", "You must stop", "يجب الوقف", "Wajib berhenti", "Mutlaka dur", "رکنا لازمی ہے"),
              L("Задержка без вдоха", "A hold without a breath", "سكتة بلا نفس", "Hentian tanpa napas", "Nefessiz duruş", "سانس کے بغیر رکاوٹ"),
            ],
            answer: A(0),
          },
        ],
      },
      {
        id: "stop-start",
        tone: "plain",
        title: L("Конец слова и хамза соединения", "The end of a word, and the joining hamza", "آخر الكلمة وهمزة الوصل", "Hujung kata dan hamzah wasal", "Kelime sonu ve vasıl hemzesi", "لفظ کا آخر اور ہمزہ وصل"),
        definition: L(
          "На остановке краткий гласный снимается. Хамза, нарисованная маленькой, в середине речи не читается. Начал с неё — гласный берётся по правилу.",
          "When you stop, the short vowel is dropped. The small hamza is not read in the middle of speech. If you start on it, the vowel is taken by the rule.",
          "عند الوقف تسقط الحركة القصيرة. وهمزة الوصل الصغيرة لا تُنطق في الدرج. وإن بدأت بها أُخذت حركتها بالحكم.",
          "Ketika berhenti, vokal pendek gugur. Hamzah kecil tidak dibaca di tengah ucapan. Jika mulai darinya, vokalnya diambil mengikut hukum.",
          "Durunca kısa hareke düşer. Küçük hemze sözün ortasında okunmaz. Ondan başladıysan harekesi hükme göre alınır.",
          "وقف پر چھوٹی حرکت گر جاتی ہے۔ چھوٹی ہمزہ درمیان کلام میں نہیں پڑھی جاتی۔ اس سے شروع کریں تو حرکت حکم سے لی جاتی ہے۔",
        ),
        letters: "ة · ً ٍ ٌ · ٱ",
        mechanism: L(
          "ة на остановке — лёгкий х, в чтении дальше — т. Танвин с а на остановке даёт алиф, кроме ة: там х. Танвин с и и у просто снимается. «Аль» начинай с а. У имени вроде «исм» начинай с и. У глагола: если третья буква с у, начинай с у, иначе с и.",
          "Ta marbuta is a light h when you stop, and t when you continue. Tanwin with a gives an alif when you stop, except on ta marbuta: there it is h. Tanwin with i and u is simply dropped. Start al- with a. A noun such as ism starts with i. In a verb: if the third letter has u, start with u; otherwise start with i.",
          "ة عند الوقف هاء خفيفة، وعند الوصل تاء. وتنوين الفتح عند الوقف يعطي ألفًا، إلا على ة فهي هاء. وتنوين الكسر والضم يسقط. وتُبدأ «ال» بالفتح. والاسم نحو «اسم» بالكسر. والفعل: إن كانت ثالثته مضمومة فبالضم، وإلا فبالكسر.",
          "Ta marbutah ketika berhenti ialah h ringan, ketika disambung ialah t. Tanwin ber-a ketika berhenti memberi alif, kecuali pada ta marbutah: di situ h. Tanwin ber-i dan u gugur sahaja. Al- dimula dengan a. Nama seperti ism dimula dengan i. Pada kata kerja: jika huruf ketiga ber-u, mula dengan u; jika tidak, dengan i.",
          "Durunca te marbuta hafif h, sürdürürsen t. A'lı tenvin durunca elif verir, te marbuta hariç: orada h. İ'li ve u'lu tenvin düşer. El- a ile başlar. İsm gibi isim i ile başlar. Fiilde: üçüncü harf u ise u ile başla, değilse i ile.",
          "ة وقف پر ہلکی ہ، جوڑ کر پڑھیں تو ت۔ ا والا تنوین وقف پر الف دیتا ہے، سوائے ة کے: وہاں ہ۔ اِ اور اُ والا تنوین گر جاتا ہے۔ ال ا سے شروع کریں۔ اسم جیسے نام اِ سے۔ فعل میں: اگر تیسرا حرف اُ ہو تو اُ سے، ورنہ اِ سے۔",
        ),
        examples: [
          { ar: "رَحْمَةٌ", read: "в остановке рахьмах", lat: "when stopping: rahmah", where: "2:157" },
          { ar: "عَلِيمًا", read: "в остановке 1алима", lat: "when stopping: alima", where: "4:11" },
          { ar: "ٱهْدِنَا", read: "ихдина — начали с и", lat: "ihdina — start with i", where: "1:6" },
          { ar: "وَالْكِتَابِ", read: "валь-китаби — хамзу пропустили", lat: "wal-kitabi — the hamza is dropped", where: "2:2" },
        ],
        mistakes: L(
          "Не читай маленькую хамзу в середине аята. И не оставляй танвин, когда уже остановился.",
          "Do not read the small hamza in the middle of an ayah. And do not keep the tanwin once you have stopped.",
          "لا تنطق همزة الوصل في وسط الآية. ولا تبقِ التنوين إذا وقفت.",
          "Jangan baca hamzah kecil di tengah ayat. Dan jangan kekalkan tanwin setelah berhenti.",
          "Ayetin ortasında küçük hemzeyi okuma. Ve durduktan sonra tenvini bırakma.",
          "آیت کے بیچ میں چھوٹی ہمزہ نہ پڑھیں۔ اور جب رک جائیں تو تنوین نہ رہنے دیں۔",
        ),
        quiz: [
          {
            q: L("С чего начинают «ихдина»?", "How do you start ihdina?", "بم تُبدأ «اهدنا»؟", "Dengan apa ihdina dimula?", "İhdina neyle başlar?", "اہْدِنَا کس سے شروع ہوتا ہے؟"),
            choices: [
              L("С и", "With i", "بالكسر", "Dengan i", "İ ile", "اِ سے"),
              L("С а", "With a", "بالفتح", "Dengan a", "A ile", "اَ سے"),
              L("Хамзу не читают и здесь", "The hamza is dropped here too", "لا تُنطق هنا أيضًا", "Di sini pun tidak dibaca", "Burada da okunmaz", "یہاں بھی نہیں پڑھی جاتی"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
  {
    id: "m9",
    title: L("9. Особые места Хафса", "9. The special places in Hafs", "٩. خصوص حفص", "9. Kekhususan Hafs", "9. Hafs'a özel yerler", "٩. حفص کی خاص جگہیں"),
    lessons: [
      {
        id: "hafs",
        tone: "plain",
        title: L("Сакт, ималя, тасхиль, ишмам", "Sakt, imala, tashil, ishmam", "السكت والإمالة والتسهيل والإشمام", "Sakt, imalah, tashil, isymam", "Sekt, imale, teshil, işmam", "سکت، امالہ، تسہیل، اشمام"),
        definition: L(
          "Это не для первого дня. Когда слово уже читается ровно, у Хафса остаются короткие особые места. Их мало, и они названы здесь все.",
          "This is not for the first day. When a word is already read evenly, a few special places remain in Hafs. There are not many, and they are all named here.",
          "هذا ليس لليوم الأول. إذا استوت الكلمة بقيت عند حفص مواضع خاصة قليلة. وهي مسماة هنا كلها.",
          "Ini bukan untuk hari pertama. Bila kata sudah rata, pada Hafs tinggal beberapa tempat yang khusus. Tidak banyak, dan semuanya disebut di sini.",
          "Bu ilk gün için değil. Kelime düzgün okununca Hafs'ta az sayıda özel yer kalır. Hepsi burada anılmıştır.",
          "یہ پہلے دن کے لیے نہیں۔ جب لفظ سیدھا پڑھا جائے تو حفص میں چند خاص جگہیں رہ جاتی ہیں۔ وہ سب یہاں نام سے ہیں۔",
        ),
        letters: "س · مجراها · ءأعجمي · تأمنا",
        mechanism: L(
          "Четыре задержки без вдоха: عِوَجًا قَيِّمًا، مَرْقَدِنَا هَٰذَا، مَن رَاقٍ، بَلْ رَانَ. В مَجْرَاهَا алиф ближе к и, только здесь. В أَأَعْجَمِيّ вторая хамза облегчена, между хамзой и алифом. В تَأْمَنَّا губы чуть идут к у, отдельного у нет. Раум и ишмам при обычной остановке — разрешённый выбор на у и и, не отдельный аят.",
          "Four holds without a breath: iwajan qayyima, marqadina hadha, man raq, bal rana. In majraha the alif is closer to i, only here. In a-a'jamiyy the second hamza is eased, between a hamza and an alif. In ta'manna the lips move a little toward u, with no separate u. Rawm and ishmam at an ordinary stop are an allowed choice on u and i, not a separate ayah.",
          "أربع سكتات بلا تنفس: عوجًا قيّمًا، مرقدنا هذا، من راق، بل ران. وفي «مجراها» الألف أقرب إلى الياء، هنا فقط. وفي «أأعجمي» تُسهَّل الهمزة الثانية بين الهمزة والألف. وفي «تأمنا» تتحرك الشفتان قليلًا نحو الضم بلا ضمة مستقلة. والروم والإشمام في الوقف العادي وجه جائز على الضم والكسر، ليسا آية مستقلة.",
          "Empat hentian tanpa napas: iwajan qayyima, marqadina hadha, man raq, bal rana. Pada majraha alif lebih dekat ke i, hanya di sini. Pada a-a'jamiyy hamzah kedua dipermudah, antara hamzah dan alif. Pada ta'manna bibir sedikit ke u, tanpa u yang tersendiri. Rawm dan isymam pada waqaf biasa ialah pilihan yang harus pada u dan i, bukan ayat yang tersendiri.",
          "Dört nefessiz duruş: ivecen kayyima, merkadina haza, men rak, bel rane. Mecraha'da elif yalnız burada i'ye daha yakındır. E-a'cemiyy'de ikinci hemze, hemze ile elif arasında hafifletilir. Te'menna'da dudaklar ayrı bir u olmadan hafifçe u'ya gider. Olağan vakıfta revm ve işmam, u ve i üzerinde caiz bir tercihtir, ayrı bir ayet değildir.",
          "چار رکاوٹیں بغیر سانس: عِوَجًا قَيِّمًا، مَرْقَدِنَا هَٰذَا، مَن رَاقٍ، بَلْ رَانَ۔ مَجْرَاهَا میں الف صرف یہیں اِ کے قریب ہے۔ أَأَعْجَمِيّ میں دوسری ہمزہ ہلکی ہے، ہمزہ اور الف کے بیچ۔ تَأْمَنَّا میں ہونٹ الگ اُ کے بغیر ہلکے سے اُ کی طرف جاتے ہیں۔ عام وقف پر روم اور اشمام اُ اور اِ پر جائز انتخاب ہیں، الگ آیت نہیں۔",
        ),
        examples: [
          { ar: "عِوَجًا قَيِّمًا", read: "1иважа · къаййима — без вдоха", lat: "iwaja · qayyima — no breath", where: "18:1-2" },
          { ar: "مَجْرَاهَا", read: "маджреха — а ближе к и", lat: "majraha — the a is closer to i", where: "11:41" },
          { ar: "أَأَعْجَمِيٌّ", read: "вторая хамза облегчена", lat: "the second hamza is eased", where: "41:44" },
          { ar: "تَأْمَنَّا", read: "губы чуть к у", lat: "the lips move a little toward u", where: "12:11" },
        ],
        mistakes: L(
          "Не делай ималю в других алифах. И не вдыхай на этих четырёх задержках.",
          "Do not put this imala on other alifs. And do not breathe in on these four holds.",
          "لا تجعل هذه الإمالة في ألف أخرى. ولا تتنفس في هذه السكتات الأربع.",
          "Jangan letakkan imalah ini pada alif yang lain. Dan jangan menarik napas pada empat hentian ini.",
          "Bu imaleyi başka eliflere koyma. Ve bu dört duruşta nefes alma.",
          "یہ امالہ دوسری الفوں پر نہ کریں۔ اور ان چار رکاوٹوں پر سانس نہ لیں۔",
        ),
        quiz: [
          {
            q: L("Где у Хафса алиф ближе к и?", "Where is the alif closer to i in Hafs?", "أين تكون الألف أقرب إلى الياء عند حفص؟", "Di mana alif lebih dekat ke i pada Hafs?", "Hafs'ta elif nerede i'ye daha yakındır?", "حفص میں الف کہاں اِ کے قریب ہے؟"),
            choices: [
              L("Только «маджраха»", "Only majraha", "«مجراها» فقط", "Hanya majraha", "Yalnız mecraha", "صرف مجراہا"),
              L("В каждой протяжке", "In every lengthening", "في كل مد", "Pada setiap mad", "Her medde", "ہر مد میں"),
              L("В «амана»", "In amana", "في «آمن»", "Pada amana", "Amene'de", "آمن میں"),
            ],
            answer: A(0),
          },
        ],
      },
    ],
  },
];

export const TAJWEED_FLAT: CourseLesson[] = TAJWEED_COURSE.flatMap((mod) => mod.lessons);
