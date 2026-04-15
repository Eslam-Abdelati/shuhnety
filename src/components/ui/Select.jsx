import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export const Select = React.forwardRef(({ options = [], value, onChange, placeholder = "اختر...", label, error, disabled, className, isLoading }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    const selectedOption = options.find(opt => String(opt.value) === String(value))

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn("space-y-1.5", className)} ref={containerRef}>
            {label && <label className="text-[13px] font-bold text-[#57534d] block pr-1">{label}</label>}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
                    className={cn(
                        "w-full h-13 px-4 rounded-[1.25rem] border-2 flex items-center justify-between transition-all font-bold text-[13px] bg-slate-50/50",
                        isOpen ? "border-brand-primary ring-4 ring-brand-primary/10" : "border-slate-100",
                        error ? "border-red-500" : "hover:border-slate-200",
                        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {isLoading && (
                            <div className="h-3 w-3 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        )}
                        <span className={cn(selectedOption ? "text-slate-900" : "text-slate-300")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-[100] w-full bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden origin-top"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
                                {options.length > 0 ? (
                                    options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value)
                                                setIsOpen(false)
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-3 rounded-xl text-right text-[13px] font-bold transition-all duration-200 mb-0.5 last:mb-0",
                                                String(opt.value) === String(value) 
                                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-primary"
                                            )}
                                        >
                                            <span>{opt.label}</span>
                                            {String(opt.value) === String(value) && <Check className="h-3.5 w-3.5" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-400 text-xs font-bold">
                                        لا توجد خيارات متاحة
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && <p className="text-[11px] text-red-500 font-bold pr-1">{error.message}</p>}
        </div>
    )
})

Select.displayName = 'Select'
