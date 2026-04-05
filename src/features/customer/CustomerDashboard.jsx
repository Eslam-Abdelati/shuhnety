import { Link } from 'react-router-dom'
import { Plus, Package, TrendingUp, ArrowLeftRight, ShieldCheck, Box, AlertCircle, ChevronLeft, Calendar, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useShipmentStore } from '@/store/useShipmentStore'
import { useOfferStore } from '@/store/useOfferStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ar } from 'date-fns/locale'
import { useState, useEffect, useRef } from 'react'
import { shipmentService } from '@/services/shipmentService'
import { socketService } from '@/services/socketService'
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

    useEffect(() => {
        if (!isInitialMount.current) return;
        isInitialMount.current = false;
        fetchInitialData()
    }, [])

    useEffect(() => {
        const handleUpdates = (data) => {
            console.log('📡 [Dashboard] Real-time update received:', data);
            fetchInitialData();
        };

        const events = ['new_bid', 'bid_received', 'notification', 'new_notification'];
        
        events.forEach(event => socketService.on(event, handleUpdates));

        return () => {
            events.forEach(event => socketService.off(event, handleUpdates));
        };
    }, []);

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
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8 px-8 pt-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 bg-brand-primary/10 rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center text-brand-primary relative group overflow-hidden shadow-sm">
                                <div className="absolute inset-0 bg-brand-primary/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                                <Truck className="h-5 w-5 sm:h-6 sm:w-6 relative z-10" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-[#1c1919] dark:text-white mb-0.5 tracking-tight">احدث الشحنات</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none border-r-2 border-brand-primary/30 pr-2">متابعة شحناتك النشطة</p>
                            </div>
                        </div>
                        <Link to="/customer/shipments" className="text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors px-4 py-2 bg-brand-primary/10 rounded-xl">
                            عرض الكل
                        </Link>
                    </div>

                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                        {shipments.length > 0 ? (
                            shipments.slice(0, 4).map((shipment, i) => (
                                <div key={shipment.id} className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-4 sm:p-5 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 flex flex-col gap-5 overflow-hidden">
                                    {/* Glassy Background Accent */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none transition-colors duration-500",
                                        getStatusStyles(shipment.status).bg.replace('bg-', 'bg-')
                                    )}></div>

                                    {/* Top Row: Icon, ID and Status */}
                                    <div className="flex justify-between items-start sm:items-center relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all rounded-2xl flex items-center justify-center">
                                                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                                                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{shipment.displayId}</span>
                                                    <span className="hidden sm:block h-1 w-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                                                        {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }) : '---'}
                                                    </span>
                                                </div>
                                                <p className="text-[9px] sm:text-[10px] font-black text-brand-primary uppercase tracking-widest mt-0.5">{getGoodsTypeLabel(shipment.goodsType)}</p>
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "shrink-0 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black border tracking-wider",
                                            getStatusStyles(shipment.status).bg,
                                            getStatusStyles(shipment.status).text,
                                            getStatusStyles(shipment.status).border
                                        )}>
                                            {shipment.status}
                                        </span>
                                    </div>

                                    {/* Middle Row: Route */}
                                    <div className="flex items-center gap-3 sm:gap-4 bg-slate-50/50 dark:bg-slate-800/50 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 relative z-10 transition-colors group-hover:bg-white dark:group-hover:bg-slate-800">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">المنشأ</p>
                                            <p className="text-[11px] sm:text-xs font-black text-slate-700 dark:text-slate-300 truncate">{shipment.pickupGovernorate}، {shipment.pickupCity}</p>
                                        </div>
                                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                                            <ArrowLeftRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-300 group-hover:text-brand-primary transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">الوجهة</p>
                                            <p className="text-[11px] sm:text-xs font-black text-slate-700 dark:text-slate-300 truncate">{shipment.destinationGovernorate}، {shipment.destinationCity}</p>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Stats & Action */}
                                    <div className="flex items-center justify-between mt-auto relative z-10 pt-1 sm:pt-2">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <div>
                                                <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">الوزن</p>
                                                <p className="text-xs font-black text-slate-900 dark:text-white">{shipment.weight} <span className="text-[9px] sm:text-[10px] opacity-40">كجم</span></p>
                                            </div>
                                            {shipment.bidsCount > 0 && (
                                                <>
                                                    <div className="w-px h-6 bg-slate-100 dark:bg-slate-800"></div>
                                                    <div>
                                                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">المزايدات</p>
                                                        <p className="text-xs font-black text-slate-900 dark:text-white">{shipment.bidsCount}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <Link to={`/customer/shipments/${shipment.id}`}>
                                            <Button variant="ghost" className="h-9 sm:h-10 px-4 sm:px-6 text-[11px] sm:text-xs font-black bg-brand-primary/5 hover:bg-brand-primary text-brand-primary hover:text-white rounded-xl transition-all shadow-sm hover:shadow-lg hover:shadow-brand-primary/20">
                                                التفاصيل
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 sm:p-12 text-center flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                                <Box className="h-9 w-9 sm:h-10 sm:w-10 text-slate-300 mb-4" />
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
                                <Link to="/customer/shipments" className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-brand-primary hover:text-brand-secondary transition-colors group">
                                    عرض كل الشحنات
                                    <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Sidebar Widget: Active Offers */}
                <div className="space-y-6 sm:space-y-10">
                    <Card className="bg-gradient-to-br from-brand-primary to-blue-900 border-none p-0.5 shadow-2xl shadow-brand-primary/30 dark:shadow-brand-primary/10 rounded-[2.5rem]">
                        <CardContent className="p-6 sm:p-8 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-lg sm:text-xl font-black mb-0.5">عروض جديدة</h4>
                                    <p className="text-[9px] sm:text-[10px] font-bold opacity-70 uppercase tracking-widest leading-none">تحديث لحظي</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {apiNewBids.length > 0 ? (
                                    apiNewBids.map((offer) => (
                                        <div key={offer.id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/20 transition-all cursor-pointer group/offer">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="min-w-0 pr-2">
                                                    <p className="text-sm font-black text-white leading-tight truncate">{offer.driver?.full_name || offer.driverName || 'سائق'}</p>
                                                    <p className="text-[9px] sm:text-[10px] font-bold text-white/40 mt-1 uppercase tracking-wider truncate">
                                                        {getGoodsTypeLabel(
                                                            offer.shipment?.goods_type || offer.shipment?.goodsType || offer.shipmentDetails?.goodsType,
                                                            offer.shipment?.other_goods_type || offer.shipment?.otherGoodsType || offer.shipmentDetails?.otherGoodsType
                                                        ) || 'شحنة عامة'}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 text-[11px] font-black bg-brand-secondary text-white text-center px-2.5 py-1.5 rounded-lg shadow-sm">
                                                    {parseFloat(offer.negotiatedAmount || offer.negotiated_amount || offer.new_amount || offer.amount || offer.price || 0).toLocaleString('ar-EG')} ج.م
                                                </span>
                                            </div>
                                            <Link
                                                to={`/customer/bids/${offer.shipment?.id || offer.shipmentId || offer.shipment_id || offer.shipmentDetails?.id || offer.shipmentDetails?._id}`}
                                                className="w-full py-2.5 bg-white text-brand-primary rounded-xl text-[11px] font-black flex items-center justify-center hover:bg-blue-50 transition-all shadow-lg shadow-black/5 active:scale-[0.98]"
                                            >
                                                عرض التفاصيل
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white/40" />
                                        </div>
                                        <p className="text-sm font-bold text-white/60 leading-none mb-2">لا توجد عروض جديدة</p>
                                        <p className="text-[10px] text-white/30 tracking-tight">سيتم إشعارك فور وصول عروض جديدة</p>
                                    </div>
                                )}
                            </div>

                            {apiNewBids.length > 0 && (
                                <Link to="/customer/bids" className="block mt-6">
                                    <Button variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white font-black text-xs h-10 rounded-xl">مشاهدة جميع العروض</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>

                    {/* Digital Contracts Banner */}
                    <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group rounded-[2.5rem]">
                        <CardContent className="p-6 sm:p-8 text-center">
                            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-brand-secondary" />
                            </div>
                            <h5 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2 leading-none">عقودك الرقمية جاهزة</h5>
                            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">جميع معاملاتك محمية بعقود رقمية ملزمة لضمان حقوق كافة الأطراف</p>
                            <Link to="/customer/contracts" className="inline-flex items-center text-xs sm:text-sm font-black text-brand-secondary hover:gap-2 transition-all">
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

