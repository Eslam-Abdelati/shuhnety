import { Link } from 'react-router-dom'
import { Truck } from 'lucide-react'

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 font-cairo relative overflow-hidden" dir="rtl">
            {/* Soft Ambient Gradients */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-secondary/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center h-24 w-24 bg-gradient-to-br from-brand-primary to-blue-900 text-white rounded-[2.5rem] mb-10 shadow-2xl shadow-brand-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Truck className="h-12 w-12" />
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">{title}</h2>
                    <p className="text-slate-500 text-xl font-medium max-w-xs mx-auto">{subtitle}</p>
                </div>
            </div>

            <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
                <div className="bg-white/80 backdrop-blur-xl py-12 px-12 shadow-[0_40px_80px_-15px_rgba(30,58,138,0.08)] border border-white/20 rounded-[3.5rem] relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-[3.5rem]"></div>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                {/* Footer text in Auth */}
                <div className="mt-12 text-center space-y-4">
                    <p className="text-sm text-slate-400 font-bold tracking-wide">
                        جميع الحقوق محفوظة © لمنصة شحنتي {new Date().getFullYear()}
                    </p>
                    <div className="flex justify-center gap-6 text-xs font-bold text-slate-300">
                        <a href="#" className="hover:text-brand-secondary transition-colors underline decoration-slate-200 underline-offset-4">سياسة الخصوصية</a>
                        <Link to="/terms" className="hover:text-brand-secondary transition-colors underline decoration-slate-200 underline-offset-4">شروط الخدمة</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
