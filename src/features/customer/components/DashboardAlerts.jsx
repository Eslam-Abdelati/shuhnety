import React from 'react'
import { Bell, CheckCircle2, AlertCircle, ChevronLeft, ArrowRight, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardAlerts = ({ offers = [], shipments = [] }) => {
    // 1. Find offers where driver accepted negotiation
    // Logic: negotiatedAmount exists AND (amount === negotiatedAmount or backend flag)
    // Based on BiddingInterface.jsx logic: (!isAccepted && (offer.negotiatedAmount && parseFloat(offer.amount) === parseFloat(offer.negotiatedAmount)))
    const acceptedNegotiations = offers.filter(offer => 
        offer.negotiatedAmount && 
        parseFloat(offer.amount) === parseFloat(offer.negotiatedAmount) &&
        offer.status === 'pending'
    );

    // 2. Find shipments that just got 'delivered' but maybe not reviewed?
    // (Wait, we don't have review status yet, so let's stick to accepted negotiations)

    if (acceptedNegotiations.length === 0) return null;

    return (
        <div className="space-y-4 mb-10 overflow-hidden font-cairo">
            <div className="flex items-center gap-3 mb-2">
                <Bell className="h-5 w-5 text-brand-primary animate-bounce" />
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">تنبيهات هامة</h3>
            </div>
            
            <AnimatePresence>
                {acceptedNegotiations.map((offer, idx) => (
                    <motion.div
                        key={offer.id || idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] p-6 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-500 overflow-hidden"
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-50 dark:bg-emerald-500/5 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                                    <CheckCircle2 className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg">قبول عرض التفاوض!</h4>
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg uppercase tracking-wider">تحديث جديد</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                                        وافق السائق <span className="text-slate-900 dark:text-white font-black">{offer.driver?.full_name || offer.driverName || 'سائق'}</span> على السعر الذي اقترحته لشحنة <span className="font-black text-brand-primary">{offer.shipment?.displayId || 'الجارية'}</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <div className="text-center px-6 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/20">
                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-0.5 tracking-widest">السعر النهائي</p>
                                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                                        {parseFloat(offer.negotiatedAmount).toLocaleString('ar-EG')} <span className="text-xs">ج.م</span>
                                    </p>
                                </div>
                                <Link 
                                    to={`/customer/bids/${offer.shipment?.id || offer.shipmentId || offer.shipment_id || offer.shipmentDetails?.id}`}
                                    className="h-14 px-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-3 hover:-translate-x-1 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                                >
                                    إتمام الحجز
                                    <ChevronLeft className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default DashboardAlerts;
