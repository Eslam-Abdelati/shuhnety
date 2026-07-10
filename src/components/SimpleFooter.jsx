import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { ChevronLeft, Facebook, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const SimpleFooter = () => {
  return (
    <footer className="bg-[#043327] py-16 px-8 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-6">
          <div className="col-span-1 md:col-span-1 space-y-8">
            <Logo 
              noLink={true} 
              boxClassName="h-10 w-10 rounded-xl"
              iconClassName="h-6 w-6"
              textClassName="text-2xl font-black tracking-tighter text-white"
            />
            <p className="text-sm text-white/50 leading-relaxed font-bold">
              المنصة الرقمية الأولى المتخصصة في ربط سلاسل النقل والشحن عن طريق
              المزايدة والتفاوض.
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                title="فيسبوك"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/201203702198"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                title="واتساب"
              >
                <svg
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.273 1.97 13.802.946 11.98.946c-5.442 0-9.87 4.372-9.874 9.802-.001 1.814.497 3.58 1.44 5.161l-.952 3.478 3.57-.936zm11.367-7.251c-.33-.164-1.951-.955-2.251-1.063-.3-.11-.52-.164-.74.164-.22.33-.85 1.063-1.04 1.282-.19.219-.38.247-.71.082-1.68-.831-2.819-1.448-3.953-3.376-.3-.512.3-.475.86-1.581.09-.165.04-.31-.02-.474-.06-.164-.52-1.256-.71-1.72-.19-.448-.38-.387-.52-.394-.13-.007-.28-.008-.43-.008-.15 0-.39.055-.59.273-.2.22-.77.747-.77 1.822 0 1.075.79 2.115.9 2.265.11.15 1.55 2.348 3.75 3.293.52.223 1.08.384 1.56.452.53.076 1.01.066 1.39.01.42-.063 1.95-.79 2.22-1.518.27-.727.27-1.352.19-1.486-.08-.135-.3-.22-.63-.383z" />
                </svg>
              </a>
              <a
                href="tel:+201203702198"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                title="رقم الهاتف"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href="mailto:noreplymailer4@gmail.com"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all"
                title="البريد الإلكتروني"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">
              روابط سريعة
            </h5>
            <ul className="space-y-4 text-sm text-white/60 font-bold">
              <li>
                <HashLink
                  smooth
                  to="/#about"
                  className="hover:text-white transition-colors"
                >
                  عن المنصة
                </HashLink>
              </li>
              <li>
                <HashLink
                  smooth
                  to="/#workflow"
                  className="hover:text-white transition-colors"
                >
                  آلية العمل
                </HashLink>
              </li>
              <li>
                <Link
                  to="/register?role=driver"
                  className="hover:text-white transition-colors"
                >
                  انضم ككابتن
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">
              الدعم والمساعدة
            </h5>
            <ul className="space-y-4 text-sm text-white/60 font-bold">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors"
                >
                  سياسة الاستخدام والخصوصية
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors"
                >
                  {" "}
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="font-black text-brand-primary tracking-widest uppercase text-xs">
              النشرة البريدية
            </h5>
            <p className="text-xs text-white/40 font-bold">
              اشترك لتصلك آخر أخبار قطاع النقل اللوجستي.
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="بريدك الإلكتروني"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-brand-primary transition-all pr-5 pl-12"
              />
              <button className="absolute left-2 top-2 bottom-2 bg-brand-primary text-white px-4 rounded-lg flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col justify-center items-center gap-2">
          <p className="text-xs text-white/30 font-bold tracking-wide text-center">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة شحنتي
          </p>
        </div>
      </div>
    </footer>
  );
};
