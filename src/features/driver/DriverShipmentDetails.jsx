import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin, Truck, Box, Calendar, Weight, Package,
    Maximize, Navigation, CheckCircle2, ShieldCheck,
    ArrowRight, Loader2, AlertCircle, Phone, Clock, CreditCard, ChevronLeft, Map, Info, Lock,
    TrendingUp, ArrowLeftRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/Dialog";
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useOfferStore } from '@/store/useOfferStore';
import { getStatusStyles, getGoodsTypeLabel, mapShipmentData, formatEstimatedTime } from '@/utils/shipmentUtils';
import { shipmentService } from '@/services/shipmentService';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export const DriverShipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { offers, addOffer } = useOfferStore();
    const { addNotification } = useNotificationStore();

    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    const [showBidModal, setShowBidModal] = useState(false);
    const [submittingBid, setSubmittingBid] = useState(false);
    const [bidForm, setBidForm] = useState({ amount: '', days: '', hours: '', minutes: '', note: null });

    useEffect(() => {
        fetchShipmentDetails();
    }, [id]);

    const fetchShipmentDetails = async () => {
        try {
            setLoading(true);
            const data = await shipmentService.getShipmentById(id);
            console.log(data);

            setShipment(data.status_original ? data : mapShipmentData(data));
            setError(null);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('خطأ في تحميل تفاصيل الشحنة');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await shipmentService.updateShipmentStatus(id, newStatus);
            addNotification({
                title: 'تم بنجاح',
                desc: 'تم تحديث حالة الشحنة بنجاح',
                type: 'success'
            });
            window.location.reload();
        } catch (err) {
            addNotification({ title: 'خطأ', desc: 'فشل تحديث الحالة', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmitBid = async (e) => {
        e.preventDefault();
        try {
            setSubmittingBid(true);

            // Calculate total minutes
            const totalMinutes = (parseInt(bidForm.days || 0) * 1440) +
                (parseInt(bidForm.hours || 0) * 60) +
                parseInt(bidForm.minutes || 0);

            if (myBid?.id) {
                // If a bid already exists, we are negotiating (counter-offer)
                await shipmentService.negotiateBid(myBid.id, bidForm.amount);
                addNotification({ title: 'تم الإرسال', desc: 'تم إرسال عرضك التفاوضي الجديد بنجاح', type: 'success' });
            } else {
                // Standard initial bid submission
                const bidData = {
                    shipmentId: parseInt(id),
                    amount: parseFloat(bidForm.amount),
                    estimatedTime: totalMinutes,
                    note: bidForm.note?.trim() || null
                };
                await shipmentService.submitBid(bidData);
                addNotification({ title: 'نجاح', desc: 'تم تقديم عرضك بنجاح', type: 'success' });

                addOffer({
                    id: Math.random().toString(36).substr(2, 9),
                    shipmentId: id,
                    driverId: user?.id,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });
            }

            setShowBidModal(false);
            fetchShipmentDetails();
        } catch (err) {
            addNotification({ title: 'خطأ', desc: err.message || 'فشل إرسال العرض', type: 'error' });
        } finally {
            setSubmittingBid(false);
        }
    };

    const handleAcceptNegotiatedPrice = async () => {
        if (!myBid?.id) return;
        try {
            setUpdating(true);
            await shipmentService.updateBidStatus(myBid.id, 'accepted');
            addNotification({ title: 'تم القبول', desc: 'تم قبول عرض السعر بنجاح وجاري تحديث الشحنة', type: 'success' });
            fetchShipmentDetails(); // Refresh to show assigned status
        } catch (err) {
            addNotification({ title: 'خطأ', desc: err.message || 'فشل قبول العرض', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    const openInGoogleMaps = (gov, city, address) => {
        const query = encodeURIComponent(`${address || ''} ${city || ''} ${gov || ''}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <Loader2 className="h-12 w-12 text-brand-primary animate-spin" />
            <p className="text-sm font-bold text-slate-400 mt-4 animate-pulse">جاري تحميل بيانات الشحنة...</p>
        </div>
    );

    if (error || !shipment) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
            <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">تعذر الوصول للبيانات</h3>
            <p className="text-slate-500 font-bold mb-8 max-w-xs mx-auto leading-relaxed">{error || 'لم نتمكن من العثور على هذه الشحنة'}</p>
            <Button onClick={() => navigate(-1)} className="min-w-[200px] h-14 bg-slate-900 text-white rounded-2xl font-black shadow-lg">العودة للخلف</Button>
        </div>
    );

    const rawStatus = shipment.status_original || shipment.status;
    const currentStatusStyle = getStatusStyles(rawStatus);

    // Check if there's any bid at all from any source
    const hasOffer = (shipment.bids && shipment.bids.length > 0) ||
        (offers?.some(o => String(o.shipmentId) === String(id)));

    // Find the specific bid for the current user to handle assignment
    const myBid = shipment.bids?.find(b => {
        const bidDriverId = b.driver_id || b.driverId || b.createdBy || b.user_id || b.driver?.id;
        return String(bidDriverId) === String(user?.id);
    }) || (shipment.bids?.length === 1 ? shipment.bids[0] : null);

    const isOfferAccepted = myBid?.status === 'accepted' || myBid?.status === 'تم قبول العرض';
    const isAssignedToMe = isOfferAccepted ||
        (['pickup_in_progress', 'delivery_in_progress', 'delivered', 'accepted'].some(s => rawStatus?.includes(s)) && hasOffer);

    return (
        <div className="max-w-5xl mx-auto px-4 pb-24 font-cairo" dir="rtl">
            {/* --- Standard Simplified Header --- */}
            <div className="pt-6 pb-8 space-y-6">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <span className="p-2.5 bg-brand-primary/10 rounded-2xl text-brand-primary shadow-sm">
                                <Package className="h-6 w-6" />
                            </span>
                            تفاصيل الشحنة
                        </h1>
                        <p className="text-xs font-bold text-slate-400 mr-14">{shipment.displayId}</p>
                    </div>

                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-2.5",
                        currentStatusStyle.bg,
                        currentStatusStyle.text,
                        currentStatusStyle.border
                    )}>
                        <span className={cn(
                            "h-2 w-2 rounded-full animate-pulse",
                            currentStatusStyle.dot
                        )} />
                        {shipment.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Main Content (Right Column) --- */}
                <div className="lg:col-span-2 space-y-8">


                    {/* Path & Map Section */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">مسار الشحنة</h3>
                                <div className="h-8 w-8 bg-emerald-50 text-emerald-500 rounded-lg flex items-center justify-center">
                                    <MapPin className="h-5 w-5" />
                                </div>
                            </div>

                            <div className="relative space-y-12 before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50 before:border-dashed before:border-r-2 before:border-slate-100">
                                {/* Pickup Point */}
                                <div className="relative flex items-start gap-8 mr-1">
                                    <div className="h-7 w-7 rounded-full bg-white border-4 border-emerald-500 shadow-lg shadow-emerald-500/20 z-10 flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1 text-[10px] font-black text-emerald-600 uppercase">
                                            <span>نقطة التحميل</span>
                                            <button
                                                onClick={() => openInGoogleMaps(shipment.pickupGovernorate, shipment.pickupCity, shipment.pickupAddress)}
                                                className="flex items-center gap-1.5 hover:underline"
                                            >
                                                الخريطة <Map className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-800">{shipment.pickupPoint}</h4>
                                        <p className="text-sm font-bold text-slate-500 mt-1 leading-relaxed">{shipment.pickupAddress}</p>
                                    </div>
                                </div>

                                {/* Destination Point */}
                                <div className="relative flex items-start gap-8 mr-1">
                                    <div className="h-7 w-7 rounded-full bg-white border-4 border-brand-primary shadow-lg shadow-brand-primary/20 z-10 flex items-center justify-center">
                                        <div className="h-1.5 w-1.5 bg-brand-primary rounded-full"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1 text-[10px] font-black text-brand-primary uppercase">
                                            <span>وجهة التوصيل</span>
                                            <button
                                                onClick={() => openInGoogleMaps(shipment.destinationGovernorate, shipment.destinationCity, shipment.destinationAddress)}
                                                className="flex items-center gap-1.5 hover:underline"
                                            >
                                                الخريطة <Map className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-800">{shipment.destinationPoint}</h4>
                                        <p className="text-sm font-bold text-slate-500 mt-1 leading-relaxed">{shipment.destinationAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specifications Section */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] p-8">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Box className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">مواصفات الشحنة</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'الوزن', value: `${shipment.weight} كجم`, icon: Weight, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'نوع الحمولة', value: getGoodsTypeLabel(shipment.goodsType), icon: Box, color: 'text-orange-500', bg: 'bg-orange-50' },
                                { label: 'الأبعاد', value: `${shipment.length || '?'}/${shipment.width || '?'}/${shipment.height || '?'}`, icon: Maximize, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { label: 'تاريخ النشر', value: shipment.createdAt ? format(new Date(shipment.createdAt), 'dd MMM yyyy', { locale: ar }) : '---', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' }
                            ].map((spec, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl text-center group transition-all hover:bg-white hover:shadow-xl hover:border-slate-200">
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", spec.bg, spec.color)}>
                                        <spec.icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-slate-400 mb-1 whitespace-nowrap">{spec.label}</span>
                                    <span className="text-xs font-black text-slate-800 whitespace-nowrap">{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        {shipment.description && (
                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-start gap-4">
                                <Info className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">وصف وتفاصيل الحمولة</span>
                                    <p className="text-sm font-bold text-slate-700 leading-relaxed">{shipment.description}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>

                {/* --- Sidebar (Left Column) --- */}
                <div className="space-y-8">

                    {/* Contacts Section (Conditional) */}
                    <Card className="rounded-[2.5rem] border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] p-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">بيانات التواصل</h4>

                        {isAssignedToMe ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">العميل</p>
                                        <p className="text-sm font-black text-slate-900">{shipment.customerName}</p>
                                        <p className="text-xs font-bold text-slate-500">{shipment.customerPhone}</p>
                                    </div>
                                    <button onClick={() => window.open(`tel:${shipment.customerPhone}`)} className="h-10 w-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">المستلم</p>
                                        <p className="text-sm font-black text-slate-900">{shipment.recipientName}</p>
                                        <p className="text-xs font-bold text-slate-500">{shipment.recipientPhone}</p>
                                    </div>
                                    <button onClick={() => window.open(`tel:${shipment.recipientPhone}`)} className="h-10 w-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform">
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 bg-amber-50/50 border border-amber-100/50 rounded-[2rem] text-center space-y-3">
                                <div className="h-12 w-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                                    <Lock className="h-6 w-6" />
                                </div>
                                <p className="text-[11px] font-black text-amber-700 leading-relaxed">
                                    بيانات العميل والمستلم محجوبة حتى يتم قبول عرضك رسمياً
                                </p>
                            </div>
                        )}
                    </Card>

                    {/* Actions Section - Pure Logic-Driven UI with API linkage */}
                    <div className="space-y-4 pt-4">
                        {updating ? (
                            <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-2xl border-2 border-dashed border-slate-100">
                                <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
                                <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">جاري التنفيذ...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Persistent Offer Summary once bid exists */}
                                {hasOffer && (
                                    <div className={cn(
                                        "p-5 rounded-3xl border-none transition-all duration-300",
                                        isOfferAccepted ? "bg-emerald-50" : (myBid?.negotiatedAmount ? "bg-amber-50" : "bg-emerald-50")
                                    )}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    "h-7 w-7 rounded-lg flex items-center justify-center",
                                                    myBid?.negotiatedAmount ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                                                )}>
                                                    {myBid?.negotiatedAmount ? <TrendingUp className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                </div>
                                                <h3 className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest",
                                                    isOfferAccepted ? "text-emerald-600" : (myBid?.negotiatedAmount ? "text-amber-600" : "text-emerald-600")
                                                )}>
                                                    {isOfferAccepted ? 'السعر المتفق عليه' : (myBid?.negotiatedAmount ? 'عرض مقابل' : 'عرضك الحالي')}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1.5 opacity-40">
                                                <Clock className="h-3 w-3" />
                                                <span className="text-[9px] font-black">{formatEstimatedTime(myBid?.estimatedTime || myBid?.estimated_time)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-black text-slate-900">{myBid?.negotiatedAmount || myBid?.amount || '---'}</span>
                                            <span className="text-xs font-bold text-slate-400">ج.م</span>
                                            {myBid?.negotiatedAmount && (
                                                <span className="ml-2 text-[10px] line-through text-slate-300 font-bold">{myBid.amount} ج.م</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Conditional Buttons */}
                                {rawStatus === 'تم التحميل وفي الطريق' || rawStatus === 'delivery_in_progress' ? (
                                    <Button
                                        onClick={() => handleUpdateStatus('delivered')}
                                        className="w-full h-14 bg-emerald-500 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-200 transition-all border-none"
                                    >
                                        <CheckCircle2 className="ml-2 h-5 w-5" /> إتمام التوصيل
                                    </Button>
                                ) : (isOfferAccepted || isAssignedToMe) && rawStatus !== 'تم التوصيل' && rawStatus !== 'delivered' ? (
                                    <Button
                                        onClick={() => handleUpdateStatus('delivery_in_progress')}
                                        className="w-full h-14 bg-brand-primary text-white rounded-2xl font-black text-base shadow-lg shadow-brand-primary/20 transition-all border-none"
                                    >
                                        <Navigation className="ml-2 h-5 w-5 fill-white" /> بدأ الملاحة
                                    </Button>
                                ) : (rawStatus === 'تم التوصيل' || rawStatus === 'delivered') ? (
                                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center gap-4 text-center">
                                        <ShieldCheck className="h-10 w-10 text-emerald-500" />
                                        <div>
                                            <p className="text-base font-black text-emerald-900 leading-none">مهمة مكتملة</p>
                                            <p className="text-xs font-bold text-emerald-600 mt-2 leading-relaxed">شكراً لك على مجهودك، نتمنى لك رحلة آمنة قادمة</p>
                                        </div>
                                    </div>
                                ) : !hasOffer ? (
                                    <Button
                                        onClick={() => setShowBidModal(true)}
                                        className="w-full h-14 bg-brand-primary text-white rounded-2xl font-black text-base shadow-lg shadow-brand-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all border-none"
                                    >
                                        تقديم عرض
                                    </Button>
                                ) : myBid?.negotiatedAmount ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={handleAcceptNegotiatedPrice}
                                            className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-200 transition-all border-none"
                                        >
                                            <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" /> قبول عرض السعر
                                        </Button>
                                        <Button
                                            onClick={() => setShowBidModal(true)}
                                            variant="outline"
                                            className="flex-1 h-11 text-amber-600 border-amber-100 hover:bg-amber-50 rounded-xl font-bold text-xs transition-all"
                                        >
                                            <ArrowLeftRight className="ml-1.5 h-3.5 w-3.5" /> تفاوض
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="w-full h-14 bg-emerald-50/50 text-emerald-600 border border-emerald-100/50 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-sm transition-all duration-300">
                                        <CheckCircle2 className="h-5 w-5" />
                                        تم تقديم عرضك
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bidding Modal - Redesigned to be simple and beautiful */}
            <Dialog open={showBidModal} onOpenChange={setShowBidModal}>
                <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden font-cairo shadow-2xl border-none" dir="rtl">
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-12 w-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900">تقديم عرض سعر</DialogTitle>
                        </div>
                        <DialogDescription className="text-slate-400 font-bold pr-16 text-sm">
                            أرسل تفاصيل عرضك المالي والزمني للعميل للبدء في التفاوض.
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleSubmitBid} className="p-8 pt-4 space-y-6">
                        {/* Price Input - Added autofocus and enhanced styles */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">العرض المالي (جنيه مصري)</label>
                            <input
                                type="number"
                                value={bidForm.amount}
                                autoFocus
                                onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                                className="w-full h-14 bg-slate-50 border border-slate-100 hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 rounded-2xl px-6 text-lg font-black transition-all outline-none"
                                placeholder="ادخل السعر..."
                                required
                            />
                        </div>

                        {/* Detailed Time Inputs - Enhanced hover/focus */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الوقت المتوقع للتوصيل</label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <input
                                        type="number"
                                        value={bidForm.days}
                                        onChange={(e) => setBidForm({ ...bidForm, days: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 rounded-xl px-4 text-center font-black text-slate-700 transition-all outline-none"
                                        placeholder="0"
                                    />
                                    <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">أيام</p>
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="number"
                                        value={bidForm.hours}
                                        onChange={(e) => setBidForm({ ...bidForm, hours: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 rounded-xl px-4 text-center font-black text-slate-700 transition-all outline-none"
                                        placeholder="0"
                                    />
                                    <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">ساعات</p>
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="number"
                                        value={bidForm.minutes}
                                        onChange={(e) => setBidForm({ ...bidForm, minutes: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-100 hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 rounded-xl px-4 text-center font-black text-slate-700 transition-all outline-none"
                                        placeholder="0"
                                    />
                                    <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">دقائق</p>
                                </div>
                            </div>
                        </div>

                        {/* Notes - Enhanced hover/focus */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">ملاحظات إضافية (اختياري)</label>
                            <textarea
                                value={bidForm.note}
                                onChange={(e) => setBidForm({ ...bidForm, note: e.target.value })}
                                className="w-full h-24 bg-slate-50 border border-slate-100 hover:border-slate-300 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 rounded-2xl px-6 py-4 font-bold text-sm transition-all outline-none resize-none"
                                placeholder="اكتب هنا أي تفاصيل تود إبلاغ العميل بها..."
                            />
                        </div>

                        <DialogFooter className="gap-3 flex-row pt-4">
                            <Button
                                type="submit"
                                disabled={submittingBid}
                                className="flex-1 h-14 bg-brand-primary text-white rounded-2xl font-black text-base shadow-lg shadow-brand-primary/10 hover:bg-brand-primary/90 transition-all active:scale-95 border-none"
                            >
                                {submittingBid ? <Loader2 className="h-5 w-5 animate-spin" /> : 'إرسال العرض'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowBidModal(false)}
                                className="flex-1 h-14 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                            >
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
