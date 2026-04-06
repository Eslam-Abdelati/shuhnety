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
        'delivered': 'تم التوصيل',
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
        customerName: s.client?.full_name || s.customerName || (s.client ? s.client.full_name : '---'),
        customerPhone: s.client?.phone_number || s.customerPhone || (s.client ? s.client.phone_number : '---'),
        recipientName: s.recipient_name || s.recipientName || '---',
        recipientPhone: s.recipient_phone || s.recipientPhone || '---',
    };
};

export const getStatusStyles = (status) => {
    switch (status) {
        case 'pending':
        case 'في انتظار العروض':
            return {
                bg: 'bg-amber-50',
                text: 'text-amber-700',
                border: 'border-amber-200',
                dot: 'bg-amber-500',
                label: status === 'pending' ? 'في انتظار العروض' : status
            };
        case 'has_offers':
        case 'عروض رهن المراجعة':
            return {
                bg: 'bg-orange-50',
                text: 'text-orange-700',
                border: 'border-orange-200',
                dot: 'bg-orange-500',
                label: status === 'has_offers' ? 'عروض رهن المراجعة' : status
            };
        case 'pickup_in_progress':
        case 'قيد التنفيذ • جاري التوجه للتحميل':
        case 'تم قبول العرض (في الطريق للاستلام)':
        case 'قيد التنفيذ':
            return {
                bg: 'bg-blue-50',
                text: 'text-blue-700',
                border: 'border-blue-200',
                dot: 'bg-blue-500',
                label: status === 'pickup_in_progress' ? 'جاري التوجه للاستلام' : status
            };
        case 'delivery_in_progress':
        case 'تم الاستلام (جاري التوصيل)':
        case 'جاري التوصيل':
        case 'تم التحميل وفي الطريق':
            return {
                bg: 'bg-indigo-50',
                text: 'text-indigo-700',
                border: 'border-indigo-200',
                dot: 'bg-indigo-500',
                label: status === 'delivery_in_progress' ? 'جاري التوصيل' : status
            };
        case 'delivered':
        case 'تم التوصيل':
            return {
                bg: 'bg-emerald-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                dot: 'bg-emerald-500',
                label: status === 'delivered' ? 'تم التوصيل' : status
            };
        case 'canceled':
        case 'ملغي':
            return {
                bg: 'bg-red-50',
                text: 'text-red-700',
                border: 'border-red-200',
                dot: 'bg-red-500',
                label: status === 'canceled' ? 'ملغي' : status
            };
        default:
            return {
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                border: 'border-slate-200',
                dot: 'bg-slate-500',
                label: status
            };
    }
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
