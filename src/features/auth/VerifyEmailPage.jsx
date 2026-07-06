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
        <div className="flex items-center min-h-screen p-6 bg-gray-50 font-cairo" dir="rtl">
            <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl relative">
                <div className="flex flex-col overflow-y-auto md:flex-row">
                    {/* Side Image */}
                    <div className="h-32 md:h-auto md:w-1/2 relative overflow-hidden">
                        <img
                            aria-hidden="true"
                            className="object-cover w-full h-full"
                            src="https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=800"
                            alt="Verification"
                        />
                        <div className="absolute inset-0 bg-brand-primary/5 backdrop-blur-[1px]"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/10 backdrop-blur-md p-5 rounded-2xl mb-4"
                            >
                                <Shield className="h-10 w-10 text-white" />
                            </motion.div>
                            <h2 className="text-xl font-semibold mb-2">أمان حسابك</h2>
                            <p className="text-xs font-medium opacity-90">تحقق من بريدك الإلكتروني لضمان أمان معاملاتك</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2 bg-white">
                        <div className="w-full">
                            <motion.div
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-700 mb-2">تأكيد البريد الإلكتروني</h1>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        أدخل الرمز المكون من 4 أرقام المرسل إلى:
                                        <span className="block font-semibold text-brand-primary mt-1">{email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleVerify} className="space-y-6">
                                    <div className="grid grid-cols-4 gap-3" dir="ltr">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={data}
                                                onChange={(e) => handleChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className={cn(
                                                    "w-full h-12 text-center text-xl font-semibold rounded-md border outline-none transition-all",
                                                    data ? "border-brand-primary bg-orange-50/20" : "border-gray-300 bg-white focus:border-brand-primary"
                                                )}
                                            />
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-10 text-sm font-medium rounded-md bg-brand-primary hover:bg-orange-600 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <Loading minimal={true} className="text-white" />
                                            ) : (
                                                <span>تأكيد الرمز</span>
                                            )}
                                        </Button>

                                        <div className="text-center pt-2">
                                            {timer > 0 ? (
                                                <p className="text-xs text-gray-400">
                                                    إعادة إرسال الرمز خلال {timer} ثانية
                                                </p>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResend}
                                                    disabled={isResending}
                                                    className="text-sm font-medium text-brand-primary hover:underline transition-all"
                                                >
                                                    {isResending ? (
                                                        <Loading minimal={true} size="xs" />
                                                    ) : "إرسال الرمز مرة أخرى"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>

                                <hr className="border-gray-100" />

                                <div className="text-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-sm font-medium text-brand-primary hover:underline"
                                    >
                                        العودة لتسجيل الدخول
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

