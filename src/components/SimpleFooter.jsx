import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'
import { Truck, ChevronLeft, Globe, Heart } from 'lucide-react'

export const SimpleFooter = () => {
    return (
        <footer className="bg-[#043327] py-16 px-8 text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-6">
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
                            <li><Link to="/register?role=driver" className="hover:text-white transition-colors">انضم ككابتن</Link></li>
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

                <div className="pt-8 border-t border-white/5 flex flex-col justify-center items-center gap-2">
                    <p className="text-xs text-white/30 font-bold tracking-wide text-center">
                        جميع الحقوق محفوظة شحنتي {new Date().getFullYear()} ©.
                    </p>
                </div>
            </div>
        </footer>
    );
};

