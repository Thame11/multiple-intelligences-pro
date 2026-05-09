# نظام اختبار الذكاءات المتعددة - نسخة احترافية

مشروع Next.js كامل لقياس الذكاءات المتعددة لدى الطلاب،مع واجهة طالب حديثة،صفحة نتائج،لوحة تحكم للإدارة،تقارير،وتصدير Excel.

## المزايا

- واجهة اختبار عربية RTL حديثة.
- 40 سؤالًا موزعة على 8 ذكاءات.
- صفحة نتائج تعرض:
  - أعلى 3 ذكاءات.
  - الترتيب الكامل.
  - توصيف كل ذكاء.
  - أنشطة تعليمية مقترحة.
- لوحة تحكم Admin.
- تسجيل دخول للإدارة بجلسة Cookie آمنة HttpOnly.
- صفحة تقارير:
  - عدد الطلاب.
  - عدد الاختبارات.
  - أكثر ذكاء انتشارًا.
  - متوسط نسب الذكاءات.
- تصدير Excel بصفحتين: نتائج الطلاب + ملخص.
- قاعدة بيانات SQLite3 محليًا عبر Prisma.

## تشغيل المشروع محليًا

### 1) تثبيت الحزم

```bash
npm install
```

### 2) إنشاء ملف البيئة

انسخ الملف:

```bash
cp .env.example .env
```

ثم عدّل القيم داخل `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ChangeMe123!"
ADMIN_SESSION_SECRET="ضع-هنا-نص-عشوائي-طويل-لا-يقل-عن-32-حرف"
```

### 3) إنشاء قاعدة البيانات SQLite

```bash
npm run db:push
```

### 4) إنشاء حساب الإدارة وبيانات تجريبية

```bash
npm run db:seed
```

### 5) تشغيل المشروع

```bash
npm run dev
```

افتح:

```text
http://localhost:3000
```

لوحة الإدارة:

```text
http://localhost:3000/admin/login
```

## النشر على Vercel

> مهم: SQLite3 كملف محلي مناسب للتطوير المحلي،لكن بيئة Vercel Serverless لا تحفظ الكتابة على ملف SQLite بشكل دائم. للإنتاج الحقيقي مع Vercel استخدم قاعدة SQLite-compatible مثل Turso/libSQL أو استخدم Postgres. الكود الحالي مضبوط محليًا على SQLite3 عبر Prisma،ويمكن تطويره لاحقًا إلى Turso مع الحفاظ على منطق SQL.

### إعدادات Vercel المقترحة

Build Command:

```bash
npm run build
```

Environment Variables:

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="كلمة-مرور-قوية"
ADMIN_SESSION_SECRET="نص-عشوائي-طويل-جدا"
```

للإنتاج الدائم لا تجعل `DATABASE_URL` ملف SQLite محلي داخل Vercel،بل حوّله إلى مزود SQLite-compatible مناسب مثل Turso/libSQL.

## بنية المشروع

```text
app/
  page.tsx                     واجهة الطالب
  results/[id]/page.tsx        صفحة النتائج
  admin/page.tsx               لوحة التحكم
  admin/login/page.tsx         تسجيل دخول الإدارة
  admin/reports/page.tsx       التقارير
  admin/results/page.tsx       سجل النتائج
  api/results/route.ts         حفظ الاختبار
  api/admin/*                  تسجيل الدخول،الإحصاءات،التصدير
components/                    مكونات الواجهة
lib/                           منطق الأسئلة،التصحيح،المصادقة،قاعدة البيانات
prisma/schema.prisma           مخطط SQLite
scripts/seed.ts                إنشاء مستخدم الإدارة وبيانات تجريبية
```

## تغيير أسئلة الاختبار

الأسئلة موجودة في:

```text
lib/questions.ts
```

كل سؤال يحتوي على:

```ts
{ id: 1, type: "linguistic", text: "..." }
```

أنواع الذكاءات موجودة في:

```text
lib/intelligences.ts
```
