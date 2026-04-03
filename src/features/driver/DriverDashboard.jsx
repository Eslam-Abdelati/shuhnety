import { useNavigate } from 'react-router-dom'
import {
    Wallet,
    TrendingUp,
    MapPin,
    Truck,
    Clock,
    Package,
    ChevronLeft,
    ArrowRightLeft,
    Bell,
    Navigation,
    Phone,
    User as UserIcon,
    MessageSquare,
    CheckCircle2,
    Eye,
    Weight,
    Box
} from 'lucide-react'
import { useShipmentStore } from '@/store/useShipmentStore'
import { useOfferStore } from '@/store/useOfferStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { useState, useEffect } from 'react'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, getStatusStyles, formatEstimatedTime } from '@/utils/shipmentUtils'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const DriverDashboard = () => {
    const navigate = useNavigate()
    const { shipments = [], updateShipmentStatus } = useShipmentStore()
    const { offers = [] } = useOfferStore()
    const { user } = useAuthStore()
    const { addNotification } = useNotificationStore()
    const [availableShipments, setAvailableShipments] = useState([])
    const [assignedShipments, setAssignedShipments] = useState([])
    const [isFetchingAvailable, setIsFetchingAvailable] = useState(false)
    const [stats, setStats] = useState({ totalEarnings: 0, monthlyGrowth: 0 })

    const fetchDashboardData = async () => {
        setIsFetchingAvailable(true)
        try {
            // Fetch available shipments
            const availableResponse = await shipmentService.searchAvailableShipments({ skip: 0, take: 3 })
            const availableList = availableResponse.data?.shipments || (Array.isArray(availableResponse.data) ? availableResponse.data : [])
            setAvailableShipments(availableList)
            console.log(availableList);

            // Fetch assigned shipments for the driver
            const assignedResponse = await shipmentService.getAssignedShipments({ skip: 0, take: 5 })
            const assignedList = assignedResponse.data?.shipments || (Array.isArray(assignedResponse.data) ? assignedResponse.data : [])
            setAssignedShipments(assignedList)

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setIsFetchingAvailable(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    // we consider the first assigned shipment as the active trip for the driver
    const activeTrip = assignedShipments.find(s => s.status !== 'تم التوصيل' && s.status !== 'ملغي') || assignedShipments[0]

    const handleStartNavigation = async (shipmentId) => {
        try {
            await shipmentService.updateShipmentStatus(shipmentId, 'delivery_in_progress');
            addNotification({ title: 'تم التحديث', desc: 'تم بدء الرحلة بنجاح', type: 'success' });
            // Full reload to sync state as requested
            window.location.reload();
        } catch (error) {
            console.error('Failed to start navigation:', error);
        }
    };

    const handleCompleteDelivery = async (shipmentId) => {
        try {
            await shipmentService.updateShipmentStatus(shipmentId, 'delivered');
            addNotification({ title: 'تم الوصول', desc: 'تم إتمام التوصيل بنجاح', type: 'success' });
            // Full reload to sync state as requested
            window.location.reload();
        } catch (error) {
            console.error('Failed to complete delivery:', error);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Driver Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">مرحباً {user?.full_name}</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">حالتك الحالية: <span className="text-emerald-600 font-bold">{activeTrip ? 'في رحلة نشطة' : 'متاح للعمل'}</span></p>
                </div>

            </div>

            {/* Earnings Overview */}
            <Card className="bg-brand-primary text-white border-none shadow-2xl relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <CardContent className="p-8 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        {stats?.monthlyGrowth > 0 && (
                            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-black">
                                <TrendingUp className="h-3 w-3" />
                                <span>+{stats.monthlyGrowth}% هذا الشهر</span>
                            </div>
                        )}
                    </div>

                    {stats?.totalEarnings > 0 ? (
                        <>
                            <p className="text-sm font-bold opacity-70 mb-1">إجمالي الأرباح</p>
                            <div className="flex items-baseline gap-2">
                                <h2 className="text-4xl font-black">
                                    {stats.totalEarnings.toLocaleString()}
                                </h2>
                                <span className="text-lg font-bold opacity-60">EGP</span>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-1">
                            <p className="text-xl font-black mb-1">ابدأ رحلتك الأولى الآن!</p>
                            <p className="text-xs font-bold opacity-60">عروضك المقبولة ستظهر أرباحها هنا مباشرة.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Available Shipments Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">

                        <h3 className="text-xl font-black text-slate-900 tracking-tight"> أحدث الشحنات المتاحة</h3>
                    </div>
                    <Button variant="ghost" size="sm" className="text-brand-primary font-black hover:bg-brand-primary/5 px-4 rounded-xl transition-all" onClick={() => navigate('/driver/available')}>
                        عرض الكل
                        <ChevronLeft className="h-4 w-4 mr-1" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {availableShipments.length > 0 ? (
                        availableShipments.filter(s => String(s.id) !== String(activeTrip?.id)).map((s, i) => {
                            // Check if I have a bid in the API data or local store
                            const apiBid = s.bids && s.bids.length > 0 ? s.bids[0] : null;
                            const localOffer = (offers || []).find(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'));

                            const hasBid = apiBid || localOffer;
                            const displayPrice = apiBid ? (apiBid.negotiatedAmount || apiBid.amount) : localOffer?.price;
                            const displayTime = apiBid ? apiBid.estimatedTime : (localOffer?.expectedTime || localOffer?.estimatedTime);

                            return (
                                <div
                                    key={s.id}
                                    onClick={() => navigate(`/driver/available/${s.id}`)}
                                    className={cn(
                                        "group relative bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-300 cursor-pointer overflow-hidden flex items-center gap-5",
                                        hasBid
                                            ? "border-[#009966] bg-[#009966]/5 shadow-lg shadow-[#009966]/5"
                                            : "border-slate-100 dark:border-slate-800 hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5"
                                    )}
                                >
                                    {/* Left Accent Bar */}
                                    <div className={cn(
                                        "absolute right-0 top-0 bottom-0 w-1.5",
                                        hasBid ? "bg-[#009966]" : "bg-brand-primary opacity-20 group-hover:opacity-100 transition-opacity"
                                    )}></div>

                                    {/* Goods Icon */}
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                        hasBid
                                            ? "bg-[#009966] text-white"
                                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"
                                    )}>
                                        <Package className="h-6 w-6" />
                                    </div>

                                    {/* Main Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={cn(
                                                "font-black text-sm truncate",
                                                hasBid ? "text-[#009966]" : "text-slate-900 dark:text-white"
                                            )}>
                                                {getGoodsTypeLabel(s.goodsType)}
                                            </h4>
                                            {hasBid && (
                                                <span className="text-[8px] font-black bg-[#009966] text-white px-2 py-0.5 rounded-full uppercase">تم المزايدة</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin className={cn("h-3 w-3", hasBid ? "text-[#009966]/60" : "text-emerald-500")} />
                                                <span>من {s.pickupCity}</span>
                                            </div>
                                            <ArrowRightLeft className="h-3 w-3 opacity-30" />
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-red-500" />
                                                <span>إلى {s.destinationCity}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Action/Price */}
                                    <div className="text-left shrink-0">
                                        <p className="text-[10px] font-black text-slate-400 mb-0.5 uppercase tracking-tighter">
                                            {hasBid ? (apiBid?.negotiatedAmount ? 'عرض السعر الجديد' : 'عرضك / الوقت') : 'الوزن'}
                                        </p>
                                        <p className={cn(
                                            "text-xs font-black",
                                            hasBid ? "text-[#009966]" : "text-brand-primary"
                                        )}>
                                            {hasBid ? (
                                                <>
                                                    {apiBid?.negotiatedAmount ? (
                                                        <span className="flex flex-col items-end">
                                                            <span className="text-[10px] line-through opacity-40 -mb-1">{apiBid.amount}</span>
                                                            <span>{apiBid.negotiatedAmount} ج.م</span>
                                                        </span>
                                                    ) : (
                                                        <>{displayPrice} ج.م</>
                                                    )}
                                                    <span className="mx-1 text-[8px] opacity-20">/</span>
                                                    <span className="opacity-70 text-[9px]">{formatEstimatedTime(displayTime)}</span>
                                                </>
                                            ) : `${s.weight} كجم`}
                                        </p>
                                    </div>

                                    {/* Hover Arrow */}
                                    <div className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center transition-all transform group-hover:translate-x-1",
                                        hasBid
                                            ? "bg-[#009966] text-white"
                                            : "bg-slate-50 dark:bg-slate-800 text-slate-300 group-hover:bg-brand-primary group-hover:text-white"
                                    )}>
                                        <ChevronLeft className="h-4 w-4" />
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <Card className="p-12 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Box className="h-10 w-10 text-slate-300" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا توجد شحنات متاحة حالياً</h4>
                            <p className="text-sm font-bold text-slate-400 mb-8 max-w-[280px] mx-auto">ترقب ظهور شحنات جديدة في منطقتك لتقديم عروض أسعارك.</p>
                            <Button variant="outline" className="rounded-xl font-black border-slate-200 dark:border-slate-700" onClick={fetchDashboardData}>
                                تحديث القائمة
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            {/* Active Trip Section */}
            <div>
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center justify-between">
                    <span>الرحلة النشطة</span>
                    {activeTrip && <span className="text-xs text-brand-primary font-bold animate-pulse">تحديث حي</span>}
                </h3>

                {activeTrip ? (
                    <Card className="border-r-4 border-r-brand-primary overflow-hidden">
                        <CardContent className="p-0">
                            {/* Trip Header Status */}
                            <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center font-cairo">
                                <div className="flex items-center gap-2.5">
                                    <span className={cn(
                                        "h-2 w-2 rounded-full animate-pulse",
                                        getStatusStyles(activeTrip.status).dot
                                    )} />
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-wider",
                                        getStatusStyles(activeTrip.status).text
                                    )}>
                                        {activeTrip.status}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-slate-400">{activeTrip.displayId}</span>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-inner">
                                            <Package className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-lg">{getGoodsTypeLabel(activeTrip.goodsType)}</h4>
                                            <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 flex-wrap">
                                                <span>{activeTrip.weight} كجم</span>
                                                <span className="opacity-20 text-[10px]">•</span>
                                                {activeTrip.bids?.[0]?.negotiatedAmount ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="line-through text-slate-300 text-[11px]">{activeTrip.bids[0].amount}</span>
                                                        <span className="text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-lg text-[11px]">سعر معدل: {activeTrip.bids[0].negotiatedAmount} ج.م</span>
                                                    </span>
                                                ) : (
                                                    <span>{activeTrip.bids?.[0]?.amount || activeTrip.price || '---'} EGP</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:bg-slate-50 underline text-[10px] font-bold" onClick={() => navigate(`/driver/available/${activeTrip.id}`)}>التفاصيل</Button>
                                </div>

                                {/* Main Points */}
                                <div className="relative pb-8 mb-8 border-b border-slate-50">
                                    <div className="absolute top-2 right-2 bottom-6 w-0.5 bg-slate-100 border-dashed border-r"></div>
                                    <div className="space-y-8 relative">
                                        <div className="flex items-start gap-5 mr-1">
                                            <div className="h-3 w-3 rounded-full bg-brand-primary ring-4 ring-brand-primary/10 z-10 mt-1"></div>
                                            <div className="flex-1 text-right">
                                                <h5 className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase text-right">نقطة التحميل (العميل)</h5>
                                                <p className="text-sm font-bold text-slate-800 mb-0.5">{activeTrip.pickupGovernorate}، {activeTrip.pickupCity}</p>
                                                <p className="text-[10px] text-slate-500 font-medium mb-4">{activeTrip.pickupAddress}</p>
                                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-slate-900">{activeTrip.customerName || 'اسم العميل غير متوفر'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{activeTrip.customerPhone || 'رقم هاتف العميل غير متوفر'}</p>
                                                    </div>
                                                    <a href={`tel:${activeTrip.customerPhone}`} className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                                        <Phone className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5 mr-1">
                                            <div className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100 z-10 mt-1"></div>
                                            <div className="flex-1 text-right">
                                                <h5 className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase text-right">نقطة التوصيل (المستلم)</h5>
                                                <p className="text-sm font-bold text-slate-800 mb-0.5">{activeTrip.destinationGovernorate}، {activeTrip.destinationCity}</p>
                                                <p className="text-[10px] text-slate-500 font-medium mb-3">{activeTrip.destinationAddress}</p>
                                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-slate-900">{activeTrip.recipientName || 'اسم المستلم غير متوفر'}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{activeTrip.recipientPhone || 'رقم هاتف المستلم غير متوفر'}</p>
                                                    </div>
                                                    <a href={`tel:${activeTrip.recipientPhone}`} className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                                                        <Phone className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <Button variant="outline" className="h-14 rounded-2xl gap-2 font-black border-slate-200">
                                        <MessageSquare className="h-5 w-5 text-blue-500" />
                                        محادثة
                                    </Button>
                                    {(activeTrip.status === 'delivery_in_progress' || activeTrip.status?.includes('في الطريق') || activeTrip.status?.includes('تم الاستلام') || activeTrip.status?.includes('جاري التوصيل')) ? (
                                        <Button
                                            onClick={() => handleCompleteDelivery(activeTrip.id)}
                                            className="h-14 rounded-2xl gap-2 font-black bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all animate-in zoom-in-95 duration-300"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                            إتمام الوصول
                                        </Button>
                                    ) : activeTrip.status === 'delivered' || activeTrip.status === 'تم التوصيل' ? (
                                        <div
                                            className="h-14 rounded-2xl gap-2 font-black bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center opacity-90 animate-in fade-in duration-500"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                            تم التوصيل
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleStartNavigation(activeTrip.id)}
                                            className="h-14 rounded-2xl gap-2 font-black bg-brand-primary shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all"
                                        >
                                            <Navigation className="h-5 w-5" />
                                            بدء الملاحة
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="p-12 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck className="h-10 w-10 text-slate-300" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2">لا توجد رحلة نشطة حالياً</h4>
                        <p className="text-sm font-bold text-slate-400 mb-6">ابدأ بتقديم عروض أسعار على الشحنات المتاحة للبدء في العمل.</p>
                        <Button onClick={() => navigate('/driver/available')} className="rounded-xl font-black bg-brand-primary px-8">عرض الشحنات المتاحة</Button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 rounded-[2rem] flex-col gap-2 border-slate-100 bg-white hover:bg-slate-50 shadow-sm" onClick={() => navigate('/driver/available')}>
                    <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold m-0 p-0">شحنات متاحة</span>
                </Button>
                <Button variant="outline" className="h-24 rounded-[2rem] flex-col gap-2 border-slate-100 bg-white hover:bg-slate-50 shadow-sm" onClick={() => navigate('/driver/active')}>
                    <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Truck className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold m-0 p-0">سجل الرحلات</span>
                </Button>
            </div>
        </div>
    )
}
