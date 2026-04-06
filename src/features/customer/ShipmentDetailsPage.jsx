import { useParams, useNavigate } from 'react-router-dom'
import {
    Package,
    MapPin,
    Truck,
    ShieldCheck,
    Calendar,
    Weight,
    Maximize,
    User,
    Phone,
    DollarSign,
    ArrowLeftRight,
    Star,
    MessageCircle,
    Loader2,
    TrendingUp,
    ChevronLeft
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { getGoodsTypeLabel, getStatusStyles } from '@/utils/shipmentUtils'
import { useState, useEffect } from 'react'
import { shipmentService } from '@/services/shipmentService'
import { useAuthStore } from '@/store/useAuthStore'

export const ShipmentDetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { role } = useAuthStore()
    const [shipment, setShipment] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchShipment = async () => {
        setIsLoading(true)
        try {
            const data = await shipmentService.getShipmentById(id)
            setShipment(data)
            console.log(data);

        } catch (error) {
            console.error('Failed to fetch shipment details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchShipment()
    }, [id])

    const shipmentOffers = shipment?.bids || []
    const acceptedOffer = shipmentOffers.find(o => o.status === 'accepted')

    const formatDimension = (value) => {
        if (!value) return '-';
        const num = parseFloat(value);
        return isNaN(num) ? '-' : num.toFixed(2);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-pulse">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-400 font-bold">جاري تحميل تفاصيل الشحنة...</p>
            </div>
        )
    }

    if (!shipment) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package className="h-10 w-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 border-none">الشحنة غير موجودة</h2>
                <Button
                    onClick={() => navigate(role === 'driver' ? '/driver/available' : '/customer/shipments')}
                    className="mt-6 font-bold"
                >
                    العودة لـ {role === 'driver' ? 'الشحنات المتاحة' : 'شحناتي'}
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">تفاصيل الشحنة</h1>
                            <span className={cn(
                                "px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest ring-1 ring-inset",
                                getStatusStyles(shipment.status).bg,
                                getStatusStyles(shipment.status).text,
                                getStatusStyles(shipment.status).border.replace('border-', 'ring-')
                            )}>
                                {shipment.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] md:text-[10px] font-black text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">{shipment.displayId}</span>
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-slate-100 dark:border-slate-800">
                                <Calendar className="h-3 w-3" />
                                {shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMMM yyyy', { locale: ar }) : '--'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    {role === 'customer' && (
                        <>
                            {['في انتظار العروض', 'عروض رهن المراجعة'].includes(shipment.status) && (
                                <button
                                    onClick={() => navigate(`/customer/edit/${shipment.id}`)}
                                    className="flex items-center justify-center gap-1.5 px-4 h-9 md:h-10 rounded-md text-[10px] md:text-xs font-black text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all ring-1 ring-slate-200 dark:ring-slate-700 hover:ring-slate-300"
                                >
                                    تعديل الشحنة
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/customer/tracking/${shipment.id}`)}
                                className="flex items-center justify-center gap-1.5 px-5 h-9 md:h-10 rounded-md text-[10px] md:text-xs font-black text-white bg-brand-primary hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/20 transition-all active:scale-95"
                            >
                                تتبع المسار
                            </button>
                        </>
                    )}

                    {role === 'driver' && (
                        <button
                            onClick={() => navigate(`/driver/available/${shipment.id}/submit`)}
                            className="flex items-center justify-center gap-1.5 px-6 h-10 md:h-11 rounded-md text-[11px] md:text-sm font-black text-white bg-brand-primary hover:bg-brand-primary/90 shadow-sm shadow-brand-primary/20 transition-all active:scale-95"
                        >
                            تقديم عرض سعر الآن
                            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Offers Notification */}
            {!acceptedOffer && shipment.bidsCount > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 bg-white dark:bg-slate-900 border border-brand-primary/20 rounded-[1.5rem] shadow-sm hover:border-brand-primary/40 transition-all relative overflow-hidden group animate-in slide-in-from-top-4 duration-500">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-primary"></div>
                    <div className="flex items-center gap-3 md:gap-4 pl-4 sm:pl-0">
                        <div className="h-10 w-10 md:h-12 md:w-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary shrink-0 group-hover:rotate-6 transition-transform">
                            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                                يوجد عروض مقدمة
                                <span className="flex items-center justify-center bg-brand-primary text-white text-[9px] md:text-[11px] h-4 w-4 md:h-5 md:w-5 rounded-full shadow-sm">
                                    {shipment.bidsCount}
                                </span>
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5">هناك أسعار قدمها السائقون بانتظار موافقتك.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(role === 'customer' ? `/customer/bids/${shipment.id}` : '#')}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white px-5 h-9 md:h-10 rounded-full font-black text-[10px] md:text-[11px] transition-colors duration-300"
                    >
                        عرض السائقين
                        <ChevronLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Route Card */}
                    <Card className="rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 md:p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                                <div className="h-8 w-8 md:h-10 md:w-10 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center text-slate-500">
                                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white text-sm md:text-base">المسار</h3>
                            </div>

                            <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 relative">
                                <div className="flex-1 space-y-2 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                                        <p className="text-[10px] md:text-[11px] font-black text-emerald-600 uppercase tracking-widest">نقطة الانطلاق</p>
                                    </div>
                                    <div className="pr-4 border-r-2 border-emerald-100 dark:border-emerald-900/30 py-1">
                                        <p className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight mb-1">
                                            {shipment.pickupGovernorate}، {shipment.pickupCity}
                                        </p>
                                        <p className="text-[11px] md:text-xs font-bold text-slate-500 leading-relaxed">
                                            {shipment.pickupAddress}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col items-center justify-center px-4 relative w-20">
                                    <div className="w-full h-px border-t border-dashed border-slate-300 dark:border-slate-700 absolute top-1/2 left-0 -translate-y-1/2"></div>
                                    <div className="h-8 w-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center relative z-10 text-slate-400 shadow-sm">
                                        <ChevronLeft className="h-4 w-4" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-2 relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-2 w-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></div>
                                        <p className="text-[10px] md:text-[11px] font-black text-red-600 uppercase tracking-widest">نقطة التسليم</p>
                                    </div>
                                    <div className="pr-4 border-r-2 border-red-100 dark:border-red-900/30 py-1">
                                        <p className="text-sm md:text-base font-black text-slate-900 dark:text-white leading-tight mb-1">
                                            {shipment.destinationGovernorate}، {shipment.destinationCity}
                                        </p>
                                        <p className="text-[11px] md:text-xs font-bold text-slate-500 leading-relaxed">
                                            {shipment.destinationAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Goods Details Card */}
                    <Card className="rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-5 md:p-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-3 bg-slate-50/30 dark:bg-slate-800/20">
                                <div className="h-8 w-8 md:h-10 md:w-10 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center text-slate-500">
                                    <Package className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white text-sm md:text-base">تفاصيل الشحنة</h3>
                            </div>
                            <div className="p-5 md:p-6 space-y-8">
                                {/* Row 1: Core Info */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نوع الشحنة</p>
                                        <span className="text-xs md:text-sm font-black text-slate-800 dark:text-white whitespace-nowrap">{getGoodsTypeLabel(shipment.goodsType)}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الوزن</p>
                                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                            <Weight className="h-3.5 w-3.5 text-brand-primary" />
                                            <span className="whitespace-nowrap">{formatDimension(shipment.weight)} كجم</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تاريخ النشر</p>
                                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                            <Calendar className="h-3.5 w-3.5 text-brand-primary" />
                                            <span className="whitespace-nowrap">{shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMMM yyyy', { locale: ar }) : '---'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Dimensions & Truck */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
                                    {(shipment.length || shipment.width || shipment.height || shipment.dimensions?.length || shipment.dimensions?.width || shipment.dimensions?.height) && (
                                        <div className="space-y-1">
                                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الأبعاد (سم)</p>
                                            <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                                <Maximize className="h-3.5 w-3.5 text-brand-primary" />
                                                <span className="whitespace-nowrap">
                                                    {formatDimension(shipment.length || shipment.dimensions?.length)} × {formatDimension(shipment.width || shipment.dimensions?.width)} × {formatDimension(shipment.height || shipment.dimensions?.height)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">نوع الشاحنة المطلوبة</p>
                                        <div className="flex items-center gap-1.5 text-xs md:text-sm font-black text-slate-800 dark:text-white">
                                            <Truck className="h-3.5 w-3.5 text-brand-primary" />
                                            <span className="whitespace-nowrap">{shipment.truckType || 'أي نوع متوفر'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 md:p-6 pt-0 space-y-6">
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">وصف الشحنة والتعليمات</p>
                                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                        <p className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed text-right">
                                            {shipment.description || 'لا يوجد وصف إضافي تفصيلي'}
                                        </p>
                                        {shipment.note && shipment.note !== "لا يوجد ملاحظات" && (
                                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                                <p className="text-[9px] font-black text-brand-primary uppercase tracking-widest mb-1">ملاحظات إضافية</p>
                                                <p className="text-[11px] font-bold text-slate-500">{shipment.note}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(shipment.shipment_image || shipment.shipmentImage) && (
                                    <div>
                                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">صورة الشحنة</p>
                                        <div className="relative rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group/img">
                                            <img
                                                src={shipment.shipment_image || shipment.shipmentImage}
                                                alt="Shipment"
                                                className="w-full h-auto max-h-[400px] object-contain bg-slate-50 dark:bg-slate-900 transition-transform duration-700 group-hover/img:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-center p-4">
                                                <button
                                                    onClick={() => window.open(shipment.shipment_image || shipment.shipmentImage, '_blank')}
                                                    className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl"
                                                >
                                                    عرض الصورة كاملة
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Integrated Driver & Vehicle Card (Final Request) */}
                    {acceptedOffer && (
                        <div className="space-y-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse"></div>
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">بيانات السائق والرحلة</h3>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-full">
                                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                                    <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400">سائق معتمد موثق</span>
                                </div>
                            </div>

                            <Card className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/30 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Part 1: Driver Bar */}
                                    <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/50">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-lg overflow-hidden shrink-0">
                                                    {acceptedOffer.driver?.driverDetails?.profile_picture ? (
                                                        <img
                                                            src={acceptedOffer.driver.driverDetails.profile_picture}
                                                            alt={acceptedOffer.driver.full_name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-400">
                                                            <User className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-1.5 leading-none">
                                                        {acceptedOffer.driver?.full_name || acceptedOffer.driverName}
                                                    </h4>
                                                    <div className="flex items-center gap-4 text-slate-500">
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            <Phone className="h-3 w-3" />
                                                            <span className="text-xs font-bold tracking-widest leading-none" dir="ltr">{acceptedOffer.driver?.phone_number || '---'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 leading-none">4.9</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-brand-primary text-white hover:bg-brand-primary shadow-lg shadow-brand-primary/10 transition-all active:scale-95"
                                                    onClick={() => window.location.href = `tel:${acceptedOffer.driver?.phone_number || ''}`}
                                                >
                                                    <Phone className="h-4 w-4 md:h-5 md:w-5" />
                                                </Button>
                                                <Button
                                                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                                                    onClick={() => window.open(`https://wa.me/${acceptedOffer.driver?.phone_number || ''}`, '_blank')}
                                                    title="تواصل عبر واتساب"
                                                >
                                                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part 2: Vehicle Details */}
                                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">نوع المركبة</p>
                                                <span className="text-sm font-black text-slate-800 dark:text-white leading-none block">
                                                    {acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_type === 'MediumTruck' ? 'نصف نقل' :
                                                        acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_type === 'Pickup' ? 'ربع نقل' :
                                                            acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_type === 'MiniTruck' ? 'سوزوكي' :
                                                                acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_type === 'CargoTricycle' ? 'تروسيكل' : 'نقل عام'}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">موديل المركبة</p>
                                                <span className="text-sm font-black text-slate-800 dark:text-white leading-none block">
                                                    {acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_brand || '---'}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">لون المركبة</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded border border-slate-200 dark:border-slate-700" style={{ backgroundColor: acceptedOffer.driver?.vehicleDetails?.[0]?.color === 'أسود' ? '#000' : (acceptedOffer.driver?.vehicleDetails?.[0]?.color === 'أبيض' ? '#fff' : '#ccc') }}></div>
                                                    <span className="text-sm font-black text-slate-800 dark:text-white leading-none">
                                                        {acceptedOffer.driver?.vehicleDetails?.[0]?.color || '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Plate */}
                                        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">اللوحة المعدنية</p>
                                            <div className="bg-white dark:bg-slate-950 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 flex items-stretch h-12 shadow-sm w-full max-w-[240px]">
                                                <div className="w-1.5 bg-blue-600"></div>
                                                <div className="px-3 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                                                    <span className="text-[5px] font-black text-slate-400 leading-none">EGYPT</span>
                                                    <span className="text-[7px] font-black text-blue-600 leading-none mt-1">مصر</span>
                                                </div>
                                                <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-950 font-black text-lg text-slate-800 dark:text-white tracking-[0.4em] pr-4" dir="ltr">
                                                    {acceptedOffer.driver?.vehicleDetails?.[0]?.vehicle_plate_number || '---'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Costs Card */}
                    <Card className="rounded-[1.5rem] border-none shadow-sm bg-slate-900 text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                        <CardContent className="p-5 md:p-6 relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-8 md:h-10 md:w-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <h3 className="font-black text-base md:text-lg">التكاليف</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="flex justify-between items-end pb-4 border-b border-white/10">
                                    <div className="space-y-1">
                                        <p className="text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                            {acceptedOffer ? 'السعر النهائي' : 'السعر المتفق عليه'}
                                        </p>
                                        <div className="flex items-baseline gap-1">
                                            <p className="text-xl md:text-2xl font-black tracking-tighter">
                                                {acceptedOffer ? acceptedOffer.amount : 'لم يحدد بعد'}
                                            </p>
                                            {acceptedOffer && <span className="text-[9px] md:text-[10px] font-bold text-white/40 italic mb-0.5">EGP</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] md:text-xs font-bold text-white/60">
                                        <span>رسوم المنصة</span>
                                        <span>شاملة</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] md:text-xs font-bold text-white/60">
                                        <span>التأمين</span>
                                        <span>{shipment.insuranceRequested ? 'مفعل' : 'غير مفعل'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recipient Card */}
                    <Card className="rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-50/50 dark:bg-blue-900/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <CardContent className="p-5 md:p-6 relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-8 w-8 md:h-10 md:w-10 bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                    <User className="h-4 w-4 md:h-5 md:w-5" />
                                </div>
                                <h3 className="font-black text-sm md:text-base text-slate-800 dark:text-white">تفاصيل المستلم</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                                        <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">الاسم الكامل</p>
                                        <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white">{shipment.recipientName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                                            <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">رقم الهاتف</p>
                                            <p className="text-xs md:text-sm font-black text-slate-900 dark:text-white tracking-widest" dir="ltr">{shipment.recipientPhone}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
