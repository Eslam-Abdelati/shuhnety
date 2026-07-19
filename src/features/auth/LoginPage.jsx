import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";
import { Logo } from "@/components/ui/Logo";
import { authService } from "@/services/authService";
import { toast } from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";

const loginSchema = z.object({
  email: z.string().trim().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    const trimmedData = {
      ...data,
      email: data.email.trim(),
    };

    try {
      // Use real API
      const response = await authService.login(trimmedData);

      // extract data exactly as it comes from API (it might be nested in response.data)
      const apiData = response.data || response;
      const { access_token, isVerified, is_verified, role: rawRole } = apiData;
      const verified = isVerified ?? is_verified;

      if (!access_token && verified === false) {
        toast.error("يجب تفعيل البريد الإلكتروني أولاً قبل تسجيل الدخول");

        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: data.email.trim(),
              role: rawRole === "client" ? "customer" : rawRole,
            },
          });
        }, 2000);
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح");

      // Use uiRole for frontend navigation only
      const uiRole = rawRole === "client" ? "customer" : rawRole;

      // Pass RAW data to store to be saved in cookies
      login(apiData, uiRole);

      navigate(`/${uiRole === "governorate" ? "gov" : uiRole}`);
    } catch (error) {
      // Show error from API
      const errorMsg =
        error.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row w-full h-screen overflow-hidden font-cairo bg-white"
      dir="rtl"
    >
      {/* Form inputs side */}
      <div className="w-full md:w-1/2 h-full flex flex-col justify-between p-6 sm:p-12 md:py-12 md:px-16 lg:py-16 lg:px-24 overflow-y-auto md:overflow-hidden bg-white">
        {/* Top Logo / Navigation */}
        <div className="mb-8">
          <Logo
            boxClassName="h-9 w-9 rounded-xl transition-all duration-300 group-hover:rotate-[10deg] group-hover:scale-105"
            iconClassName="h-4 w-4"
            textClassName="text-xl font-black text-brand-secondary tracking-tight"
          />
        </div>

        {/* Form Wrapper */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-8">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-slate-900">تسجيل الدخول</h1>
            <p className="text-sm font-medium">
              مرحباً بك مجدداً ! يرجى إدخال بياناتك للدخول لحسابك.
            </p>
          </div>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
            <div className="space-y-1.5 text-sm">
              <span className="text-slate-700 font-bold block">
                البريد الإلكتروني
              </span>
              <input
                {...register("email")}
                className={cn(
                  "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-4 py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                  errors.email ? "border-red-500" : "border-slate-200",
                )}
                placeholder="example@mail.com"
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block font-semibold">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-1.5 text-sm relative">
              <span className="text-slate-700 font-bold block">
                كلمة المرور
              </span>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className={cn(
                    "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary pr-4 pl-12 py-3.5 transition-all bg-slate-50/50 hover:bg-slate-50",
                    errors.password ? "border-red-500" : "border-slate-200",
                  )}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-xs text-red-500 mt-1 block font-semibold">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="text-left">
              <Link
                className="text-xs font-bold text-brand-primary hover:underline"
                to="/forgot-password"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl text-sm font-black text-white bg-brand-primary transition-all shadow-xl shadow-brand-secondary/15 flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <Loading minimal={true} className="text-white mx-auto" />
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm font-medium text-slate-500">
              ليس لديك حساب؟{" "}
              <Link
                className="font-bold text-brand-primary hover:underline"
                to="/register"
              >
                إنشاء حساب جديد
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
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200"
          alt="Shahnti Logistics split screen image"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/80 to-slate-900/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(235,106,29,0.15)_0%,transparent_60%)]"></div>

        {/* Floating Brand Text */}
        <div className="absolute bottom-10 right-10 left-20 text-white space-y-4">
          <h2 className="text-2xl font-bold leading-tight drop-shadow-md">
            طريقك الأسرع لتوصيل شحناتك بأمان وثقة
          </h2>
          <p className="text-slate-200/80 max-w-sm leading-relaxed">
            منصة شحنتي توفر لك البيئة الرقمية الأكثر كفاءة للتفاوض المباشر وتتبع
            شحنتك لحظة بلحظة.
          </p>
        </div>
      </div>
    </div>
  );
};
