import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    MapPin,
    Clock,
    ChevronLeft,
    CheckCircle2,
    Weight,
    Maximize,
    Box,
    Search,
    Filter,
    X,
    ArrowRight,
    RotateCcw,
    TrendingUp
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Loading } from '@/components/ui/Loading'
import { shipmentService } from '@/services/shipmentService'
import { locationService } from '@/services/locationService'
import { useAuthStore } from '@/store/useAuthStore'
import { useOfferStore } from '@/store/useOfferStore'
import { getGoodsTypeLabel } from '@/utils/shipmentUtils'
import { formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

export const AvailableShipments = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { offers, addOffer } = useOfferStore()
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [fromQuery, setFromQuery] = useState('')
    const [toQuery, setToQuery] = useState('')

    useEffect(() => {
        const fetchDate = async () => {
            setLoading(true)
            try {
                const response = await shipmentService.searchAvailableShipments({ skip: 0, take: 50 })
                const data = response.data?.shipments || (Array.isArray(response.data) ? response.data : [])
                setShipments(data)
            } catch (error) {
                console.error('Failed to fetch data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDate()
    }, [])

    const filteredShipments = shipments.filter(s => {
        const fromQ = fromQuery.toLowerCase().trim()
        const toQ = toQuery.toLowerCase().trim()

        const matchFrom = !fromQ || [
            s.pickupGovernorate, s.pickupCity, s.pickupAddress
        ].some(field => field?.toString().toLowerCase().includes(fromQ))

        const matchTo = !toQ || [
            s.destinationGovernorate, s.destinationCity, s.destinationAddress
        ].some(field => field?.toString().toLowerCase().includes(toQ))

        return matchFrom && matchTo
    })

    const getMyBid = (s) => {
        // Check API response bids first
        if (s.bids && s.bids.length > 0) {
            return s.bids[0];
        }
        // Check local store
        return (offers || []).find(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'))
    }

    const hasBid = (s) => {
        return !!getMyBid(s);
    }

    const getOfferPrice = (s) => {
        const bid = getMyBid(s);
        return bid ? (bid.amount || bid.price) : null;
    }

    const getNegotiatedPrice = (s) => {
        const bid = getMyBid(s);
        return bid ? (bid.negotiatedAmount || bid.negotiated_amount) : null;
    }

    if (loading) {
        return <Loading text="جاري تحميل الشحنات المتاحة..." />
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col gap-1 items-start mb-6">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">شحنات متاحة للمزايدة</h1>
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ">
                    {filteredShipments.length} شحنة تطابق البحث
                </div>
            </div>

            {/* Comprehensive Filters */}
            <Card className="shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
                <CardContent className="p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <div className="h-8 w-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                            <Filter className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-black text-slate-700">ابحث عن رحلتك القادمة (حسب المسار)</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-5">
                        <div className="w-full space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                من (المحافظة، المدينة، العنوان)
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="اكتب اسم مكان التحميل..."
                                    value={fromQuery}
                                    onChange={(e) => setFromQuery(e.target.value)}
                                    className="w-full h-13 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl pr-12 pl-6 text-sm font-bold outline-none transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                    <MapPin className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center justify-center h-13 mb-0.5">
                            <ArrowRight className="h-5 w-5 text-slate-200" />
                        </div>

                        <div className="w-full space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                                إلى (المحافظة، المدينة، العنوان)
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="اكتب اسم مكان التسليم..."
                                    value={toQuery}
                                    onChange={(e) => setToQuery(e.target.value)}
                                    className="w-full h-13 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand-primary/20 focus:bg-white rounded-2xl pr-12 pl-6 text-sm font-bold outline-none transition-all"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-brand-primary transition-colors">
                                    <MapPin className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {(fromQuery || toQuery) && (
                            <button
                                onClick={() => { setFromQuery(''); setToQuery(''); }}
                                className="h-13 px-4 text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 group/reset"
                            >
                                <RotateCcw className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform duration-500" />
                                مسح الفلتر
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {filteredShipments.length > 0 ? (
                    filteredShipments.map((s) => {
                        const submitted = hasBid(s)
                        const bidPrice = getOfferPrice(s)
                        const negotiatedPrice = getNegotiatedPrice(s)
                        const hasNegotiation = negotiatedPrice > 0

                        return (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "group relative bg-white dark:bg-slate-900 rounded-[2rem] border-2 transition-all duration-300 overflow-hidden",
                                    submitted 
                                        ? "border-emerald-100 dark:border-emerald-900/30 shadow-lg shadow-emerald-900/5" 
                                        : "border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 hover:border-[#eb6a1d]/20 hover:shadow-orange-900/5"
                                )}
                            >
                                <div className="p-5 md:p-6 lg:p-7">
                                    {/* Header Row: Type, ID & Date */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner",
                                                hasNegotiation ? "bg-amber-500 text-white animate-pulse" : (submitted ? "bg-emerald-500 text-white" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-[#eb6a1d] group-hover:text-white")
                                            )}>
                                                {hasNegotiation ? <TrendingUp className="h-6 w-6" /> : <Package className="h-6 w-6" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">
                                                        {getGoodsTypeLabel(s.goodsType)}
                                                    </h4>
                                                    {hasNegotiation && (
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-[10px] font-black text-amber-600 dark:text-amber-400 rounded-full border border-amber-200/50 animate-bounce">
                                                            لديك تفاوض من العميل!
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-md text-[10px] font-black text-blue-600 dark:text-blue-400 border border-blue-100/50">
                                                        <Weight className="h-3 w-3" />
                                                        <span>{s.weight || '0'} كجم</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                        <Clock className="h-3 w-3" />
                                                        {s.createdAt ? formatDistanceToNow(new Date(s.createdAt), { locale: ar, addSuffix: true }) : 'الآن'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    {/* Middle Section: Route (Visual Timeline Pattern) */}
                                    <div className="relative mb-6">
                                        <div className="absolute right-[11px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-slate-800 md:hidden"></div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 relative">
                                            {/* Pickup */}
                                            <div className="flex items-start gap-4">
                                                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-900">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">مكان التحميل</p>
                                                    <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">{s.pickupGovernorate}</h5>
                                                    <p className="text-[10px] font-bold text-slate-500 truncate">{s.pickupCity || '---'}</p>
                                                </div>
                                            </div>

                                            {/* Destination */}
                                            <div className="flex items-start gap-4">
                                                <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 z-10 border-2 border-white dark:border-slate-900">
                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">مكان التسليم</p>
                                                    <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">{s.destinationGovernorate}</h5>
                                                    <p className="text-[10px] font-bold text-slate-500 truncate">{s.destinationCity || '---'}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Connector (Desktop) */}
                                            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-8 bg-slate-100 dark:bg-slate-800"></div>
                                        </div>
                                    </div>

                                    {/* Action Footer (Inlined) */}
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-5 border-t border-slate-50 dark:border-slate-800 gap-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-orange-50 dark:bg-[#eb6a1d]/10 flex items-center justify-center text-[#eb6a1d]">
                                                <Box className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
                                                    {hasNegotiation ? 'السعر المعروض من العميل' : 'سعر المزاد الحالي'}
                                                </span>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className={cn(
                                                        "text-2xl font-black",
                                                        hasNegotiation ? "text-amber-600" : "text-slate-900 dark:text-white"
                                                    )}>
                                                        {hasNegotiation ? `${negotiatedPrice}` : (submitted ? `${bidPrice}` : (s.price > 0 ? `${s.price}` : 'مزايدة'))}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400">ج.م</span>
                                                    {hasNegotiation && (
                                                        <span className="text-[10px] font-bold text-slate-300 line-through mr-2">
                                                            {bidPrice} ج.م
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
                                            <button
                                                onClick={() => navigate(`/driver/available/${s.id}`)}
                                                className="h-13 px-6 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center gap-2 text-xs font-black border-2 border-slate-100 dark:border-slate-700 transition-all hover:bg-slate-50 hover:border-slate-200 active:scale-95 group/details"
                                            >
                                               التفاصيل
                                            </button>
                                            
                                            {hasNegotiation ? (
                                                <button
                                                    onClick={() => navigate(`/driver/available/${s.id}`)}
                                                    className="h-13 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black shadow-xl shadow-amber-500/30 transition-all hover:-translate-y-0.5 active:scale-95 group/negotiate"
                                                >
                                                    <TrendingUp className="h-4 w-4 animate-bounce" />
                                                    بدأ التفاوض
                                                </button>
                                            ) : submitted ? (
                                                <div className="h-13 px-6 rounded-2xl flex items-center justify-center gap-2 bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20 border border-emerald-400/20">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    تم تقديم عرضك 
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/driver/available/${s.id}`)}
                                                    className="h-13 px-8 bg-gradient-to-r from-[#eb6a1d] to-[#ff8c41] hover:to-[#eb6a1d] text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black shadow-xl shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:scale-95 group/bid"
                                                >
                                                    تقديم عرض
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="h-24 w-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <Package className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا توجد شحنات متاحة تطابق بحثك</h3>
                        <p className="text-slate-400 font-bold max-w-xs text-center leading-relaxed">انتظر قليلاً حتى تظهر شحنات جديدة تتناسب مع مسارك، أو وسع نطاق البحث للحصول على نتائج أكثر.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

