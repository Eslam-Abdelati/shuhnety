import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Facebook, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const SimpleFooter = () => {
  return (
    <footer className="bg-lp-on-background text-lp-background py-12 border-t border-lp-surface-variant/10 font-cairo">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 max-w-sm">
            <Logo 
              noLink={true} 
              boxClassName="h-10 w-10 rounded-xl bg-white"
              iconClassName="h-6 w-6"
              textClassName="text-2xl font-black tracking-tighter text-lp-primary-fixed"
            />
            <p className="text-lp-surface-variant/70 text-sm leading-relaxed font-bold">
              سوق الخدمات اللوجستية الأول في المنطقة الذي يجمع بين سهولة الاستخدام، تنافسية الأسعار، وموثوقية الخدمة.
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="font-bold text-white text-base">الروابط</div>
              <nav className="flex flex-col gap-2.5 text-lp-surface-variant/70 text-sm font-bold">
                <HashLink smooth to="/#how" className="hover:text-lp-primary transition-colors">
                  كيف يعمل
                </HashLink>
                <HashLink smooth to="/#why" className="hover:text-lp-primary transition-colors">
                  لماذا نحن
                </HashLink>
                <HashLink smooth to="/#drivers" className="hover:text-lp-primary transition-colors">
                  الكباتن
                </HashLink>
              </nav>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="font-bold text-white text-base">قانوني</div>
              <nav className="flex flex-col gap-2.5 text-lp-surface-variant/70 text-sm font-bold">
                <Link to="/privacy" className="hover:text-lp-primary transition-colors">
                  سياسة الخصوصية
                </Link>
                <Link to="/terms" className="hover:text-lp-primary transition-colors">
                   الشروط والأحكام
                </Link>
              </nav>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div className="font-bold text-white text-base">تواصل</div>
              <nav className="flex flex-col gap-2.5 text-lp-surface-variant/70 text-sm font-bold">
                <Link to="/faq" className="hover:text-lp-primary transition-colors">
                  مركز المساعدة
                </Link>
                <Link to="/contact" className="hover:text-lp-primary transition-colors">
                  اتصل بنا
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-lp-surface-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 text-lp-surface-variant/50 text-xs font-bold">
          <div>© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة شحنتي.</div>
          
          {/* User's Social Links (Preserved!) */}
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/share/194ZhVum8Q/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lp-primary hover:text-white transition-all"
              title="فيسبوك"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/201208723809"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lp-primary hover:text-white transition-all"
              title="واتساب"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.004 0C5.378 0 .004 5.374.004 12c0 2.112.551 4.167 1.597 5.978L0 24l6.195-1.625C7.94 23.386 9.949 24 12.004 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm6.684 17.02c-.27.76-1.563 1.402-2.164 1.487-.534.075-1.047.278-3.415-.658-3.03-1.197-4.962-4.286-5.113-4.488-.15-.202-1.222-1.625-1.222-3.1 0-1.476.772-2.202 1.047-2.502.275-.3.6-.375.8-.375h.57c.182.005.424-.007.658.542.24.563.824 2.009.897 2.158.073.15.123.324.024.524-.098.2-.149.324-.298.5-.15.174-.31.39-.443.522-.146.146-.3.306-.13.595.17.29.756 1.246 1.623 2.015.717.636 1.32.96 1.623 1.11.3.15.474.125.65-.075.176-.2.756-.878.96-1.178.2-.3.402-.25.677-.15.275.1.1 .475 2.176 1.503.2.1.325.15.424.3.1.15.1.86-.17 1.62z" />
              </svg>
            </a>
            <a
              href="tel:+201208723809"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lp-primary hover:text-white transition-all"
              title="رقم الهاتف"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href="mailto:noreplymailer4@gmail.com"
              className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-lp-primary hover:text-white transition-all"
              title="البريد الإلكتروني"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
