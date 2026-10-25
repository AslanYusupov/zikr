import type { FixedQuote } from "./quote-fix";

type ExtraQuote = { text: string; source: string; arabic?: string };

const ROWS: { q: ExtraQuote; tr: FixedQuote }[] = [
  {
    q: {
      text: "О нет! Кто покорит свой лик Аллах1у, совершая добро, тот получит награду от своего Господа. Они не познают страха и не будут опечалены.",
      arabic: "بَلَىٰ مَنْ أَسْلَمَ وَجْهَهُۥ لِلَّهِ وَهُوَ مُحْسِنٌۭ فَلَهُۥٓ أَجْرُهُۥ عِندَ رَبِّهِۦ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      source: "Коран, 2:112",
    },
    tr: {
      en: "Yes. Whoever submits his face to Allah while doing good will have his reward with his Lord. They will have no fear, nor will they grieve.",
      ar: "بَلَىٰ مَنْ أَسْلَمَ وَجْهَهُۥ لِلَّهِ وَهُوَ مُحْسِنٌۭ فَلَهُۥٓ أَجْرُهُۥ عِندَ رَبِّهِۦ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      id: "Ya. Siapa yang berserah diri kepada Allah dan berbuat baik, baginya pahala di sisi Tuhannya. Mereka tidak takut dan tidak bersedih.",
      tr: "Evet. Kim iyilik yaparak yüzünü Allah’a teslim ederse, onun mükâfatı Rabbinin katındadır. Onlara korku yoktur ve onlar üzülmezler.",
      ur: "ہاں، جو اپنا چہرہ اللہ کے حوالے کر دے اور نیکوکار ہو، اس کا اجر اس کے رب کے پاس ہے۔ ان پر نہ خوف ہوگا نہ وہ غمگین ہوں گے۔",
    },
  },
  {
    q: {
      text: "Вот Ибрахим (Авраам) и Исмаил (Измаил) подняли основание Дома (Каабы): «Господь наш! Прими от нас! Воистину, Ты - Слышащий, Знающий.",
      arabic: "رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
      source: "Коран, 2:127",
    },
    tr: {
      en: "Our Lord, accept this from us. Indeed You are the All-Hearing, the All-Knowing.",
      ar: "رَبَّنَا تَقَبَّلْ مِنَّآ ۖ إِنَّكَ أَنتَ ٱلسَّمِيعُ ٱلْعَلِيمُ",
      id: "Ya Tuhan kami, terimalah dari kami. Sungguh Engkau Maha Mendengar lagi Maha Mengetahui.",
      tr: "Rabbimiz! Bizden kabul buyur. Şüphesiz Sen hakkıyla işiten, hakkıyla bilensin.",
      ur: "اے ہمارے رب، ہم سے قبول فرما۔ بے شک تو ہی سننے والا، جاننے والا ہے۔",
    },
  },
  {
    q: {
      text: "Вам предписано сражаться, хотя это вам неприятно. Быть может, вам неприятно то, что является благом для вас. И быть может, вы любите то, что является злом для вас. Аллах1 знает, а вы не знаете.",
      arabic: "وَعَسَىٰٓ أَن تَكْرَهُوا۟ شَيْـًۭٔا وَهُوَ خَيْرٌۭ لَّكُمْ ۖ وَعَسَىٰٓ أَن تُحِبُّوا۟ شَيْـًۭٔا وَهُوَ شَرٌّۭ لَّكُمْ ۗ وَٱللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ",
      source: "Коран, 2:216",
    },
    tr: {
      en: "Perhaps you dislike a thing and it is good for you, and perhaps you love a thing and it is bad for you. Allah knows, and you do not know.",
      ar: "وَعَسَىٰٓ أَن تَكْرَهُوا۟ شَيْـًۭٔا وَهُوَ خَيْرٌۭ لَّكُمْ ۖ وَعَسَىٰٓ أَن تُحِبُّوا۟ شَيْـًۭٔا وَهُوَ شَرٌّۭ لَّكُمْ ۗ وَٱللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ",
      id: "Boleh jadi kamu membenci sesuatu, padahal itu baik bagimu, dan boleh jadi kamu menyukai sesuatu, padahal itu buruk bagimu. Allah mengetahui, sedangkan kamu tidak mengetahui.",
      tr: "Olur ki bir şeyi sevmezsiniz, oysa o sizin için hayırdır. Ve olur ki bir şeyi seversiniz, oysa o sizin için şerdir. Allah bilir, siz bilmezsiniz.",
      ur: "ہو سکتا ہے تم کسی چیز کو ناپسند کرو اور وہ تمہارے لیے بہتر ہو، اور ہو سکتا ہے تم کسی چیز کو پسند کرو اور وہ تمہارے لیے بری ہو۔ اللہ جانتا ہے اور تم نہیں جانتے۔",
    },
  },
  {
    q: {
      text: "Нет принуждения в религии. Прямой путь уже отличился от заблуждения. Кто не верует в тагута, а верует в Аллах1а, тот ухватился за самую надежную рукоять, которая никогда не сломается. Аллах1 - Слышащий, Знающий.",
      arabic: "لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ",
      source: "Коран, 2:256",
    },
    tr: {
      en: "There is no compulsion in religion. The right way has become distinct from error.",
      ar: "لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ",
      id: "Tidak ada paksaan dalam agama. Sungguh telah jelas jalan yang benar dari jalan yang sesat.",
      tr: "Dinde zorlama yoktur. Doğru yol sapıklıktan açıkça ayrılmıştır.",
      ur: "دین میں کوئی زبردستی نہیں۔ ہدایت گمراہی سے واضح ہو چکی ہے۔",
    },
  },
  {
    q: {
      text: "Скажи: «Если вы любите Аллах1а, то следуйте за мной, и тогда Аллах1 возлюбит вас и простит вам ваши грехи, ведь Аллах1 - Прощающий, Милосердный».",
      arabic: "قُلْ إِن كُنتُمْ تُحِبُّونَ ٱللَّهَ فَٱتَّبِعُونِى يُحْبِبْكُمُ ٱللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَٱللَّهُ غَفُورٌۭ رَّحِيمٌۭ",
      source: "Коран, 3:31",
    },
    tr: {
      en: "Say: If you love Allah, then follow me, and Allah will love you and forgive you your sins. Allah is Forgiving and Merciful.",
      ar: "قُلْ إِن كُنتُمْ تُحِبُّونَ ٱللَّهَ فَٱتَّبِعُونِى يُحْبِبْكُمُ ٱللَّهُ وَيَغْفِرْ لَكُمْ ذُنُوبَكُمْ ۗ وَٱللَّهُ غَفُورٌۭ رَّحِيمٌۭ",
      id: "Katakanlah: jika kamu mencintai Allah, ikutilah aku, niscaya Allah mencintaimu dan mengampuni dosa-dosamu. Allah Maha Pengampun lagi Maha Penyayang.",
      tr: "De ki: Allah’ı seviyorsanız bana uyun ki Allah da sizi sevsin ve günahlarınızı bağışlasın. Allah çok bağışlayan, çok merhamet edendir.",
      ur: "کہہ دو: اگر تم اللہ سے محبت رکھتے ہو تو میری پیروی کرو، اللہ تم سے محبت کرے گا اور تمہارے گناہ بخش دے گا۔ اللہ بخشنے والا، مہربان ہے۔",
    },
  },
  {
    q: {
      text: "Вы не обретете благочестия, пока не будете расходовать из того, что вы любите, и что бы вы ни расходовали, Аллах1 ведает об этом.",
      arabic: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍۢ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌۭ",
      source: "Коран, 3:92",
    },
    tr: {
      en: "You will not attain righteousness until you spend from what you love. Whatever you spend, Allah knows it.",
      ar: "لَن تَنَالُوا۟ ٱلْبِرَّ حَتَّىٰ تُنفِقُوا۟ مِمَّا تُحِبُّونَ ۚ وَمَا تُنفِقُوا۟ مِن شَىْءٍۢ فَإِنَّ ٱللَّهَ بِهِۦ عَلِيمٌۭ",
      id: "Kamu tidak akan memperoleh kebajikan sebelum kamu menginfakkan sebagian dari apa yang kamu cintai. Apa pun yang kamu infakkan, Allah mengetahuinya.",
      tr: "Sevdiğiniz şeylerden infak etmedikçe iyiliğe erişemezsiniz. Ne infak ederseniz Allah onu bilir.",
      ur: "تم نیکی نہ پاؤ گے جب تک اپنی پسندیدہ چیزوں میں سے خرچ نہ کرو۔ جو کچھ تم خرچ کرو، اللہ اسے جانتا ہے۔",
    },
  },
  {
    q: {
      text: "О те, которые уверовали! Бойтесь Аллах1а должным образом и умирайте не иначе, как будучи мусульманами!",
      arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ حَقَّ تُقَاتِهِۦ وَلَا تَمُوتُنَّ إِلَّا وَأَنتُم مُّسْلِمُونَ",
      source: "Коран, 3:102",
    },
    tr: {
      en: "O you who believe, fear Allah as He should be feared, and do not die except as Muslims.",
      ar: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ حَقَّ تُقَاتِهِۦ وَلَا تَمُوتُنَّ إِلَّا وَأَنتُم مُّسْلِمُونَ",
      id: "Wahai orang-orang yang beriman, bertakwalah kepada Allah dengan sebenar-benar takwa, dan janganlah kamu mati kecuali dalam keadaan muslim.",
      tr: "Ey iman edenler! Allah’tan, O’na yaraşır biçimde korkun ve ancak Müslümanlar olarak can verin.",
      ur: "اے ایمان والو! اللہ سے جیسا ڈرنا چاہیے ویسا ڈرو، اور تم ہرگز نہ مرنا مگر اس حال میں کہ مسلمان ہو۔",
    },
  },
  {
    q: {
      text: "О те, которые уверовали! Будьте терпеливы, запасайтесь терпением, несите службу на заставах и бойтесь Аллах1а, - быть может, вы преуспеете.",
      arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱصْبِرُوا۟ وَصَابِرُوا۟ وَرَابِطُوا۟ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُفْلِحُونَ",
      source: "Коран, 3:200",
    },
    tr: {
      en: "O you who believe, be patient, outlast others in patience, stand guard, and fear Allah, so that you may succeed.",
      ar: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱصْبِرُوا۟ وَصَابِرُوا۟ وَرَابِطُوا۟ وَٱتَّقُوا۟ ٱللَّهَ لَعَلَّكُمْ تُفْلِحُونَ",
      id: "Wahai orang-orang yang beriman, bersabarlah, kuatkan kesabaranmu, tetaplah waspada, dan bertakwalah kepada Allah agar kamu beruntung.",
      tr: "Ey iman edenler! Sabredin, sabırda yarışın, nöbet tutun ve Allah’tan korkun ki kurtuluşa eresiniz.",
      ur: "اے ایمان والو! صبر کرو، صبر میں بڑھ جاؤ، پہرہ دو، اور اللہ سے ڈرو، تاکہ تم کامیاب ہو۔",
    },
  },
  {
    q: {
      text: "Когда вас приветствуют, отвечайте еще лучшим приветствием или тем же самым. Воистину, Аллах1 подсчитывает всякую вещь.",
      arabic: "وَإِذَا حُيِّيتُم بِتَحِيَّةٍۢ فَحَيُّوا۟ بِأَحْسَنَ مِنْهَآ أَوْ رُدُّوهَآ ۗ إِنَّ ٱللَّهَ كَانَ عَلَىٰ كُلِّ شَىْءٍ حَسِيبًا",
      source: "Коран, 4:86",
    },
    tr: {
      en: "When you are greeted, answer with a better greeting or return the same. Indeed Allah takes account of all things.",
      ar: "وَإِذَا حُيِّيتُم بِتَحِيَّةٍۢ فَحَيُّوا۟ بِأَحْسَنَ مِنْهَآ أَوْ رُدُّوهَآ ۗ إِنَّ ٱللَّهَ كَانَ عَلَىٰ كُلِّ شَىْءٍ حَسِيبًا",
      id: "Apabila kamu dihormati dengan suatu penghormatan, balaslah dengan yang lebih baik atau balaslah yang sama. Sungguh Allah memperhitungkan segala sesuatu.",
      tr: "Size bir selam verildiğinde ondan daha güzeliyle karşılık verin veya aynısıyla cevaplayın. Şüphesiz Allah her şeyi hesaba katar.",
      ur: "جب تمہیں سلام کیا جائے تو اس سے بہتر جواب دو یا ویسا ہی لوٹا دو۔ بے شک اللہ ہر چیز کا حساب لینے والا ہے۔",
    },
  },
  {
    q: {
      text: "Верующими являются только те, сердца которых испытывают страх при упоминании Аллах1а, вера которых усиливается, когда им читают Его аяты, которые уповают на своего Господа,",
      arabic: "إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ ءَايَٰتُهُۥ زَادَتْهُمْ إِيمَٰنًۭا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ",
      source: "Коран, 8:2",
    },
    tr: {
      en: "The believers are only those whose hearts tremble when Allah is mentioned, whose faith increases when His verses are recited to them, and who rely upon their Lord.",
      ar: "إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ ءَايَٰتُهُۥ زَادَتْهُمْ إِيمَٰنًۭا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ",
      id: "Orang-orang mukmin hanyalah mereka yang hatinya gemetar ketika Allah disebut, imannya bertambah ketika ayat-ayat-Nya dibacakan, dan yang bertawakal kepada Tuhan mereka.",
      tr: "Müminler ancak o kimselerdir ki Allah anıldığında kalpleri ürperir, ayetleri okunduğunda imanları artar ve Rablerine tevekkül ederler.",
      ur: "مومن تو وہی ہیں کہ جب اللہ کا ذکر ہو ان کے دل ڈر جائیں، جب اس کی آیتیں پڑھ کر سنائی جائیں تو ان کا ایمان بڑھ جائے، اور وہ اپنے رب پر بھروسہ کریں۔",
    },
  },
  {
    q: {
      text: "А если они отвернутся, то скажи: «Мне достаточно Аллах1а! Нет божества, кроме Него. Я уповаю только на Него, ибо Он - Господь великого Трона».",
      arabic: "فَإِن تَوَلَّوْا۟ فَقُلْ حَسْبِىَ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ",
      source: "Коран, 9:129",
    },
    tr: {
      en: "If they turn away, say: Allah is sufficient for me. There is no god but Him. In Him I trust, and He is the Lord of the Mighty Throne.",
      ar: "فَإِن تَوَلَّوْا۟ فَقُلْ حَسْبِىَ ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ",
      id: "Jika mereka berpaling, katakanlah: cukuplah Allah bagiku. Tidak ada tuhan selain Dia. Kepada-Nya aku bertawakal, dan Dia Tuhan pemilik Arasy yang agung.",
      tr: "Yüz çevirirlerse de ki: Allah bana yeter. O’ndan başka ilah yoktur. Yalnız O’na tevekkül ettim. O, yüce Arş’ın Rabbidir.",
      ur: "اگر وہ منہ موڑ لیں تو کہہ دو: میرے لیے اللہ کافی ہے۔ اس کے سوا کوئی معبود نہیں۔ اسی پر میں نے بھروسہ کیا، اور وہ عرش عظیم کا رب ہے۔",
    },
  },
  {
    q: {
      text: "Он сказал: «Мои жалобы и печаль обращены только к Аллах1у, и я узнаю от Аллах1а то, чего вы не знаете.",
      arabic: "قَالَ إِنَّمَآ أَشْكُوا۟ بَثِّى وَحُزْنِىٓ إِلَى ٱللَّهِ",
      source: "Коран, 12:86",
    },
    tr: {
      en: "He said: I complain of my grief and sorrow only to Allah.",
      ar: "قَالَ إِنَّمَآ أَشْكُوا۟ بَثِّى وَحُزْنِىٓ إِلَى ٱللَّهِ",
      id: "Dia berkata: aku hanya mengadukan kesusahan dan kesedihanku kepada Allah.",
      tr: "Dedi: Ben derdimi ve hüznümü yalnız Allah’a arz ederim.",
      ur: "کہا: میں اپنا غم اور رنج صرف اللہ ہی سے کہتا ہوں۔",
    },
  },
  {
    q: {
      text: "Разве ты не видишь, как Аллах1 приводит притчи? Прекрасное слово подобно прекрасному дереву, корни которого прочны, а ветви восходят к небу. Оно плодоносит каждый миг с дозволения своего Господа. Аллах1 приводит людям притчи, - быть может, они помянут назидание.",
      arabic: "أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًۭا كَلِمَةًۭ طَيِّبَةًۭ كَشَجَرَةٍۢ طَيِّبَةٍ أَصْلُهَا ثَابِتٌۭ وَفَرْعُهَا فِى ٱلسَّمَآءِ تُؤْتِىٓ أُكُلَهَا كُلَّ حِينٍۭ بِإِذْنِ رَبِّهَا",
      source: "Коран, 14:24–25",
    },
    tr: {
      en: "Have you not seen how Allah sets forth a parable? A good word is like a good tree: its root is firm and its branches reach the sky. It yields its fruit at all times by its Lord’s permission.",
      ar: "أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًۭا كَلِمَةًۭ طَيِّبَةًۭ كَشَجَرَةٍۢ طَيِّبَةٍ أَصْلُهَا ثَابِتٌۭ وَفَرْعُهَا فِى ٱلسَّمَآءِ تُؤْتِىٓ أُكُلَهَا كُلَّ حِينٍۭ بِإِذْنِ رَبِّهَا",
      id: "Tidakkah kamu perhatikan bagaimana Allah membuat perumpamaan? Kalimat yang baik seperti pohon yang baik: akarnya kuat dan cabangnya menjulang ke langit. Ia berbuah setiap waktu dengan izin Tuhannya.",
      tr: "Allah’ın güzel sözü nasıl örneklendirdiğini görmedin mi? Güzel söz, kökü sağlam, dalları göğe uzanan güzel bir ağaç gibidir. Rabbinin izniyle her zaman meyve verir.",
      ur: "کیا تم نے نہیں دیکھا کہ اللہ نے کیسی مثال بیان کی؟ پاکیزہ بات ایک اچھے درخت کی مانند ہے، جس کی جڑ مضبوط ہے اور شاخ آسمان میں ہے۔ وہ اپنے رب کے حکم سے ہر وقت پھل دیتا ہے۔",
    },
  },
  {
    q: {
      text: "Воистину, Аллах1 повелевает блюсти справедливость, делать добро и одаривать родственников. Он запрещает мерзости, предосудительные деяния и бесчинства. Он увещевает вас, - быть может, вы помяните назидание.",
      arabic: "إِنَّ ٱللَّهَ يَأْمُرُ بِٱلْعَدْلِ وَٱلْإِحْسَٰنِ وَإِيتَآئِ ذِى ٱلْقُرْبَىٰ وَيَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ وَٱلْبَغْىِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ",
      source: "Коран, 16:90",
    },
    tr: {
      en: "Indeed Allah commands justice, good conduct, and giving to relatives. He forbids immorality, wrongdoing, and oppression. He instructs you so that you may remember.",
      ar: "إِنَّ ٱللَّهَ يَأْمُرُ بِٱلْعَدْلِ وَٱلْإِحْسَٰنِ وَإِيتَآئِ ذِى ٱلْقُرْبَىٰ وَيَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ وَٱلْبَغْىِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ",
      id: "Sungguh Allah menyuruh berlaku adil, berbuat kebajikan, dan memberi kepada kerabat. Dia melarang kekejian, kemungkaran, dan permusuhan. Dia menasihatimu agar kamu ingat.",
      tr: "Şüphesiz Allah adaleti, iyiliği ve akrabaya vermeyi emreder. Hayâsızlığı, kötülüğü ve azgınlığı yasaklar. Öğüt verir ki düşünesiniz.",
      ur: "بے شک اللہ انصاف، احسان اور رشتہ داروں کو دینے کا حکم دیتا ہے، اور بے حیائی، برائی اور زیادتی سے منع کرتا ہے۔ وہ تمہیں نصیحت کرتا ہے تاکہ تم یاد رکھو۔",
    },
  },
  {
    q: {
      text: "Твой Господь предписал вам не поклоняться никому, кроме Него, и делать добро родителям. Если один из родителей или оба достигнут старости, то не говори им: «Тьфу!». - не кричи на них и обращайся к ним почтительно. Склони пред ними крыло смирения по милосердию своему и говори: «Господи! Помилуй их, ведь они растили меня ребенком».",
      arabic: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّۢ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًۭا كَرِيمًۭا وَٱخْفِضْ لَهُمَا جَنَاحَ ٱلذُّلِّ مِنَ ٱلرَّحْمَةِ وَقُل رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًۭا",
      source: "Коран, 17:23–24",
    },
    tr: {
      en: "Your Lord has decreed that you worship none but Him, and that you be good to your parents. If one or both of them reach old age with you, do not say to them a word of disrespect, and do not scold them, but speak to them kindly. Lower to them the wing of humility out of mercy, and say: My Lord, have mercy on them as they raised me when I was small.",
      ar: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّۢ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًۭا كَرِيمًۭا وَٱخْفِضْ لَهُمَا جَنَاحَ ٱلذُّلِّ مِنَ ٱلرَّحْمَةِ وَقُل رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًۭا",
      id: "Tuhanmu menetapkan agar kamu tidak menyembah selain Dia dan berbuat baik kepada kedua orang tua. Jika salah seorang atau keduanya tua bersamamu, janganlah berkata “ah” dan jangan membentak mereka, ucapkanlah kata yang mulia. Rendahkanlah sayap kerendahan karena kasih sayang dan katakanlah: Ya Tuhanku, sayangilah mereka sebagaimana mereka menyayangiku ketika aku kecil.",
      tr: "Rabbin, yalnız O’na kulluk etmenizi ve anne babaya iyilik etmenizi emretti. Onlardan biri veya ikisi senin yanında yaşlanırsa onlara “öf” bile deme, onları azarlama ve onlara güzel söz söyle. Merhametten dolayı onlara tevazu kanadını indir ve de: Rabbim, onlar beni küçükken nasıl yetiştirdilerse Sen de onlara merhamet et.",
      ur: "تیرے رب نے حکم دیا کہ اس کے سوا کسی کی عبادت نہ کرو اور والدین کے ساتھ احسان کرو۔ اگر ان میں سے ایک یا دونوں تیرے پاس بڑھاپے کو پہنچ جائیں تو ان سے اف تک نہ کہنا، انہیں نہ جھڑکنا، اور ان سے عزت کی بات کہنا۔ ان کے آگے عاجزی کا بازو جھکا دے اور کہہ: اے رب، ان پر رحم کر جیسا انہوں نے بچپن میں مجھے پالا۔",
    },
  },
  {
    q: {
      text: "Мы ниспосылаем в Коране то, что является исцелением и милостью для верующих, а беззаконникам он не прибавляет ничего, кроме убытка.",
      arabic: "وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌۭ وَرَحْمَةٌۭ لِّلْمُؤْمِنِينَ",
      source: "Коран, 17:82",
    },
    tr: {
      en: "We send down in the Quran that which is a healing and a mercy for the believers.",
      ar: "وَنُنَزِّلُ مِنَ ٱلْقُرْءَانِ مَا هُوَ شِفَآءٌۭ وَرَحْمَةٌۭ لِّلْمُؤْمِنِينَ",
      id: "Kami turunkan dari Al-Qur’an sesuatu yang menjadi penawar dan rahmat bagi orang-orang yang beriman.",
      tr: "Biz Kur’an’dan, müminler için şifa ve rahmet olanı indiririz.",
      ur: "ہم قرآن میں سے وہ چیز اتارتے ہیں جو مومنوں کے لیے شفا اور رحمت ہے۔",
    },
  },
  {
    q: {
      text: "Помяни также Айюба (Иова), который воззвал к своему Господу: «Воистину, меня коснулось зло, а ведь Ты - Милосерднейший из милосердных».",
      arabic: "أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
      source: "Коран, 21:83",
    },
    tr: {
      en: "Indeed harm has touched me, and You are the Most Merciful of the merciful.",
      ar: "أَنِّى مَسَّنِىَ ٱلضُّرُّ وَأَنتَ أَرْحَمُ ٱلرَّٰحِمِينَ",
      id: "Sungguh aku ditimpa penyakit, dan Engkau adalah Yang Maha Penyayang di antara para penyayang.",
      tr: "Bana zarar dokundu. Sen merhametlilerin en merhametlisisin.",
      ur: "مجھے تکلیف پہنچی ہے، اور تو سب رحم کرنے والوں سے بڑھ کر رحم کرنے والا ہے۔",
    },
  },
  {
    q: {
      text: "Помяни также Закарию (Захарию), который воззвал к своему Господу: «Господи! Не оставляй меня одиноким, и Ты - Наилучший из наследников».",
      arabic: "رَبِّ لَا تَذَرْنِى فَرْدًۭا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ",
      source: "Коран, 21:89",
    },
    tr: {
      en: "My Lord, do not leave me alone, and You are the Best of inheritors.",
      ar: "رَبِّ لَا تَذَرْنِى فَرْدًۭا وَأَنتَ خَيْرُ ٱلْوَٰرِثِينَ",
      id: "Ya Tuhanku, janganlah Engkau biarkan aku sendirian, dan Engkau adalah sebaik-baik pewaris.",
      tr: "Rabbim! Beni yalnız bırakma. Sen varislerin en hayırlısısın.",
      ur: "اے میرے رب، مجھے اکیلا نہ چھوڑ، اور تو بہترین وارث ہے۔",
    },
  },
  {
    q: {
      text: "Мы отправили тебя только в качестве милости к мирам.",
      arabic: "وَمَآ أَرْسَلْنَٰكَ إِلَّا رَحْمَةًۭ لِّلْعَٰلَمِينَ",
      source: "Коран, 21:107",
    },
    tr: {
      en: "We have sent you only as a mercy to the worlds.",
      ar: "وَمَآ أَرْسَلْنَٰكَ إِلَّا رَحْمَةًۭ لِّلْعَٰلَمِينَ",
      id: "Kami tidak mengutusmu kecuali sebagai rahmat bagi seluruh alam.",
      tr: "Seni ancak âlemlere rahmet olarak gönderdik.",
      ur: "ہم نے تمہیں تمام جہانوں کے لیے رحمت بنا کر بھیجا ہے۔",
    },
  },
  {
    q: {
      text: "Который исцеляет меня, когда я заболеваю,",
      arabic: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
      source: "Коран, 26:80",
    },
    tr: {
      en: "And when I fall ill, He heals me.",
      ar: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
      id: "Apabila aku sakit, Dialah yang menyembuhkanku.",
      tr: "Hastalandığımda bana şifa veren O’dur.",
      ur: "اور جب میں بیمار پڑوں تو وہی مجھے شفا دیتا ہے۔",
    },
  },
  {
    q: {
      text: "Они говорят: «Господь наш! Даруй нам отраду глаз в наших супругах и потомках и сделай нас образцом для богобоязненных».",
      arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      source: "Коран, 25:74",
    },
    tr: {
      en: "Our Lord, grant us comfort of the eyes in our spouses and offspring, and make us an example for the God-fearing.",
      ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّٰتِنَا قُرَّةَ أَعْيُنٍۢ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      id: "Ya Tuhan kami, anugerahkanlah kepada kami penyejuk mata dari pasangan dan keturunan kami, dan jadikanlah kami teladan bagi orang-orang yang bertakwa.",
      tr: "Rabbimiz! Eşlerimizden ve çocuklarımızdan bize göz aydınlığı bağışla ve bizi Allah’tan korkanlara önder kıl.",
      ur: "اے ہمارے رب، ہمیں اپنی بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما، اور ہمیں پرہیزگاروں کا امام بنا۔",
    },
  },
  {
    q: {
      text: "Он улыбнулся, рассмеявшись от ее слов. Он сказал: «Господи! Внуши мне быть благодарным за Твою милость, которую Ты оказал мне и моим родителям, и совершать праведные деяния, которыми Ты будешь доволен. Введи меня по Своей милости в число Своих праведных рабов».",
      arabic: "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًۭا تَرْضَىٰهُ وَأَدْخِلْنِى بِرَحْمَتِكَ فِى عِبَادِكَ ٱلصَّٰلِحِينَ",
      source: "Коран, 27:19",
    },
    tr: {
      en: "My Lord, inspire me to be grateful for Your favor which You bestowed on me and on my parents, and to do righteous deeds that please You, and admit me by Your mercy among Your righteous servants.",
      ar: "رَبِّ أَوْزِعْنِىٓ أَنْ أَشْكُرَ نِعْمَتَكَ ٱلَّتِىٓ أَنْعَمْتَ عَلَىَّ وَعَلَىٰ وَٰلِدَىَّ وَأَنْ أَعْمَلَ صَٰلِحًۭا تَرْضَىٰهُ وَأَدْخِلْنِى بِرَحْمَتِكَ فِى عِبَادِكَ ٱلصَّٰلِحِينَ",
      id: "Ya Tuhanku, ilhamkanlah kepadaku untuk mensyukuri nikmat-Mu yang Engkau berikan kepadaku dan kepada kedua orang tuaku, dan agar aku mengerjakan amal saleh yang Engkau ridai, dan masukkanlah aku dengan rahmat-Mu ke dalam hamba-hamba-Mu yang saleh.",
      tr: "Rabbim! Bana ve anne babama verdiğin nimetine şükretmemi ve razı olacağın salih amel işlememi bana ilham et. Rahmetinle beni salih kullarının arasına kat.",
      ur: "اے میرے رب، مجھے توفیق دے کہ میں تیری اس نعمت کا شکر ادا کروں جو تو نے مجھ پر اور میرے والدین پر کی، اور ایسا نیک عمل کروں جس سے تو راضی ہو، اور اپنی رحمت سے مجھے اپنے نیک بندوں میں داخل فرما۔",
    },
  },
  {
    q: {
      text: "Среди Его знамений - то, что Он сотворил из вас самих жен для вас, чтобы вы находили в них успокоение, и установил между вами любовь и милосердие. Воистину, в этом - знамения для людей размышляющих.",
      arabic: "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ",
      source: "Коран, 30:21",
    },
    tr: {
      en: "Among His signs is that He created for you spouses from yourselves so that you may find rest in them, and He placed between you love and mercy. Indeed in that are signs for people who reflect.",
      ar: "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ",
      id: "Di antara tanda-tanda-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri agar kamu tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh pada yang demikian itu terdapat tanda-tanda bagi kaum yang berpikir.",
      tr: "O’nun ayetlerindendir ki size kendinizden eşler yaratmış, onlarla huzur bulasınız diye aranıza sevgi ve merhamet koymuştur. Bunda düşünen bir topluluk için ibretler vardır.",
      ur: "اس کی نشانیوں میں سے یہ ہے کہ اس نے تمہارے لیے تمہاری ہی جنس سے بیویاں بنائیں تاکہ تم ان کے پاس سکون پاؤ، اور اس نے تمہارے درمیان محبت اور رحمت رکھ دی۔ بے شک اس میں سوچنے والوں کے لیے نشانیاں ہیں۔",
    },
  },
  {
    q: {
      text: "В Посланнике Аллах1а был прекрасный пример для вас, для тех, кто надеется на Аллах1а и Последний день и премного поминает Аллах1а.",
      arabic: "لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌۭ لِّمَن كَانَ يَرْجُوا۟ ٱللَّهَ وَٱلْيَوْمَ ٱلْءَاخِرَ وَذَكَرَ ٱللَّهَ كَثِيرًۭا",
      source: "Коран, 33:21",
    },
    tr: {
      en: "In the Messenger of Allah there is a beautiful example for you, for whoever hopes in Allah and the Last Day and remembers Allah much.",
      ar: "لَّقَدْ كَانَ لَكُمْ فِى رَسُولِ ٱللَّهِ أُسْوَةٌ حَسَنَةٌۭ لِّمَن كَانَ يَرْجُوا۟ ٱللَّهَ وَٱلْيَوْمَ ٱلْءَاخِرَ وَذَكَرَ ٱللَّهَ كَثِيرًۭا",
      id: "Sungguh pada Rasulullah terdapat teladan yang baik bagimu, bagi orang yang mengharap Allah dan hari Akhir serta banyak mengingat Allah.",
      tr: "Allah’ın Resulünde, Allah’a ve ahiret gününe umut bağlayan ve Allah’ı çok ananlar için güzel bir örnek vardır.",
      ur: "تمہارے لیے اللہ کے رسول میں بہترین نمونہ ہے، اس کے لیے جو اللہ اور آخرت کے دن کی امید رکھے اور اللہ کو کثرت سے یاد کرے۔",
    },
  },
  {
    q: {
      text: "Неужели тот, кто смиренно проводит ночные часы, падая ниц и стоя, страшась Последней жизни и надеясь на милость своего Господа, равен неверующему? Скажи: «Неужели равны те, которые знают, и те, которые не знают?». Воистину, поминают назидание только обладающие разумом.",
      arabic: "قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُو۟لُوا۟ ٱلْأَلْبَٰبِ",
      source: "Коран, 39:9",
    },
    tr: {
      en: "Say: Are those who know equal to those who do not know? Only people of understanding remember.",
      ar: "قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُو۟لُوا۟ ٱلْأَلْبَٰبِ",
      id: "Katakanlah: apakah sama orang yang mengetahui dan orang yang tidak mengetahui? Hanya orang yang berakal yang mengambil pelajaran.",
      tr: "De ki: Hiç bilenlerle bilmeyenler bir olur mu? Ancak akıl sahipleri öğüt alır.",
      ur: "کہہ دو: کیا جاننے والے اور نہ جاننے والے برابر ہو سکتے ہیں؟ نصیحت تو صرف عقل والے ہی قبول کرتے ہیں۔",
    },
  },
  {
    q: {
      text: "Вы вспомните то, о чем я вам говорю. Я вверяю свое дело Аллах1у. Воистину, Аллах1 видит рабов».",
      arabic: "وَأُفَوِّضُ أَمْرِىٓ إِلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ بَصِيرٌۢ بِٱلْعِبَادِ",
      source: "Коран, 40:44",
    },
    tr: {
      en: "I entrust my affair to Allah. Indeed Allah is Seeing of His servants.",
      ar: "وَأُفَوِّضُ أَمْرِىٓ إِلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ بَصِيرٌۢ بِٱلْعِبَادِ",
      id: "Aku menyerahkan urusanku kepada Allah. Sungguh Allah Maha Melihat hamba-hamba-Nya.",
      tr: "İşimi Allah’a havale ediyorum. Şüphesiz Allah kullarını görendir.",
      ur: "میں اپنا معاملہ اللہ کے سپرد کرتا ہوں۔ بے شک اللہ بندوں کو دیکھنے والا ہے۔",
    },
  },
  {
    q: {
      text: "Не равны добро и зло. Оттолкни зло тем, что лучше, и тогда тот, с кем ты враждуешь, станет для тебя словно близкий любящий родственник.",
      arabic: "وَلَا تَسْتَوِى ٱلْحَسَنَةُ وَلَا ٱلسَّيِّئَةُ ۚ ٱدْفَعْ بِٱلَّتِى هِىَ أَحْسَنُ فَإِذَا ٱلَّذِى بَيْنَكَ وَبَيْنَهُۥ عَدَٰوَةٌۭ كَأَنَّهُۥ وَلِىٌّ حَمِيمٌۭ",
      source: "Коран, 41:34",
    },
    tr: {
      en: "Good and evil are not equal. Repel evil with what is better, and then the one between whom and you there was enmity will become like a close friend.",
      ar: "وَلَا تَسْتَوِى ٱلْحَسَنَةُ وَلَا ٱلسَّيِّئَةُ ۚ ٱدْفَعْ بِٱلَّتِى هِىَ أَحْسَنُ فَإِذَا ٱلَّذِى بَيْنَكَ وَبَيْنَهُۥ عَدَٰوَةٌۭ كَأَنَّهُۥ وَلِىٌّ حَمِيمٌۭ",
      id: "Kebaikan dan keburukan tidak sama. Tolaklah keburukan dengan cara yang lebih baik, maka orang yang antara kamu dan dia ada permusuhan akan menjadi seperti teman yang dekat.",
      tr: "İyilikle kötülük bir olmaz. Kötülüğü en güzel olanla sav. O zaman seninle arasında düşmanlık olan kimse sıcak bir dost gibi olur.",
      ur: "نیکی اور بدی برابر نہیں۔ برائی کو اس طریقے سے دفع کرو جو بہتر ہو، پھر وہ شخص جس کے اور تمہارے درمیان دشمنی تھی ایسا ہو جائے گا جیسے گہرا دوست۔",
    },
  },
  {
    q: {
      text: "О те, которые уверовали! Избегайте многих предположений, ибо некоторые предположения являются грехом. Не следите друг за другом и не злословьте за спиной друг друга. Разве понравится кому-либо из вас есть мясо своего покойного брата, если вы чувствуете к этому отвращение? Бойтесь Аллах1а! Воистину, Аллах1 - Принимающий покаяния, Милосердный.",
      arabic: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱجْتَنِبُوا۟ كَثِيرًۭا مِّنَ ٱلظَّنِّ إِنَّ بَعْضَ ٱلظَّنِّ إِثْمٌۭ ۖ وَلَا تَجَسَّسُوا۟ وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
      source: "Коран, 49:12",
    },
    tr: {
      en: "O you who believe, avoid much suspicion. Some suspicion is a sin. Do not spy on one another, and do not backbite one another.",
      ar: "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱجْتَنِبُوا۟ كَثِيرًۭا مِّنَ ٱلظَّنِّ إِنَّ بَعْضَ ٱلظَّنِّ إِثْمٌۭ ۖ وَلَا تَجَسَّسُوا۟ وَلَا يَغْتَب بَّعْضُكُم بَعْضًا",
      id: "Wahai orang-orang yang beriman, jauhilah banyak prasangka. Sesungguhnya sebagian prasangka itu dosa. Janganlah kalian mencari-cari kesalahan dan jangan saling menggunjing.",
      tr: "Ey iman edenler! Zannın çoğundan sakının. Zannın bir kısmı günahtır. Birbirinizin gizlisini araştırmayın ve birbirinizi gıybet etmeyin.",
      ur: "اے ایمان والو! بہت سے گمانوں سے بچو۔ کچھ گمان گناہ ہوتے ہیں۔ ایک دوسرے کی ٹوہ میں نہ لگے رہو اور ایک دوسرے کی غیبت نہ کرو۔",
    },
  },
  {
    q: {
      text: "О те, которые уверовали! Когда вас просят на собраниях сесть пошире, то садитесь пошире, и Аллах1 одарит вас местом просторным. Когда же вам велят подняться, то поднимайтесь. Аллах1 возвышает по степеням тех из вас, кто уверовал, и тех, кому даровано знание. Аллах1 ведает о том, что вы совершаете.",
      arabic: "يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَٰتٍۢ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌۭ",
      source: "Коран, 58:11",
    },
    tr: {
      en: "Allah raises in degrees those of you who believe and those who have been given knowledge. Allah is aware of what you do.",
      ar: "يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَٰتٍۢ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌۭ",
      id: "Allah mengangkat derajat orang-orang yang beriman di antaramu dan orang-orang yang diberi ilmu. Allah Maha Mengetahui apa yang kamu kerjakan.",
      tr: "Allah, içinizden iman edenleri ve kendilerine ilim verilenleri derecelerle yükseltir. Allah yaptıklarınızdan haberdardır.",
      ur: "اللہ تم میں سے ایمان والوں اور جنہیں علم دیا گیا ہے ان کے درجے بلند کرتا ہے۔ اللہ جانتا ہے جو تم کرتے ہو۔",
    },
  },
  {
    q: {
      text: "Воистину, твой нрав превосходен.",
      arabic: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍۢ",
      source: "Коран, 68:4",
    },
    tr: {
      en: "Indeed you are of a great character.",
      ar: "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍۢ",
      id: "Sungguh engkau berada di atas akhlak yang agung.",
      tr: "Şüphesiz sen yüce bir ahlak üzeresin.",
      ur: "اور بے شک تم اخلاق کے بڑے مرتبے پر ہو۔",
    },
  },
  {
    q: {
      text: "Кто прочитает букву из Книги Аллах1а, тому запишут доброе дело, а доброе дело воздаётся десятикратно. Я не говорю, что «алиф лам мим» — одна буква. Алиф — буква, лам — буква, мим — буква.",
      arabic: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا لَا أَقُولُ الم حَرْفٌ وَلَكِنْ أَلِفٌ حَرْفٌ وَلَامٌ حَرْفٌ وَمِيمٌ حَرْفٌ",
      source: "ат-Тирмизи",
    },
    tr: {
      en: "Whoever recites a letter from the Book of Allah will have a good deed, and a good deed is rewarded tenfold. I do not say that Alif Lam Mim is one letter. Alif is a letter, Lam is a letter, and Mim is a letter.",
      ar: "مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا لَا أَقُولُ الم حَرْفٌ وَلَكِنْ أَلِفٌ حَرْفٌ وَلَامٌ حَرْفٌ وَمِيمٌ حَرْفٌ",
      id: "Siapa membaca satu huruf dari Kitab Allah, baginya satu kebaikan, dan kebaikan dilipat sepuluh. Aku tidak mengatakan alif lam mim satu huruf, tetapi alif satu huruf, lam satu huruf, dan mim satu huruf.",
      tr: "Kim Allah’ın Kitabından bir harf okursa ona bir iyilik yazılır, iyilik de on katıyla karşılık bulur. Elif lâm mîm bir harftir demiyorum. Elif bir harf, lâm bir harf, mîm bir harftir.",
      ur: "جو اللہ کی کتاب کا ایک حرف پڑھے، اسے ایک نیکی ملتی ہے، اور نیکی دس گنا لکھی جاتی ہے۔ میں نہیں کہتا کہ الم ایک حرف ہے، بلکہ الف حرف ہے، لام حرف ہے، میم حرف ہے۔",
    },
  },
  {
    q: {
      text: "Читайте Коран, ибо он явится в День воскресения заступником за тех, кто его читал.",
      arabic: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
      source: "Муслим",
    },
    tr: {
      en: "Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions.",
      ar: "اقْرَءُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
      id: "Bacalah Al-Qur’an, karena ia akan datang pada hari Kiamat sebagai pemberi syafaat bagi para pembacanya.",
      tr: "Kur’an okuyun. Çünkü o kıyamet günü okuyanlarına şefaatçi olarak gelecektir.",
      ur: "قرآن پڑھو، کیونکہ وہ قیامت کے دن اپنے ساتھیوں کا سفارش کرنے والا بن کر آئے گا۔",
    },
  },
  {
    q: {
      text: "Лучший из вас — тот, кто изучает Коран и обучает ему.",
      arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      source: "аль-Бухари",
    },
    tr: {
      en: "The best of you is the one who learns the Quran and teaches it.",
      ar: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      id: "Sebaik-baik kalian adalah orang yang belajar Al-Qur’an dan mengajarkannya.",
      tr: "Sizin en hayırlınız Kur’an’ı öğrenen ve öğretendir.",
      ur: "تم میں بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔",
    },
  },
  {
    q: {
      text: "Скажи: «Он — Аллах1, Единый» равна трети Корана.",
      arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "Say: He is Allah, One, equals a third of the Quran.",
      ar: "قُلْ هُوَ اللَّهُ أَحَدٌ تَعْدِلُ ثُلُثَ الْقُرْآنِ",
      id: "“Katakanlah: Dialah Allah Yang Maha Esa” menyamai sepertiga Al-Qur’an.",
      tr: "“De ki: O, Allah’tır, birdir” Kur’an’ın üçte birine denktir.",
      ur: "«قُلْ هُوَ اللَّهُ أَحَدٌ» قرآن کے تہائی کے برابر ہے۔",
    },
  },
  {
    q: {
      text: "Аллах1 записал добрые и дурные дела и разъяснил это. Кто задумал доброе дело и не сделал его, тому Аллах1 запишет полное доброе дело. Если сделал, Аллах1 запишет от десяти до семисот и больше. Кто задумал дурное и не сделал его, тому Аллах1 запишет полное доброе дело. Если сделал, Аллах1 запишет одно дурное дело.",
      arabic: "إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ وَإِنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ سَيِّئَةً وَاحِدَةً",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "Allah has recorded good deeds and evil deeds, then explained it. Whoever intends a good deed and does not do it, Allah records it as a complete good deed. If he does it, Allah records it as ten to seven hundred times, and more. Whoever intends an evil deed and does not do it, Allah records it as a complete good deed. If he does it, Allah records it as one evil deed.",
      ar: "إِنَّ اللَّهَ كَتَبَ الْحَسَنَاتِ وَالسَّيِّئَاتِ ثُمَّ بَيَّنَ ذَلِكَ فَمَنْ هَمَّ بِحَسَنَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ عَشْرَ حَسَنَاتٍ إِلَى سَبْعِمِائَةِ ضِعْفٍ إِلَى أَضْعَافٍ كَثِيرَةٍ وَإِنْ هَمَّ بِسَيِّئَةٍ فَلَمْ يَعْمَلْهَا كَتَبَهَا اللَّهُ عِنْدَهُ حَسَنَةً كَامِلَةً وَإِنْ هَمَّ بِهَا فَعَمِلَهَا كَتَبَهَا اللَّهُ سَيِّئَةً وَاحِدَةً",
      id: "Allah mencatat kebaikan dan keburukan, lalu menjelaskannya. Siapa berniat baik lalu tidak mengerjakannya, Allah mencatatnya sebagai satu kebaikan penuh. Jika ia mengerjakannya, Allah mencatat sepuluh hingga tujuh ratus kali lipat, bahkan lebih. Siapa berniat buruk lalu tidak mengerjakannya, Allah mencatatnya sebagai satu kebaikan penuh. Jika ia mengerjakannya, Allah mencatat satu keburukan.",
      tr: "Allah iyilikleri ve kötülükleri yazmış, sonra bunu açıklamıştır. Kim bir iyiliğe niyet eder de yapmazsa Allah onu tam bir iyilik yazar. Yaparsa on kattan yedi yüze, hatta daha fazlasına kadar yazar. Kim bir kötülüğe niyet eder de yapmazsa Allah onu tam bir iyilik yazar. Yaparsa bir tek kötülük yazar.",
      ur: "اللہ نے نیکیاں اور برائیاں لکھ دیں، پھر یہ واضح فرمایا۔ جو نیکی کا ارادہ کرے اور نہ کرے، اللہ اس کے لیے پوری نیکی لکھتا ہے۔ اگر کر لے تو دس سے سات سو گنا اور اس سے بھی زیادہ لکھتا ہے۔ جو برائی کا ارادہ کرے اور نہ کرے، اللہ اس کے لیے پوری نیکی لکھتا ہے۔ اگر کر لے تو ایک برائی لکھتا ہے۔",
    },
  },
  {
    q: {
      text: "В теле есть кусочек плоти. Если он исправен, исправно всё тело. Если он испорчен, испорчено всё тело. Это — сердце.",
      arabic: "أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ أَلَا وَهِيَ الْقَلْبُ",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "In the body there is a piece of flesh. If it is sound, the whole body is sound. If it is corrupt, the whole body is corrupt. It is the heart.",
      ar: "أَلَا وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ أَلَا وَهِيَ الْقَلْبُ",
      id: "Ketahuilah, di dalam tubuh ada segumpal daging. Jika ia baik, baiklah seluruh tubuh. Jika ia rusak, rusaklah seluruh tubuh. Itulah hati.",
      tr: "Dikkat edin, bedende bir et parçası vardır. O düzelirse bütün beden düzelir. O bozulursa bütün beden bozulur. İşte o kalptir.",
      ur: "خبردار، جسم میں گوشت کا ایک ٹکڑا ہے۔ اگر وہ درست رہے تو سارا جسم درست رہتا ہے، اور اگر وہ بگڑ جائے تو سارا جسم بگڑ جاتا ہے۔ وہ دل ہے۔",
    },
  },
  {
    q: {
      text: "Аллах1 помогает рабу, пока раб помогает своему брату.",
      arabic: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ",
      source: "Муслим",
    },
    tr: {
      en: "Allah helps the servant as long as the servant helps his brother.",
      ar: "وَاللَّهُ فِي عَوْنِ الْعَبْدِ مَا كَانَ الْعَبْدُ فِي عَوْنِ أَخِيهِ",
      id: "Allah menolong hamba selama hamba itu menolong saudaranya.",
      tr: "Kul kardeşine yardım ettiği sürece Allah da kulun yardımındadır.",
      ur: "اللہ بندے کی مدد میں رہتا ہے جب تک بندہ اپنے بھائی کی مدد میں رہے۔",
    },
  },
  {
    q: {
      text: "Милостивый милует милостивых. Будьте милостивы к тем, кто на земле, и вас помилует Тот, Кто на небесах.",
      arabic: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
      source: "Абу Давуд, ат-Тирмизи",
    },
    tr: {
      en: "The Merciful shows mercy to those who are merciful. Be merciful to those on the earth, and the One in the heaven will show mercy to you.",
      ar: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ ارْحَمُوا مَنْ فِي الْأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
      id: "Orang-orang yang penyayang akan disayangi oleh Yang Maha Penyayang. Sayangilah siapa yang ada di bumi, niscaya yang di langit akan menyayangi kalian.",
      tr: "Merhametli olanlara Rahman merhamet eder. Yerdekilere merhamet edin ki göktekiler de size merhamet etsin.",
      ur: "رحم کرنے والوں پر رحمان رحم کرتا ہے۔ زمین والوں پر رحم کرو، آسمان والا تم پر رحم کرے گا۔",
    },
  },
  {
    q: {
      text: "Не будет помилован тот, кто не милует людей.",
      arabic: "مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "Whoever does not show mercy to people, Allah will not show mercy to him.",
      ar: "مَنْ لَا يَرْحَمِ النَّاسَ لَا يَرْحَمْهُ اللَّهُ",
      id: "Siapa yang tidak menyayangi manusia, Allah tidak akan menyayanginya.",
      tr: "İnsanlara merhamet etmeyene Allah da merhamet etmez.",
      ur: "جو لوگوں پر رحم نہیں کرتا، اللہ اس پر رحم نہیں کرتا۔",
    },
  },
  {
    q: {
      text: "Ближе всего раб бывает к своему Господу, когда он в земном поклоне. Так усердствуйте в мольбе.",
      arabic: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ",
      source: "Муслим",
    },
    tr: {
      en: "The closest a servant is to his Lord is when he is prostrating, so increase your supplication.",
      ar: "أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ فَأَكْثِرُوا الدُّعَاءَ",
      id: "Sedekat-dekatnya seorang hamba dengan Tuhannya ialah ketika ia sujud. Maka perbanyaklah doa.",
      tr: "Kulun Rabbine en yakın olduğu an secde hâlidir. O hâlde duayı çok edin.",
      ur: "بندہ اپنے رب کے سب سے قریب اس وقت ہوتا ہے جب سجدے میں ہو، پس دعا زیادہ کیا کرو۔",
    },
  },
  {
    q: {
      text: "Две милости, в которых обмануты многие люди: здоровье и свободное время.",
      arabic: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ",
      source: "аль-Бухари",
    },
    tr: {
      en: "Two blessings in which many people are deceived: health and free time.",
      ar: "نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ الصِّحَّةُ وَالْفَرَاغُ",
      id: "Dua nikmat yang banyak manusia tertipu padanya: kesehatan dan waktu luang.",
      tr: "İki nimet vardır ki insanların çoğu onlar hakkında aldanmıştır: sağlık ve boş vakit.",
      ur: "دو نعمتیں ایسی ہیں جن میں بہت سے لوگ دھوکا کھا جاتے ہیں: تندرستی اور فراغت۔",
    },
  },
  {
    q: {
      text: "Семь человек Аллах1 укроет в Своей тени в день, когда не будет тени, кроме Его тени: справедливый правитель; юноша, выросший в поклонении Аллах1у; человек, чьё сердце привязано к мечетям; двое, которые полюбили друг друга ради Аллах1а, встретились ради Него и разошлись ради Него; человек, которого позвала женщина знатная и красивая, а он сказал: «Я боюсь Аллах1а»; тот, кто дал милостыню так, что левая рука не знала, что потратила правая; и тот, кто помянул Аллах1а наедине, и потекли его слёзы.",
      arabic: "سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّهُ الْإِمَامُ الْعَادِلُ وَشَابٌّ نَشَأَ فِي عِبَادَةِ اللَّهِ وَرَجُلٌ قَلْبُهُ مُعَلَّقٌ فِي الْمَسَاجِدِ وَرَجُلَانِ تَحَابَّا فِي اللَّهِ اجْتَمَعَا عَلَيْهِ وَتَفَرَّقَا عَلَيْهِ وَرَجُلٌ دَعَتْهُ امْرَأَةٌ ذَاتُ مَنْصِبٍ وَجَمَالٍ فَقَالَ إِنِّي أَخَافُ اللَّهَ وَرَجُلٌ تَصَدَّقَ بِصَدَقَةٍ فَأَخْفَاهَا حَتَّى لَا تَعْلَمَ شِمَالُهُ مَا تُنْفِقُ يَمِينُهُ وَرَجُلٌ ذَكَرَ اللَّهَ خَالِيًا فَفَاضَتْ عَيْنَاهُ",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "Seven people Allah will shade in His shade on the day when there is no shade but His: a just ruler; a young man who grew up worshipping Allah; a man whose heart is attached to the mosques; two people who loved each other for Allah, met for His sake and parted for His sake; a man whom a woman of rank and beauty invited, and he said, “I fear Allah”; a man who gave charity so secretly that his left hand did not know what his right hand spent; and a man who remembered Allah alone and his eyes overflowed.",
      ar: "سَبْعَةٌ يُظِلُّهُمُ اللَّهُ فِي ظِلِّهِ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّهُ",
      id: "Tujuh orang yang Allah naungi dalam naungan-Nya pada hari ketika tidak ada naungan selain naungan-Nya: pemimpin yang adil; pemuda yang tumbuh dalam ibadah kepada Allah; orang yang hatinya terpaut pada masjid; dua orang yang saling mencintai karena Allah, bertemu dan berpisah karena-Nya; laki-laki yang diajak oleh wanita berkedudukan dan cantik lalu ia berkata, “Aku takut kepada Allah”; orang yang bersedekah hingga tangan kirinya tidak mengetahui apa yang diinfakkan tangan kanannya; dan orang yang mengingat Allah sendirian lalu air matanya mengalir.",
      tr: "Allah’ın, gölgesinden başka gölge olmayan günde gölgesinde gölgelendireceği yedi kişi: adil yönetici; Allah’a ibadet içinde yetişen genç; kalbi mescitlere bağlı kimse; Allah için sevişen, O’nun için bir araya gelen ve O’nun için ayrılan iki kişi; mevki ve güzellik sahibi bir kadının çağırdığı ve “Ben Allah’tan korkarım” diyen adam; sağ elinin verdiğini sol eli bilmeyecek kadar gizli sadaka veren; ve yalnızken Allah’ı anıp gözleri dolan kimse.",
      ur: "سات آدمی ایسے ہیں جنہیں اللہ اس دن اپنے سایے میں رکھے گا جب اس کے سایے کے سوا کوئی سایہ نہ ہوگا: عادل حاکم؛ وہ نوجوان جو اللہ کی عبادت میں پلا؛ وہ شخص جس کا دل مسجدوں سے لگا ہو؛ دو شخص جو اللہ کے لیے محبت کریں، اسی کے لیے ملیں اور اسی کے لیے جدا ہوں؛ وہ مرد جسے عزت اور خوبصورتی والی عورت بلائے اور وہ کہے: میں اللہ سے ڈرتا ہوں؛ وہ جو صدقہ ایسے چھپا کر دے کہ بایاں ہاتھ نہ جانے کہ دائیں نے کیا خرچ کیا؛ اور وہ جو تنہائی میں اللہ کو یاد کرے اور اس کی آنکھیں بہہ پڑیں۔",
    },
  },
  {
    q: {
      text: "Кто после каждого намаза тридцать три раза скажет «Субхьаналлах1», тридцать три раза «Альхьамдулиллах1» и тридцать три раза «Аллах1у Акбар», а сотым словом скажет: «Ля иляха илляллах1у вахьдаху ля шарика ляху, ляхуль-мульку ва ляхуль-хьамду, ва х1ува аля кулли шайин къадир», тому простятся грехи, даже если их будет подобно пене морской.",
      arabic: "مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ وَحَمِدَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ وَكَبَّرَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ فَتِلْكَ تِسْعَةٌ وَتِسْعُونَ وَقَالَ تَمَامَ الْمِائَةِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
      source: "Муслим",
    },
    tr: {
      en: "Whoever says “Glory be to Allah” thirty-three times, “Praise be to Allah” thirty-three times, and “Allah is the Greatest” thirty-three times after every prayer, and completes the hundred with “None has the right to be worshipped but Allah alone, with no partner. His is the dominion and praise, and He is over all things competent,” his sins will be forgiven even if they are like the foam of the sea.",
      ar: "مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ وَحَمِدَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ وَكَبَّرَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ ثُمَّ قَالَ تَمَامَ الْمِائَةِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
      id: "Siapa yang setelah setiap salat mengucapkan Subhanallah tiga puluh tiga kali, Alhamdulillah tiga puluh tiga kali, dan Allahu Akbar tiga puluh tiga kali, lalu menyempurnakan yang keseratus dengan “Tidak ada tuhan yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu,” maka dosa-dosanya diampuni walaupun sebanyak buih laut.",
      tr: "Kim her namazın ardından otuz üç kez “Sübhanallah”, otuz üç kez “Elhamdülillah”, otuz üç kez “Allahu ekber” der ve yüzü “Allah’tan başka ilah yoktur, O tektir, ortağı yoktur. Mülk O’nundur, hamd O’nadır ve O her şeye kadirdir” diyerek tamamlarsa, günahları deniz köpüğü kadar olsa da bağışlanır.",
      ur: "جو ہر نماز کے بعد تینتیس بار سبحان اللہ، تینتیس بار الحمد للہ اور تینتیس بار اللہ اکبر کہے، پھر سوواں کلمہ یہ کہے: اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے، اسی کی تعریف ہے، اور وہ ہر چیز پر قادر ہے، تو اس کے گناہ معاف کر دیے جائیں گے خواہ سمندر کے جھاگ کے برابر ہوں۔",
    },
  },
  {
    q: {
      text: "Кто прочитает аят аль-Курси после каждого обязательного намаза, того не отделяет от Рая ничего, кроме смерти.",
      arabic: "مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ",
      source: "ан-Насаи",
    },
    tr: {
      en: "Whoever recites the Verse of the Throne after every prescribed prayer, nothing will keep him from entering Paradise except death.",
      ar: "مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ",
      id: "Siapa yang membaca Ayat Kursi setelah setiap salat wajib, tidak ada yang menghalanginya masuk surga selain kematian.",
      tr: "Kim her farz namazın ardından Ayetelkürsî’yi okursa, onu cennete girmekten ancak ölüm alıkoyar.",
      ur: "جو ہر فرض نماز کے بعد آیت الکرسی پڑھے، اسے جنت میں داخل ہونے سے صرف موت روکے گی۔",
    },
  },
  {
    q: {
      text: "Пусть никто из вас не желает себе смерти из-за беды, которая его постигла. Если уж ему не избежать этого, пусть скажет: «О Аллах1, дай мне жизнь, пока жизнь для меня благо, и упокой меня, когда смерть для меня благо».",
      arabic: "لَا يَتَمَنَّيَنَّ أَحَدُكُمُ الْمَوْتَ لِضُرٍّ أَصَابَهُ فَإِنْ كَانَ لَا بُدَّ فَاعِلًا فَلْيَقُلِ اللَّهُمَّ أَحْيِنِي مَا كَانَتِ الْحَيَاةُ خَيْرًا لِي وَتَوَفَّنِي إِذَا كَانَتِ الْوَفَاةُ خَيْرًا لِي",
      source: "аль-Бухари, Муслим",
    },
    tr: {
      en: "None of you should wish for death because of a harm that has struck him. If he must say something, let him say: O Allah, keep me alive as long as life is good for me, and take me when death is good for me.",
      ar: "لَا يَتَمَنَّيَنَّ أَحَدُكُمُ الْمَوْتَ لِضُرٍّ أَصَابَهُ فَإِنْ كَانَ لَا بُدَّ فَاعِلًا فَلْيَقُلِ اللَّهُمَّ أَحْيِنِي مَا كَانَتِ الْحَيَاةُ خَيْرًا لِي وَتَوَفَّنِي إِذَا كَانَتِ الْوَفَاةُ خَيْرًا لِي",
      id: "Janganlah salah seorang dari kalian mengharapkan kematian karena musibah yang menimpanya. Jika ia harus mengucapkan sesuatu, hendaklah ia berkata: Ya Allah, hidupkanlah aku selama hidup itu lebih baik bagiku, dan wafatkanlah aku apabila kematian lebih baik bagiku.",
      tr: "Sizden hiç kimse başına gelen bir sıkıntı yüzünden ölümü temenni etmesin. Mutlaka söyleyecekse şöyle desin: Allah’ım, hayat benim için hayırlı olduğu sürece beni yaşat, ölüm benim için hayırlı olduğunda canımı al.",
      ur: "تم میں سے کوئی کسی تکلیف کی وجہ سے موت کی خواہش نہ کرے۔ اگر اسے کچھ کہنا ہی ہو تو کہے: اے اللہ، مجھے زندگی دے جب تک زندگی میرے لیے بہتر ہو، اور وفات دے جب وفات میرے لیے بہتر ہو۔",
    },
  },
];

export const EXTRA_QUOTES: ExtraQuote[] = ROWS.map((row) => row.q);

export const EXTRA_TR: Record<string, FixedQuote> = Object.fromEntries(ROWS.map((row) => [row.q.text, row.tr]));
