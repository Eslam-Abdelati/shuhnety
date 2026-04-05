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

export const LandingPage = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    return (
        <div className="min-h-screen bg-brand-background font-cairo overflow-x-hidden selection:bg-brand-primary selection:text-white" dir="rtl">
            {/* Premium Navbar - Refined Design */}
            <nav className="fixed w-full z-[100] transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
                        <div className="h-10 w-10 bg-brand-primary rounded-[0.9rem] flex items-center justify-center text-white shadow-lg shadow-brand-primary/25 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                            <Truck className="h-5.5 w-5.5" />
                        </div>
                        <span className="text-2xl font-black text-brand-secondary tracking-tight">شحنتي</span>
                    </Link>

                    {/* Desktop Menu - Floating Style */}
                    <div className="hidden lg:flex items-center bg-slate-50/50 px-8 py-2.5 rounded-full border border-slate-100/50 gap-10 text-[13px] font-bold text-[#57534d] shadow-sm">
                        <HashLink smooth to="/#about" className="hover:text-brand-primary transition-all relative group/nav">
                            من نحن
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand-primary transition-all group-hover/nav:w-full"></span>
                        </HashLink>
                        <HashLink smooth to="/#solutions" className="hover:text-brand-primary transition-all relative group/nav">
                            الحلول
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand-primary transition-all group-hover/nav:w-full"></span>
                        </HashLink>
                        <HashLink smooth to="/#problem" className="hover:text-brand-primary transition-all relative group/nav">
                            المزايا
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand-primary transition-all group-hover/nav:w-full"></span>
                        </HashLink>
                        <HashLink smooth to="/#workflow" className="hover:text-brand-primary transition-all relative group/nav">
                            آلية العمل
                            <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand-primary transition-all group-hover/nav:w-full"></span>
                        </HashLink>
                    </div>

                    {/* Action Buttons - Consistent Style */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild className="flex text-brand-secondary font-black hover:bg-slate-100 rounded-xl h-12 transition-all">
                            <Link to="/login">تسجيل الدخول</Link>
                        </Button>
                        <Button size="sm" asChild className="hidden sm:flex bg-brand-primary hover:bg-brand-primary/90 text-white font-black shadow-xl shadow-brand-primary/20 rounded-xl px-8 h-12 transition-all hover:-translate-y-0.5 active:scale-95">
                            <Link to="/register">إنشاء حساب مجاناً</Link>
                        </Button>
                    </div>
                </div>

            </nav>

            {/* Notification stuck under navbar */}
            <div className="fixed top-20 left-0 right-0 z-40">
                <GlobalNotification />
            </div>

            {/* Premium Hero Section - Spacing Fixed */}
            <section className="relative pt-32 pb-16 lg:pt-40 overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(235,106,29,0.05)_0%,transparent_50%)] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <motion.div className="flex-1 text-center lg:text-right" {...fadeIn}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[#57534d] text-[9px] font-black tracking-widest uppercase mb-6 border border-slate-200/50">
                            <Zap className="h-3 w-3 text-brand-primary" />
                            منصة الشحن الذكي الأولى في مصر
                        </div>

                        <h1 className="text-xl lg:text-5xl font-black leading-[1.15] tracking-tight mb-8 text-brand-secondary">
                            تحكم كامل في شحناتك<br />
                            {/* <span className="text-brand-primary drop-shadow-sm">   من أول عرض سعر لحد التحصيل</span> */}
                        </h1>

                        <p className="max-w-lg lg:mr-0 mx-auto text-base text-[#57534d] font-bold leading-relaxed mb-10 opacity-80">
                            اشحن بذكاء، وفر في التكلفة، واستلم فلوسك بدون تعقيد.   </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" asChild className="rounded-2xl px-10 h-12 text-sm font-black bg-brand-secondary hover:bg-black shadow-2xl shadow-brand-secondary/20 transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer">
                                <Link to="/login"> ابدأ شحنتك الآن </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="rounded-2xl px-10 h-12 text-sm font-black border-slate-200 hover:bg-slate-50 hover:border-brand-primary hover:text-brand-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95 group cursor-pointer">
                                <Link to="/register" className="flex items-center gap-2">
                                    انضم إلينا الان
                                </Link>
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-14 flex items-center justify-center lg:justify-start gap-10">
                            <div className="flex -space-x-3 rtl:space-x-reverse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-9 w-9 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-brand-primary mb-0.5 scale-90 origin-right">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-3 w-3 fill-current" />)}
                                </div>
                                <p className="text-[10px] font-black text-[#57534d]/60 uppercase tracking-widest"> ينضم إلينا تجار جدد يوميًا </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto">
                            <div className="absolute inset-0 bg-brand-primary/10 rounded-[4rem] rotate-6"></div>
                            <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,78,59,0.15)] bg-slate-100 group">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Modern Logistics"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/40 to-transparent"></div>
                            </div>

                            {/* Floating Elements */}
                            <motion.div
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50 flex items-center gap-4 z-20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            >
                                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#1c1919]">شحنة مكتملة</p>
                                    <p className="text-[10px] text-[#57534d] font-bold">تم التحصيل بنجاح</p>
                                </div>
                            </motion.div>
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
                            <h2 className="text-4xl font-black text-brand-secondary leading-tight tracking-tight">من نحن؟ رؤية تقنية <br /> لمستقبل النقل</h2>
                            <div className="h-1.5 w-20 bg-brand-primary rounded-full"></div>
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg text-[#57534d] font-bold leading-relaxed">
                                شحنتي هي منصة لوجستية رقمية تهدف إلى تطوير قطاع النقل والشحن داخل مصر، من خلال ربط التجار والمزارعين بالسائقين وشركات النقل في نظام واحد ذكي وسهل الاستخدام.
                            </p>
                            <p className="text-base text-[#57534d] font-medium leading-relaxed bg-brand-primary/5 p-6 rounded-3xl border-r-4 border-brand-primary">
                                نعتمد على نظام <strong>المزايدة الحي</strong>، حيث يمكن للعميل استقبال عدة عروض أسعار من مختلف السائقين، مع إمكانية <strong>التفاوض المباشر</strong> للوصول إلى السعر العادل الذي يضمن حقوق جميع الأطراف ويحقق أعلى كفاءة اقتصادية.
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
                                        <h5 className="font-black text-[#1c1919] mb-1">{item.title}</h5>
                                        <p className="text-sm text-[#57534d] font-bold">{item.desc}</p>
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
                        <h2 className="text-3xl font-black text-brand-secondary mb-3">  حلول ذكية لكل أطراف منظومة الشحن</h2>
                        <div className="h-1 w-12 bg-brand-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'للتجار', desc: 'تحكم كامل في شحناتك مع نظام مزايدة يضمن لك أفضل سعر وأسرع تنفيذ.', icon: Box },
                            { title: 'للسائقين', desc: 'فرص عمل يومية مع ضمان التحصيل الفوري.', icon: Truck },
                            { title: 'للشركات', desc: 'إدارة أسطول كامل مع تقارير أداء دقيقة.', icon: Building2 },
                            { title: 'للمحافظات', desc: 'رقابة رقمية شاملة وتحصيل آمن للرسوم.', icon: Globe },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center">
                                <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h4 className="text-lg font-black text-[#1c1919] mb-2">{item.title}</h4>
                                <p className="text-xs text-[#57534d] font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Problem Section - Enhanced Hover Aesthetics */}
            <section id="problem" className="py-24 bg-[#fdfcf6]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black text-brand-secondary mb-4 tracking-tight">لماذا صممنا "شحنتي"؟</h2>
                        <p className="text-[#57534d] font-bold leading-relaxed">جئنا لنحل أزمات النقل التقليدي التي كانت تستنزف وقتك ومالك.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'غياب الثقة', desc: 'صعوبة التحقق من هوية السائق أو جودة الخدمة قبل "شحنتي".', icon: ShieldCheck },
                            { title: 'عشوائية الرسوم', desc: 'مفيش نظام واضح لتحديد السعر… وغالبًا بتدفع أكتر من اللازم', icon: Wallet },
                            { title: 'ضياع الشحنات', desc: 'انعدام تكنولوجيا التتبع اللحظي مما عرض بضاعتك للخطر.', icon: MapPin },
                        ].map((item, i) => (
                            <div key={i} className="group relative bg-white p-10 rounded-[3rem] border border-slate-100/50 hover:shadow-[0_40px_80px_-20px_rgba(235,106,29,0.12)] hover:-translate-y-2 transition-all duration-500 text-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 h-16 w-16 mx-auto rounded-2xl bg-[#fffbeb] flex items-center justify-center mb-8 border border-orange-100 shadow-inner group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500 group-hover:rotate-6">
                                    <item.icon className="h-8 w-8 text-brand-primary group-hover:text-white" />
                                </div>
                                <h4 className="relative z-10 text-xl font-black text-[#1c1919] mb-4 tracking-wide group-hover:text-brand-primary transition-colors">{item.title}</h4>
                                <p className="relative z-10 text-sm text-[#57534d] font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section id="workflow" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-brand-secondary mb-4 tracking-tight">خطوات بسيطة وذكية</h2>
                        <div className="h-1.5 w-20 bg-brand-primary rounded-full mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative">
                        <div className="absolute top-10 left-10 right-10 h-0.5 bg-brand-primary/10 hidden md:block"></div>
                        {[
                            { title: 'سجل حسابك', icon: Users },
                            { title: 'أضف شحنتك', icon: Package },
                            { title: 'اختر عرضك', icon: TrendingUp },
                            { title: 'تابع المسار', icon: MapPin },
                            { title: 'تم التسليم', icon: CheckCircle2 },
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

            {/* Beneficiaries Section - Keep User's Fav Dark Green Style */}
            <section className="mt-20 bg-brand-secondary py-20 text-white rounded-t-[5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(235,106,29,0.1)_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-5xl font-black mb-6 leading-tight tracking-tight">نخدم مجتمعاً <br /> كاملاً من الرواد</h2>
                        <p className="text-white/60 font-bold text-lg max-w-md leading-relaxed">
                            سواء كنت فرداً، أو شركة لوجستية كبرى، "شحنتي" توفر البيئة الرقمية المثالية لنمو عملك.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { name: 'العلاء / التجار', icon: Users },
                            { name: 'السائقين', icon: Truck },
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
            <footer className="bg-[#043327] py-16 text-white border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
                        <div className="col-span-1 md:col-span-1 space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center">
                                    <Truck className="h-6 w-6" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">شحنتي</span>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed font-bold">
                                المنصة الرقمية الأولى في جمهورية مصر العربية المتخصصة في ربط سلاسل النقل اللوجستي والتحصيل الرقمي عن طريق المزايدة والتفاوض.
                            </p>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer">
                                    <Globe className="h-5 w-5" />
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all cursor-pointer">
                                    <Heart className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">روابط سريعة</h5>
                            <ul className="space-y-4 text-sm text-white/60 font-bold">
                                <li><HashLink smooth to="/#about" className="hover:text-white transition-colors">عن المنصة</HashLink></li>
                                <li><HashLink smooth to="/#workflow" className="hover:text-white transition-colors">آلية العمل</HashLink></li>
                                <li><Link to="/register?role=driver" className="hover:text-white transition-colors">انضم كسائق</Link></li>
                                <li><HashLink smooth to="/register" className="hover:text-white transition-colors">تسجيل الشركات</HashLink></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">الدعم والمساعدة</h5>
                            <ul className="space-y-4 text-sm text-white/60 font-bold">
                                <li><Link to="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
                                {/* <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li> */}
                                <li><Link to="/terms" className="hover:text-white transition-colors"> الشروط والأحكام</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">تواصل معنا</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">النشرة البريدية</h5>
                            <p className="text-xs text-white/40 font-bold">اشترك لتصلك آخر أخبار قطاع النقل اللوجستي.</p>
                            <div className="relative">
                                <input type="text" placeholder="بريدك الإلكتروني" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-brand-primary transition-all pr-5 pl-12" />
                                <button className="absolute left-2 top-2 bottom-2 bg-brand-primary text-white px-4 rounded-lg flex items-center justify-center">
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-col justify-center items-center gap-2">
                        <p className="text-xs text-white/30 font-bold tracking-wide">
                            © {new Date().getFullYear()} منصة شحنتي الرقمية. جميع الحقوق محفوظة   .
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                            MADE WITH <Heart className="h-3 w-3 text-brand-primary animate-pulse inline" /> BY ATWA_TECH TEAM
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage;
