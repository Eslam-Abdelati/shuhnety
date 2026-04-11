import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Shield, CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/store/useAuthStore'

import { authService } from '@/services/authService'
import { toast } from 'react-hot-toast'
import { Loading } from '@/components/ui/Loading'


export const VerifyEmailPage = () => {
    const [otp, setOtp] = useState(['', '', '', ''])
    const [isLoading, setIsLoading] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [timer, setTimer] = useState(59)

    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user } = useAuthStore()


    const { email, role } = location.state || {}

    useEffect(() => {
        if (!email) {
            navigate('/register')
        }
        
        // If already verified, go to login or home
        if (isAuthenticated && user?.is_verified) {
            navigate('/')
        }
    }, [email, navigate, isAuthenticated, user])


    useEffect(() => {
        let interval = null
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        } else {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [timer])

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false


        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (otp[index] === '' && e.target.previousSibling) {
                e.target.previousSibling.focus()
            }
        }
    }

    const handleVerify = async (e) => {
        e.preventDefault()
        const otpValue = otp.join('')

        if (otpValue.length < 4) {
            toast.error('يرجى إدخال رمز التحقق كاملاً')
            return
        }


        setIsLoading(true)
        try {
            await authService.verifyEmail(email, otpValue)

            toast.success('تم تفعيل بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.')


            setTimeout(() => {
                navigate('/login')
            }, 2000)
        } catch (error) {
            const errorMsg = error.message || 'حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى';
            toast.error(errorMsg)
        } finally {

            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (timer > 0 || isResending) return

        setIsResending(true)
        try {
            const data = await authService.resendVerificationCode(email)
            setTimer(59)
            toast.success(data.message || 'تم إعادة إرسال رمز التحقق إلي بريدك الإلكتروني بنجاح')

        } catch (error) {
            toast.error(error.message || 'فشل إعادة إرسال رمز التحقق')
        } finally {

            setIsResending(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] font-cairo flex flex-col relative overflow-hidden" dir="rtl">

            <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 text-center"
                >
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-brand-primary/10 rounded-3xl mb-8 text-brand-primary">
                        <Mail className="h-10 w-10" />
                    </div>

                    <h1 className="text-[28px] font-bold text-[#1c1919] mb-4">تأكيد البريد الإلكتروني</h1>
                    <p className="text-[#57534d] text-base mb-8">
                        لقد أرسلنا رمز المكون من 4 أرقام إلى <br />
                        <span className="font-black text-brand-secondary">{email}</span>
                    </p>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-4 w-full" dir="ltr">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        value={data}
                                        onChange={(e) => handleChange(e.target, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className={cn(
                                            "w-full h-16 md:h-20 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all shadow-sm border-slate-100 focus:border-brand-primary focus:bg-orange-50/30"

                                        )}
                                    />
                                ))}
                            </div>
                        </div>


                        <div className="space-y-4">
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl bg-brand-primary hover:bg-orange-600 text-white font-black shadow-xl shadow-brand-primary/20 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loading minimal={true} className="text-white" text="جاري التحقق..." />
                                ) : 'تأكيد الرمز'}
                            </Button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timer > 0 || isResending}
                                className={cn(
                                    "text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors",
                                    (timer > 0 || isResending) ? "text-slate-400 cursor-not-allowed" : "text-brand-primary hover:underline"
                                )}
                            >
                                {isResending ? (
                                    <Loading minimal={true} className="text-brand-primary" />
                                ) : null}
                                {timer > 0 ? (
                                    <>إعادة إرسال الرمز خلال {timer} ثانية</>
                                ) : isResending ? (
                                    <>جاري الإرسال...</>
                                ) : (
                                    <>إرسال الرمز مرة أخرى</>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> حماية متقدمة</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> تحقق رقمي</span>
                    </div>
                </motion.div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/register')}
                className="absolute top-8 right-8 flex items-center gap-2 text-xs font-black text-[#57534d] hover:text-brand-primary transition-all group"
            >
                <span>العودة للتسجيل</span>
                <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                </div>
            </button>
        </div>
    )
}

