import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { motion } from 'framer-motion'
import {
    Truck, ShieldCheck, MapPin, Wallet, Building2, Users, Package,
    ArrowLeftRight, CheckCircle2, TrendingUp, Info, ChevronLeft, Globe,
    Clock, Heart, Star, Box, Shield, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlobalNotification } from '@/components/ui/NotificationProvider'
import { cn } from '@/lib/utils'
import { SimpleFooter } from '@/components/SimpleFooter'
import { PublicNavbar } from '@/components/PublicNavbar'

export const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.6 }
    }

    return (
        <div className="min-h-screen bg-brand-background font-cairo overflow-x-hidden selection:bg-brand-primary selection:text-white" dir="rtl">
            <PublicNavbar />

            {/* Notification stuck under navbar */}
            <div className="fixed top-20 left-0 right-0 z-40">
                <GlobalNotification />
            </div>

            {/* Premium Hero Section - Full Width Background Image Overlay */}
            <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-slate-900">
                {/* Background Image & Gradients */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
                        className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
                        alt="Modern Logistics Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-secondary/50 via-slate-950/75 to-slate-950/95 z-0"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(235,106,29,0.15)_0%,transparent_70%)] z-0"></div>
                </div>

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Tag/Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black tracking-widest uppercase mb-8 border border-white/10 backdrop-blur-md">
                            <Zap className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
                            المنصة الرائدة لربط العملاء بمحترفي النقل
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.3] mb-6 text-white max-w-3xl drop-shadow-md">
                            حلول نقل ذكية وسلسة <br className="hidden sm:inline" />
                            <span className="text-brand-primary">لكافة احتياجاتك</span>
                        </h1>

                        {/* Description */}
                        <p className="max-w-2xl text-base sm:text-lg text-slate-200 font-bold leading-relaxed mb-12 drop-shadow-sm opacity-90">
                            سواء كنت تبحث عن وسيلة نقل موثوقة أو تسعى لتعزيز دخلك كشريك محترف، شحنتي هي وجهتك المثالية لربط التجار بأفضل الكباتن وشركات النقل.
                        </p>

                        {/* Call to Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <Button size="lg" asChild className="w-full sm:w-auto rounded-2xl px-12 h-14 text-sm font-black bg-brand-primary hover:bg-[#d95d18] text-white shadow-2xl shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer">
                                <Link to="/login"> ابدأ الشحن الآن </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto rounded-2xl px-12 h-14 text-sm font-black border-white/20 text-white bg-white/5 hover:bg-white hover:text-brand-secondary hover:border-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 group cursor-pointer backdrop-blur-sm">
                                <Link to="/register" className="flex items-center justify-center gap-2">
                                    سجل الان
                                </Link>
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <div className="flex -space-x-3 rtl:space-x-reverse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-10 w-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden shadow-md">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-center sm:text-right">
                                <div className="flex items-center justify-center sm:justify-start gap-1 text-brand-primary mb-1 scale-95 origin-center sm:origin-right">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                                </div>
                                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                    انضم إلى آلاف المستخدمين الموثوقين يومياً في مصر
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Bottom Curve / Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
            </section>

            {/* Stats Section */}
            <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-6">
                <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-slate-100/80 shadow-[0_30px_60px_-15px_rgba(20,83,45,0.05)] p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                    <motion.div 
                        className="flex items-center justify-center gap-5 md:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-7 w-7 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-brand-secondary mb-1 tracking-tight">+10,000</h3>
                            <p className="text-xs text-slate-500 font-semibold">شحنة مكتملة بنجاح</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="flex items-center justify-center gap-5 pt-6 md:pt-0 md:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center shrink-0">
                            <Truck className="h-7 w-7 text-brand-secondary" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-brand-secondary mb-1 tracking-tight">+1,500</h3>
                            <p className="text-xs text-slate-500 font-semibold">كابتن معتمد</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="flex items-center justify-center gap-5 pt-6 md:pt-0 md:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center shrink-0">
                            <TrendingUp className="h-7 w-7 text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-brand-secondary mb-1 tracking-tight">99.4%</h3>
                            <p className="text-xs text-slate-500 font-semibold">نسبة نجاح التوصيل</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* About Us Section - Keep as User Liked */}
            <section id="about" className="py-24 bg-white relative overflow-hidden">

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <div className="h-64 bg-slate-50 rounded-[2.5rem] overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=600&fit=crop" className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="bg-brand-primary p-8 rounded-[2.5rem] text-white">
                                    <Zap className="h-10 w-10 mb-4 opacity-50" />
                                    <h4 className="text-xl font-black mb-2">في مرحلة الإنشاء والتطوير</h4>
                                    <p className="text-[10px] font-bold opacity-80 uppercase ">نعمل الآن على إطلاق المنصة لخدمة قطاع الشحن في الوادي الجديد</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-brand-secondary p-8 rounded-[2.5rem] text-white">
                                    <Globe className="h-10 w-10 mb-4 opacity-50" />
                                    <h4 className="text-xl font-bold leading-relaxed">نؤمن أن التكنولوجيا هي الحل الأسرع للنمو الاقتصادي</h4>
                                </div>
                                <div className="h-64 bg-slate-50 rounded-[2.5rem] overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&h=600&fit=crop" className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-black text-brand-secondary leading-tight tracking-tight">عن "شحنتي": رؤية طموحة <br /> لمستقبل الخدمات اللوجستية</h2>
                            <div className="h-1.5 w-20 bg-brand-primary rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                                شحنتي هي منصة تهدف إلى تطوير قطاع النقل والشحن داخل مصر، من خلال ربط أصحاب الشحنات بالكابتن أصحاب المركبات وشركات النقل في نظام واحد ذكي وسهل الاستخدام.
                            </p>
                            <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed bg-brand-primary/5 p-6 rounded-3xl border-r-4 border-brand-primary">
                                نعتمد على نظام <strong>المزايدة الحي</strong>، حيث يمكن للعميل استقبال عدة عروض أسعار من مختلف الكباتن، مع إمكانية <strong>التفاوض المباشر</strong> للوصول إلى السعر العادل الذي يضمن حقوق جميع الأطراف ويحقق أعلى كفاءة اقتصادية.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: 'الشفافية الكاملة', desc: 'كل معاملة موثقة ومؤمنة بأحدث معايير الأمان.', icon: ShieldCheck },
                                { title: 'دعم تقني 24/7', desc: 'فريقنا متاح دائماً لضمان وصول شحنتك بسلام.', icon: Info }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5">
                                    <div className="h-12 w-12 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0">
                                        <item.icon className="h-6 w-6 text-brand-primary" />
                                    </div>
                                    <div>
                                        <h5 className="font-black text-slate-900 mb-1">{item.title}</h5>
                                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Added: Solutions Section */}
            <section id="solutions" className="py-20 bg-slate-50/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-brand-secondary mb-3">منظومة لوجستية ذكية تخدم كافة تطلعاتك</h2>
                        <div className="h-1 w-12 bg-brand-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'للعملاء', desc: 'تحكم كامل في شحناتك مع نظام مزايدة يضمن لك أفضل سعر وأسرع تنفيذ.', icon: Box },
                            { title: 'للكباتن', desc: 'فرص عمل يومية مع ضمان التحصيل الفوري.', icon: Truck },
                            { title: 'للشركات', desc: 'إدارة أسطول كامل مع تقارير أداء دقيقة.', icon: Building2 },
                            { title: 'للمحافظات', desc: 'رقابة رقمية شاملة وتحصيل آمن للرسوم.', icon: Globe },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center">
                                <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem Section - Enhanced Hover Aesthetics */}
            <section id="problem" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-black text-brand-secondary mb-4 tracking-tight">لماذا تختار منصة "شحنتي"؟</h2>
                        <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">نهدف إلى معالجة تحديات النقل التقليدية لضمان تجربة أكثر كفاءة وموثوقية.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'غياب الثقة', desc: 'صعوبة التحقق من هوية الكابتن أو جودة الخدمة قبل شحنتي', icon: ShieldCheck },
                            { title: 'عشوائية الرسوم', desc: 'مفيش نظام واضح لتحديد السعر. وغالبًا بتدفع أكتر من اللازم', icon: Wallet },
                            { title: 'ضياع الشحنات', desc: 'انعدام تكنولوجيا التتبع اللحظي مما عرض بضاعتك للخطر.', icon: MapPin },
                        ].map((item, i) => (
                            <div key={i} className="group relative bg-slate-50/20 p-10 rounded-[3rem] border border-slate-100/50 hover:shadow-[0_40px_80px_-20px_rgba(235,106,29,0.12)] hover:-translate-y-2 transition-all duration-500 text-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 h-16 w-16 mx-auto rounded-2xl bg-amber-50 flex items-center justify-center mb-8 border border-orange-100 shadow-inner group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500 group-hover:rotate-6">
                                    <item.icon className="h-8 w-8 text-brand-primary group-hover:text-white" />
                                </div>
                                <h4 className="relative z-10 text-xl font-black text-slate-900 mb-4 tracking-wide group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                <p className="relative z-10 text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-brand-secondary mb-4 tracking-tight">آلية عمل ذكية وبسيطة</h2>
                        <div className="h-1.5 w-20 bg-brand-primary rounded-full mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative">
                        <div className="absolute top-10 left-10 right-10 h-0.5 bg-brand-primary/10 hidden md:block"></div>
                        {[
                            { title: 'سجل حسابك', icon: Users },
                            { title: 'إضافة/استعراض شحنات', icon: Package },
                            { title: 'اختر عرضك', icon: TrendingUp },
                            { title: 'تابع المسار', icon: MapPin },
                            { title: 'التسليم / التحصيل', icon: CheckCircle2 },
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center group">
                                <div className="h-20 w-20 rounded-[2.5rem] bg-white border-2 border-slate-50 flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary group-hover:-translate-y-2 transition-all duration-500 shadow-xl shadow-slate-100 group-hover:shadow-brand-primary/20">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h4 className="text-sm font-black text-brand-secondary">{step.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-slate-50/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <span className="text-xs font-black text-brand-primary tracking-widest uppercase mb-3 block">شركاء النجاح</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-brand-secondary mb-4 tracking-tight">ماذا يقولون عن "شحنتي"؟</h2>
                        <p className="text-sm sm:text-base text-slate-500 font-semibold leading-relaxed">قصص نجاح حقيقية من التجار والكباتن الذين اعتمدوا على منصتنا لتطوير أعمالهم.</p>
                        <div className="h-1.5 w-16 bg-brand-primary rounded-full mx-auto mt-4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "أحمد مصطفى",
                                role: "تاجر جملة - القاهرة",
                                comment: "منصة شحنتي غيرت طريقتنا في شحن البضائع. بفضل نظام المزايدات العادل، أصبحنا نحصل على أفضل الأسعار ونختار الكباتن بناءً على تقييماتهم وموثوقيتهم.",
                                rating: 5,
                                avatar: "https://i.pravatar.cc/150?u=11"
                            },
                            {
                                name: "كابتن محمد محمود",
                                role: "كابتن نقل ثقيل - الغربية",
                                comment: "شغل يومي مضمون ورحلات مستمرة. المزايدة واضحة والتحصيل فوري عند التسليم. شحنتي وفرت لنا عناء البحث عن حمولات في مواقف السيارات التقليدية.",
                                rating: 5,
                                avatar: "https://i.pravatar.cc/150?u=12"
                            },
                            {
                                name: "م. سارة الصاوي",
                                role: "مديرة لوجستيات بشركة النور",
                                comment: "التتبع اللحظي للشحنات أعطانا راحة بال كاملة. بالإضافة إلى سهولة إدارة أسطولنا والتوثيق الرقمي للعقود، شحنتي هي شريكنا الاستراتيجي الأول.",
                                rating: 5,
                                avatar: "https://i.pravatar.cc/150?u=13"
                            }
                        ].map((t, i) => (
                            <motion.div 
                                key={i}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:shadow-[0_45px_90px_-20px_rgba(20,83,45,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center gap-1 text-amber-400">
                                        {[...Array(t.rating)].map((_, idx) => (
                                            <Star key={idx} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed text-sm">
                                        "{t.comment}"
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-50">
                                    <img src={t.avatar} className="h-12 w-12 rounded-full object-cover border-2 border-brand-primary/20" alt={t.name} />
                                    <div>
                                        <h4 className="font-black text-brand-secondary text-sm">{t.name}</h4>
                                        <p className="text-xs text-slate-500 font-semibold mt-0.5">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beneficiaries Section - Keep User's Fav Dark Green Style */}
            <section className="mt-20 bg-brand-secondary py-20 text-white rounded-t-[5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(235,106,29,0.1)_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">نخدم مجتمعاً <br /> كاملاً من الرواد</h2>
                        <p className="text-white/70 font-medium text-base sm:text-lg max-w-md leading-relaxed">
                            سواء كنت فرداً، أو شركة كبرى، شحنتي توفر البيئة الرقمية المثالية لنمو عملك.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'العلاء / التجار', icon: Users },
                            { name: 'الكباتن', icon: Truck },
                            { name: 'الشركات', icon: Building2 },
                            { name: 'المحافظات', icon: Globe },
                        ].map((b, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all flex flex-col items-center gap-4">
                                <b.icon className="h-8 w-8 text-brand-primary" />
                                <span className="font-black tracking-widest uppercase text-xs">{b.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <SimpleFooter />
        </div>
    )
}

export default LandingPage;

