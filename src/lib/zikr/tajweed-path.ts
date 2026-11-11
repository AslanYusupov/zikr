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
    card("غَ", "г1а", "gha", "Верх горла, как خ, но с голосом. Не к и не х.", "Top of the throat, like kha, but with the voice. Not k and not kh.", "أعلى الحلق كالخاء، لكن بجهر.", "Hujung halkum seperti kha, tetapi bersuara.", "Boğazın üstü, hı gibi, ama sesli.", "حلق کا اوپر، خ کی طرح، مگر آواز کے ساتھ۔"),
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
    "Семь первых букв и хамза. Черта сверху на карточке — короткое «а». Без черты буква этого «а» не даёт. Знаки разберём в следующем разделе. Под буквой — как её писать здесь и чем она отличается от соседней.",
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
    card("جَ", "джа", "ja", "Середина языка к нёбу, с голосом. Одна точка снизу. Формы: ج جـ ـجـ ـج.", "The middle of the tongue toward the palate, with the voice. One dot below.", "وسط اللسان نحو الحنك بجهر. نقطة تحت.", "Tengah lidah ke lelangit, bersuara.", "Dilin ortası damağa, sesli.", "زبان کا بیچ تالو کی طرف، آواز کے ساتھ۔"),
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
    "ذ — кончик языка между зубами, с голосом. ز — узкая щель у нижних резцов, свист, язык не между зубами. В записи обе «з», звук разный.\nس — тот же свист, без голоса. ص — то же место, но рот полный и корень языка поднят. ش — середина языка, не свист кончика.",
    "Dhal: the tongue tip between the teeth, with the voice. Zay: a narrow gap by the lower teeth, a whistle, and the tongue is not between the teeth. Both are written z, but the sound differs.\nSin: the same whistle as zay, with no voice. Sad: the same place, but the mouth is full and the root of the tongue is raised. Shin: the middle of the tongue, not a tip whistle.",
    "الذال بين الأسنان بجهر. الزاي صفير من ضيق عند الثنايا السفلى، واللسان ليس بين الأسنان. السين الصفير نفسه بلا جهر. الصاد من مكان السين مع رفع أقصى اللسان. الشين من وسط اللسان.",
    "Dzal: hujung lidah antara gigi, bersuara. Zay: siul di celah gigi bawah, lidah bukan antara gigi. Kedua-duanya ditulis z, bunyinya lain.\nSin: siul yang sama, tanpa suara. Sad: tempat yang sama, mulut penuh. Syin: tengah lidah, bukan siul hujung.",
    "Zel: dil ucu dişlerin arasında, sesli. Ze: alt dişlerde ıslık, dil dişler arasında değil. İkisi de z yazılır, ses ayrıdır.\nSin: aynı ıslık, sessiz. Sad: aynı yer, ağız dolu. Şin: dilin ortası, uç ıslığı değil.",
    "ذ: زبان کی نوک دانتوں کے بیچ، آواز کے ساتھ۔ ز: نیچے کے دانتوں پر سیٹی، زبان بیچ میں نہیں۔ دونوں ز لکھی جاتی ہیں، آواز الگ۔\nس: وہی سیٹی، بغیر آواز۔ ص: وہی جگہ، بھرا منہ۔ ش: زبان کا بیچ، نوک کی سیٹی نہیں۔",
  ),
  examples: [
    card("دَ", "да", "da", "Кончик языка у корней верхних резцов, за зубами, не между ними. С голосом, рот не полный. Со следующей не соединяется: د ـد.", "The tongue tip at the roots of the upper teeth, behind them, not between them. With the voice. The mouth is not full. It does not join forward.", "طرف اللسان عند أصول الثنايا، خلف الأسنان لا بينها، بجهر.", "Hujung lidah di pangkal gigi atas, di belakang gigi, bukan antara gigi. Bersuara.", "Dil ucu üst diş köklerinde, dişlerin ardında, aralarında değil. Sesli.", "زبان کی نوک اوپر کے دانتوں کی جڑ پر، دانتوں کے پیچھے، بیچ میں نہیں۔ آواز کے ساتھ۔"),
    card("ذَ", "за между зубами", "dha", "Кончик языка между зубами, с голосом. Точка сверху. Не свистящая ز. Со следующей не соединяется: ذ ـذ.", "The tongue tip between the teeth, with the voice. A dot above. Not the whistling zay. It does not join forward.", "بين الأسنان بجهر. نقطة فوق. ليست زايًا.", "Antara gigi, bersuara. Titik di atas. Bukan zay yang bersiul.", "Dişler arasında, sesli. Üstte nokta. Islıklı ze değil.", "دانتوں کے بیچ، آواز کے ساتھ۔ اوپر نقطہ۔ سیٹی والی ز نہیں۔"),
    card("رَ", "ра", "ra", "Кончик языка один раз легко касается десны верхних резцов. Не дрожи, как русское р. Со следующей не соединяется: ر ـر.", "The tongue tip taps the gum of the upper teeth once, lightly. Do not trill it like a Russian r. It does not join forward.", "طرف اللسان، ضربة واحدة خفيفة على اللثة، بلا تكرار.", "Hujung lidah sekali ringan pada gusi. Jangan digetar.", "Dil ucu üst diş etine bir kez hafif değer. Titretme.", "زبان کی نوک اوپر کے مسوڑھے پر ایک ہلکی ضرب۔ کانپائیں نہیں۔"),
    card("زَ", "за со свистом", "za", "Узкая щель у нижних резцов, воздух свистит, с голосом. Язык не между зубами. Точка сверху. Не ذ. Со следующей не соединяется: ز ـز.", "A narrow gap by the lower teeth. The air whistles, with the voice. The tongue is not between the teeth. A dot above. Not dhal. It does not join forward.", "صفير من ضيق عند الثنايا السفلى بجهر. اللسان ليس بين الأسنان. ليست ذالًا.", "Siu dari celah gigi bawah, bersuara. Lidah bukan antara gigi. Bukan dzal.", "Alt dişlerde dar aralıktan ıslık, sesli. Dil dişler arasında değil. Zel değil.", "نیچے کے دانتوں پر تنگ شگاف، سیٹی، آواز کے ساتھ۔ زبان بیچ میں نہیں۔ ذ نہیں۔"),
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
    "ض — край языка у верхних коренных, воздух сбоку, рот полный.\nط — кончик как у ت, за верхними зубами, но корень языка поднят.\nظ — язык между зубами, как у ذ, и рот полный.\nع — сжатие в середине горла. غ — верх горла с голосом, как خ, но звонко.",
    "Dad: one or both edges of the tongue at the upper molars. The air comes out along the side. The mouth is full.\nThe heavy ta: the same tongue tip as ta, at the roots of the upper teeth, behind them, not between them. The root of the tongue is raised.\nZa: the tongue between the teeth, like dhal, with the voice, and the mouth is full.\nAyn: a squeeze in the middle of the throat, not the closure of hamza. Ghayn: the top of the throat, like kha, but with the voice.",
    "الضاد من الحافة. الطاء مفخمة. الظاء كالذال مفخمة. العين من وسط الحلق والغين من أعلاه.",
    "Dad dari tepi lidah. Ta tebal. Za seperti dzal tetapi tebal. Ain di tengah halkum, ghain di hujung.",
    "Dad dil kenarı. Kalın tı. Zı, kalın zel gibidir. Ayn boğazın ortası, ğayn üstü.",
    "ض زبان کے کنارے سے۔ ط بھاری۔ ظ بھاری ذ کی طرح۔ ع حلق کے بیچ، غ اوپر۔",
  ),
  examples: [
    card("ضَ", "д1а", "ḍa", "Край языка прижат к верхним коренным, воздух идёт сбоку. Рот полный. Не د и не ظ. Формы: ض ضـ ـضـ ـض.", "The edge of the tongue is against the upper molars, and the air comes out along the side. The mouth is full. Not dal and not za.", "حافة اللسان عند الأضراس، والهواء من الجانب. ليست دالًا ولا ظاء.", "Tepi lidah di geraham, udara dari sisi. Bukan dal dan bukan za.", "Dil kenarı azılarda, hava yandan. Dal değil, zı değil.", "زبان کا کنارہ داڑھوں پر، ہوا سائیڈ سے۔ د نہیں، ظ نہیں۔"),
    card("طَ", "т1а", "ṭa", "Кончик языка у корней верхних резцов, за зубами, без голоса. Корень языка поднят, рот полный. Не ت и не межзубный. Формы: ط طـ ـطـ ـط.", "The tongue tip at the roots of the upper teeth, behind them, with no voice. The root of the tongue is raised and the mouth is full. Not ta and not between the teeth.", "كمخرج التاء مع رفع أقصى اللسان. ليست تاء ولا بين الأسنان.", "Sama tempat ta, dengan belakang lidah terangkat. Bukan ta dan bukan antara gigi.", "Te ile aynı yer, dil arkası kalkık. Te değil, dişler arası değil.", "ت کی جگہ، زبان کا پچھلا حصہ اٹھا۔ ت نہیں، دانتوں کے بیچ نہیں۔"),
    card("ظَ", "за между зубами, полный рот", "ẓa", "Язык между зубами, с голосом, и рот полный. Точка сверху. Не ذ без полноты и не ز. Формы: ظ ظـ ـظـ ـظ.", "The tongue between the teeth, with the voice, and the mouth full. A dot above. Not a light dhal and not zay.", "بين الأسنان بجهر وتفخيم. ليست ذالًا مرققة ولا زايًا.", "Antara gigi, bersuara dan tebal. Bukan dzal nipis dan bukan zay.", "Dişler arasında, sesli ve kalın. İnce zel değil, ze değil.", "دانتوں کے بیچ، آواز اور بھرا منہ۔ پتلی ذ نہیں، ز نہیں۔"),
    card("عَ", "1а", "ʿa", "Середина горла сжимается, голос идёт. Без точек. Не обрыв хамзы и не долгий алиф. Формы: ع عـ ـعـ ـع.", "The middle of the throat tightens, and the voice passes. No dots. Not the closure of hamza and not a long alif.", "وسط الحلق مع العصر والجهر. ليست همزة ولا ألف مد.", "Tengah halkum menghimpit, bersuara. Bukan hamzah dan bukan alif mad.", "Boğazın ortası sıkışır, sesli. Hemze değil, med elif değil.", "حلق کا بیچ دبتا ہے، آواز کے ساتھ۔ ہمزہ نہیں، مد کی الف نہیں۔"),
    card("غَ", "г1а", "gha", "Верх горла, как у خ, но связки звучат. Точка сверху. Не х и не к. Формы: غ غـ ـغـ ـغ.", "Top of the throat, like kha, but the vocal cords sound. A dot above. Not kh and not k.", "أعلى الحلق كالخاء بجهر. نقطة فوق.", "Hujung halkum seperti kha, bersuara. Titik di atas.", "Boğazın üstü, hı gibi ama sesli. Üstte nokta.", "حلق کا اوپر، خ کی طرح مگر آواز کے ساتھ۔ اوپر نقطہ۔"),
    card("فَ", "фа", "fa", "Внутренняя сторона нижней губы у верхних резцов. Верхняя губа не смыкается. Одна точка сверху. Формы: ف فـ ـفـ ـف.", "The inside of the lower lip at the upper teeth. The upper lip does not close on it. One dot above.", "باطن الشفة السفلى مع الثنايا العليا. ليست من الشفتين معًا.", "Bahagian dalam bibir bawah di gigi atas. Bukan kedua-dua bibir.", "Alt dudağın içi üst dişlerde. İki dudak birden değil.", "نیچے کے ہونٹ کا اندر اوپر کے دانتوں پر۔ دونوں ہونٹ نہیں۔"),
    card("قَ", "къа", "qa", "Корень языка у мягкого нёба, глубже ك. После смычки воздух не выходит, как выходит у ك: къ звонкая. Это не к и не г. Две точки сверху. Формы: ق قـ ـقـ ـق.", "The root of the tongue at the soft palate, deeper than kaf. The breath does not rush out as it does for kaf. Not k and not a voiced g. Two dots above.", "أقصى اللسان عند الحنك اللحمي، أعمق من الكاف. النفس لا يجري كما في الكاف. ليست كافًا ولا غينًا.", "Pangkal lidah di lelangit lembut, lebih dalam daripada kaf. Nafas tidak keluar bebas seperti kaf. Bukan kaf dan bukan g bersuara.", "Dil kökü yumuşak damakta, kaftan derin. Nefes kaftaki gibi serbest çıkmaz. Kaf değil, sesli g değil.", "زبان کی جڑ نرم تالو پر، ک سے گہری۔ سانس ک کی طرح آزاد نہیں نکلتی۔ ک نہیں، آواز والی گ نہیں۔"),
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
    card("لَ", "ла", "la", "Края передней части языка у дёсен верхних зубов, не один кончик, как у ن. Формы: ل لـ ـلـ ـل. В «Аллах1» лям бывает твёрдой и мягкой. Правило позже, сейчас просто «ла».", "The edges of the front of the tongue at the gums of the upper teeth, not the tip alone as for nun. In Allah, after a fatha or a damma, the lam is heavy.", "من حافتي مقدم اللسان عند لثة الأسنان العليا، لا من الطرف وحده كالنون. وفي لفظ الجلالة بعد الفتح أو الضم تُفخم.", "Tepi depan lidah pada gusi gigi atas, bukan hujung sahaja seperti nun. Pada Allah, selepas fat-hah atau damma, lam tebal.", "Dilin ön kenarları üst diş etlerinde, nun gibi yalnız uç değil. Allah lafzında fetha veya dammeden sonra lam kalındır.", "زبان کے اگلے کنارے اوپر کے مسوڑھوں پر، ن کی طرح صرف نوک نہیں۔ اللہ میں فتحہ یا ضمہ کے بعد لام موٹی۔"),
    card("مَ", "ма", "ma", "Обе губы смыкаются. Зубы не участвуют. Носовая окраска есть всегда. Две меры через нос будут позже, не в каждом «ма». Формы: م مـ ـمـ ـم.", "Both lips close. The teeth do not take part. A nasal color is always there. Two counts of ghunnah only by the rule: shadda, idgham or ikhfa.", "الشفتان، والأسنان لا دخل لها. الغنة صفة، وحركتاها عند الشدة أو الإدغام أو الإخفاء فقط.", "Kedua-dua bibir rapat. Gigi tidak terlibat. Warna hidung ada. Dua harakat ghunnah hanya pada syaddah, idgham atau ikhfa.", "İki dudak kapanır. Dişler karışmaz. Geniz rengi hep vardır. İki miktar gunne yalnız şedde, idgam veya ihfada.", "دونوں ہونٹ بند ہوتے ہیں۔ دانت شامل نہیں۔ ناک کی رنگت ہمیشہ ہے۔ دو حرکت غنہ صرف شدہ، ادغام یا اخفا میں۔"),
    card("نَ", "на", "na", "Кончик языка у дёсен верхних резцов. Точка сверху. Две меры через нос будут позже, не в каждом «на». Формы: ن نـ ـنـ ـن.", "The tongue tip at the gums of the upper teeth. A dot above. Two counts of ghunnah only with shadda, idgham or ikhfa, not in every na.", "طرف اللسان عند لثة الثنايا العليا. الغنة حركتان عند الشدة أو الإدغام أو الإخفاء فقط.", "Hujung lidah pada gusi gigi atas. Dua harakat ghunnah hanya pada syaddah, idgham atau ikhfa.", "Dil ucu üst diş etlerinde. İki miktar gunne yalnız şedde, idgam veya ihfada.", "زبان کی نوک اوپر کے مسوڑھوں پر۔ دو حرکت غنہ صرف شدہ، ادغام یا اخفا میں۔"),
    card("هَ", "х1а", "ha", "Самый низ горла, лёгкий выдох, без хрипа. Это х1 в «Аллах1». Не хь и не х. Формы: ه هـ ـهـ ـه.", "The very bottom of the throat, a light breath, with no rasp. This is the h in Allah. Not the middle ha and not kh.", "أقصى الحلق، نفس خفيف بلا خشونة. ليست حاء ولا خاء.", "Pangkal halkum, hembusan ringan tanpa kasar. Bukan ha tengah dan bukan kha.", "Boğazın en altı, hırıltısız hafif nefes. Ha değil, hı değil.", "حلق کا سب سے نیچے، ہلکی پھونک، بغیر کھردراہٹ۔ ح نہیں، خ نہیں۔"),
    card("وَ", "ўа", "wa", "Обе губы кружком, зубы их не касаются. Это не русское «в» и не ف. В тексте Корана пишется «в». Со следующей не соединяется: و ـو. Долгий «уу» только после даммы и без своего гласного.", "Both lips are rounded, and the teeth do not touch them. Not a Russian v and not fa. In the Quran text of this app it is written v. It does not join forward. The long uu only after a damma, with no vowel of its own.", "الشفتان مستديرتان، والأسنان لا تمسّهما. ليست فاء. المد بعد الضمة فقط.", "Kedua-dua bibir membulat, gigi tidak menyentuh. Bukan v Rusia dan bukan fa. Mad uu hanya selepas damma.", "İki dudak yuvarlak, dişler değmez. Rusça v değil, fa değil. Uzun uu yalnız dammeden sonra.", "دونوں ہونٹ گول، دانت نہیں چھوتے۔ روسی و نہیں، ف نہیں۔ لمبی اوو صرف ضمہ کے بعد۔"),
    card("يَ", "йа", "ya", "Середина языка, с голосом, ближе ко рту, чем ج. Две точки снизу. Долгий «ии» только после кясры и без своего гласного. Формы: ي يـ ـيـ ـي.", "The middle of the tongue, with the voice, nearer the mouth than jim. Two dots below. The long ii only after a kasra, with no vowel of its own.", "وسط اللسان بجهر، أقرب إلى الفم من الجيم. المد بعد الكسرة فقط.", "Tengah lidah, bersuara, lebih dekat ke mulut daripada jim. Mad ii hanya selepas kasrah.", "Dilin ortası, sesli, cimden ağıza daha yakın. Uzun ii yalnız kesreden sonra.", "زبان کا بیچ، آواز کے ساتھ، ج سے منہ کے قریب۔ لمبی ایی صرف کسرہ کے بعد۔"),
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

const join: CourseLesson = {
  id: "join",
  tone: "plain",
  title: L("Из слогов слово", "From syllables to a word", "من المقطع إلى الكلمة", "Dari suku kata ke kata", "Heceden kelimeye", "مقطع سے لفظ تک"),
  definition: L(
    "Буква с гласным — слог. Слоги подряд, без паузы, — слово. Кружок приклеивает букву к следующей. Это первое чтение: ещё без правил нуна.",
    "A letter with a vowel is a syllable. Syllables in a row, with no pause, are a word. A circle glues a letter to the next one. This is the first reading, before the rules of nun.",
    "الحرف مع الحركة مقطع. والمقاطع بلا وقف كلمة. والسكون يلصق الحرف بالتالي. هذه أول قراءة، قبل أحكام النون.",
    "Huruf dengan vokal ialah suku kata. Suku kata berturut, tanpa henti, menjadi kata. Bulatan melekatkan huruf pada huruf berikut. Ini bacaan pertama, sebelum hukum nun.",
    "Harekeli harf bir hecedir. Heceler ara vermeden kelimedir. Sukûn harfi sonrakine yapıştırır. Bu ilk okuyuştur, nun hükümlerinden önce.",
    "حرکت والا حرف مقطع ہے۔ مقطعے بغیر رکے لفظ بنتے ہیں۔ دائرہ حرف کو اگلے سے جوڑتا ہے۔ یہ پہلی قراءت ہے، نون کے احکام سے پہلے۔",
  ),
  letters: "بَ بِ بُ · كَتَبَ · قَالَ",
  mechanism: L(
    "Читай вслух, медленно.\nبَ بِ بُ — ба, би, бу. Гласный не живёт отдельно от буквы.\nكَتَبَ — катаба. Три слога, паузы нет.\nيَكْتُبُ — йактубу. На к кружок: к без гласного, сразу т.\nرَبِّ — рабби. Шадда: б без гласного и сразу би.\nقَالَ — къаала. Къ глубже к. Аа — две меры, не четыре.\nНе начинай слово с гласного. Сначала буква.",
    "Read aloud, slowly.\nBa, bi, bu. The vowel does not live apart from the letter.\nKataba. Three syllables, no pause.\nYaktubu. The circle on kaf: kaf has no vowel, then ta at once.\nRabbi. Shadda: b with no vowel, then bi at once.\nQala. Qaf is deeper than kaf. The aa is two counts, not four.\nDo not start a word from the vowel. The letter comes first.",
    "اقرأ بصوت مرتفع متمهلًا.\nبَ بِ بُ. الحركة لا تنفصل عن الحرف.\nكَتَبَ ثلاثة مقاطع بلا وقف.\nيَكْتُبُ: الكاف ساكنة ثم التاء فورًا.\nرَبِّ: الباء مرتان.\nقَالَ: القاف أعمق من الكاف، والألف حركتان لا أربع.\nلا تبدأ الكلمة بالحركة.",
    "Baca dengan suara, perlahan.\nBa, bi, bu. Vokal tidak terpisah daripada huruf.\nKataba. Tiga suku kata, tanpa henti.\nYaktubu. Bulatan pada kaf: kaf tanpa vokal, terus ta.\nRabbi. Syaddah: b tanpa vokal, terus bi.\nQala. Qaf lebih dalam daripada kaf. Aa dua harakat, bukan empat.",
    "Sesli ve yavaş oku.\nBa, bi, bu. Hareke harften ayrı yaşamaz.\nKataba. Üç hece, ara yok.\nYaktubu. Kafın üzerinde daire: kaf sessiz, hemen te.\nRabbi. Şedde: sessiz b, hemen bi.\nQale. Qaf, kaftan derindir. Aa iki miktardır, dört değil.",
    "آواز سے آہستہ پڑھیں۔\nبا، بی، بو۔ حرکت حرف سے الگ نہیں۔\nکَتَبَ تین مقطعے، رکے بغیر۔\nیَکْتُبُ: ک پر دائرہ، ک بغیر حرکت، پھر فوراً ت۔\nرَبِّ: ب دو بار۔\nقَالَ: ق ک سے گہری۔ آ دو حرکت، چار نہیں۔",
  ),
  examples: [
    { ar: "بَ بِ بُ", read: "ба · би · бу", lat: "ba, bi, bu", where: "слог", note: L("Три гласных одной буквы: сверху а, снизу и, петелька у.", "Three vowels of one letter: a above, i below, u in the loop.", "ثلاث حركات لحرف واحد.", "Tiga vokal satu huruf.", "Bir harfin üç harekesi.", "ایک حرف کی تین حرکتیں۔") },
    { ar: "كَتَبَ", read: "катаба", lat: "kataba", where: "слово", note: L("Три открытых слога. Не «катб» и не «китааб».", "Three open syllables. Not katb and not kitaab.", "ثلاثة مقاطع مفتوحة.", "Tiga suku kata terbuka.", "Üç açık hece.", "تین کھلے مقطعے۔") },
    { ar: "يَكْتُبُ", read: "йактубу", lat: "yaktubu", where: "круг", note: L("К без гласного. Не вставляй а между к и т.", "Kaf has no vowel. Do not put a between k and t.", "الكاف ساكنة. لا تدخل فتحة بين الكاف والتاء.", "Kaf tanpa vokal. Jangan selitkan a.", "Kaf sessiz. K ile t arasına a koyma.", "ک بغیر حرکت۔ ک اور ت کے بیچ ا نہ ڈالیں۔") },
    { ar: "رَبِّ", read: "рабби", lat: "rabbi", where: "1:2", note: L("Б дважды: без гласного, сразу с и. Ра твёрдая.", "B twice: with no vowel, then at once with i. Ra is heavy.", "الباء مرتان. والراء مفخمة.", "B dua kali. Ra tebal.", "B iki kez. Ra kalın.", "ب دو بار۔ ر موٹی۔") },
    { ar: "قَالَ", read: "къаала", lat: "qala", where: "2:30", note: L("Къ из глубины, не к. Аа — две меры.", "Qaf from deep back, not kaf. The aa is two counts.", "قاف لا كاف. والألف حركتان.", "Qaf, bukan kaf. Aa dua.", "Qaf, kaf değil. Aa iki.", "ق ہے، ک نہیں۔ آ دو۔") },
  ],
  mistakes: L(
    "Не читай кружок как гласный. И не рви слово паузой между буквами.",
    "Do not read the circle as a vowel. And do not split the word with a pause between the letters.",
    "لا تقرأ السكون حركة. ولا تقطع الكلمة بوقف بين حروفها.",
    "Jangan baca bulatan sebagai vokal. Dan jangan potong kata dengan henti antara huruf.",
    "Daireyi hareke diye okuma. Kelimeyi harfler arasında durarak bölme.",
    "دائرے کو حرکت نہ پڑھیں۔ اور حرفوں کے بیچ رک کر لفظ نہ توڑیں۔",
  ),
  quiz: [
    Q(L("Как читается كَتَبَ?", "How is kataba read?", "كيف تُقرأ كَتَبَ؟", "Bagaimana kataba dibaca?", "Kataba nasıl okunur?", "كَتَبَ کیسے پڑھا جائے؟"), L("катаба — три слога", "kataba — three syllables", "ثلاثة مقاطع", "tiga suku kata", "üç hece", "تین مقطعے"), L("катб — без гласных", "katb — with no vowels", "بلا حركات", "tanpa vokal", "harekesiz", "بغیر حرکت"), L("китааб — долгое а", "kitaab — a long a", "بألف مد", "dengan a panjang", "uzun a ile", "لمبی ا کے ساتھ"), 0),
    Q(L("Что даёт кружок?", "What does the circle give?", "ماذا يعطي السكون؟", "Bulatan memberi apa?", "Daire ne verir?", "دائرہ کیا دیتا ہے؟"), L("Буква без гласного", "A letter with no vowel", "حرف بلا حركة", "Huruf tanpa vokal", "Harekesiz harf", "بغیر حرکت کا حرف"), L("Звук а", "The sound a", "فتحة", "Bunyi a", "A sesi", "ا کی آواز"), L("Долгий у", "A long u", "واو مد", "U panjang", "Uzun u", "لمبی و"), 0),
    Q(L("Сколько мер у аа в «къаала»?", "How many counts is the aa in qala?", "كم ألف «قال»؟", "Berapa aa pada qala?", "Qale'deki aa kaç?", "قَالَ کی آ کتنی ہے؟"), L("Две", "Two", "حركتان", "Dua", "İki", "دو"), L("Четыре", "Four", "أربع", "Empat", "Dört", "چار"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), 0),
  ],
};

const readShort: CourseLesson = {
  id: "read-short",
  tone: "madd",
  title: L("Аль-Фатиха и Аль-Ихлас", "Al-Fatiha and Al-Ikhlas", "الفاتحة والإخلاص", "Al-Fatihah dan Al-Ikhlas", "Fatiha ve İhlas", "فاتحہ اور اخلاص"),
  definition: L(
    "Собери всё, что прошёл, на двух коротких сурах. Строка чтения — та же, что в Коране приложения. Читай аят целиком, вслух, медленно. На последнем слове остановись.",
    "Gather everything you have done on two short surahs. The reading line is the same as in the Quran of this app. Read the whole ayah aloud, slowly. Stop on the last word.",
    "اجمع ما مضى في سورتين قصيرتين. سطر القراءة هو سطر قرآن التطبيق. اقرأ الآية كلها بصوت مرتفع متمهلًا. وقف على الكلمة الأخيرة.",
    "Kumpulkan semua yang sudah dipelajari pada dua surah pendek. Baris bacaan sama seperti Al-Qur'an aplikasi. Baca satu ayat dengan suara, perlahan. Berhenti pada kata terakhir.",
    "Geçtiğin her şeyi iki kısa surede topla. Okuma satırı, uygulamadaki Kur'an ile aynıdır. Ayeti sesli ve yavaş oku. Son kelimede dur.",
    "جو پڑھا ہے اسے دو چھوٹی سورتوں پر جمع کریں۔ پڑھنے کی سطر اسی ایپ کے قرآن جیسی ہے۔ پوری آیت آواز سے آہستہ پڑھیں۔ آخری لفظ پر رکیں۔",
  ),
  letters: "الفاتحة · الإخلاص",
  mechanism: L(
    "На остановке краткий гласный сними. Если последняя буква ق ط ب ج د — лёгкий отскок, без нового а, и или у.\n«аа ии уу» в этих двух сурах — две меры. После протяжки здесь нет хамзы. Если в другом аяте хамза стоит сразу после аа, это уже четыре или пять, не две. Если на остановке протяжка упёрлась в закрытую букву, можно две, четыре или шесть, одну меру на всё чтение. В «д1ааллиин» на аа всегда шесть.\nКнопка «слушать» — голос телефона. Таджвид он не держит. Образец бери у чтеца в разделе Корана, а строку сверяй здесь.",
    "At a stop, drop the short vowel. If the last letter is qaf, the heavy ta, ba, jim or dal, give a light bounce, with no new a, i or u.\nAa, ii and uu in these two surahs are two counts. No hamza follows the lengthening here. If another ayah has a hamza right after the aa, that is four or five, not two. If at a stop the lengthening meets a closed letter, you may hold two, four or six, one choice for the whole reading. In ad-dallin the aa is always six.\nThe listen button is the phone's voice. It does not keep tajweed. Take the model from the reciter in the Quran section, and check the line here.",
    "عند الوقف تُسقط الحركة القصيرة. وإن كان الأخير ق ط ب ج د فقلقلة خفيفة بلا حركة جديدة.\nالألف والواو والياء في السطر حركتان. وعند الوقف إذا لقي المد ساكنًا فاثنتان أو أربع أو ست، ووجه واحد في القراءة. وفي «الضالين» الألف ست دائمًا.\nزر الاستماع صوت الهاتف، ولا يضبط التجويد. خذ القدوة من القارئ في قسم القرآن.",
    "Pada waqaf, gugurkan vokal pendek. Jika huruf terakhir qaf, ta tebal, ba, jim atau dal, ada pantulan ringan, tanpa vokal baru.\nAa, ii dan uu pada baris ialah dua. Pada waqaf, jika mad bertemu huruf tertutup, dua, empat atau enam, satu pilihan untuk seluruh bacaan. Pada ad-dallin, aa sentiasa enam.\nButang dengar ialah suara telefon. Ia tidak menjaga tajwid. Ambil contoh daripada qari di bahagian Al-Qur'an.",
    "Durunca kısa harekeyi düşür. Son harf qaf, kalın tı, be, cim veya dal ise hafif bir sıçrama ver, yeni a, i veya u ekleme.\nSatırdaki aa, ii ve uu iki miktardır. Durunca med kapalı harfe değerse iki, dört veya altı tut, bütün okuyuşta bir ölçü. Ed-dallin'de aa hep altıdır.\nDinle düğmesi telefonun sesidir. Tecvidi tutmaz. Örneği Kur'an bölümündeki kariden al.",
    "وقف پر چھوٹی حرکت ہٹا دیں۔ اگر آخری حرف ق ط ب ج د ہو تو ہلکی قلقلہ، نئی ا، اِ یا اُ کے بغیر۔\nسطر میں آ، ای اور او دو حرکت ہیں۔ وقف پر اگر مد بند حرف سے ٹکرائے تو دو، چار یا چھ، پوری قراءت میں ایک ہی مقدار۔ الضالین میں آ ہمیشہ چھ۔\nسنیں کا بٹن فون کی آواز ہے۔ تجوید نہیں رکھتا۔ نمونہ قرآن والے حصے کے قاری سے لیں۔",
  ),
  examples: [
    { ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", read: "БисмиЛлаах1ир-Рахьмаанир-Рахьиим", lat: "bismillahir-rahmanir-rahim", where: "1:1", note: L("Ра солнечная: лям не слышна, ра с шаддой. Аа в «Рахьмаан» — две. Лям Имени здесь мягкая: перед ней и.", "Ra is a sun letter: the lam is silent and ra has shadda. The aa in Rahman is two. The lam of the Name is light here, because an i stands before it.", "الراء شمسية. وألف الرحمن حركتان. ولام الجلالة هنا مرققة لكسرة قبلها.", "Ra huruf syamsiah. Aa pada Rahman dua. Lam nama di sini nipis.", "Ra şemsidir. Rahman'daki aa iki. İsimdeki lam burada incedir.", "ر شمسی ہے۔ رحمن کی آ دو۔ یہاں اللہ کی لام پتلی ہے۔") },
    { ar: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", read: "Аль-хьамду лиЛлах1и раббиль-1ааламиин", lat: "al-hamdu lillahi rabbil-alamin", where: "1:2", note: L("Хь лунная, лям слышна. Б с шаддой. На остановке «ии» можно две, четыре или шесть.", "Ha is a moon letter, so the lam is heard. B has shadda. At the stop, ii may be two, four or six.", "الحاء قمرية. والباء مشددة. وعند الوقف في «العالمين» اثنتان أو أربع أو ست.", "Ha qamariyah. B bersyaddah. Pada waqaf, ii dua, empat atau enam.", "Ha kamerî. B şeddeli. Durunca ii iki, dört veya altı.", "ح قمری ہے۔ ب شدہ۔ وقف پر ای دو، چار یا چھ۔") },
    { ar: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", read: "Ар-Рахьмаанир-Рахьиим", lat: "ar-rahmanir-rahim", where: "1:3", note: L("Снова солнечная ра. Хамзу «аль» в соединении не читай.", "Sun ra again. Do not read the hamza of al- when you join.", "راء شمسية مرة أخرى. ولا تنطق همزة الوصل في الدرج.", "Ra syamsiah lagi. Jangan baca hamzah al- ketika disambung.", "Yine şemsi ra. Vasıl hemzesini birleştirirken okuma.", "پھر شمسی ر۔ جوڑتے وقت ال کی ہمزہ نہ پڑھیں۔") },
    { ar: "مَٰلِكِ يَوْمِ ٱلدِّينِ", read: "Маалики йаумид-диин", lat: "maliki yawmid-din", where: "1:4", note: L("Короткая палочка над мимом — долгое аа, две меры. Д солнечная. Вав после а не тяни.", "The short stroke over the mim is a long aa, two counts. Dal is a sun letter. Do not hold the waw after a.", "الألف الخنجرية حركتان. والدال شمسية. والواو بعد الفتح لا تُمد.", "Alif kecil dua harakat. Dal syamsiah. Waw selepas a jangan dipanjangkan.", "Hançer elif iki. Dal şemsi. A'dan sonraki vav uzamaz.", "چھوٹی الف دو۔ د شمسی۔ ا کے بعد و نہ کھینچیں۔") },
    { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", read: "Иййаака на1буду ваъиййаака наста1иин", lat: "iyyaka na'budu wa iyyaka nasta'in", where: "1:5", note: L("Й с шаддой. Хамза в «ваъиййаака» читается: это не хамза соединения. 1 — это ع.", "Ya has shadda. The hamza in wa-iyyaka is read: it is not the joining hamza. The mark 1 is ayn.", "الياء مشددة. والهمزة في «وإياك» همزة قطع. والعين ليست همزة.", "Ya bersyaddah. Hamzah pada wa-iyyaka dibaca. Tanda 1 ialah ain.", "Ya şeddeli. Ve-iyyake'deki hemze okunur. 1, ayn'dır.", "ی شدہ۔ وَإِيَّاكَ کی ہمزہ پڑھی جاتی ہے۔ ۱ ع ہے۔") },
    { ar: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", read: "Их1динаас-сираат1аль-мустакъиим", lat: "ihdinas-siratal-mustaqim", where: "1:6", note: L("Глагол начинай с и. С в «сираат1» — это ص, полный рот, не س. Т1 — это ط. Къ не к. М лунная.", "Start the verb with i. The s in sirat is sad, a full mouth, not sin. Ta is the heavy ta. Qaf is not kaf. Mim is a moon letter.", "الفعل يُبدأ بالكسر. والصاد مفخمة لا سين. والطاء لا تاء. والقاف لا كاف. والميم قمرية.", "Fiil dimula dengan i. S pada sirat ialah sad, mulut penuh. Ta ialah ta tebal. Qaf bukan kaf.", "Fiile i ile başla. Sirat'taki s sad'dır, ağız dolu. Tı kalın tı'dır. Qaf kaf değildir.", "فعل اِ سے شروع۔ ص بھرے منہ سے، س نہیں۔ ط بھاری۔ ق ک نہیں۔") },
    { ar: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", read: "Сираат1аз-зиина ан1амта 1алайх1им г1айриль-маг1д1ууби 1алайх1им валаад1-д1ааллиин", lat: "siratadh-dhina an'amta alayhim ghayril-maghdubi alayhim wa lad-dallin", where: "1:7", note: L("З в «аз-зиина» — это ذ с шаддой, лям не слышна: ذ солнечная. Н в «ан1амта» ясен: дальше ع. Аа в «д1ааллиин» — шесть. Г1 и д1 не г и не д.", "The z in adh-dhina is dhal with shadda: the lam is silent, because dhal is a sun letter. The n in an'amta is clear, because ayn follows. The aa in ad-dallin is six. Ghayn is not g, and dad is not d.", "الذال في «الذين» مشددة بلا لام، لأنها شمسية. والنون في «أنعمت» مظهرة قبل العين. وألف «الضالين» ست.", "Z pada adh-dhina ialah dzal bersyaddah, lam tidak kedengaran. N pada an'amta jelas. Aa pada ad-dallin enam.", "Adh-dhina'daki z, şeddeli zeldir, lam duyulmaz. An'amta'daki n açıktır. Ed-dallin'de aa altıdır.", "الذین میں ذ شدہ، لام نہیں، کیونکہ شمسی ہے۔ انعمت کی ن واضح۔ الضالین کی آ چھ۔") },
    { ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", read: "Къуль х1уваЛлах1у ахьад", lat: "qul huwa Allahu ahad", where: "112:1", note: L("Къ с у, отскока нет: отскок только без гласного. Х1 — это ه. На остановке «ахьад»: д с отскоком, у танвина нет.", "Qaf has u, so there is no bounce: the bounce is only with no vowel. The light h is ha. At the stop, ahad: a bounce on the d, and the tanwin is gone.", "القاف متحركة فلا قلقلة. والهاء ليست حاء. وعند الوقف «أحد»: قلقلة على الدال بلا تنوين.", "Qaf ada u, jadi tiada pantulan. Ha ringan ialah ha. Pada waqaf, ahad: pantulan pada d, tanwin tiada.", "Qaf u'lu, sıçrama yok. Hafif h, he'dir. Durunca ahad: dalde sıçrama, tenvin yok.", "ق پر اُ ہے، قلقلہ نہیں۔ ہ ہلکی ہے۔ وقف پر احد: د پر قلقلہ، تنوین نہیں۔") },
    { ar: "ٱللَّهُ ٱلصَّمَدُ", read: "Аллах1ус-самад", lat: "Allahus-samad", where: "112:2", note: L("Сад солнечный, полный рот. На остановке д с отскоком.", "Sad is a sun letter, a full mouth. At the stop, d has a bounce.", "الصاد شمسية مفخمة. وعند الوقف قلقلة على الدال.", "Sad syamsiah, mulut penuh. Pada waqaf, d ada pantulan.", "Sad şemsi, ağız dolu. Durunca dalde sıçrama.", "ص شمسی، بھرا منہ۔ وقف پر د قلقلہ۔") },
    { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", read: "Лам йалид валам йуулад", lat: "lam yalid wa lam yulad", where: "112:3", note: L("Д без гласного — отскок, и в середине, и на остановке. На остановке он слышнее. Гласной на отскоке нет. Уу — две меры.", "Dal with no vowel has a bounce, in the middle and at the stop. At the stop it is clearer. There is no vowel on the bounce. Uu is two counts.", "الدال الساكنة فيها قلقلة، وفي الوسط وعند الوقف. ولا حركة على القلقلة. والواو حركتان.", "Dal tanpa vokal ada pantulan. Tiada vokal pada pantulan. Uu dua.", "Sessiz dalde sıçrama vardır. Sıçramada hareke yok. Uu iki.", "ساکن د پر قلقلہ۔ قلقلہ پر حرکت نہیں۔ اوو دو۔") },
    { ar: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ", read: "Валам йакул-лах1уу куфуван ахьад", lat: "wa lam yakul-lahu kufuwan ahad", where: "112:4", note: L("Нун в «йакун» вошла в лям: слышно «йакул-ла». Танвин перед хамзой ясен: «куфуван». На остановке снова «ахьад».", "The nun of yakun entered the lam: you hear yakul-la. The tanwin before hamza is clear: kufuwan. At the stop, ahad again.", "نون «يكن» دخلت في اللام. والتنوين قبل الهمزة مظهر. وعند الوقف «أحد».", "Nun yakun masuk ke lam. Tanwin sebelum hamzah jelas. Pada waqaf, ahad.", "Yekün'ün nunu lam'a girdi. Hemzeden önceki tenvin açıktır. Durunca ahad.", "یَکُن کی ن ل میں داخل۔ ہمزے سے پہلے تنوین واضح۔ وقف پر احد۔") },
  ],
  mistakes: L(
    "Не читай «الذين» с лям. Не тяни «д1ааллиин» на две. На отскоке не добавляй а, и или у.",
    "Do not read alladhina with a lam. Do not hold ad-dallin for two. Do not add a, i or u to the bounce.",
    "لا تقرأ «الذين» باللام. ولا تقصر «الضالين» إلى حركتين. ولا تزد حركة على القلقلة.",
    "Jangan baca alladhina dengan lam. Jangan pendekkan ad-dallin menjadi dua. Jangan tambah vokal pada pantulan.",
    "Elleziine'yi lamla okuma. Ed-dallin'i iki tutma. Sıçramaya a, i veya u ekleme.",
    "الذین کو لام کے ساتھ نہ پڑھیں۔ الضالین کو دو نہ رکھیں۔ قلقلہ پر حرکت نہ بڑھائیں۔",
  ),
  quiz: [
    Q(
      L("Как читается «الذين»?", "How is alladhina read?", "كيف تُقرأ «الذين»؟", "Bagaimana alladhina dibaca?", "Elleziine nasıl okunur?", "الذین کیسے پڑھا جائے؟"),
      L("Аз-зиина: ذ с шаддой, лям нет", "Adh-dhina: dhal with shadda, no lam", "بالذال المشددة بلا لام", "Dzal bersyaddah, tanpa lam", "Şeddeli zel, lamsız", "ذ شدہ کے ساتھ، بغیر لام"),
      L("Аллазиина: лям слышна", "Alladhina: the lam is heard", "باللام الظاهرة", "Lam kedengaran", "Lam duyulur", "لام سنائی دیتی ہے"),
      L("Аль тянется шесть", "Al is held for six", "تمد اللام ستًا", "Lam enam", "Lam altı", "لام چھ"),
      0,
    ),
    Q(
      L("Сколько аа в «д1ааллиин»?", "How long is the aa in ad-dallin?", "كم ألف «الضالين»؟", "Berapa aa pada ad-dallin?", "Ed-dallin'de aa kaç?", "الضالین کی آ کتنی ہے؟"),
      L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"),
      L("Две", "Two", "اثنتان", "Dua", "İki", "دو"),
      L("Одна", "One", "واحدة", "Satu", "Bir", "ایک"),
      0,
    ),
    Q(
      L("Что с «ахьад» на остановке?", "What happens to ahad at a stop?", "ماذا في «أحد» عند الوقف؟", "Apa pada ahad ketika waqaf?", "Durunca ahad'da ne olur?", "وقف پر احد میں کیا ہو؟"),
      L("Д с отскоком, без танвина", "A bounce on the d, with no tanwin", "قلقلة بلا تنوين", "Pantulan, tanpa tanwin", "Sıçrama, tenvinsiz", "قلقلہ، بغیر تنوین"),
      L("Добавить гласный у", "Add the vowel u", "تُزاد ضمة", "Tambah u", "U eklenir", "اُ بڑھائیں"),
      L("Убрать д", "Drop the d", "تُحذف الدال", "Buang d", "Dal düşer", "د ہٹائیں"),
      0,
    ),
  ],
};

const method: CourseLesson = {
  id: "method",
  tone: "plain",
  title: L("Семь шагов на каждое слово", "Seven steps for every word", "سبع خطوات لكل كلمة", "Tujuh langkah untuk setiap kata", "Her kelime için yedi adım", "ہر لفظ کے سات قدم"),
  definition: L(
    "Дальше незнакомое слово не угадывают. На каждое слово один и тот же порядок. Им читается любой аят Корана, не только суры из уроков.",
    "From here you do not guess an unknown word. Every word takes the same order. That is how any ayah of the Quran is read, not only the surahs in the lessons.",
    "من هنا لا تُخمَّن الكلمة المجهولة. لكل كلمة الترتيب نفسه. به تُقرأ أي آية، لا سور الدروس فقط.",
    "Dari sini kata yang tidak dikenali tidak diteka. Setiap kata ikut urutan yang sama. Dengan itu mana-mana ayat dibaca, bukan hanya surah dalam pelajaran.",
    "Bundan sonra bilmediğin kelimeyi tahmin etme. Her kelimede aynı sıra vardır. Kur'an'ın her ayeti bununla okunur, yalnız derslerdeki sureler değil.",
    "آگے ناواقف لفظ اندازے سے نہیں پڑھتے۔ ہر لفظ پر ایک ہی ترتیب ہے۔ اسی سے قرآن کی ہر آیت پڑھی جاتی ہے، صرف سبق والی سورتیں نہیں۔",
  ),
  letters: "١ ٢ ٣ ٤ ٥ ٦ ٧",
  mechanism: L(
    "1. Точки и форма — какая буква.\n2. Гласный или кружок.\n3. Шадда — буква дважды: сначала без гласного, сразу с гласным.\n4. Долгая буква после своего гласного. В строке «аа ии уу» не написано, две это или больше. Обычная — две. Дальше хамза — четыре или пять, одну меру на всё чтение. На остановке, если протяжка упёрлась в закрытую букву, — две, четыре или шесть. Обязательная, как в «д1ааллиин», — шесть. Хамза стоит перед протяжкой, как в «аамануу», — всё равно две.\n5. Нун без гласного, танвин или мим без гласного — смотри следующую букву, не эту.\n6. «Аль»: солнечная — лям нет, буква с шаддой. Лунная — лям слышна. Хамза «аль» в середине не читается.\n7. Остановка: короткий гласный сними. ق ط ب ج د — отскок, без нового а, и или у. Танвин с а даёт алиф, кроме ة: там х1. ة на остановке — х1, в соединении — т.\nШадда от слияния с прошлым словом есть только если ты слова соединил. Начал после остановки — буква один раз.",
    "1. Dots and shape: which letter.\n2. The vowel, or the circle.\n3. Shadda: the letter twice, first with no vowel, then at once with the vowel.\n4. A long letter after its own vowel. The line writes aa, ii and uu for every length. Ordinary is two. A hamza after it is four or five: keep one for the whole reading. At a stop, if the lengthening meets a closed letter, two, four or six. The required one, as in ad-dallin, is six. If the hamza stands before the lengthening, as in aamanu, it is still two.\n5. Nun with no vowel, tanwin, or meem with no vowel: look at the next letter, not this one.\n6. Al-: before a sun letter the lam is silent and that letter has shadda. Before a moon letter the lam is heard. The hamza of al- is not read in the middle.\n7. At a stop, drop the short vowel. Qaf, the heavy ta, ba, jim and dal bounce, with no new a, i or u. Tanwin with a gives an alif, except on ta marbuta: there it is the light h. Ta marbuta is the light h when you stop, and t when you join.\nA shadda that came from merging with the previous word is there only if you joined the words. If you start after a stop, say the letter once.",
    "١. النقط والصورة. ٢. الحركة أو السكون. ٣. الشدة: بلا حركة ثم بالحركة. ٤. حرف المد بعد حركته. السطر لا يكتب كم الحركة. الطبيعي حركتان، وبعده همزة فأربع أو خمس بوجه واحد. وعند الوقف قبل الساكن اثنتان أو أربع أو ست. واللازم ست. وإن كانت الهمزة قبل المد، كـ«آمنوا»، فحركتان. ٥. النون الساكنة والتنوين والميم الساكنة: انظر إلى الحرف التالي. ٦. الشمسي بلا لام وبشدة، والقمري باللام. وهمزة «ال» لا تُنطق في الدرج. ٧. عند الوقف تُسقط الحركة القصيرة، وفي ق ط ب ج د قلقلة بلا حركة جديدة. وتنوين الفتح ألف إلا على ة. والشدة التي جاءت من الإدغام لا تُنطق إذا بدأت بعد وقف.",
    "1. Titik dan bentuk. 2. Vokal atau bulatan. 3. Syaddah: dua kali, tanpa vokal lalu terus dengan vokal. 4. Huruf mad selepas vokalnya. Baris tidak menulis berapa harakat. Biasa dua. Selepasnya hamzah: empat atau lima, satu kadar. Pada waqaf, jika mad bertemu huruf tertutup: dua, empat atau enam. Yang wajib enam. Jika hamzah sebelum mad, seperti aamanu, tetap dua. 5. Nun sukun, tanwin atau mim sukun: lihat huruf berikutnya. 6. Syamsiah tanpa lam dan bersyaddah. Qamariyah dengan lam. Hamzah al- tidak dibaca di tengah. 7. Pada waqaf gugurkan vokal pendek. Qaf, ta tebal, ba, jim, dal ada pantulan. Tanwin a menjadi alif, kecuali pada ta marbutah. Syaddah yang datang dari leburan hanya jika kamu sambung. Mulai selepas waqaf: huruf sekali.",
    "1. Nokta ve şekil. 2. Hareke ya da yuvarlak. 3. Şedde: önce sessiz, hemen harekesiyle. 4. Med harfi kendi harekesinden sonra. Satır kaç miktar olduğunu yazmaz. Normal iki. Ardından hemze: dört veya beş, tek ölçü. Durunca med kapalı harfe değerse iki, dört veya altı. Lazım olan altı. Hemze medden önceyse, aamanu gibi, yine iki. 5. Sükûnlu nun, tenvin veya sükûnlu mim: sonraki harfe bak. 6. Şemsîde lam yok, harf şeddeli. Kamerîde lam duyulur. El-'in hemzesi ortada okunmaz. 7. Durunca kısa harekeyi düşür. Qaf, kalın tı, be, cim, dal sıçrar. A'lı tenvin elif verir, te marbuta hariç. Önceki kelimeyle kaynaşmadan gelen şedde, yalnız kelimeleri birleştirdiysen vardır. Durduktan sonra başladıysan harfi bir kez söyle.",
    "١. نقطے اور شکل۔ ٢. حرکت یا دائرہ۔ ٣. شدہ: پہلے ساکن، پھر حرکت کے ساتھ۔ ٤. مد کا حرف اپنی حرکت کے بعد۔ سطر یہ نہیں بتاتی کتنی حرکت ہے۔ عام دو۔ بعد میں ہمزہ ہو تو چار یا پانچ، ایک ہی مقدار۔ وقف پر اگر مد بند حرف سے ٹکرائے تو دو، چار یا چھ۔ لازمی چھ۔ اگر ہمزہ مد سے پہلے ہو، جیسے آمنوا، تب بھی دو۔ ٥. ساکن نون، تنوین یا ساکن میم: اگلا حرف دیکھیں۔ ٦. شمسی میں لام نہیں، حرف شدہ۔ قمری میں لام سنائی دیتی ہے۔ درمیان میں ال کی ہمزہ نہیں پڑھی جاتی۔ ٧. وقف پر چھوٹی حرکت ہٹا دیں۔ ق ط ب ج د پر قلقلہ۔ ا والا تنوین الف دیتا ہے، سوائے ة کے۔ جو شدہ پچھلے لفظ سے مل کر آئی ہو وہ صرف جوڑنے پر ہے۔ وقف کے بعد شروع کریں تو حرف ایک بار۔",
  ),
  examples: [
    { ar: "بِسْمِ", read: "Бисм", lat: "Bism", where: "шаг", note: L("Б, точка снизу, гласный и. С без гласного. М. На остановке и снят. Если идёшь дальше, к «Аллах1», слышно «бисми».", "Ba, the dot below, the vowel i. Sin with no vowel. Mim. At a stop the i is dropped. If you go on, to Allah, you hear bismi.", "باء، كسرة. سين ساكنة. ميم. عند الوقف تسقط الكسرة. وفي الوصل تُسمع.", "Ba, titik di bawah, vokal i. Sin tanpa vokal. Pada waqaf i gugur. Jika disambung, bismi.", "Be, altta nokta, i. Sin sessiz. Durunca i düşer. Devam edersen bismi.", "ب، نیچے نقطہ، اِ۔ س بغیر حرکت۔ وقف پر اِ نہیں۔ آگے چلیں تو بسمی۔") },
    { ar: "ٱلرَّحْمَٰنِ", read: "Ар-Рахьмаан", lat: "Ar-Rahmaan", where: "шаг", note: L("Р солнечная: лям нет, р с шаддой. Хь — это ح. Палочка — аа, две. На остановке и снят.", "Ra is a sun letter: no lam, ra with shadda. The soft h is ha. The stroke is aa, two. At a stop the i is dropped.", "الراء شمسية. ح ليست خ. والألف الخنجرية حركتان. وعند الوقف تسقط الكسرة.", "Ra syamsiah. Ha ialah ha. Alif kecil dua. Pada waqaf i gugur.", "Ra şemsi. Ha, hı değil. Hançer elif iki. Durunca i düşer.", "ر شمسی ہے۔ ح ہے۔ چھوٹی الف دو۔ وقف پر اِ نہیں۔") },
    { ar: "أَحَدٌ", read: "Ахьад", lat: "Ahad", where: "шаг", note: L("Хь — это ح, не ه. На остановке танвин снят, д с отскоком. Гласной на отскоке нет.", "Ha is the throat ha, not the light breath. At a stop the tanwin is gone and dal bounces. There is no vowel on the bounce.", "ح ليست هـ. وعند الوقف يسقط التنوين وعلى الدال قلقلة بلا حركة.", "Ha bukan he. Pada waqaf tanwin gugur, dal ada pantulan, tanpa vokal.", "Ha, he değil. Durunca tenvin düşer, dal sıçrar, hareke yok.", "ح ہے، ہ نہیں۔ وقف پر تنوین نہیں، د پر قلقلہ، حرکت نہیں۔") },
  ],
  mistakes: L(
    "Не читай строку вместо арабского. «Аа» в строке не говорит, две это или четыре: меру решаешь ты. Восемь помеченных звуков — хь, х, х1, 1, г1, къ, д1, т1 — по строке не выучишь. Их место бери у чтеца, пока рот не совпадёт.",
    "Do not read the line instead of the Arabic. Aa in the line does not say whether it is two or four: you decide the count. The eight marked sounds are not learned from the line. Take their place from the reciter, until the mouth matches.",
    "لا تقرأ السطر بدل العربي. الألف في السطر لا تقول كم الحركة. والأصوات الثمانية لا تُتعلم من السطر. خذ مخرجها من القارئ حتى يطابق الفم.",
    "Jangan baca baris sebagai ganti Arab. Aa pada baris tidak memberitahu dua atau empat. Lapan bunyi bertanda tidak dipelajari dari baris. Ambil tempatnya daripada qari.",
    "Satırı Arapçanın yerine okuma. Satırdaki aa, iki mi dört mü söylemez. İşaretli sekiz ses satırdan öğrenilmez. Yerini kariden al.",
    "سطر کو عربی کی جگہ نہ پڑھیں۔ سطر کی آ دو ہے یا چار، یہ نہیں بتاتی۔ آٹھ نشان والی آوازیں سطر سے نہیں سیکھتیں۔ ان کی جگہ قاری سے لیں۔",
  ),
  quiz: [
    Q(L("С чего начинают незнакомое слово?", "Where do you start an unknown word?", "بم تبدأ الكلمة المجهولة؟", "Dari mana kata yang tidak dikenali dimula?", "Bilinmeyen kelimeye nereden başlanır?", "ناواقف لفظ کہاں سے شروع ہو؟"), L("С буквы: точки и форма", "With the letter: the dots and the shape", "بالحرف: النقط والصورة", "Dengan huruf: titik dan bentuk", "Harfle: nokta ve şekil", "حرف سے: نقطے اور شکل"), L("С перевода", "With the translation", "بالترجمة", "Dengan terjemahan", "Meal ile", "ترجمے سے"), L("Со скорости", "With speed", "بالسرعة", "Dengan laju", "Hızla", "رفتار سے"), 0),
    Q(L("Нун без гласного: куда смотреть?", "Nun with no vowel: where do you look?", "النون الساكنة: إلى أين تنظر؟", "Nun sukun: lihat ke mana?", "Sükûnlu nun: nereye bakılır?", "ساکن نون: کہاں دیکھیں؟"), L("На следующую букву", "At the next letter", "إلى الحرف التالي", "Pada huruf berikutnya", "Sonraki harfe", "اگلے حرف پر"), L("На прошлый аят", "At the previous ayah", "إلى الآية السابقة", "Pada ayat sebelumnya", "Önceki ayete", "پچھلی آیت پر"), L("На номер страницы", "At the page number", "إلى رقم الصفحة", "Pada nombor halaman", "Sayfa numarasına", "صفحے کے نمبر پر"), 0),
    Q(L("«Аа» в строке значит?", "Aa in the line means?", "«آ» في السطر تعني؟", "Aa pada baris maksudnya?", "Satırdaki aa ne demektir?", "سطر میں آ کا مطلب؟"), L("Меру решаешь ты по правилу", "You decide the count by the rule", "المقدار تقرره أنت بالحكم", "Kadarnya kamu tentukan mengikut hukum", "Miktarı kurala göre sen seçersin", "مقدار آپ قاعدے سے طے کرتے ہیں"), L("Всегда две", "Always two", "حركتان دائمًا", "Sentiasa dua", "Hep iki", "ہمیشہ دو"), L("Всегда шесть", "Always six", "ست دائمًا", "Sentiasa enam", "Hep altı", "ہمیشہ چھ"), 0),
  ],
};

const readKawthar: CourseLesson = {
  id: "read-kawthar",
  tone: "madd",
  cover: true,
  title: L("Каусар, Наср, Масад", "Al-Kawthar, An-Nasr, Al-Masad", "الكوثر والنصر والمسد", "Al-Kauthar, An-Nasr, Al-Masad", "Kevser, Nasr, Mesed", "کوثر، نصر، مسد"),
  definition: L(
    "Строка скрыта. Прочитай аят арабским, по семи шагам, вслух. Потом «Сверить». Строка — та же, что в Коране приложения. На последнем слове остановись.",
    "The line is hidden. Read the ayah in Arabic, by the seven steps, aloud. Then check. The line is the same as in the Quran of this app. Stop on the last word.",
    "السطر مخفي. اقرأ الآية بالعربي على الخطوات السبع بصوت. ثم أظهر السطر. السطر هو سطر قرآن التطبيق. قف على الكلمة الأخيرة.",
    "Baris disembunyikan. Baca ayat dalam Arab, ikut tujuh langkah, dengan suara. Kemudian semak. Baris sama seperti Al-Qur'an aplikasi. Berhenti pada kata terakhir.",
    "Satır gizli. Ayeti Arapça, yedi adımla, sesli oku. Sonra satırı aç. Satır, uygulamadaki Kur'an ile aynıdır. Son kelimede dur.",
    "سطر چھپی ہے۔ آیت عربی میں سات قدموں سے آواز کے ساتھ پڑھیں۔ پھر سطر دیکھیں۔ سطر اسی ایپ کے قرآن جیسی ہے۔ آخری لفظ پر رکیں۔",
  ),
  letters: "١٠٨ · ١١٠ · ١١١",
  mechanism: L(
    "Не открывай строку, пока аят не сказан. Если не совпало — найди шаг: буква, мера, «аль» или остановка. Не учи строку наизусть.",
    "Do not open the line until the ayah has been said. If it does not match, find the step: the letter, the count, al-, or the stop. Do not memorise the line.",
    "لا تفتح السطر قبل أن تقول الآية. إن خالفت فابحث عن الخطوة: الحرف أو المقدار أو «ال» أو الوقف. لا تحفظ السطر.",
    "Jangan buka baris sebelum ayat disebut. Jika tidak sama, cari langkahnya: huruf, kadar, al- atau waqaf. Jangan hafal baris.",
    "Ayet söylenmeden satırı açma. Uymadıysa adımı bul: harf, miktar, el- veya duruş. Satırı ezberleme.",
    "آیت کہے بغیر سطر نہ کھولیں۔ اگر نہ ملے تو قدم ڈھونڈیں: حرف، مقدار، ال یا وقف۔ سطر یاد نہ کریں۔",
  ),
  examples: [
    { ar: "إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ", read: "Иннаа а1т1айнаакаль-каусар", lat: "Innaa a'taynaakal-kauthar", where: "108:1", note: L("Первое аа — четыре или пять: дальше хамза. Палочка над т1 — две. К лунная, лям слышна.", "The first aa is four or five: a hamza follows. The stroke over the heavy ta is two. Kaf is a moon letter, so the lam is heard.", "الألف الأولى أربع أو خمس لهمزة بعدها. والخنجرية حركتان. والكاف قمرية.", "Aa pertama empat atau lima. Alif kecil dua. Kaf qamariyah.", "İlk aa dört veya beş. Hançer elif iki. Kaf kamerî.", "پہلی آ چار یا پانچ۔ چھوٹی الف دو۔ ک قمری ہے۔") },
    { ar: "فَصَلِّ لِرَبِّكَ وَٱنْحَرْ", read: "Фасалли лираббика ванхьар", lat: "Fasalli lirabbika wanhar", where: "108:2", note: L("Лам и б с шаддой. Хамзу «анхьар» в соединении не читай. Хь — это ح.", "Lam and ba have shadda. Do not read the hamza of anhar when you join. The soft h is ha.", "اللام والباء مشددتان. وهمزة الوصل في الدرج لا تُنطق. والحاء ليست هاء.", "Lam dan ba bersyaddah. Hamzah anhar tidak dibaca ketika disambung.", "Lam ve be şeddeli. Anhar'ın hemzesi birleşince okunmaz.", "لام اور ب شدہ۔ جوڑتے وقت انحر کی ہمزہ نہیں۔") },
    { ar: "إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ", read: "Инна шааниъака х1уваль-ъабтар", lat: "Inna shaani'aka huwal-'abtar", where: "108:3", note: L("Хамза в «шааниъака» читается. После «аль» тоже хамза, она лунная: лям слышна. На остановке у сними.", "The hamza in shaani'aka is read. After al- there is also a hamza, and it is a moon letter: the lam is heard. At the stop, drop the u.", "الهمزة في «شانيك» همزة قطع. وهمزة «الأبتر» قمرية. وعند الوقف تُسقط الضمة.", "Hamzah pada syaani'aka dibaca. Selepas al- juga hamzah, qamariyah. Pada waqaf, gugurkan u.", "Şaani'eke'deki hemze okunur. El-'den sonra da hemze var, kamerî. Durunca u'yu düşür.", "شَانِئَكَ کی ہمزہ پڑھی جاتی ہے۔ ال کے بعد بھی ہمزہ ہے، قمری۔ وقف پر اُ ہٹائیں۔") },
    { ar: "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ", read: "Изаа джааъа насруЛлах1и валь-фатхь", lat: "Idhaa jaa'a nasruLlahi wal-fath", where: "110:1", note: L("Аа в «джааъа» — четыре или пять: хамза в том же слове. Лям Имени твёрдая: перед ней у. Хь — это ح. Ф лунная.", "The aa in jaa'a is four or five: the hamza is in the same word. The lam of the Name is heavy, because a u stands before it. The soft h is ha. Fa is a moon letter.", "ألف «جاء» أربع أو خمس. ولام الجلالة مغلظة لضمة قبلها. والحاء ليست خاء. والفاء قمرية.", "Aa pada jaa'a empat atau lima. Lam nama tebal. Ha ialah ha. Fa qamariyah.", "Cae'deki aa dört veya beş. İsimdeki lam kalın. Ha, hı değil. Fe kamerî.", "جَآءَ کی آ چار یا پانچ۔ اللہ کی لام موٹی۔ ح ہے۔ ف قمری۔") },
    { ar: "وَرَأَيْتَ ٱلنَّاسَ يَدْخُلُونَ فِى دِينِ ٱللَّهِ أَفْوَاجًۭا", read: "Вараъайтан-нааса йадхулууна фии дииниЛлах1и афвааджаа", lat: "Wara'aytan-naasa yadkhuluuna fii diiniLlahi afwaajaa", where: "110:2", note: L("Н солнечная. Уу и ии — две. Лям Имени мягкая: перед ней и. На остановке танвин с а дал алиф.", "Nun is a sun letter. Uu and ii are two. The lam of the Name is light, because an i stands before it. At the stop, tanwin with a became an alif.", "النون شمسية. والواو والياء حركتان. ولام الجلالة مرققة لكسرة قبلها. وتنوين الفتح عند الوقف ألف.", "Nun syamsiah. Uu dan ii dua. Lam nama nipis. Tanwin a pada waqaf menjadi alif.", "Nun şemsi. Uu ve ii iki. İsimdeki lam ince. A'lı tenvin durunca elif oldu.", "ن شمسی ہے۔ اوو اور ای دو۔ اللہ کی لام پتلی ہے۔ وقف پر تنوین الف بن گیا۔") },
    { ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا", read: "Фасаббихь бихьамди раббика вастаг1фирх1у иннах1уу каана тавваабаа", lat: "Fasabbih bihamdi rabbika wastaghfirhu innahuu kaana tawwaabaa", where: "110:3", note: L("Хь — ح, г1 — غ. Уу в «иннах1уу» — две: дальше не хамза. На остановке «тавваабаа», вав с шаддой.", "The soft h is ha, and ghayn is not an ordinary g. The uu in innahu is two: what follows is not a hamza. At the stop, tawwaba, and the waw has shadda.", "ح ليست هـ، وغ ليست جيمًا. وواو «إنه» حركتان. وعند الوقف «توابًا» بالألف والواو مشددة.", "Ha ialah ha. Uu pada innahu dua. Pada waqaf, tawwaba, waw bersyaddah.", "Ha, he değil. İnnehu'daki uu iki. Durunca tevvaba, vav şeddeli.", "ح ہے۔ اِنَّهُ کی اوو دو۔ وقف پر تَوَّابًا، و شدہ۔") },
    { ar: "تَبَّتْ يَدَآ أَبِى لَهَبٍۢ وَتَبَّ", read: "Таббат йадаа абии лах1абив-ватабб", lat: "Tabbat yadaa abii lahabiw-watabb", where: "111:1", note: L("Аа в «йадаа» — четыре или пять. Танвин вошёл в в. На остановке б с шаддой и отскоком, без гласного.", "The aa in yadaa is four or five. The tanwin entered the waw. At the stop, ba has shadda and a bounce, with no vowel.", "ألف «يدا» أربع أو خمس. والتنوين دخل في الواو. وعند الوقف قلقلة على الباء المشددة بلا حركة.", "Aa pada yadaa empat atau lima. Tanwin masuk ke waw. Pada waqaf, ba bersyaddah ada pantulan.", "Yeda'daki aa dört veya beş. Tenvin vav'a girdi. Durunca şeddeli be sıçrar.", "يَدَآ کی آ چار یا پانچ۔ تنوین و میں داخل۔ وقف پر ب شدہ اور قلقلہ۔") },
    { ar: "مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ", read: "Маа аг1наа 1анх1у маалух1уу вамаа касаб", lat: "Maa aghnaa 'anhu maaluhuu wamaa kasab", where: "111:2", note: L("Первое аа — четыре или пять. Палочка в «аг1наа» — две. Н перед х1 ясен. На остановке б с отскоком.", "The first aa is four or five. The stroke in aghnaa is two. The n before the light h is clear. At the stop, ba bounces.", "الألف الأولى أربع أو خمس. والخنجرية حركتان. والنون قبل الهاء مظهرة. وعلى الباء قلقلة.", "Aa pertama empat atau lima. Alif kecil dua. N sebelum ha jelas. Ba ada pantulan.", "İlk aa dört veya beş. Hançer elif iki. He'den önceki n açık. Be sıçrar.", "پہلی آ چار یا پانچ۔ چھوٹی الف دو۔ ہ سے پہلے ن واضح۔ ب قلقلہ۔") },
    { ar: "سَيَصْلَىٰ نَارًۭا ذَاتَ لَهَبٍۢ", read: "Сайаслаа нааран заата лах1аб", lat: "Sayaslaa naaran dhaata lahab", where: "111:3", note: L("Н перед ذ скрыт, в строке н остаётся. З — это ذ, не ز. На остановке танвина нет, б с отскоком.", "The n before dhal is hidden, and the line still writes n. The z is dhal, not zay. At the stop there is no tanwin, and ba bounces.", "النون قبل الذال مخفاة، والسطر يبقي النون. والذال ليست زايًا. وعند الوقف لا تنوين وعلى الباء قلقلة.", "N sebelum dzal tersembunyi, baris tetap menulis n. Z ialah dzal. Pada waqaf tiada tanwin, ba ada pantulan.", "Zel'den önceki n gizli, satır n'yi bırakır. Z, zeldir. Durunca tenvin yok, be sıçrar.", "ذ سے پہلے ن چھپی ہے، سطر میں ن رہتی ہے۔ ز ذ ہے۔ وقف پر تنوین نہیں، ب قلقلہ۔") },
    { ar: "وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ", read: "Вамраъатух1уу хьаммаалаталь-хьат1аб", lat: "Wamra'atuhuu hammaalatal-hatab", where: "111:4", note: L("Хамзу соединения не читай. ة в соединении — т. Хь лунная. Т1 — это ط. На остановке б с отскоком.", "Do not read the joining hamza. Ta marbuta is t when you join. Ha is a moon letter. The heavy ta is not an ordinary t. At the stop, ba bounces.", "همزة الوصل لا تُنطق. والتاء المربوطة في الوصل تاء. والحاء قمرية. والطاء ليست تاء. وعلى الباء قلقلة.", "Hamzah wasal tidak dibaca. Ta marbutah ketika disambung ialah t. Ha qamariyah. Pada waqaf ba ada pantulan.", "Vasıl hemzesi okunmaz. Te marbuta birleşince t. Ha kamerî. Durunca be sıçrar.", "ہمزہ وصل نہیں۔ ة جوڑنے پر ت۔ ح قمری۔ ط عام ت نہیں۔ وقف پر ب قلقلہ۔") },
    { ar: "فِى جِيدِهَا حَبْلٌۭ مِّن مَّسَدٍۭ", read: "Фии джиидих1аа хьаблум-мим-масад", lat: "Fii jiidihaa hablum-mim-masad", where: "111:5", note: L("Ии и аа — две. Танвин вошёл в м. Мим вошёл в мим. На остановке д с отскоком, танвина нет.", "Ii and aa are two. The tanwin entered the meem. Meem entered meem. At the stop, dal bounces, and there is no tanwin.", "الياء والألف حركتان. والتنوين دخل في الميم، والميم في الميم. وعند الوقف قلقلة على الدال بلا تنوين.", "Ii dan aa dua. Tanwin masuk ke mim. Mim masuk ke mim. Pada waqaf dal ada pantulan, tanpa tanwin.", "Ii ve aa iki. Tenvin mim'e girdi. Mim, mim'e girdi. Durunca dal sıçrar, tenvin yok.", "ای اور آ دو۔ تنوین م میں داخل۔ میم میم میں داخل۔ وقف پر د قلقلہ، تنوین نہیں۔") },
  ],
  mistakes: L(
    "Не тяни «джааъа» на две. Не читай лям в «аль-ъабтар». На отскоке не добавляй гласный.",
    "Do not hold jaa'a for two. Do not drop the lam in al-abtar. Do not add a vowel to the bounce.",
    "لا تقصر «جاء» إلى حركتين. ولا تحذف لام «الأبتر». ولا تزد حركة على القلقلة.",
    "Jangan pendekkan jaa'a menjadi dua. Jangan buang lam pada al-abtar. Jangan tambah vokal pada pantulan.",
    "Cae'yi iki tutma. El-ebter'de lamı düşürme. Sıçramaya hareke ekleme.",
    "جَآءَ کو دو نہ رکھیں۔ الأبتر کی لام نہ ہٹائیں۔ قلقلہ پر حرکت نہ بڑھائیں۔",
  ),
  quiz: [
    Q(L("Сколько первое аа в «иннаа а1т1айнаака»?", "How long is the first aa in innaa a'taynaka?", "كم ألف «إنا أعطيناك» الأولى؟", "Berapa aa pertama pada innaa a'taynaka?", "İnna a'taynake'de ilk aa kaç?", "اِنَّآ أَعْطَيْنَاكَ کی پہلی آ کتنی ہے؟"), L("Четыре или пять: дальше хамза", "Four or five: a hamza follows", "أربع أو خمس لهمزة بعدها", "Empat atau lima: ada hamzah", "Dört veya beş: ardından hemze var", "چار یا پانچ: آگے ہمزہ ہے"), L("Две", "Two", "اثنتان", "Dua", "İki", "دو"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), 0),
    Q(L("«аль-ъабтар»: что с лям?", "In al-abtar, what about the lam?", "لام «الأبتر»؟", "Lam pada al-abtar?", "El-ebter'de lam?", "الأبتر کی لام؟"), L("Слышна: хамза лунная", "It is heard: hamza is a moon letter", "تُنطق: الهمزة قمرية", "Kedengaran: hamzah qamariyah", "Duyulur: hemze kamerîdir", "سنائی دیتی ہے: ہمزہ قمری ہے"), L("Не слышна", "It is silent", "لا تُنطق", "Tidak kedengaran", "Duyulmaz", "نہیں سنائی دیتی"), L("Тянется шесть", "It is held for six", "تُمد ستًا", "Dipanjangkan enam", "Altı uzar", "چھ کھینچی جاتی ہے"), 0),
    Q(L("На остановке «ватабб»?", "At the stop, watabb?", "عند الوقف «وتب»؟", "Pada waqaf, watabb?", "Durunca vetebb?", "وقف پر وَتَبَّ؟"), L("Б с шаддой и отскоком", "Ba with shadda and a bounce", "باء مشددة بقلقلة", "Ba bersyaddah dengan pantulan", "Şeddeli be, sıçramalı", "ب شدہ اور قلقلہ"), L("Добавить гласный у", "Add the vowel u", "تُزاد ضمة", "Tambah u", "U eklenir", "اُ بڑھائیں"), L("Убрать б", "Drop the ba", "تُحذف الباء", "Buang ba", "Be düşer", "ب ہٹائیں"), 0),
  ],
};

const readGuard: CourseLesson = {
  id: "read-guard",
  tone: "madd",
  cover: true,
  title: L("Фаляк, Нас, Аср", "Al-Falaq, An-Nas, Al-Asr", "الفلق والناس والعصر", "Al-Falaq, An-Nas, Al-Asr", "Felak, Nas, Asr", "فلق، ناس، عصر"),
  definition: L(
    "Снова строка скрыта. Эти три суры читают каждый день. Здесь они проверка: правило называется внизу, слово говоришь ты.",
    "The line is hidden again. These three surahs are read every day. Here they are a check: the note names the rule, and you say the word.",
    "السطر مخفي مرة أخرى. هذه السور الثلاث تُقرأ كل يوم. هنا هي امتحان: الحكم مذكور تحت، والكلمة تقولها أنت.",
    "Baris disembunyikan lagi. Tiga surah ini dibaca setiap hari. Di sini ia ujian: nota menyebut hukum, kata disebut olehmu.",
    "Satır yine gizli. Bu üç sure her gün okunur. Burada sınavdır: kural altta yazılı, kelimeyi sen söylersin.",
    "سطر پھر چھپی ہے۔ یہ تین سورتیں ہر دن پڑھی جاتی ہیں۔ یہاں امتحان ہے: قاعدہ نیچے لکھا ہے، لفظ آپ بولیں۔",
  ),
  letters: "١١٣ · ١١٤ · ١٠٣",
  mechanism: L(
    "На остановке в «наас», если после аа буква закрылась, можно две, четыре или шесть. Одну меру на всё чтение. Н перед ш в строке остаётся, звук н скрыт.",
    "At a stop in nas, if the letter after aa has closed, you may hold two, four or six. Keep one count for the whole reading. Before shin the line still writes n, and the sound of n is hidden.",
    "عند الوقف في «الناس» إذا سكن ما بعد الألف فاثنتان أو أربع أو ست، ووجه واحد. والنون قبل الشين تبقى في السطر والصوت مخفي.",
    "Pada waqaf dalam nas, jika huruf selepas aa tertutup, dua, empat atau enam, satu kadar. Sebelum syin baris tetap menulis n, bunyi n tersembunyi.",
    "Nas'ta durunca aa'dan sonraki harf kapandıysa iki, dört veya altı, tek ölçü. Şin'den önce satır n'yi bırakır, n sesi gizlidir.",
    "ناس پر وقف میں اگر آ کے بعد حرف بند ہو تو دو، چار یا چھ، ایک ہی مقدار۔ ش سے پہلے سطر میں ن رہتی ہے، ن کی آواز چھپی ہوتی ہے۔",
  ),
  examples: [
    { ar: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", read: "Къуль а1уузу бираббиль-фалакъ", lat: "Qul a'uudhu birabbil-falaq", where: "113:1", note: L("Къ с у, отскока нет. Уу — две. Ф лунная, лям слышна. На остановке къ с отскоком.", "Qaf has u, so there is no bounce. Uu is two. Fa is a moon letter, so the lam is heard. At the stop, qaf bounces.", "القاف متحركة فلا قلقلة. والواو حركتان. والفاء قمرية. وعند الوقف قلقلة على القاف.", "Qaf ada u, tiada pantulan. Uu dua. Fa qamariyah. Pada waqaf qaf ada pantulan.", "Qaf u'lu, sıçrama yok. Uu iki. Fe kamerî. Durunca qaf sıçrar.", "ق پر اُ ہے، قلقلہ نہیں۔ اوو دو۔ ف قمری۔ وقف پر ق قلقلہ۔") },
    { ar: "مِن شَرِّ مَا خَلَقَ", read: "Мин шарри маа халакъ", lat: "Min sharri maa khalaq", where: "113:2", note: L("Н перед ш скрыт, в строке н остаётся. Аа — две. На остановке къ с отскоком. Х — это خ.", "The n before shin is hidden, and the line still writes n. Aa is two. At the stop, qaf bounces. The rough h is kha.", "النون قبل الشين مخفاة والسطر يبقيها. والألف حركتان. وعلى القاف قلقلة. والخاء ليست حاء.", "N sebelum syin tersembunyi. Aa dua. Qaf ada pantulan. Kha bukan ha.", "Şin'den önceki n gizli. Aa iki. Qaf sıçrar. Hı, ha değil.", "ش سے پہلے ن چھپی ہے۔ آ دو۔ ق قلقلہ۔ خ ہے۔") },
    { ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", read: "Вамин шарри г1аасикъин изаа вакъаб", lat: "Wamin sharri ghaasiqin idhaa waqab", where: "113:3", note: L("Г1 — это غ. Танвин перед хамзой ясен. Аа — две. На остановке б с отскоком.", "Ghayn is not an ordinary g. The tanwin before hamza is clear. Aa is two. At the stop, ba bounces.", "الغين ليست جيمًا. والتنوين قبل الهمزة مظهر. والألف حركتان. وعلى الباء قلقلة.", "Ghain bukan jim. Tanwin sebelum hamzah jelas. Aa dua. Ba ada pantulan.", "Ğayn, cim değil. Hemzeden önceki tenvin açık. Aa iki. Be sıçrar.", "غ عام گ نہیں۔ ہمزے سے پہلے تنوین واضح۔ آ دو۔ ب قلقلہ۔") },
    { ar: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ", read: "Вамин шаррин-наффаасаати фииль-1укъад", lat: "Wamin sharrin-naffaathaati fiil-'uqad", where: "113:4", note: L("Н вошёл в н. Аа — две, это палочки. 1 — это ع, лунная. На остановке д с отскоком.", "The n entered the n. The aa marks are two: they are the short strokes. Ayn is a moon letter. At the stop, dal bounces.", "النون دخلت في النون. والألفات الخنجرية حركتان. والعين قمرية. وعلى الدال قلقلة.", "N masuk ke n. Aa dua. Ain qamariyah. Dal ada pantulan.", "N, n'ye girdi. Aa iki. Ayn kamerî. Dal sıçrar.", "ن ن میں داخل۔ آ دو۔ ع قمری۔ د قلقلہ۔") },
    { ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", read: "Вамин шарри хьаасидин изаа хьасад", lat: "Wamin sharri haasidin idhaa hasad", where: "113:5", note: L("Хь — ح. Танвин перед хамзой ясен. На остановке д с отскоком.", "Ha is the throat ha. The tanwin before hamza is clear. At the stop, dal bounces.", "الحاء ليست هاء. والتنوين قبل الهمزة مظهر. وعلى الدال قلقلة.", "Ha ialah ha. Tanwin sebelum hamzah jelas. Dal ada pantulan.", "Ha, he değil. Hemzeden önceki tenvin açık. Dal sıçrar.", "ح ہے۔ ہمزے سے پہلے تنوین واضح۔ د قلقلہ۔") },
    { ar: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", read: "Къуль а1уузу бираббин-наас", lat: "Qul a'uudhu birabbin-naas", where: "114:1", note: L("Н солнечная, лям нет. На остановке аа можно две, четыре или шесть: после неё буква закрылась.", "Nun is a sun letter, so there is no lam. At the stop, aa may be two, four or six: the letter after it has closed.", "النون شمسية بلا لام. وعند الوقف الألف اثنتان أو أربع أو ست لأن ما بعدها سكن.", "Nun syamsiah, tanpa lam. Pada waqaf aa dua, empat atau enam.", "Nun şemsi, lam yok. Durunca aa iki, dört veya altı.", "ن شمسی، لام نہیں۔ وقف پر آ دو، چار یا چھ۔") },
    { ar: "مَلِكِ ٱلنَّاسِ", read: "Маликин-наас", lat: "Malikin-naas", where: "114:2", note: L("Снова солнечная н. И короткое, его не тяни.", "Sun nun again. The i is short: do not hold it.", "نون شمسية مرة أخرى. والكسرة قصيرة لا تُمد.", "Nun syamsiah lagi. I pendek, jangan dipanjangkan.", "Yine şemsi nun. İ kısa, uzatma.", "پھر شمسی ن۔ اِ چھوٹی ہے، نہ کھینچیں۔") },
    { ar: "إِلَٰهِ ٱلنَّاسِ", read: "Илаах1ин-наас", lat: "Ilaahin-naas", where: "114:3", note: L("Палочка — аа, две. Х1 — это ه. Н солнечная.", "The stroke is aa, two. The light h is ha. Nun is a sun letter.", "الخنجرية حركتان. والهاء ليست حاء. والنون شمسية.", "Alif kecil dua. Ha ialah he. Nun syamsiah.", "Hançer elif iki. He, ha değil. Nun şemsi.", "چھوٹی الف دو۔ ہ ہے۔ ن شمسی۔") },
    { ar: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", read: "Мин шарриль-вас-ваасиль-ханнаас", lat: "Min sharril-was-waasil-khannaas", where: "114:4", note: L("Н перед ш скрыт. Вав и х лунные, лям слышна. С без гласного: слог «вас», дальше «ваа», не «сва». Н в «ханнаас» с шаддой.", "The n before shin is hidden. Waw and kha are moon letters, so the lam is heard. Sin has no vowel: the syllable is was, then waa, not swa. The nun in khannas has shadda.", "النون قبل الشين مخفاة. والواو والخاء قمريتان. والسين الساكنة تغلق المقطع ثم واو. ونون «الخناس» مشددة.", "N sebelum syin tersembunyi. Waw dan kha qamariyah. Sin tanpa vokal, kemudian waa. Nun khannas bersyaddah.", "Şin'den önceki n gizli. Vav ve hı kamerî. Sin sessiz, sonra vaa. Hannas'taki nun şeddeli.", "ش سے پہلے ن چھپی ہے۔ و اور خ قمری۔ س بغیر حرکت، پھر و۔ خناس کی ن شدہ۔") },
    { ar: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ", read: "Аз-зии йувас-вису фии судуурин-наас", lat: "Adh-dhii yuwas-wisu fii suduurin-naas", where: "114:5", note: L("З — это ذ с шаддой, лям нет: ذ солнечная. С в «йувас» без гласного: слог закрылся, дальше ви, не «сви». С в «судуур» — это ص, полный рот. Н — солнечная н слова «наас», это не танвин. Ии и уу — две.", "The z is dhal with shadda, and there is no lam: dhal is a sun letter. The s in yuwas has no vowel: the syllable closed, then wi, not svi. The s in suduur is sad, a full mouth. The n is the sun nun of naas, not a tanwin. Ii and uu are two.", "الذال مشددة بلا لام لأنها شمسية. والسين الساكنة تغلق المقطع ثم واو. والصاد مفخمة. والنون نون «الناس» الشمسية لا تنوين.", "Z ialah dzal bersyaddah, tanpa lam. S pada yuwas tanpa vokal, kemudian wi. S pada suduur ialah sad. N ialah nun syamsiah naas, bukan tanwin.", "Z, şeddeli zeldir, lam yok. Yuwas'taki s sessizdir, sonra vi. Suduur'daki s sad'dır. N, naas'ın şemsi nunu, tenvin değil.", "ذ شدہ، لام نہیں، شمسی ہے۔ یوس کی س بغیر حرکت، پھر و۔ صدور کی ص بھرا منہ۔ ن الناس کی شمسی ن ہے، تنوین نہیں۔") },
    { ar: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", read: "Миналь-джиннати ван-наас", lat: "Minal-jinnati wan-naas", where: "114:6", note: L("Дж лунная, лям слышна. ة в соединении — т. Вторая н солнечная.", "Jim is a moon letter, so the lam is heard. Ta marbuta is t when you join. The second nun is a sun letter.", "الجيم قمرية. والتاء المربوطة في الوصل تاء. والنون الثانية شمسية.", "Jim qamariyah. Ta marbutah ketika disambung ialah t. Nun kedua syamsiah.", "Cim kamerî. Te marbuta birleşince t. İkinci nun şemsi.", "ج قمری۔ ة جوڑنے پر ت۔ دوسری ن شمسی۔") },
    { ar: "وَٱلْعَصْرِ", read: "Валь-1аср", lat: "Wal-'asr", where: "103:1", note: L("1 — это ع, лунная. На остановке ра мягкая: до остановки на ней была и.", "Ayn is a moon letter. At the stop the ra is light: before the stop it had i.", "العين قمرية. وعند الوقف الراء مرققة لأن حركتها كانت كسرة.", "Ain qamariyah. Pada waqaf ra nipis kerana sebelumnya i.", "Ayn kamerî. Durunca ra ince: durmadan önce i vardı.", "ع قمری ہے۔ وقف پر ر پتلی: اس پر اِ تھی۔") },
    { ar: "إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ", read: "Инналь-ъинсаана лафии хуср", lat: "Innal-'insaana lafii khusr", where: "103:2", note: L("Хамза после «аль» лунная, лям слышна. Палочка — две. Ии — две. На остановке танвина нет, ра мягкая.", "The hamza after al- is a moon letter, so the lam is heard. The stroke is two. Ii is two. At the stop there is no tanwin, and the ra is light.", "همزة «الإنسان» قمرية. والخنجرية والياء حركتان. وعند الوقف لا تنوين والراء مرققة.", "Hamzah selepas al- qamariyah. Alif kecil dan ii dua. Pada waqaf tiada tanwin, ra nipis.", "El-'den sonraki hemze kamerî. Hançer elif ve ii iki. Durunca tenvin yok, ra ince.", "ال کے بعد ہمزہ قمری ہے۔ چھوٹی الف اور ای دو۔ وقف پر تنوین نہیں، ر پتلی۔") },
    { ar: "إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ", read: "Иллааз-зиина аамануу ва1амилуу ас-саалихьаати ватаваасау биль-хьаккъи ватаваасау бис-сабр", lat: "Illaadh-dhiina aamanuu wa'amiluu as-saalihaati watawaasau bil-haqqi watawaasau bis-sabr", where: "103:3", note: L("З — ذ с шаддой, лям нет. Первое аа в «аамануу» — две: хамза стоит перед протяжкой. С — это ص, полный рот. На остановке ра мягкая.", "The z is dhal with shadda, and there is no lam. The first aa in aamanu is two: the hamza stands before the lengthening. The s is sad, a full mouth. At the stop the ra is light.", "الذال مشددة بلا لام. وألف «آمنوا» حركتان لأن الهمزة قبل المد. والصاد مفخمة. وعند الوقف الراء مرققة.", "Z ialah dzal bersyaddah, tanpa lam. Aa pertama pada aamanu dua, kerana hamzah sebelum mad. S ialah sad. Pada waqaf ra nipis.", "Z, şeddeli zel, lamsız. Aamanu'daki ilk aa iki, çünkü hemze medden önce. S, sad'dır. Durunca ra ince.", "ذ شدہ، لام نہیں۔ آمنوا کی پہلی آ دو، ہمزہ مد سے پہلے ہے۔ ص بھرے منہ سے۔ وقف پر ر پتلی۔") },
  ],
  mistakes: L(
    "Не тяни «аамануу» на четыре. Не произноси лям в «ан-наас». Не делай ра в «валь-1аср» твёрдой на остановке.",
    "Do not hold aamanu for four. Do not pronounce the lam in an-nas. Do not make the ra in wal-asr heavy at the stop.",
    "لا تمد «آمنوا» أربعًا. ولا تنطق لام «الناس». ولا تفخم راء «والعصر» عند الوقف.",
    "Jangan panjangkan aamanu menjadi empat. Jangan sebut lam pada an-nas. Jangan tebal kan ra pada wal-asr ketika waqaf.",
    "Aamanu'yu dört tutma. En-nas'ta lamı söyleme. Durunca vel-asr'ın ra'sını kalın okuma.",
    "آمنوا کو چار نہ کھینچیں۔ الناس کی لام نہ بولیں۔ وقف پر والعصر کی ر موٹی نہ کریں۔",
  ),
  quiz: [
    Q(L("«бираббин-наас»: что с лям?", "In birabbin-nas, what about the lam?", "لام «رب الناس»؟", "Lam pada birabbin-nas?", "Birabbin-nas'ta lam?", "رَبِّ النَّاسِ کی لام؟"), L("Не слышна, н с шаддой", "Silent: nun has shadda", "لا تُنطق والنون مشددة", "Tidak kedengaran, nun bersyaddah", "Duyulmaz, nun şeddeli", "نہیں سنائی دیتی، ن شدہ"), L("Слышна", "It is heard", "تُنطق", "Kedengaran", "Duyulur", "سنائی دیتی ہے"), L("Это отскок", "It is a bounce", "قلقلة", "Pantulan", "Sıçrama", "قلقلہ"), 0),
    Q(L("Первое аа в «аамануу»?", "The first aa in aamanu?", "ألف «آمنوا» الأولى؟", "Aa pertama pada aamanu?", "Aamanu'daki ilk aa?", "آمنوا کی پہلی آ؟"), L("Две: хамза стоит перед протяжкой", "Two: the hamza stands before the lengthening", "حركتان: الهمزة قبل المد", "Dua: hamzah sebelum mad", "İki: hemze medden önce", "دو: ہمزہ مد سے پہلے ہے"), L("Четыре или пять", "Four or five", "أربع أو خمس", "Empat atau lima", "Dört veya beş", "چار یا پانچ"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), 0),
    Q(L("Ра в «валь-1аср» на остановке?", "The ra in wal-asr at a stop?", "راء «والعصر» عند الوقف؟", "Ra pada wal-asr ketika waqaf?", "Durunca vel-asr'ın ra'sı?", "وقف پر والعصر کی ر؟"), L("Мягкая: на ней была и", "Light: it had i", "مرققة: كانت مكسورة", "Nipis: ada i", "İnce: üzerinde i vardı", "پتلی: اس پر اِ تھی"), L("Всегда твёрдая", "Always heavy", "مفخمة دائمًا", "Sentiasa tebal", "Hep kalın", "ہمیشہ موٹی"), L("Без звука", "Silent", "بلا صوت", "Tanpa bunyi", "Sessiz", "بغیر آواز"), 0),
  ],
};

const readLong: CourseLesson = {
  id: "read-long",
  tone: "madd",
  cover: true,
  title: L("Длинный аят по остановкам", "A long ayah, stop by stop", "آية طويلة وقفًا وقفًا", "Ayat panjang, hentian demi hentian", "Uzun ayet, duruş duruş", "لمبی آیت، وقف وقف کر کے"),
  definition: L(
    "Аят аль-Курси не читают одним дыханием с первого дня. В мусхафе стоят знаки. Остановился — закрой слово. Начал снова — хамза «аль» с а, а шадда от прошлого слияния не читается.",
    "Ayat al-Kursi is not read in one breath on the first day. The mushaf has signs. When you stop, close the word. When you start again, the hamza of al- is a, and a shadda that came from the previous joining is not read.",
    "آية الكرسي لا تُقرأ بنفس واحد في اليوم الأول. في المصحف علامات. إذا وقفت فأتمّ الكلمة. وإذا بدأت فالهمزة مفتوحة، والشدة التي جاءت من إدغام سابق لا تُنطق.",
    "Ayat al-Kursi tidak dibaca satu nafas pada hari pertama. Mushaf ada tanda. Berhenti: tutup kata. Mulai lagi: hamzah al- dengan a, dan syaddah dari sambungan yang lalu tidak dibaca.",
    "Ayetel Kürsi ilk gün tek nefeste okunmaz. Mushafta işaretler vardır. Durdun: kelimeyi kapat. Yeniden başladın: el-'in hemzesi a, önceki kaynaşmanın şeddesi okunmaz.",
    "آیت الکرسی پہلے دن ایک سانس میں نہیں پڑھی جاتی۔ مصحف میں نشان ہیں۔ رکے: لفظ بند کریں۔ پھر شروع کیا: ال کی ہمزہ ا سے، پچھلے ملنے کی شدہ نہیں پڑھی جاتی۔",
  ),
  letters: "٢:٢٥٥",
  mechanism: L(
    "Каждый кусок — отдельное начало и отдельная остановка. Знак пройден, дыхание взято — следующее слово не сливай с прошлым. Меру хамзы держи одну на весь аят: четыре или пять.",
    "Each piece is its own start and its own stop. Once you have passed a sign and taken a breath, do not join the next word to the previous one. Keep one hamza-count for the whole ayah: four or five.",
    "كل قطعة ابتداء ووقف. إذا تجاوزت العلامة وأخذت نفسًا فلا تصل الكلمة التالية بالسابقة. والزم وجه الهمزة واحدًا في الآية: أربعًا أو خمسًا.",
    "Setiap potong ada mula dan waqaf sendiri. Sudah melepasi tanda dan menarik napas, jangan sambung kata berikutnya pada yang lalu. Satu kadar hamzah untuk seluruh ayat: empat atau lima.",
    "Her parça ayrı başlangıç ve ayrı duruştur. İşareti geçip nefes aldıysan sonraki kelimeyi öncekine bağlama. Hemze miktarını bütün ayette bir tut: dört veya beş.",
    "ہر ٹکڑا الگ ابتدا اور الگ وقف ہے۔ نشان گزر گیا اور سانس لے لیا تو اگلا لفظ پچھلے سے نہ جوڑیں۔ ہمزے کی مقدار پوری آیت میں ایک رکھیں: چار یا پانچ۔",
  ),
  examples: [
    { ar: "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", read: "Аллах1у лаа илаах1а иллаа х1уваль-хьаййуль-къаййуум", lat: "Allahu laa ilaaha illaa huwal-hayyul-qayyuum", where: "2:255а", note: L("Первое аа — четыре или пять: дальше хамза. Палочка — две. Хь и къ лунные. На остановке уу можно две, четыре или шесть.", "The first aa is four or five: a hamza follows. The stroke is two. Ha and qaf are moon letters. At the stop, uu may be two, four or six.", "الألف الأولى أربع أو خمس. والخنجرية حركتان. والحاء والقاف قمريتان. وعند الوقف الواو اثنتان أو أربع أو ست.", "Aa pertama empat atau lima. Alif kecil dua. Ha dan qaf qamariyah. Pada waqaf uu dua, empat atau enam.", "İlk aa dört veya beş. Hançer elif iki. Ha ve qaf kamerî. Durunca uu iki, dört veya altı.", "پہلی آ چار یا پانچ۔ چھوٹی الف دو۔ ح اور ق قمری۔ وقف پر اوو دو، چار یا چھ۔") },
    { ar: "لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ", read: "Лаа таъхузух1уу синатув-валаа наум", lat: "Laa ta'khudhuhuu sinatuw-walaa naum", where: "2:255б", note: L("Аа — две. Уу — две: дальше не хамза. Танвин вошёл в в. На остановке танвина нет.", "Aa is two. Uu is two: what follows is not a hamza. The tanwin entered the waw. At the stop there is no tanwin.", "الألف والواو حركتان. والتنوين دخل في الواو. وعند الوقف لا تنوين.", "Aa dan uu dua. Tanwin masuk ke waw. Pada waqaf tiada tanwin.", "Aa ve uu iki. Tenvin vav'a girdi. Durunca tenvin yok.", "آ اور اوو دو۔ تنوین و میں داخل۔ وقف پر تنوین نہیں۔") },
    { ar: "لَهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ", read: "Лах1уу маа фиис-самааваати вамаа фииль-ъард1", lat: "Lahuu maa fiis-samaawaati wamaa fiil-'ard", where: "2:255в", note: L("Начал после остановки: лям одна, без шадды. Шадда была бы только при соединении с «наум». С солнечная. На остановке д1 с отскоком.", "You started after a stop: the lam is single, with no shadda. The shadda would be there only if you joined it to nawm. Sin is a sun letter. At the stop, dad bounces.", "بدأت بعد وقف: اللام واحدة بلا شدة. والشدة لا تكون إلا عند وصلها بـ«نوم». والسين شمسية. وعلى الضاد قلقلة.", "Mula selepas waqaf: lam sekali, tanpa syaddah. Syaddah hanya jika disambung pada nawm. Sin syamsiah. Dad ada pantulan.", "Durduktan sonra başladın: lam bir kez, şeddesiz. Şedde yalnız nevm'e bağlarsan vardır. Sin şemsi. Dad sıçrar.", "وقف کے بعد شروع کیا: لام ایک بار، بغیر شدہ۔ شدہ صرف نوم سے جوڑنے پر۔ س شمسی۔ ض قلقلہ۔") },
    { ar: "مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ", read: "Ман зааз-зии йашфа1у 1индах1уу иллаа биъизних1и", lat: "Man dhaadh-dhii yashfa'u 'indahuu illaa bi'idhnihi", where: "2:255г", note: L("Н перед з скрыт, в строке н остаётся. «аз-зии»: ذ с шаддой, лям нет. Уу в «1индах1уу» — четыре или пять: дальше хамза.", "The n before dhal is hidden, and the line still writes n. The z is dhal with shadda, and there is no lam. The uu in indahu is four or five: a hamza follows.", "النون قبل الذال مخفاة. والذال مشددة بلا لام. وواو «عنده» أربع أو خمس لهمزة بعدها.", "N sebelum dzal tersembunyi. Z ialah dzal bersyaddah, tanpa lam. Uu pada indahu empat atau lima.", "Zel'den önceki n gizli. Z, şeddeli zel, lamsız. İndehu'daki uu dört veya beş.", "ذ سے پہلے ن چھپی ہے۔ ذ شدہ، لام نہیں۔ عِندَهُ کی اوو چار یا پانچ۔") },
    { ar: "يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ", read: "Йа1ламу маа байна айдиих1им вамаа хальфах1ум", lat: "Ya'lamu maa bayna aydiihim wamaa khalfahum", where: "2:255д", note: L("1 — это ع. Аа и ии — две. На остановке у сними.", "The mark 1 is ayn. Aa and ii are two. At the stop, drop the u.", "العين ليست همزة. والألف والياء حركتان. وعند الوقف تُسقط الضمة.", "Tanda 1 ialah ain. Aa dan ii dua. Pada waqaf gugurkan u.", "1, ayn'dır. Aa ve ii iki. Durunca u'yu düşür.", "۱ ع ہے۔ آ اور ای دو۔ وقف پر اُ ہٹائیں۔") },
    { ar: "وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ", read: "Валаа йухьиит1ууна бишайъим-мин 1ильмих1ии иллаа бимаа шааъ", lat: "Walaa yuhiituuna bishay'im-min 'ilmihii illaa bimaa shaa'", where: "2:255е", note: L("Танвин вошёл в м. Ии перед хамзой — четыре или пять. Аа в «шааъ» — четыре или пять: хамза в том же слове.", "The tanwin entered the meem. The ii before hamza is four or five. The aa in shaa'a is four or five: the hamza is in the same word.", "التنوين دخل في الميم. والياء قبل الهمزة أربع أو خمس. وألف «شاء» أربع أو خمس.", "Tanwin masuk ke mim. Ii sebelum hamzah empat atau lima. Aa pada syaa'a empat atau lima.", "Tenvin mim'e girdi. Hemzeden önceki ii dört veya beş. Şae'deki aa dört veya beş.", "تنوین م میں داخل۔ ہمزے سے پہلے ای چار یا پانچ۔ شَآءَ کی آ چار یا پانچ۔") },
    { ar: "وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ", read: "Васи1а курсиййух1ус-самааваати валь-ъард1", lat: "Wasi'a kursiyyuhus-samaawaati wal-'ard", where: "2:255ж", note: L("Й с шаддой. С солнечная. Хамза «аль-ард1» лунная. На остановке д1 с отскоком.", "Ya has shadda. Sin is a sun letter. The hamza of al-ard is a moon letter. At the stop, dad bounces.", "الياء مشددة. والسين شمسية. وهمزة «الأرض» قمرية. وعلى الضاد قلقلة.", "Ya bersyaddah. Sin syamsiah. Hamzah al-ard qamariyah. Dad ada pantulan.", "Ya şeddeli. Sin şemsi. El-ard'ın hemzesi kamerî. Dad sıçrar.", "ی شدہ۔ س شمسی۔ الأرض کی ہمزہ قمری۔ ض قلقلہ۔") },
    { ar: "وَلَا يَـُٔودُهُۥ حِفْظُهُمَا", read: "Валаа йаъуудух1уу хьифзух1умаа", lat: "Walaa ya'uuduhuu hifzuhumaa", where: "2:255з", note: L("Оба уу — две: дальше не хамза. Последнее аа — две: после него нет закрытой буквы. Хь — это ح.", "Both uu are two: what follows is not a hamza. The last aa is two: no closed letter follows it. The soft h is ha.", "الواوان حركتان. والألف الأخيرة حركتان إذ لا ساكن بعدها. والحاء ليست هاء.", "Kedua-dua uu dua. Aa terakhir dua. Ha ialah ha.", "İki uu de iki. Son aa iki. Ha, he değil.", "دونوں اوو دو۔ آخری آ دو۔ ح ہے۔") },
    { ar: "وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ", read: "Вах1уваль-1алиййуль-1азиим", lat: "Wahuwal-'aliyyul-'aziim", where: "2:255и", note: L("1 — это ع, лунная, лям слышна. На остановке ии можно две, четыре или шесть.", "Ayn is a moon letter, so the lam is heard. At the stop, ii may be two, four or six.", "العين قمرية. وعند الوقف الياء اثنتان أو أربع أو ست.", "Ain qamariyah. Pada waqaf ii dua, empat atau enam.", "Ayn kamerî. Durunca ii iki, dört veya altı.", "ع قمری ہے۔ وقف پر ای دو، چار یا چھ۔") },
  ],
  mistakes: L(
    "Не читай шадду на «лах1уу», если ты остановился перед ним. Не тяни «шааъ» на две. Не глотай д1 на остановке.",
    "Do not read a shadda on lahu if you stopped before it. Do not hold shaa'a for two. Do not swallow dad at the stop.",
    "لا تشدد لام «له» إذا وقفت قبلها. ولا تقصر «شاء» إلى حركتين. ولا تبتلع الضاد عند الوقف.",
    "Jangan syaddahkan lam pada lahu jika kamu berhenti sebelumnya. Jangan pendekkan syaa'a menjadi dua. Jangan telan dad pada waqaf.",
    "Öncesinde durduysan lehu'nun lamına şedde koyma. Şae'yi iki tutma. Durunca dad'ı yutma.",
    "اگر اس سے پہلے رکے ہوں تو لَهُ کی لام پر شدہ نہ پڑھیں۔ شَآءَ کو دو نہ رکھیں۔ وقف پر ض نہ نگلیں۔",
  ),
  quiz: [
    Q(L("Первое аа в «лаа илаах1а»?", "The first aa in laa ilaha?", "ألف «لا إله» الأولى؟", "Aa pertama pada laa ilaha?", "La ilahe'deki ilk aa?", "لَآ إِلَٰهَ کی پہلی آ؟"), L("Четыре или пять", "Four or five", "أربع أو خمس", "Empat atau lima", "Dört veya beş", "چار یا پانچ"), L("Две", "Two", "اثنتان", "Dua", "İki", "دو"), L("Одна", "One", "واحدة", "Satu", "Bir", "ایک"), 0),
    Q(L("Остановился на «наум» и начал «лах1уу». Лям?", "You stopped on nawm and started lahu. The lam?", "وقفت على «نوم» وبدأت «له». اللام؟", "Berhenti pada nawm lalu mula lahu. Lam?", "Nevm'de durup lehu'ya başladın. Lam?", "نَوْمٌ پر رک کر لَهُ شروع کیا۔ لام؟"), L("Одна, без шадды", "Single, with no shadda", "واحدة بلا شدة", "Sekali, tanpa syaddah", "Bir kez, şeddesiz", "ایک بار، بغیر شدہ"), L("Всегда с шаддой", "Always with shadda", "مشددة دائمًا", "Sentiasa bersyaddah", "Hep şeddeli", "ہمیشہ شدہ"), L("Не читается", "It is not read", "لا تُنطق", "Tidak dibaca", "Okunmaz", "نہیں پڑھی جاتی"), 0),
    Q(L("Сколько аа в «шааъ»?", "How long is the aa in shaa'a?", "كم ألف «شاء»؟", "Berapa aa pada syaa'a?", "Şae'de aa kaç?", "شَآءَ کی آ کتنی ہے؟"), L("Четыре или пять: хамза в том же слове", "Four or five: the hamza is in the same word", "أربع أو خمس: الهمزة في الكلمة نفسها", "Empat atau lima: hamzah dalam kata yang sama", "Dört veya beş: hemze aynı kelimede", "چار یا پانچ: ہمزہ اسی لفظ میں"), L("Две", "Two", "اثنتان", "Dua", "İki", "دو"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), 0),
  ],
};

const readFil: CourseLesson = {
  id: "read-fil",
  tone: "madd",
  cover: true,
  title: L("Сура, которой не было в уроках", "A surah that was not in the lessons", "سورة لم تمر في الدروس", "Surah yang tidak ada dalam pelajaran", "Derste geçmeyen bir sure", "ایک سورت جو سبق میں نہیں آئی"),
  definition: L(
    "Аль-Филь в уроках ещё не разбиралась. Подсказка снизу называет правило, не читает слово за тебя. Потом открой суру 105 в Коране и один раз включи чтеца. Кнопка «слушать» здесь — не образец.",
    "Al-Fil has not been taken apart in the lessons. The note below names the rule, it does not read the word for you. Then open surah 105 in the Quran and play the reciter once. The listen button here is not the model.",
    "سورة الفيل لم تُشرح في الدروس. التنبيه تحت يذكر الحكم ولا يقرأ الكلمة عنك. ثم افتح السورة ١٠٥ في القرآن واسمع القارئ مرة. زر الاستماع هنا ليس قدوة.",
    "Al-Fil belum dihuraikan dalam pelajaran. Nota di bawah menyebut hukum, ia tidak membaca kata untukmu. Kemudian buka surah 105 dalam Al-Qur'an dan mainkan qari sekali. Butang dengar di sini bukan contoh.",
    "Fil suresi derslerde çözülmedi. Alttaki not kuralı söyler, kelimeyi senin yerine okumaz. Sonra Kur'an'da 105. sureyi aç ve kariyi bir kez dinle. Buradaki dinle düğmesi örnek değildir.",
    "سورۃ الفیل سبقوں میں نہیں کھلی۔ نیچے نوٹ قاعدہ بتاتا ہے، لفظ آپ کی جگہ نہیں پڑھتا۔ پھر قرآن میں سورہ ۱۰۵ کھولیں اور قاری ایک بار سنیں۔ یہاں سنیں کا بٹن نمونہ نہیں۔",
  ),
  letters: "١٠٥",
  mechanism: L(
    "Порядок тот же. Не совпало со строкой — найди шаг и скажи аят ещё раз. Потом чтец. Не совпало с чтецом — снова шаг, не десятый повтор подряд.",
    "The order is the same. If it does not match the line, find the step and say the ayah again. Then the reciter. If it does not match the reciter, go back to the step, not to a tenth replay.",
    "الترتيب هو نفسه. إن خالفت السطر فابحث عن الخطوة وأعد الآية. ثم القارئ. وإن خالفت القارئ فارجع إلى الخطوة، لا إلى التكرار العاشر.",
    "Urutannya sama. Tidak sama dengan baris: cari langkah dan sebut ayat lagi. Kemudian qari. Tidak sama dengan qari: kembali ke langkah, bukan ulang kali kesepuluh.",
    "Sıra aynı. Satırla uymadıysa adımı bul ve ayeti yeniden söyle. Sonra kari. Kariyle uymadıysa adıma dön, onuncu tekrara değil.",
    "ترتیب وہی ہے۔ سطر سے نہ ملے تو قدم ڈھونڈیں اور آیت دوبارہ کہیں۔ پھر قاری۔ قاری سے نہ ملے تو قدم پر واپس، دسویں تکرار پر نہیں۔",
  ),
  examples: [
    { ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ", read: "Алам тара кайфа фа1ала раббука биъасхьаабиль-фииль", lat: "Alam tara kayfa fa'ala rabbuka bi'ashaabil-fiil", where: "105:1", note: L("Палочка — две. Ф лунная. На остановке ии: две, четыре или шесть.", "The stroke is two. Fa is a moon letter. At the stop, ii is two, four or six.", "الخنجرية حركتان. والفاء قمرية. وعند الوقف الياء اثنتان أو أربع أو ست.", "Alif kecil dua. Fa qamariyah. Pada waqaf ii dua, empat atau enam.", "Hançer elif iki. Fe kamerî. Durunca ii iki, dört veya altı.", "چھوٹی الف دو۔ ف قمری۔ وقف پر ای دو، چار یا چھ۔") },
    { ar: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍۢ", read: "Алам йадж1аль кайдах1ум фии тад1лииль", lat: "Alam yaj'al kaydahum fii tadliil", where: "105:2", note: L("Дж — это ج. Ии — две. Д1 — это ض. На остановке танвина нет.", "Jim is not an ordinary j. Ii is two. Dad is not an ordinary d. At the stop there is no tanwin.", "الجيم ليست زايًا. والياء حركتان. والضاد ليست دالًا. وعند الوقف لا تنوين.", "Jim bukan zai. Ii dua. Dad bukan dal. Pada waqaf tiada tanwin.", "Cim, zay değil. Ii iki. Dad, dal değil. Durunca tenvin yok.", "ج عام ج نہیں۔ ای دو۔ ض عام د نہیں۔ وقف پر تنوین نہیں۔") },
    { ar: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", read: "Ваъарсала 1алайх1им т1айран абаабииль", lat: "Wa'arsala 'alayhim tayran abaabiil", where: "105:3", note: L("Хамза читается. Т1 — полный рот. Танвин перед хамзой ясен. На остановке ии можно две, четыре или шесть.", "The hamza is read. The heavy ta is a full mouth. The tanwin before hamza is clear. At the stop, ii may be two, four or six.", "الهمزة همزة قطع. والطاء مفخمة. والتنوين قبل الهمزة مظهر. وعند الوقف الياء اثنتان أو أربع أو ست.", "Hamzah dibaca. Ta tebal, mulut penuh. Tanwin sebelum hamzah jelas. Pada waqaf ii dua, empat atau enam.", "Hemze okunur. Kalın tı, ağız dolu. Hemzeden önceki tenvin açık. Durunca ii iki, dört veya altı.", "ہمزہ پڑھی جاتی ہے۔ ط بھرا منہ۔ ہمزے سے پہلے تنوین واضح۔ وقف پر ای دو، چار یا چھ۔") },
    { ar: "تَرْمِيهِم بِحِجَارَةٍۢ مِّن سِجِّيلٍۢ", read: "Тармиих1им бихьиджааратим-мин сиджжииль", lat: "Tarmiihim bihijaaratim-min sijjiil", where: "105:4", note: L("Ии — две. Хь — ح. Танвин вошёл в м. Н перед с скрыт, в строке н остаётся. В «сиджжииль» дж с шаддой.", "Ii is two. The soft h is ha. The tanwin entered the meem. The n before sin is hidden, and the line still writes n. The jim has shadda.", "الياء حركتان. والحاء ليست هاء. والتنوين دخل في الميم. والنون قبل السين مخفاة. والجيم مشددة.", "Ii dua. Ha ialah ha. Tanwin masuk ke mim. N sebelum sin tersembunyi. Jim bersyaddah.", "Ii iki. Ha, he değil. Tenvin mim'e girdi. Sin'den önceki n gizli. Cim şeddeli.", "ای دو۔ ح ہے۔ تنوین م میں داخل۔ س سے پہلے ن چھپی ہے۔ ج شدہ۔") },
    { ar: "فَجَعَلَهُمْ كَعَصْفٍۢ مَّأْكُولٍۭ", read: "Фаджа1алах1ум ка1асфим-маъкууль", lat: "Faja'alahum ka'asfim-ma'kuul", where: "105:5", note: L("1 — это ع. Танвин вошёл в м. Уу — две. На остановке танвина нет.", "The mark 1 is ayn. The tanwin entered the meem. Uu is two. At the stop there is no tanwin.", "العين ليست همزة. والتنوين دخل في الميم. والواو حركتان. وعند الوقف لا تنوين.", "Tanda 1 ialah ain. Tanwin masuk ke mim. Uu dua. Pada waqaf tiada tanwin.", "1, ayn'dır. Tenvin mim'e girdi. Uu iki. Durunca tenvin yok.", "۱ ع ہے۔ تنوین م میں داخل۔ اوو دو۔ وقف پر تنوین نہیں۔") },
  ],
  mistakes: L(
    "Не открывай строку до того, как сказал аят. Не считай голос телефона проверкой.",
    "Do not open the line before you have said the ayah. Do not count the phone's voice as the check.",
    "لا تفتح السطر قبل أن تقول الآية. ولا تجعل صوت الهاتف هو المراجعة.",
    "Jangan buka baris sebelum ayat disebut. Jangan jadikan suara telefon sebagai semakan.",
    "Ayeti söylemeden satırı açma. Telefonun sesini kontrol sayma.",
    "آیت کہے بغیر سطر نہ کھولیں۔ فون کی آواز کو جانچ نہ سمجھیں۔",
  ),
  quiz: [
    Q(L("Что делаешь до сверки?", "What do you do before checking?", "ماذا تفعل قبل إظهار السطر؟", "Apa yang dibuat sebelum semak?", "Satırı açmadan önce ne yapılır?", "سطر دیکھنے سے پہلے کیا کریں؟"), L("Читаешь арабский сам", "You read the Arabic yourself", "تقرأ العربي وحدك", "Baca Arab sendiri", "Arapçayı kendin okursun", "عربی خود پڑھیں"), L("Сразу открываешь строку", "You open the line at once", "تفتح السطر فورًا", "Terus buka baris", "Hemen satırı açarsın", "فوراً سطر کھولیں"), L("Учишь перевод", "You learn the translation", "تحفظ الترجمة", "Hafal terjemahan", "Meali ezberlersin", "ترجمہ یاد کریں"), 0),
    Q(L("«аль-фииль»: лям?", "In al-fil, the lam?", "لام «الفيل»؟", "Lam pada al-fil?", "El-fil'de lam?", "الفیل کی لام؟"), L("Слышна: ф лунная", "It is heard: fa is a moon letter", "تُنطق: الفاء قمرية", "Kedengaran: fa qamariyah", "Duyulur: fe kamerîdir", "سنائی دیتی ہے: ف قمری ہے"), L("Не слышна", "It is silent", "لا تُنطق", "Tidak kedengaran", "Duyulmaz", "نہیں سنائی دیتی"), L("Это нун", "It is a nun", "نون", "Nun", "Nun", "نون"), 0),
    Q(L("Не совпало с чтецом. Что дальше?", "It did not match the reciter. What next?", "خالفت القارئ. ثم ماذا؟", "Tidak sama dengan qari. Kemudian?", "Kariyle uymadı. Sonra?", "قاری سے نہ ملا۔ پھر؟"), L("Найти шаг, который сорвался", "Find the step that failed", "ابحث عن الخطوة التي اختلت", "Cari langkah yang gagal", "Boşanan adımı bul", "وہ قدم ڈھونڈیں جو ٹوٹا"), L("Сразу следующий аят", "The next ayah at once", "الآية التالية فورًا", "Terus ayat berikutnya", "Hemen sonraki ayet", "فوراً اگلی آیت"), L("Десять повторов без разбора", "Ten replays with no looking", "عشر مرات بلا نظر", "Sepuluh ulang tanpa semak", "Bakmadan on tekrar", "دیکھے بغیر دس بار"), 0),
  ],
};

const alone: CourseLesson = {
  id: "alone",
  tone: "plain",
  title: L("Дальше весь Коран сам", "From here, the whole Quran on your own", "من هنا القرآن كله وحدك", "Dari sini seluruh Al-Qur'an sendiri", "Bundan sonra Kur'an'ın tamamı kendi başına", "آگے پورا قرآن خود"),
  definition: L(
    "Тест курса — не чтение. Чтение — аят, который совпал с чтецом без подсказки. Весь Коран читается теми же семью шагами. Новая страница не труднее Аль-Филь, в ней больше слов.",
    "The course test is not reading. Reading is an ayah that matched the reciter with no prompt. The whole Quran is read by the same seven steps. A new page is not harder than Al-Fil. It has more words.",
    "اختبار الدورة ليس قراءة. القراءة آية وافقت القارئ بلا تلقين. والقرآن كله يُقرأ بالخطوات السبع. والصفحة الجديدة ليست أصعب من الفيل، فيها كلمات أكثر.",
    "Ujian kursus bukan bacaan. Bacaan ialah ayat yang sama dengan qari tanpa bantuan. Seluruh Al-Qur'an dibaca dengan tujuh langkah yang sama. Halaman baru tidak lebih sukar daripada Al-Fil. Kata di dalamnya lebih banyak.",
    "Kurs sınavı okumak değildir. Okumak, yardımsız kariyle uyuşan ayettir. Kur'an'ın tamamı aynı yedi adımla okunur. Yeni sayfa Fil'den zor değildir. Kelimesi daha çoktur.",
    "کورس کا امتحان پڑھنا نہیں۔ پڑھنا وہ آیت ہے جو بغیر سہارے قاری سے ملے۔ پورا قرآن انہی سات قدموں سے پڑھا جاتا ہے۔ نیا صفحہ الفیل سے مشکل نہیں۔ اس میں الفاظ زیادہ ہیں۔",
  ),
  letters: "١ → ١١٤",
  mechanism: L(
    "На каждый новый аят:\n1. Арабский сам, по семи шагам. Строку в Коране не открывай, пока не попробовал.\n2. Потом строка. Не совпало — назови шаг.\n3. Потом один раз чтец в разделе Корана. Голос телефона не бери.\n4. Не совпало с чтецом — снова шаг. Не переслушивай, не назвав ошибку.\n5. К следующему аяту не переходи, пока этот совпал.\nПорядок, если идёшь сам: ещё раз Фатиха, Ихлас, Фаляк, Нас, Каусар, Аср и Филь. Потом джуз Амма с конца к началу, с Нас до Наба. Потом с Фатихи вперёд, по странице в день.\nВосемь звуков хь, х, х1, 1, г1, къ, д1, т1 сверяй с чтецом, пока рот не совпадёт. Особые места Хафса не ищи заранее: они в своём уроке, когда слово уже читается.",
    "For every new ayah:\n1. The Arabic yourself, by the seven steps. Do not open the line in the Quran until you have tried.\n2. Then the line. If it does not match, name the step.\n3. Then the reciter in the Quran section, once. Do not take the phone's voice.\n4. If it does not match the reciter, go back to the step. Do not replay it without naming the mistake.\n5. Do not go on to the next ayah until this one matched.\nIf you go on alone: Fatiha, Ikhlas, Falaq, Nas, Kawthar, Asr and Fil once more. Then juz Amma from the end back to the start, from Nas to Naba. Then from Fatiha forward, one page a day.\nCheck the eight sounds against the reciter until the mouth matches. Do not hunt the special places of Hafs ahead of time: they are in their own lesson, once a word can already be read.",
    "لكل آية جديدة: العربي وحدك على الخطوات السبع، ثم السطر، ثم القارئ مرة في قسم القرآن. لا صوت الهاتف. لا تنتقل حتى توافق. أعد الفاتحة والإخلاص والفلق والناس والكوثر والعصر والفيل. ثم جزء عم من الناس إلى النبأ. ثم من الفاتحة، صفحة في اليوم. والأصوات الثمانية من القارئ. ومواضع حفص الخاصة في درسها عندما تُقرأ الكلمة.",
    "Untuk setiap ayat baru: Arab sendiri ikut tujuh langkah, kemudian baris, kemudian qari sekali di bahagian Al-Qur'an. Bukan suara telefon. Jangan beralih sebelum sama. Ulang Fatihah, Ikhlas, Falaq, Nas, Kauthar, Asr dan Fil. Kemudian juz Amma dari Nas ke Naba. Kemudian dari Fatihah, satu halaman sehari. Lapan bunyi daripada qari. Tempat khas Hafs ada dalam pelajarannya bila kata sudah boleh dibaca.",
    "Her yeni ayet: Arapçayı yedi adımla kendin, sonra satır, sonra Kur'an bölümünde kariyi bir kez. Telefonun sesi değil. Uyuşmadan geçme. Fatiha, İhlas, Felak, Nas, Kevser, Asr ve Fil'i bir daha oku. Sonra Amme cüzünü Nas'tan Nebe'ye. Sonra Fatiha'dan ileri, günde bir sayfa. Sekiz sesi kariden kontrol et. Hafs'ın özel yerleri, kelime okununca kendi dersindedir.",
    "ہر نئی آیت: عربی خود سات قدموں سے، پھر سطر، پھر قرآن والے حصے میں قاری ایک بار۔ فون کی آواز نہیں۔ جب تک نہ ملے آگے نہ بڑھیں۔ فاتحہ، اخلاص، فلق، ناس، کوثر، عصر اور فیل پھر پڑھیں۔ پھر پارہ عم، ناس سے نبآ تک۔ پھر فاتحہ سے آگے، دن میں ایک صفحہ۔ آٹھ آوازیں قاری سے ملائیں۔ حفص کی خاص جگہیں اپنے سبق میں ہیں، جب لفظ پڑھا جانے لگے۔",
  ),
  examples: [
    { ar: "بِسْمِ", read: "Бисм", lat: "Bism", where: "сам", note: L("Семь шагов. На остановке и снят. Строку открывай после того, как слово сказано.", "The seven steps. At a stop the i is dropped. Open the line after the word has been said.", "الخطوات السبع. عند الوقف تسقط الكسرة. افتح السطر بعد أن تقول الكلمة.", "Tujuh langkah. Pada waqaf i gugur. Buka baris selepas kata disebut.", "Yedi adım. Durunca i düşer. Satırı kelime söylendikten sonra aç.", "سات قدم۔ وقف پر اِ نہیں۔ سطر لفظ کہنے کے بعد کھولیں۔") },
    { ar: "م", read: "остановись", lat: "stop", where: "сам", note: L("Знак в мусхафе. Остановился — шаг семь. Начал снова — буква без чужой шадды.", "A sign in the mushaf. You stopped: step seven. You started again: the letter, without someone else's shadda.", "علامة في المصحف. وقفت فالخطوة السابعة. بدأت فالحرف بلا شدة غيره.", "Tanda dalam mushaf. Berhenti: langkah tujuh. Mulai lagi: huruf tanpa syaddah orang lain.", "Mushafta bir işaret. Durdun: yedinci adım. Yeniden başladın: başkasının şeddesi olmadan.", "مصحف میں نشان۔ رکے: ساتواں قدم۔ پھر شروع کیا: حرف، دوسری کی شدہ کے بغیر۔") },
    { ar: "ٱلنَّاسِ", read: "Ан-наас", lat: "An-naas", where: "сам", note: L("Сначала сам. Строка совпала — открой этот аят в Коране и один раз сверь рот с чтецом.", "First, yourself. The line matched: open this ayah in the Quran and check the mouth against the reciter once.", "أولًا وحدك. وافق السطر فافتح الآية في القرآن وراجع الفم مع القارئ مرة.", "Mula sendiri. Baris sama: buka ayat ini dan semak mulut dengan qari sekali.", "Önce kendin. Satır uydu: ayeti Kur'an'da aç ve ağzı kariyle bir kez kontrol et.", "پہلے خود۔ سطر مل گئی: آیت قرآن میں کھولیں اور منہ قاری سے ایک بار ملائیں۔") },
  ],
  mistakes: L(
    "Не переходи на следующую страницу, пока аят не совпал с чтецом. Не пропускай слово, которое не разобрал. Галочка теста сама по себе Коран не читает.",
    "Do not go on to the next page until the ayah has matched the reciter. Do not skip a word you have not worked out. A tick on the test does not, by itself, read the Quran.",
    "لا تنتقل إلى الصفحة التالية قبل أن توافق الآية القارئ. ولا تتجاوز كلمة لم تتبينها. وعلامة الاختبار وحدها لا تقرأ القرآن.",
    "Jangan beralih ke halaman berikutnya sebelum ayat sama dengan qari. Jangan langkau kata yang belum jelas. Tanda ujian sendiri tidak membaca Al-Qur'an.",
    "Ayet kariyle uyuşmadan sonraki sayfaya geçme. Çözmediğin kelimeyi atlama. Testteki işaret kendi başına Kur'an okumaz.",
    "آیت قاری سے ملے بغیر اگلے صفحے پر نہ جائیں۔ جو لفظ نہ کھلا اسے نہ چھوڑیں۔ امتحان کا نشان خود قرآن نہیں پڑھتا۔",
  ),
  quiz: [
    Q(L("Что здесь называется чтением?", "What counts as reading here?", "ما القراءة هنا؟", "Apa yang dikira bacaan di sini?", "Burada okumak nedir?", "یہاں پڑھنا کسے کہتے ہیں؟"), L("Аят совпал с чтецом без подсказки", "An ayah matched the reciter with no prompt", "آية وافقت القارئ بلا تلقين", "Ayat sama dengan qari tanpa bantuan", "Ayet, yardımsız kariyle uyuştu", "آیت بغیر سہارے قاری سے مل گئی"), L("Зелёная галочка теста", "A green tick on the test", "علامة الاختبار", "Tanda lulus ujian", "Testteki yeşil işaret", "امتحان کی ہری علامت"), L("Голос телефона", "The phone's voice", "صوت الهاتف", "Suara telefon", "Telefonun sesi", "فون کی آواز"), 0),
    Q(L("Куда идти после коротких сур?", "Where do you go after the short surahs?", "إلى أين بعد السور القصار؟", "Ke mana selepas surah pendek?", "Kısa surelerden sonra nereye?", "چھوٹی سورتوں کے بعد کہاں؟"), L("Джуз Амма, с конца к началу", "Juz Amma, from the end back to the start", "جزء عم من الآخر إلى الأول", "Juz Amma, dari hujung ke awal", "Amme cüzü, sondan başa", "پارہ عم، آخر سے شروع کی طرف"), L("Сразу самая длинная сура", "The longest surah at once", "أطول سورة فورًا", "Terus surah yang paling panjang", "Hemen en uzun sure", "فوراً سب سے لمبی سورہ"), L("Только перевод", "Only the translation", "الترجمة فقط", "Terjemahan sahaja", "Yalnızca meal", "صرف ترجمہ"), 0),
    Q(L("Страница в день. Когда следующая?", "One page a day. When is the next?", "صفحة في اليوم. متى التالية؟", "Sehari satu halaman. Bilakah yang berikutnya?", "Günde bir sayfa. Sonraki ne zaman?", "دن میں ایک صفحہ۔ اگلا کب؟"), L("Когда аяты этой совпали с чтецом", "When this page's ayahs have matched the reciter", "عندما وافقت آيات هذه الصفحة القارئ", "Apabila ayat halaman ini sama dengan qari", "Bu sayfanın ayetleri kariyle uyuşunca", "جب اس صفحے کی آیتیں قاری سے مل جائیں"), L("Сразу, даже если не совпало", "At once, even if it did not match", "فورًا ولو خالفت", "Terus, walaupun tidak sama", "Hemen, uymasa da", "فوراً، چاہے نہ ملے"), L("Когда тест зелёный", "When the test is green", "عندما يخضرّ الاختبار", "Apabila ujian hijau", "Test yeşil olunca", "جب امتحان ہرا ہو"), 0),
  ],
};

const extra: Record<string, TajQuiz[]> = {
  what: [
    Q(L("Чей это риваят?", "Whose riwayah is this?", "رواية من هذه؟", "Riwayat siapa ini?", "Bu kimin rivayetidir?", "یہ کس کی روایت ہے؟"), L("Хафс от Асыма", "Hafs from Asim", "حفص عن عاصم", "Hafs dari Asim", "Hafs, Asım'dan", "حفص عن عاصم"), L("Любое чтение", "Any reading", "أي قراءة", "Sebarang bacaan", "Herhangi bir kıraat", "کوئی بھی قراءت"), L("Только перевод", "Only the translation", "الترجمة فقط", "Terjemahan sahaja", "Yalnızca meal", "صرف ترجمہ"), 0),
    Q(L("В каком порядке читают слово?", "In what order is a word read?", "بأي ترتيب تُقرأ الكلمة؟", "Kata dibaca dengan urutan apa?", "Kelime hangi sırayla okunur?", "لفظ کس ترتیب سے پڑھا جاتا ہے؟"), L("Сначала буква, потом гласный, потом слово", "First the letter, then the vowel, then the word", "الحرف، ثم الحركة، ثم الكلمة", "Huruf, lalu vokal, lalu kata", "Önce harf, sonra hareke, sonra kelime", "پہلے حرف، پھر حرکت، پھر لفظ"), L("Сначала перевод", "The translation first", "الترجمة أولًا", "Terjemahan dahulu", "Önce meal", "پہلے ترجمہ"), L("Сразу быстро, без меры", "Fast at once, with no count", "بسرعة بلا مقدار", "Laju terus, tanpa kadar", "Hemen hızlı, miktarsız", "فوراً تیز، بغیر مقدار"), 0),
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
    Q(L("Сколько букв ихфа нуна?", "How many letters take ikhfa of nun?", "كم حرفًا لإخفاء النون؟", "Berapa huruf ikhfa nun?", "Nun'un ihfası kaç harftedir?", "نون کے اخفاء کے حروف کتنے ہیں؟"), L("Пятнадцать", "Fifteen", "خمسة عشر", "Lima belas", "On beş", "پندرہ"), L("Одна", "One", "واحد", "Satu", "Bir", "ایک"), L("Шесть", "Six", "ستة", "Enam", "Altı", "چھ"), 0),
  ],
  meem: [
    Q(L("Мим с сукуном перед ب — это?", "Meem with sukun before ba is?", "الميم الساكنة قبل الباء؟", "Mim sukun sebelum ba?", "Sükûnlu mim, be'den önce?", "ساکن میم ب سے پہلے؟"), L("Скрытый м, с гунной", "A hidden m, with ghunnah", "إخفاء شفوي بغنة", "M tersembunyi, dengan ghunnah", "Gizli m, gunneli", "چھپی م، غنہ کے ساتھ"), L("Изхар без всего", "Izhar with nothing", "إظهار بلا شيء", "Izhar tanpa apa-apa", "Düz izhar", "سادہ اظہار"), L("Буква удаляется", "The letter is removed", "تُحذف", "Dibuang", "Silinir", "ہٹا دی جاتی ہے"), 0),
    Q(L("Мим перед мимом — это?", "Meem before meem is?", "الميم قبل الميم؟", "Mim sebelum mim?", "Mimden önceki mim?", "میم سے پہلے میم؟"), L("Слияние с гунной", "Merging, with ghunnah", "إدغام بغنة", "Lebur dengan ghunnah", "Gunne ile idgam", "غنہ کے ساتھ ادغام"), L("Калькаля", "Qalqalah", "قلقلة", "Qalqalah", "Kalkale", "قلقلہ"), L("Долгий а", "A long a", "مد", "Mad", "Med", "مد"), 0),
  ],
  ghunnah: [
    Q(L("Сколько длится гунна?", "How long is ghunnah?", "كم الغنة؟", "Berapa lama ghunnah?", "Gunne ne kadardır?", "غنہ کتنی ہے؟"), L("Две меры", "Two counts", "حركتان", "Dua harakat", "İki miktar", "دو حرکت"), L("Шесть", "Six", "ست", "Enam", "Altı", "چھ"), L("Полмеры", "Half a count", "نصف حركة", "Setengah harakat", "Yarım miktar", "آدھی حرکت"), 0),
    Q(L("Гунна слышна через?", "Ghunnah is heard through?", "الغنة تُسمع من؟", "Ghunnah kedengaran dari?", "Gunne nereden duyulur?", "غنہ کہاں سے سنائی دیتی ہے؟"), L("Нос", "The nose", "الأنف", "Hidung", "Burun", "ناک"), L("Живот", "The stomach", "البطن", "Perut", "Karın", "پیٹ"), L("Только губы без носа", "The lips only, with no nose", "الشفتين بلا أنف", "Bibir sahaja, tanpa hidung", "Yalnızca dudak, burunsuz", "صرف ہونٹ، بغیر ناک"), 0),
  ],
  kinds: [
    Q(L("В «къул ля» что слышно?", "In qul la, what is heard?", "ماذا يُسمع في «قل لا»؟", "Apa kedengaran pada qul la?", "Kul la'da ne duyulur?", "قُل لَّا میں کیا سنائی دیتا ہے؟"), L("Одна лям с шаддой", "One lam with shadda", "لام واحدة مشددة", "Satu lam bersyaddah", "Şeddeli tek lam", "ایک لام، شدہ کے ساتھ"), L("Две отдельные лям", "Two separate lams", "لامان منفصلتان", "Dua lam terpisah", "İki ayrı lam", "دو الگ لام"), L("Къ пропадает", "Qaf disappears", "تسقط القاف", "Qaf hilang", "Qaf düşer", "ق ختم ہو جاتی ہے"), 0),
    Q(L("Куда входит б в «иркам ма1ана»?", "Where does the ba go in irkam ma'ana?", "أين تدخل الباء في «اركب معنا»؟", "Ke mana ba pada irkam ma'ana?", "İrkab meana'da be nereye girer?", "ارْكَب مَّعَنَا میں ب کہاں جاتی ہے؟"), L("В м", "Into mim", "في الميم", "Ke mim", "Mim'e", "م میں"), L("Остаётся ясная б", "It stays a clear ba", "تبقى باء ظاهرة", "Kekal ba yang jelas", "Açık be kalır", "واضح ب رہتی ہے"), L("Становится н", "It becomes nun", "تصير نونًا", "Menjadi nun", "Nun olur", "نون بن جاتی ہے"), 0),
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
    Q(L("Знак «قلى» значит?", "The mark qala means?", "علامة «قلى» تعني؟", "Tanda qala maksudnya?", "Kalâ işareti ne demektir?", "قلى کا مطلب؟"), L("Лучше остановиться", "It is better to stop", "الوقف أولى", "Lebih baik berhenti", "Durmak daha iyidir", "رکنا بہتر ہے"), L("Лучше идти дальше", "It is better to continue", "الوصل أولى", "Lebih baik disambung", "Geçmek daha iyidir", "آگے بڑھنا بہتر ہے"), L("Задержка без вдоха", "A hold without a breath", "سكتة بلا نفس", "Hentian tanpa napas", "Nefessiz duruş", "سانس کے بغیر رکاوٹ"), 0),
    Q(L("Три точки значит?", "Three dots mean?", "النقاط الثلاث تعني؟", "Tiga titik maksudnya?", "Üç nokta ne demektir?", "تین نقطے کا مطلب؟"), L("Остановись на одной из двух, не на обеих", "Stop at one of the two, not at both", "قف عند إحداهما لا عند كلتيهما", "Berhenti di salah satu, bukan keduanya", "İkisinden birinde dur, ikisinde birden değil", "دونوں میں سے ایک پر رکیں، دونوں پر نہیں"), L("Остановись на обеих", "Stop at both", "قف عند كلتيهما", "Berhenti di keduanya", "İkisinde de dur", "دونوں پر رکیں"), L("Пропусти аят", "Skip the ayah", "تجاوز الآية", "Langkau ayat", "Ayeti atla", "آیت چھوڑ دیں"), 0),
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
  "ms-lam": [
    Q(L("Как «الذين»?", "How is alladhina?", "كيف «الذين»؟", "Bagaimana alladhina?", "Elleziine nasıl?", "الذین کیسے؟"), L("З с шаддой, без лям", "Dhal with shadda, no lam", "ذال مشددة بلا لام", "Dzal bersyaddah, tanpa lam", "Şeddeli zel, lamsız", "ذ شدہ، بغیر لام"), L("Лям слышна", "The lam is heard", "اللام ظاهرة", "Lam kedengaran", "Lam duyulur", "لام سنائی دیتی ہے"), L("Это лунная буква", "It is a moon letter", "حرف قمري", "Huruf qamariyah", "Kamerî harftir", "قمری حرف ہے"), 0),
  ],
};

export type PathModule = {
  id: string;
  title: L;
  lead: L;
  badge: L;
  lessons: CourseLesson[];
};

function mixLesson(lesson: CourseLesson, salt: number): CourseLesson {
  const quiz = lesson.quiz.map((item, index) => {
    const shift = (salt + index) % 3;
    if (shift === 0) return item;
    const choices = [0, 1, 2].map((n) => item.choices[(n + shift) % 3]) as [typeof item.choices[0], typeof item.choices[1], typeof item.choices[2]];
    const answer = ((item.answer - shift + 3) % 3) as 0 | 1 | 2;
    return { ...item, choices, answer };
  });
  return { ...lesson, quiz };
}

const RAW_PATH: PathModule[] = [
  {
    id: "alpha",
    title: L("1. Буквы", "1. The letters", "١. الحروف", "1. Huruf", "1. Harfler", "١. حروف"),
    lead: L(
      "Сначала, что такое таджвид и одна мера. Потом все 28 букв: форма, точки и транскрипция. Потом четыре написания.",
      "First all 28 letters: the shape, the dots and the transcription. Then the four written forms. A tajweed rule has nothing to hold if the letter is not known.",
      "أولًا الحروف الثمانية والعشرون: الصورة والنقط والرسم. ثم الأشكال الأربعة.",
      "Mula 28 huruf: bentuk, titik dan tulisan. Kemudian empat bentuk tulis.",
      "Önce 28 harf: şekil, nokta ve yazılış. Sonra dört biçim.",
      "پہلے ۲۸ حروف: شکل، نقطے اور لکھائی۔ پھر چار صورتیں۔",
    ),
    badge: L("Мастер букв", "Master of the letters", "متقن الحروف", "Penguasa huruf", "Harflerin ustası", "حروف کا ماہر"),
    lessons: [withQuiz("what", extra.what), soundKey, letters, letters2, letters3, letters4, forms],
  },
  {
    id: "vowels",
    title: L("2. Огласовки", "2. The vowels", "٢. الحركات", "2. Vokal", "2. Harekeler", "٢. حرکات"),
    lead: L(
      "Черта сверху — а, снизу — и, петелька — у. Кружок — гласного нет. Шадда — буква дважды. Танвин — н на конце. Долгий гласный — две меры. В конце этого модуля из слогов собирается слово.",
      "A stroke above is a, below is i, a loop is u. A circle means no vowel. Shadda is the letter twice. Tanwin is an n at the end. A long vowel is two counts. At the end of this module the syllables become a word.",
      "الفتحة أ، والكسرة إ، والضمة أُ. السكون بلا حركة. الشدة مرتان. التنوين نون. والمد حركتان.",
      "Garis atas a, bawah i, lengkung u. Bulatan: tiada vokal. Syaddah dua kali. Tanwin ialah n. Mad dua harakat.",
      "Üst çizgi a, alt i, kıvrım u. Yuvarlak: ses yok. Şedde iki kez. Tenvin sonda n. Med iki miktar.",
      "اوپر لکیر ا، نیچے اِ، گول اُ۔ دائرہ: حرکت نہیں۔ شدہ دو بار۔ تنوین آخر میں ن۔ مد دو حرکت۔",
    ),
    badge: L("Знаток огласовок", "Master of the vowels", "متقن الحركات", "Penguasa vokal", "Harekelerin ustası", "حرکات کا ماہر"),
    lessons: [withQuiz("marks", extra.marks), withQuiz("ms-madd", extra["ms-madd"]), withQuiz("ms-shadda", extra["ms-shadda"]), withQuiz("ms-tanwin", extra["ms-tanwin"]), join],
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
      "Нун без гласного и танвин: ясно, вошёл в следующую, стал м перед ب, или скрыт. Мим без гласного: ясно, скрыт перед ب, или слился с мимом. Гунна — две меры через нос. Потом буква без гласного входит в такую же или соседнюю.",
      "Nun with no vowel, and tanwin: clear, merged into the next letter, turned into m before ba, or hidden. Meem with no vowel: clear, hidden before ba, or merged into meem. Ghunnah is two counts through the nose.",
      "النون الساكنة والتنوين: إظهار أو إدغام أو إقلاب أو إخفاء. والميم الساكنة ثلاثة أحكام. والغنة حركتان.",
      "Nun sukun dan tanwin: jelas, lebur, menjadi m, atau tersembunyi. Mim sukun ada tiga. Ghunnah dua harakat.",
      "Sükûnlu nun ve tenvin: açık, idgam, m oluşu veya gizlenme. Sükûnlu mimde üç hüküm. Gunne iki miktar.",
      "ساکن نون اور تنوین: واضح، ادغام، ب سے پہلے م، یا چھپی۔ ساکن میم کے تین حکم۔ غنہ دو حرکت۔",
    ),
    badge: L("Хранитель таджвида", "Keeper of tajweed", "حافظ التجويد", "Penjaga tajwid", "Tecvidin bekçisi", "تجوید کا محافظ"),
    lessons: [withQuiz("izhar", extra.izhar), withQuiz("idgham-nun", extra["idgham-nun"]), withQuiz("iqlab", extra.iqlab), withQuiz("ikhfa", extra.ikhfa), withQuiz("meem", extra.meem), withQuiz("ghunnah", extra.ghunnah), withQuiz("kinds", extra.kinds)],
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
      "Сначала, где остановиться и как закрыть слово. Потом солнечная лям: без неё «аль-Фатиху» не прочитать. Потом отскок и сами суры, аят за аятом.",
      "First, where to stop and how a word closes. Then the sun lam: without it Al-Fatiha cannot be read. Then the bounce, and the surahs themselves, ayah by ayah.",
      "علامات المصحف تبين الوقف. وعند الوقف يُسكن الآخر، وفي خمسة أحرف قلقلة. ثم الفاتحة والإخلاص.",
      "Tanda mushaf memberitahu waqaf. Pada waqaf kata ditutup, lima huruf ada pantulan. Kemudian Al-Fatihah dan Al-Ikhlas.",
      "Mushaf işaretleri vakfı gösterir. Durunca son harf kapanır, beş harfte kalkale vardır. Sonra Fatiha ve İhlas.",
      "مصحف کے نشان وقف بتاتے ہیں۔ وقف پر آخر بند، پانچ حروف میں قلقلہ۔ پھر فاتحہ اور اخلاص۔",
    ),
    badge: L("Короткие суры", "The short surahs", "القصار", "Surah pendek", "Kısa sureler", "چھوٹی سورتیں"),
    lessons: [withQuiz("signs", extra.signs), withQuiz("stop-start", extra["stop-start"]), withQuiz("ms-lam", extra["ms-lam"]), withQuiz("ms-qalqala", extra["ms-qalqala"]), readShort],
  },
  {
    id: "alone",
    title: L("7. Читаю сам", "7. Reading on your own", "٧. أقرأ وحدي", "7. Membaca sendiri", "7. Kendi başıma", "٧. خود پڑھنا"),
    lead: L(
      "Правила уже пройдены. Здесь строка скрыта: сначала арабский, потом сверка. Голос телефона на этих уроках не включай, пока не сказал аят сам. В конце — как идти по всему Корану, аят за аятом. Редкие места Хафса — последний урок, когда слово уже читается.",
      "The rules are already done. Here the line is hidden: the Arabic first, then the check. At the end, how to go through the whole Quran on your own, ayah by ayah, with the reciter as the check. A tick on the test does not replace that reading.",
      "الأحكام قد مضت. هنا السطر مخفي: العربي أولًا ثم المراجعة. وفي الآخر كيف تمضي في القرآن كله وحدك، آية آية، والقارئ هو المراجعة.",
      "Hukum sudah selesai. Di sini baris disembunyikan: Arab dahulu, kemudian semakan. Di akhir, cara melalui seluruh Al-Qur'an sendiri, ayat demi ayat, qari sebagai semakan.",
      "Hükümler bitti. Burada satır gizli: önce Arapça, sonra kontrol. Sonda, Kur'an'ın tamamını kendi başına, ayet ayet, kariyi kontrol ederek nasıl gideceğin.",
      "قاعدے ہو چکے۔ یہاں سطر چھپی ہے: پہلے عربی، پھر جانچ۔ آخر میں پورا قرآن خود، آیت آیت، قاری کو جانچ بنا کر کیسے پڑھنا ہے۔",
    ),
    badge: L("Читает сам", "Reads on their own", "يقرأ وحده", "Membaca sendiri", "Kendi başına okur", "خود پڑھتا ہے"),
    lessons: [method, readKawthar, readGuard, readLong, readFil, alone, withQuiz("hafs", extra.hafs)],
  },
];

export const TAJWEED_PATH: PathModule[] = RAW_PATH.map((mod, modIndex) => ({
  ...mod,
  lessons: mod.lessons.map((lesson, lessonIndex) => mixLesson(lesson, modIndex * 10 + lessonIndex + 1)),
}));

export const TAJWEED_PATH_FLAT: CourseLesson[] = TAJWEED_PATH.flatMap((mod) => mod.lessons);

export type QuizTopic = {
  id: string;
  mod: string;
  title: L;
  lead: L;
  picks: { lesson: string; index: number }[];
};

/** Questions regrouped by the tajweed topic, not by the lesson they were written under. */
export const TAJWEED_QUIZ: QuizTopic[] = [
  {
    id: "script",
    mod: "alpha",
    title: L("Запись звука", "How the sound is written", "رسم الصوت", "Tulisan bunyi", "Sesin yazılışı", "آواز کی لکھاوٹ"),
    lead: L("Мера, восемь особых знаков и чем хь отличается от х и х1.", "The count, the eight marked sounds, and how the throat letters are told apart.", "المقدار وعلامات الحلق.", "Kadar dan tanda halkum.", "Miktar ve boğaz işaretleri.", "مقدار اور حلق کے نشان۔"),
    picks: [
      { lesson: "what", index: 0 },
      { lesson: "sound-key", index: 0 },
      { lesson: "sound-key", index: 1 },
      { lesson: "sound-key", index: 2 },
      { lesson: "letters-4", index: 0 },
    ],
  },
  {
    id: "letters",
    mod: "alpha",
    title: L("Буквы и формы", "Letters and shapes", "الحروف والأشكال", "Huruf dan bentuk", "Harfler ve şekiller", "حروف اور شکلیں"),
    lead: L("Точки, место, какие буквы не соединяются и четыре формы.", "Dots, the place, which letters do not join, and the four shapes.", "النقط والمخرج والانفصال والأشكال.", "Titik, tempat, huruf yang tidak bersambung dan empat bentuk.", "Nokta, yer, bağlanmayan harfler ve dört şekil.", "نقطے، جگہ، نہ جڑنے والے حروف اور چار شکلیں۔"),
    picks: [
      { lesson: "letters", index: 0 },
      { lesson: "letters", index: 1 },
      { lesson: "letters", index: 2 },
      { lesson: "letters-2", index: 0 },
      { lesson: "letters-2", index: 1 },
      { lesson: "letters-2", index: 2 },
      { lesson: "letters-3", index: 0 },
      { lesson: "letters-3", index: 1 },
      { lesson: "letters-3", index: 2 },
      { lesson: "letters-4", index: 1 },
      { lesson: "letters-4", index: 2 },
      { lesson: "forms", index: 0 },
      { lesson: "forms", index: 1 },
    ],
  },
  {
    id: "harakat",
    mod: "vowels",
    title: L("Огласовки и шадда", "Vowels and shadda", "الحركات والشدة", "Vokal dan syaddah", "Harekeler ve şedde", "حرکات اور شدہ"),
    lead: L("А, и, у, кружок, буква дважды и танвин.", "A, i, u, sukun, a doubled letter and tanwin.", "الفتح والكسر والضم والسكون والشدة والتنوين.", "A, i, u, sukun, huruf berganda dan tanwin.", "A, i, u, sükûn, şedde ve tenvin.", "ا، اِ، اُ، سکون، شدہ اور تنوین۔"),
    picks: [
      { lesson: "marks", index: 0 },
      { lesson: "marks", index: 1 },
      { lesson: "marks", index: 2 },
      { lesson: "ms-shadda", index: 0 },
      { lesson: "ms-shadda", index: 2 },
      { lesson: "ms-tanwin", index: 2 },
      { lesson: "join", index: 0 },
      { lesson: "join", index: 1 },
    ],
  },
  {
    id: "makhraj",
    mod: "makhraj",
    title: L("Место звука", "Where the sound is made", "المخارج", "Makhraj", "Mahreç", "مخارج"),
    lead: L("Горло, язык, губы и семь букв полным ртом.", "Throat, tongue, lips, and the seven letters said with a full mouth.", "الحلق واللسان والشفتان والاستعلاء.", "Halkum, lidah, bibir dan tujuh huruf tebal.", "Boğaz, dil, dudaklar ve yedi kalın harf.", "حلق، زبان، ہونٹ اور سات موٹے حروف۔"),
    picks: [
      { lesson: "throat", index: 0 },
      { lesson: "throat", index: 1 },
      { lesson: "throat", index: 2 },
      { lesson: "tongue", index: 0 },
      { lesson: "tongue", index: 1 },
      { lesson: "lips", index: 1 },
      { lesson: "pairs", index: 0 },
      { lesson: "pairs", index: 1 },
    ],
  },
  {
    id: "noon",
    mod: "nun",
    title: L("Нун и танвин", "Nun and tanwin", "النون والتنوين", "Nun dan tanwin", "Nun ve tenvin", "نون اور تنوین"),
    lead: L("Ясно, вошёл, стал м или скрыт. Смотри следующую букву.", "Clear, merged, turned into meem, or hidden. Look at the next letter.", "إظهار، إدغام، إقلاب، إخفاء.", "Izhar, idgham, iqlab, ikhfa.", "İzhar, idgam, iklab, ihfa.", "اظہار، ادغام، اقلاب، اخفا۔"),
    picks: [
      { lesson: "izhar", index: 0 },
      { lesson: "izhar", index: 2 },
      { lesson: "idgham-nun", index: 0 },
      { lesson: "idgham-nun", index: 2 },
      { lesson: "iqlab", index: 0 },
      { lesson: "iqlab", index: 1 },
      { lesson: "ikhfa", index: 0 },
      { lesson: "ikhfa", index: 2 },
    ],
  },
  {
    id: "meem",
    mod: "nun",
    title: L("Мим и гунна", "Meem and ghunnah", "الميم والغنة", "Mim dan ghunnah", "Mim ve gunne", "میم اور غنہ"),
    lead: L("Мим без гласного: скрыт, вошёл или ясен. Гунна — две меры через нос.", "Meem with no vowel is hidden, merged or clear. Ghunnah is two counts through the nose.", "إخفاء الميم وإدغامه وإظهاره. والغنة حركتان.", "Mim tersembunyi, masuk atau jelas. Ghunnah dua.", "Mim gizli, birleşir veya açıktır. Gunne iki.", "میم چھپی، ملی یا واضح۔ غنہ دو۔"),
    picks: [
      { lesson: "meem", index: 0 },
      { lesson: "meem", index: 2 },
      { lesson: "ghunnah", index: 0 },
      { lesson: "ghunnah", index: 2 },
      { lesson: "lips", index: 0 },
    ],
  },
  {
    id: "same",
    mod: "nun",
    title: L("Слияние букв", "When one letter enters the next", "إدغام الحروف", "Peleburan huruf", "Harflerin idgamı", "حروف کا ادغام"),
    lead: L("Одинаковые и соседние входят в следующую. В «ахатту» след т1 остаётся.", "The same letter and a neighbour enter the next one. In ahattu a trace of the heavy ta stays.", "المتماثل والمتجانس. وفي «أحطت» يبقى أثر الطاء.", "Huruf sama dan jiran masuk. Pada ahattu bekas ta tebal kekal.", "Aynı ve komşu harf sonrakine girer. Ahattu'da kalın tı'nın izi kalır.", "ایک جیسے اور پڑوسی حرف اگلے میں جاتے ہیں۔ أحطت میں ط کا نشان رہتا ہے۔"),
    picks: [
      { lesson: "kinds", index: 0 },
      { lesson: "kinds", index: 1 },
      { lesson: "kinds", index: 2 },
    ],
  },
  {
    id: "madd",
    mod: "madd",
    title: L("Протяжка", "Lengthening", "المد", "Mad", "Med", "مد"),
    lead: L("Две, четыре или пять, шесть. На остановке — две, четыре или шесть.", "Two, four or five, and six. At a stop, two, four or six.", "حركتان، أربع أو خمس، وست.", "Dua, empat atau lima, dan enam.", "İki, dört veya beş, ve altı.", "دو، چار یا پانچ، اور چھ۔"),
    picks: [
      { lesson: "ms-madd", index: 0 },
      { lesson: "ms-madd", index: 1 },
      { lesson: "ms-madd", index: 2 },
      { lesson: "madd-short", index: 0 },
      { lesson: "madd-short", index: 1 },
      { lesson: "madd-short", index: 2 },
      { lesson: "madd-long", index: 0 },
      { lesson: "madd-long", index: 1 },
      { lesson: "madd-long", index: 2 },
      { lesson: "join", index: 2 },
      { lesson: "read-short", index: 1 },
      { lesson: "read-kawthar", index: 0 },
      { lesson: "read-guard", index: 1 },
      { lesson: "read-long", index: 0 },
      { lesson: "read-long", index: 2 },
    ],
  },
  {
    id: "ra",
    mod: "madd",
    title: L("Ра и лям в Аллах1", "Ra and the lam of Allah", "الراء ولام الجلالة", "Ra dan lam Allah", "Ra ve Allah'ın lamı", "را اور اللہ کی لام"),
    lead: L("Ра и лям имени бывают толстыми и тонкими. Не по желанию.", "Ra, and the lam of the name, are heavy or light by the rule.", "تفخيم الراء وترقيقها ولام لفظ الجلالة.", "Ra tebal atau nipis, dan lam Allah.", "Ra kalın ya da ince, ve Allah'ın lamı.", "را موٹی یا پتلی، اور اللہ کی لام۔"),
    picks: [
      { lesson: "heavy", index: 0 },
      { lesson: "heavy", index: 1 },
      { lesson: "heavy", index: 2 },
      { lesson: "read-guard", index: 2 },
    ],
  },
  {
    id: "lam",
    mod: "waqf",
    title: L("Лям в «аль»", "The lam of al-", "لام أل", "Lam al-", "El-'in lamı", "ال کی لام"),
    lead: L("Лунная слышна. Солнечная не слышна, следующая буква с шаддой.", "A moon lam is heard. A sun lam is silent, and the next letter has shadda.", "اللام القمرية تظهر والشمسية تُدغم.", "Lam qamariyah kedengaran, syamsiyah tidak.", "Kamerî lam duyulur, şemsî duyulmaz.", "قمری لام سنائی دیتی ہے، شمسی نہیں۔"),
    picks: [
      { lesson: "ms-lam", index: 0 },
      { lesson: "ms-lam", index: 1 },
      { lesson: "read-kawthar", index: 1 },
      { lesson: "read-guard", index: 0 },
      { lesson: "read-long", index: 1 },
      { lesson: "read-fil", index: 1 },
    ],
  },
  {
    id: "waqf",
    mod: "waqf",
    title: L("Остановка и отскок", "The stop and the bounce", "الوقف والقلقلة", "Waqaf dan qalqalah", "Vakıf ve kalkale", "وقف اور قلقلہ"),
    lead: L("Знаки мусхафа, как закрыть слово и пять букв отскока.", "The mushaf marks, how a word closes, and the five letters of the bounce.", "علامات الوقف وإسكان الآخر والقلقلة.", "Tanda waqaf, penutupan kata dan qalqalah.", "Vakıf işaretleri, kelimenin kapanışı ve kalkale.", "وقف کے نشان، لفظ کا بند ہونا اور قلقلہ۔"),
    picks: [
      { lesson: "signs", index: 0 },
      { lesson: "signs", index: 1 },
      { lesson: "signs", index: 2 },
      { lesson: "signs", index: 3 },
      { lesson: "signs", index: 4 },
      { lesson: "stop-start", index: 0 },
      { lesson: "stop-start", index: 1 },
      { lesson: "stop-start", index: 2 },
      { lesson: "ms-qalqala", index: 0 },
      { lesson: "ms-qalqala", index: 1 },
      { lesson: "ms-qalqala", index: 2 },
      { lesson: "read-short", index: 2 },
      { lesson: "read-kawthar", index: 2 },
    ],
  },
  {
    id: "read",
    mod: "alone",
    title: L("Чтение самому", "Reading on your own", "القراءة وحدك", "Membaca sendiri", "Kendi başına okuma", "خود پڑھنا"),
    lead: L("Семь шагов и сверка с чтецом. Галочка теста чтение не заменяет.", "The seven steps, and the check against a reciter. A tick does not replace the reading.", "سبع خطوات والمراجعة على القارئ.", "Tujuh langkah dan semakan pada qari.", "Yedi adım ve kariyle kontrol.", "سات قدم اور قاری سے جانچ۔"),
    picks: [
      { lesson: "method", index: 0 },
      { lesson: "method", index: 1 },
      { lesson: "method", index: 2 },
      { lesson: "read-fil", index: 0 },
      { lesson: "read-fil", index: 2 },
      { lesson: "alone", index: 0 },
      { lesson: "alone", index: 1 },
      { lesson: "alone", index: 2 },
    ],
  },
  {
    id: "hafs",
    mod: "alone",
    title: L("Особые места Хафса", "The special places of Hafs", "مواضع حفص", "Tempat khas Hafs", "Hafs'ın özel yerleri", "حفص کے خاص مقام"),
    lead: L("Сакт, ималя, тасхиль и ишмам. Не для первого дня.", "Sakt, imala, tashil and ishmam. Not for the first day.", "السكت والإمالة والتسهيل والإشمام.", "Sakt, imalah, tashil dan ishmam.", "Sekt, imale, teshil ve işmam.", "سکت، امالہ، سہولت اور اشمام۔"),
    picks: [
      { lesson: "hafs", index: 0 },
      { lesson: "hafs", index: 1 },
      { lesson: "hafs", index: 2 },
    ],
  },
];

const quizByLesson = new Map(TAJWEED_PATH_FLAT.map((lesson) => [lesson.id, lesson]));

export function topicQuiz(topic: QuizTopic): TajQuiz[] {
  return topic.picks.flatMap((pick) => {
    const item = quizByLesson.get(pick.lesson)?.quiz[pick.index];
    return item ? [item] : [];
  });
}
