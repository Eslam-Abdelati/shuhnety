import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import Logo from "@/components/Logo";

export const PublicNavbar = () => {
  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm transition-all duration-300 w-full">
      <div
        className="flex justify-between items-center max-w-lp-container-max mx-auto px-lp-margin-mobile md:px-lp-margin-desktop py-3"
        dir="ltr"
      >
        {/* Left Column: Auth Buttons */}

        <div className="flex items-center justify-end gap-4 flex-1" dir="rtl">
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
            لماذا شيلة ؟
          </HashLink>
          <HashLink
            smooth
            to="/#drivers"
            className="font-body-md text-lp-body-md font-medium text-lp-on-surface-variant hover:text-lp-primary transition-colors duration-300"
          >
            للكابتن
          </HashLink>
        </div>

        {/* Right Column: Logo */}
        <div className="flex-1 flex justify-end">
          <Logo className="w-30 h-auto" />
        </div>
      </div>
    </nav>
  );
};
