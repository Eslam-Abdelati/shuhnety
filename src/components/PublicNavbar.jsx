import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export const PublicNavbar = () => {
    return (
        <nav className="fixed w-full z-[100] transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Logo 
                    boxClassName="h-10 w-10 rounded-[0.9rem] transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110" 
                    iconClassName="h-5.5 w-5.5" 
                />

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
    );
};
