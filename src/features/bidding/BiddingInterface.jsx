import { useState, useEffect } from 'react'
import {
    Star,
    Truck,
    MapPin,
    Clock,
    CheckCircle2,
    ArrowLeftRight,
    Users,
    MessageSquare,
    Package,
    Loader2,
    Weight,
    FileText,
    XCircle,
    Send,
    ChevronRight,
    Search
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, getVehicleTypeLabel, getStatusStyles, formatEstimatedTime } from '@/utils/shipmentUtils'
import { toast } from 'react-hot-toast'
import { cn } from '@/utils/cn'

export const BiddingInterface = () => {
    const { id: shipmentId } = useParams()

    const [shipment, setShipment] = useState(null)
    const [allShipments, setAllShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [submittingNegotiation, setSubmittingNegotiation] = useState(false)

    // Negotiation & Search state
    const [negotiatingOfferId, setNegotiatingOfferId] = useState(null)
    const [negotiationPrice, setNegotiationPrice] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const fetchShipmentData = async (showLoading = true) => {
        if (showLoading) setLoading(true)
        try {
            if (shipmentId) {
                const data = await shipmentService.getShipmentById(shipmentId)
                setShipment(data)
            } else {
                const res = await shipmentService.searchShipments({ skip: 0, take: 50 })
                const list = res.data?.shipments || (Array.isArray(res.data) ? res.data : [])
                setAllShipments(list)

                const firstActive = list.find(s => s.bids && s.bids.length > 0) || list[0]
                if (firstActive) {
                    const fullId = firstActive.id || firstActive._id;
                    const fullData = await shipmentService.getShipmentById(fullId);
                    setShipment(fullData);
                } else {
                    setShipment(null)
                }
            }
        } catch (error) {
            console.error('Failed to fetch shipment for bids:', error)
        } finally {
            console.log('[BiddingInterface] fetchShipmentData completed');
            if (showLoading) setLoading(false)
        }
    }

    useEffect(() => {
        fetchShipmentData()

    }, [shipmentId])


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل بيانات العروض والشحنة...</p>
            </div>
        )
    }

    if (!shipment) {
        return (
            <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <p className="text-slate-500 font-bold">لم يتم العثور على شحنات تحتوي على عروض حالياً.</p>
                <Link to="/customer/create">
                    <Button className="mt-4 bg-brand-primary text-white">إنشاء شحنة جديدة</Button>
                </Link>
            </div>
        )
    }

    const filteredOffers = shipment.bids || []

    const handleNegotiateClick = (offerId) => {
        if (negotiatingOfferId === offerId) {
            setNegotiatingOfferId(null)
            setNegotiationPrice('')
        } else {
            setNegotiatingOfferId(offerId)
            setNegotiationPrice('')
        }
    }

    const submitNegotiation = async (offerId) => {
        if (!negotiationPrice || isNaN(negotiationPrice) || Number(negotiationPrice) <= 0) {
            toast.error('يرجى إدخال سعر صحيح للتفاوض')
            return;
        }

        setSubmittingNegotiation(true)
        try {
            await shipmentService.negotiateBid(offerId, negotiationPrice);
            // Relying on Backend Sockets for negotiation notification
            setNegotiatingOfferId(null)
            setNegotiationPrice('')
            await fetchShipmentData(false)
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSubmittingNegotiation(false)
        }
    }

    const handleRejectOffer = async (offerId) => {
        try {
            await shipmentService.updateBidStatus(offerId, 'rejected');
            // Relying on Backend Sockets for rejection notification
            await fetchShipmentData(false)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleAcceptOffer = async (offerId) => {
        try {
            await shipmentService.updateBidStatus(offerId, 'accepted');
            // Relying on Backend Sockets for acceptance notification
            await fetchShipmentData(false)
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery) {
            const found = allShipments.find(s =>
                (s.trackingNumber || s.displayId || '').toLowerCase().includes(searchQuery.toLowerCase())
            )
            if (found) {
                try {
                    const fullId = found.id || found._id;
                    const fullData = await shipmentService.getShipmentById(fullId)
                    setShipment(fullData)
                    toast.success(`عرض عروض الشحنة ${fullData.displayId}`)
                    setSearchQuery('')
                } catch (error) {
                    toast.error('فشل في تحميل تفاصيل الشحنة')
                }
            } else {
                toast.error('لم نجد شحنة بهذا الرقم')
            }
        }
    }

    return (
        <div className="space-y-8 pb-20 max-w-4xl mx-auto font-cairo">

            {/* Header with Integrated Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight shrink-0">إدارة العروض</h1>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 rounded-full">
                                <span className="text-[10px] md:text-xs font-black text-brand-primary tracking-wider">{shipment.displayId}</span>
                            </div>

                        </div>
                        <p className="text-slate-400 font-bold text-[10px] md:text-xs mt-1">قارن عروض السائقين المتاحة لشحنتك</p>
                    </div>
                </div>

                {/* Unified Minimalist Search & Button */}
                <div className="relative group w-full md:w-80">
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex-1">
                            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-primary transition-colors pointer-events-none" />
                            <input
                                type="text"
                                placeholder="بحث برقم الشحنة..."
                                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pr-10 pl-4 text-[11px] font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all outline-none text-slate-700 dark:text-slate-300 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            />
                        </div>
                        <Button
                            className="bg-brand-primary hover:bg-brand-primary/95 text-white h-11 px-6 rounded-xl font-black text-xs shadow-lg shadow-brand-primary/10 transition-all shrink-0"
                            onClick={() => handleSearch({ key: 'Enter' })}
                        >
                            بحث
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Shipment Summary Header */}
            <div className="relative overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] shadow-xl shadow-slate-200/20 dark:shadow-none p-1">
                <div className="bg-white dark:bg-slate-900 rounded-[1.8rem] p-6 md:p-8">
                    {/* Top Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <div className="group/stat">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 group-hover/stat:scale-110 transition-transform">
                                    <Package className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">نوع الشحنة</span>
                            </div>
                            <p className="text-sm md:text-base font-black text-slate-900 dark:text-white pr-1">
                                {getGoodsTypeLabel(shipment.goodsType)}
                            </p>
                        </div>

                        <div className="group/stat">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-500 group-hover/stat:scale-110 transition-transform">
                                    <Weight className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوزن</span>
                            </div>
                            <p className="text-sm md:text-base font-black text-slate-900 dark:text-white pr-1">
                                {shipment.weight} كجم
                            </p>
                        </div>

                        <div className="group/stat">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-500 group-hover/stat:scale-110 transition-transform">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">التاريخ</span>
                            </div>
                            <p className="text-sm md:text-base font-black text-slate-900 dark:text-white pr-1">
                                {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
                            </p>
                        </div>

                        <div className="group/stat">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-500 group-hover/stat:scale-110 transition-transform">
                                    <Users className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي العروض</span>
                            </div>
                            <p className="text-sm md:text-base font-black text-slate-900 dark:text-white pr-1">
                                {filteredOffers.length} عرض متاح
                            </p>
                        </div>

                        {shipment.description && (
                            <div className="group/stat lg:col-span-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-8 w-8 bg-slate-50 dark:bg-slate-900/20 rounded-xl flex items-center justify-center text-slate-500 group-hover/stat:scale-110 transition-transform">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الوصف</span>
                                </div>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-2 pr-1 leading-relaxed">
                                    {shipment.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Route Bar */}
                    <div className="relative pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm shrink-0">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-tighter leading-none mb-1">الانطلاق</span>
                                        <span className="text-sm md:text-base font-black text-slate-900 dark:text-white">{shipment.pickupCity}</span>
                                    </div>
                                    <div className="flex items-center justify-center -rotate-90 md:rotate-0">
                                        <ArrowLeftRight className="h-3 w-3 text-slate-300" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-red-500 dark:text-red-400 uppercase tracking-tighter leading-none mb-1">التسليم</span>
                                        <span className="text-sm md:text-base font-black text-slate-900 dark:text-white">{shipment.destinationCity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* High-end decorative pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* Offers List */}
            <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black flex items-center gap-2 text-slate-900 dark:text-white">
                        <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                        العروض المقدمة ({filteredOffers.length})
                    </h3>
                </div>

                {filteredOffers.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredOffers.map(offer => {
                            const isAccepted = offer.status === 'accepted';
                            const isAnyOfferAccepted = filteredOffers.some(o => o.status === 'accepted');

                            return (
                                <div key={offer.id} className={cn(
                                    "bg-white dark:bg-slate-900 border rounded-[1.5rem] p-5 md:p-6 shadow-sm transition-all duration-300 group",
                                    isAccepted ? "border-emerald-500 ring-1 ring-emerald-500 shadow-emerald-500/10" : "border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-brand-primary/20"
                                )}>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-5">

                                        {/* Driver Identity */}
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                                                {offer.driver?.driverDetails?.profile_picture ? (
                                                    <img
                                                        src={offer.driver.driverDetails.profile_picture}
                                                        alt={offer.driver.full_name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <Truck className="h-6 w-6 text-slate-400 group-hover:text-brand-primary transition-colors" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white">
                                                        {offer.driver?.full_name || offer.driverName || 'سائق شحن'}
                                                    </h4>
                                                    <span className="flex items-center text-amber-600 dark:text-amber-400 text-xs font-black bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md border border-amber-100/50 dark:border-amber-900/50 tracking-wider">
                                                        <Star className="h-3 w-3 fill-amber-500 mr-1 text-amber-500" />
                                                        4.8
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-1.5 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-black text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        <Truck className="h-2.5 w-2.5" />
                                                        <span>
                                                            {getVehicleTypeLabel(offer.driver?.vehicleDetails?.[0]?.vehicle_type || offer.driver?.vehicleType || offer.vehicleType)} {offer.driver?.vehicleDetails?.[0]?.vehicle_brand || offer.driver?.vehicleBrand || offer.vehicleBrand || ''}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-[9px] font-black text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 tracking-widest uppercase">
                                                        {offer.driver?.vehicleDetails?.[0]?.vehicle_plate_number || 'الرقم'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Time Blocks */}
                                        <div className="flex flex-row md:flex-row items-center gap-3 w-full md:w-auto">
                                            {/* Time Block */}
                                            <div className="flex-1 md:flex-none text-center bg-slate-50 dark:bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-all hover:border-brand-primary/30 min-w-[120px] relative">
                                                <span className="block text-[10px] text-slate-500 font-black mb-1 uppercase tracking-tighter leading-none">
                                                    ⏱️ وقت التوصيل
                                                </span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-black text-brand-primary">
                                                        {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Price Block */}
                                            <div className="flex-1 md:flex-none text-center bg-slate-50 dark:bg-slate-800/50 px-5 py-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 transition-all hover:border-emerald-500/30 min-w-[140px] relative">
                                                <span className="block text-[10px] text-slate-500 font-black mb-1 uppercase tracking-tighter leading-none">
                                                    {offer.negotiatedAmount ? "💰 عرض مضاد" : "💰 العرض"}
                                                </span>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                        {parseFloat(offer.negotiatedAmount || offer.negotiated_amount || offer.new_amount || offer.amount || offer.price || 0).toLocaleString('ar-EG')}
                                                        <span className="text-[11px] font-bold mr-1">ج.م</span>
                                                    </span>
                                                    {offer.negotiatedAmount && (
                                                        <span className="text-[10px] font-black text-slate-400 line-through opacity-70 mt-0.5">
                                                            {parseFloat(offer.amount).toLocaleString('ar-EG')} ج.م
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* driver accepted negotiation alert - show only before any offer is accepted */}
                                    {!isAnyOfferAccepted && (offer.negotiatedAmount && parseFloat(offer.amount) === parseFloat(offer.negotiatedAmount)) && (
                                        <div className="bg-emerald-50/80 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 mb-4 flex items-center gap-3 animate-pulse">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                            <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                                                وافق السائق علي العرض المقدم منك في انتظار تأكيد الشحنة                                            </p>
                                        </div>
                                    )}

                                    {/* Message */}
                                    <div className="bg-slate-50/80 dark:bg-slate-800/40 p-4 rounded-2xl border-r-2 border-brand-primary/40 mb-6">
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {offer.notes || 'أؤكد استعدادي التام لتوصيل الشحنة بأمان وفي الموعد المحدد.'}
                                        </p>
                                    </div>

                                    {/* Actions Container */}
                                    <div className="flex items-center justify-between gap-4 pt-5 border-t border-slate-50 dark:border-slate-800/50 mt-2">
                                        {isAccepted ? (
                                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">تم قبول هذا السائق</span>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Right Side Actions (RTL Start) */}
                                                <div className="flex items-center gap-2">
                                                    {!isAnyOfferAccepted && (
                                                        <Button
                                                            variant="ghost"
                                                            className="h-10 px-5 rounded-md text-[11px] font-black text-red-600 bg-red-50 hover:bg-red-100/80 transition-all border border-red-100/50"
                                                            onClick={() => handleRejectOffer(offer.id || offer._id)}
                                                        >
                                                            رفض
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        className="h-10 px-5 rounded-md text-[11px] font-black text-slate-500 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
                                                        onClick={() => handleNegotiateClick(offer.id || offer._id)}
                                                        disabled={isAnyOfferAccepted}
                                                    >
                                                        {negotiatingOfferId === (offer.id || offer._id) ? 'إلغاء' : 'تفاوض'}
                                                    </Button>
                                                </div>

                                                {/* Left Side Action (RTL End) */}
                                                {!isAnyOfferAccepted && (
                                                    <Button
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-md h-10 px-8 font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                                                        onClick={() => handleAcceptOffer(offer.id || offer._id)}
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        قبول العرض
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Negotiation Input Area */}
                                    {negotiatingOfferId === (offer.id || offer._id) && (
                                        <div className="flex items-center gap-3 mt-4 bg-brand-primary/5 p-3 rounded-2xl border border-brand-primary/10 transition-all animate-in slide-in-from-top-2">
                                            <input
                                                type="number"
                                                placeholder="أدخل السعر المقترح..."
                                                className="w-full h-11 px-4 rounded-xl border border-brand-primary/20 bg-white dark:bg-slate-900 text-sm font-bold outline-none ring-offset-background placeholder:text-slate-400 focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                                value={negotiationPrice}
                                                onChange={(e) => setNegotiationPrice(e.target.value)}
                                            />
                                            <Button
                                                className="bg-brand-primary hover:bg-brand-primary/95 text-white h-11 px-6 rounded-xl font-black gap-2 transition-all shadow-lg shadow-brand-primary/10"
                                                onClick={() => submitNegotiation(offer.id || offer._id)}
                                                disabled={submittingNegotiation}
                                            >
                                                {submittingNegotiation ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                                إرسال
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-16 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h4 className="font-black text-xl text-slate-900 dark:text-white mb-2">لا يوجد عروض حتى الآن</h4>
                    </div>
                )}
            </div>
        </div>
    )
}
