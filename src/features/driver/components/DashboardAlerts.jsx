import React from 'react'
import { Bell, CheckCircle2, AlertCircle, ChevronLeft, MapPin, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardAlerts = ({ assignedShipments = [], availableShipments = [] }) => {
    const navigate = useNavigate();

    // 1. Identify urgent assignments (recently assigned shipments)
    const newAssignments = assignedShipments.filter(s => s.status === 'pickup_in_progress');

    // 2. Identify negotiations (where a customer has counter-offered)
    // Note: In the driver side, current code does not explicitly filter counter-offers in the dashboard yet.
    // However, we can look for shipments where driver has an offer and customer sent a counter.

    if (newAssignments.length === 0) return null;

    return (
        <div className="space-y-4 mb-8 font-cairo">
            <div className="flex items-center gap-3 mb-2 px-2">
                <Bell className="h-5 w-5 text-brand-primary animate-bounce" />
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">تنبيهات الرحلات</h3>
            </div>
            
            <AnimatePresence>
                {newAssignments.map((s, idx) => (
                    <motion.div
                        key={s.id || idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 rounded-[2rem] p-6 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/driver/available/${s.id}`)}
                    >
                        {/* Decorative background circle */}
                        <div className="absolute -left-8 -top-8 w-32 h-32 bg-blue-50 dark:bg-blue-500/5 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
                                    <MapPin className="h-7 w-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-black text-slate-900 dark:text-white text-lg">رحلة جديدة بانتظارك!</h4>
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-lg uppercase tracking-wider animate-pulse">مهمة جديدة</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                                        وافق العميل على عرضك لشحنة <span className="font-black text-slate-900 dark:text-white">{s.displayId}</span>. 
                                        يرجى التوجه إلى <span className="text-brand-primary font-black">{s.pickupCity}</span> لبدء عملية الاستلام.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0">
                                <div className="text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5 tracking-widest leading-none">ربح الرحلة</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">
                                        {s.price || s.budget || '---'} <span className="text-xs">ج.م</span>
                                    </p>
                                </div>
                                <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                    <ChevronLeft className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default DashboardAlerts;
