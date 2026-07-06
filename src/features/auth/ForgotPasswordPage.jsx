import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Truck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { Loading } from '@/components/ui/Loading'



export const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', ''])
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const [timer, setTimer] = useState(0)
    const [userId, setUserId] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        let interval = null
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleSendCode = async (e) => {
        e.preventDefault()

        const newErrors = {}
        if (!email) {
            newErrors.email = 'يرجى إدخال البريد الإلكتروني'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'بريد إلكتروني غير صالح'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        try {
            await authService.forgotPassword(email)
            setStep(2)
            setTimer(59)
            setErrors({})
            toast.success('تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني')

        } catch (error) {
            toast.error(error.message || 'فشل إرسال رمز التحقق')
        } finally {

            setIsLoading(false)
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault()

        if (otp.join('').length < 4) {
            toast.error('يرجى إدخال الرمز كاملاً')
            setErrors({ otp: 'يرجى إدخال الرمز كاملاً' })
            return
        }

        setIsLoading(true)
        try {
            const code = otp.join('')
            const res = await authService.verifyResetCode(email, code)
            toast.success('تم التحقق من الرمز بنجاح');

            // Assuming res.data.id or res.id contains the userId
            const id = res?.data?.id || res?.id || res?.userId || res?.data?.userId;
            if (id) {
                setUserId(id);
            }

            setStep(3)
            setErrors({})
        } catch (error) {
            toast.error(error.message || 'رمز التحقق غير صحيح')
        } finally {

            setIsLoading(false)
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()

        const newErrors = {}
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/

        if (!passwordRegex.test(newPassword)) {
            newErrors.newPassword = 'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، تشمل أرقاماً وحروفاً'
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'كلمات المرور غير متطابقة'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        try {
            const code = otp.join('')
            await authService.resetPassword({
                userId: userId, // Using the stored userId
                password: newPassword,
                confirm_password: confirmPassword
            })
            toast.success('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.')
            setTimeout(() => navigate('/login'), 2000)

        } catch (error) {
            toast.error(error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى')
        } finally {

            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (timer > 0 || isLoading) return
        setIsLoading(true)

        try {
            await authService.forgotPassword(email)
            setTimer(59)
            toast.success('تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني')

        } catch (error) {
            toast.error(error.message || 'فشل إعادة إرسال الرمز')
        } finally {

            setIsLoading(false)
        }
    }

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false
        if (errors.otp) setErrors({})
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus()
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row w-full h-screen overflow-hidden font-cairo bg-white" dir="rtl">
            {/* Form inputs side */}
            <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-6 sm:p-12 md:py-12 md:px-16 lg:py-16 lg:px-24 overflow-y-auto md:overflow-hidden bg-white">
                {/* Top Logo / Navigation */}
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
                        <div className="h-9 w-9 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-md shadow-brand-primary/25 transition-all duration-300 group-hover:rotate-[10deg] group-hover:scale-105">
                            <Truck className="h-4 w-4" />
                        </div>
                        <span className="text-xl font-black text-brand-secondary tracking-tight">شحنتي</span>
                    </Link>
                </div>

                {/* Form Wrapper */}
                <div className="my-auto max-w-sm w-full mx-auto space-y-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-black text-slate-900">نسيت كلمة المرور؟</h1>
                                <p className="text-sm text-slate-500 font-medium">أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.</p>
                            </div>
                            <form onSubmit={handleSendCode} className="space-y-5">
                                <div className="space-y-1.5 text-sm">
                                    <span className="text-slate-700 font-bold block">البريد الإلكتروني</span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            if (errors.email) setErrors({})
                                        }}
                                        placeholder="example@mail.com"
                                        className={cn(
                                            "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-4 py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                                            errors.email ? "border-red-500" : "border-slate-200"
                                        )}
                                    />
                                    {errors.email && <span className="text-xs text-red-500 mt-1 block font-semibold">{errors.email}</span>}
                                </div>
                                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-sm font-black text-white bg-brand-secondary hover:bg-black transition-all shadow-xl shadow-brand-secondary/15 flex items-center justify-center cursor-pointer">
                                    {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'إرسال الرمز'}
                                </Button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-black text-slate-900">تحقق من بريدك</h1>
                                <p className="text-sm text-slate-500 font-medium">أدخل الرمز المكون من 4 أرقام المرسل إلى <br /><span className="font-bold text-brand-primary">{email}</span></p>
                            </div>
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-4 gap-4 w-full" dir="ltr">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={data}
                                                onChange={(e) => handleOtpChange(e.target, index)}
                                                className={cn(
                                                    "block w-full text-center mt-1 text-2xl font-bold rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                                                    errors.otp ? "border-red-500" : "border-slate-200"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {errors.otp && <span className="text-xs text-red-500 mt-1 block font-semibold">{errors.otp}</span>}
                                </div>
                                <div className="space-y-4">
                                    <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-sm font-black text-white bg-brand-secondary hover:bg-black transition-all shadow-xl shadow-brand-secondary/15 flex items-center justify-center cursor-pointer">
                                        {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'تأكيد الرمز'}
                                    </Button>
                                    <button
                                        type="button"
                                        disabled={timer > 0 || isLoading}
                                        onClick={handleResendCode}
                                        className={cn("text-xs font-bold block mx-auto transition-colors cursor-pointer", (timer > 0 || isLoading) ? "text-slate-400" : "text-brand-primary hover:underline")}
                                    >
                                        {timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : "إرسال مرة أخرى"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h1 className="text-3xl font-black text-slate-900">كلمة مرور جديدة</h1>
                                <p className="text-sm text-slate-500 font-medium">يرجى إدخال كلمة المرور الجديدة وتأكيدها.</p>
                            </div>
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div className="space-y-1.5 text-sm relative">
                                    <span className="text-slate-700 font-bold block">كلمة المرور الجديدة</span>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => {
                                                setNewPassword(e.target.value)
                                                if (errors.newPassword) setErrors({})
                                            }}
                                            placeholder="••••••••"
                                            className={cn(
                                                "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary pr-4 pl-12 py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                                                errors.newPassword ? "border-red-500" : "border-slate-200"
                                            )}
                                        />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.newPassword && <span className="text-xs text-red-500 mt-1 block font-semibold">{errors.newPassword}</span>}
                                </div>

                                <div className="space-y-1.5 text-sm relative">
                                    <span className="text-slate-700 font-bold block">تأكيد كلمة المرور</span>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                setConfirmPassword(e.target.value)
                                                if (errors.confirmPassword) setErrors({})
                                            }}
                                            placeholder="••••••••"
                                            className={cn(
                                                "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary pr-4 pl-12 py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                                                errors.confirmPassword ? "border-red-500" : "border-slate-200"
                                            )}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block font-semibold">{errors.confirmPassword}</span>}
                                </div>

                                <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-xl text-sm font-black text-white bg-brand-secondary hover:bg-black transition-all shadow-xl shadow-brand-secondary/15 flex items-center justify-center cursor-pointer">
                                    {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'حفظ كلمة المرور'}
                                </Button>
                            </form>
                        </div>
                    )}

                    <div className="text-center pt-2 border-t border-slate-100 mt-6">
                        <p className="text-sm font-medium text-slate-500">
                            <Link className="font-bold text-brand-primary hover:underline" to="/login">
                                العودة لتسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="text-center pt-8 text-[11px] text-slate-400 font-bold">
                    © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة شحنتي
                </div>
            </div>

            {/* Split Screen Image side */}
            <div className="hidden md:block w-1/2 h-full relative bg-slate-900">
                <img
                    aria-hidden="true"
                    className="object-cover w-full h-full opacity-70 select-none pointer-events-none"
                    src="https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=1200"
                    alt="Shahnti Logistics split screen image"
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/80 to-slate-900/50 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(235,106,29,0.15)_0%,transparent_60%)]"></div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage

