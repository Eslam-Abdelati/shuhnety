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
    CheckCircle2
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
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-brand-primary animate-spin mb-4" />
                <p className="text-slate-500 font-bold">جاري تحميل قائمة العروض...</p>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 font-cairo px-4" dir="rtl">
            {/* Simple Clean Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">العروض الواردة</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1">إليك أحدث الأسعار المقترحة لشحناتك النشطة</p>
                </div>
                <Button
                    onClick={fetchOffers}
                    variant="ghost"
                    className="h-11 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                >
                    <Clock className="ml-2 h-4 w-4 opacity-50" />
                    تحديث
                </Button>
            </div>

            {/* Simple Comfortable Cards */}
            <div className="space-y-4">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <Card key={offer.id} className="overflow-hidden border border-slate-100 shadow-sm hover:border-brand-primary/20 transition-all duration-300 bg-white rounded-3xl">
                            <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row items-center gap-6">
                                    
                                    {/* Part 1: Driver Profile */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary border border-slate-100 shrink-0">
                                            {offer.driver?.profile_picture ? (
                                                <img src={offer.driver.profile_picture} className="h-full w-full object-cover rounded-2xl" alt="" />
                                            ) : (
                                                <User className="h-7 w-7 opacity-30" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <h3 className="font-black text-slate-800">{offer.driver?.full_name || "سائق"}</h3>
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Truck className="h-3 w-3" />
                                                    {offer.driverDetails?.vehicle_type || "نقل عام"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part 2: Shipment Path & Details */}
                                    <div className="flex-1 w-full lg:px-6 lg:border-r lg:border-slate-50">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-lg border border-brand-primary/10 uppercase">
                                                {getGoodsTypeLabel(offer.shipment?.goodsType) || 'شحنة عامة'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300">#{offer.shipment?.id?.toString().slice(-6)}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-sm font-black text-slate-600">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                                <span>{offer.shipment?.pickupGovernorate}</span>
                                            </div>
                                            <ArrowLeftRight className="h-3 w-3 text-slate-200" />
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                <span>{offer.shipment?.destinationGovernorate}</span>
                                                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                                <Clock className="h-3 w-3" />
                                                <span>يصل في {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Part 3: Price & Actions */}
                                    <div className="flex flex-col md:flex-row items-center gap-6 lg:min-w-[280px] justify-between lg:pl-2">
                                        <div className="text-center md:text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">عرض السعر</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-slate-800 tracking-tighter">
                                                    {(offer.amount || offer.price || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">ج.م</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1 md:flex-none">
                                                <Button variant="ghost" className="h-11 px-6 rounded-2xl font-black text-slate-500 border border-slate-100 bg-slate-50/30 hover:bg-slate-100 transition-all flex items-center gap-2 text-xs">
                                                    <TrendingUp className="h-4 w-4 opacity-40" />
                                                    تفاوض
                                                </Button>
                                            </Link>
                                            <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1 md:flex-none">
                                                <Button className="h-11 px-8 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/10 hover:translate-y-[-1px] active:scale-[0.98] transition-all text-xs flex items-center gap-1">
                                                    القبول الآن
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 py-32 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-8 shadow-sm">
                            <TrendingUp className="h-8 w-8 text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">لا توجد عروض جديدة</h3>
                        <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto leading-relaxed">سيظهر هنا فور قيام السائقين بتقديم أسعار مقترحة لشحناتك المتاحة.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
