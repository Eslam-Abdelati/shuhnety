import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, MessageCircle, Truck, Box, CreditCard, ShieldCheck, Search, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export const FaqPage = () => {
    const [openIndex, setOpenIndex] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')

    const faqCategories = [
        { id: 'general', label: 'عام', icon: HelpCircle },
        { id: 'drivers', label: 'السائقين', icon: Truck },
        { id: 'merchants', label: 'التجار', icon: Box },
        { id: 'payments', label: 'التحصيل', icon: CreditCard },
    ]

    const [activeCategory, setActiveCategory] = useState('general')

    const faqs = [
        {
            category: 'general',
            question: 'ما هي منصة شحنتي وكيف تفيدني؟',
            answer: 'شحنتي هي أول منصة لوجستية متكاملة مصممة لربط التجار وسلاسل التوريد بالسائقين وشركات النقل عبر نظام مزايدة حي وشفاف. تضمن المنصة الأمان، السرعة، والتحصيل الرقمي العادل لجميع أطراف المنظومة.'
        },
        {
            category: 'merchants',
            question: 'كيف يمكنني البدء كتاجر أو صاحب بضاعة؟',
            answer: 'يمكنك البدء بإنشاء حساب "تاجر"، ثم إضافة تفاصيل شحنتك (نوع البضاعة، الوزن، المسار). ستبدأ فوراً في استقبال عروض أسعار تنافسية من سائقين موثقين، ويمكنك اختيار العرض الأنسب لك بعد التفاوض.'
        },
        {
            category: 'drivers',
            question: 'ما هي المتطلبات للتسجيل كسائق في المنصة؟',
            answer: 'يتطلب التسجيل وجود رخصة قيادة سارية، أوراق مركبة قانونية، والتحقق من الهوية عبر الرقم القومي. تخضع جميع الطلبات للمراجعة من قبل فريقنا لضمان مستوى جودة وأمان عالٍ.'
        },
        {
            category: 'payments',
            question: 'كيف يتم ضمان تحصيل حقوق السائقين والمنصة؟',
            answer: 'نعتمد على نظام تحصيل رقمي عادل يقوم بتوثيق كل معاملة. يتم تحصيل الرسوم والإكراميات (إن وجدت) عبر المحافظ الإلكترونية أو بطاقات الدفع لضمان السرعة والشفافية التامة.'
        },
        {
            category: 'general',
            question: 'هل توفر المنصة تتبعاً لحظياً للشحنات؟',
            answer: 'نعم، توفر المنصة لوحة تحكم ذكية تتيح للتاجر تتبع مسار الشحنة على الخريطة لحظة بلحظة منذ استلامها وحتى وصولها الآمن للوجهة النهائية.'
        },
        {
            category: 'drivers',
            question: 'هل يمكنني العمل في أوقات مرنة؟',
            answer: 'بالتأكيد، منصة شحنتي تمنح السائقين حرية كاملة في اختيار الشحنات التي تناسب مساراتهم وأوقاتهم، مما يساعدهم على زيادة دخلهم في الوقت الذي يفضلونه.'
        }
    ]

    const filteredFaqs = faqs.filter(faq => 
        (activeCategory === 'all' || faq.category === activeCategory) &&
        (faq.question.includes(searchQuery) || faq.answer.includes(searchQuery))
    )

    return (
        <div className="min-h-screen bg-[#fcfcf9] font-cairo text-right pb-24" dir="rtl">
            {/* Header Section */}
            <div className="relative bg-brand-secondary py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(235,106,29,0.15)_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-white/5 backdrop-blur-sm"
                        >
                            <MessageCircle className="h-3 w-3" />
                            مركز المساعدة
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight"
                        >
                            الأسئلة الشائعة <br /> وكيفية استخدام المنصة
                        </motion.h1>
                        
                        {/* Search Bar */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative max-w-xl mx-auto mt-10"
                        >
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث عن سؤالك هنا..."
                                className="w-full h-16 bg-white rounded-2xl px-16 text-lg font-bold shadow-2xl shadow-black/20 outline-none focus:ring-2 ring-brand-primary/50 transition-all text-right"
                            />
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Categories & Content */}
            <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                    <button 
                        onClick={() => setActiveCategory('all')}
                        className={cn(
                            "px-8 h-12 rounded-xl text-sm font-black transition-all border",
                            activeCategory === 'all' ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        الكل
                    </button>
                    {faqCategories.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-8 h-12 rounded-xl text-sm font-black transition-all border",
                                activeCategory === cat.id ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            <cat.icon className="h-4 w-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <motion.div 
                                key={index}
                                layout
                                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                                    className="w-full flex items-center justify-between p-7 text-right outline-none group"
                                >
                                    <span className={cn(
                                        "text-lg font-black transition-colors",
                                        openIndex === index ? "text-brand-primary" : "text-brand-secondary group-hover:text-brand-primary"
                                    )}>
                                        {faq.question}
                                    </span>
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                                        openIndex === index ? "bg-brand-primary text-white rotate-180" : "bg-slate-50 text-slate-400"
                                    )}>
                                        <ChevronDown className="h-5 w-5" />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-7 pb-8 pt-2">
                                                <div className="h-px w-10 bg-brand-primary/20 mb-6"></div>
                                                <p className="text-[#57534d] font-bold leading-relaxed text-lg opacity-80">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <HelpCircle className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-slate-400">عذراً، لم نجد نتائج لبحثك</h3>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 p-10 bg-brand-secondary rounded-[3rem] text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -translate-x-10 -translate-y-10"></div>
                    <div className="relative z-10">
                        <ShieldCheck className="h-12 w-12 text-brand-primary mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-white mb-3">لم تجد إجابة لسؤالك؟</h3>
                        <p className="text-white/60 font-bold mb-8 max-w-md mx-auto">فريق الدعم الفني متواجد دائماً لمساعدتك في أي وقت خلال رحلتك.</p>
                        <Button asChild size="lg" className="rounded-2xl px-12 bg-brand-primary hover:bg-orange-600 font-black h-14">
                            <Link to="/contact">تواصل معنا الآن</Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Back Link */}
                <div className="mt-12 text-center">
                    <Button asChild variant="ghost" className="rounded-2xl text-[#57534d] font-black hover:bg-slate-100">
                        <Link to="/" className="flex items-center gap-2">
                            العودة للرئيسية
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
