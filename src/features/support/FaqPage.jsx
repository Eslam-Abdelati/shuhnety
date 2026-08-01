import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Truck,
  Box,
  CreditCard,
  ShieldCheck,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SimpleFooter } from "@/components/SimpleFooter";
import { PublicNavbar } from "@/components/PublicNavbar";

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    { id: "general", label: "عام", icon: HelpCircle },
    { id: "drivers", label: "الكباتن", icon: Truck },
    { id: "merchants", label: "التجار", icon: Box },
    { id: "payments", label: "التحصيل", icon: CreditCard },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const faqs = [
    {
      category: "general",
      question: "ما هي منصة شيلة وكيف تفيدني؟",
      answer:
        "شيلة هي أول منصة لوجستية متكاملة مصممة لربط التجار وسلاسل التوريد بالكباتن وشركات النقل عبر نظام مزايدة حي وشفاف. تضمن المنصة الأمان، السرعة، والتحصيل الرقمي العادل لجميع أطراف المنظومة.",
    },
    {
      category: "merchants",
      question: "كيف يمكنني البدء كتاجر أو صاحب بضاعة؟",
      answer:
        'يمكنك البدء بإنشاء حساب "تاجر"، ثم إضافة تفاصيل شحنتك (نوع البضاعة، الوزن، المسار). ستبدأ فوراً في استقبال عروض أسعار تنافسية من كباتن موثقين، ويمكنك اختيار العرض الأنسب لك بعد التفاوض.',
    },
    {
      category: "drivers",
      question: "ما هي المتطلبات للتسجيل ككابتن في المنصة؟",
      answer:
        "يتطلب التسجيل وجود رخصة قيادة سارية، أوراق مركبة قانونية، والتحقق من الهوية عبر الرقم القومي. تخضع جميع الطلبات للمراجعة من قبل فريقنا لضمان مستوى جودة وأمان عالٍ.",
    },
    {
      category: "payments",
      question: "كيف يتم ضمان تحصيل حقوق الكباتن والمنصة؟",
      answer:
        "نعتمد على نظام تحصيل رقمي عادل يقوم بتوثيق كل معاملة. يتم تحصيل الرسوم والإكراميات (إن وجدت) عبر المحافظ الإلكترونية أو بطاقات الدفع لضمان السرعة والشفافية التامة.",
    },
    {
      category: "general",
      question: "هل توفر المنصة تتبعاً لحظياً للشحنات؟",
      answer:
        "نعم، توفر المنصة لوحة تحكم ذكية تتيح للتاجر تتبع مسار الشحنة على الخريطة لحظة بلحظة منذ استلامها وحتى وصولها الآمن للوجهة النهائية.",
    },
    {
      category: "drivers",
      question: "هل يمكنني العمل في أوقات مرنة؟",
      answer:
        "بالتأكيد، منصة شيلة تمنح الكباتن حرية كاملة في اختيار الشحنات التي تناسب مساراتهم وأوقاتهم، مما يساعدهم على زيادة دخلهم في الوقت الذي يفضلونه.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "all" || faq.category === activeCategory) &&
      (faq.question.includes(searchQuery) || faq.answer.includes(searchQuery)),
  );

  return (
    <div
      className="min-h-screen bg-lp-background font-cairo text-right"
      dir="rtl"
    >
      <PublicNavbar />
      {/* Header Section */}
      <div className="relative bg-lp-on-background py-24 overflow-hidden">
        <div className="absolute inset-0 bg-lp-gradient bg-gradient-to-l from-lp-on-background/90 via-lp-on-background/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-lp-primary-fixed text-[10px] font-bold uppercase tracking-widest mb-6 border border-white/5 backdrop-blur-sm"
            >
              <MessageCircle className="h-3 w-3 text-lp-primary" />
              مركز المساعدة
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xl lg:text-2xl font-black text-white mb-6 leading-tight"
            >
              الأسئلة الشائعة <br /> وكيفية استخدام المنصة
            </motion.h1>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative max-w-xl mx-auto mt-10"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن سؤالك هنا..."
                className="w-full h-16 bg-white rounded-2xl px-16 text-lg font-bold shadow-2xl shadow-black/20 outline-none focus:ring-2 ring-lp-primary/50 transition-all text-right"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-lp-on-surface-variant/40" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories & Content */}
      <div className="">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-none sm:shadow-2xl sm:shadow-slate-200/50 p-6 sm:p-10 md:p-16 border-x-0 sm:border border-lp-outline-variant/15"
        >
          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 pb-8 border-b border-lp-outline-variant/15">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-8 h-12 rounded-xl text-sm font-black transition-all border",
                activeCategory === "all"
                  ? "bg-lp-primary border-lp-primary text-lp-on-primary shadow-xl shadow-lp-primary/20 hover:scale-105 duration-300 cursor-pointer"
                  : "bg-white border-lp-outline-variant/15 text-lp-on-surface-variant hover:bg-lp-surface cursor-pointer",
              )}
            >
              الكل
            </button>
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-black transition-all border",
                  activeCategory === cat.id
                    ? "bg-lp-primary border-lp-primary text-lp-on-primary shadow-xl shadow-lp-primary/20 hover:scale-105 duration-300 cursor-pointer"
                    : "bg-white border-lp-outline-variant/15 text-lp-on-surface-variant hover:bg-lp-surface cursor-pointer",
                )}
              >
                <cat.icon className="h-4 w-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="divide-y divide-slate-100">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  layout
                  className="overflow-hidden py-4 first:pt-0 last:pb-0"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? -1 : index)
                    }
                    className="w-full flex items-center justify-between py-4 text-right outline-none group cursor-pointer"
                  >
                    <span
                      className={cn(
                        "transition-colors",
                        openIndex === index
                          ? "text-lp-primary"
                          : "text-lp-on-background group-hover:text-lp-primary",
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-all shrink-0",
                        openIndex === index
                          ? "bg-lp-primary text-white rotate-180"
                          : "bg-lp-surface text-lp-on-surface-variant/70",
                      )}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="pb-4 pt-2">
                          <p className="text-lp-on-surface-variant leading-relaxed opacity-85">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-lp-surface rounded-[2rem] border border-dashed border-lp-outline-variant/30">
                <HelpCircle className="h-16 w-16 text-lp-on-surface-variant/30 mx-auto mb-6" />
                <h3 className="text-xl font-black text-lp-on-surface-variant/50">
                  عذراً، لم نجد نتائج لبحثك
                </h3>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 sm:mt-24 mb-10 sm:mb-20 p-6 sm:p-10 bg-lp-on-background border border-lp-outline-variant/10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-lp-primary/5 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="relative z-10">
            <ShieldCheck className="h-12 w-12 text-lp-primary mx-auto mb-6" />
            <h3 className="text-2xl font-black text-white mb-3">
              لم تجد إجابة لسؤالك؟
            </h3>
            <p className="text-white/60 font-normal mb-8 max-w-md mx-auto">
              فريق الدعم الفني متواجد دائماً لمساعدتك في أي وقت خلال رحلتك.
            </p>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-2xl px-8 md:px-12 bg-lp-primary hover:bg-lp-primary/95 text-white font-black h-14 shadow-xl shadow-lp-primary/20 hover:scale-105 duration-300"
            >
              <Link to="/contact">تواصل معنا الآن</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <SimpleFooter />
    </div>
  );
};
