import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    offers: [],
};

const offerSlice = createSlice({
    name: 'offers',
    initialState,
    reducers: {
        addOffer: (state, action) => {
            const offer = action.payload;
            state.offers.unshift({
                ...offer,
                id: `OFF-${Math.floor(Math.random() * 900000) + 100000}`,
                status: 'pending', // pending, accepted, rejected, counter_offered
                createdAt: new Date().toISOString()
            });
        },
        updateOffer: (state, action) => {
            const { id, updates } = action.payload;
            const index = state.offers.findIndex(o => o.id === id);
            if (index !== -1) {
                state.offers[index] = { ...state.offers[index], ...updates };
            }
        },
        handleOfferAction: (state, action) => {
            const { id, action: offerAction, counterPrice } = action.payload;
            const offer = state.offers.find(o => o.id === id);
            if (offer) {
                offer.status = offerAction;
                if (counterPrice) {
                    offer.previousPrice = offer.price;
                    offer.price = counterPrice;
                    offer.lastUpdatedBy = 'customer';
                }
            }
        },
        respondToCounterOffer: (state, action) => {
            const { id, action: offerAction, newPrice } = action.payload;
            const offer = state.offers.find(o => o.id === id);
            if (offer) {
                offer.status = offerAction === 'negotiate' ? 'pending' : offerAction;
                if (newPrice) {
                    offer.previousPrice = offer.price;
                    offer.price = newPrice;
                    offer.lastUpdatedBy = 'driver';
                }
            }
        },
    },
});

export const { addOffer, updateOffer, handleOfferAction, respondToCounterOffer } = offerSlice.actions;
export default offerSlice.reducer;

