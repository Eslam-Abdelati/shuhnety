import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Loading component used across the Shuhnety platform.
 * Supports different variants: fullScreen, section, and minimal.
 * 
 * @param {string} text - Optional text to display below the loader.
 * @param {boolean} fullScreen - If true, covers the entire viewport.
 * @param {boolean} section - If true, suitable for loading within sections or cards.
 * @param {boolean} minimal - If true, provides a minimal spinner (e.g., for buttons).
 * @param {string} className - Additional CSS classes.
 */
export const Loading = ({ 
    text = "جاري التحميل...", 
    fullScreen = false, 
    section = false, 
    minimal = false,
    className 
}) => {
    // Shared spinner animation
    const spinnerRotation = {
        rotate: 360,
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
        }
    };

    if (minimal) {
        return (
            <div className={cn("flex items-center gap-2", className)}>
                <motion.div animate={spinnerRotation}>
                    <Loader2 className="h-4 w-4 text-brand-primary" />
                </motion.div>
                {text && <span className="text-xs font-bold text-slate-500">{text}</span>}
            </div>
        );
    }

    if (section) {
        return (
            <div className={cn("flex flex-col items-center justify-center p-8 bg-white/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 transition-all", className)}>
                <div className="relative mb-4">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-16 w-16 bg-brand-primary/10 rounded-full flex items-center justify-center"
                    >
                        <Truck className="h-8 w-8 text-brand-primary" />
                    </motion.div>
                    <motion.div
                        animate={spinnerRotation}
                        className="absolute -top-1 -right-1 -bottom-1 -left-1 border-2 border-transparent border-t-brand-primary rounded-full"
                    />
                </div>
                {text && <p className="text-sm font-black text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>}
            </div>
        );
    }

    if (fullScreen) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                    "fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md",
                    className
                )}
            >
                <div className="relative mb-6">
                    <motion.div
                        animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="h-24 w-24 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-brand-primary/20"
                    >
                        <Truck className="h-12 w-12 text-white" />
                    </motion.div>
                    <motion.div
                        animate={spinnerRotation}
                        className="absolute -top-3 -right-3 -bottom-3 -left-3 border-4 border-transparent border-t-brand-primary border-r-brand-secondary/30 rounded-[2.5rem]"
                    />
                </div>
                {text && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <h3 className="text-xl font-black text-slate-800 dark:text-white">{text}</h3>
                        <div className="flex gap-1">
                            <motion.span 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                className="h-1.5 w-1.5 bg-brand-primary rounded-full" 
                            />
                            <motion.span 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                className="h-1.5 w-1.5 bg-brand-primary rounded-full" 
                            />
                            <motion.span 
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                className="h-1.5 w-1.5 bg-brand-primary rounded-full" 
                            />
                        </div>
                    </motion.div>
                )}
            </motion.div>
        );
    }

    // Default Section-like Fallback
    return (
        <div className={cn("flex flex-col items-center justify-center py-12", className)}>
            <motion.div animate={spinnerRotation}>
                <Loader2 className="h-10 w-10 text-brand-primary mb-4" />
            </motion.div>
            {text && <p className="text-slate-500 font-bold">{text}</p>}
        </div>
    );
};

