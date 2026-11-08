import { TAJWEED_COURSE, type CourseLesson, type TajExample, type TajQuiz } from "./tajweed-course";
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

function card(ar: string, read: string, lat: string, ru: string, en: string, arN: string, id: string, tr: string, ur: string): TajExample {
  return { ar, read, lat, where: "знак", note: L(ru, en, arN, id, tr, ur) };
}

const soundKey: CourseLesson = {
  id: "sound-key",
  tone: "plain",
  title: L("Как записан звук", "How the sound is written", "كيف كُتب الصوت", "Bagaimana bunyi ditulis", "Ses nasıl yazılır", "آواز کیسے لکھی ہے"),
  definition: L(
    "Транскрипция здесь та же, что в Коране приложения. Обычные б, т, д пишутся как слышатся. Восемь звуков помечены особо, чтобы их не спутать.",
    "The transcription here is the same as in the Quran of this app. Ordinary b, t and d are written as they sound. Eight sounds are marked, so they are not mixed up.",
    "الرسم هنا هو نفسه في قرآن التطبيق. ثمانية أصوات مميزة حتى لا تختلط.",
    "Tulisan di sini sama seperti dalam Al-Qur'an aplikasi. Lapan bunyi ditanda supaya tidak tertukar.",
    "Yazılış, uygulamadaki Kur'an ile aynıdır. Sekiz ses karışmasın diye işaretlidir.",
    "یہ لکھائی اسی ایپ کے قرآن جیسی ہے۔ آٹھ آوازیں الگ نشان سے ہیں تاکہ گڈمڈ نہ ہوں۔",
  ),
  letters: "хь · х · х1 · 1 · г1 · къ · д1 · т1",
  mechanism: L(
    "хь — ح, тихий звук из середины горла. Не х.\nх — خ, хриплый звук выше, ближе ко рту.\nх1 — ه, лёгкий выдох из низа горла. В «Аллах1» палочка входит в знак «х1»: это ه, не цифра и не ع.\n1 — ع, только когда палочка стоит сама: «1а», «1айн». Это сжатие в середине горла.\nг1 — غ. къ — ق, глубже, чем к. д1 — ض, край языка. т1 — ط, полный рот, не обычное т.",
    "h with a soft mark is ha from the middle of the throat, not kh. kh is the rough sound higher up. The light breath of ha at the bottom of the throat is the h in Allah. Ayn is a squeeze in the middle of the throat. Ghayn, qaf, dad and the heavy ta each have their own mark.",
    "ح من وسط الحلق، خ من أعلاه، ه من أسفله. ع عصر في الوسط. غ من أعلى الحلق بصوت. ق أعمق من ك. ض من الحافة. ط مفخمة.",
    "Ha dari tengah halkum, kha lebih ke atas, ha ringan dari pangkal. Ain ialah himpitan. Ghain, qaf, dad dan ta tebal ada tanda sendiri.",
    "Ha boğazın ortası, hı daha yukarı, he en altta. Ayn ortada sıkışmadır. Ğayn, qaf, dad ve kalın tı ayrı işaretlidir.",
    "ح حلق کے بیچ، خ اوپر، ہ نیچے ہلکی پھونک۔ ع بیچ میں دباؤ۔ غ، ق، ض اور بھاری ط الگ نشان۔",
  ),
  examples: [
    card("حَ", "хьа", "ḥa", "Середина горла. Воздух идёт свободно, без хрипа и без голоса в связках. Это не خ и не ه.", "Middle of the throat. The air passes freely, with no rasp and no vocal buzz. Not kha and not ha.", "وسط الحلق. الهواء حر بلا خشونة. ليست خاء ولا هاء.", "Tengah halkum. Udara bebas, tanpa kasar. Bukan kha dan bukan ha.", "Boğazın ortası. Hava hırıltısız akar. Hı değil, he değil.", "حلق کا بیچ۔ ہوا بغیر کھردراہٹ۔ خ نہیں، ہ نہیں۔"),
    card("خَ", "ха", "kha", "Верх горла, ближе ко рту. Тот же участок, что у غ, но без голоса: слышен хриплый х.", "Top of the throat, nearer the mouth. The same place as ghayn, but with no voice: a rough kh.", "أعلى الحلق، مكان الغين، بلا جهر.", "Hujung halkum, tempat ghain, tanpa suara.", "Boğazın üstü, ğayn ile aynı yer, sessiz.", "حلق کا اوپر، غ کی جگہ، بغیر آواز۔"),
    card("هَ", "х1а", "ha", "Самый низ горла, лёгкий выдох. В «Аллах1» это х1. Не середина горла и не хриплый х.", "The very bottom of the throat, a light breath. In Allah this is the final h. Not the middle of the throat and not kh.", "أقصى الحلق، نفس خفيف. ليست حاء ولا خاء.", "Pangkal halkum, hembusan ringan. Bukan ha tengah dan bukan kha.", "Boğazın en altı, hafif nefes. Ha değil, hı değil.", "حلق کا سب سے نیچے، ہلکی پھونک۔ ح نہیں، خ نہیں۔"),
    card("عَ", "1а", "ʿa", "Середина горла, тот же участок, что у ح, но со сжатием. Палочка сама по себе — буква ع. В «Аллах1» палочка не эта: там х1.", "Middle of the throat, the same place as ha, but with a squeeze. A stick on its own is ayn. The stick in Allah is not this: that is the light h.", "وسط الحلق مع العصر. العلامة وحدها عين، وفي لفظ الجلالة الهاء.", "Tengah halkum dengan himpitan. Tanda bersendirian ialah ain.", "Boğazın ortası, sıkışmayla. İşaret tek başına ayn'dır.", "حلق کا بیچ، دباؤ کے ساتھ۔ اکیلے نشان سے ع ہے۔"),
    card("غَ", "г1а", "gha", "Верх горла, как خ, но со голосом. Не к и не х.", "Top of the throat, like kha, but with the voice. Not k and not kh.", "أعلى الحلق كالخاء، لكن بجهر.", "Hujung halkum seperti kha, tetapi bersuara.", "Boğazın üstü, hı gibi, ama sesli.", "حلق کا اوپر، خ کی طرح، مگر آواز کے ساتھ۔"),
    card("قَ", "къа", "qa", "Корень языка у мягкого нёба, глубже ك. Две точки сверху.", "The root of the tongue at the soft palate, deeper than kaf. Two dots above.", "أقصى اللسان عند الحنك اللحمي، أعمق من الكاف.", "Pangkal lidah di lelangit lembut, lebih dalam daripada kaf.", "Dil kökü yumuşak damakta, kaftan derin.", "زبان کی جڑ نرم تالو پر، ک سے گہری۔"),
    card("ضَ", "д1а", "ḍa", "Один или оба края языка у верхних коренных. Воздух выходит сбоку. Полный рот. Это не د.", "One or both edges of the tongue at the upper molars. The air comes out along the side. A full mouth. Not dal.", "حافة اللسان عند الأضراس. الهواء من الجانب. ليست دالًا.", "Tepi lidah di geraham. Udara dari sisi. Bukan dal.", "Dil kenarı azı dişlerinde. Hava yandan. Dal değil.", "زبان کا کنارہ داڑھوں پر۔ ہوا سائیڈ سے۔ د نہیں۔"),
    card("طَ", "т1а", "ṭa", "Тот же кончик языка, что у ت: у корней верхних резцов, за зубами. Рот полный, корень языка поднят. Не межзубный звук.", "The same tongue tip as ta: at the roots of the upper teeth, behind them. The mouth is full and the root of the tongue is raised. Not between the teeth.", "كمخرج التاء، مع التفخيم. ليست بين الأسنان.", "Sama tempat ta, tetapi tebal. Bukan antara gigi.", "Te ile aynı yer, ama kalın. Dişler arası değil.", "ت کی جگہ، مگر موٹی۔ دانتوں کے بیچ نہیں۔"),
  ],
  mistakes: L(
    "Не читай ح как خ и ه как ح. Не пропускай палочку ع: без неё слово другое.",
    "Do not read ha as kha, or the light ha as the middle ha. Do not skip ayn: without it the word is another word.",
    "لا تقرأ الحاء خاءً ولا الهاء حاءً. لا تسقط العين.",
    "Jangan baca ha sebagai kha, atau ha ringan sebagai ha tengah. Jangan gugurkan ain.",
    "Ha'yı hı, he'yi ha yapma. Ayn'ı düşürme.",
    "ح کو خ اور ہ کو ح نہ پڑھیں۔ ع کو نہ چھوڑیں۔",
  ),
  quiz: [
    Q(L("Как пишется ح?", "How is ha written?", "كيف تُكتب الحاء؟", "Bagaimana ha ditulis?", "Ha nasıl yazılır?", "ح کیسے لکھی جاتی ہے؟"), L("хь", "a soft h", "حاء", "ha lembut", "yumuşak ha", "نرم ح"), L("х", "kh", "خاء", "kha", "hı", "خ"), L("х1", "a light breath", "هاء", "ha ringan", "he", "ہ"), 0),
    Q(L("Что значит палочка в «Аллах1»?", "What does the mark in Allah stand for?", "ماذا تعني العلامة في «Аллах1»؟", "Apa tanda pada Allah?", "Allah yazısındaki işaret neyi gösterir?", "اللہ کی لکھی میں نشان کیا ہے؟"), L("Это х1: буква ه. Не цифра и не ع", "It is the light h. Not a number and not ayn", "هي الهاء. ليست رقمًا ولا عينًا", "Ia ha ringan. Bukan nombor dan bukan ain", "Hafif he'dir. Rakam değil, ayn değil", "یہ ہ ہے۔ نمبر نہیں اور ع نہیں"), L("Это буква ع", "It is ayn", "هي العين", "Ia ain", "Ayn'dır", "یہ ع ہے"), L("Это номер один", "It is the number one", "هي الرقم واحد", "Ia nombor satu", "Bir rakamıdır", "یہ نمبر ایک ہے"), 0),
    Q(L("къ — это какая буква?", "Which letter is q?", "ما حرف «къ»؟", "Huruf manakah q?", "Q hangi harftir?", "къ کون سا حرف ہے؟"), L("ق", "Qaf", "ق", "Qaf", "Qaf", "ق"), L("ك", "Kaf", "ك", "Kaf", "Kaf", "ک"), L("غ", "Ghayn", "غ", "Ghain", "Ğayn", "غ"), 0),
  ],
};

const letters: CourseLesson = {
  id: "letters",
  tone: "plain",
  title: L("ا ب ت ث ج ح خ", "Alif to kha", "من الألف إلى الخاء", "Alif hingga kha", "Eliften ha'ya", "الف سے خ تک"),
  definition: L(
    "Семь первых букв и хамза. Сверху — буква со звуком «а». Под ней — как её писать в этом приложении и чем она отличается от соседней.",
    "The first letters, and hamza. Above is the letter with a. Under it is how this app writes it, and how it differs from the one beside it.",
    "الحروف الأولى مع الهمزة. فوق الحرف بفتح، وتحته كيف يُكتب وبم يتميز.",
    "Huruf pertama dan hamzah. Di atas huruf dengan a. Di bawah, bagaimana ia ditulis dan bezanya.",
    "İlk harfler ve hemze. Üstte a'lı harf. Altında yazılışı ve komşusundan farkı.",
    "پہلے حروف اور ہمزہ۔ اوپر الف کے ساتھ حرف۔ نیچے لکھائی اور پڑوسی سے فرق۔",
  ),
  letters: "ا أ ب ت ث ج ح خ",
  mechanism: L(
    "Точки меняют букву. ب одна снизу, ت две сверху, ث три сверху. ج одна снизу, ح без точек, خ точка сверху.\nا не соединяется со следующей. Хамза — обрыв голоса, её ставят на алиф, вав или йа.",
    "The dots change the letter. One below is ba, two above is ta, three above is tha. One below is jim, none is ha, one above is kha.\nAlif does not join to the next letter. Hamza is a stop in the voice. It sits on alif, waw or ya.",
    "النقط تغيّر الحرف. الألف لا تتصل بما بعدها. الهمزة قطع للصوت على الألف أو الواو أو الياء.",
    "Titik menukar huruf. Alif tidak bersambung ke berikut. Hamzah ialah hentian suara.",
    "Noktalar harfi değiştirir. Elif sonrakine bağlanmaz. Hemze seste bir kesiktir.",
    "نقطے حرف بدلتے ہیں۔ الف اگلے سے نہیں جڑتی۔ ہمزہ آواز کا کٹاؤ ہے۔",
  ),
  examples: [
    card("ا", "аа", "aa", "Алиф сам не согласный. Долгий «аа» слышен только после фатхи: بَا = баа. Со следующей не соединяется: ا ـا.", "Alif is not a consonant. The long aa is heard only after a fat-ha. It does not join forward.", "الألف ليست صامتًا. المد بعد الفتحة فقط.", "Alif bukan konsonan. Aa panjang hanya selepas fat-hah.", "Elif ünsüz değildir. Uzun aa yalnız fethadan sonra.", "الف خود حرف نہیں۔ لمبی ا صرف فتحہ کے بعد۔"),
    card("أَ", "ъа", "'a", "Хамза — смычка в самом низу горла, затем гласный. إِ = и, أُ = у. Это не алиф и не ع.", "Hamza is a closure at the very bottom of the throat, then the vowel. Not alif and not ayn.", "الهمزة إغلاق في أقصى الحلق ثم الحركة. ليست ألفًا ولا عينًا.", "Hamzah tutup di pangkal halkum, kemudian vokal.", "Hemze boğazın en altında kapanıştır. Elif değil, ayn değil.", "ہمزہ حلق کے نیچے بندش ہے۔ الف نہیں، ع نہیں۔"),
    card("بَ", "ба", "ba", "Обе губы смыкаются. Зубы не участвуют. Одна точка снизу. Формы: ب بـ ـبـ ـب.", "Both lips close. The teeth do not take part. One dot below.", "الشفتان. الأسنان لا دخل لها. نقطة تحت.", "Kedua-dua bibir rapat. Gigi tidak terlibat.", "İki dudak kapanır. Dişler karışmaz.", "دونوں ہونٹ بند ہوتے ہیں۔ دانت شامل نہیں۔"),
    card("تَ", "та", "ta", "Кончик языка у корней верхних резцов, за зубами, не между ними. Две точки сверху. Формы: ت تـ ـتـ ـت.", "The tongue tip at the roots of the upper teeth, behind them, not between them. Two dots above.", "طرف اللسان عند أصول الثنايا، لا بين الأسنان.", "Hujung lidah di pangkal gigi atas, bukan antara gigi.", "Dil ucu üst diş köklerinde, dişler arasında değil.", "زبان کی نوک دانتوں کی جڑ پر، بیچ میں نہیں۔"),
    card("ثَ", "са между зубами", "tha", "Кончик языка между зубами. Мягкий свист, не س. Три точки сверху. Формы: ث ثـ ـثـ ـث.", "The tongue tip between the teeth. A soft hiss, not sin. Three dots above.", "بين الأسنان. ليست سينًا. ثلاث نقط.", "Antara gigi. Bukan sin. Tiga titik.", "Dişler arasında. Sin değil. Üç nokta.", "دانتوں کے بیچ۔ س نہیں۔ تین نقطے۔"),
    card("جَ", "джа", "ja", "Середина языка к нёбу, со голосом. Одна точка снизу. Формы: ج جـ ـجـ ـج.", "The middle of the tongue toward the palate, with the voice. One dot below.", "وسط اللسان نحو الحنك بجهر. نقطة تحت.", "Tengah lidah ke lelangit, bersuara.", "Dilin ortası damağa, sesli.", "زبان کا بیچ تالو کی طرف، آواز کے ساتھ۔"),
    card("حَ", "хьа", "ha", "Середина горла. Воздух идёт свободно, без хрипа и без голоса. Не خ и не ه. Без точки. Формы: ح حـ ـحـ ـح.", "Middle of the throat. The air passes freely, with no rasp and no voice. Not kha and not ha. No dot.", "وسط الحلق. الهواء حر بلا خشونة ولا جهر. ليست خاء ولا هاء.", "Tengah halkum. Udara bebas, tanpa kasar dan tanpa suara. Bukan kha dan bukan ha.", "Boğazın ortası. Hava hırıltısız, sessiz. Hı değil, he değil.", "حلق کا بیچ۔ ہوا بغیر کھردراہٹ اور بغیر آواز۔ خ نہیں، ہ نہیں۔"),
    card("خَ", "ха", "kha", "Верх горла, хрип трения, без голоса. Одна точка сверху. Формы: خ خـ ـخـ ـخ.", "Top of the throat, a rasp, with no voice. One dot above.", "أعلى الحلق، احتكاك بلا جهر. نقطة فوق.", "Hujung halkum, geseran tanpa suara.", "Boğazın üstü, sürtünme, sessiz.", "حلق کا اوپر، رگڑ، بغیر آواز۔"),
  ],
  mistakes: L(
    "Не читай голую букву сразу как «ба». Сначала согласный, гласный даёт знак. Не путай число точек.",
    "Do not read a bare letter as ba at once. The vowel comes from the sign. Do not mix up the number of dots.",
    "لا تقرأ الحرف الساكن مفتوحًا. لا تخلط عدد النقط.",
    "Jangan baca huruf terus sebagai ba. Jangan tertukar bilangan titik.",
    "Çıplak harfi hemen ba diye okuma. Nokta sayısını karıştırma.",
    "خالی حرف کو فوراً با نہ پڑھیں۔ نقطوں کی گنتی نہ بھولیں۔",
  ),
  quiz: [
    Q(L("Сколько точек у ث?", "How many dots does tha have?", "كم نقطة للثاء؟", "Berapa titik tsa?", "Se'nin kaç noktası var?", "ث کے کتنے نقطے ہیں؟"), L("Три сверху", "Three above", "ثلاث فوق", "Tiga di atas", "Üstte üç", "اوپر تین"), L("Одна снизу", "One below", "واحدة تحت", "Satu di bawah", "Altta bir", "نیچے ایک"), L("Нет точек", "None", "لا نقط", "Tiada", "Yok", "کوئی نہیں"), 0),
    Q(L("Чем ح отличается от خ?", "How does ha differ from kha?", "بم تختلف الحاء عن الخاء؟", "Apa bezanya ha dan kha?", "Ha ile hı nasıl ayrılır?", "ح اور خ میں کیا فرق ہے؟"), L("хь тихая и без точки, х хриплая и с точкой", "Ha is quiet and has no dot. Kha is rough and has a dot", "الحاء بلا نقطة والخاء بنقطة", "Ha tanpa titik, kha bertitik", "Ha noktasız, hı noktalı", "ح بغیر نقطہ، خ نقطے کے ساتھ"), L("Ничем", "Nothing", "لا شيء", "Tiada", "Hiç", "کچھ نہیں"), L("Только длиной", "Only the length", "بالمد فقط", "Hanya panjang", "Yalnızca uzunluk", "صرف لمبائی"), 0),
    Q(L("ا соединяется со следующей буквой?", "Does alif join to the next letter?", "هل تتصل الألف بما بعدها؟", "Adakah alif bersambung ke huruf berikut?", "Elif sonrakine bağlanır mı?", "کیا الف اگلے حرف سے جڑتی ہے؟"), L("Нет", "No", "لا", "Tidak", "Hayır", "نہیں"), L("Да, всегда", "Yes, always", "نعم دائمًا", "Ya, sentiasa", "Evet, hep", "ہاں، ہمیشہ"), L("Только в середине", "Only in the middle", "في الوسط فقط", "Hanya di tengah", "Yalnızca ortada", "صرف بیچ میں"), 0),
  ],
};

const letters2: CourseLesson = {
  id: "letters-2",
  tone: "plain",
  title: L("د ذ ر ز س ش ص", "Dal to sad", "من الدال إلى الصاد", "Dal hingga sad", "Dalden sad'a", "د سے ص تک"),
  definition: L(
    "Дальше зубные и свистящие. د ذ ر ز не тянут черту к следующей букве. س и ص — один свист, у ص полный рот. ش — середина языка, не свист кончика.",
    "Next are the dental letters and the whistling ones. Dal, dhal, ra and zay do not join forward. Sin and sad share one whistle; sad fills the mouth. Shin is the middle of the tongue, not a tip whistle.",
    "ثم حروف الأسنان والصفير. د ذ ر ز لا تتصل بما بعدها. السين والصاد صفير واحد والصاد بفم ممتلئ. الشين من وسط اللسان.",
    "Kemudian huruf gigi dan yang bersiul. Dal, dzal, ra dan zay tidak bersambung ke depan.",
    "Sonra diş ve ıslık harfleri. Dal, zel, ra ve ze ileriye bağlanmaz.",
    "پھر دانت اور سیٹی والے حروف۔ د ذ ر ز آگے نہیں جڑتے۔",
  ),
  letters: "د ذ ر ز س ش ص",
  mechanism: L(
    "ذ — кончик языка между зубами, со голосом. ز — узкая щель у нижних резцов, свист, язык не между зубами. В записи обе «з», звук разный.\nس — тот же свист, без голоса. ص — то же место, но рот полный и корень языка поднят. ش — середина языка, не свист кончика.",
    "Dhal: the tongue tip between the teeth, with the voice. Zay: a narrow gap by the lower teeth, a whistle, and the tongue is not between the teeth. Both are written z, but the sound differs.\nSin: the same whistle as zay, with no voice. Sad: the same place, but the mouth is full and the root of the tongue is raised. Shin: the middle of the tongue, not a tip whistle.",
    "الذال بين الأسنان بجهر. الزاي صفير من ضيق عند الثنايا السفلى، واللسان ليس بين الأسنان. السين الصفير نفسه بلا جهر. الصاد من مكان السين مع رفع أقصى اللسان. الشين من وسط اللسان.",
    "Dzal: hujung lidah antara gigi, bersuara. Zay: siul di celah gigi bawah, lidah bukan antara gigi. Kedua-duanya ditulis z, bunyinya lain.\nSin: siul yang sama, tanpa suara. Sad: tempat yang sama, mulut penuh. Syin: tengah lidah, bukan siul hujung.",
    "Zel: dil ucu dişlerin arasında, sesli. Ze: alt dişlerde ıslık, dil dişler arasında değil. İkisi de z yazılır, ses ayrıdır.\nSin: aynı ıslık, sessiz. Sad: aynı yer, ağız dolu. Şin: dilin ortası, uç ıslığı değil.",
    "ذ: زبان کی نوک دانتوں کے بیچ، آواز کے ساتھ۔ ز: نیچے کے دانتوں پر سیٹی، زبان بیچ میں نہیں۔ دونوں ز لکھی جاتی ہیں، آواز الگ۔\nس: وہی سیٹی، بغیر آواز۔ ص: وہی جگہ، بھرا منہ۔ ش: زبان کا بیچ، نوک کی سیٹی نہیں۔",
  ),
  examples: [
    card("دَ", "да", "da", "Кончик языка у корней верхних резцов, за зубами, не между ними. Со голосом, рот не полный. Со следующей не соединяется: د ـد.", "The tongue tip at the roots of the upper teeth, behind them, not between them. With the voice. The mouth is not full. It does not join forward.", "طرف اللسان عند أصول الثنايا، خلف الأسنان لا بينها، بجهر.", "Hujung lidah di pangkal gigi atas, di belakang gigi, bukan antara gigi. Bersuara.", "Dil ucu üst diş köklerinde, dişlerin ardında, aralarında değil. Sesli.", "زبان کی نوک اوپر کے دانتوں کی جڑ پر، دانتوں کے پیچھے، بیچ میں نہیں۔ آواز کے ساتھ۔"),
    card("ذَ", "за между зубами", "dha", "Кончик языка между зубами, со голосом. Точка сверху. Не свистящая ز. Со следующей не соединяется: ذ ـذ.", "The tongue tip between the teeth, with the voice. A dot above. Not the whistling zay. It does not join forward.", "بين الأسنان بجهر. نقطة فوق. ليست زايًا.", "Antara gigi, bersuara. Titik di atas. Bukan zay yang bersiul.", "Dişler arasında, sesli. Üstte nokta. Islıklı ze değil.", "دانتوں کے بیچ، آواز کے ساتھ۔ اوپر نقطہ۔ سیٹی والی ز نہیں۔"),
    card("رَ", "ра", "ra", "Кончик языка один раз легко касается десны верхних резцов. Не дрожи, как русское р. Со следующей не соединяется: ر ـر.", "The tongue tip taps the gum of the upper teeth once, lightly. Do not trill it like a Russian r. It does not join forward.", "طرف اللسان، ضربة واحدة خفيفة على اللثة، بلا تكرار.", "Hujung lidah sekali ringan pada gusi. Jangan digetar.", "Dil ucu üst diş etine bir kez hafif değer. Titretme.", "زبان کی نوک اوپر کے مسوڑھے پر ایک ہلکی ضرب۔ کانپائیں نہیں۔"),
    card("زَ", "за со свистом", "za", "Узкая щель у нижних резцов, воздух свистит, со голосом. Язык не между зубами. Точка сверху. Не ذ. Со следующей не соединяется: ز ـز.", "A narrow gap by the lower teeth. The air whistles, with the voice. The tongue is not between the teeth. A dot above. Not dhal. It does not join forward.", "صفير من ضيق عند الثنايا السفلى بجهر. اللسان ليس بين الأسنان. ليست ذالًا.", "Siu dari celah gigi bawah, bersuara. Lidah bukan antara gigi. Bukan dzal.", "Alt dişlerde dar aralıktan ıslık, sesli. Dil dişler arasında değil. Zel değil.", "نیچے کے دانتوں پر تنگ شگاف، سیٹی، آواز کے ساتھ۔ زبان بیچ میں نہیں۔ ذ نہیں۔"),
    card("سَ", "са со свистом", "sa", "То же место, что у ز: узкая щель у нижних резцов, свист, но без голоса. Тонкий рот. Не ث и не ص. Формы: س سـ ـسـ ـس.", "The same place as zay: a narrow gap by the lower teeth, a whistle, but with no voice. A light mouth. Not tha and not sad.", "كمخرج الزاي بصفير بلا جهر. ليست ثاء ولا صادًا.", "Tempat yang sama dengan zay: siul, tanpa suara. Bukan tsa dan bukan sad.", "Ze ile aynı yer: ıslık, sessiz. Se değil, sad değil.", "ز کی جگہ: سیٹی، بغیر آواز۔ ث نہیں، ص نہیں۔"),
    card("شَ", "ша", "sha", "Середина языка к нёбу. Не кончик и не свист س. Три точки сверху. Формы: ش شـ ـشـ ـش.", "The middle of the tongue toward the palate. Not the tip, and not the whistle of sin. Three dots above.", "وسط اللسان نحو الحنك. ليست صفير الطرف. ثلاث نقط.", "Tengah lidah ke lelangit. Bukan hujung dan bukan siul sin. Tiga titik.", "Dilin ortası damağa. Uç değil, sin ıslığı değil. Üç nokta.", "زبان کا بیچ تالو کی طرف۔ نوک نہیں، س کی سیٹی نہیں۔ تین نقطے۔"),
    card("صَ", "са, полный рот", "sad", "То же место свиста, что у س, без голоса. Корень языка поднят, рот полный. Не ث и не ز. Формы: ص صـ ـصـ ـص.", "The same whistling place as sin, with no voice. The root of the tongue is raised and the mouth is full. Not tha and not zay.", "كمخرج السين بلا جهر، مع رفع أقصى اللسان وامتلاء الفم. ليست ثاء ولا زايًا.", "Tempat siul yang sama dengan sin, tanpa suara. Belakang lidah terangkat, mulut penuh. Bukan tsa dan bukan zay.", "Sin ile aynı ıslık yeri, sessiz. Dil arkası kalkık, ağız dolu. Se değil, ze değil.", "س کی سیٹی والی جگہ، بغیر آواز۔ زبان کا پچھلا حصہ اٹھا، منہ بھرا۔ ث نہیں، ز نہیں۔"),
  ],
  mistakes: L(
    "Не дрожи ра. Не делай ذ и ز одним звуком: у ذ язык между зубами, у ز свист.",
    "Do not trill the ra. Do not make dhal and zay one sound: dhal is between the teeth, zay is a whistle.",
    "لا تكرر الراء. لا تجعل الذال والزاي صوتًا واحدًا.",
    "Jangan getarkan ra. Jangan jadikan dzal dan zay satu bunyi.",
    "Ra'yı titretme. Zel ile ze'yi bir ses yapma.",
    "ر کو مت کانپائیں۔ ذ اور ز کو ایک آواز نہ بنائیں۔",
  ),
  quiz: [
    Q(L("Какие из этих букв не соединяются со следующей?", "Which of these do not join forward?", "أيها لا تتصل بما بعدها؟", "Yang mana tidak bersambung ke depan?", "Hangileri ileriye bağlanmaz?", "ان میں سے کون آگے نہیں جڑتے؟"), L("د ذ ر ز", "Dal, dhal, ra and zay", "د ذ ر ز", "Dal dzal ra zay", "Dal zel ra ze", "د ذ ر ز"), L("س ش ص", "Sin, shin and sad", "س ش ص", "Sin syin sad", "Sin şin sad", "س ش ص"), L("Только س", "Only sin", "السين فقط", "Sin sahaja", "Yalnızca sin", "صرف س"), 0),
    Q(L("Где язык у ذ?", "Where is the tongue for dhal?", "أين اللسان في الذال؟", "Di mana lidah pada dzal?", "Zel'de dil nerededir?", "ذ میں زبان کہاں ہے؟"), L("Между зубами", "Between the teeth", "بين الأسنان", "Di antara gigi", "Dişlerin arasında", "دانتوں کے بیچ"), L("В горле", "In the throat", "في الحلق", "Di halkum", "Boğazda", "حلق میں"), L("На губах", "On the lips", "على الشفتين", "Pada bibir", "Dudaklarda", "ہونٹوں پر"), 0),
    Q(L("Чем ص тяжелее س?", "How is sad heavier than sin?", "بم الصاد أغلظ من السين؟", "Mengapa sad lebih tebal daripada sin?", "Sad neden sin'den kalındır?", "ص س سے کیسے موٹی ہے؟"), L("Полным ртом", "By a full mouth", "بتفخيم الفم", "Dengan mulut penuh", "Ağız dolu olarak", "بھرے منہ سے"), L("Тремя точками", "By three dots", "بثلاث نقط", "Dengan tiga titik", "Üç noktayla", "تین نقطوں سے"), L("Ничем", "By nothing", "بلا فرق", "Tiada beza", "Hiç", "کچھ نہیں"), 0),
  ],
};

const letters3: CourseLesson = {
  id: "letters-3",
  tone: "plain",
  title: L("ض ط ظ ع غ ف ق", "Dad to qaf", "من الضاد إلى القاف", "Dad hingga qaf", "Dadden qaf'a", "ض سے ق تک"),
  definition: L(
    "Здесь самые частые подмены. д1 — не д. т1 — не т. 1 — не хамза. къ — не к. Читай место, не похожую букву.",
    "These are the letters most often swapped. Dad is not dal. The heavy ta is not ta. Ayn is not hamza. Qaf is not kaf. Read the place, not the letter that looks easier.",
    "هنا أكثر الحروف خلطًا. الضاد ليست دالًا، والطاء ليست تاءً، والعين ليست همزة، والقاف ليست كافًا.",
    "Di sinilah huruf paling mudah tertukar. Dad bukan dal. Ta tebal bukan ta. Ain bukan hamzah. Qaf bukan kaf.",
    "En çok karışanlar burada. Dad dal değildir. Kalın tı te değildir. Ayn hemze değildir. Qaf kaf değildir.",
    "یہاں سب سے زیادہ الجھن ہے۔ ض د نہیں۔ ط ت نہیں۔ ع ہمزہ نہیں۔ ق ک نہیں۔",
  ),
  letters: "ض ط ظ ع غ ف ق",
  mechanism: L(
    "ض — край языка у верхних коренных, воздух сбоку, рот полный.\nط — кончик как у ت, за верхними зубами, но корень языка поднят.\nظ — язык между зубами, как у ذ, и рот полный.\nع — сжатие в середине горла. غ — верх горла со голосом, как خ, но звонко.",
    "Dad: one or both edges of the tongue at the upper molars. The air comes out along the side. The mouth is full.\nThe heavy ta: the same tongue tip as ta, at the roots of the upper teeth, behind them, not between them. The root of the tongue is raised.\nZa: the tongue between the teeth, like dhal, with the voice, and the mouth is full.\nAyn: a squeeze in the middle of the throat, not the closure of hamza. Ghayn: the top of the throat, like kha, but with the voice.",
    "الضاد من الحافة. الطاء مفخمة. الظاء كالذال مفخمة. العين من وسط الحلق والغين من أعلاه.",
    "Dad dari tepi lidah. Ta tebal. Za seperti dzal tetapi tebal. Ain di tengah halkum, ghain di hujung.",
    "Dad dil kenarı. Kalın tı. Zı, kalın zel gibidir. Ayn boğazın ortası, ğayn üstü.",
    "ض زبان کے کنارے سے۔ ط بھاری۔ ظ بھاری ذ کی طرح۔ ع حلق کے بیچ، غ اوپر۔",
  ),
  examples: [
    card("ضَ", "д1а", "ḍa", "Край языка прижат к верхним коренным, воздух идёт сбоку. Рот полный. Не د и не ظ. Формы: ض ضـ ـضـ ـض.", "The edge of the tongue is against the upper molars, and the air comes out along the side. The mouth is full. Not dal and not za.", "حافة اللسان عند الأضراس، والهواء من الجانب. ليست دالًا ولا ظاء.", "Tepi lidah di geraham, udara dari sisi. Bukan dal dan bukan za.", "Dil kenarı azılarda, hava yandan. Dal değil, zı değil.", "زبان کا کنارہ داڑھوں پر، ہوا سائیڈ سے۔ د نہیں، ظ نہیں۔"),
    card("طَ", "т1а", "ṭa", "Кончик языка у корней верхних резцов, за зубами, без голоса. Корень языка поднят, рот полный. Не ت и не межзубный. Формы: ط طـ ـطـ ـط.", "The tongue tip at the roots of the upper teeth, behind them, with no voice. The root of the tongue is raised and the mouth is full. Not ta and not between the teeth.", "كمخرج التاء مع رفع أقصى اللسان. ليست تاء ولا بين الأسنان.", "Sama tempat ta, dengan belakang lidah terangkat. Bukan ta dan bukan antara gigi.", "Te ile aynı yer, dil arkası kalkık. Te değil, dişler arası değil.", "ت کی جگہ، زبان کا پچھلا حصہ اٹھا۔ ت نہیں، دانتوں کے بیچ نہیں۔"),
    card("ظَ", "за между зубами, полный рот", "ẓa", "Язык между зубами, со голосом, и рот полный. Точка сверху. Не ذ без полноты и не ز. Формы: ظ ظـ ـظـ ـظ.", "The tongue between the teeth, with the voice, and the mouth full. A dot above. Not a light dhal and not zay.", "بين الأسنان بجهر وتفخيم. ليست ذالًا مرققة ولا زايًا.", "Antara gigi, bersuara dan tebal. Bukan dzal nipis dan bukan zay.", "Dişler arasında, sesli ve kalın. İnce zel değil, ze değil.", "دانتوں کے بیچ، آواز اور بھرا منہ۔ پتلی ذ نہیں، ز نہیں۔"),
    card("عَ", "1а", "ʿa", "Середина горла сжимается, голос идёт. Без точек. Не обрыв хамзы и не долгий алиф. Формы: ع عـ ـعـ ـع.", "The middle of the throat tightens, and the voice passes. No dots. Not the closure of hamza and not a long alif.", "وسط الحلق مع العصر والجهر. ليست همزة ولا ألف مد.", "Tengah halkum menghimpit, bersuara. Bukan hamzah dan bukan alif mad.", "Boğazın ortası sıkışır, sesli. Hemze değil, med elif değil.", "حلق کا بیچ دبتا ہے، آواز کے ساتھ۔ ہمزہ نہیں، مد کی الف نہیں۔"),
    card("غَ", "г1а", "gha", "Верх горла, как у خ, но связки звучат. Точка сверху. Не х и не к. Формы: غ غـ ـغـ ـغ.", "Top of the throat, like kha, but the vocal cords sound. A dot above. Not kh and not k.", "أعلى الحلق كالخاء بجهر. نقطة فوق.", "Hujung halkum seperti kha, bersuara. Titik di atas.", "Boğazın üstü, hı gibi ama sesli. Üstte nokta.", "حلق کا اوپر، خ کی طرح مگر آواز کے ساتھ۔ اوپر نقطہ۔"),
    card("فَ", "фа", "fa", "Внутренняя сторона нижней губы у верхних резцов. Верхняя губа не смыкается. Одна точка сверху. Формы: ف فـ ـفـ ـف.", "The inside of the lower lip at the upper teeth. The upper lip does not close on it. One dot above.", "باطن الشفة السفلى مع الثنايا العليا. ليست من الشفتين معًا.", "Bahagian dalam bibir bawah di gigi atas. Bukan kedua-dua bibir.", "Alt dudağın içi üst dişlerde. İki dudak birden değil.", "نیچے کے ہونٹ کا اندر اوپر کے دانتوں پر۔ دونوں ہونٹ نہیں۔"),
    card("قَ", "къа", "qa", "Корень языка у мягкого нёба, глубже ك. Воздух не выходит свободно, как у ك. Это не к и не г. Две точки сверху. Формы: ق قـ ـقـ ـق.", "The root of the tongue at the soft palate, deeper than kaf. The breath does not rush out as it does for kaf. Not k and not a voiced g. Two dots above.", "أقصى اللسان عند الحنك اللحمي، أعمق من الكاف. النفس لا يجري كما في الكاف. ليست كافًا ولا غينًا.", "Pangkal lidah di lelangit lembut, lebih dalam daripada kaf. Nafas tidak keluar bebas seperti kaf. Bukan kaf dan bukan g bersuara.", "Dil kökü yumuşak damakta, kaftan derin. Nefes kaftaki gibi serbest çıkmaz. Kaf değil, sesli g değil.", "زبان کی جڑ نرم تالو پر، ک سے گہری۔ سانس ک کی طرح آزاد نہیں نکلتی۔ ک نہیں، آواز والی گ نہیں۔"),
  ],
  mistakes: L(
    "Не заменяй д1 на д, т1 на т, 1 на хамзу и къ на к. Место звука другое, слово тоже становится другим.",
    "Do not swap dad for dal, the heavy ta for ta, ayn for hamza, or qaf for kaf. The place is different, and the word becomes another word.",
    "لا تبدل الضاد دالًا ولا الطاء تاءً ولا العين همزة ولا القاف كافًا.",
    "Jangan tukar dad dengan dal, ta tebal dengan ta, ain dengan hamzah, atau qaf dengan kaf.",
    "Dad'ı dal, kalın tı'yı te, ayn'ı hemze, qaf'ı kaf yapma.",
    "ض کو د، ط کو ت، ع کو ہمزہ اور ق کو ک نہ بنائیں۔",
  ),
  quiz: [
    Q(L("д1 — какая буква?", "Which letter is dad?", "ما حرف «д1»؟", "Huruf manakah dad?", "Dad hangi harftir?", "د1 کون سا حرف ہے؟"), L("ض", "Dad", "ض", "Dad", "Dad", "ض"), L("د", "Dal", "د", "Dal", "Dal", "د"), L("ظ", "Za", "ظ", "Za", "Zı", "ظ"), 0),
    Q(L("Откуда ع?", "Where does ayn come from?", "من أين العين؟", "Dari mana ain?", "Ayn nereden?", "ع کہاں سے؟"), L("Из середины горла", "From the middle of the throat", "من وسط الحلق", "Dari tengah halkum", "Boğazın ortasından", "حلق کے بیچ سے"), L("Из губ", "From the lips", "من الشفتين", "Dari bibir", "Dudaklardan", "ہونٹوں سے"), L("Из кончика языка", "From the tongue tip", "من طرف اللسان", "Dari hujung lidah", "Dil ucundan", "زبان کی نوک سے"), 0),
    Q(L("Сколько точек у ق?", "How many dots does qaf have?", "كم نقطة للقاف؟", "Berapa titik qaf?", "Qaf'ın kaç noktası var?", "ق کے کتنے نقطے ہیں؟"), L("Две сверху", "Two above", "نقطتان فوق", "Dua di atas", "Üstte iki", "اوپر دو"), L("Одна снизу", "One below", "واحدة تحت", "Satu di bawah", "Altta bir", "نیچے ایک"), L("Нет", "None", "لا نقط", "Tiada", "Yok", "کوئی نہیں"), 0),
  ],
};

const letters4: CourseLesson = {
  id: "letters-4",
  tone: "plain",
  title: L("ك ل م ن ه و ي", "Kaf to ya", "من الكاف إلى الياء", "Kaf hingga ya", "Kaftan ya'ya", "ک سے ی تک"),
  definition: L(
    "Последние семь. ك ближе ко рту, чем къ, не глубже. ه — выдох х1 из низа горла. و — губы кружком, это не русское «в». ي — середина языка.",
    "The last seven. Kaf is lighter and further forward than qaf. Ha is the breath, not the middle ha and not kh. Waw and ya can be consonants or long vowels.",
    "السبعة الأخيرة. الكاف أيسر من القاف. الهاء نفس، والواو والياء تكونان حرف مد.",
    "Tujuh terakhir. Kaf lebih ke depan daripada qaf. Ha ialah hembusan. Waw dan ya boleh jadi konsonan atau vokal panjang.",
    "Son yedi. Kaf, qaftan daha öndedir. He bir nefestir. Vav ve ya ünsüz de olur, uzun ünlü de.",
    "آخری سات۔ ک ق سے آگے ہے۔ ہ پھونک ہے۔ و اور ی حرف بھی بنتے ہیں اور لمبی حرکت بھی۔",
  ),
  letters: "ك ل م ن ه و ي",
  mechanism: L(
    "Согласная و — губы кружком, без зубов: звук ближе к «ў», в тексте Корана пишется «в». Долгая она только после даммы и без своего гласного: قُو = къуу.\nСогласная ي — «й». Долгая она только после кясры и без своего гласного: فِي = фии.\nو со следующей не соединяется: و ـو.",
    "If waw follows a damma, it is the long uu. If waw itself has a vowel, or stands as a consonant, it is w.\nIf ya follows a kasra, it is the long ii. If ya itself has a vowel, it is y.\nWaw does not join forward.",
    "الواو بعد الضمة مد. والياء بعد الكسرة مد. والواو لا تتصل بما بعدها.",
    "Waw selepas damma ialah mad. Ya selepas kasrah ialah mad. Waw tidak bersambung ke depan.",
    "Dammeden sonra vav meddir. Kesreden sonra ya meddir. Vav ileriye bağlanmaz.",
    "ضمہ کے بعد و مد ہے۔ کسرہ کے بعد ی مد ہے۔ و آگے نہیں جڑتی۔",
  ),
  examples: [
    card("كَ", "ка", "ka", "Зад языка ближе ко рту, чем у ق: у твёрдого нёба, не у мягкого. Без голоса. Не говори «выше». Формы: ك كـ ـكـ ـك.", "The back of the tongue, nearer the mouth than qaf: at the hard palate, not the soft one. No voice. Do not say it is higher.", "أقصى اللسان أقرب إلى الفم من القاف، عند الحنك الصلب، بلا جهر.", "Belakang lidah lebih dekat ke mulut daripada qaf, pada lelangit keras, tanpa suara.", "Dilin arkası qaftan ağıza daha yakın, sert damakta, sessiz.", "زبان کا پچھلا حصہ ق سے منہ کے قریب، سخت تالو پر، بغیر آواز۔"),
    card("لَ", "ла", "la", "Края передней части языка у дёсен верхних зубов, не один кончик, как у ن. Формы: ل لـ ـلـ ـل. В «Аллах1» после фатхи или даммы лям твёрдая.", "The edges of the front of the tongue at the gums of the upper teeth, not the tip alone as for nun. In Allah, after a fatha or a damma, the lam is heavy.", "من حافتي مقدم اللسان عند لثة الأسنان العليا، لا من الطرف وحده كالنون. وفي لفظ الجلالة بعد الفتح أو الضم تُفخم.", "Tepi depan lidah pada gusi gigi atas, bukan hujung sahaja seperti nun. Pada Allah, selepas fat-hah atau damma, lam tebal.", "Dilin ön kenarları üst diş etlerinde, nun gibi yalnız uç değil. Allah lafzında fetha veya dammeden sonra lam kalındır.", "زبان کے اگلے کنارے اوپر کے مسوڑھوں پر، ن کی طرح صرف نوک نہیں۔ اللہ میں فتحہ یا ضمہ کے بعد لام موٹی۔"),
    card("مَ", "ма", "ma", "Обе губы смыкаются. Зубы не участвуют. Носовая окраска есть всегда, две меры гунны только по правилу: шадда, идгам или ихфа. Формы: م مـ ـمـ ـم.", "Both lips close. The teeth do not take part. A nasal color is always there. Two counts of ghunnah only by the rule: shadda, idgham or ikhfa.", "الشفتان، والأسنان لا دخل لها. الغنة صفة، وحركتاها عند الشدة أو الإدغام أو الإخفاء فقط.", "Kedua-dua bibir rapat. Gigi tidak terlibat. Warna hidung ada. Dua harakat ghunnah hanya pada syaddah, idgham atau ikhfa.", "İki dudak kapanır. Dişler karışmaz. Geniz rengi hep vardır. İki miktar gunne yalnız şedde, idgam veya ihfada.", "دونوں ہونٹ بند ہوتے ہیں۔ دانت شامل نہیں۔ ناک کی رنگت ہمیشہ ہے۔ دو حرکت غنہ صرف شدہ، ادغام یا اخفا میں۔"),
    card("نَ", "на", "na", "Кончик языка у дёсен верхних резцов. Точка сверху. Две меры гунны только при шадде, идгаме или ихفا, не в каждом «на». Формы: ن نـ ـنـ ـن.", "The tongue tip at the gums of the upper teeth. A dot above. Two counts of ghunnah only with shadda, idgham or ikhfa, not in every na.", "طرف اللسان عند لثة الثنايا العليا. الغنة حركتان عند الشدة أو الإدغام أو الإخفاء فقط.", "Hujung lidah pada gusi gigi atas. Dua harakat ghunnah hanya pada syaddah, idgham atau ikhfa.", "Dil ucu üst diş etlerinde. İki miktar gunne yalnız şedde, idgam veya ihfada.", "زبان کی نوک اوپر کے مسوڑھوں پر۔ دو حرکت غنہ صرف شدہ، ادغام یا اخفا میں۔"),
    card("هَ", "х1а", "ha", "Самый низ горла, лёгкий выдох, без хрипа. Это х1 в «Аллах1». Не хь и не х. Формы: ه هـ ـهـ ـه.", "The very bottom of the throat, a light breath, with no rasp. This is the h in Allah. Not the middle ha and not kh.", "أقصى الحلق، نفس خفيف بلا خشونة. ليست حاء ولا خاء.", "Pangkal halkum, hembusan ringan tanpa kasar. Bukan ha tengah dan bukan kha.", "Boğazın en altı, hırıltısız hafif nefes. Ha değil, hı değil.", "حلق کا سب سے نیچے، ہلکی پھونک، بغیر کھردراہٹ۔ ح نہیں، خ نہیں۔"),
    card("وَ", "ўа", "wa", "Обе губы кружком, зубы их не касаются. Это не русское «в» и не ف. В тексте Корана пишется «в». Со следующей не соединяется: و ـو. Долгий «уу» только после даммы и без своего гласного.", "Both lips are rounded, and the teeth do not touch them. Not a Russian v and not fa. In the Quran text of this app it is written v. It does not join forward. The long uu only after a damma, with no vowel of its own.", "الشفتان مستديرتان، والأسنان لا تمسّهما. ليست فاء. المد بعد الضمة فقط.", "Kedua-dua bibir membulat, gigi tidak menyentuh. Bukan v Rusia dan bukan fa. Mad uu hanya selepas damma.", "İki dudak yuvarlak, dişler değmez. Rusça v değil, fa değil. Uzun uu yalnız dammeden sonra.", "دونوں ہونٹ گول، دانت نہیں چھوتے۔ روسی و نہیں، ف نہیں۔ لمبی اوو صرف ضمہ کے بعد۔"),
    card("يَ", "йа", "ya", "Середина языка, со голосом, ближе ко рту, чем ج. Две точки снизу. Долгий «ии» только после кясры и без своего гласного. Формы: ي يـ ـيـ ـي.", "The middle of the tongue, with the voice, nearer the mouth than jim. Two dots below. The long ii only after a kasra, with no vowel of its own.", "وسط اللسان بجهر، أقرب إلى الفم من الجيم. المد بعد الكسرة فقط.", "Tengah lidah, bersuara, lebih dekat ke mulut daripada jim. Mad ii hanya selepas kasrah.", "Dilin ortası, sesli, cimden ağıza daha yakın. Uzun ii yalnız kesreden sonra.", "زبان کا بیچ، آواز کے ساتھ، ج سے منہ کے قریب۔ لمبی ایی صرف کسرہ کے بعد۔"),
  ],
  mistakes: L(
    "Не читай ه как ح. Не делай و всегда долгим «у»: долгий он только после даммы, без своего гласного.",
    "Do not read ha as the middle ha. Do not make waw always a long u: it is long only after damma, with no vowel of its own.",
    "لا تقرأ الهاء حاءً. لا تجعل الواو مدًّا إلا بعد الضمة.",
    "Jangan baca ha sebagai ha tengah. Waw hanya panjang selepas damma.",
    "He'yi ha yapma. Vav yalnızca dammeden sonra uzundur.",
    "ہ کو ح نہ پڑھیں۔ و صرف ضمہ کے بعد لمبی ہے۔",
  ),
  quiz: [
    Q(L("Как пишется ه?", "How is ha written here?", "كيف تُكتب الهاء هنا؟", "Bagaimana ha ditulis di sini?", "He burada nasıl yazılır?", "ہ یہاں کیسے لکھی ہے؟"), L("х1", "a light breath", "هاء خفيفة", "hembusan ringan", "hafif nefes", "ہلکی پھونک"), L("хь", "the middle ha", "حاء", "ha tengah", "boğaz ha'sı", "ح"), L("х", "kh", "خاء", "kha", "hı", "خ"), 0),
    Q(L("Когда و читается долго?", "When is waw read long?", "متى تُمد الواو؟", "Bilakah waw dibaca panjang?", "Vav ne zaman uzun okunur?", "و کب لمبی پڑھی جاتی ہے؟"), L("После даммы, без своего гласного", "After damma, with no vowel of its own", "بعد الضمة بلا حركة عليها", "Selepas damma, tanpa vokal sendiri", "Dammeden sonra, kendi harekesi olmadan", "ضمہ کے بعد، اپنی حرکت کے بغیر"), L("Всегда", "Always", "دائمًا", "Sentiasa", "Hep", "ہمیشہ"), L("Только в начале", "Only at the start", "في الأول فقط", "Hanya di awal", "Yalnızca başta", "صرف شروع میں"), 0),
    Q(L("К легче и ближе ко рту, чем?", "Kaf is lighter and nearer the mouth than?", "الكاف أخف وأقرب من؟", "Kaf lebih ringan dan lebih dekat daripada?", "Kaf hangisinden daha hafif ve daha öndedir?", "ک کس سے ہلکی اور منہ کے قریب ہے؟"), L("ق", "Qaf", "القاف", "Qaf", "Qaf", "ق"), L("ب", "Ba", "الباء", "Ba", "Be", "ب"), L("م", "Mim", "الميم", "Mim", "Mim", "م"), 0),
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
  lead: L;
  badge: L;
  lessons: CourseLesson[];
};

export const TAJWEED_PATH: PathModule[] = [
  {
    id: "alpha",
    title: L("1. Буквы", "1. The letters", "١. الحروف", "1. Huruf", "1. Harfler", "١. حروف"),
    lead: L(
      "Сначала все 28 букв: форма, точки и транскрипция. Потом четыре написания. Без этого правило таджвида не к чему приложить.",
      "First all 28 letters: the shape, the dots and the transcription. Then the four written forms. A tajweed rule has nothing to hold if the letter is not known.",
      "أولًا الحروف الثمانية والعشرون: الصورة والنقط والرسم. ثم الأشكال الأربعة.",
      "Mula 28 huruf: bentuk, titik dan tulisan. Kemudian empat bentuk tulis.",
      "Önce 28 harf: şekil, nokta ve yazılış. Sonra dört biçim.",
      "پہلے ۲۸ حروف: شکل، نقطے اور لکھائی۔ پھر چار صورتیں۔",
    ),
    badge: L("Мастер букв", "Master of the letters", "متقن الحروف", "Penguasa huruf", "Harflerin ustası", "حروف کا ماہر"),
    lessons: [soundKey, letters, letters2, letters3, letters4, forms, withQuiz("what", extra.what)],
  },
  {
    id: "vowels",
    title: L("2. Огласовки", "2. The vowels", "٢. الحركات", "2. Vokal", "2. Harekeler", "٢. حرکات"),
    lead: L(
      "Черта сверху — а, снизу — и, петелька — у. Кружок — гласного нет. Шадда — буква дважды. Танвин — н на конце. Долгий гласный — две меры.",
      "A stroke above is a, below is i, a loop is u. A circle means no vowel. Shadda is the letter twice. Tanwin is an n at the end. A long vowel is two counts.",
      "الفتحة أ، والكسرة إ، والضمة أُ. السكون بلا حركة. الشدة مرتان. التنوين نون. والمد حركتان.",
      "Garis atas a, bawah i, lengkung u. Bulatan: tiada vokal. Syaddah dua kali. Tanwin ialah n. Mad dua harakat.",
      "Üst çizgi a, alt i, kıvrım u. Yuvarlak: ses yok. Şedde iki kez. Tenvin sonda n. Med iki miktar.",
      "اوپر لکیر ا، نیچے اِ، گول اُ۔ دائرہ: حرکت نہیں۔ شدہ دو بار۔ تنوین آخر میں ن۔ مد دو حرکت۔",
    ),
    badge: L("Знаток огласовок", "Master of the vowels", "متقن الحركات", "Penguasa vokal", "Harekelerin ustası", "حرکات کا ماہر"),
    lessons: [withQuiz("marks", extra.marks), withQuiz("ms-madd", extra["ms-madd"]), withQuiz("ms-shadda", extra["ms-shadda"]), withQuiz("ms-tanwin", extra["ms-tanwin"])],
  },
  {
    id: "makhraj",
    title: L("3. Место звука", "3. Where the sound is made", "٣. المخارج", "3. Makhraj", "3. Mahreç", "٣. مخارج"),
    lead: L(
      "Каждая буква выходит из своего места: горло, язык или губы. Похожие по виду не читаются одинаково.",
      "Each letter comes from its own place: the throat, the tongue or the lips. Letters that look alike are not read the same.",
      "لكل حرف مخرجه: الحلق أو اللسان أو الشفتان.",
      "Setiap huruf ada tempatnya: halkum, lidah atau bibir.",
      "Her harfin yeri vardır: boğaz, dil veya dudak.",
      "ہر حرف کی اپنی جگہ ہے: حلق، زبان یا ہونٹ۔",
    ),
    badge: L("Мастер махариджа", "Master of the makhraj", "متقن المخارج", "Penguasa makhraj", "Mahreç ustası", "مخارج کا ماہر"),
    lessons: [withQuiz("throat", extra.throat), withQuiz("tongue", extra.tongue), withQuiz("lips", extra.lips), withQuiz("pairs", extra.pairs)],
  },
  {
    id: "nun",
    title: L("4. Нун, танвин и мим", "4. Nun, tanwin and meem", "٤. النون والتنوين والميم", "4. Nun, tanwin dan mim", "4. Nun, tenvin ve mim", "٤. نون، تنوین اور میم"),
    lead: L(
      "Нун без гласного и танвин: ясно, вошёл в следующую, стал м перед ب, или скрыт. Мим без гласного: ясно, скрыт перед ب, или слился с мимом. Гунна — две меры через нос.",
      "Nun with no vowel, and tanwin: clear, merged into the next letter, turned into m before ba, or hidden. Meem with no vowel: clear, hidden before ba, or merged into meem. Ghunnah is two counts through the nose.",
      "النون الساكنة والتنوين: إظهار أو إدغام أو إقلاب أو إخفاء. والميم الساكنة ثلاثة أحكام. والغنة حركتان.",
      "Nun sukun dan tanwin: jelas, lebur, menjadi m, atau tersembunyi. Mim sukun ada tiga. Ghunnah dua harakat.",
      "Sükûnlu nun ve tenvin: açık, idgam, m oluşu veya gizlenme. Sükûnlu mimde üç hüküm. Gunne iki miktar.",
      "ساکن نون اور تنوین: واضح، ادغام، ب سے پہلے م، یا چھپی۔ ساکن میم کے تین حکم۔ غنہ دو حرکت۔",
    ),
    badge: L("Хранитель таджвида", "Keeper of tajweed", "حافظ التجويد", "Penjaga tajwid", "Tecvidin bekçisi", "تجوید کا محافظ"),
    lessons: [withQuiz("izhar", extra.izhar), withQuiz("idgham-nun", extra["idgham-nun"]), withQuiz("iqlab", extra.iqlab), withQuiz("ikhfa", extra.ikhfa), withQuiz("meem", extra.meem), withQuiz("ghunnah", extra.ghunnah)],
  },
  {
    id: "madd",
    title: L("5. Протяжка, ра и лям", "5. Lengthening, ra and lam", "٥. المد والراء واللام", "5. Mad, ra dan lam", "5. Med, ra ve lam", "٥. مد، را اور لام"),
    lead: L(
      "Обычная протяжка — две меры. Из-за хамзы — четыре или пять, в одном чтении держи одно. Обязательная — шесть. Ра и лям в «Аллах1» бывают твёрдыми и мягкими по правилу, не по желанию.",
      "The ordinary lengthening is two counts. Because of hamza it is four or five: keep one choice in one sitting. The required lengthening is six. Ra, and the lam in Allah, are heavy or light by the rule, not by choice.",
      "المد الطبيعي حركتان. وبسبب الهمزة أربع أو خمس. واللازم ست. والراء ولام لفظ الجلالة بالقاعدة.",
      "Mad biasa dua. Kerana hamzah empat atau lima. Yang wajib enam. Ra dan lam Allah mengikut hukum.",
      "Tabii med iki. Hemze yüzünden dört veya beş. Lazım olan altı. Ra ve Allah'ın lamı kurala göredir.",
      "عام مد دو۔ ہمزے کی وجہ سے چار یا پانچ۔ لازمی چھ۔ را اور اللہ کی لام قاعدے سے۔",
    ),
    badge: L("Мастер протяжки", "Master of the lengthening", "متقن المد", "Penguasa mad", "Med ustası", "مد کا ماہر"),
    lessons: [withQuiz("madd-short", extra["madd-short"]), withQuiz("madd-long", extra["madd-long"]), withQuiz("heavy", extra.heavy)],
  },
  {
    id: "waqf",
    title: L("6. Остановка и короткие суры", "6. The stop, and the short surahs", "٦. الوقف والسور القصار", "6. Waqaf dan surah pendek", "6. Vakıf ve kısa sureler", "٦. وقف اور چھوٹی سورتیں"),
    lead: L(
      "Знаки мусхафа говорят, где остановиться. На остановке последнее слово закрывается, у пяти букв лёгкий отскок. В конце — «Аль-Фатиха» и «Аль-Ихлас» медленно, вслух.",
      "The marks of the mushaf say where to stop. At a stop the last word is closed, and five letters give a light bounce. At the end, Al-Fatiha and Al-Ikhlas, slowly, aloud.",
      "علامات المصحف تبين الوقف. وعند الوقف يُسكن الآخر، وفي خمسة أحرف قلقلة. ثم الفاتحة والإخلاص.",
      "Tanda mushaf memberitahu waqaf. Pada waqaf kata ditutup, lima huruf ada pantulan. Kemudian Al-Fatihah dan Al-Ikhlas.",
      "Mushaf işaretleri vakfı gösterir. Durunca son harf kapanır, beş harfte kalkale vardır. Sonra Fatiha ve İhlas.",
      "مصحف کے نشان وقف بتاتے ہیں۔ وقف پر آخر بند، پانچ حروف میں قلقلہ۔ پھر فاتحہ اور اخلاص۔",
    ),
    badge: L("Читает Коран", "Reads the Quran", "قارئ", "Membaca Al-Qur'an", "Kur'an okur", "قرآن پڑھتا ہے"),
    lessons: [withQuiz("signs", extra.signs), withQuiz("stop-start", extra["stop-start"]), withQuiz("ms-qalqala", extra["ms-qalqala"]), withQuiz("hafs", extra.hafs), readShort],
  },
];

export const TAJWEED_PATH_FLAT: CourseLesson[] = TAJWEED_PATH.flatMap((mod) => mod.lessons);
