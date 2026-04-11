import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    User, Truck, Building2, CheckCircle2,
    Mail, Phone, Lock, Box, Shield, Calendar,
    Eye, EyeOff, ArrowLeft, ChevronRight, Info, Check,
    Upload, CreditCard, CalendarDays
} from 'lucide-react'
import { toast } from 'react-hot-toast'


// UI Components
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

// Services
import { authService } from '@/services/authService'
import { locationService } from '@/services/locationService'
import { API_BASE_URL } from '@/api/axiosClient'
// import { StatusAlert } from '@/components/ui/StatusAlert'
import { Loading } from '@/components/ui/Loading'


// --- Backend Enums ---
export const AvailabilityField = {
    EMAIL: 'email',
    PHONE: 'phone_number',
    NATIONAL_ID: 'national_id',
    LICENSE_NUMBER: 'license_number',
    PLATE_NUMBER: 'vehicle_plate_number'
};

export const GoodsType = {
    ELECTRONICS: 'electronics',
    APPLIANCES: 'appliances',
    FURNITURE: 'furniture',
    HOUSEWARES: 'housewares',
    TEXTILES: 'textiles',
    FOOD: 'food',
    AGRICULTURAL: 'agricultural',
    CONSTRUCTION: 'construction',
    CHEMICALS: 'chemicals',
    MACHINERY: 'machinery',
    OTHER: 'other',
};

export const RegisterStatus = {
    PENDING_REVIEW: 'pending_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    SUSPENDED: 'suspended',
};

export const VehicleType = {
    MEDIUM_TRUCK: 'MediumTruck',      // للشاحنات المتوسطة (النصف نقل)
    PICKUP: 'Pickup',        // للشاحنات الخفيفة (الربع نقل)
    MINI_TRUCK: 'MiniTruck',      // للشاحنات الصغيرة (السوزوكي الربع حوض)
    CARGO_TRIKE: 'CargoTricycle',   //التروسيكل
    OTHER: 'Other',
};

export const UserRole = {
    CLIENT: 'client',
    DRIVER: 'driver',
    ADMIN: 'admin',
};

// --- Helpers ---
const findStr = (obj) => {
    if (typeof obj === 'string') return obj;
    if (typeof obj !== 'object' || obj === null) return null;

    // Check common keys directly first
    const keys = ['url', 'data', 'link', 'file', 'path', 'filePath'];
    for (const key of keys) {
        if (typeof obj[key] === 'string' && (obj[key].startsWith('http') || obj[key].includes('.'))) {
            return obj[key];
        }
    }

    // Deep search in values
    for (let v of Object.values(obj)) {
        if (typeof v === 'string' && (v.startsWith('http') || v.includes('.') || v.startsWith('/'))) {
            return v;
        }
        if (typeof v === 'object' && v !== null) {
            const nested = findStr(v);
            if (nested) return nested;
        }
    }
    return null;
};

// --- Validation Schemas ---
const step2BaseSchema = z.object({
    fullName: z.string().trim().min(5, 'الأسم الكامل يجب أن يكون أكثر من 5 أحرف'),
    email: z.string().trim().email('بريد إلكتروني غير صالح'),
    phone: z.string().trim().regex(/^01[0125]\d{8}$/, 'رقم هاتف مصري غير صالح'),
    password: z.string()
        .min(8, 'كلمة المرور يجب أن لا تقل عن 8 أحرف')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتشمل حرف كبير وصغير ورقم ورمز خاص'),
    confirmPassword: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
}).refine(data => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"]
})

const addressSchema = z.object({
    governorate: z.string().min(1, 'المحافظة مطلوبة'),
    city: z.string().min(1, 'المدينة مطلوبة'),
    addressDetail: z.string().min(10, 'العنوان يجب أن يكون مفصلاً'),
})

const driverStep1Schema = step2BaseSchema.extend({
    nationalId: z.string().regex(/^\d{14}$/, 'الرقم القومي يجب أن يكون 14 رقم'),
    birthDate: z.string().refine(val => {
        const birth = new Date(val);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age >= 21;
    }, 'يجب أن يكون العمر 21 عاماً على الأقل'),
    licenseNumber: z.string().min(5, 'رقم الرخصة غير صالح'),
    licenseExpiry: z.string().min(1, 'تاريخ انتهاء الرخصة مطلوب'),
    driverPhoto: z.any().refine(v => !!v, 'صورة الكابتن مطلوبة'),
    licenseFront: z.any().refine(v => !!v, 'صورة وجه الرخصة مطلوبة'),
    licenseBack: z.any().refine(v => !!v, 'صورة ظهر الرخصة مطلوبة'),
    nationalIdFront: z.any().refine(v => !!v, 'صورة وجه البطاقة مطلوبة'),
    nationalIdBack: z.any().refine(v => !!v, 'صورة ظهر البطاقة مطلوبة'),
    ...addressSchema.shape
})

const customerStep1Schema = step2BaseSchema.extend({
    birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
})

const driverStep2Schema = z.object({
    vehicleType: z.string().min(1, 'نوع المركبة مطلوب'),
    vehicleTypeOther: z.string().optional(),
    vehicleBrand: z.string().min(1, 'ماركة المركبة مطلوبة'),
    vehicleModel: z.string().min(1, 'الموديل مطلوب'),
    vehicleColor: z.string().min(1, 'اللون مطلوب'),
    plateNumber: z.string().min(1, 'رقم اللوحة مطلوب'),
    vehicleLicenseExpiry: z.string().min(1, 'تاريخ انتهاء الرخصة مطلوب'),
    vehicleLicensePhoto: z.any().refine(v => !!v, 'صورة وجه رخصة المركبة مطلوبة'),
    vehicleLicensePhotoBack: z.any().refine(v => !!v, 'صورة ظهر رخصة المركبة مطلوبة'),
    agreeCorrectInfo: z.boolean().refine(v => v === true, 'يجب الإقرار بصحة البيانات'),
    agreeTerms: z.boolean().refine(v => v === true, 'يجب الموافقة على الشروط الأتفاقية'),
}).refine(data => {
    if (data.vehicleType === 'أخرى' && !data.vehicleTypeOther) return false;
    return true;
}, { message: "يرجى إدخال نوع المركبة", path: ["vehicleTypeOther"] })

const finalDriverSchema = driverStep1Schema.merge(driverStep2Schema)
const finalCustomerSchema = customerStep1Schema.extend({
    ...addressSchema.shape,
    agreeCorrectInfo: z.boolean().refine(v => v === true, 'يجب الإقرار بصحة البيانات'),
    agreeTerms: z.boolean().refine(v => v === true, 'يجب الموافقة على الشروط الأتفاقية'),
})

const STEPS = ['نوع الحساب', 'المعلومات الشخصية', 'تفاصيل إضافية']

export const RegisterPage = () => {
    const [searchParams] = useSearchParams()
    const initialRole = searchParams.get('role') === 'driver' ? 'driver' : (searchParams.get('role') === 'customer' ? 'customer' : null)

    const [step, setStep] = useState(initialRole ? 1 : 1) // Start at step 1 but with role set
    const [selectedRole, setSelectedRole] = useState(initialRole)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [wasNextAttempted, setWasNextAttempted] = useState(false)

    const [checkingFields, setCheckingFields] = useState({
        email: false,
        phone: false,
        nationalId: false,
        licenseNumber: false,
        plateNumber: false
    })

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        setValue,
        setError,
        clearErrors,
        formState: { errors, touchedFields, isSubmitted },
    } = useForm({
        resolver: zodResolver(
            step === 2 ? (selectedRole === 'driver' ? driverStep1Schema : step2BaseSchema) :
                step === 3 ? (
                    selectedRole === 'driver' ? finalDriverSchema : finalCustomerSchema
                ) : z.object({})
        ),
        mode: 'onChange',
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            nationalId: '',
            birthDate: '',
            nationalIdFront: null,
            nationalIdBack: null,
            governorate: '',
            city: '',
            addressDetail: '',
            licenseNumber: '',
            licenseExpiry: '',
            vehicleType: 'ربع نقل',
            vehicleTypeOther: '',
            vehicleBrand: '',
            vehicleModel: '',
            vehicleColor: '',
            plateNumber: '',
            vehicleLicenseExpiry: '',
            driverPhoto: null,
            licenseFront: null,
            licenseBack: null,
            vehicleLicensePhoto: null,
            vehicleLicensePhotoBack: null,
            agreeCorrectInfo: false,
            agreeTerms: false
        }
    })

    const handleCheckAvailability = async (field, rawValue) => {
        const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
        if (!value || errors[field]) return;

        // Skip if value is clearly invalid based on basic regex before calling API
        if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
        if (field === 'phone' && !/^01[0125]\d{8}$/.test(value)) return;
        if (field === 'nationalId' && !/^\d{14}$/.test(value)) return;

        setCheckingFields(prev => ({ ...prev, [field]: true }));
        try {
            // Map field names to backend expected keys from AvailabilityField enum
            const fieldMap = {
                email: AvailabilityField.EMAIL,
                phone: AvailabilityField.PHONE,
                nationalId: AvailabilityField.NATIONAL_ID,
                licenseNumber: AvailabilityField.LICENSE_NUMBER,
                plateNumber: AvailabilityField.PLATE_NUMBER
            };

            const backendField = fieldMap[field] || field;
            await authService.checkAvailability(backendField, value);
        } catch (error) {
            setError(field, {
                type: 'manual',
                message: error.message
            });
        } finally {
            setCheckingFields(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleImmediateUpload = async (file, fieldName, prefix) => {
        if (!file) return;

        // 1. Set local preview immediately using URL.createObjectURL for better performance
        const previewUrl = URL.createObjectURL(file);
        setValue(fieldName, previewUrl, { shouldValidate: true });

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append('key', fieldName);
        formData.append('prefix', prefix);
        formData.append('file', file); // Sending the actual File object

        try {
            const res = await authService.uploadImage(formData);

            console.log(`Response for ${fieldName} upload:`, res);

            let extractedUrl = findStr(res);

            if (extractedUrl && typeof extractedUrl === 'string') {
                if (!extractedUrl.startsWith('http')) {
                    extractedUrl = extractedUrl.startsWith('/') ? API_BASE_URL + extractedUrl : API_BASE_URL + '/' + extractedUrl;
                }

                setValue(fieldName, extractedUrl, { shouldValidate: true });
            } else {
                console.warn(`Could not extract URL from response for ${fieldName}`, res);
            }
        } catch (err) {
            console.error(`Failed to upload ${fieldName}:`, err);
        }
    };

    const [governorates, setGovernorates] = useState([])
    const [cities, setCities] = useState([])
    const [isLoadingLocations, setIsLoadingLocations] = useState(false)

    const selectedGovId = watch('governorate')

    useEffect(() => {
        const fetchGovs = async () => {
            try {
                const data = await locationService.getGovernorates()
                setGovernorates(data)
            } catch (err) {
                console.error('Failed to fetch governorates:', err)
            }
        }
        fetchGovs()
    }, [])

    useEffect(() => {
        if (selectedGovId) {
            setValue('city', '')
            const fetchCities = async () => {
                setIsLoadingLocations(true)
                try {
                    const data = await locationService.getCities(selectedGovId)
                    setCities(data)
                } catch (err) {
                    console.error('Failed to fetch cities:', err)
                } finally {
                    setIsLoadingLocations(false)
                }
            }
            fetchCities()
        } else {
            setCities([])
            setValue('city', '')
        }
    }, [selectedGovId, setValue])

    useEffect(() => {
        clearErrors()
        setWasNextAttempted(false)
    }, [step, clearErrors])


    const nextStep = async () => {
        if (step === 1) {
            if (!selectedRole) {
                toast.error('يرجى اختيار نوع الحساب أولاً')
                return
            }
            setStep(2)
            return
        }

        if (step === 2) {
            const fieldsToValidate = selectedRole === 'driver'
                ? ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'nationalId', 'birthDate', 'governorate', 'city', 'addressDetail', 'licenseNumber', 'licenseExpiry', 'driverPhoto', 'licenseFront', 'licenseBack', 'nationalIdFront', 'nationalIdBack']
                : ['fullName', 'email', 'phone', 'password', 'confirmPassword', 'birthDate']

            setWasNextAttempted(true)
            const isValid = await trigger(fieldsToValidate)
            if (isValid) {
                setWasNextAttempted(false)
                setStep(3)
            }
            return
        }
    }

    const handleMainAction = async (e) => {
        if (e) e.preventDefault()
        if (step < 3) {
            await nextStep()
        } else {
            handleSubmit(onSubmit, onInvalid)()
        }
    }

    const prevStep = () => {
        clearErrors()
        setStep(s => s - 1)
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            // Map data to Backend RegisterDto matching exact schema provided by user
            const registerDto = {
                role: selectedRole === 'customer' ? UserRole.CLIENT : (selectedRole === 'driver' ? UserRole.DRIVER : selectedRole),
                full_name: data.fullName,
                email: data.email.trim(),
                phone_number: data.phone,
                password: data.password,
                confirm_password: data.confirmPassword,
                governorate_id: parseInt(data.governorate),
                city_id: parseInt(data.city),
                address: data.addressDetail || 'العنوان المسجل في البطاقة', // Correct field: address
                birth_date: data.birthDate,
            }


            if (selectedRole === 'driver') {
                // Documents are now uploaded immediately, so we just check if they are URLs
                const getDocUrl = (val) => {
                    if (typeof val === 'string' && val.startsWith('http')) return val;
                    return "https://example.com/placeholder.jpg";
                };

                const profile_picture = getDocUrl(data.driverPhoto);
                const forward_nationalId_doc = getDocUrl(data.nationalIdFront);
                const back_nationalId_doc = getDocUrl(data.nationalIdBack);
                const forward_license_doc = getDocUrl(data.licenseFront);
                const back_license_doc = getDocUrl(data.licenseBack);
                const forward_vehicle_license_doc = getDocUrl(data.vehicleLicensePhoto);
                const back_vehicle_license_doc = getDocUrl(data.vehicleLicensePhotoBack);

                toast.loading('جاري إنشاء الحساب...', { id: 'register' });

                registerDto.driverDetails = { // Correct field: driverDetails
                    national_id: data.nationalId,
                    profile_picture: profile_picture,
                    forward_nationalId_doc: forward_nationalId_doc, // Mixed case as per user schema
                    back_nationalId_doc: back_nationalId_doc,   // Mixed case as per user schema
                    license_number: data.licenseNumber,
                    license_expiry: data.licenseExpiry,
                    forward_license_doc: forward_license_doc,
                    back_license_doc: back_license_doc,
                }

                registerDto.vehicle_details = { // Correct field: vehicle_details
                    vehicle_type: data.vehicleType === 'ربع نقل' ? VehicleType.PICKUP :
                        data.vehicleType === 'نصف نقل' ? VehicleType.MEDIUM_TRUCK :
                            data.vehicleType === 'سوزوكي/فان' ? VehicleType.MINI_TRUCK :
                                data.vehicleType === 'تروسيكل' ? VehicleType.CARGO_TRIKE : VehicleType.OTHER,
                    other_vehicle_type: data.vehicleType === 'أخرى' ? data.vehicleTypeOther : 'string',
                    vehicle_brand: data.vehicleBrand,
                    model: data.vehicleModel,
                    manufacture_year: parseInt(data.vehicleModel) || 2022,
                    color: data.vehicleColor,
                    vehicle_plate_number: data.plateNumber,
                    vehicle_license_expiry: data.vehicleLicenseExpiry,
                    forward_vehicle_license_doc: forward_vehicle_license_doc,
                    back_vehicle_license_doc: back_vehicle_license_doc,
                }
            }

            const response = await authService.register(registerDto)

            const successMsg = selectedRole === 'driver' 
                ? 'تم التسجيل بنجاح 🙌 حسابك قيد المراجعة وسيتم تفعيله خلال 24 ساعة من قبل الإدارة.'
                : 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.';
            
            toast.success(successMsg, { id: 'register' })
            // Navigate to verify email
            setTimeout(() => {
                navigate('/verify-email', {
                    state: {
                        email: data.email,
                        role: selectedRole
                    }
                })
            }, 1000)

        } catch (error) {
            const errorMsg = error.message || 'حدث خطأ غير متوقع';
            toast.error(errorMsg, { id: 'register' })
        } finally {

            setIsLoading(false)
        }
    }

    const onInvalid = () => {
        setWasNextAttempted(true)
    }

    return (
        <div className="min-h-screen bg-[#fffcf8] font-cairo flex flex-col relative overflow-hidden" dir="rtl">

            <div className="flex-1 flex items-center justify-center p-4 lg:p-12 relative">
                <div className="max-w-[1240px] w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Right Visual Panel */}
                    <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="w-full flex justify-center"
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative"
                            >
                                <div className="absolute -bottom-6 -left-6 -right-6 h-24 bg-brand-primary/20 blur-3xl rounded-full"></div>
                                <div className="relative bg-white p-3 rounded-[3.5rem] shadow-2xl border border-slate-50">
                                    <img
                                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
                                        className="w-[500px] h-[380px] object-cover rounded-[2.5rem]"
                                        alt="Register visual"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-[30px] font-bold text-brand-secondary tracking-tight leading-tight">انضم لعائلة شحنتي</h2>
                            <p className="text-[16px] text-[#57534d]">خطوات بسيطة لبدء تجربة لوجستية ذكية</p>

                            <div className="pt-2 flex items-center justify-center gap-6">
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <Shield className="h-3.5 w-3.5" /> آمن
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <Box className="h-3.5 w-3.5" /> سريع
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-black text-brand-secondary bg-brand-secondary/5 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> موثوق
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Left Form Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-[550px] mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 relative"
                    >
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-brand-primary rounded-2xl shadow-lg shadow-brand-primary/20 mb-6 text-white rotate-3">
                                <Box className="h-9 w-9" />
                            </div>
                            <h1 className="text-[30px] font-bold text-[#1c1919] mb-2">إنشاء حساب جديد</h1>
                            <p className="text-[#57534d] text-[16px] tracking-tight">
                                {step === 1 ? 'اختر نوع الحساب الذي يناسب احتياجاتك' :
                                    step === 2 ? 'المعلومات الشخصية' : 'تفاصيل إضافية'}
                            </p>
                        </div>

                        {/* Step Indicators */}
                        <div className="flex items-center justify-between mb-12 max-w-[400px] mx-auto relative group">
                            <div className="absolute top-9 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
                            {STEPS.map((label, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-4",
                                        step > i + 1 ? "bg-[#064e3b] border-white text-white shadow-lg" :
                                            step === i + 1 ? "bg-brand-primary border-white text-white scale-110 shadow-lg shadow-brand-primary/30" :
                                                "bg-[#f8fafc] border-white text-slate-300"
                                    )}>
                                        {step > i + 1 ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black transition-colors duration-500 whitespace-nowrap",
                                        step > i + 1 ? "text-[#064e3b]" :
                                            step === i + 1 ? "text-brand-primary" : "text-slate-300"
                                    )}>{label}</span>
                                </div>
                            ))}
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
                                        <div className="space-y-4">
                                            <RoleCard
                                                id="customer"
                                                title="عميل / تاجر"
                                                description="أقوم بشحن البضائع والمنتجات بشكل دوري"
                                                icon={User}
                                                selected={selectedRole === 'customer'}
                                                onClick={() => setSelectedRole('customer')}
                                            />
                                            <RoleCard
                                                id="driver"
                                                title="كابتن مستقل"
                                                description="أمتلك شاحنة وأرغب في زيادة أرباحي"
                                                icon={Truck}
                                                selected={selectedRole === 'driver'}
                                                onClick={() => setSelectedRole('driver')}
                                            />
                                            <RoleCard
                                                id="company"
                                                title="شركة شحن"
                                                description="ندير أسطولاً من الشاحنات ونبحث عن عقود"
                                                icon={Building2}
                                                disabled={true}
                                                badge="قريباً"
                                            />
                                            <div className="flex items-start gap-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                                                <p className="text-[10px] font-bold text-blue-600/80 leading-relaxed">
                                                    هذه الميزة تحت التطوير النشط حالياً من قبل فريق منصة شحنتي التقني.
                                                </p>
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
                                            governorates={governorates}
                                            cities={cities}
                                            isLoadingLocations={isLoadingLocations}
                                            handleImmediateUpload={handleImmediateUpload}
                                            checkingFields={checkingFields}
                                            handleCheckAvailability={handleCheckAvailability}
                                        />
                                    )}

                                    {step === 3 && (
                                        <AdditionalDetailsStep
                                            register={register}
                                            errors={errors}
                                            touchedFields={touchedFields}
                                            selectedRole={selectedRole}
                                            wasNextAttempted={wasNextAttempted}
                                            watch={watch}
                                            setValue={setValue}
                                            governorates={governorates}
                                            cities={cities}
                                            isLoadingLocations={isLoadingLocations}
                                            handleImmediateUpload={handleImmediateUpload}
                                            checkingFields={checkingFields}
                                            handleCheckAvailability={handleCheckAvailability}
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>


                            <div className="flex gap-4 mt-10">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 h-14 rounded-2xl font-black text-slate-600 border-2 border-slate-100 hover:bg-slate-50 transition-all"
                                        onClick={prevStep}
                                    >
                                        السابق
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className={cn(
                                        "flex-[2] h-14 rounded-2xl font-black text-white transition-all shadow-xl",
                                        step === 3
                                            ? "bg-[#064e3b] hover:bg-[#053a2c] shadow-[#064e3b]/20"
                                            : "bg-brand-primary hover:bg-orange-600 shadow-brand-primary/30"
                                    )}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loading minimal={true} className="text-white" text="جاري الحفظ..." />
                                    ) : (
                                        step === 3 ? (selectedRole === 'driver' ? 'تسجيل والانتظار المراجعة' : 'إتمام التسجيل') : 'التالي'
                                    )}
                                </Button>
                            </div>

                            <div className="pt-6 text-center">
                                <p className="text-sm font-bold text-[#57534d]">
                                    لديك حساب بالفعل؟ <Link to="/login" className="text-brand-primary hover:text-orange-600 font-extrabold transition-colors">سجل دخولك</Link>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Back Link */}
                <Link to="/" className="absolute top-8 right-8 flex items-center gap-2 text-xs font-black text-[#57534d] hover:text-brand-primary transition-all group">
                    <span>العودة للرئيسية</span>
                    <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </div>
                </Link>
            </div>
        </div>
    )
}

// --- Sub-Components ---

const RoleCard = ({ title, description, icon: Icon, selected, onClick, disabled, badge }) => (
    <div
        className={cn(
            "relative p-5 rounded-[2rem] border-2 transition-all duration-300",
            disabled ? "opacity-60 cursor-not-allowed border-slate-100 bg-slate-50/50" :
                selected ? "border-brand-primary bg-orange-50/30 shadow-lg shadow-brand-primary/5" :
                    "border-transparent bg-slate-50/50 hover:bg-slate-50 hover:border-slate-100 cursor-pointer"
        )}
        onClick={disabled ? undefined : onClick}
    >
        <div className="flex items-center gap-5">
            <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
                selected ? "bg-brand-primary text-white" : "bg-white text-slate-400"
            )}>
                <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-[#1c1919] text-lg uppercase tracking-tight">{title}</h3>
                    {badge && (
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded-lg text-[9px] font-black">{badge}</span>
                    )}
                </div>
                <p className="text-[11px] font-bold text-[#57534d] mt-0.5">{description}</p>
            </div>
            {selected && (
                <div className="h-6 w-6 bg-brand-primary rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
            )}
        </div>
    </div>
)

const FileUploader = ({ label, icon: Icon, onFileSelect, onFileChange, preview, className, error }) => {
    const fileInputRef = useRef(null)
    return (
        <div className={cn("space-y-2", className)}>
            {label && <label className="text-[10px] font-black text-slate-400 text-center block">{label}</label>}
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group bg-slate-50/30 overflow-hidden relative",
                    error ? "border-red-500 animate-shake" : "border-slate-100 hover:border-brand-primary"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                            if (onFileChange) {
                                onFileChange(file)
                            } else {
                                const reader = new FileReader()
                                reader.onloadend = () => onFileSelect(reader.result)
                                reader.readAsDataURL(file)
                            }
                        }
                    }}
                />
                {preview ? (
                    <div className="absolute inset-0 w-full h-full">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="h-6 w-6 text-white" />
                        </div>
                    </div>
                ) : (
                    <>
                        <Icon className="h-6 w-6 text-slate-300 group-hover:text-brand-primary transition-transform group-hover:-translate-y-1" />
                        <span className="text-[9px] font-black text-slate-400 group-hover:text-brand-primary">اضغط للرفع</span>
                    </>
                )}
            </div>
            {error && <p className="text-[9px] text-red-500 font-bold text-center">{error.message}</p>}
        </div>
    )
}
const PersonalInfoStep = ({ register, errors, touchedFields, showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword, wasNextAttempted, selectedRole, watch, setValue, governorates, cities, isLoadingLocations, handleImmediateUpload, checkingFields, handleCheckAvailability }) => {
    const driverPhoto = watch('driverPhoto')
    const licenseFront = watch('licenseFront')
    const licenseBack = watch('licenseBack')

    return (
        <div className="space-y-6">
            {selectedRole === 'driver' && (
                <div className="flex flex-col items-center mb-8">
                    <div
                        onClick={() => document.getElementById('driver-photo-input').click()}
                        className={cn(
                            "relative group cursor-pointer",
                            errors.driverPhoto && wasNextAttempted && "animate-shake"
                        )}
                    >
                        <div className={cn(
                            "h-24 w-24 rounded-full bg-slate-50 border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-brand-primary relative",
                            errors.driverPhoto && wasNextAttempted ? "border-red-500" : "border-slate-200"
                        )}>
                            {driverPhoto ? (
                                <img src={driverPhoto} className="h-full w-full object-cover" alt="Driver" />
                            ) : (
                                <Upload className="h-8 w-8 text-slate-300 group-hover:text-brand-primary" />
                            )}
                            <input
                                id="driver-photo-input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                        handleImmediateUpload(file, 'driverPhoto', 'driver')
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-2">صورة الكابتن</span>
                    {errors.driverPhoto && wasNextAttempted && <p className="text-[9px] text-red-500 font-bold mt-1 text-center">{errors.driverPhoto.message}</p>}
                </div>
            )}

            <Input
                label="الاسم بالكامل"
                {...register('fullName')}
                placeholder="ادخل اسمك بالكامل (كما في البطاقة)"
                icon={User}
                error={errors.fullName}
                isTouched={touchedFields.fullName}
                wasNextAttempted={wasNextAttempted}
            />

            {selectedRole === 'customer' && (
                <Input
                    label="تاريخ الميلاد"
                    {...register('birthDate')}
                    type="date"
                    icon={CalendarDays}
                    error={errors.birthDate}
                    isTouched={touchedFields.birthDate}
                    wasNextAttempted={wasNextAttempted}
                />
            )}

            {selectedRole === 'driver' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="الرقم القومي"
                        {...register('nationalId', {
                            onBlur: (e) => handleCheckAvailability('nationalId', e.target.value)
                        })}
                        placeholder="14 رقم"
                        icon={CreditCard}
                        error={errors.nationalId}
                        isTouched={touchedFields.nationalId}
                        wasNextAttempted={wasNextAttempted}
                        isLoading={checkingFields.nationalId}
                    />
                    <Input
                        label="تاريخ الميلاد"
                        {...register('birthDate')}
                        type="date"
                        icon={CalendarDays}
                        error={errors.birthDate}
                        isTouched={touchedFields.birthDate}
                        wasNextAttempted={wasNextAttempted}
                    />
                </div>
            )}

            {selectedRole === 'driver' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FileUploader
                        label="صورة البطاقة (وجه)"
                        icon={CreditCard}
                        preview={watch('nationalIdFront')}
                        onFileChange={(file) => handleImmediateUpload(file, 'nationalIdFront', 'driver')}
                        error={errors.nationalIdFront && wasNextAttempted ? errors.nationalIdFront : null}
                    />
                    <FileUploader
                        label="صورة البطاقة (ظهر)"
                        icon={CreditCard}
                        preview={watch('nationalIdBack')}
                        onFileChange={(file) => handleImmediateUpload(file, 'nationalIdBack', 'driver')}
                        error={errors.nationalIdBack && wasNextAttempted ? errors.nationalIdBack : null}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="البريد الإلكتروني"
                    {...register('email', {
                        onBlur: (e) => handleCheckAvailability('email', e.target.value)
                    })}
                    placeholder="example@mail.com"
                    icon={Mail}
                    error={errors.email}
                    isTouched={touchedFields.email}
                    wasNextAttempted={wasNextAttempted}
                    isLoading={checkingFields.email}
                />
                <Input
                    label="رقم الهاتف"
                    {...register('phone', {
                        onBlur: (e) => handleCheckAvailability('phone', e.target.value)
                    })}
                    placeholder="01012345678"
                    icon={Phone}
                    error={errors.phone}
                    isTouched={touchedFields.phone}
                    wasNextAttempted={wasNextAttempted}
                    isLoading={checkingFields.phone}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 block pr-1">كلمة المرور</label>
                <div className="relative group">
                    <input
                        {...register('password')}
                        type={showPassword ? "text" : "password"}
                        placeholder="أدخل 8 أحرف على الأقل"
                        className={cn(
                            "w-full h-14 pr-12 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                            errors.password && (touchedFields.password || wasNextAttempted) ? "border-red-500" : "border-slate-100 focus:border-brand-primary"
                        )}
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.password && (touchedFields.password || wasNextAttempted) && <p className="text-xs text-red-500 font-bold pr-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 block pr-1">تأكيد كلمة المرور</label>
                <div className="relative group">
                    <input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="أدخل كلمة المرور مرة أخرى"
                        className={cn(
                            "w-full h-14 pr-12 pl-12 rounded-2xl border-2 outline-none transition-all font-bold text-sm bg-slate-50/50",
                            errors.confirmPassword && (touchedFields.confirmPassword || wasNextAttempted) ? "border-red-500" : "border-slate-100 focus:border-brand-primary"
                        )}
                    />
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-primary" />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
                {errors.confirmPassword && (touchedFields.confirmPassword || wasNextAttempted) && <p className="text-xs text-red-500 font-bold pr-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Address Section - Only for Driver here, Customer will have it in step 3 */}
            {selectedRole === 'driver' && (
                <div className="pt-4 space-y-4 border-t border-slate-50">
                    <h3 className="text-[13px] font-black text-brand-primary flex items-center gap-2 border-r-4 border-brand-primary pr-3 leading-none">بيانات العنوان</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 pr-1">المحافظة</label>
                            <div className="relative">
                                <select
                                    {...register('governorate')}
                                    className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="">اختر المحافظة</option>
                                    {governorates?.map(gov => (
                                        <option key={gov.id} value={gov.id}>{gov.name_ar || gov.name || '---'}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none rotate-90" />
                            </div>
                            {errors.governorate && (touchedFields.governorate || wasNextAttempted) && <p className="text-[11px] text-red-500 font-bold pr-1">{errors.governorate.message}</p>}

                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600 pr-1 flex items-center gap-2">
                                المدينة
                                {isLoadingLocations && <Loading minimal={true} className="inline-flex mr-2 scale-75" />}
                            </label>
                            <div className="relative">
                                <select
                                    {...register('city')}
                                    className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                                    disabled={!watch('governorate') || isLoadingLocations}
                                >
                                    <option value="">اختر المدينة</option>
                                    {cities?.map(city => (
                                        <option key={city.id} value={city.id}>{city.name_ar || city.name || '---'}</option>
                                    ))}
                                </select>
                                <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none rotate-90" />
                            </div>
                            {errors.city && (touchedFields.city || wasNextAttempted) && <p className="text-[11px] text-red-500 font-bold pr-1">{errors.city.message}</p>}
                        </div>
                    </div>
                    <Input
                        label="العنوان بالتفصيل"
                        {...register('addressDetail')}
                        placeholder="اسم الحي الشارع رقم المبني..."
                        error={errors.addressDetail}
                        isTouched={touchedFields.addressDetail}
                        wasNextAttempted={wasNextAttempted}
                    />
                </div>
            )}

            {/* Driving License Section for Driver */}
            {selectedRole === 'driver' && (
                <div className="pt-4 space-y-4 border-t border-slate-50">
                    <h3 className="text-[13px] font-black text-brand-primary flex items-center gap-2 border-r-4 border-brand-primary pr-3 leading-none">بيانات رخصة القيادة</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="رقم الرخصة"
                            {...register('licenseNumber', {
                                onBlur: (e) => handleCheckAvailability('licenseNumber', e.target.value)
                            })}
                            placeholder="رقم الرخصة"
                            error={errors.licenseNumber}
                            isTouched={touchedFields.licenseNumber}
                            wasNextAttempted={wasNextAttempted}
                            isLoading={checkingFields.licenseNumber}
                        />
                        <Input
                            label="تاريخ الانتهاء"
                            {...register('licenseExpiry')}
                            type="date"
                            error={errors.licenseExpiry}
                            isTouched={touchedFields.licenseExpiry}
                            wasNextAttempted={wasNextAttempted}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FileUploader
                            label="صورة الرخصة (وجه)"
                            icon={Upload}
                            preview={licenseFront}
                            onFileChange={(file) => handleImmediateUpload(file, 'licenseFront', 'driver')}
                            error={errors.licenseFront && wasNextAttempted ? errors.licenseFront : null}
                        />
                        <FileUploader
                            label="صورة الرخصة (ظهر)"
                            icon={Upload}
                            preview={licenseBack}
                            onFileChange={(file) => handleImmediateUpload(file, 'licenseBack', 'driver')}
                            error={errors.licenseBack && wasNextAttempted ? errors.licenseBack : null}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

const AdditionalDetailsStep = ({ register, errors, touchedFields, selectedRole, wasNextAttempted, watch, setValue, governorates, cities, isLoadingLocations, handleImmediateUpload, checkingFields, handleCheckAvailability }) => {
    const vType = watch('vehicleType')

    return (
        <div className="space-y-6">
            {selectedRole === 'driver' ? (
                <>
                    <div className="space-y-4">
                        <h3 className="text-[13px] font-black text-[#064e3b] flex items-center gap-2 border-r-4 border-[#064e3b] pr-3 leading-none">البيانات الأساسية للمركبة</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-600 pr-1">نوع المركبة</label>
                                <div className="relative">
                                    <select
                                        {...register('vehicleType')}
                                        className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="ربع نقل">ربع نقل</option>
                                        <option value="نصف نقل">نصف نقل</option>
                                        <option value="سوزوكي/فان">سوزوكي / فان</option>
                                        <option value="تروسيكل">تروسيكل</option>
                                        <option value="أخرى">أخرى</option>
                                    </select>
                                    <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none rotate-90" />
                                </div>
                            </div>
                            <Input
                                label="ماركة المركبة"
                                {...register('vehicleBrand')}
                                placeholder="مثلاً: مرسيدس، ايسوزو"
                                error={errors.vehicleBrand}
                                isTouched={touchedFields.vehicleBrand}
                                wasNextAttempted={wasNextAttempted}
                            />
                        </div>

                        {vType === 'أخرى' && (
                            <Input
                                label="يرجى تحديد نوع المركبة"
                                {...register('vehicleTypeOther')}
                                placeholder="أدخل نوع المركبة هنا..."
                                error={errors.vehicleTypeOther}
                                isTouched={touchedFields.vehicleTypeOther}
                                wasNextAttempted={wasNextAttempted}
                            />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="الموديل (مثل 2022)"
                                {...register('vehicleModel')}
                                placeholder="2022"
                                error={errors.vehicleModel}
                                isTouched={touchedFields.vehicleModel}
                                wasNextAttempted={wasNextAttempted}
                            />
                            <Input
                                label="اللون"
                                {...register('vehicleColor')}
                                placeholder="أبيض"
                                error={errors.vehicleColor}
                                isTouched={touchedFields.vehicleColor}
                                wasNextAttempted={wasNextAttempted}
                            />
                        </div>

                        <Input
                            label="رقم اللوحة"
                            {...register('plateNumber', {
                                onBlur: (e) => handleCheckAvailability('plateNumber', e.target.value)
                            })}
                            placeholder="مثال: أ ب ج ١ ٢ ٣"

                            error={errors.plateNumber}
                            isTouched={touchedFields.plateNumber}
                            wasNextAttempted={wasNextAttempted}
                            isLoading={checkingFields.plateNumber}
                            onChange={(e) => {
                                let val = e.target.value;
                                // Clean up everything
                                let clean = val.replace(/\s+/g, '');

                                // Separate letters and numbers
                                let lettersPart = clean.replace(/\d/g, '');
                                let numbersPart = clean.replace(/\D/g, '');

                                // Format letters with spaces
                                let formattedLetters = lettersPart.split('').join(' ');

                                // Final format: Letters with spaces, then numbers
                                let finalVal = formattedLetters;
                                if (numbersPart) {
                                    if (finalVal) finalVal += " ";
                                    finalVal += numbersPart;
                                }

                                setValue('plateNumber', finalVal, { shouldValidate: true });
                            }}
                        />
                    </div>

                    <div className="pt-4 space-y-4 border-t border-slate-50">
                        <h3 className="text-[13px] font-black text-[#064e3b] flex items-center gap-2 border-r-4 border-[#064e3b] pr-3 leading-none">البيانات القانونية للمركبة</h3>
                        <Input
                            label="تاريخ انتهاء رخصة المركبة"
                            {...register('vehicleLicenseExpiry')}
                            type="date"
                            error={errors.vehicleLicenseExpiry}
                            isTouched={touchedFields.vehicleLicenseExpiry}
                            wasNextAttempted={wasNextAttempted}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FileUploader
                                label="صورة رخصة المركبة (وجه)"
                                icon={Upload}
                                preview={watch('vehicleLicensePhoto')}
                                onFileChange={(file) => handleImmediateUpload(file, 'vehicleLicensePhoto', 'vehicle')}
                                error={errors.vehicleLicensePhoto && wasNextAttempted ? errors.vehicleLicensePhoto : null}
                            />
                            <FileUploader
                                label="صورة رخصة المركبة (ظهر)"
                                icon={Upload}
                                preview={watch('vehicleLicensePhotoBack')}
                                onFileChange={(file) => handleImmediateUpload(file, 'vehicleLicensePhotoBack', 'vehicle')}
                                error={errors.vehicleLicensePhotoBack && wasNextAttempted ? errors.vehicleLicensePhotoBack : null}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 pr-1">المحافظة</label>
                        <div className="relative">
                            <select
                                {...register('governorate')}
                                className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                            >
                                <option value="">اختر المحافظة</option>
                                {governorates?.map(gov => (
                                    <option key={gov.id} value={gov.id}>{gov.name_ar || gov.name || '---'}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none rotate-90" />
                        </div>
                        {errors.governorate && (touchedFields.governorate || wasNextAttempted) && <p className="text-[11px] text-red-500 font-bold pr-1">{errors.governorate.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600 pr-1 flex items-center gap-2">
                            المدينة
                            {isLoadingLocations && <Loading minimal={true} className="inline-flex mr-2 scale-75" />}
                        </label>
                        <div className="relative">
                            <select
                                {...register('city')}
                                className="w-full h-14 px-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 font-black text-sm outline-none focus:border-brand-primary transition-colors cursor-pointer appearance-none"
                                disabled={!watch('governorate') || isLoadingLocations}
                            >
                                <option value="">اختر المدينة</option>
                                {cities?.map(city => (
                                    <option key={city.id} value={city.id}>{city.name_ar || city.name || '---'}</option>
                                ))}
                            </select>
                            <ChevronRight className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none rotate-90" />
                        </div>
                        {errors.city && (touchedFields.city || wasNextAttempted) && <p className="text-[11px] text-red-500 font-bold pr-1">{errors.city.message}</p>}
                    </div>
                </div>
            )}

            {selectedRole === 'customer' && (
                <Input
                    label="العنوان بالتفصيل"
                    {...register('addressDetail')}
                    placeholder="اسم الحي الشارع رقم المبني..."
                    error={errors.addressDetail}
                    isTouched={touchedFields.addressDetail}
                    wasNextAttempted={wasNextAttempted}
                />
            )}

            <div className="space-y-4 pt-4 border-t border-slate-50">
                <Checkbox
                    label="أقر بأن جميع البيانات المدخلة صحيحة"
                    {...register('agreeCorrectInfo')}
                    error={errors.agreeCorrectInfo}
                    isTouched={touchedFields.agreeCorrectInfo}
                    wasNextAttempted={wasNextAttempted}
                />
                <Checkbox
                    label="أوافق على الشروط والأحكام"
                    {...register('agreeTerms')}
                    error={errors.agreeTerms}
                    isTouched={touchedFields.agreeTerms}
                    wasNextAttempted={wasNextAttempted}
                />
            </div>
        </div>
    )
}

const Input = React.forwardRef(({ label, icon: Icon, error, isTouched, wasNextAttempted, className, isLoading, ...props }, ref) => {
    const showError = error && (isTouched || wasNextAttempted)
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && <label className="text-[13px] font-bold text-[#57534d] block pr-1">{label}</label>}
            <div className="relative group">
                <input
                    ref={ref}
                    className={cn(
                        "w-full h-13 pr-11 pl-12 rounded-[1.25rem] border-2 outline-none transition-all font-bold text-[13px] bg-slate-50/50 placeholder:text-slate-300",
                        showError ? "border-red-500" : "border-slate-100 focus:border-brand-primary"
                    )}
                    {...props}
                />
                {Icon && <Icon className="absolute right-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />}
                {isLoading && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Loading minimal={true} />
                    </div>
                )}
            </div>
            {showError && <p className="text-[11px] text-red-500 font-bold pr-1">{error.message}</p>}
        </div>
    )
})

const Checkbox = React.forwardRef(({ label, error, isTouched, wasNextAttempted, ...props }, ref) => {
    const showError = error && (isTouched || wasNextAttempted)
    return (
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex items-center">
                <input type="checkbox" className="peer hidden" ref={ref} {...props} />
                <div className={cn(
                    "h-5 w-5 rounded-full border-2 transition-all flex items-center justify-center peer-checked:[&>svg]:scale-100 shrink-0",
                    showError ? "border-red-500 bg-red-50" : "border-slate-200 peer-checked:bg-[#064e3b] peer-checked:border-[#064e3b]"
                )}>
                    <Check className="h-3 w-3 text-white scale-0 transition-transform" />
                </div>
            </div>
            <div>
                <p className="text-[11px] font-bold text-[#57534d] group-hover:text-slate-700 transition-colors whitespace-nowrap">
                    {label}
                </p>
                {showError && <p className="text-[10px] text-red-500 font-black mt-0.5">{error.message}</p>}
            </div>
        </label>
    )
})

