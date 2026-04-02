import * as z from 'zod'

// --- Step 2: Personal Info Base ---
export const step2BaseSchema = z.object({
    fullName: z.string().min(5, 'الأسم الكامل يجب أن يكون أكثر من 5 أحرف'),
    email: z.string().email('بريد إلكتروني غير صالح'),
    phone: z.string().regex(/^01[0125]\d{8}$/, 'رقم هاتف مصري غير صالح'),
    password: z.string().min(8, 'كلمة المرور يجب أن لا تقل عن 8 أحرف'),
})

// --- Driver Extensions ---
export const driverStep1Schema = step2BaseSchema.extend({
    nationalId: z.string().length(14, 'الرقم القومي يجب أن يكون 14 رقم'),
    dob: z.string().min(1, 'تاريخ الميلاد مطلوب').refine(date => {
        const age = new Date().getFullYear() - new Date(date).getFullYear()
        return age >= 21
    }, 'يجب أن يكون عمر السائق 21 سنة على الأقل'),
    personalPhoto: z.string().min(1, 'الصورة الشخصية مطلوبة'),
})

export const driverStep2Schema = z.object({
    governorate: z.string().min(1, 'المحافظة مطلوبة'),
    city: z.string().min(2, 'المدينة مطلوبة'),
    addressDetail: z.string().min(10, 'العنوان يجب أن يكون مفصلاً'),
    licenseNumber: z.string().min(5, 'رقم الرخصة مطلوب'),
    licenseExpiry: z.string().min(1, 'تاريخ انتهاء الرخصة مطلوب'),
    licenseFront: z.string().min(1, 'صورة وجه الرخصة مطلوبة'),
    licenseBack: z.string().min(1, 'صورة ظهر الرخصة مطلوبة'),
    vehicleType: z.enum(['ربع نقل', 'نصف نقل', 'سزوكي/فان', 'ملاكي', 'أخرى']),
    vehicleBrand: z.string().min(2, 'ماركة المركبة مطلوبة'),
    vehicleModel: z.string().min(1, 'موديل المركبة مطلوب'),
    vehicleColor: z.string().min(2, 'لون المركبة مطلوب'),
    plateNumber: z.string().min(3, 'رقم اللوحة مطلوب'),
    vehicleLicenseExpiry: z.string().min(1, 'تاريخ انتهاء رخصة المركبة مطلوب'),
    vehicleLicenseFront: z.string().min(1, 'صورة وجه رخصة المركبة مطلوبة'),
    vehicleLicenseBack: z.string().min(1, 'صورة ظهر رخصة المركبة مطلوبة'),
    agreeCorrectInfo: z.boolean().refine(val => val === true, 'يجب الإقرار بصحة البيانات'),
    agreeTerms: z.boolean().refine(val => val === true, 'يجب الموافقة على الشروط'),
})

// --- Customer Extensions ---
export const customerSchema = z.object({
    governorate: z.string().min(1, 'المحافظة مطلوبة'),
    city: z.string().min(2, 'المدينة مطلوبة'),
    addressDetail: z.string().min(10, 'العنوان يجب أن يكون مفصلاً'),
    agreeCorrectInfo: z.boolean().refine(val => val === true, 'يجب الإقرار بصحة البيانات'),
    agreeTerms: z.boolean().refine(val => val === true, 'يجب الموافقة على الشروط'),
})

// --- Final Combined Schemas ---
export const finalDriverSchema = driverStep1Schema.merge(driverStep2Schema)
export const finalCustomerSchema = step2BaseSchema.merge(customerSchema)
