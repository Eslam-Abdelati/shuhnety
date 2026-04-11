import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, FileText, Scale, AlertCircle, ChevronRight, CheckCircle2, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SimpleFooter } from '@/components/SimpleFooter'

export const TermsPage = () => {
    const sections = [
        {
            title: '1. مقدمة وصفة المنصة',
            icon: FileText,
            content: 'منصة شحنتي هي وسيط تقني يربط بين طالبي خدمات النقل (التجار/العملاء) ومقدمي خدمات النقل (الكباتن/شركات النقل). المنصة لا تملك مركبات ولا تعمل كشركة نقل مباشرة، بل كمنصة لإدارة العمليات اللوجستية.'
        },
        {
            title: '2. شروط التسجيل والحساب',
            icon: Lock,
            content: 'يجب أن تكون كافة البيانات المقدمة أثناء التسجيل دقيقة ومحدثة. بالنسبة للكباتن، يجب توفير رخصة قيادة سارية، أوراق المركبة، وأي مستندات قانونية تطلبها المنصة للتحقق من الأهلية.'
        },
        {
            title: '3. نظام المزايدة والتفاوض',
            icon: ArrowRight,
            content: 'تعتمد المنصة نظام المزايدة الحر، حيث يقدم الكابتنون عروضاً سعرية بناءً على تفاصيل الشحنة. يحق للعميل التفاوض لمرة واحدة أو أكثر، وبمجرد قبول العرض، يُعد ذلك التزاماً تعاقدياً بين الطرفين.'
        },
        {
            title: '4. الرسوم والتحصيل الرقمي',
            icon: Scale,
            content: 'يتم تحصيل رسوم المنصة ورسوم المحافظات (إن وجدت) رقمياً عبر الوسائل المتاحة. يجب الالتزام بدفع الرسوم في المواعيد المحددة لضمان استمرارية الخدمة وتجنب تعليق الحساب.'
        },
        {
            title: '5. الأمان والمسؤولية',
            icon: Shield,
            content: 'تضمن المنصة سرية البيانات وتتبع الشحنات، ولكن لا تتحمل المسؤولية المباشرة عن أي أضرار مادية تلحق بالبضائع أثناء النقل، حيث تقع المسؤولية على عاتق الكابتن/شركة النقل وفقاً للقوانين المصرية المعمول بها.'
        },
        {
            title: '6. السلوك المحظور',
            icon: AlertCircle,
            content: 'يُحظر تماماً شحن أي مواد غير قانونية، مخدرات، أسلحة، أو مواد قابلة للانفجار. المنصة ستقوم بالإبلاغ الفوري للجهات السلطوية في حال اكتشاف أي مخالفات قانونية.'
        }
    ]

    return (
        <div className="min-h-screen bg-[#fcfcf9] font-cairo text-right" dir="rtl">
            {/* Header / Hero */}
            <div className="relative bg-brand-secondary py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(235,106,29,0.15)_0%,transparent_50%)]"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center justify-center h-16 w-16 bg-brand-primary rounded-2xl mb-8 shadow-xl shadow-brand-primary/20"
                    >
                        <FileText className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-black text-white mb-6"
                    >
                        الشروط والأحكام
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg font-bold"
                    >
                        يرجى قراءة شروط استخدام منصة شحنتي بعناية لضمان تجربة آمنة وعادلة للجميع
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20 -mt-10 relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-slate-100"
                >
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-brand-secondary">{section.title}</h3>
                                </div>
                                <p className="text-slate-500 font-bold leading-relaxed pr-14">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Agreement Footer */}
                    <div className="mt-20 pt-10 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-400 font-bold mb-8">
                            بإنشائك حساباً في منصة شحنتي، فإنك توافق ضمنياً على كافة البنود المذكورة أعلاه.
                        </p>
                        <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl px-6 md:px-12 bg-brand-secondary hover:bg-black font-black">
                            <Link to="/">العودة إلى الصفحة الرئيسية</Link>
                        </Button>
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        آخر تحديث: أبريل 2026
                    </p>
                </div>
            </div>
            <SimpleFooter />
        </div>
    )
}

