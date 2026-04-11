import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    shipments: [],
};

const shipmentSlice = createSlice({
    name: 'shipments',
    initialState,
    reducers: {
        addShipment: (state, action) => {
            state.shipments.unshift(action.payload);
        },
        updateShipmentStatus: (state, action) => {
            const { id, status } = action.payload;
            const shipment = state.shipments.find(s => s.id === id);
            if (shipment) {
                shipment.status = status;
            }
        },
        updateShipment: (state, action) => {
            const { id, ...updates } = action.payload;
            const index = state.shipments.findIndex(s => s.id === id);
            if (index !== -1) {
                state.shipments[index] = { ...state.shipments[index], ...updates };
            }
        },
        deleteShipment: (state, action) => {
            const id = action.payload;
            const shipment = state.shipments.find(s => s.id === id);
            if (shipment) {
                shipment.status = 'ملغي';
            }
        },
        setShipments: (state, action) => {
            state.shipments = action.payload;
        },
    },
});

export const { addShipment, updateShipmentStatus, updateShipment, deleteShipment, setShipments } = shipmentSlice.actions;
export default shipmentSlice.reducer;

