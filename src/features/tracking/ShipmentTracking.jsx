import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    MapPin,
    Truck,
    Package,
    Phone,
    MessageSquare,
    Clock,
    CheckCircle2,
    Navigation,
    ChevronLeft,
    Search,
    AlertCircle,
    XCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { shipmentService } from '@/services/shipmentService'
import { Loading } from '@/components/ui/Loading'

export const ShipmentTracking = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [shipment, setShipment] = useState(null)
    const [acceptedOffer, setAcceptedOffer] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchTrackingData = async () => {
            if (!id) {
                setShipment(null)
                setAcceptedOffer(null)
                return
            }

            setLoading(true)
            try {
                const data = await shipmentService.getShipmentById(id)
                setShipment(data)
                
                if (data.bids && Array.isArray(data.bids)) {
                    const accepted = data.bids.find(b => b.status === 'accepted')
                    if (accepted) {
                        setAcceptedOffer({
                            driverName: accepted.driver?.full_name || 'كابتن شحن',
                            driverImage: accepted.driver?.driverDetails?.profile_picture,
                            driverPhone: accepted.driver?.phone_number,
                            amount: accepted.amount,
                            estimatedTime: accepted.estimatedTime
                        })
                    } else {
                        setAcceptedOffer(null)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch tracking data:', error)
                setShipment(null)
                setAcceptedOffer(null)
            } finally {
                setLoading(false)
            }
        }

        fetchTrackingData()
    }, [id])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/customer/tracking/${searchQuery.trim()}`)
            setSearchQuery('')
        }
    }

    const steps = useMemo(() => {
        const status = shipment?.status || '';
        const isAccepted = !!acceptedOffer;
        
        // Accurate Status Checks
        const isPickupInProgress = status.includes('قيد التنفيذ') || status.includes('في الطريق للاستلام');
        // 'isReceived' means the driver has officially picked it up
        const isReceived = status.includes('تم الاستلام') || status.includes('تم التحميل') || status.includes('وفي الطريق') || status.includes('جاري التوصيل') || status.includes('تم التسليم');
        // 'isDelivering' means it is currently on the way to destination
        const isDelivering = status.includes('جاري التوصيل') || status.includes('وفي الطريق');
        const isDelivered = status.includes('تم التسليم');
        const isCancelled = status.includes('ملغي');

        const baseSteps = [
            {
                label: 'تم إنشاء الشحنة',
                time: shipment?.createdAt ? new Date(shipment.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '--:--',
                completed: true
            },
            {
                label: 'تم قبول العرض',
                time: isAccepted ? 'مكتمل' : '--:--',
                completed: isAccepted
            }
        ];

        if (isCancelled) {
            return [
                ...baseSteps,
                {
                    label: 'تم إلغاء الشحنة',
                    time: 'ملغي',
                    completed: false,
                    isCancelled: true
                }
            ];
        }

        return [
            ...baseSteps,
            {
                label: 'في الطريق للاستلام',
                time: isReceived ? 'مكتمل' : isPickupInProgress ? 'جاري التوجه' : '--:--',
                completed: isReceived,
                active: isPickupInProgress && !isReceived
            },
            {
                label: 'تم الاستلام',
                time: isReceived ? 'مكتمل' : '--:--',
                completed: isReceived,
                active: status.includes('تم الاستلام') && !isDelivering
            },
            {
                label: 'جاري التوصيل',
                time: isDelivered ? 'مكتمل' : isDelivering ? 'الآن' : '--:--',
                completed: isDelivered,
                active: isDelivering && !isDelivered
            },
            {
                label: 'تم التسليم',
                time: isDelivered ? 'تم تسليم الشحنة بنجاح' : '--:--',
                completed: isDelivered,
                active: isDelivered
            },
        ];
    }, [shipment, acceptedOffer])

    if (loading) {
        return <Loading text="جاري جلب بيانات التتبع المباشر..." />
    }

    if (!id || !shipment) {
        return (
            <div className="space-y-6 font-cairo">
                <Card className="p-2 rounded-2xl border-slate-100 shadow-sm">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ابحث برقم الشحنة..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pr-10 pl-4 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                            />
                        </div>
                        <Button type="submit" className="h-11 px-6 bg-brand-primary rounded-xl font-black text-sm text-white">
                            بحث
                        </Button>
                    </form>
                </Card>
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        {id ? <AlertCircle className="h-10 w-10 text-red-400" /> : <MapPin className="h-10 w-10 text-brand-primary animate-bounce" />}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        {id ? 'الشحنة غير موجودة' : 'تتبع شحنتك الآن'}
                    </h2>
                    <p className="text-slate-500 font-bold mb-6 max-w-xs">
                        {id ? 'رقم الشحنة الذي أدخلته غير صحيح أو ربما تم حذفها.' : 'أدخل رقم الشحنة في المربع أعلاه لمتابعة حالتها وموقع الكابتن.'}
                    </p>
                    {id && (
                        <Button variant="outline" onClick={() => navigate('/customer/shipments')} className="rounded-xl font-bold border-slate-200">
                            العودة لقائمة الشحنات
                        </Button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo">
            {/* Search Bar */}
            <Card className="p-2 rounded-2xl border-slate-100 shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="ابحث برقم الشحنة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 pr-10 pl-4 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                        />
                    </div>
                    <Button type="submit" className="h-11 px-6 bg-brand-primary rounded-xl font-black text-sm text-white text-white">
                        بحث
                    </Button>
                </form>
            </Card>

            {shipment.status === 'ملغي' && (
                <Card className="bg-red-50 border-red-100 rounded-3xl p-6 overflow-hidden relative mb-8">
                    <div className="absolute -left-4 -top-4 opacity-5">
                        <XCircle className="h-32 w-32 text-red-600" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="h-12 w-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-red-900">هذه الشحنة ملغية</h3>
                            <p className="text-sm font-bold text-red-600/80 leading-none mt-1">تم إلغاء طلب الشحن هذا ولن يتم متابعة تتبعه.</p>
                        </div>
                    </div>
                </Card>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 font-cairo tracking-tight">تتبع الشحنة {shipment.displayId || shipment.id}</h1>
                    <p className="font-black text-sm font-cairo flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-400">من</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{shipment.pickupGovernorate}، {shipment.pickupCity}</span>
                        <span className="text-slate-400 mx-1">إلى</span>
                        <span className="text-red-600 dark:text-red-400">{shipment.destinationGovernorate}، {shipment.destinationCity}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        className="rounded-xl gap-2 h-12 font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer" 
                        disabled={!acceptedOffer || shipment.status === 'ملغي'}
                        onClick={() => acceptedOffer?.driverPhone && (window.location.href = `tel:${acceptedOffer.driverPhone}`)}
                    >
                        <Phone className="h-5 w-5" />
                        اتصال بالكابتن
                    </Button>
                    <Button 
                        className="rounded-xl gap-2 h-12 shadow-xl shadow-slate-200/50 font-bold bg-slate-100 text-slate-400 border-none opacity-60 flex items-center justify-center cursor-not-allowed group relative" 
                        disabled={true}
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>محادثة فورية</span>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            قريباً...
                        </div>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Placeholder */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-[600px] relative overflow-hidden bg-slate-100 flex items-center justify-center border-slate-200 rounded-[2.5rem]">
                        <div className="text-center">
                            <div className="h-20 w-20 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <Truck className="h-10 w-10 text-brand-primary" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-1">خريطة التتبع المباشر</h3>
                            <p className="text-sm text-slate-500 font-black">
                                {shipment.status || 'في انتظار انطلاق الكابتن لبدء التتبع.'}
                            </p>
                        </div>

                        {/* Floating Driver Card */}
                        {acceptedOffer && (
                            <div className="absolute bottom-8 right-8 left-8 sm:left-auto sm:w-80 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-brand-primary font-black overflow-hidden ring-2 ring-slate-50">
                                        {acceptedOffer.driverImage ? (
                                            <img src={acceptedOffer.driverImage} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            acceptedOffer.driverName.substring(0, 2)
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900">{acceptedOffer.driverName}</h4>
                                        <p className="text-xs text-slate-500 font-bold">كابتن معتمد • ★ 4.9</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50 font-cairo">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الوصول المتوقع</p>
                                        <p className="text-sm font-black text-brand-primary">
                                            {acceptedOffer.estimatedTime ? `${acceptedOffer.estimatedTime} دقيقة` : 'غير محدد'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">قيمة العرض</p>
                                        <p className="text-sm font-black text-slate-800">
                                            {parseFloat(acceptedOffer.amount).toLocaleString('ar-EG')} ج.م
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Timeline */}
                <Card className="rounded-[2.5rem] border-slate-100 shadow-sm">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-black text-slate-900 mb-8">خط زمني للتوصيل</h3>
                        <div className="relative">
                            <div className="absolute top-2 right-4 bottom-2 w-0.5 bg-slate-100"></div>
                            <div className="space-y-10 relative">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center z-10 ring-4 ring-white transition-all duration-500",
                                            step.completed ? "bg-emerald-500 text-white" :
                                                step.isCancelled ? "bg-red-500 text-white shadow-lg shadow-red-200" :
                                                    step.active ? "bg-brand-primary text-white scale-125 shadow-lg shadow-brand-primary/30" : "bg-white border-2 border-slate-100 text-slate-200"
                                        )}>
                                            {step.completed ? <CheckCircle2 className="h-5 w-5" /> :
                                                step.isCancelled ? <XCircle className="h-5 w-5" /> :
                                                    <div className="h-2 w-2 rounded-full bg-current"></div>}
                                        </div>
                                        <div>
                                            <h4 className={cn(
                                                "text-sm font-black mb-1 transition-colors duration-500",
                                                step.active ? "text-brand-primary" :
                                                    step.isCancelled ? "text-red-600" :
                                                        step.completed ? "text-slate-900" : "text-slate-400"
                                            )}>
                                                {step.label}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-400">{step.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

