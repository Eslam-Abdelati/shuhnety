# 🚚 شحنتي - Shahnti Logistics Platform

منصة لوجستية ذكية ومتكاملة لإدارة الشحنات والخدمات اللوجستية في مصر، مع تحصيل الرسوم إلكترونياً وتتبع جميع الشحنات لحظياً.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.3.1-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.18-cyan)

---

## 📋 نظرة عامة

**شحنتي** هي منصة SaaS حديثة تربط بين:
- 🛒 **العميل/التاجر** - لشحن بضائعهم بأمان
- 🚛 **السائقين** - للحصول على رحلات مضمونة
- 🏢 **شركات الشحن** - لإدارة الأساطيل
- 🏛️ **المحافظات** - لتحصيل الرسوم السيادية
- 👨‍💼 **المسؤولين** - للرقابة وحل النزاعات

---

## 🎨 التصميم والهوية البصرية

### الألوان الأساسية
```css
--color-brand-primary: #eb6a1d;      /* برتقالي حيوي */
--color-brand-secondary: #14532d;    /* أخضر داكن */
--color-brand-background: #fbfbf4;   /* كريمي فاتح */
--color-brand-surface: #ffffff;      /* أبيض نقي */
```

### الخط المستخدم
- **Cairo** - خط عربي احترافي من Google Fonts
- الأوزان: 400, 500, 600, 700, 800, 900

### المبادئ التصميمية
- ✨ **Premium SaaS Aesthetics** - تصميم فخم وعصري
- 🎯 **Mobile-First** - يبدأ من الهاتف ثم الشاشات الأكبر
- 🌙 **Dark/Light Mode** - دعم الوضع الليلي
- 🔄 **RTL Support** - دعم كامل للغة العربية من اليمين لليسار
- 🎭 **Micro-animations** - حركات ناعمة لتجربة مستخدم ممتعة

---

## 🏗️ البنية التقنية

### التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| React | 18.2.0 | مكتبة واجهة المستخدم |
| Vite | 7.3.1 | أداة البناء السريعة |
| Tailwind CSS | 4.1.18 | إطار عمل CSS |
| React Router | 7.13.0 | التنقل بين الصفحات |
| Zustand | 5.0.11 | إدارة الحالة |
| Lucide React | 0.564.0 | الأيقونات |
| Framer Motion | 12.34.0 | الحركات والانتقالات |

### هيكل المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   └── ui/             # مكونات واجهة المستخدم الأساسية
│       ├── Button.jsx
│       ├── Card.jsx
│       └── Input.jsx
├── features/           # الميزات حسب الدور
│   ├── landing/        # صفحة الهبوط
│   ├── auth/           # التسجيل والدخول
│   ├── customer/       # ميزات العميل/التاجر
│   ├── driver/         # ميزات السائق
│   ├── company/        # ميزات شركة الشحن
│   ├── governorate/    # ميزات المحافظة
│   ├── admin/          # ميزات المسؤول
│   ├── shipments/      # إدارة الشحنات
│   ├── bidding/        # نظام المزايدة
│   ├── tracking/       # تتبع الشحنات
│   ├── alerts/         # تنبيهات الطريق
│   └── fleet/          # إدارة الأسطول
├── layouts/            # التخطيطات الرئيسية
│   ├── AuthLayout.jsx
│   ├── DashboardLayout.jsx
│   ├── Sidebar.jsx
│   └── Topbar.jsx
├── routes/             # إدارة المسارات
│   └── ProtectedRoute.jsx
├── store/              # إدارة الحالة (Zustand)
│   ├── useAuthStore.js
│   └── useThemeStore.js
├── utils/              # الأدوات المساعدة
│   └── cn.js
├── lib/                # المكتبات والخدمات
│   └── api.js
├── App.jsx             # المكون الرئيسي
├── main.jsx            # نقطة الدخول
└── index.css           # الأنماط العامة
```

---

## 🚀 البدء السريع

### المتطلبات الأساسية
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn

### التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/shahnti.git
cd shahnti

# 2. تثبيت التبعيات
npm install

# 3. تشغيل المشروع في وضع التطوير
npm run dev

# 4. فتح المتصفح على
# http://localhost:5173
```

### الأوامر المتاحة

```bash
npm run dev      # تشغيل خادم التطوير
npm run build    # بناء المشروع للإنتاج
npm run preview  # معاينة البناء النهائي
```

---

## 👥 الأدوار والصلاحيات

### 1. العميل/التاجر (Customer)
- ✅ إنشاء شحنات جديدة
- ✅ استقبال عروض السائقين
- ✅ تتبع الشحنات لحظياً
- ✅ إدارة الشحنات النشطة

### 2. السائق (Driver)
- ✅ تصفح الشحنات المتاحة
- ✅ تقديم عروض أسعار
- ✅ إدارة الرحلات النشطة
- ✅ الإبلاغ عن تنبيهات الطريق
- ✅ متابعة الأرباح

### 3. شركة الشحن (Company)
- ✅ إدارة الأسطول
- ✅ إدارة السائقين
- ✅ العقود الرقمية
- ✅ التقارير والإحصائيات

### 4. المحافظة (Governorate)
- ✅ مراقبة الحركة اللوجستية
- ✅ إدارة الرسوم السيادية
- ✅ التحقق من الإيصالات

### 5. المسؤول (Admin)
- ✅ إدارة المستخدمين
- ✅ حل النزاعات
- ✅ إدارة العقود الرقمية
- ✅ الإحصائيات الشاملة

---

## 🎯 الميزات الرئيسية

### 📦 إدارة الشحنات
- نظام متعدد الخطوات لإنشاء الشحنات
- تحديد نوع المنتج والوزن والأبعاد
- اختيار نقاط الانطلاق والوصول على الخريطة
- حساب تلقائي للرسوم والتأمين

### 💰 نظام المزايدة
- عروض أسعار تنافسية من السائقين
- تصفية العروض حسب السعر والتقييم
- قبول العروض بضغطة زر
- نظام تقييم شفاف

### 📍 التتبع المباشر
- خريطة تفاعلية لموقع الشحنة
- تحديثات لحظية كل 5 ثوانٍ
- خط زمني تفصيلي للرحلة
- معلومات السائق والمركبة

### 🚨 تنبيهات الطريق
- الإبلاغ عن الحوادث والزحام
- مستويات خطورة مختلفة
- إشعارات فورية للسائقين
- خريطة تفاعلية للتنبيهات

### 📄 العقود الرقمية
- توثيق قانوني للشحنات
- توقيعات إلكترونية
- أرشفة تلقائية
- تصدير PDF

---

## 🎨 مكونات واجهة المستخدم

### Button (الأزرار)
```jsx
<Button variant="primary" size="lg">
  إنشاء شحنة جديدة
</Button>
```

**الأنواع المتاحة:**
- `primary` - برتقالي (الإجراء الأساسي)
- `secondary` - أخضر (إجراء ثانوي)
- `outline` - حدود فقط
- `ghost` - شفاف
- `danger` - أحمر (حذف)

**الأحجام:**
- `sm` - صغير
- `md` - متوسط (افتراضي)
- `lg` - كبير

### Card (البطاقات)
```jsx
<Card>
  <CardHeader title="العنوان" subtitle="الوصف" />
  <CardContent>
    المحتوى هنا
  </CardContent>
</Card>
```

### Input (المدخلات)
```jsx
<Input 
  label="البريد الإلكتروني"
  type="email"
  icon={Mail}
  placeholder="example@mail.com"
/>
```

---

## 🔐 نظام المصادقة

### تسجيل الدخول
```javascript
// استخدام Zustand Store
const { login } = useAuthStore()

login(userData, role)
// role: 'customer' | 'driver' | 'company' | 'governorate' | 'admin'
```

### الحماية بالمسارات
```jsx
<ProtectedRoute allowedRoles={['customer']}>
  <CustomerDashboard />
</ProtectedRoute>
```

---

## 📱 التجاوب مع الشاشات

المشروع مصمم ليعمل بشكل مثالي على:
- 📱 الهواتف المحمولة (320px+)
- 📱 الأجهزة اللوحية (768px+)
- 💻 أجهزة الكمبيوتر (1024px+)
- 🖥️ الشاشات الكبيرة (1920px+)

---

## 🌐 الدعم متعدد اللغات

حالياً:
- ✅ العربية (RTL) - اللغة الأساسية

مخطط مستقبلاً:
- ⏳ الإنجليزية (LTR)

---

## 🔄 إدارة الحالة (State Management)

### Auth Store
```javascript
const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  login: (userData, role) => set({ ... }),
  logout: () => set({ ... }),
}))
```

### Theme Store
```javascript
const useThemeStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
}))
```

---

## 🎭 الحركات والانتقالات

استخدام Framer Motion للحركات الناعمة:

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  المحتوى
</motion.div>
```

---

## 📊 التحليلات والإحصائيات

### لوحات التحكم تعرض:
- إجمالي الشحنات
- الشحنات النشطة
- الشحنات المكتملة
- معدل النجاح
- الأرباح (للسائقين والشركات)
- الرسوم المحصلة (للمحافظات)

---

## 🛠️ التطوير المستقبلي

### المخطط له
- [ ] دمج خرائط Google Maps
- [ ] نظام الإشعارات الفورية (WebSocket)
- [ ] تطبيق الهاتف المحمول (React Native)
- [ ] نظام الدفع الإلكتروني
- [ ] تقارير PDF تلقائية
- [ ] لوحة تحكم تحليلية متقدمة
- [ ] دعم اللغة الإنجليزية

---

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👨‍💻 المطور

تم تطوير هذا المشروع بواسطة فريق شحنتي

---

## 📞 التواصل

- 🌐 الموقع: [shahnti.com](https://shahnti.com)
- 📧 البريد: info@shahnti.com
- 📱 الهاتف: +20 XXX XXX XXXX

---

## 🙏 شكر وتقدير

- [React](https://react.dev/) - مكتبة واجهة المستخدم
- [Vite](https://vitejs.dev/) - أداة البناء
- [Tailwind CSS](https://tailwindcss.com/) - إطار عمل CSS
- [Lucide Icons](https://lucide.dev/) - الأيقونات
- [Google Fonts](https://fonts.google.com/) - خط Cairo

---

<div align="center">
  <strong>صُنع بـ ❤️ في مصر</strong>
  <br>
  <sub>© 2026 شحنتي - جميع الحقوق محفوظة</sub>
</div>
