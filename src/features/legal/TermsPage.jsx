import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, FileText, Scale, AlertCircle, CheckCircle2, Lock, ArrowRight, UserCheck, Eye, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SimpleFooter } from '@/components/SimpleFooter'
import { PublicNavbar } from '@/components/PublicNavbar'

export const TermsPage = () => {
    const sections = [
        {
            title: 'أولاً: بند إثبات الموافقة الرقمية والسجلات الحجية (Audit Trail)',
            icon: CheckCircle2,
            content: 'تخضع هذه الاتفاقية لأحكام قانون التوقيع الإلكتروني المصري وقانون مكافحة جرائم تقنية المعلومات رقم 175 لسنة 2018. يقر المستخدم ويوافق على أن نقره على زر الموافقة يُعد توقيعاً إلكترونياً حجة عليه. وتقوم المنصة بشكل تلقائي برقمة وتخزين السجلات التالية:\n\n1. التاريخ والوقت الدقيق للموافقة (بالثانية).\n2. عنوان البروتوكول الرقمي (IP Address) الخاص بالمستخدم.\n3. معرف الجهاز ونوعه (Device ID & Type).\n4. رقم إصدار الشروط والأحكام (Version Control) التي وافق عليها المستخدم.\n\nتعتبر هذه البيانات المحفوظة في خوادم المنصة دليلاً كتابياً رسمياً (Audit Trail)، وتُعد قرينة قانونية قوية على ثبوت الموافقة ما لم يثبت العكس، ويجوز تقديمها أمام جهات التحقيق والمحاكم كدليل على علم وموافقة المستخدم.'
        },
        {
            title: 'ثانياً: بند عدم الضمان (No Warranty)',
            icon: AlertCircle,
            content: 'تُقدم المنصة خدماتها الرقمية وتطبيقها الإلكتروني "كما هي" (As Is) و"حسب توفرها" (As Available)، دون أي ضمانات صريحة أو ضمنية من أي نوع. لا تضمن المنصة استمرار عمل التطبيق دون انقطاع مؤقت، أو خلوه التام من الأخطاء التقنية العارضة، أو دقة بيانات الخرائط والتتبع الحي الناتجة عن خدمات الطرف الثالث (مثل Google Maps)، كما لا تضمن المنصة سلوك أو أمان أو مصداقية أي من المستخدمين (عملاء أو كباتن) على أرض الواقع، وينحصر دورها في بذل العناية المهنية المعتادة فقط، ولا تتحمل المنصة مسؤولية أي تعاملات تتم خارج التطبيق.'
        },
        {
            title: 'ثالثاً: بند تحديد المسؤولية القصوى (Limitation of Liability)',
            icon: Scale,
            content: 'مع مراعاة أحكام القانون المدني المصري، يوافق المستخدم موافقة حاسمة على أن المنصة ومدرائها وموظفيها لا يتحملون أي مسؤولية مدنية أو قانونية عن أي أضرار غير مباشرة، أو خسائر تبعية، أو كسب فائت، أو تلفيات تلحق بالبضائع أو الأشخاص نتيجة عمليات الشحن المبرمة عبر التطبيق. وفي جميع الأحوال، وتحت أي ظرف قضائي، فإن الحد الأقصى للمسؤولية المالية والإجمالية للمنصة تجاه أي مستخدم عن أي نزاع أو خطأ تقني، لا يتجاوز بأي حال من الأحوال قيمة العمولة الفعلية التي حصلتها المنصة من العملية (الرحلة) محل النزاع، أو مبلغ (5,000 جنيه مصري)، أيهما أقل.'
        },
        {
            title: 'رابعاً: بند التعويض العكسي لصالح المنصة (Indemnity Clause)',
            icon: Shield,
            content: 'يلتزم المستخدم (سواء كان عميلاً أو كابتناً) بتعويض المنصة، والشركة المالكة لها، ومدرائها، وموظفيها، تعويضاً شاملاً وكاملاً ومبرئاً للذمة عن أي أضرار، أو خسائر، أو مطالبات مالية، أو غرامات حكومية، أو مصاريف قضائية وأتعاب محاماة، بما في ذلك أي مطالبات من جهات حكومية أو تنظيمية تنشأ نتيجة:\n\n1. مخالفة المستخدم لأي بند من بنود هذه الشروط والأحكام.\n2. قيام العميل بشحن بضائع غير قانونية، أو مهربة، أو ممنوعة قانوناً.\n3. قيام الكابتن بأي فعل غير قانوني، أو إهمال جسيم، أو حادث مروري أثناء نقل الشحنة.\n4. انتهاك المستخدم لحقوق أي طرف ثالث (مثل حقوق الملكية الفكرية أو الخصوصية).'
        },
        {
            title: 'خامساً: تعديل الشروط والأحكام بإشعار مسبق (Amending Terms)',
            icon: ArrowRight,
            content: 'تحتفظ المنصة بالحق المطلق في تعديل، تحديث، أو تغيير هذه الشروط والأحكام (بما في ذلك سياسات التسعير والعمولات) في أي وقت. وتلتزم المنصة بـ إرسال إشعار مسبق للمستخدمين عبر التطبيق أو البريد الإلكتروني قبل (7 أيام) على الأقل من تاريخ سريان التعديلات الجديدة، مع توضيح "تاريخ السريان والنفاذ" بوضوح في أعلى الوثيقة. ويُعد استمرار المستخدم في استخدام خدمات التطبيق بعد تاريخ السريان المذكور مواففة صريحة وقبولاً نهائياً بالشروط المعدلة.'
        },
        {
            title: 'سادساً: سياسة حل النزاعات وحسمها داخل المنصة (Dispute Resolution)',
            icon: UserCheck,
            content: 'في حال حدوث نزاع بين العميل والسائق حول شحنة (ادعاء تلف، نقص، تأخر، إلخ)، تلتزم الأطراف بالآلية التالية قبل اللجوء لأي جهة خارجية:\n\n1. رفع الشكوى: يجب على الطرف المتضرر الضغط على زر "فتح نزاع" داخل التطبيق خلال مدة أقصاها (48 ساعة) من وقت إنهاء أو إلغاء الرحلة.\n2. توثيق الأدلة: يلتزم المستخدم برفع كافة الأدلة الرقمية المؤيدة لموقفه فوراً عبر التطبيق (مثل: صور البضاعة التالفة، فواتير، محادثات التطبيق، إيصالات الاستلام).\n3. مدة الرد والقرار: تفحص الإدارة القانونية والتقنية للمنصة سجلات التتبع (GPS) والأدلة المرفوعة، وتصدر قراراً فصلاً في شق النزاع المالي (تحويل الأموال للسائق أو ردها للعميل) خلال مدة (14 يوم عمل) من تاريخ اكتمال الأدلة، ويُعد هذا القرار ملزماً من الناحية التشغيلية داخل التطبيق، دون الإخلال بحق الأطراف في اللجوء للقضاء.'
        },
        {
            title: 'سابعاً: بند الدفع، التحصيل الجبري، والمسؤولية المالية (Payment & Force Collection)',
            icon: Lock,
            content: '1. طبيعة دور المنصة في الدفع: المنصة هي "وسيط تقني في التحصيل" فقط لبعض المعاملات (الدفع الإلكتروني/المحفظة)، وليست طرفاً أصيلاً في عقد النقل المالي بين العميل والسائق. تقع مسؤولية سداد قيمة الشحن كاملة على عاتق العميل بمجرد إتمام السائق للرحلة.\n2. آلية التحصيل الجبري (Force Payment): في حال تخلف العميل عن السداد، يحق للمنصة فوراً حظر حسابه، وخصم المبالغ المستحقة تلقائياً من أي رصيد أو محفظة رقمية تابعة له داخل التطبيق، أو اتخاذ الإجراءات القانونية اللازمة لتحصيلها منه كدين مستحق الأداء، وذلك وفقاً لما يسمح به القانون وبموافقة المستخدم المسبقة على وسائل الدفع المسجلة، ولا يحق للعميل المطالبة باسترداد الأموال (Refund) بعد التسجيل الناجح للتسليم إلا عبر "آلية فتح النزاع" الموضحة في البند (سادساً).'
        },
        {
            title: 'ثامناً: شروط الأهلية وصحة البيانات',
            icon: Eye,
            content: '1. الأهلية الفاصلة: يقر السائق بأن سنه لا يقل عن 21 عاماً ويمتلك رخصة قيادة مهنية سارية المفعول. ويقر العميل بأن سنه لا يقل عن 18 عاماً ويمتلك الأهلية القانونية أو التجارية اللازمة لإبرام عقود النقل وتداول البضائع.\n2. صحة البيانات: يلتزم المستخدمون بتقديم بيانات ومستندات رسمية صحيحة ومحدثة. أي تزوير أو تلاعب في مستندات الهوية، أو رخص القيادة، أو رخص المركبات يعرض الحساب للحظر الفوري والملاحقة الجنائية.'
        },
        {
            title: 'تاسعاً: القانون الواجب التطبيق وفض النزاعات القضائية',
            icon: Scale,
            content: '1. القانون الحاكم: تخضع هذه الاتفاقية وتُفسر وتُطبق وفقاً للقوانين والتشريعات السارية في جمهورية مصر العربية.\n2. الاختصاص القضائي الحصري: في حال تعذر الحل الودي أو الحل الداخلي عبر التطبيق، ينعقد الاختصاص القضائي الحصري والنهائي للفصل في أي نزاع لـ محاكم القاهرة الاقتصادية بجميع درجاتها، ويسقط كل طرف حقه في الدفع بعدم الاختصاص المحلي.'
        },
        {
            title: 'عاشراً: أحكام عامة',
            icon: Globe,
            content: '1. في حال بطلان أو عدم قابلية تنفيذ أي بند من بنود هذه الاتفاقية، لا يؤثر ذلك على صحة ونفاذ باقي البنود، وتظل سارية وملزمة (Severability).\n2. تمثل هذه الاتفاقية كامل التفاهم والاتفاق بين الأطراف، وتلغي أي اتفاقات أو تفاهمات سابقة (Entire Agreement).'
        }
    ]

    return (
        <div className="min-h-screen bg-[#fcfcf9] font-cairo text-right" dir="rtl">
            <PublicNavbar />
            {/* Header / Hero */}
            <div className="relative bg-brand-secondary py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(235,106,29,0.15)_0%,transparent_50%)]"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center justify-center h-16 w-16 bg-brand-primary rounded-2xl mb-8 shadow-xl shadow-brand-primary/20"
                    >
                        <Scale className="h-8 w-8 text-white" />
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
                    {/* Meta Details */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-100 text-slate-500 font-bold text-sm">
                        <span>الإصدار رقم: 1.0</span>
                        <span>تاريخ السريان والنفاذ: 7 يونيو 2026</span>
                    </div>

                    {/* Preamble / Introduction */}
                    <div className="bg-brand-primary/5 p-8 rounded-3xl border-r-4 border-brand-primary mb-12">
                        <h4 className="text-lg font-black text-brand-secondary mb-3">تمهيد وتوضيح (طبيعة الاتفاقية)</h4>
                        <p className="text-slate-700 font-medium leading-relaxed">
                            تعتبر هذه الشروط والأحكام اتفاقية قانونية إلكترونية ملزمة مبرمة بين منصة "شُحنتي" الإلكترونية (المشار إليها لاحقاً بـ "المنصة" أو "نحن")، وبين أي شخص طبيعي أو اعتباري يقوم بإنشاء حساب أو استخدام خدمات المنصة، سواء كان صاحب شحنة/تاجر (المشار إليه بـ "العميل") أو قائد مركبة/صاحب شاحنة (المشار إليه بـ "الكابتن"). إن مجرد النقر على زر "تسجيل" أو "أوافق"، أو البدء الفعلي في استخدام التطبيق، يُعد موافقة صريحة ونهائية على جميع أحكام هذه الاتفاقية.
                        </p>
                    </div>

                    {/* Terms Sections */}
                    <div className="space-y-12">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-10 w-10 rounded-xl bg-brand-primary/5 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-brand-secondary">{section.title}</h3>
                                </div>
                                <p className="text-slate-500 font-bold leading-relaxed pr-14 whitespace-pre-line">
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
                        آخر تحديث: 7 يونيو 2026
                    </p>
                </div>
            </div>
            <SimpleFooter />
        </div>
    )
}
export default TermsPage;
