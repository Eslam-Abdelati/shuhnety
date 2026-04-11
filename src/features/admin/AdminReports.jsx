import { useState } from 'react'
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Truck, 
    Users, 
    Calendar, 
    Download, 
    Filter,
    BarChart3,
    PieChart,
    ArrowUpRight,
    Search
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts'

const data = [
    { name: 'يناير', shipments: 400, revenue: 2400 },
    { name: 'فبراير', shipments: 300, revenue: 1398 },
    { name: 'مارس', shipments: 200, revenue: 9800 },
    { name: 'أبريل', shipments: 278, revenue: 3908 },
    { name: 'مايو', shipments: 189, revenue: 4800 },
    { name: 'يونيو', shipments: 239, revenue: 3800 },
];

export const AdminReports = () => {
    const [reportType, setReportType] = useState('financial') // financial, performance, users

    const stats = [
        { label: 'إجمالي الإيرادات', value: '45,231.89', change: '+20.1%', icon: DollarSign, color: 'emerald' },
        { label: 'شحنات مكتملة', value: '+2,350', change: '+18.5%', icon: Truck, color: 'blue' },
        { label: 'كباتن نشطين', value: '+12,234', change: '+12.4%', icon: Users, color: 'brand' },
        { label: 'معدل النمو', value: '+573', change: '+20.1%', icon: TrendingUp, color: 'amber' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 font-cairo">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">تقارير المنصة التحليلية</h1>
                    <p className="text-sm font-bold text-slate-500 mr-1">نظرة شاملة على أداء شحنتي المالي والتشغيلي</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 text-xs font-black">
                        <Download className="ml-2 h-4 w-4" /> تصوير التقرير PDF
                    </Button>
                    <Button className="h-12 px-6 rounded-2xl bg-brand-primary text-white font-black text-xs shadow-xl shadow-brand-primary/20">
                        <Calendar className="ml-2 h-4 w-4" /> تخصيص الفترة
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="rounded-[2.5rem] border-none shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center",
                                    stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                                    stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                                    stat.color === 'brand' ? "bg-brand-primary/10 text-brand-primary" : "bg-amber-50 text-amber-600"
                                )}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{stat.change}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 px-4">
                {/* Main Growth Chart */}
                <Card className="xl:col-span-8 rounded-[3rem] border-none shadow-sm ring-1 ring-slate-100 overflow-hidden bg-white">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">نمو العمليات</h3>
                            <p className="text-xs font-bold text-slate-400">مقارنة بين عدد الشحنات والإيرادات شهرياً</p>
                        </div>
                        <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl">
                            <button className="px-4 py-1.5 bg-white shadow-sm rounded-lg text-xs font-black text-brand-primary">رسم بياني</button>
                            <button className="px-4 py-1.5 text-xs font-black text-slate-400">بيانات رقمية</button>
                        </div>
                    </div>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#009966" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#009966" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#94a3b8'}} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', fontFamily: 'Cairo' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#009966" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                                    <Area type="monotone" dataKey="shipments" stroke="#f59e0b" strokeWidth={4} fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Distribution of Goods Type */}
                <Card className="xl:col-span-4 rounded-[3rem] border-none shadow-sm ring-1 ring-slate-100 bg-white">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="text-lg font-black text-slate-900">توزيع البضائع</h3>
                        <p className="text-xs font-bold text-slate-400">أكثر أنواع البضائع تداولاً في المنصة</p>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        {[
                            { label: 'إلكترونيات', value: 45, color: 'emerald' },
                            { label: 'مواد غذائية', value: 30, color: 'amber' },
                            { label: 'أثاث منزلي', value: 15, color: 'blue' },
                            { label: 'مواد بناء', value: 10, color: 'rose' },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-black">
                                    <span className="text-slate-700">{item.label}</span>
                                    <span className="text-slate-400">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div 
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            item.color === 'emerald' ? "bg-emerald-500" :
                                            item.color === 'amber' ? "bg-amber-500" :
                                            item.color === 'blue' ? "bg-blue-500" : "bg-rose-500"
                                        )}
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

