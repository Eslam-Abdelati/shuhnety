import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Logo } from "@/components/ui/Logo";
import { SimpleFooter } from "@/components/SimpleFooter";
import { PublicNavbar } from "@/components/PublicNavbar";
import {
  Rocket,
  Star,
  MapPin,
  CheckCircle,
  Banknote,
  PiggyBank,
  UserCheck,
  Navigation,
  ShieldCheck,
  Shield,
  Headphones,
  Clock,
  MousePointer,
  TrendingUp,
  ChevronDown,
} from "lucide-react";

export const LandingPage = () => {
  return (
    <div
      className="landing-page-root min-h-screen bg-lp-background text-on-background selection:bg-lp-primary/20 overflow-x-clip"
      dir="rtl"
    >
      {/* TopNavBar */}
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-lp-on-background">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            alt="Shihneti Hero"
            className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxzCv1pUHGy-vpBAvZ-8zykToIOlJ1ycJFC7uzy8eQ0acfe_zBXZ-pvxxojw5w28-y31XyBS28LuogIEN8EabfwyZ7ZAwC_7Cwu2zPLdOzZLn-wqiDIVzMN9T_qI1eghMzkblrTJmGYVjuDEez6Frqac-VmUeWVuavKmpu2QCU0I9KTqFJRHK2_QZdgRS4vzwXcQsPRrfqdtZX_Td0aBaSZGUjHK_NXFZKH4qEQUMdG2fAznu3CCQ"
          />
          <div className="absolute inset-0 bg-lp-gradient bg-gradient-to-l from-lp-on-background/90 via-lp-on-background/40 to-transparent"></div>
        </div>
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop relative z-10 w-full">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-lp-primary/20 text-lp-primary-fixed px-4 py-1.5 rounded-full font-label-md backdrop-blur-sm">
              <Rocket className="h-4 w-4 text-lp-primary-fixed animate-pulse" />
              مستقبل الشحن في المنطقة
            </div>
            <h1 className="font-display-lg text-lp-display-lg-mobile md:text-lp-display-lg leading-tight text-white font-bold">
              اشحن أي شيء... ودع الكابتن يتنافسون على{" "}
              <span className="text-lp-primary-fixed font-bold">أفضل سعر</span>
            </h1>
            <p className="font-body-lg text-lp-body-lg text-lp-surface-variant/80 max-w-lg leading-relaxed">
              أنشئ شحنتك خلال أقل من دقيقة، واستقبل عروض أسعار من عشرات الكابتن
              ثم اختر العرض الأنسب حسب السعر والتقييم ووقت الوصول.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/register"
                className="bg-lp-primary text-lp-on-primary px-10 py-4 rounded-2xl font-headline-md text-center shadow-xl shadow-lp-primary/20 hover:scale-105 transition-all font-bold"
              >
                ابدأ الآن
              </Link>
              <HashLink
                smooth
                to="#how"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-headline-md text-center hover:bg-white/20 transition-all font-bold"
              >
                كيف تعمل المنصة؟
              </HashLink>
            </div>
            <div className="grid grid-cols-3 gap-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-lp-headline-md font-bold text-lp-primary-fixed">
                  +50k
                </div>
                <div className="text-lp-label-sm text-lp-surface-variant/70">
                  شحنة مكتملة
                </div>
              </div>
              <div>
                <div className="text-lp-headline-md font-bold text-lp-primary-fixed">
                  +10k
                </div>
                <div className="text-lp-label-sm text-lp-surface-variant/70">
                  كابتن معتمد
                </div>
              </div>
              <div>
                <div className="text-lp-headline-md font-bold text-lp-primary-fixed">
                  4.9
                </div>
                <div className="flex items-center text-lp-label-sm text-lp-surface-variant/70 gap-1.5">
                  <span>تقييم العملاء</span>
                  <Star className="h-3.5 w-3.5 fill-lp-primary-fixed text-lp-primary-fixed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Timeline) */}
      <section
        className="py-lp-stack-lg bg-lp-surface-container-lowest"
        id="how"
      >
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop text-center">
          <h2 className="font-display-lg text-lp-display-lg-mobile md:text-lp-headline-md mb-lp-stack-lg text-xl font-bold">
            كيف تبدأ رحلة شحنتك؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-lp-stack-md relative">
            {/* Step 1 */}
            <div className="relative group">
              <div className="w-16 h-16 bg-lp-primary text-lp-on-primary rounded-full flex items-center justify-center mx-auto mb-4 font-headline-md relative z-10 group-hover:scale-110 transition-transform shadow-lg font-bold">
                1
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold">
                أنشئ الشحنة
              </h3>
              <p className="text-lp-label-md text-lp-on-surface-variant font-medium">
                أضف التفاصيل والموقع
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative group">
              <div className="w-16 h-16 bg-lp-primary text-lp-on-primary rounded-full flex items-center justify-center mx-auto mb-4 font-headline-md relative z-10 group-hover:scale-110 transition-transform shadow-lg font-bold">
                2
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold">
                زايد الكابتن
              </h3>
              <p className="text-lp-label-md text-lp-on-surface-variant font-medium">
                تلقى عروض حية وفورية
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative group">
              <div className="w-16 h-16 bg-lp-primary text-lp-on-primary rounded-full flex items-center justify-center mx-auto mb-4 font-headline-md relative z-10 group-hover:scale-110 transition-transform shadow-lg font-bold">
                3
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold">
                قارن العروض
              </h3>
              <p className="text-lp-label-md text-lp-on-surface-variant font-medium">
                السعر، التقييم، الوقت
              </p>
            </div>
            {/* Step 4 */}
            <div className="relative group">
              <div className="w-16 h-16 bg-lp-primary text-lp-on-primary rounded-full flex items-center justify-center mx-auto mb-4 font-headline-md relative z-10 group-hover:scale-110 transition-transform shadow-lg font-bold">
                4
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold">
                اختر الكابتن
              </h3>
              <p className="text-lp-label-md text-lp-on-surface-variant font-medium">
                بضغطة زر واحدة فقط
              </p>
            </div>
            {/* Step 5 */}
            <div className="relative group">
              <div className="w-16 h-16 bg-lp-primary text-lp-on-primary rounded-full flex items-center justify-center mx-auto mb-4 font-headline-md relative z-10 group-hover:scale-110 transition-transform shadow-lg font-bold">
                5
              </div>
              <h3 className="font-headline-md text-lg mb-2 font-bold">
                تتبع الشحنة
              </h3>
              <p className="text-lp-label-md text-lp-on-surface-variant font-medium">
                متابعة حية حتى الوصول
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bidding UI Mockup */}
      <section className="py-lp-stack-lg overflow-hidden bg-lp-background">
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="bg-lp-secondary/10 text-lp-secondary w-fit px-4 py-1 rounded-full font-label-md font-bold">
              نظام المزايدة الذكي
            </div>
            <h2 className="font-display-lg text-lp-display-lg-mobile font-bold">
              القوة في يدك... تحكم في ميزانيتك
            </h2>
            <p className="font-body-lg text-lp-on-surface-variant leading-relaxed">
              لا أسعار ثابتة مفروضة عليك. في شحنتي، يتنافس الكابتن للفوز بطلبك،
              مما يضمن لك الحصول على أقل سعر متاح في السوق مع أعلى جودة خدمة.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-lp-secondary fill-lp-secondary/15" />
                <span className="font-body-md font-medium text-lp-on-surface">
                  شفافية كاملة في الأسعار
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-lp-secondary fill-lp-secondary/15" />
                <span className="font-body-md font-medium text-lp-on-surface">
                  نظام تقييم دقيق لكل كابتن
                </span>
              </li>
            </ul>
          </div>
          {/* Mockup Card */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-lp-outline-variant/30 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline-md text-lg text-lp-on-surface font-bold">
                    نقل أثاث منزلي
                  </h4>
                  <p className="text-lp-label-sm text-lp-on-surface-variant flex items-center gap-1.5 mt-1">
                    <MapPin className="h-4 w-4 text-lp-on-surface-variant" />{" "}
                    الداخلة ← بلاط
                  </p>
                </div>
                <div className="bg-lp-primary/10 text-lp-primary px-3 py-1 rounded-lg text-sm font-bold">
                  بانتظار العروض...
                </div>
              </div>
              <div className="space-y-4">
                {/* Bid 1 */}
                <div className="flex items-center justify-between p-4 bg-lp-surface rounded-xl border border-lp-outline-variant/20 hover:border-lp-primary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt="خلفية كابتن شحنة أحمد"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZoVprdJZ_aQR335_i7cRSWFOUeRKE9dID-h2TEjU5lViS-wyhBmVYiDAlDs5RrGAlzAcE2wXJlAne2GbSR25vjKRQ1RGm4GC4EJXPu_Lv9oI-7vBRtV_7XcRpPkN4SGaa328cbUaEvmUZYQ0RcapN2cQqhzc5_l99hGgotKjKy1nCNnkos3TUAjbJCvOJIvYQ27bl5ptb3tq-YvACB1BX-6kS64L5xRUooBKqNhI1i2udyjvPDCY"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lp-on-surface">
                        أحمد س.
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{" "}
                        4.9 (120 رحلة)
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-display text-lp-primary text-xl font-bold">
                      450 ج
                    </div>
                    <Link
                      to="/register"
                      className="text-xs font-bold text-lp-secondary hover:underline"
                    >
                      اختيار العرض
                    </Link>
                  </div>
                </div>
                {/* Bid 2 */}
                <div className="flex items-center justify-between p-4 bg-lp-surface rounded-xl border border-lp-outline-variant/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200">
                      <img
                        className="w-full h-full rounded-full object-cover"
                        alt="خلفية كابتن شحنة خالد"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqGoH069RarQnwTDzNuXb7mxZTZea_kv5G3oR_DpaqTjuDf74gWPYeY7gObgGcWBGn9STqMeSx1XLtiTdHR-agZNlZSz6-xBVhQ7ob7W3hDBMI3wqLykHfe4mVwpVhbK6TepRhioySQBO_y0lN4-br6LlL3t7xiNY4TuTfS7l_AImPYtCd1sGzMyQUnMjluS36qQqjXkzXUt7gYwaLSSg7VL-fWvLZbV9pT9SYINASXK3s1d0XSfI"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-lp-on-surface">
                        خالد م.
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{" "}
                        4.7 (85 رحلة)
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-display text-lp-primary text-xl font-bold">
                      410 ج
                    </div>
                    <Link
                      to="/register"
                      className="text-xs font-bold text-lp-secondary hover:underline"
                    >
                      اختيار العرض
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-lp-outline-variant/20 flex items-center gap-3 animate-bounce">
              <div className="w-10 h-10 bg-lp-secondary rounded-full flex items-center justify-center text-white">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-lp-on-surface">
                  توفير 30%
                </div>
                <div className="text-[10px] text-lp-on-surface-variant font-medium">
                  عن شركات الشحن التقليدية
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shihneti (Features) */}
      <section
        className="py-lp-stack-lg bg-lp-surface-container-high/30"
        id="why"
      >
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-lp-display-lg-mobile mb-4 text-lp-on-surface text-xl font-bold">
              لماذا يختار الآلاف شحنتي؟
            </h2>
            <p className="text-lp-body-lg text-lp-on-surface-variant max-w-2xl mx-auto">
              نحن لا نقوم فقط بنقل الأشياء، نحن نعيد تعريف تجربة الخدمات
              اللوجستية في المنطقة.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-primary/10 text-lp-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-primary group-hover:text-white transition-colors">
                <PiggyBank className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                وفّر مالك
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                نظام المزايدة يضمن لك الحصول على السعر الأكثر تنافسية في السوق.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-secondary/10 text-lp-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-secondary group-hover:text-white transition-colors">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                اختر الأفضل
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                اطلع على تقييمات الكابتن الحقيقية وصور مركباتهم قبل الموافقة.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-primary/10 text-lp-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-primary group-hover:text-white transition-colors">
                <Navigation className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                تتبع مباشر
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                شاهد موقع شحنتك لحظة بلحظة على الخريطة التفاعلية.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-secondary/10 text-lp-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-secondary group-hover:text-white transition-colors">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                كباتن موثوقون
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                جميع الكباتن خاضعون لعملية فحص وتوثيق صارمة للهوية والمركبة.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-primary/10 text-lp-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-primary group-hover:text-white transition-colors">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                دفع آمن
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                خيارات دفع متعددة وآمنة تحفظ حقك كمرسل وتضمن حق الكابتن.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-lp-outline-variant/20 hover:shadow-xl transition-shadow group">
              <div className="w-14 h-14 bg-lp-secondary/10 text-lp-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-lp-secondary group-hover:text-white transition-colors">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="font-headline-md mb-3 text-lp-on-surface font-bold">
                دعم فني 24/7
              </h3>
              <p className="text-lp-on-surface-variant leading-relaxed">
                فريقنا معك في كل خطوة لضمان وصول شحنتك بأمان واحترافية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-lp-stack-lg bg-lp-background">
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop">
          <h2 className="font-display-lg text-lp-display-lg-mobile text-center mb-16 text-lp-on-surface text-xl font-bold">
            لماذا تختلف شحنتي عن غيرها؟
          </h2>
          <div className="overflow-hidden rounded-2xl border border-lp-outline-variant/30 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-lp-surface-container">
                  <th className="p-6 text-right font-headline-md border-b border-lp-outline-variant/30 text-lp-on-surface">
                    الميزة
                  </th>
                  <th className="p-6 text-center font-headline-md border-b border-lp-outline-variant/30 text-lp-on-surface-variant">
                    الشركات التقليدية
                  </th>
                  <th className="p-6 text-center font-headline-md border-b border-lp-outline-variant/30 text-lp-primary bg-lp-primary/5">
                    منصة شحنتي
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm font-bold">
                <tr>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-lp-on-surface">
                    تسعير الخدمة
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-on-surface-variant">
                    سعر ثابت مرتفع
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-secondary">
                    نظام مزايدة تنافسي
                  </td>
                </tr>
                <tr>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-lp-on-surface">
                    اختيار الكابتن
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-on-surface-variant">
                    غير متاح
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-secondary">
                    حرية اختيار كاملة
                  </td>
                </tr>
                <tr>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-lp-on-surface">
                    المرونة في المواعيد
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-on-surface-variant">
                    محدودة جداً
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-secondary">
                    متاحة على مدار الساعة
                  </td>
                </tr>
                <tr>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-lp-on-surface">
                    نظام التقييم
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-on-surface-variant">
                    داخلي وغير شفاف
                  </td>
                  <td className="p-6 border-b border-lp-outline-variant/20 text-center text-lp-secondary">
                    تقييمات عملاء حقيقية
                  </td>
                </tr>
                <tr>
                  <td className="p-6 text-lp-on-surface">التتبع</td>
                  <td className="p-6 text-center text-lp-on-surface-variant">
                    تحديثات متقطعة
                  </td>
                  <td className="p-6 text-center text-lp-secondary">
                    تتبع حي GPS
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Driver Recruitment */}
      <section
        className="py-lp-stack-lg bg-lp-on-background text-surface-bright relative overflow-hidden"
        id="drivers"
      >
        <div className="absolute inset-0 opacity-10"></div>
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div className="order-2 md:order-1">
            <img
              className="rounded-2xl shadow-2xl w-full h-[450px] object-cover"
              alt="كباتن شريك نقل شحنتي"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAn1AdlhLU87j_ey4fWuEo-Ikos6Ez1tLRqP5jvuNYm1_Y6oXllBmrp2ByFT0o7ku1eLCXU4bizXjyDHDO7WeFR8TicydWWoXN1HCGXExzJfiIVjeDnxynP3K1gQl6t7KgJkiaBYljXfsztLPdAVG146yzBPPpO6lBV6bXWlSDsopHxkaADT0mKLHXIUNGNUZrhwINvo92f8n_dKUfJ75_CaHYr-9CuBdfqrZ7l7xRY17q569yIHaA"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8">
            <h2 className="font-display-lg text-lp-display-lg-mobile md:text-lp-display-lg text-white font-bold">
              حول مركبتك إلى{" "}
              <span className="text-lp-primary font-bold">مصدر دخل</span> حقيقي
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-lp-primary rounded-full flex shrink-0 items-center justify-center text-lp-secondary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-headline-md text-lg mb-1 text-white font-bold">
                    اعمل في الوقت الذي يناسبك
                  </h4>
                  <p className="text-lp-surface-variant/80 leading-relaxed text-sm font-medium">
                    أنت مدير نفسك، حدد ساعات عملك ومناطق تواجدك بحرية تامة.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-lp-primary rounded-full flex shrink-0 items-center justify-center text-lp-secondary">
                  <MousePointer className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-headline-md text-lg mb-1 text-white font-bold">
                    اختر الشحنات التي تريدها
                  </h4>
                  <p className="text-lp-surface-variant/80 leading-relaxed text-sm font-medium">
                    اطلع على تفاصيل الشحنة والموقع والسعر المقترح قبل تقديم
                    عرضك.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-lp-primary rounded-full flex shrink-0 items-center justify-center text-lp-secondary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-headline-md text-lg mb-1 text-white font-bold">
                    ضاعف أرباحك الشهرية
                  </h4>
                  <p className="text-lp-surface-variant/80 leading-relaxed text-sm font-medium">
                    احصل على طلبات شحن مستمرة من منطقتك وزد من عوائد مركبتك.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/register"
              className="inline-block bg-lp-primary text-white px-10 py-5 rounded-2xl font-headline-md hover:scale-105 transition-transform shadow-lg shadow-lp-secondary/20 font-bold"
            >
              سجل ككابتن الآن
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-lp-stack-lg max-w-3xl mx-auto px-lp-margin-desktop">
        <h2 className="font-display-lg text-lp-display-lg-mobile text-center mb-12 text-lp-on-surface text-xl font-bold">
          الأسئلة الشائعة
        </h2>
        <div className="space-y-4 font-bold">
          <details className="group bg-white rounded-2xl border border-lp-outline-variant/20 overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none text-lp-on-surface">
              <span>كيف يتم تحديد السعر؟</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 text-lp-on-surface-variant text-sm font-medium leading-relaxed">
              يتم السعر عبر نظام مزايدة حر؛ يقوم الكباتن بتقديم عروضهم بناءً على
              تفاصيل شحنتك، ولك كامل الحرية في اختيار العرض الذي يناسب ميزانيتك.
            </div>
          </details>
          <details className="group bg-white rounded-2xl border border-lp-outline-variant/20 overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none text-lp-on-surface">
              <span>هل يمكنني رفض جميع العروض المقدمة؟</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 text-lp-on-surface-variant text-sm font-medium leading-relaxed">
              نعم، إذا لم تجد العرض المناسب لك، يمكنك إلغاء الطلب أو الانتظار
              لمزيد من العروض دون أي التزام مالي.
            </div>
          </details>
          <details className="group bg-white rounded-2xl border border-lp-outline-variant/20 overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none text-lp-on-surface">
              <span>كيف نضمن موثوقية الكباتن؟</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 text-lp-on-surface-variant text-sm font-medium leading-relaxed">
              نخضع جميع الكباتن لعملية تحقق شاملة تشمل الهوية الوطنية، رخصة
              القيادة، واستمارة المركبة، بالإضافة إلى نظام التقييم المستمر من
              العملاء.
            </div>
          </details>
          <details className="group bg-white rounded-2xl border border-lp-outline-variant/20 overflow-hidden">
            <summary className="flex justify-between items-center p-6 cursor-pointer list-none text-lp-on-surface">
              <span>ما هي طرق الدفع المتاحة؟</span>
              <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 text-lp-on-surface-variant text-sm font-medium leading-relaxed">
              ndعم كافة وسائل الدفع الإلكتروني الحديثة (مدى، فيزا، ماستركارد،
              Apple Pay) لضمان سهولة وأمان التعاملات.
            </div>
          </details>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-lp-stack-lg">
        <div className="max-w-lp-container-max mx-auto px-lp-margin-desktop">
          <div className="bg-lp-primary rounded-[2rem] p-12 text-center text-lp-on-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"></div>
            <div className="relative z-10 space-y-8">
              <h2 className="font-display-lg text-lp-display-lg-mobile md:text-lp-display-lg font-bold">
                ابدأ أول شحنة الآن
              </h2>
              <p className="text-lp-body-lg opacity-90 max-w-xl mx-auto">
                انضم إلى آلاف المستخدمين الذين يوفرون وقتهم ومالهم مع شحنتي
                يومياً.
              </p>
              <Link
                to="/register"
                className="inline-block bg-lp-secondary text-white px-12 py-5 rounded-2xl font-headline-md text-xl shadow-2xl hover:scale-105 transition-all font-bold"
              >
                أنشئ شحنتك مجاناً
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};
