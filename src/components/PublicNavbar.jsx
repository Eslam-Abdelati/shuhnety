import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Logo } from "@/components/ui/Logo";

export const PublicNavbar = () => {
  return (
    <nav className="bg-lp-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300 w-full">
      <div
        className="flex justify-between items-center max-w-lp-container-max mx-auto px-lp-margin-desktop py-4"
        dir="ltr"
      >
        {/* Left Column: Logo */}
        <div className="flex-1 flex justify-start">
          <Logo
            boxClassName="h-9 w-9 rounded-xl transition-all duration-300 group-hover:rotate-[10deg] group-hover:scale-105"
            iconClassName="h-4.5 w-4.5"
            textClassName="text-xl font-black text-lp-primary tracking-tight"
          />
        </div>

        {/* Middle Column: Page Links */}
        <div
          className="hidden md:flex gap-6 items-center justify-center flex-1"
          dir="rtl"
        >
          <HashLink
            smooth
            to="/#how"
            className="font-body-md text-lp-body-md font-medium text-lp-on-surface-variant hover:text-lp-primary transition-colors duration-300"
          >
            كيف نعمل
          </HashLink>
          <HashLink
            smooth
            to="/#why"
            className="font-body-md text-lp-body-md font-medium text-lp-on-surface-variant hover:text-lp-primary transition-colors duration-300"
          >
            لماذا شحنتي؟
          </HashLink>
          <HashLink
            smooth
            to="/#drivers"
            className="font-body-md text-lp-body-md font-medium text-lp-on-surface-variant hover:text-lp-primary transition-colors duration-300"
          >
            للكابتن
          </HashLink>
        </div>

        {/* Right Column: Auth Buttons */}
        <div className="flex items-center gap-4 flex-1" dir="rtl">
          <Link
            to="/login"
            className="hidden md:block font-body-md text-lp-body-md font-medium text-lp-on-surface-variant"
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="bg-lp-primary text-lp-on-primary px-6 py-2.5 rounded-full font-body-md font-bold scale-95 active:scale-90 transition-transform shadow-md"
          >
            ابدأ الآن
          </Link>
        </div>
      </div>
    </nav>
  );
};
