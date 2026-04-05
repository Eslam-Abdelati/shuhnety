import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'

export const ContactPage = () => {
    const [formStatus, setFormStatus] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormStatus('success')
        setTimeout(() => setFormStatus(null), 5000)
    }

    const contactInfo = [
        {
            title: 'راسلنا مباشرة',
            info: 'support@shuhnety.com',
            icon: Mail,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            title: 'اتصل بنا',
            info: '+20 123 456 7890',
            info2: '02 2345 6789',
            icon: Phone,
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            title: 'المقر الرئيسي',
            info: 'القاهرة، المعادي، برج النصر التجاري',
            info2: 'الدور العاشر، مكتب رقم 1005',
            icon: MapPin,
            color: 'bg-orange-50 text-brand-primary'
        }
    ]

    return (
        <div className="min-h-screen bg-[#fcfcf9] font-cairo text-right" dir="rtl">
            {/* Header Section */}
            <div className="relative bg-brand-secondary py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(235,106,29,0.15)_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-white/5 backdrop-blur-sm"
                        >
                            <MessageSquare className="h-3 w-3" />
                            نحن هنا لمساعدتك
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-5xl font-black text-white mb-6"
                        >
                            تواصل مع فريق شحنتي
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/60 text-lg font-bold leading-relaxed"
                        >
                            نسعى دائماً لتوفير أفضل تجربة لوجستية، فريقنا جاهز للرد على استفساراتك على مدار الساعة.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-20 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Contact Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {contactInfo.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-black text-brand-secondary mb-3">{item.title}</h3>
                                <p className="text-[#57534d] font-bold tracking-wide ltr text-right">{item.info}</p>
                                {item.info2 && <p className="text-[#57534d] font-bold tracking-wide mt-1 ltr text-right">{item.info2}</p>}
                            </motion.div>
                        ))}

                        {/* Working Hours Card */}
                        <div className="bg-brand-secondary p-8 rounded-[2.5rem] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full -translate-x-10 -translate-y-10"></div>
                            <div className="relative z-10">
                                <Clock className="h-10 w-10 text-brand-primary/50 mb-4" />
                                <h4 className="text-xl font-black mb-4">ساعات العمل</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-bold text-white/60">
                                        <span>الأحد - الخميس</span>
                                        <span className="text-white">9 ص - 6 م</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-white/60">
                                        <span>الجمعة والسبت</span>
                                        <span className="text-brand-primary">مغلق للراحة</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Area */}
                    <div className="lg:col-span-2">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 md:p-16 border border-slate-100 h-full"
                        >
                            <div className="mb-10">
                                <h2 className="text-3xl font-black text-brand-secondary mb-3 text-right">أرسل لنا رسالة</h2>
                                <p className="text-[#57534d] font-bold text-right leading-relaxed">سنقوم بالرد عليك خلال أقل من 12 ساعة عمل.</p>
                            </div>

                            {formStatus === 'success' ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-emerald-50 border border-emerald-100 p-10 rounded-[2.5rem] text-center"
                                >
                                    <div className="h-20 w-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                                        <Send className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-emerald-900 mb-2">تم الإرسال بنجاح!</h3>
                                    <p className="text-emerald-700 font-bold">شكراً لتواصلك مع شحنتي، سنرد عليك في أقرب وقت ممكن.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الأسم بالكامل</label>
                                        <input type="text" required className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold outline-none focus:border-brand-primary transition-all text-right" placeholder="ادخل اسمك هنا" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                        <input type="email" required className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold outline-none focus:border-brand-primary transition-all text-right" placeholder="email@example.com" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الموضوع</label>
                                        <select className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-bold outline-none focus:border-brand-primary transition-all text-right appearance-none cursor-pointer">
                                            <option>استفسار عام</option>
                                            <option>مشكلة تقنية</option>
                                            <option>شريك لوجستي (سائق/شركة)</option>
                                            <option>بلاغ عن شحنة</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رسالتك</label>
                                        <textarea required rows={5} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-5 font-bold outline-none focus:border-brand-primary transition-all text-right resize-none" placeholder="اكتب استفسارك بالتفصيل هنا..."></textarea>
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <Button type="submit" size="lg" className="w-full h-16 rounded-[2rem] bg-brand-primary hover:bg-orange-600 font-black text-lg shadow-xl shadow-brand-primary/20 transition-all hover:-translate-y-1">
                                            إرسال الرسالة الآن
                                            <Send className="mr-3 h-5 w-5" />
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Footer Back Button */}
                <div className="mt-16 text-center">
                    <Button asChild variant="ghost" className="rounded-2xl text-[#57534d] font-black hover:bg-slate-100">
                        <Link to="/" className="flex items-center gap-2">
                            العودة للرئيسية
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
