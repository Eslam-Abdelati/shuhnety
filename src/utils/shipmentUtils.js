export const GOODS_TYPES = [
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'appliances', label: 'أجهزة منزلية' },
    { value: 'housewares', label: 'مستلزمات منزلية' },
    { value: 'furniture', label: 'أثاث' },
    { value: 'textiles', label: 'منسوجات' },
    { value: 'food', label: 'مواد غذائية' },
    { value: 'agricultural', label: 'منتجات زراعية' },
    { value: 'construction', label: 'مواد بناء' },
    { value: 'chemicals', label: 'كيماويات' },
    { value: 'machinery', label: 'آلات ومعدات' },
    { value: 'other', label: 'أخرى (اكتب في الوصف)' }
];

export const getGoodsTypeLabel = (value, other_label) => {
    if (value === 'other' && other_label) return other_label;
    if (value === 'other') return 'أخرى';
    const type = GOODS_TYPES.find(t => t.value === value);
    return type ? type.label : value;
};

export const mapShipmentData = (s) => {
    const backendToFrontendStatus = {
        'pending': 'في انتظار العروض',
        'has_offers': 'عروض رهن المراجعة',
        'pickup_in_progress': 'قيد التنفيذ',
        'delivery_in_progress': 'جاري التوصيل',
        'arrived': 'تم الوصول',
        'delivered': 'تم التسليم',
        'canceled': 'ملغي',

    };

    return {
        ...s,
        // use trackingNumber for display if available, otherwise fallback to id
        displayId: s.trackingNumber || (s.id ? `SH-${s.id}` : (s._id ? `SH-${s._id.substr(-6)}` : '---')),
        status_original: s.status,
        status: backendToFrontendStatus[s.status] || s.status,
        createdAt: s.createDateTime || s.createdAt || s.created_at || new Date().toISOString(),
        pickupGovernorate: s.pickup_governorate || s.pickupGovernorate,
        pickupCity: s.pickup_city || s.pickupCity,
        destinationGovernorate: s.destination_governorate || s.destinationGovernorate,
        destinationCity: s.destination_city || s.destinationCity,
        pickupPoint: `${s.pickup_governorate || s.pickupGovernorate}، ${s.pickup_city || s.pickupCity}`,
        destinationPoint: `${s.destination_governorate || s.destinationGovernorate}، ${s.destination_city || s.destinationCity}`,
        pickupAddress: s.pickup_address_details || s.pickup_address || s.pickupAddressDetails || s.pickupAddress,
        destinationAddress: s.destination_address_details || s.destination_address || s.destinationAddressDetails || s.destinationAddress,
        weight: s.total_weight || s.weight || s.totalWeight,
        goodsType: (s.goods_type === 'other' || s.goodsType === 'other')
            ? (s.other_goods_type || s.otherGoodsType || (s.goods_type || s.goodsType))
            : (s.goods_type || s.goodsType),
        price: s.budget || s.price || s.expected_price || 0,
        senderName: s.senderName || s.sender_name || s.client?.full_name || s.customerName || '---',
        senderPhone: s.senderPhone || s.sender_phone || s.client?.phone_number || s.customerPhone || '---',
        recipientName: s.recipientName || s.recipient_name || '---',
        recipientPhone: s.recipientPhone || s.recipient_phone || '---',
        deliveryOtp: s.deliveryOtp || s.delivery_otp || '---',
    };
};

export const getStatusStyles = (status) => {
    const statusMap = {
        'pending': { label: 'في انتظار العروض', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
        'في انتظار العروض': { label: 'في انتظار العروض', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },

        'has_offers': { label: 'عروض رهن المراجعة', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
        'عروض رهن المراجعة': { label: 'عروض رهن المراجعة', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },

        'pickup_in_progress': { label: 'قيد التنفيذ', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
        'قيد التنفيذ': { label: 'قيد التنفيذ', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },

        'delivery_in_progress': { label: 'جاري التوصيل', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
        'جاري التوصيل': { label: 'جاري التوصيل', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },

        'arrived': { label: 'تم الوصول', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
        'تم الوصول': { label: 'تم الوصول', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },

        'delivered': { label: 'تم التسليم', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
        'تم التسليم': { label: 'تم التسليم', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },

        'canceled': { label: 'ملغي', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
        'ملغي': { label: 'ملغي', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
    };

    return statusMap[status] || {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
        label: status
    };
};

export const getVehicleTypeLabel = (value) => {
    const vehicleTypes = {
        'MediumTruck': 'نصف نقل',
        'Pickup': 'ربع نقل',
        'MiniTruck': 'سوزوكي',
        'CargoTricycle': 'تروسيكل',
        'Other': 'أخرى'
    };
    return vehicleTypes[value] || value || '';
};

export const formatEstimatedTime = (totalMinutes) => {
    if (!totalMinutes) return '---';
    const total = Number(totalMinutes);

    const days = Math.floor(total / (24 * 60));
    const hours = Math.floor((total % (24 * 60)) / 60);
    const minutes = total % 60;

    const parts = [];
    if (days > 0) parts.push(`${days} يوم`);
    if (hours > 0) parts.push(`${hours} ساعة`);
    if (minutes > 0) parts.push(`${minutes} دقيقة`);

    return parts.join(' و ') || 'أقل من دقيقة';
};

