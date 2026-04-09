import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Mail, Lock, ArrowLeft, Shield,
    CheckCircle2, RefreshCw, KeyRound, Eye, EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'



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
            console.log('Verify Reset Code Response:', res);

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

            console.log('Password Reset Successful for userId:', userId);
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
        <div className="min-h-screen bg-[#fffcf8] font-cairo flex flex-col relative overflow-hidden" dir="rtl">

            <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 text-center"
                >
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="inline-flex items-center justify-center h-20 w-20 bg-brand-primary/10 rounded-3xl mb-8 text-brand-primary">
                                    <KeyRound className="h-10 w-10" />
                                </div>
                                <h1 className="text-[28px] font-bold text-[#1c1919] mb-4">نسيت كلمة المرور؟</h1>
                                <p className="text-[#57534d] text-base mb-8">أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.</p>

                                <form onSubmit={handleSendCode} className="space-y-6">
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-bold text-[#57534d] block pr-1">البريد الإلكتروني</label>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value)
                                                    if (errors.email) setErrors({})
                                                }}
                                                placeholder="user@example.com"
                                                className={cn(
                                                    "w-full h-14 pr-12 pl-4 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                                                    errors.email ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                                )}
                                            />
                                            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                                        </div>
                                        {errors.email && <p className="text-xs text-red-500 font-bold pr-1">{errors.email}</p>}
                                    </div>



                                    <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-brand-primary hover:bg-orange-600 text-white font-black shadow-xl shadow-brand-primary/20">
                                        {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'إرسال الرمز'}
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="inline-flex items-center justify-center h-20 w-20 bg-brand-primary/10 rounded-3xl mb-8 text-brand-primary">
                                    <Shield className="h-10 w-10" />
                                </div>
                                <h1 className="text-[28px] font-bold text-[#1c1919] mb-4">تحقق من بريدك</h1>
                                <p className="text-[#57534d] text-base mb-8">أدخل الرمز المكون من 4 أرقام المرسل إلى <br /><span className="font-black text-brand-secondary">{email}</span></p>

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
                                                        "w-full h-16 md:h-20 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all shadow-sm border-slate-100 focus:border-brand-primary focus:bg-orange-50/30"
                                                    )}

                                                />
                                            ))}
                                        </div>
                                        {errors.otp && <p className="text-xs text-red-500 font-bold">{errors.otp}</p>}
                                    </div>



                                    <div className="space-y-4">
                                        <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-brand-primary hover:bg-orange-600 text-white font-black shadow-xl shadow-brand-primary/20">
                                            {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'تأكيد الرمز'}
                                        </Button>
                                        <button
                                            type="button"
                                            disabled={timer > 0 || isLoading}
                                            onClick={handleResendCode}
                                            className={cn("text-sm font-bold block mx-auto transition-colors", (timer > 0 || isLoading) ? "text-slate-300" : "text-brand-primary hover:underline")}
                                        >
                                            {timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : "إرسال مرة أخرى"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="inline-flex items-center justify-center h-20 w-20 bg-emerald-50 rounded-3xl mb-8 text-emerald-600">
                                    <Lock className="h-10 w-10" />
                                </div>
                                <h1 className="text-[28px] font-bold text-[#1c1919] mb-4">كلمة مرور جديدة</h1>
                                <p className="text-[#57534d] text-base mb-8">يرجى إدخال كلمة المرور الجديدة وتأكيدها.</p>

                                <form onSubmit={handleResetPassword} className="space-y-6 text-right">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#57534d] pr-2">كلمة المرور الجديدة</label>
                                        <div className="relative group">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value)
                                                    if (errors.newPassword) setErrors({})
                                                }}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "w-full h-14 pr-12 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                                                    errors.newPassword ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                                )}
                                            />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && <p className="text-xs text-red-500 font-bold pr-1">{errors.newPassword}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#57534d] block pr-1">تأكيد كلمة المرور</label>
                                        <div className="relative group">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value)
                                                    if (errors.confirmPassword) setErrors({})
                                                }}
                                                placeholder="••••••••"
                                                className={cn(
                                                    "w-full h-14 pr-12 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                                                    errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                                                )}
                                            />
                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs text-red-500 font-bold pr-1">{errors.confirmPassword}</p>}
                                    </div>



                                    <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-[#064e3b] hover:bg-[#053a2c] text-white font-black shadow-xl shadow-[#064e3b]/20">
                                        {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : 'حفظ كلمة المرور'}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Back Button */}
            <Link to="/login" className="absolute top-8 right-8 flex items-center gap-2 text-xs font-black text-[#57534d] hover:text-brand-primary transition-all group">
                <span>العودة لتسجيل الدخول</span>
                <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                </div>
            </Link>
        </div>
    )
}

export default ForgotPasswordPage
