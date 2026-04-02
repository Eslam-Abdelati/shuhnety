import React, { useState, useEffect } from 'react';

const QuickCounter = ({ value, isLoading }) => {
    const [display, setDisplay] = useState('00');
    
    useEffect(() => {
        let interval;
        if (isLoading) {
            // انميشن سريع للأرقام أثناء التحميل
            interval = setInterval(() => {
                const randomNum = Math.floor(Math.random() * 99);
                setDisplay(randomNum.toString().padStart(2, '0'));
            }, 60);
        } else {
            // عرض الرقم الحقيقي عند انتهاء التحميل
            setDisplay(value.toString().padStart(2, '0'));
        }
        return () => clearInterval(interval);
    }, [isLoading, value]);

    return <span>{display}</span>;
}

export default QuickCounter;
