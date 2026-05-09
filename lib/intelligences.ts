export const intelligenceTypes = [
  "linguistic",
  "logical",
  "spatial",
  "bodily",
  "musical",
  "interpersonal",
  "intrapersonal",
  "naturalistic",
] as const;

export type IntelligenceType = (typeof intelligenceTypes)[number];

export type IntelligenceInfo = {
  key: IntelligenceType;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  learningStyle: string;
  suggestedActivities: string[];
  colorClass: string;
};

export const intelligences: Record<IntelligenceType, IntelligenceInfo> = {
  linguistic: {
    key: "linguistic",
    name: "الذكاء اللغوي",
    shortName: "لغوي",
    icon: "📚",
    description:
      "يميل الطالب هنا إلى فهم الأفكار عبر القراءة والكتابة والحديث،ويستمتع بالتعبير اللفظي وصياغة القصص والخطب والنقاشات.",
    learningStyle:
      "يتعلم أفضل عندما يقرأ،يلخص،يشرح بصوته،ويحوّل المعلومات إلى كلمات واضحة.",
    suggestedActivities: ["كتابة قصة قصيرة", "تقديم فقرة إلقاء", "تلخيص درس في بطاقة", "مناظرة قصيرة"],
    colorClass: "from-emerald-500 to-teal-600",
  },
  logical: {
    key: "logical",
    name: "الذكاء المنطقي الرياضي",
    shortName: "منطقي",
    icon: "🧠",
    description:
      "يظهر في حب التحليل،حل المشكلات،اكتشاف الأنماط،التعامل مع الأرقام،وترتيب الأفكار وفق أسباب ونتائج.",
    learningStyle:
      "يتعلم أفضل عبر التجارب،المسائل،الجداول،المقارنات،والأسئلة التي تتطلب استنتاجًا.",
    suggestedActivities: ["حل ألغاز منطقية", "تصميم جدول مقارنة", "تجربة علمية بسيطة", "تحليل أسباب مشكلة"],
    colorClass: "from-blue-500 to-indigo-600",
  },
  spatial: {
    key: "spatial",
    name: "الذكاء البصري المكاني",
    shortName: "بصري",
    icon: "🎨",
    description:
      "يرتبط بتخيل الصور والأشكال والخرائط والتصاميم،والقدرة على فهم العلاقات المكانية بصريًا.",
    learningStyle:
      "يتعلم أفضل عبر الصور،الرسوم،الخرائط الذهنية،النماذج،والألوان المنظمة.",
    suggestedActivities: ["رسم خريطة ذهنية", "تصميم ملصق", "تركيب نموذج", "شرح فكرة بالرسم"],
    colorClass: "from-purple-500 to-fuchsia-600",
  },
  bodily: {
    key: "bodily",
    name: "الذكاء الجسدي الحركي",
    shortName: "حركي",
    icon: "🏃",
    description:
      "يظهر عندما يستخدم الطالب الحركة واليدين والتطبيق العملي لفهم الأفكار وتنفيذ المهام.",
    learningStyle:
      "يتعلم أفضل عندما يشارك في نشاط عملي،تمثيل أدوار،تجربة ملموسة،أو حركة هادفة.",
    suggestedActivities: ["تمثيل مفهوم دراسي", "نشاط تركيب يدوي", "تجربة تطبيقية", "لعبة تعليمية حركية"],
    colorClass: "from-orange-500 to-red-500",
  },
  musical: {
    key: "musical",
    name: "الذكاء الموسيقي الإيقاعي",
    shortName: "إيقاعي",
    icon: "🎧",
    description:
      "يرتبط بالحس الإيقاعي،تمييز الأصوات،تذكر المعلومات عبر النغمات أو الإيقاع،والانتباه للتناسق الصوتي.",
    learningStyle:
      "يتعلم أفضل عندما ترتبط المعلومة بإيقاع،ترديد،أنشودة تعليمية،أو نمط صوتي متكرر.",
    suggestedActivities: ["تلحين قاعدة قصيرة", "ترديد مفاهيم بإيقاع", "تمييز أصوات", "كتابة نشيد تعليمي"],
    colorClass: "from-pink-500 to-rose-600",
  },
  interpersonal: {
    key: "interpersonal",
    name: "الذكاء الاجتماعي",
    shortName: "اجتماعي",
    icon: "🤝",
    description:
      "يعبر عن قدرة الطالب على فهم الآخرين،التعاون،القيادة،بناء العلاقات،والمشاركة الفعالة داخل الفريق.",
    learningStyle:
      "يتعلم أفضل ضمن مجموعات،حوار،أدوار تعاونية،مشروعات مشتركة،وتغذية راجعة من الزملاء.",
    suggestedActivities: ["قيادة فريق صغير", "مشروع جماعي", "مقابلة زميل", "حل مشكلة جماعية"],
    colorClass: "from-cyan-500 to-sky-600",
  },
  intrapersonal: {
    key: "intrapersonal",
    name: "الذكاء الذاتي",
    shortName: "ذاتي",
    icon: "🪞",
    description:
      "يرتبط بالوعي بالذات،فهم المشاعر والدوافع،تحديد الأهداف،وتقييم نقاط القوة والاحتياج.",
    learningStyle:
      "يتعلم أفضل عندما يضع هدفًا شخصيًا،يفكر بهدوء،يكتب تأملاته،ويقيس تقدمه بنفسه.",
    suggestedActivities: ["كتابة خطة شخصية", "دفتر تأمل", "بطاقة أهداف", "تقييم ذاتي بعد النشاط"],
    colorClass: "from-amber-500 to-yellow-600",
  },
  naturalistic: {
    key: "naturalistic",
    name: "الذكاء الطبيعي",
    shortName: "طبيعي",
    icon: "🌿",
    description:
      "يعكس حب ملاحظة البيئة والكائنات والظواهر الطبيعية،والقدرة على التصنيف والمقارنة بين عناصر الطبيعة.",
    learningStyle:
      "يتعلم أفضل عبر الملاحظة،التصنيف،الرحلات التعليمية،الأمثلة الواقعية،والربط بالبيئة.",
    suggestedActivities: ["تصنيف عينات", "ملاحظة ظاهرة طبيعية", "تقرير بيئي", "تصميم حديقة مصغرة"],
    colorClass: "from-green-500 to-lime-600",
  },
};

export const orderedIntelligences = intelligenceTypes.map((key) => intelligences[key]);
