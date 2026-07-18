import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/utils/cn'

export const Select = React.forwardRef(({ options = [], value, onChange, placeholder = "اختر...", label, error, disabled, className, isLoading, onClick }, ref) => {
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
        <div className={cn("block text-sm", className)} ref={containerRef}>
            {label && <span className="text-gray-700 font-bold block mb-2">{label}</span>}
            <div className="relative">
                <button
                    type="button"
                    onClick={(e) => {
                        if (!disabled && !isLoading) {
                            setIsOpen(!isOpen)
                            if (onClick) onClick(e)
                        }
                    }}
                    className={cn(
                        "w-full text-sm rounded-xl border flex items-center justify-between transition-all px-4 py-3 bg-[#f8fafc]",
                        isOpen ? "border-brand-primary ring-1 ring-brand-primary outline-none" : "border-gray-200",
                        error ? "border-red-500" : "hover:border-gray-300",
                        (disabled || isLoading) && "opacity-50 cursor-not-allowed bg-gray-50"
                    )}
                >
                    <div className="flex items-center gap-2">
                        {isLoading && (
                            <div className="h-3 w-3 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
                        )}
                        <span className={cn(selectedOption ? "text-gray-900" : "text-gray-400/80")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 5, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute z-[100] w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden origin-top mt-1.5"
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
                                                "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-right text-sm transition-colors duration-150 mb-0.5 last:mb-0",
                                                String(opt.value) === String(value) 
                                                    ? "bg-brand-primary/10 text-brand-primary font-medium" 
                                                    : "text-gray-700 hover:bg-gray-50"
                                            )}
                                        >
                                            <span>{opt.label}</span>
                                            {String(opt.value) === String(value) && <Check className="h-4 w-4" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-3 text-center text-gray-400 text-sm">
                                        لا توجد خيارات متاحة
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && <span className="text-xs text-red-500 mt-1 block">{error.message}</span>}
        </div>
    )
})

Select.displayName = 'Select'
