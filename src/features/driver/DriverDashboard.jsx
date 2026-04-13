import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wallet, TrendingUp, MapPin, Truck, Clock, Package,
    ChevronLeft, Navigation, Phone, User as UserIcon,
    MessageSquare, CheckCircle2, Box, Bell, Zap,
    Star, ArrowUpRight, Search, LayoutGrid, Timer,
    Weight, ArrowRightLeft, AlertTriangle, Eye, ShieldCheck
} from 'lucide-react'
import { useShipmentStore } from '@/store/useShipmentStore'
import { useOfferStore } from '@/store/useOfferStore'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'react-hot-toast'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { cn } from '@/lib/utils'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, getStatusStyles, mapShipmentData } from '@/utils/shipmentUtils'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export const DriverDashboard = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { offers = [] } = useOfferStore()

    const [availableShipments, setAvailableShipments] = useState([])
    const [assignedShipments, setAssignedShipments] = useState([])
    const [isFetchingAvailable, setIsFetchingAvailable] = useState(false)
    const [isOnline, setIsOnline] = useState(true)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState(null)
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [isConfirmingDelivery, setIsConfirmingDelivery] = useState(false);
    const [selectedShipmentId, setSelectedShipmentId] = useState(null);

    const fetchDashboardData = async () => {
        setIsFetchingAvailable(true)
        try {
            const availableResponse = await shipmentService.searchAvailableShipments({ skip: 0, take: 3 })
            const availableList = (availableResponse.data?.shipments || (Array.isArray(availableResponse.data) ? availableResponse.data : [])).map(mapShipmentData);
            setAvailableShipments(availableList)

            const assignedResponse = await shipmentService.getAssignedShipments({ skip: 0, take: 5 })
            const assignedList = (assignedResponse.data?.shipments || (Array.isArray(assignedResponse.data) ? assignedResponse.data : [])).map(s => {
                const mapped = mapShipmentData(s);
                return mapped;
            });
            setAssignedShipments(assignedList)

            // Fetch Bidding Dashboard Stats
            try {
                const bidStatsRes = await shipmentService.getBidDashboardStats();
                setStats(bidStatsRes.data || bidStatsRes);
            } catch (err) {
                console.warn('Failed to fetch bid stats:', err);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setIsFetchingAvailable(false)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const activeTrip = assignedShipments.find(s => {
        const sStatusOriginal = (s.status_original || '').toLowerCase();
        const sStatusMapped = s.status || '';

        // Hide if delivered or canceled
        if (sStatusOriginal === 'delivered' || sStatusMapped === 'تم التسليم') return false;
        if (sStatusOriginal === 'canceled' || sStatusOriginal === 'cancelled' || sStatusMapped === 'ملغي') return false;

        // Otherwise, if it's assigned to me, it's active
        return true;
    });

    // Earnings data from API
    const totalEarnings = stats?.total?.earnings || stats?.totalEarnings || 0
    const monthlyGrowth = stats?.monthly?.growth || stats?.monthlyGrowth || 0
    const target = stats?.target || 20000 // If API doesn't provide target, use a sensible default or hide
    const earningsProgress = (totalEarnings / target) * 100

    const handleStartNavigation = async (shipmentId) => {
        try {
            await shipmentService.updateShipmentStatus(shipmentId);
            toast.success('تم بدء الرحلة بنجاح');
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to start navigation:', error);
            toast.error(error.message || 'فشل في بدء الرحلة');
        }
    };

    const handleArrived = async (shipmentId) => {
        try {
            await shipmentService.updateShipmentStatus(shipmentId);
            toast.success('تم تأكيد الوصول لموقع التوصيل');
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to confirm arrival:', error);
            toast.error(error.message || 'فشل في تأكيد الوصول');
        }
    };

    const handleCompleteDelivery = async (shipmentId) => {
        try {
            await shipmentService.confirmDelivery(shipmentId);
            toast.success('تم إتمام التوصيل بنجاح');
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to complete delivery:', error);
            toast.error(error.message || 'فشل في إتمام التوصيل');
        }
    };

    if (loading) {
        return <Loading fullScreen={true} text="جاري تحميل البيانات..." />
    }

    return (
        <div className="overflow-x-hidden" dir="rtl">
            {/* --- Unified Master Header --- */}
            <div className="pb-2">
                <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden">
                    {/* Decorative aura */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#eb6a1d]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10 space-y-6 md:space-y-8">
                        {/* Top Section: Greeting & Toggle */}
                        <div className="flex items-start justify-between">
                            <div className="space-y-1.5">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                    مرحبا {user?.full_name?.split(' ')[0]}
                                </h1>
                                <p className={cn(
                                    "text-sm font-bold leading-tight",
                                    (activeTrip || isOnline) ? "text-[#009966]" : "text-slate-400"
                                )}>
                                    {activeTrip ? "أنت في رحلة نشطة الآن" : (isOnline ? "جاهز لاستقبال شحنات جديدة" : "غير متاح حالياً")}
                                </p>
                            </div>

                            {/* Status Toggle (Left Aligned) */}
                            <div className="flex flex-col items-center gap-1.5 bg-slate-50 p-2 rounded-2xl border border-slate-100/50">
                                <button
                                    onClick={() => setIsOnline(!isOnline)}
                                    className={cn(
                                        "w-10 h-5.5 rounded-full p-0.5 transition-all duration-500 relative flex items-center shadow-inner cursor-pointer",
                                        isOnline ? "bg-[#009966]" : "bg-slate-300"
                                    )}
                                >
                                    <motion.div
                                        initial={false}
                                        animate={{ x: isOnline ? 0 : -18 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className="h-4 w-4 bg-white rounded-full shadow-sm z-10"
                                    />
                                </button>
                                <span className={cn("text-[9px] font-black uppercase tracking-tighter", isOnline ? "text-[#009966]" : "text-slate-400")}>
                                    {isOnline ? 'متاح' : 'مغلق'}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Section: Primary Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Button
                                onClick={() => navigate('/driver/available')}
                                className="h-14 bg-[#eb6a1d] hover:bg-[#d45a16] text-white rounded-2xl font-black text-xs shadow-lg shadow-orange-200/40 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                عرض الشحنات
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/driver/active')}
                                className="h-14 border-slate-100 text-slate-600 rounded-2xl font-black text-xs hover:bg-slate-50 bg-white transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                الطلبات النشطة
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 md:space-y-6 relative z-20">
                {/* --- Earnings Card (Gamified) --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="rounded-[2rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الأرباح</p>
                                    <div className="flex items-baseline gap-2">
                                        <h2 className="text-4xl font-black text-slate-900">{totalEarnings.toLocaleString()}</h2>
                                        <span className="text-xs font-bold text-slate-400">ج.م</span>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 text-[#009966] px-3 py-1.5 rounded-xl flex items-center gap-1">
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black">+{monthlyGrowth}%</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                    <span>هدف الشهر</span>
                                    <span className="text-slate-900">{Math.round(earningsProgress)}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${earningsProgress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-l from-[#eb6a1d] to-[#ff9d5c] rounded-full"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-[#14532d]/5 rounded-2xl border border-[#14532d]/10 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-[#14532d] text-white flex items-center justify-center">
                                    <Star className="h-4 w-4 fill-current text-white" />
                                </div>
                                <p className="text-[11px] font-bold text-[#14532d] leading-relaxed">
                                    رائع! أنت تقترب من هدفك. أنجز <span className="font-black underline">5 رحلات</span> إضافية للحصول على مكافأة.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* --- Trips Overview Section --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-xl font-black text-slate-900">نظرة عامة على اليوم</h3>
                    </div>
                    <Card className="rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 bg-white overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-600">إجمالي الرحلات</span>
                                </div>
                                <span className="text-lg font-black text-slate-900">{stats?.total?.trips || 0}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-600">قيد الوصول</span>
                                </div>
                                <span className="text-lg font-black text-slate-900">
                                    {assignedShipments.filter(s => (s.status_original || s.status) === 'arrived').length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-slate-600">رحلات مكتملة</span>
                                </div>
                                <span className="text-lg font-black text-emerald-600">{stats?.total?.trips || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>
                {/* --- Available Shipments --- */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900">شحنات متاحة لك</h3>
                        <Button variant="ghost" onClick={() => navigate('/driver/available')} className="text-[#eb6a1d] font-black text-xs hover:bg-orange-50 rounded-xl">عرض الكل</Button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {availableShipments.length > 0 ? availableShipments.filter(s => String(s.id) !== String(activeTrip?.id)).map((s, idx) => {
                                const apiBid = s.bids && s.bids.length > 0 ? s.bids[0] : null;
                                const localOffer = (offers || []).find(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'));
                                const hasBid = apiBid || localOffer;
                                const negotiatedPrice = apiBid ? (apiBid.negotiatedAmount || apiBid.negotiated_amount) : null;
                                const hasNegotiation = negotiatedPrice > 0;
                                const displayPrice = apiBid ? (negotiatedPrice || apiBid.amount) : localOffer?.price;

                                return (
                                    <motion.div
                                        key={s.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => navigate(`/driver/available/${s.id}`)}
                                        className={cn(
                                            "group relative rounded-[2rem] p-5 border transition-all cursor-pointer overflow-hidden backdrop-blur-sm",
                                            hasNegotiation
                                                ? "border-amber-500 bg-amber-50/50 shadow-md shadow-amber-500/10"
                                                : hasBid
                                                    ? "border-[#009966] bg-[#009966]/5 shadow-md shadow-[#009966]/5"
                                                    : "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 hover:bg-slate-50/50 hover:border-[#eb6a1d]/20 transition-all duration-300"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                                    hasNegotiation ? "bg-amber-500 text-white animate-pulse" : (hasBid ? "bg-[#009966] text-white" : "bg-slate-50 text-slate-400 group-hover:bg-[#eb6a1d]/10 group-hover:text-[#eb6a1d]")
                                                )}>
                                                    {hasNegotiation ? <TrendingUp className="h-5 w-5" /> : <Package className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-black text-sm text-slate-900">{getGoodsTypeLabel(s.goodsType)}</h4>
                                                        {hasNegotiation && (
                                                            <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-[8px] font-black text-amber-600 rounded-lg animate-bounce">
                                                                تفاوض!
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400">{s.weight} كجم</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={cn(
                                                    "text-lg font-black font-cairo",
                                                    hasNegotiation ? "text-amber-600" : (hasBid ? "text-[#009966]" : "text-[#eb6a1d]")
                                                )}>
                                                    {hasNegotiation ? (
                                                        <div className="flex items-baseline gap-1">
                                                            <span className="text-[9px] line-through opacity-40 ml-1">{apiBid.amount}</span>
                                                            {negotiatedPrice}
                                                        </div>
                                                    ) : hasBid ? (
                                                        <span className="flex items-baseline gap-1">
                                                            {displayPrice}
                                                        </span>
                                                    ) : (
                                                        <span>{s.price > 0 ? s.price : 'مزايدة'}</span>
                                                    )}
                                                </div>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                    {hasNegotiation ? 'عرض العميل' : 'جنيه مصري'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-slate-500">
                                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                                    <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", hasBid ? "bg-[#009966]" : "bg-emerald-500")}></div>
                                                    <span className="truncate">من {s.pickupGovernorate}، {s.pickupCity} ({s.pickupAddress || '---'})</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 min-w-0 flex-1 sm:text-right">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                                                    <span className="truncate">إلى {s.destinationGovernorate}، {s.destinationCity} ({s.destinationAddress || '---'})</span>
                                                </div>
                                            </div>


                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <Card className="p-12 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm border-dashed">
                                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Box className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 mb-2">لا توجد شحنات متاحة حالياً</h4>
                                    <p className="text-sm font-bold text-slate-400 mb-6">ابدأ بتقديم عروض أسعار على الشحنات المتاحة للبدء في العمل.</p>
                                    <Button onClick={() => navigate('/driver/available')} className="rounded-xl font-black bg-[#eb6a1d] px-8">عرض الشحنات المتاحة</Button>
                                </Card>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* --- Active Trip (Rich Details) --- */}
                {activeTrip ? (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="sticky top-4 z-50 mb-8"
                    >
                        <Card className="rounded-[2.5rem] border-[#eb6a1d]/20 shadow-2xl shadow-orange-200/40 bg-white/95 backdrop-blur-sm overflow-hidden border-2">
                            <div className="bg-[#eb6a1d]/10 px-6 py-3 border-b border-[#eb6a1d]/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-[#eb6a1d] animate-ping"></div>
                                    <span className="text-[10px] font-black text-[#eb6a1d] uppercase tracking-[0.2em]">رحلة نشطة حالياً</span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400">{activeTrip.displayId}</span>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Detailed Trip Info Grid */}
                                    <div className="space-y-5">
                                        {/* Row 1: Goods & Status */}
                                        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#eb6a1d] shadow-sm">
                                                    <Box className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">نوع الشحنة</p>
                                                    <h4 className="font-black text-slate-900 text-sm">{getGoodsTypeLabel(activeTrip.goodsType)}</h4>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">الحالة</p>
                                                <span className="text-[10px] font-black text-[#eb6a1d] bg-orange-50 px-2.5 py-1 rounded-lg">
                                                    {activeTrip.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Row 2: Two Columns for Pickup/Customer and Delivery/Recipient */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Pickup / Customer Info */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em]">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                    نقطة التحميل والعميل
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 leading-tight mb-2 pr-3.5 border-r-2 border-emerald-100">{activeTrip.pickupPoint}</p>

                                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-emerald-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                                                            <UserIcon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{activeTrip.customerName || '---'}</p>
                                                            <p className="text-[10px] font-bold text-slate-400">{activeTrip.customerPhone || '---'}</p>
                                                        </div>
                                                    </div>
                                                    <a href={`tel:${activeTrip.customerPhone}`} className="h-9 w-9 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 transition-all hover:bg-emerald-600">
                                                        <Phone className="h-4.5 w-4.5" />
                                                    </a>
                                                </div>
                                            </div>

                                            {/* Delivery / Recipient Info */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.1em]">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-primary"></div>
                                                    وجهة التوصيل والمستلم
                                                </div>
                                                <p className="text-xs font-bold text-slate-700 leading-tight mb-2 pr-3.5 border-r-2 border-orange-100">{activeTrip.destinationPoint}</p>

                                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-orange-100">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                                                            <UserIcon className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 leading-none mb-1">{activeTrip.recipientName || '---'}</p>
                                                            <p className="text-[10px] font-bold text-slate-400">{activeTrip.recipientPhone || '---'}</p>
                                                        </div>
                                                    </div>
                                                    <a href={`tel:${activeTrip.recipientPhone}`} className="h-9 w-9 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 active:scale-90 transition-all hover:bg-[#d45a16]">
                                                        <Phone className="h-4.5 w-4.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="outline" className="h-14 rounded-2xl gap-2 font-black border-slate-100 hover:bg-slate-50 cursor-pointer">
                                                <MessageSquare className="h-5 w-5 text-blue-500" />
                                                محادثة
                                            </Button>

                                            {/* Dynamic Button States */}
                                            {(() => {
                                                if (activeTrip.status === 'delivered' || activeTrip.status === 'تم التسليم') {
                                                    return (
                                                        <Button
                                                            disabled
                                                            className="h-14 bg-emerald-50 text-[#009966] border border-emerald-100 rounded-2xl font-black gap-2 opacity-100 cursor-default"
                                                        >
                                                            <CheckCircle2 className="h-5 w-5" />
                                                            تم تسليم الشحنة بنجاح
                                                        </Button>
                                                    );
                                                }

                                                if (activeTrip.status === 'arrived' || activeTrip.status === 'تم الوصول') {
                                                    return (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedShipmentId(activeTrip.id);
                                                                setIsOtpModalOpen(true);
                                                            }}
                                                            className="h-14 bg-[#009966] text-white rounded-2xl font-black gap-2 transition-all hover:bg-[#007a52] shadow-lg shadow-emerald-200/50 active:scale-95 cursor-pointer"
                                                        >
                                                            <ShieldCheck className="h-5 w-5" />
                                                            تأكيد التسليم
                                                        </Button>
                                                    );
                                                }

                                                if (activeTrip.status === 'delivery_in_progress' || activeTrip.status === 'جاري التوصيل' || activeTrip.status?.includes('جاري')) {
                                                    return (
                                                        <Button
                                                            onClick={() => handleArrived(activeTrip.id)}
                                                            className="h-14 bg-teal-600 text-white rounded-2xl font-black gap-2 transition-all hover:bg-teal-700 shadow-lg shadow-teal-200/50 active:scale-95 cursor-pointer"
                                                        >
                                                            <MapPin className="h-5 w-5" />
                                                            اتمام الوصول
                                                        </Button>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        onClick={() => handleStartNavigation(activeTrip.id)}
                                                        className="h-14 bg-slate-900 text-white rounded-2xl font-black gap-2 transition-all hover:bg-slate-800 shadow-lg shadow-slate-200 active:scale-95 cursor-pointer"
                                                    >
                                                        <Navigation className="h-5 w-5 text-orange-400" />
                                                        بدء الملاحة
                                                    </Button>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.section>
                ) : (
                    <motion.section
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100 bg-white/50 backdrop-blur-sm">
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-3">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                                    <Truck className="h-6 w-6 opacity-50" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-slate-900 text-sm">لا توجد رحلات نشطة حالياً</h4>
                                    <p className="text-[10px] font-bold text-slate-400">ابدأ بالبحث عن شحنات جديدة وابدأ الربح الآن</p>
                                </div>
                                <Button
                                    onClick={() => navigate('/driver/available')}
                                    variant="ghost"
                                    className="text-[#eb6a1d] font-black text-xs hover:bg-orange-50 rounded-xl gap-2 h-10 px-6"
                                >
                                    عرض الشحنات المتاحة <ChevronLeft className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.section>
                )}


                {/* OTP Confirmation Modal */}
                {isOtpModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-8">
                                <div className="text-center space-y-4 mb-8">
                                    <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                                        <ShieldCheck className="h-8 w-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black text-slate-900">تأكيد رمز الاستلام</h3>
                                        <p className="text-xs font-bold text-slate-400">اطلب الرمز من العميل لإتمام الرحلة</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <input
                                        type="text"
                                        maxLength={4}
                                        value={otpValue}
                                        autoFocus
                                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                                        placeholder="----"
                                        className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-3xl font-black tracking-[0.5em] focus:border-emerald-500 focus:bg-white transition-all outline-none"
                                    />

                                    <div className="flex flex-col gap-3">
                                        <Button
                                            onClick={async () => {
                                                if (otpValue.length < 4) {
                                                    toast.error('يرجى إدخال الرمز كاملاً');
                                                    return;
                                                }
                                                try {
                                                    setIsConfirmingDelivery(true);
                                                    console.log(`Confirming Delivery for ${selectedShipmentId} with OTP: ${otpValue}`);
                                                    await shipmentService.confirmDelivery(selectedShipmentId, { otp: otpValue });
                                                    toast.success('تم التسليم بنجاح');
                                                    setIsOtpModalOpen(false);
                                                    setOtpValue('');
                                                    fetchDashboardData();
                                                } catch (err) {
                                                    toast.error(err.message || 'الرمز غير صحيح');
                                                } finally {
                                                    setIsConfirmingDelivery(false);
                                                }
                                            }}
                                            disabled={isConfirmingDelivery || otpValue.length < 4}
                                            className="w-full h-14 bg-emerald-600 text-white rounded-xl font-black"
                                        >
                                            {isConfirmingDelivery ? "جاري التأكيد..." : "تأكيد واستلام الأرباح"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsOtpModalOpen(false);
                                                setOtpValue('');
                                            }}
                                            disabled={isConfirmingDelivery}
                                            className="w-full h-12 text-slate-400 font-bold"
                                        >
                                            إلغاء
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

