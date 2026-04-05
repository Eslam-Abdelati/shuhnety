import React from 'react'
import { Box, Truck, CheckCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import QuickCounter from '@/components/ui/QuickCounter'

const DashboardStats = ({ statsData, isLoading }) => {
    const stats = [
        {
            label: 'إجمالي الشحنات',
            value: statsData.total,
            icon: Box,
            color: 'orange',
            trend: statsData.total > 0 ? `${statsData.total}+` : '--',
            trendColor: 'emerald'
        },
        {
            label: 'قيد التنفيذ',
            value: statsData.in_progress,
            icon: Truck,
            color: 'blue',
            trend: '0',
            trendColor: 'blue'
        },
        {
            label: 'شحنات مكتملة',
            value: statsData.completed,
            icon: CheckCircle,
            color: 'green',
            trend: '0',
            trendColor: 'emerald'
        },
        {
            label: 'عروض جديدة',
            value: statsData.new_bids,
            icon: TrendingUp,
            color: 'orange',
            trend: statsData.new_bids > 0 ? `${statsData.new_bids}+` : '--',
            trendColor: 'emerald'
        },
    ]

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
                <Card key={i} className="group relative overflow-hidden bg-white dark:bg-slate-900 border-none shadow-sm rounded-[1.5rem] sm:rounded-[2rem] dark:ring-1 dark:ring-slate-800">
                    <CardContent className="p-4 sm:p-8">
                        <div className="flex justify-between items-start mb-4 sm:mb-8">
                            <div className={cn(
                                "px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black flex items-center gap-1 sm:gap-1.5 transition-colors",
                                stat.trendColor === 'emerald' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                            )}>
                                {stat.trend || '--'}
                            </div>
                            <div className={cn(
                                "h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-6 shadow-lg",
                                stat.color === 'orange' && "bg-orange-500 text-white shadow-orange-500/20",
                                stat.color === 'blue' && "bg-blue-500 text-white shadow-blue-500/20",
                                stat.color === 'green' && "bg-green-500 text-white shadow-green-500/20",
                            )}>
                                <stat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] sm:text-[14px] font-bold text-[#57534d] dark:text-slate-400 mb-0.5 sm:mb-1 leading-none">{stat.label}</p>
                            <h4 className="text-[20px] sm:text-[26px] text-[#1c1919] dark:text-white tracking-tighter leading-none font-bold">
                                <QuickCounter value={stat.value} isLoading={isLoading} />
                            </h4>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default DashboardStats;
