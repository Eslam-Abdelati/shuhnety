import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addOffer as addOfferAction,
    updateOffer as updateOfferAction,
    handleOfferAction as handleOfferActionImpl,
    respondToCounterOffer as respondToCounterOfferAction
} from './slices/offerSlice';

export const useOfferStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.offers);

    const store = useMemo(() => ({
        ...state,
        addOffer: (offer) => dispatch(addOfferAction(offer)),
        updateOffer: (id, updates) => dispatch(updateOfferAction({ id, updates })),
        handleOfferAction: (id, action, counterPrice) => dispatch(handleOfferActionImpl({ id, action, counterPrice })),
        respondToCounterOffer: (id, action, newPrice) => dispatch(respondToCounterOfferAction({ id, action, newPrice })),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};
