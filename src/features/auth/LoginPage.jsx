import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Mail, Lock, Eye, EyeOff, User,
    Shield, Box, Truck, Warehouse, CheckCircle2, ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/utils/cn'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { Loading } from '@/components/ui/Loading'


const loginSchema = z.object({
    email: z.string().trim().email('بريد إلكتروني غير صالح'),
    password: z.string().min(1, 'كلمة المرور مطلوبة'),
})

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)


    const login = useAuthStore(state => state.login)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onSubmit'
    })

    const onLoginSubmit = async (data) => {
        setIsLoading(true)


        const trimmedData = {
            ...data,
            email: data.email.trim()
        }

        try {
            // Use real API
            const response = await authService.login(trimmedData)

            // extract data exactly as it comes from API (it might be nested in response.data)
            const apiData = response.data || response;
            const { access_token, full_name, role: rawRole } = apiData;

            // console.log('Logged in user data:', apiData);

            if (!access_token) {
                console.error('Login failed: Token not found in response', response);
                throw new Error('فشل تسجيل الدخول: لم يتم العثور على رمز الوصول');
            }

            toast.success("تم تسجيل الدخول بنجاح")


            // Use uiRole for frontend navigation only
            const uiRole = rawRole === 'client' ? 'customer' : rawRole;

            // Pass RAW data to store to be saved in cookies
            login(apiData, uiRole);

            navigate(`/${uiRole === 'governorate' ? 'gov' : uiRole}`)

        } catch (error) {
            // Show error from API
            const errorMsg = error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            toast.error(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] font-cairo flex flex-col relative overflow-hidden" dir="rtl">
            <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
                <div className="max-w-[1240px] w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side: Visual Branding Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:flex flex-col items-center justify-center text-center space-y-10"
                    >
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative"
                        >
                            <div className="absolute -bottom-4 -left-4 -right-4 h-24 bg-brand-primary/20 blur-2xl rounded-full"></div>
                            <div className="relative bg-white p-2.5 rounded-[3rem] shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                                    className="w-[480px] h-[360px] object-cover rounded-[2.5rem]"
                                    alt="Logistics containers"
                                />
                            </div>
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-[30px] font-bold text-brand-secondary tracking-tight"> سيطر على شحناتك بسهولة وذكاء </h2>
                            <p className="text-[#57534d]  text-[16px]"> آلاف شركاء النقل مستعدين لخدمتك — اختر العرض المناسب وابدأ رحلتك فورًا. </p>

                            <div className="pt-2 flex items-center justify-center gap-6">
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <Shield className="h-3.5 w-3.5" /> آمن
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <Box className="h-3.5 w-3.5" /> سريع
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> موثوق
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Login Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-[550px] mx-auto"
                    >
                        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 relative overflow-hidden">

                            <div className="text-center mb-10 group">
                                <div className="inline-flex items-center justify-center h-16 w-16 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20 mb-4 text-white rotate-0 group-hover:rotate-4 transition-transform duration-500">
                                    <Box className="h-9 w-9" />
                                </div>
                                <h2 className="text-[26px] font-bold text-[#1c1919]"> تسجيل الدخول</h2>
                            </div>

                            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#57534d] block pr-1">البريد الإلكتروني</label>
                                    <div className="relative group">
                                        <input
                                            {...register('email')}
                                            placeholder="user@example.com"
                                            className={cn(
                                                "w-full h-14 pr-12 pl-4 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                                                errors.email ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                            )}
                                        />
                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 font-bold pr-1">{errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#57534d] block pr-1">كلمة المرور</label>
                                    <div className="relative group">
                                        <input
                                            {...register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className={cn(
                                                "w-full h-14 pr-12 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                                                errors.password ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                            )}
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 font-bold pr-1">{errors.password.message}</p>}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer" />
                                        <label htmlFor="remember" className="text-sm font-bold text-[#57534d] cursor-pointer">تذكرني</label>
                                    </div>
                                    <Link to="/forgot-password" size="sm" className="text-sm font-bold text-brand-primary hover:underline">نسيت كلمة المرور؟</Link>
                                </div>


                                <Button
                                    type="submit"
                                    className={cn(
                                        "w-full h-14 rounded-2xl text-base font-black transition-all shadow-lg",
                                        "bg-brand-primary hover:bg-orange-600 text-white shadow-brand-primary/20",
                                        isLoading && "opacity-80 cursor-not-allowed"
                                    )}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>جاري تسجيل الدخول...</span>
                                        </div>
                                    ) : 'تسجيل الدخول'}
                                </Button>

                                <div className="pt-4 text-center">
                                    <p className="text-sm font-bold text-[#57534d]">لا تملك حساب؟ <Link to="/register" className="text-brand-primary hover:text-orange-600 font-extrabold">سجل الآن</Link></p>
                                </div>


                            </form>

                            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-8 text-[11px] font-bold text-[#57534d]">
                                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> منصة لوجستية موثوقة</span>
                                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> آمنة ومشفرة</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Back Button */}
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-xs font-bold text-[#57534d] hover:text-brand-primary transition-all group">
                    <span>العودة للرئيسية</span>
                    <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </div>
                </Link>
            </div>
        </div>
    )
}


