import React from 'react'
import { Package, Activity, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import QuickCounter from '@/components/ui/QuickCounter'
import { motion } from 'framer-motion'

const DashboardStats = ({ statsData, isLoading }) => {
    const stats = [
        {
            label: 'إجمالي الشحنات',
            value: statsData.total,
            icon: Package,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'قيد التنفيذ',
            value: statsData.in_progress,
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'تم التوصيل',
            value: statsData.completed,
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
            {stats.map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-[1rem] md:rounded-[1.5rem] overflow-hidden group hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4 md:p-6 flex items-center justify-between">
                            <div className="text-right">
                                <p className="text-slate-500 text-[10px] md:text-xs font-bold mb-1">{stat.label}</p>
                                <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-none">
                                    <QuickCounter value={stat.value} isLoading={isLoading} />
                                </h3>
                            </div>
                            <div className={cn("h-9 w-9 md:h-13 md:w-13 rounded-lg md:rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-500", stat.bg, stat.color)}>
                                <stat.icon className="h-5 w-5 md:h-7 md:w-7" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}

export default DashboardStats;
