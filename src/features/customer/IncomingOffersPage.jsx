import { useState, useEffect } from 'react'
import {
    Clock,
    Truck,
    MapPin,
    ArrowLeftRight,
    Loader2,
    User,
    TrendingUp,
    ChevronLeft,
    Star,
    ShieldCheck,
    Calendar,
    Wallet
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, formatEstimatedTime } from '@/utils/shipmentUtils'
import { cn } from '@/lib/utils'

export const IncomingOffersPage = () => {
    const [offers, setOffers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const fetchOffers = async () => {
        setIsLoading(true)
        try {
            const data = await shipmentService.getNewBids()
            setOffers(Array.isArray(data) ? data : (data.data || []))
        } catch (err) {
            setError('فشل في تحميل العروض الجديدة')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchOffers()
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/30 dark:bg-slate-950/30 rounded-[4rem]">
                <div className="relative">
                    <div className="h-16 w-16 border-4 border-brand-primary/10 border-t-brand-primary rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-brand-primary/30" />
                    </div>
                </div>
                <p className="text-slate-400 font-bold mt-6 animate-pulse">جاري تنسيق أقوى العروض...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-1000 font-cairo py-6" dir="rtl">
            {/* Minimalist Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-brand-primary rounded-full"></div>
                        <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-[10px]">Offers Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">العروض الواردة</h1>
                    <p className="text-slate-500 font-bold text-lg max-w-md leading-relaxed opacity-80">اكتشف وفاوض على أفضل الأسعار المقدمة من شبكة سائقينا المحترفين.</p>
                </div>
                <Button
                    onClick={fetchOffers}
                    variant="outline"
                    className="h-14 px-8 rounded-2xl font-black text-slate-600 border-slate-200 bg-white/80 backdrop-blur-md shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all"
                >
                    <Clock className="ml-3 h-5 w-5 opacity-40" />
                    تحديث القائمة
                </Button>
            </div>

            {/* Premium List */}
            <div className="space-y-8 px-6 pb-20">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id} className="group relative">
                            {/* Glow Effect on Hover */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-emerald-400 rounded-[3rem] opacity-0 group-hover:opacity-10 blur-xl transition duration-700"></div>
                            
                            <Card className="relative overflow-hidden border-none shadow-xl shadow-slate-200/40 dark:shadow-none transition-all duration-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[3rem] hover:translate-y-[-6px]">
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row items-stretch">
                                        
                                        {/* Driver & Status Column */}
                                        <div className="lg:w-[320px] p-8 bg-slate-50/50 dark:bg-slate-800/30 border-l border-slate-100/50 dark:border-slate-800/50 flex flex-col justify-between">
                                            <div className="flex items-center gap-5">
                                                <div className="relative shrink-0">
                                                    <div className="h-20 w-20 rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl transition-transform duration-700 group-hover:scale-110">
                                                        {offer.driver?.profile_picture ? (
                                                            <img src={offer.driver.profile_picture} className="h-full w-full object-cover" alt="" />
                                                        ) : (
                                                            <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                                <User className="h-10 w-10" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-brand-primary flex items-center justify-center text-white rounded-xl shadow-lg border-2 border-white dark:border-slate-800">
                                                        <ShieldCheck className="h-4 w-4" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-xl text-slate-900 dark:text-white leading-tight">
                                                        {offer.driver?.full_name || "سائق محترف"}
                                                    </h3>
                                                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="text-[10px] font-black mr-1 text-slate-400">5.0</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100/50">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المركبة</span>
                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Truck className="h-3.5 w-3.5 opacity-40" />
                                                        {offer.driverDetails?.vehicle_type || "سيارة نصف نقل"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-100/50">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ التقديم</span>
                                                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                        <Calendar className="h-3.5 w-3.5 opacity-40" />
                                                        اليوم
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Details Area */}
                                        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                                <div className="space-y-6 flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/10">
                                                            {getGoodsTypeLabel(offer.shipment?.goodsType) || 'شحنة'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-300 tracking-widest">ID: {offer.shipment?.id?.toString().slice(-6)}</span>
                                                    </div>
                                                    
                                                    {/* Journey visualization */}
                                                    <div className="relative flex items-center gap-8 md:gap-12 w-full max-w-lg">
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                                                                <MapPin className="h-6 w-6" />
                                                            </div>
                                                            <span className="text-xs font-black text-slate-900 mt-3">{offer.shipment?.pickupGovernorate}</span>
                                                        </div>
                                                        <div className="flex-1 relative h-px bg-slate-100 dark:bg-slate-800 self-center -mt-6">
                                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-200">
                                                                <ArrowLeftRight className="h-4 w-4" />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-red-500 shadow-sm border border-slate-100">
                                                                <MapPin className="h-6 w-6" />
                                                            </div>
                                                            <span className="text-xs font-black text-slate-900 mt-3">{offer.shipment?.destinationGovernorate}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">قيمة العرض المالي</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                                            {(offer.amount || offer.price || 0).toLocaleString()}
                                                        </span>
                                                        <span className="text-sm font-black text-slate-400 uppercase">ج.م</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                        <Clock className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">وقت التوصيل</p>
                                                        <p className="text-sm font-black text-slate-700">{formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 w-full sm:w-auto">
                                                    <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1">
                                                        <Button variant="ghost" className="w-full sm:w-[150px] h-14 rounded-2xl font-black text-slate-500 border-2 border-slate-100 hover:bg-slate-50 hover:text-slate-900">
                                                            <TrendingUp className="h-5 w-5 ml-2 opacity-30" />
                                                            تفاوض
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1">
                                                        <Button className="w-full sm:w-[180px] h-14 bg-gradient-to-r from-brand-primary to-emerald-600 text-white rounded-2xl font-black shadow-2xl shadow-brand-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                                            قبول العرض
                                                            <ChevronLeft className="h-5 w-5" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-32 bg-white/50 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                        <div className="relative h-24 w-24 mx-auto mb-10">
                            <div className="absolute inset-0 bg-brand-primary/20 rounded-full animate-ping opacity-20"></div>
                            <div className="relative h-24 w-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl">
                                <Wallet className="h-10 w-10 text-slate-200" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">لا توجد عروض حالية</h2>
                        <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed opacity-60">سيتم عرض قائمة العروض هنا فور قيام السائقين بتقديمها. ترقب إشعارات هاتفك!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
