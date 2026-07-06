import * as z from 'zod'

// --- Enums for Backend ---
export const UserRole = {
    CLIENT: 'client',
    DRIVER: 'driver',
};

// --- Base Personal Info ---
export const personalInfoSchema = z.object({
    fullName: z.string().trim().min(5, 'الأسم الكامل يجب أن يكون أكثر من 5 أحرف'),
    email: z.string().trim().email('بريد إلكتروني غير صالح'),
    phone: z.string().trim().regex(/^01[0125]\d{8}$/, 'رقم هاتف مصري غير صالح'),
    password: z.string()
        .min(8, 'كلمة المرور يجب أن لا تقل عن 8 أحرف')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            'يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتشمل حرف كبير وصغير ورقم ورمز خاص'),
    confirmPassword: z.string().min(8, 'تأكيد كلمة المرور مطلوب'),
    birthDate: z.string().min(1, 'تاريخ الميلاد مطلوب'),
}).refine(data => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"]
});

// --- Address Schema ---
export const addressSchema = z.object({
    governorate: z.string().min(1, 'المحافظة مطلوبة'),
    city: z.string().min(1, 'المدينة مطلوبة'),
    addressDetail: z.string().min(10, 'العنوان يجب أن يكون مفصلاً'),
});

// --- Driver Specific (Personal Info Extension) ---
export const driverPersonalInfoSchema = personalInfoSchema.extend({
    nationalId: z.string().regex(/^\d{14}$/, 'الرقم القومي يجب أن يكون 14 رقم'),
    licenseNumber: z.string().min(5, 'رقم الرخصة غير صالح'),
    licenseExpiry: z.string().min(1, 'تاريخ انتهاء الرخصة مطلوب'),
    driverPhoto: z.any().refine(v => !!v, 'صورة الكابتن مطلوبة'),
    licenseFront: z.any().refine(v => !!v, 'صورة وجه الرخصة مطلوبة'),
    licenseBack: z.any().refine(v => !!v, 'صورة ظهر الرخصة مطلوبة'),
    nationalIdFront: z.any().refine(v => !!v, 'صورة وجه البطاقة مطلوبة'),
    nationalIdBack: z.any().refine(v => !!v, 'صورة ظهر البطاقة مطلوبة'),
    ...addressSchema.shape
}).refine(data => {
    const birth = new Date(data.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age >= 21;
}, {
    message: 'يجب أن يكون العمر 21 عاماً على الأقل للكباتن',
    path: ['birthDate']
});

// --- Driver Vehicle Details ---
export const vehicleSchema = z.object({
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
}, { message: "يرجى إدخال نوع المركبة", path: ["vehicleTypeOther"] });

// --- Combined Driver Schema ---
export const finalDriverSchema = driverPersonalInfoSchema.merge(vehicleSchema);

// --- Client Schema ---
export const finalCustomerSchema = personalInfoSchema.extend({
    ...addressSchema.shape,
    agreeCorrectInfo: z.boolean().refine(v => v === true, 'يجب الإقرار بصحة البيانات'),
    agreeTerms: z.boolean().refine(v => v === true, 'يجب الموافقة على الشروط الأتفاقية'),
});