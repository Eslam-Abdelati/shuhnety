import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "@/components/Logo";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";

export const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(59);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }

    // If already verified, go to login or home
    if (isAuthenticated && user?.is_verified) {
      navigate("/");
    }
  }, [email, navigate, isAuthenticated, user]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 4) {
      toast.error("يرجى إدخال رمز التحقق كاملاً");
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyEmail(email, otpValue);
      toast.success(
        "تم تفعيل بريدك الإلكتروني بنجاح! يمكنك الآن تسجيل الدخول.",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.message || "حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;

    setIsResending(true);
    try {
      const data = await authService.resendVerificationCode(email);
      setTimer(59);
      toast.success(
        data.message || "تم إعادة إرسال رمز التحقق إلي بريدك الإلكتروني بنجاح",
      );
    } catch (error) {
      toast.error(error.message || "فشل إعادة إرسال رمز التحقق");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row w-full h-screen overflow-hidden font-cairo bg-white"
      dir="rtl"
    >
      {/* Form inputs side */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-6 sm:p-12 md:py-12 md:px-16 lg:py-16 lg:px-24 overflow-y-auto md:overflow-hidden bg-white">
        <div className="mb-4 flex items-center justify-center gap-4">
          <Logo className="w-40" />
        </div>

        {/* Form Wrapper */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-8">
          <div className="space-y-3 flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold text-slate-900">
              تأكيد البريد الإلكتروني
            </h1>
            <p className="text-sm font-medium leading-relaxed">
              أدخل الرمز المكون من 4 أرقام المرسل إلى: <br />
              <span className="block font-semibold text-brand-primary mt-1">
                {email}
              </span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
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
                    "w-full h-14 text-center text-xl font-black rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all bg-slate-50/50 hover:bg-slate-50",
                    data
                      ? "border-brand-primary bg-orange-50/10 text-brand-primary font-black"
                      : "border-slate-200",
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full h-14 rounded-xl text-sm font-bold text-white bg-brand-secondary hover:bg-black transition-all shadow-xl shadow-brand-secondary/15 flex items-center justify-center cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loading minimal={true} className="text-white mx-auto" />
                ) : (
                  <span>تأكيد الرمز</span>
                )}
              </Button>

              <div className="text-center pt-2">
                {timer > 0 ? (
                  <p className="text-xs text-slate-900 font-semibold">
                    إعادة إرسال الرمز خلال {timer} ثانية
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-sm font-semibold text-brand-primary hover:underline transition-all cursor-pointer"
                  >
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 mt-6">
            <p className="text-sm font-medium text-slate-900">
              <Link
                className="font-semibold text-brand-primary hover:underline"
                to="/login"
              >
                العودة لتسجيل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-center pt-8 text-[11px] text-slate-900 font-semibold">
          © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة شيلة
        </div>
      </div>

      {/* Split Screen Image side */}
      <div className="hidden md:block w-1/2 h-full relative bg-slate-900">
        <img
          aria-hidden="true"
          className="object-cover w-full h-full opacity-70 select-none pointer-events-none"
          src="https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=1200"
          alt="Sheela Verification split screen image"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/80 to-slate-900/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(235,106,29,0.15)_0%,transparent_60%)]"></div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
