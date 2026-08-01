import React, { useState, useRef, useEffect, forwardRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Truck,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  Lock,
  Box,
  Shield,
  Calendar,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Info,
  Check,
  Upload,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { toast } from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/utils/cn";

// Services
import { authService } from "@/services/authService";
import { locationService } from "@/services/locationService";
import { API_BASE_URL } from "@/api/axiosClient";
// import { StatusAlert } from '@/components/ui/StatusAlert'
import { Loading } from "@/components/ui/Loading";

// --- Backend Enums ---
export const AvailabilityField = {
  EMAIL: "email",
  PHONE: "phone_number",
  NATIONAL_ID: "national_id",
  LICENSE_NUMBER: "license_number",
  PLATE_NUMBER: "vehicle_plate_number",
};

export const GoodsType = {
  ELECTRONICS: "electronics",
  APPLIANCES: "appliances",
  FURNITURE: "furniture",
  HOUSEWARES: "housewares",
  TEXTILES: "textiles",
  FOOD: "food",
  AGRICULTURAL: "agricultural",
  CONSTRUCTION: "construction",
  CHEMICALS: "chemicals",
  MACHINERY: "machinery",
  OTHER: "other",
};

export const RegisterStatus = {
  PENDING_REVIEW: "pending_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

export const VehicleType = {
  MEDIUM_TRUCK: "MediumTruck", // للشاحنات المتوسطة (النصف نقل)
  PICKUP: "Pickup", // للشاحنات الخفيفة (الربع نقل)
  MINI_TRUCK: "MiniTruck", // للشاحنات الصغيرة (السوزوكي الربع حوض)
  CARGO_TRIKE: "CargoTricycle", //التروسيكل
  OTHER: "Other",
};

export const UserRole = {
  CLIENT: "client",
  DRIVER: "driver",
  ADMIN: "admin",
};

// --- Helpers ---
const findStr = (obj) => {
  if (typeof obj === "string") return obj;
  if (typeof obj !== "object" || obj === null) return null;

  // Check common keys directly first
  const keys = ["url", "data", "link", "file", "path", "filePath"];
  for (const key of keys) {
    if (
      typeof obj[key] === "string" &&
      (obj[key].startsWith("http") || obj[key].includes("."))
    ) {
      return obj[key];
    }
  }

  // Deep search in values
  for (let v of Object.values(obj)) {
    if (
      typeof v === "string" &&
      (v.startsWith("http") || v.includes(".") || v.startsWith("/"))
    ) {
      return v;
    }
    if (typeof v === "object" && v !== null) {
      const nested = findStr(v);
      if (nested) return nested;
    }
  }
  return null;
};

// --- Validation Objects (unrefined for extension) ---
const baseFields = z.object({
  fullName: z.string().trim().min(5, "الأسم الكامل يجب أن يكون أكثر من 5 أحرف"),
  email: z.string().trim().email("بريد إلكتروني غير صالح"),
  phone: z
    .string()
    .trim()
    .regex(/^01[0125]\d{8}$/, "رقم هاتف مصري غير صالح"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن لا تقل عن 8 أحرف")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتشمل حرف كبير وصغير ورقم ورمز خاص",
    ),
  confirmPassword: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
});

const addressFields = z.object({
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  addressDetail: z.string().min(10, "العنوان يجب أن يكون مفصلاً"),
});

// --- Final Step Validation Schemas (with refinements) ---

// Step 2 Customer (PersonalInfo + Address + Terms on a single page)
const customerPersonalInfoSchema = baseFields
  .merge(addressFields)
  .extend({
    birthDate: z.string().min(1, "تاريخ الميلاد مطلوب"),
    agreeTerms: z
      .boolean()
      .refine(
        (v) => v === true,
        "يجب قبول الشروط والأحكام العامة وسياسة الاستخدام والخصوصية",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// Step 2 Driver (PersonalInfo + Address + NationalID)
const driverPersonalInfoSchema = baseFields
  .merge(addressFields)
  .extend({
    nationalId: z.string().regex(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقم"),
    birthDate: z.string().refine((val) => {
      const birth = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return age >= 21;
    }, "يجب أن يكون العمر 21 عاماً على الأقل"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

// Step 3 Driver (VehicleDetails)
const driverVehicleSchema = z
  .object({
    vehicleType: z.string().min(1, "نوع المركبة مطلوب"),
    vehicleTypeOther: z.string().optional(),
    vehicleBrand: z.string().min(1, "ماركة المركبة مطلوبة"),
    vehicleModel: z.string().min(1, "الموديل مطلوب"),
    vehicleColor: z.string().min(1, "اللون مطلوب"),
    plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
    vehicleLicenseExpiry: z.string().min(1, "تاريخ انتهاء الرخصة مطلوب"),
    vehicleLicensePhoto: z
      .any()
      .refine((v) => !!v, "صورة وجه رخصة المركبة مطلوبة"),
    vehicleLicensePhotoBack: z
      .any()
      .refine((v) => !!v, "صورة ظهر رخصة المركبة مطلوبة"),
  })
  .refine(
    (data) => {
      if (data.vehicleType === "أخرى" && !data.vehicleTypeOther) return false;
      return true;
    },
    { message: "يرجى إدخال نوع المركبة", path: ["vehicleTypeOther"] },
  );

// Step 4 Driver (Documents + Terms)
const driverDocumentsSchema = z.object({
  licenseExpiry: z.string().min(1, "تاريخ انتهاء الرخصة مطلوب"),
  driverPhoto: z.any().refine((v) => !!v, "صورة الكابتن مطلوبة"),
  licenseFront: z.any().refine((v) => !!v, "صورة وجه الرخصة مطلوبة"),
  licenseBack: z.any().refine((v) => !!v, "صورة ظهر الرخصة مطلوبة"),
  nationalIdFront: z.any().refine((v) => !!v, "صورة وجه البطاقة مطلوبة"),
  nationalIdBack: z.any().refine((v) => !!v, "صورة ظهر البطاقة مطلوبة"),
  agreeTerms: z
    .boolean()
    .refine(
      (v) => v === true,
      "يجب قبول الشروط والأحكام العامة وسياسة الاستخدام والخصوصية",
    ),
});

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole =
    searchParams.get("role") === "driver"
      ? "driver"
      : searchParams.get("role") === "customer"
        ? "customer"
        : null;

  const [step, setStep] = useState(initialRole ? 2 : 1);
  const [uploadingFields, setUploadingFields] = useState({});
  const isUploading = Object.values(uploadingFields).some(
    (val) => val === true,
  );
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wasNextAttempted, setWasNextAttempted] = useState(false);

  const [checkingFields, setCheckingFields] = useState({
    email: false,
    phone: false,
    nationalId: false,
    plateNumber: false,
  });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    control,
    formState: { errors, touchedFields, isSubmitted },
  } = useForm({
    resolver: zodResolver(
      step === 2
        ? selectedRole === "driver"
          ? driverPersonalInfoSchema
          : customerPersonalInfoSchema
        : step === 3 && selectedRole === "driver"
          ? driverVehicleSchema
          : step === 4 && selectedRole === "driver"
            ? driverDocumentsSchema
            : z.object({}),
    ),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      nationalId: "",
      birthDate: "",
      nationalIdFront: null,
      nationalIdBack: null,
      governorate: "",
      addressDetail: "",
      licenseExpiry: "",
      vehicleType: "ربع نقل",
      vehicleTypeOther: "",
      vehicleBrand: "",
      vehicleModel: "",
      vehicleColor: "",
      plateNumber: "",
      vehicleLicenseExpiry: "",
      driverPhoto: null,
      licenseFront: null,
      licenseBack: null,
      vehicleLicensePhoto: null,
      vehicleLicensePhotoBack: null,
      agreeTerms: false,
    },
  });

  const handleCheckAvailability = async (field, rawValue) => {
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    if (!value || errors[field]) return;

    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    if (field === "phone" && !/^01[0125]\d{8}$/.test(value)) return;
    if (field === "nationalId" && !/^\d{14}$/.test(value)) return;

    setCheckingFields((prev) => ({ ...prev, [field]: true }));
    try {
      const fieldMap = {
        email: AvailabilityField.EMAIL,
        phone: AvailabilityField.PHONE,
        nationalId: AvailabilityField.NATIONAL_ID,
        plateNumber: AvailabilityField.PLATE_NUMBER,
      };

      const backendField = fieldMap[field] || field;
      await authService.checkAvailability(backendField, value);
    } catch (error) {
      setError(field, {
        type: "manual",
        message: error.message,
      });
    } finally {
      setCheckingFields((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleImmediateUpload = async (file, fieldName, prefix) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setValue(fieldName, previewUrl, { shouldValidate: true });

    const formData = new FormData();
    formData.append("key", fieldName);
    formData.append("prefix", prefix);
    formData.append("file", file);

    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const res = await authService.uploadImage(formData);
      let extractedUrl = findStr(res);

      if (extractedUrl && typeof extractedUrl === "string") {
        if (!extractedUrl.startsWith("http")) {
          extractedUrl = extractedUrl.startsWith("/")
            ? API_BASE_URL + extractedUrl
            : API_BASE_URL + "/" + extractedUrl;
        }
        setValue(fieldName, extractedUrl, { shouldValidate: true });
      }
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
    } catch (err) {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
      console.error(`Failed to upload ${fieldName}:`, err);
      toast.error(`فشل رفع الملف: ${err.message}`);
    }
  };

  const [governorates, setGovernorates] = useState([]);

  const fetchGovs = async () => {
    try {
      const data = await locationService.getGovernorates();
      setGovernorates(data);
    } catch (err) {
      console.error("Failed to fetch governorates:", err);
    }
  };

  useEffect(() => {
    fetchGovs();
  }, []);

  useEffect(() => {
    clearErrors();
    setWasNextAttempted(false);
  }, [step, clearErrors]);

  const nextStep = async () => {
    if (step === 1) {
      if (!selectedRole) {
        toast.error("يرجى اختيار نوع الحساب أولاً");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (selectedRole === "driver") {
        const fieldsToValidate = [
          "fullName",
          "email",
          "phone",
          "password",
          "confirmPassword",
          "nationalId",
          "birthDate",
          "governorate",
          "addressDetail",
        ];
        setWasNextAttempted(true);
        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
          setWasNextAttempted(false);
          setStep(3);
        }
      } else {
        setWasNextAttempted(true);
        const fieldsToValidate = [
          "fullName",
          "email",
          "phone",
          "password",
          "confirmPassword",
          "birthDate",
          "governorate",
          "addressDetail",
          "agreeTerms",
        ];
        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
          handleSubmit(onSubmit, onInvalid)();
        }
      }
      return;
    }

    if (step === 3) {
      const fieldsToValidate = [
        "vehicleType",
        "vehicleTypeOther",
        "vehicleBrand",
        "vehicleModel",
        "vehicleColor",
        "plateNumber",
        "vehicleLicenseExpiry",
        "vehicleLicensePhoto",
        "vehicleLicensePhotoBack",
      ];
      setWasNextAttempted(true);
      const isValid = await trigger(fieldsToValidate);
      if (isValid) {
        setWasNextAttempted(false);
        setStep(4);
      }
      return;
    }
  };

  const handleMainAction = async (e) => {
    if (e) e.preventDefault();
    if (selectedRole === "driver") {
      if (step < 4) {
        await nextStep();
      } else {
        handleSubmit(onSubmit, onInvalid)();
      }
    } else {
      if (step < 2) {
        await nextStep();
      } else {
        handleSubmit(onSubmit, onInvalid)();
      }
    }
  };

  const prevStep = () => {
    clearErrors();
    setStep((s) => s - 1);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const getDocUrl = (val) => {
        if (typeof val === "string" && val.startsWith("http")) return val;
        return "https://shuhnety-bucket.s3.amazonaws.com/placeholders/document-placeholder.jpg";
      };

      const profile_picture =
        data.driverPhoto &&
        typeof data.driverPhoto === "string" &&
        data.driverPhoto.startsWith("http")
          ? data.driverPhoto
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=random&color=fff&size=128`;

      const registerDto = {
        role:
          selectedRole === "customer"
            ? UserRole.CLIENT
            : selectedRole === "driver"
              ? UserRole.DRIVER
              : selectedRole,
        full_name: data.fullName,
        email: data.email.trim(),
        phone_number: data.phone,
        password: data.password,
        confirm_password: data.confirmPassword,
        governorate_id: parseInt(data.governorate),
        address: data.addressDetail || "العنوان المسجل في البطاقة",
        birth_date: data.birthDate,
        profile_picture: profile_picture,
      };

      if (selectedRole === "driver") {
        const forward_nationalId_doc = getDocUrl(data.nationalIdFront);
        const back_nationalId_doc = getDocUrl(data.nationalIdBack);
        const forward_license_doc = getDocUrl(data.licenseFront);
        const back_license_doc = getDocUrl(data.licenseBack);
        const forward_vehicle_license_doc = getDocUrl(data.vehicleLicensePhoto);
        const back_vehicle_license_doc = getDocUrl(
          data.vehicleLicensePhotoBack,
        );

        toast.loading("جاري إنشاء الحساب...", { id: "register" });

        registerDto.driverDetails = {
          national_id: data.nationalId,
          forward_nationalId_doc: forward_nationalId_doc,
          back_nationalId_doc: back_nationalId_doc,
          license_number: data.nationalId,
          license_expiry: data.licenseExpiry,
          forward_license_doc: forward_license_doc,
          back_license_doc: back_license_doc,
        };

        registerDto.vehicle_details = {
          vehicle_type:
            data.vehicleType === "ربع نقل"
              ? VehicleType.PICKUP
              : data.vehicleType === "نصف نقل"
                ? VehicleType.MEDIUM_TRUCK
                : data.vehicleType === "سوزوكي/فان"
                  ? VehicleType.MINI_TRUCK
                  : data.vehicleType === "تروسيكل"
                    ? VehicleType.CARGO_TRIKE
                    : VehicleType.OTHER,
          other_vehicle_type:
            ["ربع نقل", "نصف نقل", "سوزوكي/فان", "تروسيكل"].includes(data.vehicleType)
              ? "string"
              : (data.vehicleType === "أخرى" ? data.vehicleTypeOther : data.vehicleType),
          vehicle_brand: data.vehicleBrand,
          model: data.vehicleModel,
          manufacture_year: parseInt(data.vehicleModel) || 2022,
          color: data.vehicleColor,
          vehicle_plate_number: data.plateNumber,
          vehicle_license_expiry: data.vehicleLicenseExpiry,
          forward_vehicle_license_doc: forward_vehicle_license_doc,
          back_vehicle_license_doc: back_vehicle_license_doc,
        };
      }

      await authService.register(registerDto);

      const successMsg =
        selectedRole === "driver"
          ? "تم التسجيل بنجاح 🙌 حسابك قيد المراجعة وسيتم تفعيله خلال 24 ساعة من قبل الإدارة."
          : "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.";

      toast.success(successMsg, { id: "register" });
      setTimeout(() => {
        navigate("/verify-email", {
          state: {
            email: data.email,
            role: selectedRole,
          },
        });
      }, 1000);
    } catch (error) {
      const errorMsg = error.message || "حدث خطأ غير متوقع";
      toast.error(errorMsg, { id: "register" });
    } finally {
      setIsLoading(false);
    }
  };

  const onInvalid = () => {
    setWasNextAttempted(true);
  };

  const sidebarSteps =
    selectedRole === "driver"
      ? [
          { label: "المعلومات الشخصية", icon: User, stepNum: 2 },
          { label: "بيانات المركبة", icon: Truck, stepNum: 3 },
          { label: "رفع المستندات", icon: CreditCard, stepNum: 4 },
        ]
      : [{ label: "معلومات التسجيل والعنوان", icon: User, stepNum: 2 }];

  return (
    <div
      className="min-h-screen w-full bg-[#fffcf8] flex flex-col font-cairo relative"
      dir="rtl"
    >
      <div className="flex-1 flex w-full overflow-hidden">
        {/* Right Sidebar (Only if step > 1) */}
        {step > 1 && (
          <div className="hidden lg:flex flex-col justify-between w-80 bg-[#f4f6fc]/50 border-l border-slate-100 p-8 shrink-0">
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-xl font-black text-slate-800 leading-none">
                  {selectedRole === "driver" ? "تسجيل السائق" : "تسجيل العميل"}
                </h1>
                <p className="text-[11px] text-slate-400 font-bold leading-none">
                  أكمل خطوات التسجيل للبدء
                </p>
              </div>

              <div className="space-y-3">
                {sidebarSteps.map((s, idx) => {
                  const isFinalReview =
                    s.stepNum === (selectedRole === "driver" ? 5 : 3);
                  const isActive = isFinalReview
                    ? isLoading
                    : step === s.stepNum;
                  const isCompleted = step > s.stepNum;
                  const Icon = s.icon;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-102"
                          : isCompleted
                            ? "text-brand-primary bg-orange-50/50"
                            : "text-slate-400 bg-white border border-slate-50",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5",
                          isActive ? "text-white" : "text-slate-400",
                        )}
                      />
                      <span className="text-xs font-black">{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Area (Header + Content) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Logo / Navigation Section */}
          <div className="w-full px-6 py-6 sm:px-12 md:px-16 flex justify-between items-center border-b border-slate-50 shrink-0 bg-white z-20">
            <div></div>
            <Link
              to="/"
              className="text-xl font-black text-brand-primary tracking-tight"
            >
              مسار
            </Link>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 sm:py-10 md:px-16 md:py-12 flex flex-col justify-between bg-slate-50/50">
            <div className="max-w-3xl w-full mx-auto my-auto space-y-8">
              {/* Horizontal stepper inside main content */}
              {step > 1 && selectedRole === "driver" && (
                <div className="flex items-center justify-between mb-8 max-w-[450px] mx-auto relative group">
                  <div className="absolute top-9 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                  {[
                    { label: "الشخصية", num: 2 },
                    { label: "المركبة", num: 3 },
                    { label: "المستندات", num: 4 },
                  ].map((s, i) => {
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                      <div
                        key={i}
                        className="relative z-10 flex flex-col items-center gap-2"
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-4",
                            isCompleted
                              ? "bg-[#27272a] border-white text-white shadow-lg"
                              : isActive
                                ? "bg-brand-primary border-white text-white scale-110 shadow-lg shadow-brand-primary/30"
                                : "bg-[#f8fafc] border-white text-slate-300",
                          )}
                        >
                          {isCompleted ? <Check className="h-5 w-5" /> : i + 1}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-black transition-colors duration-500 whitespace-nowrap",
                            isCompleted
                              ? "text-[#27272a]"
                              : isActive
                                ? "text-brand-primary"
                                : "text-slate-300",
                          )}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* White form card container */}
              <div
                className={cn(
                  "w-full",
                  step > 1 &&
                    "bg-white rounded-2xl border border-slate-100 p-4 sm:p-8 md:p-10 shadow-sm",
                )}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h2 className="text-[24px] font-bold text-[#1c1919] mb-2">
                      {step === 1
                        ? "إنشاء حساب جديد"
                        : step === 2
                          ? selectedRole === "driver"
                            ? "المعلومات الشخصية"
                            : "بيانات التسجيل والعنوان"
                          : step === 3
                            ? "بيانات المركبة"
                            : "رفع المستندات الرسمية"}
                    </h2>
                    <p className="text-[#57534d] text-sm tracking-tight">
                      {step === 1
                        ? "اختر نوع الحساب الذي يناسب احتياجاتك"
                        : step === 2
                          ? "يرجى إدخال بياناتك الشخصية بدقة لتوثيق الحساب"
                          : step === 3
                            ? "يرجى إدخال بيانات مركبتك بدقة "
                            : "يرجى رفع صور واضحة لمستنداتك "}
                    </p>
                  </div>

                  <form onSubmit={handleMainAction} className="space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {step === 1 && (
                          <div className="flex flex-col items-center justify-center space-y-10 py-4 max-w-[600px] mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                              <RoleCard
                                id="customer"
                                title="عميل / تاجر"
                                description="أقوم بشحن البضائع والمنتجات بشكل دوري"
                                icon={User}
                                selected={selectedRole === "customer"}
                                onClick={() => setSelectedRole("customer")}
                              />
                              <RoleCard
                                id="driver"
                                title="كابتن مستقل"
                                description="أمتلك مركبة وأرغب في زيادة أرباحي"
                                icon={Truck}
                                selected={selectedRole === "driver"}
                                onClick={() => setSelectedRole("driver")}
                              />
                            </div>
                          </div>
                        )}

                        {step === 2 && (
                          <PersonalInfoStep
                            register={register}
                            errors={errors}
                            touchedFields={touchedFields}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}
                            wasNextAttempted={wasNextAttempted}
                            selectedRole={selectedRole}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                            governorates={governorates}
                            checkingFields={checkingFields}
                            handleCheckAvailability={handleCheckAvailability}
                            fetchGovs={fetchGovs}
                          />
                        )}

                        {step === 3 && selectedRole === "driver" && (
                          <AdditionalDetailsStep
                            register={register}
                            errors={errors}
                            touchedFields={touchedFields}
                            wasNextAttempted={wasNextAttempted}
                            watch={watch}
                            setValue={setValue}
                            control={control}
                            handleImmediateUpload={handleImmediateUpload}
                            checkingFields={checkingFields}
                            handleCheckAvailability={handleCheckAvailability}
                            uploadingFields={uploadingFields}
                          />
                        )}

                        {step === 4 && selectedRole === "driver" && (
                          <DocumentsStep
                            register={register}
                            errors={errors}
                            touchedFields={touchedFields}
                            wasNextAttempted={wasNextAttempted}
                            watch={watch}
                            handleImmediateUpload={handleImmediateUpload}
                            uploadingFields={uploadingFields}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-4 pt-4">
                      {step > 1 ? (
                        <button
                          type="button"
                          className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors py-3.5 px-5 border border-slate-200 rounded-xl hover:bg-slate-50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                          onClick={prevStep}
                        >
                          <span>العودة للخلف</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      <Button
                        type="submit"
                        className={cn(
                          "h-13 rounded-xl text-sm font-bold text-white bg-brand-primary hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-md",
                          step > 1 ? "px-6 flex-1 max-w-[240px]" : "w-full",
                        )}
                        disabled={isLoading || isUploading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>جاري التوثيق...</span>
                          </div>
                        ) : (
                          <>
                            <span>
                              {step === 1
                                ? "البدء بالتسجيل"
                                : step === 2
                                  ? selectedRole === "driver"
                                    ? "التالي"
                                    : "إتمام التسجيل"
                                  : step === 3
                                    ? "التالي"
                                    : "إتمام التسجيل"}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="pt-6 text-center">
                      <p className="text-sm font-bold text-[#57534d]">
                        لديك حساب بالفعل؟{" "}
                        <Link
                          to="/login"
                          className="text-brand-primary hover:text-orange-600 font-extrabold transition-colors"
                        >
                          سجل دخولك
                        </Link>
                      </p>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Links (Full width across the page) */}
      <div className="w-full bg-white border-t border-slate-200/60 py-4 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400 shrink-0 z-20">
        <div className="flex items-center gap-6">
          <Link
            to="/terms"
            className="hover:text-brand-primary transition-colors"
          >
            الشروط والأحكام
          </Link>
          <Link
            to="/privacy"
            className="hover:text-brand-primary transition-colors"
          >
            سياسة الخصوصية
          </Link>
          <Link
            to="/contact"
            className="hover:text-brand-primary transition-colors"
          >
            اتصل بنا
          </Link>
        </div>
        <div>© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة شيلة</div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const RoleCard = ({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
  disabled,
  badge,
}) => (
  <div
    className={cn(
      "relative p-6 rounded-xl border transition-all duration-300",
      disabled
        ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50"
        : selected
          ? "border-brand-primary bg-orange-50/30 shadow-md shadow-brand-primary/10"
          : "border-gray-200 bg-white hover:border-brand-primary cursor-pointer",
    )}
    onClick={disabled ? undefined : onClick}
  >
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center shadow-sm transition-colors",
          selected
            ? "bg-brand-primary text-white"
            : "bg-gray-50 border border-gray-200 text-gray-400",
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-black text-[#1c1919] text-lg uppercase tracking-tight">
            {title}
          </h3>
          {badge && (
            <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded-lg text-[9px] font-black">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold text-[#57534d] mt-0.5">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const FileUploader = ({
  label,
  icon: Icon,
  onFileSelect,
  onFileChange,
  preview,
  className,
  error,
  isLoading,
}) => {
  const fileInputRef = useRef(null);
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <span className="text-gray-700 font-bold block text-sm mb-1">
          {label}
        </span>
      )}
      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={cn(
          "h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group bg-gray-50 overflow-hidden relative",
          error
            ? "border-red-500"
            : "border-gray-300 hover:border-brand-primary",
          isLoading && "cursor-wait",
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              if (onFileChange) {
                onFileChange(file);
              } else {
                const reader = new FileReader();
                reader.onloadend = () => onFileSelect(reader.result);
                reader.readAsDataURL(file);
              }
            }
          }}
          disabled={isLoading}
        />
        {preview ? (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {!isLoading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
            )}
          </div>
        ) : (
          <>
            <Icon className="h-6 w-6 text-slate-300 group-hover:text-brand-primary transition-transform group-hover:-translate-y-1" />
            <span className="text-[9px] font-black text-slate-400 group-hover:text-brand-primary">
              اضغط للرفع
            </span>
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
            <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-[10px] font-bold text-white">
              جاري الرفع...
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[9px] text-red-500 font-bold text-center">
          {error.message}
        </p>
      )}
    </div>
  );
};

const PersonalInfoStep = ({
  register,
  errors,
  touchedFields,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  wasNextAttempted,
  selectedRole,
  watch,
  setValue,
  control,
  governorates,
  checkingFields,
  handleCheckAvailability,
  fetchGovs,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="الاسم بالكامل"
          {...register("fullName")}
          placeholder="أدخل اسمك بالكامل"
          icon={User}
          error={errors.fullName}
          isTouched={touchedFields.fullName}
          wasNextAttempted={wasNextAttempted}
        />
        <Input
          label="البريد الإلكتروني"
          {...register("email", {
            onBlur: (e) => handleCheckAvailability("email", e.target.value),
          })}
          placeholder="example@domain.com"
          icon={Mail}
          error={errors.email}
          isTouched={touchedFields.email}
          wasNextAttempted={wasNextAttempted}
          isLoading={checkingFields.email}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Input
          label="رقم الهاتف"
          {...register("phone", {
            onBlur: (e) => handleCheckAvailability("phone", e.target.value),
          })}
          placeholder="01012345678"
          icon={Phone}
          error={errors.phone}
          isTouched={touchedFields.phone}
          wasNextAttempted={wasNextAttempted}
          isLoading={checkingFields.phone}
        />
        <Input
          label="تاريخ الميلاد"
          {...register("birthDate")}
          type="date"
          error={errors.birthDate}
          isTouched={touchedFields.birthDate}
          wasNextAttempted={wasNextAttempted}
        />
      </div>

      {selectedRole === "driver" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="الرقم القومي"
            {...register("nationalId", {
              onBlur: (e) =>
                handleCheckAvailability("nationalId", e.target.value),
            })}
            placeholder="أدخل الـ 14 رقم"
            icon={CreditCard}
            error={errors.nationalId}
            isTouched={touchedFields.nationalId}
            wasNextAttempted={wasNextAttempted}
            isLoading={checkingFields.nationalId}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="block text-sm">
          <span className="text-gray-700 font-bold block mb-2">
            كلمة المرور
          </span>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-4 py-3 bg-[#f8fafc] placeholder-gray-400/80 transition-all duration-300",
                errors.password && (touchedFields.password || wasNextAttempted)
                  ? "border-red-500"
                  : "border-gray-200 hover:border-gray-300",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (touchedFields.password || wasNextAttempted) && (
            <span className="text-xs text-red-500 mt-1 block font-bold">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="block text-sm">
          <span className="text-gray-700 font-bold block mb-2">
            تأكيد كلمة المرور
          </span>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-4 py-3 bg-[#f8fafc] placeholder-gray-400/80 transition-all duration-300",
                errors.confirmPassword &&
                  (touchedFields.confirmPassword || wasNextAttempted)
                  ? "border-red-500"
                  : "border-gray-200 hover:border-gray-300",
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword &&
            (touchedFields.confirmPassword || wasNextAttempted) && (
              <span className="text-xs text-red-500 mt-1 block font-bold">
                {errors.confirmPassword.message}
              </span>
            )}
        </div>
      </div>

      {/* Address Section */}
      <div className="pt-6 space-y-4 border-t border-slate-100">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 pr-1.5 leading-none">
          بيانات العنوان
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Controller
            name="governorate"
            control={control}
            render={({ field }) => (
              <Select
                label="المحافظة"
                options={governorates?.map((gov) => ({
                  value: gov.id,
                  label: gov.name_ar || gov.name || "---",
                }))}
                value={field.value}
                onChange={(val) => field.onChange(String(val))}
                placeholder="اختر المحافظة"
                error={
                  errors.governorate &&
                  (touchedFields.governorate || wasNextAttempted)
                    ? errors.governorate
                    : null
                }
                onClick={fetchGovs}
              />
            )}
          />
        </div>
        <Input
          label="العنوان بالتفصيل"
          {...register("addressDetail")}
          placeholder="الحي، الشارع، رقم المبنى..."
          error={errors.addressDetail}
          isTouched={touchedFields.addressDetail}
          wasNextAttempted={wasNextAttempted}
        />
      </div>

      {/* Checkbox for Customer */}
      {selectedRole === "customer" && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <Checkbox
            label={
              <span className="leading-relaxed">
                أوافق على{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-brand-primary hover:underline cursor-pointer font-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  الشروط والأحكام
                </Link>{" "}
                و{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-brand-primary hover:underline cursor-pointer font-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  سياسة الاستخدام والخصوصية
                </Link>
              </span>
            }
            {...register("agreeTerms")}
            error={errors.agreeTerms}
            isTouched={touchedFields.agreeTerms}
            wasNextAttempted={wasNextAttempted}
          />
        </div>
      )}
    </div>
  );
};

const AdditionalDetailsStep = ({
  register,
  errors,
  touchedFields,
  wasNextAttempted,
  watch,
  setValue,
  control,
  handleImmediateUpload,
  checkingFields,
  handleCheckAvailability,
  uploadingFields,
}) => {
  const vType = watch("vehicleType");

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 pr-1.5 leading-none">
          البيانات الأساسية للمركبة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Controller
            name="vehicleType"
            control={control}
            render={({ field }) => (
              <Select
                label="نوع المركبة"
                options={[
                  { value: "ربع نقل", label: "ربع نقل" },
                  { value: "نصف نقل", label: "نصف نقل" },
                  { value: "سوزوكي/فان", label: "سوزوكي / فان" },
                  { value: "تروسيكل", label: "تروسيكل" },
                  { value: "ملاكي", label: "ملاكي" },
                  { value: "موتوسيكل", label: "موتوسيكل" },
                  { value: "ميكروباص", label: "ميكروباص" },
                  { value: "أخرى", label: "أخرى" },
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="اختر نوع المركبة"
              />
            )}
          />
          <Input
            label="ماركة المركبة"
            {...register("vehicleBrand")}
            placeholder="مثلاً: مرسيدس، ايسوزو"
            error={errors.vehicleBrand}
            isTouched={touchedFields.vehicleBrand}
            wasNextAttempted={wasNextAttempted}
          />
        </div>

        {vType === "أخرى" && (
          <Input
            label="يرجى تحديد نوع المركبة"
            {...register("vehicleTypeOther")}
            placeholder="أدخل نوع المركبة هنا..."
            error={errors.vehicleTypeOther}
            isTouched={touchedFields.vehicleTypeOther}
            wasNextAttempted={wasNextAttempted}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Input
            label="الموديل (مثل 2022)"
            {...register("vehicleModel")}
            placeholder="2022"
            error={errors.vehicleModel}
            isTouched={touchedFields.vehicleModel}
            wasNextAttempted={wasNextAttempted}
          />
          <Input
            label="اللون"
            {...register("vehicleColor")}
            placeholder="أبيض"
            error={errors.vehicleColor}
            isTouched={touchedFields.vehicleColor}
            wasNextAttempted={wasNextAttempted}
          />
          <Input
            label="رقم اللوحة"
            {...register("plateNumber", {
              onBlur: (e) =>
                handleCheckAvailability("plateNumber", e.target.value),
            })}
            placeholder="أ ب ج ١ ٢ ٣"
            error={errors.plateNumber}
            isTouched={touchedFields.plateNumber}
            wasNextAttempted={wasNextAttempted}
            isLoading={checkingFields.plateNumber}
            onChange={(e) => {
              let val = e.target.value;
              let clean = val.replace(/\s+/g, "");
              let lettersPart = clean.replace(/\d/g, "");
              let numbersPart = clean.replace(/\D/g, "");
              let formattedLetters = lettersPart.split("").join(" ");
              let finalVal = formattedLetters;
              if (numbersPart) {
                if (finalVal) finalVal += " ";
                finalVal += numbersPart;
              }
              setValue("plateNumber", finalVal, { shouldValidate: true });
            }}
          />
        </div>
      </div>

      <div className="pt-6 space-y-4 border-t border-slate-100">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 pr-1.5 leading-none">
          البيانات القانونية للمركبة
        </h3>
        <Input
          label="تاريخ انتهاء رخصة المركبة"
          {...register("vehicleLicenseExpiry")}
          type="date"
          error={errors.vehicleLicenseExpiry}
          isTouched={touchedFields.vehicleLicenseExpiry}
          wasNextAttempted={wasNextAttempted}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FileUploader
            label="صورة رخصة المركبة (وجه)"
            icon={Upload}
            preview={watch("vehicleLicensePhoto")}
            onFileChange={(file) =>
              handleImmediateUpload(file, "vehicleLicensePhoto", "vehicle")
            }
            error={
              errors.vehicleLicensePhoto && wasNextAttempted
                ? errors.vehicleLicensePhoto
                : null
            }
            isLoading={uploadingFields["vehicleLicensePhoto"]}
          />
          <FileUploader
            label="صورة رخصة المركبة (ظهر)"
            icon={Upload}
            preview={watch("vehicleLicensePhotoBack")}
            onFileChange={(file) =>
              handleImmediateUpload(file, "vehicleLicensePhotoBack", "vehicle")
            }
            error={
              errors.vehicleLicensePhotoBack && wasNextAttempted
                ? errors.vehicleLicensePhotoBack
                : null
            }
            isLoading={uploadingFields["vehicleLicensePhotoBack"]}
          />
        </div>
      </div>
    </div>
  );
};

const DocumentsStep = ({
  register,
  errors,
  touchedFields,
  wasNextAttempted,
  watch,
  handleImmediateUpload,
  uploadingFields,
}) => {
  const driverPhoto = watch("driverPhoto");
  const licenseFront = watch("licenseFront");
  const licenseBack = watch("licenseBack");
  const nationalIdFront = watch("nationalIdFront");
  const nationalIdBack = watch("nationalIdBack");

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div
          onClick={() =>
            !uploadingFields["driverPhoto"] &&
            document.getElementById("driver-photo-input").click()
          }
          className={cn(
            "relative group cursor-pointer",
            errors.driverPhoto && wasNextAttempted && "animate-shake",
            uploadingFields["driverPhoto"] && "cursor-wait",
          )}
        >
          <div
            className={cn(
              "h-24 w-24 rounded-full bg-slate-50 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-primary relative",
              errors.driverPhoto && wasNextAttempted
                ? "border-red-500"
                : "border-slate-200",
            )}
          >
            {driverPhoto ? (
              <img
                src={driverPhoto}
                className="h-full w-full object-cover"
                alt="Driver"
              />
            ) : (
              <Upload className="h-8 w-8 text-slate-300 group-hover:text-brand-primary" />
            )}

            {uploadingFields["driverPhoto"] && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                <div className="h-8 w-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-1"></div>
                <span className="text-[8px] font-bold text-white">
                  جاري الرفع...
                </span>
              </div>
            )}

            <input
              id="driver-photo-input"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handleImmediateUpload(file, "driverPhoto", "driver");
                }
              }}
              disabled={uploadingFields["driverPhoto"]}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 mt-2">
          صورة الكابتن الشخصية
        </span>
        {errors.driverPhoto && wasNextAttempted && (
          <p className="text-[10px] text-red-500 font-bold mt-1 text-center">
            {errors.driverPhoto.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 pr-1.5 leading-none">
          بيانات رخصة القيادة
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Input
            label="تاريخ انتهاء رخصة القيادة"
            {...register("licenseExpiry")}
            type="date"
            error={errors.licenseExpiry}
            isTouched={touchedFields.licenseExpiry}
            wasNextAttempted={wasNextAttempted}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FileUploader
            label="صورة الرخصة (وجه)"
            icon={Upload}
            preview={licenseFront}
            onFileChange={(file) =>
              handleImmediateUpload(file, "licenseFront", "driver")
            }
            error={
              errors.licenseFront && wasNextAttempted
                ? errors.licenseFront
                : null
            }
            isLoading={uploadingFields["licenseFront"]}
          />
          <FileUploader
            label="صورة الرخصة (ظهر)"
            icon={Upload}
            preview={licenseBack}
            onFileChange={(file) =>
              handleImmediateUpload(file, "licenseBack", "driver")
            }
            error={
              errors.licenseBack && wasNextAttempted ? errors.licenseBack : null
            }
            isLoading={uploadingFields["licenseBack"]}
          />
        </div>
      </div>

      <div className="pt-6 space-y-4 border-t border-slate-100">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-2 pr-1.5 leading-none">
          صور الهوية الوطنية
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FileUploader
            label="صورة البطاقة (وجه)"
            icon={CreditCard}
            preview={nationalIdFront}
            onFileChange={(file) =>
              handleImmediateUpload(file, "nationalIdFront", "driver")
            }
            error={
              errors.nationalIdFront && wasNextAttempted
                ? errors.nationalIdFront
                : null
            }
            isLoading={uploadingFields["nationalIdFront"]}
          />
          <FileUploader
            label="صورة البطاقة (ظهر)"
            icon={CreditCard}
            preview={nationalIdBack}
            onFileChange={(file) =>
              handleImmediateUpload(file, "nationalIdBack", "driver")
            }
            error={
              errors.nationalIdBack && wasNextAttempted
                ? errors.nationalIdBack
                : null
            }
            isLoading={uploadingFields["nationalIdBack"]}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <Checkbox
          label={
            <span className="leading-relaxed">
              أوافق على{" "}
              <Link
                to="/terms"
                target="_blank"
                className="text-brand-primary hover:underline cursor-pointer font-black"
                onClick={(e) => e.stopPropagation()}
              >
                الشروط والأحكام العامة
              </Link>{" "}
              و{" "}
              <Link
                to="/privacy"
                target="_blank"
                className="text-brand-primary hover:underline cursor-pointer font-black"
                onClick={(e) => e.stopPropagation()}
              >
                سياسة الاستخدام والخصوصية
              </Link>
            </span>
          }
          {...register("agreeTerms")}
          error={errors.agreeTerms}
          isTouched={touchedFields.agreeTerms}
          wasNextAttempted={wasNextAttempted}
        />
      </div>
    </div>
  );
};

const Input = forwardRef(
  (
    {
      label,
      icon: Icon,
      error,
      isTouched,
      wasNextAttempted,
      className,
      isLoading,
      ...props
    },
    ref,
  ) => {
    const showError = error && (isTouched || wasNextAttempted);
    return (
      <div className={cn("block text-sm", className)}>
        {label && (
          <span className="text-gray-700 font-bold block mb-2">{label}</span>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "block w-full text-sm rounded-xl border focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary px-4 py-3 bg-[#f8fafc] placeholder-gray-400/80 transition-all duration-300",
              showError
                ? "border-red-500"
                : "border-gray-200 hover:border-gray-300",
              (Icon || isLoading) && "pr-10",
            )}
            {...props}
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-gray-400">
            {isLoading ? (
              <Loading minimal={true} text="" className="scale-110" />
            ) : (
              Icon && <Icon className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        {showError && (
          <span className="text-xs text-red-500 mt-1.5 block font-bold">
            {error.message}
          </span>
        )}
      </div>
    );
  },
);

const Checkbox = forwardRef(
  ({ label, error, isTouched, wasNextAttempted, ...props }, ref) => {
    const showError = error && (isTouched || wasNextAttempted);
    return (
      <label className="flex items-center gap-3 cursor-pointer group w-fit">
        <div className="relative flex items-center">
          <input type="checkbox" className="peer hidden" ref={ref} {...props} />
          <div
            className={cn(
              "h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center peer-checked:[&>svg]:scale-100 shrink-0",
              showError
                ? "border-red-500 bg-red-50"
                : "border-slate-200 peer-checked:bg-[#27272a] peer-checked:border-[#27272a]",
            )}
          >
            <Check className="h-3 w-3 text-white scale-0 transition-transform" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
            {label}
          </p>
          {showError && (
            <p className="text-[10px] text-red-500 font-black mt-0.5">
              {error.message}
            </p>
          )}
        </div>
      </label>
    );
  },
);
