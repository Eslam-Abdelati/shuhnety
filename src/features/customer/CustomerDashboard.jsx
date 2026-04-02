import { Link } from 'react-router-dom'
import { Plus, Package, TrendingUp, ArrowLeftRight, ShieldCheck, Box, AlertCircle, ChevronLeft, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useShipmentStore } from '@/store/useShipmentStore'
import { useOfferStore } from '@/store/useOfferStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ar } from 'date-fns/locale'
import { useState, useEffect, useRef } from 'react'
import { shipmentService } from '@/services/shipmentService'
import { getGoodsTypeLabel, getStatusStyles } from '@/utils/shipmentUtils'
import DashboardStats from './components/DashboardStats'

export const CustomerDashboard = () => {
    const { shipments = [], setShipments } = useShipmentStore()
    const { offers = [] } = useOfferStore()
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)
    const [apiStats, setApiStats] = useState({
        total: 0,
        in_progress: 0,
        completed: 0,
        new_bids: 0
    })
    const [apiNewBids, setApiNewBids] = useState([])
    const [apiError, setApiError] = useState(null)
    const isInitialMount = useRef(true)

    useEffect(() => {
        if (!isInitialMount.current) return;
        isInitialMount.current = false;

        const fetchInitialData = async () => {
            setIsLoading(true)
            setApiError(null)
            try {
                // Fetch shipments and stats in parallel to be faster
                const [shipmentsRes, statsRes, bidsRes] = await Promise.all([
                    shipmentService.searchShipments({ skip: 0, take: 5 }).catch(err => {
                        console.error('Shipments fetch error:', err);
                        if (err.message.includes('429') || err.message.includes('الحد المسموح به')) {
                            setApiError(err.message);
                        }
                        return { data: { shipments: [] } };
                    }),
                    shipmentService.getShipmentStats().catch(err => {
                        console.error('Stats fetch error:', err);
                        if (err.message.includes('429') || err.message.includes('الحد المسموح به')) {
                            setApiError(err.message);
                        }
                        return { status: false };
                    }),
                    shipmentService.getNewBids().catch(err => {
                        console.error('New bids fetch error:', err);
                        return { data: [] };
                    })
                ]);

                // Handle shipments
                const shipmentsData = shipmentsRes.data?.shipments || (Array.isArray(shipmentsRes.data) ? shipmentsRes.data : [])
                setShipments(shipmentsData)
                // Handle stats
                if (statsRes && statsRes.status && statsRes.data) {
                    const statsData = statsRes.data;
                    setApiStats({
                        total: statsData.totalShipments || 0,
                        in_progress: statsData.inProgressShipments || 0,
                        completed: statsData.completedShipments || 0,
                        new_bids: statsData.newOffers || 0
                    })
                }

                // Handle new bids
                const newBidsData = Array.isArray(bidsRes?.data) ? bidsRes.data : (bidsRes?.data?.bids || bidsRes?.bids || [])
                setApiNewBids(newBidsData.slice(0, 3))
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchInitialData()
    }, [])

    // الحصول على العروض النشطة (في انتظار الرد أو عروض مقابلة)
    const activeOffers = (offers || []).filter(o => o.status === 'pending' || o.status === 'counter_offered')
    const recentOffers = activeOffers.slice(0, 3)
    return (
        <div className="space-y-10 font-cairo">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-[24px] xl:text-[36px] font-black text-[#1c1919] dark:text-white tracking-tight mb-2">لوحة التحكم</h1>
                    <p className="text-sm sm:text-base lg:text-[14px] text-[#57534d] dark:text-slate-400 font-bold flex items-center gap-2">
                        مرحباً {user?.full_name || 'يا بطل'} <span className="text-xl lg:text-xl">👋</span>
                        <span className="block h-1.5 w-1.5 rounded-full bg-brand-secondary"></span>
                        لديك {shipments.filter(s => s.status !== 'تم التوصيل' && s.status !== 'ملغي').length} شحنات نشطة اليوم
                    </p>
                </div>

                <Link to="/customer/create" className="relative z-10 w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-[#064e3b] hover:bg-[#053a2c] text-white rounded-2xl gap-3 px-8 h-14 text-sm md:text-md font-black shadow-xl shadow-[#064e3b]/20 hover:-translate-y-1 transition-all">
                        <Plus className="h-6 w-6" />
                        إنشاء شحنة جديدة
                    </Button>
                </Link>
            </div>

            {apiError && (
                <div className="bg-red-50 border border-red-100 rounded-[1.5rem] p-6 flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-black mb-0.5">خطأ في جلب البيانات</p>
                        <p className="text-[11px] font-bold opacity-80">{apiError}</p>
                    </div>
                </div>
            )}

            {/* Global Stats Grid */}
            <DashboardStats statsData={apiStats} isLoading={isLoading} />

            {/* Performance & Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Shipments Table */}
                <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none dark:ring-1 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 font-black text-[#1c1919] dark:text-white">
                                <span className="text-xl sm:text-2xl lg:text-[20px] font-bold">أحدث الشحنات</span>
                            </div>
                            <Link to="/customer/shipments" className="text-xs font-black text-brand-primary hover:underline underline-offset-4 hidden sm:block">
                                عرض الكل
                            </Link>
                        </div>

                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        {shipments.length > 0 ? (
                            shipments.slice(0, 4).map((shipment, i) => (
                                <div key={shipment.id} className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 flex flex-col gap-5 overflow-hidden">
                                    {/* Glassy Background Accent */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none transition-colors duration-500",
                                        getStatusStyles(shipment.status).bg.replace('bg-', 'bg-')
                                    )}></div>

                                    {/* Top Row: Icon, ID and Status */}
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all rounded-2xl flex items-center justify-center">
                                                <Package className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{shipment.displayId}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-[10px] font-bold text-slate-400">
                                                        {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mt-0.5">{getGoodsTypeLabel(shipment.goodsType)}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "px-3 py-1.5 rounded-full text-[10px] font-black border tracking-wider",
                                            getStatusStyles(shipment.status).bg,
                                            getStatusStyles(shipment.status).text,
                                            getStatusStyles(shipment.status).border
                                        )}>
                                            {shipment.status}
                                        </span>
                                    </div>

                                    {/* Middle Row: Route */}
                                    <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-50 dark:border-slate-800 relative z-10 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">المنشأ</p>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">{shipment.pickupGovernorate}، {shipment.pickupCity}</p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                                            <ArrowLeftRight className="h-3 w-3 text-slate-300 group-hover:text-brand-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">الوجهة</p>
                                            <p className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">{shipment.destinationGovernorate}، {shipment.destinationCity}</p>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Stats & Action */}
                                    <div className="flex items-center justify-between mt-auto relative z-10 pt-2">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">الوزن</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white">{shipment.weight} <span className="text-[10px] opacity-40">كجم</span></p>
                                            </div>
                                            {shipment.bidsCount > 0 && (
                                                <>
                                                    <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">المزايدات</p>
                                                        <p className="text-xs font-black text-slate-900 dark:text-white">{shipment.bidsCount}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <Link to={`/customer/shipments/${shipment.id}`}>
                                            <Button variant="ghost" className="h-10 px-6 text-xs font-black bg-brand-primary/5 hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-brand-primary/20">
                                                التفاصيل
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                                <Box className="h-10 w-10 text-slate-300 mb-4" />
                                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2">لا يوجد شحنات منشأة</h4>
                                <Link to="/customer/create">
                                    <Button className="bg-[#064e3b] hover:bg-[#053a2c] text-white rounded-xl gap-2 font-black text-xs h-9 px-4 mt-2">
                                        <Plus className="h-3 w-3" /> إنشاء أول شحنة
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {shipments.length > 0 && (
                            <div className="flex justify-center pt-4 border-t border-slate-50 dark:border-slate-800 mt-2">
                                <Link to="/customer/shipments" className="flex items-center gap-1.5 text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors group">
                                    عرض كل الشحنات
                                    <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Sidebar Widget: Active Offers */}
                <div className="space-y-10">
                    <Card className="bg-gradient-to-br from-brand-primary to-blue-900 border-none p-1 shadow-2xl shadow-brand-primary/30 dark:shadow-brand-primary/10">
                        <CardContent className="p-8 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-black mb-0.5">عروض جديدة</h4>
                                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">تحديث لحظي</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {apiNewBids.length > 0 ? (
                                    apiNewBids.map((offer) => (
                                        <div key={offer.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/20 transition-all cursor-pointer group/offer">
                                            <div className="flex justify-between items-center mb-5">
                                                <div>
                                                    <p className="text-sm font-black text-white leading-none">{offer.driver?.full_name || offer.driverName || 'سائق'}</p>
                                                    <p className="text-[10px] font-bold text-white/40 mt-1.5">{getGoodsTypeLabel(offer.shipment?.goodsType || offer.shipmentDetails?.goodsType) || 'شحنة عامة'}</p>
                                                </div>
                                                <span className="text-[10px] font-black bg-brand-secondary text-white text-center px-3 py-1.5 rounded-lg shadow-sm">
                                                    {offer.amount || offer.price} EGP
                                                </span>
                                            </div>
                                            <Link
                                                to="/customer/bids"
                                                className="w-full py-3 bg-white text-brand-primary rounded-xl text-xs font-black flex items-center justify-center hover:bg-blue-50 transition-all shadow-lg shadow-black/5 active:scale-[0.98]"
                                            >
                                                عرض التفاصيل
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                                        <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="h-6 w-6 text-white/40" />
                                        </div>
                                        <p className="text-sm font-bold text-white/60">لا توجد عروض جديدة حالياً</p>
                                        <p className="text-[10px] text-white/30 mt-1">سيتم إشعارك فور وصول عروض من السائقين</p>
                                    </div>
                                )}
                            </div>

                            {apiNewBids.length > 0 && (
                                <Link to="/customer/bids" className="block mt-6">
                                    <Button variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white font-black">مشاهدة جميع العروض</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    {/* Digital Contracts Banner */}
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group">
                        <CardContent className="p-8 text-center">
                            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-8 w-8 text-brand-secondary" />
                            </div>
                            <h5 className="text-lg font-black text-slate-900 dark:text-white mb-2">عقودك الرقمية جاهزة</h5>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">جميع معاملاتك محمية بعقود رقمية ملزمة لضمان حقوقك وحقوق السائق</p>
                            <Link to="/customer/contracts" className="inline-flex items-center text-sm font-black text-brand-secondary hover:gap-2 transition-all">
                                تحميل العقود الأخيرة
                                <ArrowLeftRight className="mr-2 h-4 w-4" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

