import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { LogoDefault ,logoWhite } from "../assets/logos";

// ==========================================
// 💡 إعدادات الشعارات (يمكنك تغييرها بسهولة من هنا)
// 💡 Logo Configurations (You can easily customize them here)
// ==========================================
export const BRAND_NAME = "شيلة";

export const LOGO_SOURCES = {
  default: LogoDefault, // الشعار الافتراضي الملون (logo.svg)
  colored: LogoDefault, // الشعار الملون
  white: logoWhite, // الشعار الأبيض (logo w.svg)
  dark: LogoDefault, // الشعار الداكن
};

/**
 * مكون أيقونة الشعار فقط (بدون نص)
 * Logo Icon-only component (without text)
 */
export function LogoIconOnly({
  className = "",
  variant = "default",
  src = "",
}) {
  // إذا تم تمرير مسار صورة مخصصة للأيقونة، يتم عرضها مباشرة
  if (src) {
    return (
      <img
        src={src}
        alt="Sheela Icon"
        className={cn("object-contain w-full h-full", className)}
      />
    );
  }

  // اللون الافتراضي للأيقونة هو البرتقالي الخاص بالبراند، والأبيض إذا كان الـ variant هو white
  const isWhite = variant === "white" || variant === "w";
  const fillHex = isWhite ? "#ffffff" : "#eb6a1d";
  const fillClass = isWhite ? "fill-white" : "fill-brand-primary";

  return (
    <svg
      viewBox="0 0 92 108"
      className={cn("w-full h-full object-contain", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.09,107.51,29.26,98.86,0,46.11,57.21,61.66l16.5,29.76A11.1,11.1,0,0,1,61.09,107.51Z"
        fill={fillHex}
        className={fillClass}
      />
      <path
        d="M30.2.49,62,9.14,91.29,61.89,34.07,46.34,17.57,16.58A11.1,11.1,0,0,1,30.2.49Z"
        fill={fillHex}
        className={fillClass}
      />
    </svg>
  );
}

/**
 * المكون الرئيسي للشعار (Logo)
 * يدعم العرض كصورة كاملة عريضة، أو كأيقونة مربعة مع نص بجانبها.
 */
export function Logo({
  className = "",
  iconClassName = "",
  boxClassName = "",
  textClassName = "",
  variant = "default",
  noLink = false,
  to = "/",
  withText = true,
  showText = true,
  src = "", // لتمرير صورة مخصصة للشعار بالكامل مباشرة
  iconSrc = "", // لتمرير صورة مخصصة للأيقونة فقط مباشرة
  brandName = BRAND_NAME,
}) {
  const isWhite = variant === "white" || variant === "w";
  const selectedLogo =
    src || (isWhite ? LOGO_SOURCES.white : LOGO_SOURCES.default);

  // تحديد ما إذا كان المكون يجب أن يُعرض كأيقونة مربعة + نص (نمط الشريط الجانبي وصفحات الدخول)
  // أو كصورة كاملة عريضة (نمط الهيدر والفوتر)
  const isIconBoxMode = !!boxClassName;

  let innerContent;

  if (isIconBoxMode) {
    // نمط الأيقونة المربعة + النص
    innerContent = (
      <div className={cn("flex items-center gap-2.5", className)}>
        {/* صندوق الأيقونة */}
        <div
          className={cn(
            "bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden flex items-center justify-center shrink-0",
            boxClassName,
          )}
        >
          <LogoIconOnly
            className={iconClassName || "h-6 w-6"}
            variant={variant}
            src={iconSrc}
          />
        </div>
        {/* نص اسم البراند */}
        {withText && showText && (
          <span className={cn("font-bold transition-colors", textClassName)}>
            {brandName}
          </span>
        )}
      </div>
    );
  } else {
    // نمط الصورة الكاملة العريضة للشعار (SVG الكامل)
    innerContent = (
      <img
        src={selectedLogo}
        alt={brandName}
        className={cn("h-auto max-w-full object-contain", className)}
      />
    );
  }

  if (noLink) {
    return innerContent;
  }

  return (
    <Link
      to={to}
      className="hover:opacity-95 transition-opacity inline-block group"
    >
      {innerContent}
    </Link>
  );
}

/**
 * مكون أيقونة الشعار (LogoIcon) كاسم مستعار أو نسخة مبسطة
 */
export function LogoIcon({ className = "", variant = "default", src = "" }) {
  return <LogoIconOnly className={className} variant={variant} src={src} />;
}

export default Logo;
