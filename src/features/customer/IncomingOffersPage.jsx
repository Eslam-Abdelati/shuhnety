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
    Star
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
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 font-cairo" dir="rtl">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">العروض الواردة</h1>
                    <p className="text-slate-500 font-medium mt-2">إليك العروض المتاحة لشحناتك الحالية</p>
                </div>
                <Button
                    onClick={fetchOffers}
                    variant="outline"
                    className="h-11 rounded-2xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                >
                    <Clock className="ml-2 h-4 w-4" />
                    تحديث القائمة
                </Button>
            </div>

            {/* Clean List */}
            <div className="space-y-4 px-4">
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <Card key={offer.id} className="group overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 rounded-[2rem]">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                    
                                    {/* Section 1: Driver Minimal */}
                                    <div className="flex items-center gap-5 min-w-[240px]">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                            {offer.driver?.profile_picture ? (
                                                <img src={offer.driver.profile_picture} className="h-full w-full object-cover" alt="" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-300">
                                                    <User className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                                                {offer.driver?.full_name || "سائق"}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-amber-400">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <Star className="h-3 w-3 fill-current" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">5.0</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                                <Truck className="h-3 w-3" />
                                                {offer.driverDetails?.vehicle_type || "نقل"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Section 2: Shipment Summary */}
                                    <div className="flex-1 lg:border-x lg:border-slate-50 lg:px-8 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-2 py-0.5 rounded-full uppercase">
                                                {getGoodsTypeLabel(offer.shipment?.goodsType) || 'شحنة'}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">#{offer.shipment?.id?.toString().slice(-6)}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">من</span>
                                                <span className="text-sm font-black text-slate-700">{offer.shipment?.pickupGovernorate}</span>
                                            </div>
                                            <ArrowLeftRight className="h-4 w-4 text-slate-200" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">إلى</span>
                                                <span className="text-sm font-black text-slate-700">{offer.shipment?.destinationGovernorate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Value & Action */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 lg:min-w-[320px] justify-between">
                                        <div className="text-right">
                                            <span className="block text-[10px] text-slate-400 font-bold mb-1">وقت الوصول</span>
                                            <span className="text-sm font-black text-slate-900 border-b-2 border-emerald-500/30">
                                                {formatEstimatedTime(offer.estimatedTime || offer.estimated_time)}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-center sm:items-end flex-1">
                                            <div className="flex items-baseline gap-1 mb-4">
                                                <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                                    {(offer.amount || offer.price || 0).toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 uppercase">ج.م</span>
                                            </div>
                                            
                                            <div className="flex gap-2 w-full">
                                                <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1">
                                                    <Button variant="ghost" className="w-full h-12 rounded-2xl font-black text-slate-500 border border-slate-100 hover:bg-slate-50 group">
                                                        <TrendingUp className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100" />
                                                        تفاوض
                                                    </Button>
                                                </Link>
                                                <Link to={`/customer/bids/${offer.shipment?.id || offer.shipmentId}`} className="flex-1">
                                                    <Button className="w-full h-12 bg-brand-primary text-white rounded-2xl font-black shadow-lg shadow-brand-primary/10 hover:translate-y-[-1px] transition-all">
                                                        قبول
                                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-24 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <TrendingUp className="h-8 w-8 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">لا توجد عروض حالية</h2>
                        <p className="text-slate-500 font-medium">سيتم إخطارك فور وصول عروض جديدة لتتمكن من المقارنة والتفاوض.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
