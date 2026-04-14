import { useState } from 'react'
import {
    Box,
    MapPin,
    Truck,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Info,
    CheckCircle2,
    Package,
    Weight,
    Maximize,
    ArrowLeftRight,
    User,
    Phone,
    FileText,
    Upload,
    Camera,
    Plus,
    X
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { toast } from 'react-hot-toast'
import { cn } from '@/utils/cn'
import { useShipmentStore } from '@/store/useShipmentStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useAuthStore } from '@/store/useAuthStore'
import { shipmentService } from '@/services/shipmentService'
import { authService } from '@/services/authService'
import { API_BASE_URL } from '@/api/axiosClient'
import { GOODS_TYPES, getGoodsTypeLabel } from '@/utils/shipmentUtils'
import { Loading } from '@/components/ui/Loading'

// const steps = ['تفاصيل المنتج', 'المسار', 'المراجعة']
const steps = ['بيانات الشحنة', 'مراجعة وتأكيد']
const IS_PRICING_ENABLED = false; // قم بتغيير هذه القيمة إلى true لتفعيل التنسيق الأخير


const governorates = [
    'الوادي الجديد', 'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحر الأحمر', 'البحيرة', 'الفيوم', 'الغربية', 'الإسماعيلية', 'المنوفية', 'القليوبية', 'الأقصر', 'قنا', 'شمال سيناء', 'بورسعيد', 'سوهاج', 'جنوب سيناء', 'السويس', 'الشرقية', 'بني سويف', 'أسيوط', 'المنيا', 'دمياط', 'كفر الشيخ', 'مطروح', 'أسوان'
]

export const CreateShipmentPage = () => {
    const { id: editId } = useParams()
    const isEditMode = !!editId

    const { shipments, addShipment, updateShipment } = useShipmentStore()
    const addNotification = useNotificationStore((state) => state.addNotification)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        goodsType: 'electronics',
        otherGoodsType: '',
        weight: '',
        description: '',
        additionalNotes: '',
        shipmentImage: '',
        pickupGovernorate: 'الوادي الجديد',
        pickupCity: '',
        pickupAddress: '',
        destinationGovernorate: 'الوادي الجديد',
        destinationCity: '',
        destinationAddress: '',
        recipientName: '',
        recipientPhone: '',
        userRole: '', // '', 'sender' or 'recipient'
        dimensions: { width: '', length: '', height: '' },
        insuranceValue: '',
        insuranceRequested: false
    })
    const [errors, setErrors] = useState({})
    const [wasNextAttempted, setWasNextAttempted] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [displayId, setDisplayId] = useState(editId)

    const navigate = useNavigate()

    const [isInitialLoading, setIsInitialLoading] = useState(isEditMode)

    // Scroll to top when switching steps
    useEffect(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [step]);

    useEffect(() => {
        const fetchShipment = async () => {
            if (!isEditMode) return;

            try {
                setIsInitialLoading(true)
                // دائماً نقوم بجلب البيانات من السيرفر لضمان الحصول على الكائن الكامل
                const fetchedShipment = await shipmentService.getShipmentById(editId)

                if (fetchedShipment) {
                    // منع التعديل إذا كانت الحالة ليست معلقة
                    if (!['pending', 'waiting_for_offers', 'في انتظار العروض', 'عروض رهن المراجعة'].includes(fetchedShipment.status)) {
                        // note: fetchedShipment.status might be mapped/translated
                        // We check both raw and mapped if possible or just be safe
                        const isPending = ['pending', 'في انتظار العروض', 'عروض رهن المراجعة'].some(s =>
                            fetchedShipment.status?.toLowerCase().includes(s.toLowerCase()) ||
                            fetchedShipment.status === s
                        );

                        if (!isPending) {
                            toast.error('لا يمكن تعديل الشحنة بعد قبول العروض')
                            navigate('/customer/shipments')
                            return
                        }
                    }

                    if (fetchedShipment.displayId) {
                        setDisplayId(fetchedShipment.displayId)
                    }

                    setFormData({
                        goodsType: fetchedShipment.goods_type || fetchedShipment.goodsType || 'electronics',
                        otherGoodsType: fetchedShipment.other_goods_type || fetchedShipment.otherGoodsType || '',
                        weight: fetchedShipment.total_weight || fetchedShipment.weight || '',
                        description: fetchedShipment.description || '',
                        additionalNotes: fetchedShipment.note || fetchedShipment.additionalNotes || '',
                        shipmentImage: fetchedShipment.shipment_image || fetchedShipment.shipmentImage || '',
                        pickupGovernorate: fetchedShipment.pickupGovernorate || 'الوادي الجديد',
                        pickupCity: fetchedShipment.pickupCity || '',
                        pickupAddress: fetchedShipment.pickupAddressDetails || fetchedShipment.pickupAddress || '',
                        destinationGovernorate: fetchedShipment.destinationGovernorate || 'القاهرة',
                        destinationCity: fetchedShipment.destinationCity || '',
                        destinationAddress: fetchedShipment.destinationAddressDetails || fetchedShipment.destinationAddress || '',
                        recipientName: fetchedShipment.recipientName || '',
                        recipientPhone: fetchedShipment.recipientPhone || '',
                        userRole: fetchedShipment.userRole || fetchedShipment.user_role || 'sender',
                        dimensions: {
                            width: fetchedShipment.width || fetchedShipment.dimensions?.width || '',
                            length: fetchedShipment.length || fetchedShipment.dimensions?.length || '',
                            height: fetchedShipment.height || fetchedShipment.dimensions?.height || ''
                        },
                        insuranceValue: fetchedShipment.insuranceValue || '',
                        insuranceRequested: fetchedShipment.insuranceRequested || false
                    })
                }
            } catch (error) {
                console.error('Failed to fetch shipment for editing:', error)
                toast.error('تحذير: قد تظهر بعض البيانات ناقصة، يرجى إعادة تحميل الصفحة')
            } finally {
                setIsInitialLoading(false)
            }
        }
        fetchShipment()
    }, [isEditMode, editId, navigate])

    const validateStep = (currentStep) => {
        const newErrors = {}
        if (currentStep === 1) {
            // تفاصيل المنتج
            if (!formData.goodsType) newErrors.goodsType = 'نوع الشحنة مطلوب'
            if (formData.goodsType === 'other' && !formData.otherGoodsType) newErrors.otherGoodsType = 'برجاء تحديد نوع الشحنة'
            if (!formData.weight) newErrors.weight = 'الوزن مطلوب'
            if (!formData.description) newErrors.description = 'وصف الشحنة مطلوب'

            // المسار والعناوين
            if (!formData.pickupCity) newErrors.pickupCity = 'المدينة مطلوبة'
            if (!formData.pickupAddress) newErrors.pickupAddress = 'العنوان التفصيلي مطلوب'
            if (!formData.destinationCity) newErrors.destinationCity = 'المدينة مطلوبة'
            if (!formData.destinationAddress) newErrors.destinationAddress = 'العنوان التفصيلي مطلوب'

            // بيانات التواصل
            if (!formData.userRole) newErrors.userRole = 'برجاء تحديد دورك أولاً'
            if (formData.userRole) {
                if (!formData.recipientName) newErrors.recipientName = formData.userRole === 'sender' ? 'اسم المستلم مطلوب' : 'اسم المرسل مطلوب'
                if (!formData.recipientPhone) newErrors.recipientPhone = formData.userRole === 'sender' ? 'رقم هاتف المستلم مطلوب' : 'رقم هاتف المرسل مطلوب'
                else if (!/^01[0125]\d{8}$/.test(formData.recipientPhone)) newErrors.recipientPhone = 'رقم هاتف مصري غير صالح'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        setWasNextAttempted(true)
        if (validateStep(step)) {
            setWasNextAttempted(false)
            setStep(s => s + 1)
        }
    }
    const prevStep = () => {
        setWasNextAttempted(false)
        setStep(s => s - 1)
    }

    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // تطبيق قوانين المسارات
            if (field === 'pickupGovernorate') {
                if (value !== 'الوادي الجديد') {
                    newData.destinationGovernorate = 'الوادي الجديد';
                }
            } else if (field === 'destinationGovernorate') {
                if (prev.pickupGovernorate !== 'الوادي الجديد' && value !== 'الوادي الجديد') {
                    newData.destinationGovernorate = 'الوادي الجديد';
                }
            }

            return newData;
        })
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }))
        }
    }

    const { user } = useAuthStore()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageUpload = async (file) => {
        if (!file) return;

        const findStr = (obj) => {
            if (typeof obj === 'string') return obj;
            if (typeof obj !== 'object' || obj === null) return null;
            const keys = ['url', 'data', 'link', 'file', 'path', 'filePath'];
            for (const key of keys) {
                if (typeof obj[key] === 'string' && (obj[key].startsWith('http') || obj[key].includes('.'))) return obj[key];
            }
            for (let v of Object.values(obj)) {
                if (typeof v === 'string' && (v.startsWith('http') || v.includes('.') || v.startsWith('/'))) return v;
                if (typeof v === 'object' && v !== null) {
                    const nested = findStr(v);
                    if (nested) return nested;
                }
            }
            return null;
        };

        setIsUploading(true);
        const formData = new FormData();
        formData.append('key', 'shipment_image');
        formData.append('prefix', 'shipment');
        formData.append('file', file); // Use the original file object

        try {
            const res = await authService.uploadImage(formData);
            console.log('Image Upload Response:', res);

            let extractedUrl = findStr(res);
            if (extractedUrl && typeof extractedUrl === 'string') {
                if (!extractedUrl.startsWith('http')) {
                    extractedUrl = extractedUrl.startsWith('/') ? API_BASE_URL + extractedUrl : API_BASE_URL + '/' + extractedUrl;
                }
                handleChange('shipmentImage', extractedUrl);
                toast.success('تم رفع الصورة بنجاح');
            }
        } catch (err) {
            console.error('Failed to upload shipment image:', err);
            toast.error('فشل في رفع الصورة، يرجى المحاولة مرة أخرى');
        } finally {
            setIsUploading(false);
        }
    };

    const handlePublish = async () => {
        if (isSubmitting) return
        setWasNextAttempted(true)
        if (!validateStep(step)) {
            toast.error('يرجى التأكد من ملء كافة البيانات المطلوبة بشكل صحيح')
            return
        }

        const loadingToast = toast.loading('جاري نشر شحنتك...')
        setIsSubmitting(true)
        try {
            // Diagnostic: use a default placeholder if no image exists to see if it bypasses the error
            let shipmentImageUrl = formData.shipmentImage?.trim() || null;
            // If empty, set to null (User requested optional image)
            if (!shipmentImageUrl) {
                shipmentImageUrl = null;
            } else if (!shipmentImageUrl.startsWith('http')) {
                const baseUrl = API_BASE_URL.startsWith('http')
                    ? API_BASE_URL
                    : window.location.origin + (API_BASE_URL.startsWith('/') ? '' : '/') + API_BASE_URL;

                const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                const cleanPath = shipmentImageUrl.startsWith('/') ? shipmentImageUrl : '/' + shipmentImageUrl;
                shipmentImageUrl = cleanBase + cleanPath;
            }

            // Fallback for strict backend validation that requires a valid URL starting with http
            // even if the user didn't upload an image.
            const NO_IMAGE_URL = "https://placehold.co/1x1/transparent/transparent.png";

            const apiPayload = {
                goods_type: formData.goodsType,
                other_goods_type: formData.goodsType === 'other' ? (formData.otherGoodsType?.trim() || null) : null,
                total_weight: parseFloat(formData.weight) || 0,
                description: formData.description.trim(),
                note: formData.additionalNotes.trim() || "لا يوجد ملاحظات",
                shipment_image: shipmentImageUrl || NO_IMAGE_URL,
                pickupGovernorate: formData.pickupGovernorate.trim(),
                pickupCity: formData.pickupCity.trim(),
                pickupAddressDetails: formData.pickupAddress.trim(),
                destinationGovernorate: formData.destinationGovernorate.trim(),
                destinationCity: formData.destinationCity.trim(),
                destinationAddressDetails: formData.destinationAddress.trim(),
                recipientName: formData.recipientName.trim(),
                recipientPhone: formData.recipientPhone.trim(),
                user_role: formData.userRole
            }

            // Dimensions: ensure they are sent as numbers or excluded if 0
            if (formData.dimensions.width && parseFloat(formData.dimensions.width) > 0) apiPayload.width = parseFloat(formData.dimensions.width);
            if (formData.dimensions.height && parseFloat(formData.dimensions.height) > 0) apiPayload.height = parseFloat(formData.dimensions.height);
            if (formData.dimensions.length && parseFloat(formData.dimensions.length) > 0) apiPayload.length = parseFloat(formData.dimensions.length);

            console.log('Diagnostic Payload (with placeholder image):', apiPayload);

            if (isEditMode) {
                await shipmentService.updateShipment(editId, apiPayload)
                updateShipment({ id: editId, ...formData })
            } else {
                const result = await shipmentService.createShipment(apiPayload)
                addShipment({
                    ...formData,
                    id: result.id,
                    pickupPoint: `${formData.pickupCity}، ${formData.pickupAddress}`,
                    destinationPoint: `${formData.destinationCity}، ${formData.destinationAddress}`,
                    customerName: user?.full_name || '',
                    customerPhone: user?.phone || '',
                    customerId: user?.id || ''
                })
            }

            setTimeout(() => {
                navigate('/customer/shipments')
            }, 1000)

        } catch (error) {
            toast.error(error.message || 'فشل في اتمام العملية. يرجى المحاولة مرة أخرى.')
        } finally {
            toast.dismiss(loadingToast)
            setIsSubmitting(false)
        }
    }

    if (isInitialLoading) {
        return <Loading text="جاري تحضير بيانات الشحنة..." />
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-[24px] font-black text-[#1c1919] dark:text-white mb-2 tracking-tight">
                    {isEditMode ? `تعديل شحنة: ${displayId}` : 'إنشاء شحنة جديدة'}
                </h1>
                <p className="text-sm sm:text-base lg:text-md text-[#57534d] dark:text-slate-400 font-bold">
                    {isEditMode ? 'يمكنك تعديل تفاصيل شحنتك قبل قبول أي عرض' : 'يرجى إدخال كافة بيانات الشحنة بدقة ليتمكن الكباتن من تقديم أفضل العروض'}
                </p>
            </div>

            <Card className="mt-6 border-slate-100/50 shadow-sm rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-8">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 pr-1">نوع الشحنة <span className="text-rose-500">*</span></label>
                                    <select
                                        value={formData.goodsType}
                                        onChange={(e) => handleChange('goodsType', e.target.value)}
                                        className={cn(
                                            "w-full bg-white border rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none transition-all",
                                            errors.goodsType && wasNextAttempted ? "border-red-500" : "border-slate-100"
                                        )}
                                    >
                                        {GOODS_TYPES.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    {errors.goodsType && wasNextAttempted && <p className="text-xs text-red-500 font-bold pr-1">{errors.goodsType}</p>}
                                </div>
                                {formData.goodsType === 'other' && (
                                    <FormInput
                                        label="حدد نوع الشحنة"
                                        required
                                        placeholder="مثال: أعشاب طبية، قطع غيار..."
                                        icon={Package}
                                        value={formData.otherGoodsType}
                                        onChange={(e) => handleChange('otherGoodsType', e.target.value)}
                                    />
                                )}
                                <FormInput
                                    label="الوزن الإجمالي (كجم)"
                                    required
                                    type="number"
                                    placeholder="مثال: 450"
                                    icon={Weight}
                                    value={formData.weight}
                                    onChange={(e) => handleChange('weight', e.target.value)}
                                    error={errors.weight}
                                    wasNextAttempted={wasNextAttempted}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <FormInput
                                    label="العرض (سم) اختياري"
                                    type="number"
                                    icon={Maximize}
                                    value={formData.dimensions.width}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, width: e.target.value } }))}
                                    error={errors.width}
                                    wasNextAttempted={wasNextAttempted}
                                />
                                <FormInput
                                    label="الطول (سم) اختياري"
                                    type="number"
                                    icon={Maximize}
                                    value={formData.dimensions.length}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, length: e.target.value } }))}
                                    error={errors.length}
                                    wasNextAttempted={wasNextAttempted}
                                />
                                <FormInput
                                    label="الارتفاع (سم) اختياري"
                                    type="number"
                                    icon={Maximize}
                                    value={formData.dimensions.height}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: { ...prev.dimensions, height: e.target.value } }))}
                                    error={errors.height}
                                    wasNextAttempted={wasNextAttempted}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 pr-1">وصف الشحنة <span className="text-rose-500">*</span></label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    className={cn(
                                        "w-full bg-white border rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none transition-all h-24",
                                        errors.description && wasNextAttempted ? "border-red-500" : "border-slate-100"
                                    )}
                                    placeholder="اكتب وصفاً مفصلاً للمنتج وطريقة التغليف..."
                                ></textarea>
                                {errors.description && wasNextAttempted && <p className="text-xs text-red-500 font-bold pr-1">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700 pr-1">ملاحظات إضافية (اختياري)</label>
                                <textarea
                                    value={formData.additionalNotes}
                                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-brand-primary outline-none transition-all h-20"
                                    placeholder="أي تعليمات خاصة للكابتن..."
                                ></textarea>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-sm font-bold text-slate-700 pr-1">صورة الشحنة (اختياري)</label>
                                <div
                                    className={cn(
                                        "group relative min-h-[220px] rounded-[2.5rem] overflow-hidden transition-all duration-500",
                                        formData.shipmentImage
                                            ? "border-none shadow-2xl shadow-brand-primary/10"
                                            : "border-2 border-dashed border-slate-200 hover:border-brand-primary/40 bg-slate-50/50 hover:bg-brand-primary/5"
                                    )}
                                >
                                    {isUploading ? (
                                        <div className="absolute inset-0 z-20">
                                            <Loading section={true} text="جاري رفع الصورة..." className="h-full bg-white/80 backdrop-blur-sm border-none" />
                                        </div>
                                    ) : formData.shipmentImage ? (
                                        <div className="relative h-[280px] w-full group/img bg-slate-50 flex items-center justify-center overflow-hidden">
                                            {/* Background Blur Effect for premium look */}
                                            <img
                                                src={formData.shipmentImage}
                                                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
                                                alt=""
                                            />
                                            <img
                                                src={formData.shipmentImage}
                                                className="relative max-w-full max-h-full object-contain transition-all duration-700 group-hover:scale-105 z-10"
                                                alt="Shipment"
                                            />
                                            {/* Premium Overlay */}
                                            <div
                                                onClick={() => document.getElementById('shipment-image-input').click()}
                                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-[2px]"
                                            >
                                                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full mb-3 border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                                    <Upload className="h-6 w-6 text-white" />
                                                </div>
                                                <p className="text-white font-black text-sm tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform delay-75">تغيير الصورة</p>
                                            </div>

                                            {/* Delete Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChange('shipmentImage', '');
                                                }}
                                                className="absolute top-4 left-4 h-10 w-10 bg-white/90 hover:bg-rose-500 hover:text-white backdrop-blur-lg border border-slate-200/50 rounded-2xl flex items-center justify-center text-rose-500 shadow-xl transition-all duration-300 z-10 hover:rotate-90 active:scale-90"
                                                title="حذف الصورة"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => document.getElementById('shipment-image-input').click()}
                                            className="absolute inset-0 flex flex-col items-center justify-center p-8 cursor-pointer group/upload"
                                        >
                                            <div className="relative mb-6">
                                                <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50 group-hover/upload:shadow-brand-primary/20 group-hover/upload:-translate-y-2 transition-all duration-500">
                                                    <Upload className="h-10 w-10 text-slate-300 group-hover/upload:text-brand-primary transition-colors" />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg opacity-0 group-hover/upload:opacity-100 transition-all duration-500">
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <p className="text-md font-black text-slate-700 tracking-tight mb-2">ارفع صورة واضحة لشحنتك</p>
                                            <p className="text-xs text-slate-400 font-bold max-w-[200px] text-center leading-relaxed">الصور تزيد من ثقة الكباتن وتسرّع وصول العروض إليك</p>
                                        </div>
                                    )}
                                    <input
                                        id="shipment-image-input"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files[0])}
                                    />
                                </div>
                            </div>

                            {/* --- المسار والعناوين --- */}
                            <div className="pt-8 border-t border-slate-100 space-y-8">
                                <div className="bg-brand-primary/5 border border-brand-primary/10 p-5 rounded-[2rem] flex items-start gap-4">
                                    <div className="h-10 w-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Info className="h-5 w-5 text-brand-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h5 className="font-black text-brand-primary text-sm">سياسة الشحن للمنصة</h5>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                            منصتنا متخصصة في دعم محافظة الوادي الجديد. يجب أن تكون نقطة الانطلاق أو نقطة الوصول هي "الوادي الجديد".
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50">
                                        <h4 className="flex items-center gap-2 font-black text-emerald-700 mb-6 px-1">
                                            <div className="h-8 w-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            نقطة الانطلاق
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 pr-1 block">المحافظة</label>
                                                <select
                                                    value={formData.pickupGovernorate}
                                                    onChange={(e) => handleChange('pickupGovernorate', e.target.value)}
                                                    className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:border-brand-primary transition-all"
                                                >
                                                    {governorates.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                            </div>
                                            <FormInput
                                                label="المدينة / المنطقة"
                                                required
                                                placeholder="مثال: بلاط"
                                                value={formData.pickupCity}
                                                onChange={(e) => handleChange('pickupCity', e.target.value)}
                                                error={errors.pickupCity}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                            <FormInput
                                                label="العنوان التفصيلي"
                                                required
                                                placeholder="اسم الشارع، رقم المبنى..."
                                                className="md:col-span-2"
                                                value={formData.pickupAddress}
                                                onChange={(e) => handleChange('pickupAddress', e.target.value)}
                                                error={errors.pickupAddress}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-red-50/50 rounded-[2rem] border border-red-100/50">
                                        <h4 className="flex items-center gap-2 font-black text-red-700 mb-6 px-1">
                                            <div className="h-8 w-8 bg-red-500 text-white rounded-lg flex items-center justify-center">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            نقطة الوصول
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700 pr-1 block">المحافظة</label>
                                                <select
                                                    value={formData.destinationGovernorate}
                                                    onChange={(e) => handleChange('destinationGovernorate', e.target.value)}
                                                    className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold outline-none focus:border-brand-primary transition-all"
                                                >
                                                    {formData.pickupGovernorate !== 'الوادي الجديد' ? (
                                                        <option value="الوادي الجديد">الوادي الجديد</option>
                                                    ) : (
                                                        governorates.map(g => <option key={g} value={g}>{g}</option>)
                                                    )}
                                                </select>
                                            </div>
                                            <FormInput
                                                label="المدينة / المنطقة"
                                                required
                                                placeholder="مثال:  الخارجة"
                                                value={formData.destinationCity}
                                                onChange={(e) => handleChange('destinationCity', e.target.value)}
                                                error={errors.destinationCity}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                            <FormInput
                                                label="العنوان التفصيلي"
                                                required
                                                placeholder="اسم الشارع، رقم المبنى..."
                                                className="md:col-span-2"
                                                value={formData.destinationAddress}
                                                onChange={(e) => handleChange('destinationAddress', e.target.value)}
                                                error={errors.destinationAddress}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                                                <ArrowLeftRight className="h-5 w-5 text-brand-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-800 text-sm">أنت تقوم بإنشاء هذه الشحنة بصفتك؟</h4>
                                                <p className="text-[10px] font-bold text-slate-500">حدد دورك لتنظيم بيانات التواصل بشكل صحيح</p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <select
                                                value={formData.userRole}
                                                onChange={(e) => handleChange('userRole', e.target.value)}
                                                className={cn(
                                                    "w-full sm:w-64 h-12 bg-white border rounded-2xl px-4 text-sm font-black outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all cursor-pointer appearance-none shadow-sm",
                                                    errors.userRole && wasNextAttempted ? "border-red-500" : "border-slate-200"
                                                )}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23eb6a1d' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'left 1rem center',
                                                    backgroundSize: '1.2rem',
                                                    paddingLeft: '2.5rem'
                                                }}
                                            >
                                                <option value="" disabled>-- اختر --</option>
                                                <option value="sender">أنا المرسل (صاحب الشحنة)</option>
                                                <option value="recipient">أنا المستلم (أنتظر الشحنة)</option>
                                            </select>
                                            {errors.userRole && wasNextAttempted && <p className="text-[10px] text-red-500 font-bold mt-1 pr-1">{errors.userRole}</p>}
                                        </div>
                                    </div>

                                    {formData.userRole && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                                            <FormInput
                                                label={formData.userRole === 'sender' ? "اسم المستلم" : "اسم المرسل"}
                                                required
                                                placeholder={formData.userRole === 'sender' ? "أدخل اسم المستلم بالكامل" : "أدخل اسم المرسل بالكامل"}
                                                icon={User}
                                                value={formData.recipientName}
                                                onChange={(e) => handleChange('recipientName', e.target.value)}
                                                error={errors.recipientName}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                            <FormInput
                                                label={formData.userRole === 'sender' ? "رقم هاتف المستلم" : "رقم هاتف المرسل"}
                                                required
                                                placeholder="01xxxxxxxxx"
                                                icon={Phone}
                                                value={formData.recipientPhone}
                                                onChange={(e) => handleChange('recipientPhone', e.target.value)}
                                                error={errors.recipientPhone}
                                                wasNextAttempted={wasNextAttempted}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* <div className="h-40 bg-slate-100 rounded-[2rem] relative overflow-hidden flex items-center justify-center border border-slate-200">
                                <div className="text-center">
                                    <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-400 font-bold text-sm">خارطة تفاعلية لاختيار المواقع بدقة</p>
                                </div>
                            </div> */}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 text-right">
                            <div className="bg-emerald-50 p-4 sm:p-6 rounded-[2rem] border border-emerald-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4">
                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-emerald-100">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                                </div>
                                <div>
                                    <h4 className="font-black text-emerald-700 text-md sm:text-lg mb-1">شحنتك جاهزة للنشر</h4>
                                    <p className="text-[11px] sm:text-sm text-emerald-600/80 font-bold mb-3">يرجى مراجعة كافة البيانات قبل تأكيد الإرسال</p>
                                    <div className="bg-white/60 p-4 rounded-2xl border border-emerald-100/50 backdrop-blur-sm">
                                        <p className="text-[10px] sm:text-[12px] font-bold text-emerald-900 leading-relaxed">
                                            <span className="block mb-2 font-black text-emerald-700 underline decoration-brand-primary/20 decoration-2 underline-offset-4">تنبيه 🔒</span>
                                            يتم أرشفة الشحنات المنشورة ولا يمكن حذفها نهائياً لضمان الشفافية. يُمكنك <span className="font-black text-brand-primary">إلغاء الشحنة</span> فقط <span className="underline decoration-black/10">قبل قبول أي عروض</span>؛ بمجرد قبول العرض وتأكيده، لا يمكن التراجع عن العملية.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h5 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <Package className="h-4 w-4 text-brand-primary" />
                                            تفاصيل الشحنة
                                        </h5>
                                        <p className="text-sm text-slate-500 font-bold">النوع: <span className="font-black text-slate-800">{getGoodsTypeLabel(formData.goodsType, formData.otherGoodsType)}</span></p>
                                        <p className="text-sm text-slate-500 font-bold">الوزن: <span className="font-black text-slate-800">{formData.weight} كجم</span></p>
                                        {(formData.dimensions.width || formData.dimensions.length || formData.dimensions.height) && (
                                            <p className="text-sm text-slate-500 font-bold">الأبعاد: <span className="font-black text-slate-800">{formData.dimensions.length || '-'} × {formData.dimensions.width || '-'} × {formData.dimensions.height || '-'} سم</span></p>
                                        )}
                                        <p className="text-sm text-slate-500 font-bold">الوصف: <span className="font-black text-slate-800 block mt-1">{formData.description}</span></p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h5 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-brand-primary" />
                                            المسار والتوصيل
                                        </h5>
                                        <p className="text-sm text-slate-500 font-bold">من: <span className="font-black text-slate-800">{formData.pickupGovernorate}، {formData.pickupCity}</span></p>
                                        <p className="text-sm text-slate-500 font-bold text-[10px] pr-6 opacity-70">{formData.pickupAddress}</p>
                                        <p className="text-sm text-slate-500 font-bold mt-2">إلى: <span className="font-black text-slate-800">{formData.destinationGovernorate}، {formData.destinationCity}</span></p>
                                        <p className="text-sm text-slate-500 font-bold text-[10px] pr-6 opacity-70">{formData.destinationAddress}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h5 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                            <User className="h-4 w-4 text-brand-primary" />
                                            {formData.userRole === 'sender' ? "بيانات المستلم" : "بيانات المرسل"}
                                        </h5>
                                        <p className="text-sm text-slate-500 font-bold">الاسم: <span className="font-black text-slate-800">{formData.recipientName}</span></p>
                                        <p className="text-sm text-slate-500 font-bold">الهاتف: <span className="font-black text-slate-800">{formData.recipientPhone}</span></p>
                                    </div>

                                    {formData.additionalNotes && (
                                        <div className="space-y-3 pt-2">
                                            <h5 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-brand-primary" />
                                                ملاحظات إضافية
                                            </h5>
                                            <p className="text-sm text-slate-800 font-bold leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{formData.additionalNotes}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {formData.shipmentImage && (
                                        <div className="space-y-3 pt-2">
                                            <h5 className="font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                                                <Package className="h-4 w-4 text-brand-primary" />
                                                صورة الشحنة
                                            </h5>
                                            <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 group hover:border-brand-primary/30 transition-all">
                                                <img
                                                    src={formData.shipmentImage}
                                                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                                    alt="Shipment Preview"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        {step > 1 ? (
                            <Button variant="outline" className="gap-2 px-8 h-12 rounded-xl sm:w-auto w-full cursor-pointer" onClick={prevStep}>
                                <ChevronRight className="h-5 w-5" />
                                السابق
                            </Button>
                        ) : <div className="hidden sm:block"></div>}

                        {step < steps.length ? (
                            <Button className="gap-2 px-8 h-12 rounded-xl sm:w-auto w-full cursor-pointer" onClick={nextStep}>
                                التالي
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        ) : (
                            <Button
                                className={cn(
                                    "gap-2 px-6 sm:px-12 h-12 rounded-xl sm:w-auto w-full text-white transition-all duration-300 cursor-pointer",
                                    isEditMode
                                        ? "bg-brand-primary hover:bg-brand-primary/90"
                                        : "bg-emerald-600 hover:bg-emerald-700",
                                    isSubmitting && "cursor-not-allowed select-none text-white"
                                )}
                                onClick={handlePublish}
                            >
                                {isEditMode ? 'حفظ التعديلات' : 'نشر الشحنة الآن'}
                                {isEditMode ? <CheckCircle2 className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

export default CreateShipmentPage

const FormInput = ({ label, icon: Icon, error, wasNextAttempted, className, required, ...props }) => {
    const showError = error && wasNextAttempted
    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="text-sm font-bold text-slate-700 block pr-1">
                    {label}
                    {required && <span className="text-rose-500 mr-1">*</span>}
                </label>
            )}
            <div className="relative group">
                <input
                    className={cn(
                        "w-full h-12 pr-11 pl-4 rounded-xl border outline-none transition-all font-bold text-sm bg-white placeholder:text-slate-300",
                        showError ? "border-red-500 focus:border-red-500" : "border-slate-100 focus:border-brand-primary"
                    )}
                    {...props}
                />
                {Icon && <Icon className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
                    showError ? "text-red-400" : "text-slate-400 group-focus-within:text-brand-primary"
                )} />}
            </div>
            {showError && <p className="text-[11px] text-red-500 font-bold pr-1">{error}</p>}
        </div>
    )
}

