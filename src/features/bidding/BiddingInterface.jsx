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
import { Loading } from '@/components/ui/Loading'

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
        return <Loading text="جاري تحميل بيانات العروض والشحنة..." />
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
        <div className="space-y-8  max-w-4xl mx-auto px-4 md:px-0 overflow-x-hidden">

            {/* Header with Integrated Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight shrink-0">إدارة العروض</h1>

                        </div>
                        <p className="text-slate-400 font-bold text-[10px] md:text-xs mt-1">قارن عروض الكباتن المتاحة لشحنتك</p>
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

            {/* Offers List - Completely Rebuilt for Responsiveness */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <div className="h-6 w-1.5 bg-brand-primary rounded-full"></div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        العروض المقدمة <span className="text-slate-400 font-bold ml-1">({filteredOffers.length})</span>
                    </h3>
                </div>

                {filteredOffers.length > 0 ? (
                    <div className="grid gap-6">
                        {filteredOffers.map(offer => {
                            const isAccepted = offer.status === 'accepted';
                            const isAnyOfferAccepted = filteredOffers.some(o => o.status === 'accepted');

                            return (
                                <div key={offer.id} className={cn(
                                    "bg-white dark:bg-slate-900 border-2 rounded-[2.5rem] p-6 lg:p-8 transition-all duration-300",
                                    isAccepted ? "border-emerald-500 bg-emerald-50/10 shadow-xl shadow-emerald-500/5" : "border-slate-100 dark:border-slate-800 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-slate-200/40"
                                )}>

                                    {/* 1. Header: Driver Info & Price/Time */}
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-50 dark:border-slate-800/50">

                                        {/* Driver Identity */}
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                                {offer.driver?.driverDetails?.profile_picture ? (
                                                    <img src={offer.driver.driverDetails.profile_picture} className="h-full w-full object-cover" alt="" />
                                                ) : (
                                                    <Truck className="h-7 w-7 text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white">{offer.driver?.full_name || "كابتن شحن"}</h4>
                                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-lg text-amber-600 text-[10px] font-black border border-amber-100">
                                                        <Star className="h-3 w-3 fill-amber-500" />
                                                        4.8
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
                                                    <span className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-md">
                                                        {getVehicleTypeLabel(offer.driver?.vehicleDetails?.[0]?.vehicle_type || offer.driver?.vehicleType || offer.vehicleType)}
                                                    </span>
                                                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md tracking-wider">
                                                        {offer.driver?.vehicleDetails?.[0]?.vehicle_plate_number || '---'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price & Time Summary */}
                                        <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-brand-primary shrink-0">
                                                    <Clock className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">يصل في</p>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">{formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 shrink-0">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                                        {offer.negotiatedAmount ? "عرض مضاد" : "قيمة العرض"}
                                                    </p>
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                                            {parseFloat(offer.negotiatedAmount || offer.amount || 0).toLocaleString()}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400">ج.م</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Captain Confirmation Alert (If negotiation accepted) */}
                                    {!isAnyOfferAccepted && offer.negotiatedAmount && (parseFloat(offer.amount) === parseFloat(offer.negotiatedAmount)) && (
                                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border-2 border-emerald-100 dark:border-emerald-800/50 rounded-2xl flex items-center gap-4 animate-in zoom-in duration-300">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-emerald-700 dark:text-emerald-400">وافق الكابتن على عرضك السعري!</p>
                                                <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/60 mt-0.5 tracking-tight">اضغط على "قبول العرض" لتأكيد شحن الطلب مع هذا الكابتن</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. Message Body */}
                                    <div className="bg-slate-50/50 dark:bg-slate-800/40 p-5 rounded-2xl mb-8 relative">
                                        <div className="absolute -top-3 right-5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">ملاحظات الكابتن</div>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {offer.notes || 'أؤكد استعدادي التام لتوصيل الشحنة بأمان وفي الموعد المحدد وبأفضل جودة.'}
                                        </p>
                                    </div>

                                    {/* 3. Action Area */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        {isAccepted ? (
                                            <div className="w-full bg-emerald-500 text-white h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-sm shadow-xl shadow-emerald-500/20">
                                                <CheckCircle2 className="h-5 w-5" />
                                                تم قبول هذا الكابتن
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                                    {!isAnyOfferAccepted && (
                                                        <Button
                                                            variant="ghost"
                                                            className="h-12 flex-1 sm:flex-none sm:px-8 border-2 border-red-50 text-red-600 font-black text-xs rounded-2xl hover:bg-red-50 transition-all"
                                                            onClick={() => handleRejectOffer(offer.id || offer._id)}
                                                        >
                                                            رفض
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        className="h-12 flex-1 sm:flex-none sm:px-8 border-2 border-slate-50 text-slate-500 font-black text-xs rounded-2xl hover:bg-slate-50 transition-all"
                                                        onClick={() => handleNegotiateClick(offer.id || offer._id)}
                                                        disabled={isAnyOfferAccepted}
                                                    >
                                                        {negotiatingOfferId === (offer.id || offer._id) ? 'إلغاء' : 'تفاوض'}
                                                    </Button>
                                                </div>

                                                {!isAnyOfferAccepted && (
                                                    <Button
                                                        className="w-full sm:w-auto h-12 px-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-xl shadow-emerald-600/20 transition-all"
                                                        onClick={() => handleAcceptOffer(offer.id || offer._id)}
                                                    >
                                                        قبول العرض
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Negotiation Input Box */}
                                    {negotiatingOfferId === (offer.id || offer._id) && (
                                        <div className="mt-6 flex flex-col md:flex-row items-center gap-3 bg-brand-primary/5 p-4 rounded-2xl border-2 border-brand-primary/10 transition-all scale-in-center">
                                            <div className="relative flex-1 w-full">
                                                <input
                                                    type="number"
                                                    placeholder="أدخل السعر المقترح للتفاوض مع الكابتن..."
                                                    className="w-full h-12 bg-white dark:bg-slate-900 border-2 border-slate-100 rounded-xl px-4 font-bold text-sm outline-none focus:border-brand-primary/30 transition-all"
                                                    value={negotiationPrice}
                                                    onChange={(e) => setNegotiationPrice(e.target.value)}
                                                />
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">ج.م</div>
                                            </div>
                                            <Button
                                                className="w-full md:w-auto h-12 px-10 bg-brand-primary text-white font-black text-xs rounded-xl shadow-lg shadow-brand-primary/20"
                                                onClick={() => submitNegotiation(offer.id || offer._id)}
                                                disabled={submittingNegotiation}
                                            >
                                                {submittingNegotiation ? <Loading minimal={true} className="text-white" /> : "إرسال المقترح"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center p-20 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm">
                        <Users className="h-16 w-16 text-slate-100 mx-auto mb-6" />
                        <h4 className="font-black text-xl text-slate-900 dark:text-white mb-2">لا يوجد عروض حتى الآن</h4>
                        <p className="text-slate-400 font-bold text-sm">سيظهر هنا فور قيام الكباتن بتقديم عروض سعر لشحنتك.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

