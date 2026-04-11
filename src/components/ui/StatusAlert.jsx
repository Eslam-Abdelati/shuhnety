import React from 'react';
import { AlertCircle, CheckCircle2, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export const StatusAlert = ({ message, type = 'info', onClose }) => {
    if (!message) return null;

    const styles = {
        success: {
            bg: 'bg-emerald-50/80',
            text: 'text-emerald-800',
            border: 'border-emerald-200/50',
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        },
        error: {
            bg: 'bg-red-50/80',
            text: 'text-red-800',
            border: 'border-red-200/50',
            icon: <AlertCircle className="h-5 w-5 text-red-600" />
        },
        warning: {
            bg: 'bg-amber-50/80',
            text: 'text-amber-800',
            border: 'border-amber-200/50',
            icon: <AlertTriangle className="h-5 w-5 text-amber-600" />
        },
        info: {
            bg: 'bg-blue-50/80',
            text: 'text-blue-800',
            border: 'border-blue-200/50',
            icon: <Info className="h-5 w-5 text-blue-600" />
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border backdrop-blur-sm shadow-sm transition-all duration-300 w-full",
                    currentStyle.bg,
                    currentStyle.text,
                    currentStyle.border
                )}
                dir="rtl"
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="shrink-0 flex items-center justify-center">
                        {currentStyle.icon}
                    </div>
                    <span className="font-bold text-[14px] leading-relaxed tracking-tight text-right">
                        {message}
                    </span>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        type="button"
                        className="mr-2 hover:bg-black/5 p-1.5 rounded-xl transition-all active:scale-90 flex items-center justify-center shrink-0"
                    >
                        <X className="h-4 w-4 opacity-50 hover:opacity-100" />
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

