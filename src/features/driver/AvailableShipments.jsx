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
    Loader2,
    Search,
    Filter,
    X,
    ArrowRight,
    RotateCcw
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
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

    const hasBid = (s) => {
        // Check API response bids
        if (s.bids && s.bids.length > 0) return true;
        // Check local store offers (for newly submitted bids)
        return (offers || []).some(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'))
    }

    const getOfferPrice = (s) => {
        // Check API response bids first
        if (s.bids && s.bids.length > 0) {
            return s.bids[0].amount;
        }
        // Check local store
        const offer = (offers || []).find(o => String(o.shipmentId) === String(s.id) && String(o.driverId) === String(user?.id || 'doc-driver-id'))
        return offer ? offer.price : null
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل الشحنات المتاحة...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20 max-w-4xl mx-auto" dir="rtl">
            {/* Header */}
            <div className="flex flex-col gap-1 items-start mb-6">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">شحنات متاحة للمزايدة</h1>
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ">
                    {filteredShipments.length} شحنة تطابق البحث
                </div>
            </div>

            {/* Comprehensive Filters */}
            <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
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

                        return (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-4 md:p-5">
                                    {/* Header Row: Type, ID & Date */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">{getGoodsTypeLabel(s.goodsType)}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[9px] font-bold text-slate-400">{s.displayId}</span>
                                                    <span className="h-0.5 w-0.5 rounded-full bg-slate-200"></span>
                                                    <span className="text-[9px] font-bold text-slate-400">
                                                        {s.createdAt ? formatDistanceToNow(new Date(s.createdAt), { locale: ar, addSuffix: true }) : 'الآن'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="hidden sm:flex items-center gap-2 px-2 py-1 bg-blue-50/50 dark:bg-blue-900/20 rounded-md text-[9px] font-black text-blue-600 dark:text-blue-400">
                                                <Weight className="h-2.5 w-2.5" />
                                                <span>{s.weight || '--'} كجم</span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/driver/available/${s.id}`)}
                                                className="text-[10px] font-black text-slate-400 hover:text-brand-primary transition-colors"
                                            >
                                                التفاصيل
                                            </button>
                                        </div>
                                    </div>

                                    {/* Middle Section: Route & Description Inlined */}
                                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-50 dark:border-slate-800/50 mb-4">
                                        {/* Route Part */}
                                        <div className="flex-1 flex items-center gap-3 min-w-0">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-white truncate">{s.pickupGovernorate}</span>
                                                </div>
                                                <p className="text-[8.5px] font-bold text-slate-400 truncate pr-2.5">{s.pickupCity || '---'}</p>
                                            </div>

                                            <ArrowRight className="h-3 w-3 text-slate-300 shrink-0" />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 mb-0.5">
                                                    <span className="text-[10px] font-black text-slate-900 dark:text-white truncate">{s.destinationGovernorate}</span>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                                                </div>
                                                <p className="text-[8.5px] font-bold text-slate-400 truncate pr-2.5">{s.destinationCity || '---'}</p>
                                            </div>
                                        </div>

                                        {/* Divider (Desktop Only) */}
                                        <div className="hidden md:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                                        {/* Description Part */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 line-clamp-2 italic leading-relaxed">
                                                {s.description || s.note ? `"${s.description || s.note}"` : "لا يوجد وصف إضافي"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Footer (Inlined) */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black text-slate-400 tracking-wider">السعر التقديري</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-black text-brand-secondary dark:text-emerald-500">
                                                    {submitted ? `${bidPrice}` : (s.price > 0 ? `${s.price}` : 'قيد التفاوض')}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400">جنيه</span>
                                            </div>
                                        </div>

                                        {submitted ? (
                                            <div className="h-10 px-6 rounded-xl flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-black text-[10px]">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                                تم التقديم
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => navigate(`/driver/available/${s.id}`)}
                                                className="h-10 px-8 bg-brand-primary hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-black shadow-lg shadow-orange-500/10 transition-all hover:-translate-y-0.5 active:scale-95 group/btn"
                                            >
                                                دخول المزاد
                                                <ChevronLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
                                            </button>
                                        )}
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
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لا توجد شحنات متاحة</h3>
                        <p className="text-slate-400 font-bold max-w-xs text-center">انتظر قليلاً حتى تظهر شحنات جديدة تتناسب مع مسارك.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
