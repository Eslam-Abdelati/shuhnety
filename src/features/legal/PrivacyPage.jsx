import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, FileText, Scale, AlertCircle, CheckCircle2, Lock, ArrowRight, UserCheck, Eye, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SimpleFooter } from '@/components/SimpleFooter'
import { PublicNavbar } from '@/components/PublicNavbar'

export const PrivacyPage = () => {
    const sections = [
        {
            title: 'أولاً: الاستخدام المشروع والقيود القانونية',
            icon: CheckCircle2,
            content: 'يلتزم مستخدمو المنصة (عملاء وكباتن) باستخدام التطبيق في الأغراض المخصصة له فقط وهي (تنسيق، ومزايدة، وتتبع عمليات شحن البضائع القانونية). ويحظر تماماً استخدام المنصة في الأنشطة التالية:\n\n- شحن أو نقل أي مواد غير قانونية: ويشمل ذلك (المخدرات، الأسلحة، الذخائر، المواد المتفجرة أو القابلة للاشتعال غير المرخصة، الآثار، البضائع المهربة أو المسروقة، العملات المزيفة، أو أي بضائع تتطلب تصاريح سيادية دون إرفاقها).\n- مخالفة القوانين السارية: استخدام التطبيق بما يخاف القوانين واللوائح السارية في جمهورية مصر العربية، وعلى رأسها قانون المرور، وقوانين التجارة، وقوانين مكافحة الإرهاب وغسيل الأموال.'
        },
        {
            title: 'ثانياً: معايير السلوك والأمان التشغيلي',
            icon: UserCheck,
            content: 'بهدف الحفاظ على بيئة عمل آمنة وموثوقة لجميع الأطراف، يُحظر بتاتاً على المستخدمين القيام بالآتي:\n\n- التلاعب بنظام المزايدات: يُمنع منعاً باتاً قيام العميل بطرح شحنات وهمية، أو قيام الكابتن بتقديم عروض أسعار صورية أو التواطؤ مع مستخدمين آخرين للتلاعب بأسعار السوق أو الإضرار بالمنافسة العادلة.\n- التهرب من الرسوم (التعامل الخارجي): يُحظر تماماً محاولة التواصل بين العميل والكابتن لإتمام عملية الشحن أو سداد قيمتها خارج مظلة التطبيق الرقمية إذا كان قد تم التعارف والاتفاق المبدئي عبر المنصة، وذلك للتهرب من دفع عمولة التشغيل.\n- انتحال الشخصية أو التزوير: يحظر على الكابتن السماح لأي شخص آخر بقيادة المركبة أو تنفيذ الرحلة بدلاً منه باستخدام حسابه الشخصي، كما يُحظر استخدام وثائق أو رخص منتهية الصلاحية أو تابعة للغير.\n- سوء المعاملة والسلوك غير المهني: يُحظر التحرش (اللفظي أو الفعلي)، أو استخدام لغة بذيئة، أو التهديد، أو الإساءة بأي شكل من الأشكال بين العملاء والكباتن، أو تجاه موظفي الدعم الفني للمنصة.'
        },
        {
            title: 'ثالثاً: القيود التقنية وأمن المعلومات (Cybersecurity)',
            icon: Lock,
            content: 'بصفتنا منصة رقمية، فإن حماية بنيتنا التكنولوجية هي خط أحمر. يُحظر على أي مستخدم محاولة أو القيام بالآتي:\n\n- اختراق أو تخريب الأنظمة: محاولة فك تشفير التطبيق، أو الهندسة العكسية (Reverse Engineering) للأكواد، أو فحص الثغرات، أو إدخال فيروسات، أو برمجيات خبيثة، أو شن هجمات حجب الخدمة (DDoS)، أو محاولة الوصول غير المصرح به إلى حسابات المستخدمين الآخرين.\n- التلاعب بنظام التتبع (GPS): يُحظر على الكباتن استخدام تطبيقات تزييف الموقع الجغرافي (Fake GPS) أو إغلاق خاصية التتبع عمداً أثناء الرحلة بغرض إخفاء المسار الفعلي أو افتعال أعطال وهمية.\n- جمع البيانات العشوائي (Scraping): يُحظر استخدام أي برمجيات أو أدوات آلية (Bots أو Spiders) لنسخ، أو سحب، أو جمع بيانات الشحنات، أو أسعار المزايدات، أو بيانات المستخدمين من التطبيق دون إذن كتابي صريح من إدارة المنصة.'
        },
        {
            title: 'رابعاً: سياسة التقييمات والمحتوى والمراجعات',
            icon: Eye,
            content: 'تتيح المنصة نظام تقييم متبادل لضمان الجودة. ويلتزم المستخدمون عند كتابة أي تعليق أو مراجعة بالآتي:\n\n- أن تكون المراجعة صادقة ومبنية على تجربة فعلية للرحلة.\n- ألا تحتوي المراجعة على أي عبارات تشهيرية، أو عنصرية، أو تجريح شخصي، أو ترويج لخدمات منافسة، ولا يجوز استخدامها كوسيلة للابتزاز أو الضغط.\n- تمتلك المنصة الحق المطلق في مراجعة وتعديل أو حذف أي تقييم يخالف هذه المعايير، وذلك دون الإخلال ببنود تحديد المسؤولية الواردة في الشروط والأحكام.'
        },
        {
            title: 'خامساً: الإجراءات الجزائية وحق الحظر (Enforcement & Sanctions)',
            icon: AlertCircle,
            content: 'تمتلك إدارة منصة "شُحنتي" السلطة التقديرية لتحديد ما إذا كان هناك خرق لهذه السياسة من عدمه، وذلك وفقاً لتقديرها المعقول وبما لا يخالف القانون. وفي حال ثبوت المخالفة، يحق للمنصة اتخاذ أي من الإجراءات التالية دون إنذار مسبق في الحالات الجسيمة أو الطارئة:\n\n- التوجيه بإنذار رسمي للمستخدم عبر التطبيق أو البريد الإلكتروني.\n- التعليق المؤقت لحساب المستخدم ومنعه من دخول المزايدات أو طرح الشحنات.\n- الحظر الفوري والنهائي للحساب (Blacklisting)، وتجميد أو حجز أي أرصدة أو مكافآت داخل التطبيق مؤقتاً لحين تسوية النزاع أو وفقاً لما يسمح به القانون.\n- إبلاغ السلطات الأمنية وجهات إنفاذ القانون والنيابة العامة في حال كانت المخالفة تشكل جريمة جنائية (مثل نقل ممنوعات أو تزوير مستندات).\n- مقاضاة المخالف مدنياً ومطالبته بالتعويضات المناسبة عن الأضرار المادية أو الأدبية التي لحقت بسمعة المنصة أو علامتها التجارية.'
        },
        {
            title: 'سادساً: تعديل سياسة الاستخدام',
            icon: Globe,
            content: 'تخضع هذه السياسة للتحديث المستمر لمواكبة التطورات التقنية والتشريعية. وتلتزم المنصة بنشر أي تعديلات مع إيضاح تاريخ السريان في أعلى الصفحة، ويُعد استمرارك في استخدام التطبيق بعد أي تحديث موافقة صريحة منك على الالتزام بالنسخة المحدثة من السياسة.'
        }
    ]

    return (
        <div className="min-h-screen bg-lp-background font-cairo text-right" dir="rtl">
            <PublicNavbar />
            {/* Header / Hero */}
            <div className="relative bg-lp-on-background py-24 overflow-hidden">
                <div className="absolute inset-0 bg-lp-gradient bg-gradient-to-l from-lp-on-background/90 via-lp-on-background/40 to-transparent"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="inline-flex items-center justify-center h-16 w-16 bg-lp-primary rounded-2xl mb-8 shadow-xl shadow-lp-primary/20"
                    >
                        <Shield className="h-8 w-8 text-white" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl lg:text-2xl font-black text-white mb-6"
                    >
                        سياسة الاستخدام والخصوصية
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg font-bold"
                    >
                        قواعد السلوك والمعايير التشغيلية لمستخدمي منصة شحنتي
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 py-20 -mt-10 relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-lp-outline-variant/15"
                >
                    {/* Meta Details */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-lp-outline-variant/15 text-slate-500 font-bold text-sm">
                        <span>الإصدار رقم: 1.0</span>
                        <span>تاريخ السريان والنفاذ: 8 يونيو 2026</span>
                    </div>

                    {/* Preamble / Introduction */}
                    <div className="bg-lp-primary/5 p-8 rounded-3xl border-r-4 border-lp-primary mb-12">
                        <h4 className="text-lg font-black text-lp-on-background mb-3">تمهيد وتوضيح</h4>
                        <p className="text-slate-700 font-medium leading-relaxed">
                            تحدد هذه السياسة قواعد السلوك والمعايير الرقمية والتشغيلية التي يجب على جميع مستخدمي منصة "شُحنتي" (سواء كانوا "عملاء" أصحاب شحنات، أو "كباتن" مقدمي خدمات نقل) الالتزام بها عند الوصول إلى التطبيق أو الموقع الإلكتروني أو استخدام أي من خدماتنا. يُعد استخدامك للمنصة إقراراً بالتزامك الكامل بهذه السياسة، وأي مخالفة لها تمنح الإدارة الحق في اتخاذ الإجراءات الردعية بما فيها الحظر النهائي والملاحقة القضائية، وفقاً لتقديرها المعقول وبما لا يخالف القانون. وتُعد هذه السياسة جزءاً لا يتجزأ من الشروط والأحكام العامة للمنصة.
                        </p>
                    </div>

                    {/* Policy Sections */}
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
                                    <div className="h-10 w-10 rounded-xl bg-lp-primary/5 text-lp-primary flex items-center justify-center group-hover:bg-lp-primary group-hover:text-white transition-all duration-300">
                                        <section.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-black text-lp-on-background">{section.title}</h3>
                                </div>
                                <p className="text-slate-500 font-bold leading-relaxed pr-14 whitespace-pre-line">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Agreement Footer */}
                    <div className="mt-20 pt-10 border-t border-lp-outline-variant/15 text-center">
                        <p className="text-sm text-slate-400 font-bold mb-8">
                            باستخدامك لمنصة شحنتي، فإنك تقر وتوافق على سياسة الاستخدام والخصوصية هذه وشروط الاستخدام.
                        </p>
                        <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl px-6 md:px-12 bg-lp-primary hover:bg-lp-primary/95 text-white font-black h-14 shadow-xl shadow-lp-primary/20 hover:scale-105 duration-300">
                            <Link to="/">العودة إلى الصفحة الرئيسية</Link>
                        </Button>
                    </div>
                </motion.div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-300 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-3 w-3" />
                        آخر تحديث: 8 يونيو 2026
                    </p>
                </div>
            </div>
            <SimpleFooter />
        </div>
    )
}
export default PrivacyPage;
