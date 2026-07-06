import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
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
        <div className="flex items-center min-h-screen p-6 bg-gray-50 font-cairo" dir="rtl">
            <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
                <div className="flex flex-col overflow-y-auto md:flex-row">
                    <div className="h-32 md:h-auto md:w-1/2">
                        <img
                            aria-hidden="true"
                            className="object-cover w-full h-full"
                            src="https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=800"
                            alt="Forgot Password"
                        />
                    </div>
                    <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
                        <div className="w-full">
                            {step === 1 && (
                                <div>
                                    <h1 className="mb-4 text-xl font-semibold text-gray-700">نسيت كلمة المرور؟</h1>
                                    <p className="text-sm text-gray-600 mb-6">أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.</p>
                                    <form onSubmit={handleSendCode}>
                                        <label className="block text-sm">
                                            <span className="text-gray-700">البريد الإلكتروني</span>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value)
                                                    if (errors.email) setErrors({})
                                                }}
                                                placeholder="user@example.com"
                                                className={cn(
                                                    "block w-full mt-1 text-sm rounded-md border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-3 py-2",
                                                    errors.email ? "border-red-500" : "border-gray-300"
                                                )}
                                            />
                                            {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>}
                                        </label>
                                        <Button type="submit" disabled={isLoading} className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-brand-primary border border-transparent rounded-lg active:bg-brand-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                                            {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'إرسال الرمز'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {step === 2 && (
                                <div>
                                    <h1 className="mb-4 text-xl font-semibold text-gray-700">تحقق من بريدك</h1>
                                    <p className="text-sm text-gray-600 mb-6">أدخل الرمز المكون من 4 أرقام المرسل إلى <br /><span className="font-bold text-brand-primary">{email}</span></p>
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
                                                            "block w-full text-center mt-1 text-2xl font-bold rounded-md border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary py-3",
                                                            errors.otp ? "border-red-500" : "border-gray-300"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            {errors.otp && <span className="text-xs text-red-500 mt-1 block">{errors.otp}</span>}
                                        </div>
                                        <div className="space-y-4">
                                            <Button type="submit" disabled={isLoading} className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-brand-primary border border-transparent rounded-lg active:bg-brand-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                                                {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'تأكيد الرمز'}
                                            </Button>
                                            <button
                                                type="button"
                                                disabled={timer > 0 || isLoading}
                                                onClick={handleResendCode}
                                                className={cn("text-sm font-medium block mx-auto transition-colors", (timer > 0 || isLoading) ? "text-gray-400" : "text-brand-primary hover:underline")}
                                            >
                                                {timer > 0 ? `إعادة الإرسال خلال ${timer} ثانية` : "إرسال مرة أخرى"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {step === 3 && (
                                <div>
                                    <h1 className="mb-4 text-xl font-semibold text-gray-700">كلمة مرور جديدة</h1>
                                    <p className="text-sm text-gray-600 mb-6">يرجى إدخال كلمة المرور الجديدة وتأكيدها.</p>
                                    <form onSubmit={handleResetPassword} className="space-y-4">
                                        <label className="block text-sm relative">
                                            <span className="text-gray-700">كلمة المرور الجديدة</span>
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
                                                        "block w-full mt-1 text-sm rounded-md border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary pr-3 pl-10 py-2",
                                                        errors.newPassword ? "border-red-500" : "border-gray-300"
                                                    )}
                                                />
                                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {errors.newPassword && <span className="text-xs text-red-500 mt-1 block">{errors.newPassword}</span>}
                                        </label>

                                        <label className="block text-sm relative">
                                            <span className="text-gray-700">تأكيد كلمة المرور</span>
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
                                                        "block w-full mt-1 text-sm rounded-md border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary pr-3 pl-10 py-2",
                                                        errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                                    )}
                                                />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && <span className="text-xs text-red-500 mt-1 block">{errors.confirmPassword}</span>}
                                        </label>

                                        <Button type="submit" disabled={isLoading} className="block w-full px-4 py-2 mt-6 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-brand-primary border border-transparent rounded-lg active:bg-brand-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2">
                                            {isLoading ? <Loading minimal={true} className="text-white mx-auto" /> : 'حفظ كلمة المرور'}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            <hr className="my-8" />
                            <p className="mt-4 text-center">
                                <Link className="text-sm font-medium text-brand-primary hover:underline" to="/login">
                                    العودة لتسجيل الدخول
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage

