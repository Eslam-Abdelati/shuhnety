import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addShipment as addShipmentAction,
    updateShipmentStatus as updateShipmentStatusAction,
    updateShipment as updateShipmentAction,
    deleteShipment as deleteShipmentAction,
    setShipments as setShipmentsAction
} from './slices/shipmentSlice';

export const useShipmentStore = (selector) => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.shipments);

    const store = useMemo(() => ({
        ...state,
        addShipment: (shipment) => dispatch(addShipmentAction(shipment)),
        updateShipmentStatus: (id, status) => dispatch(updateShipmentStatusAction({ id, status })),
        updateShipment: (shipment) => dispatch(updateShipmentAction(shipment)),
        deleteShipment: (id) => dispatch(deleteShipmentAction(id)),
        setShipments: (shipments) => dispatch(setShipmentsAction(shipments)),
    }), [state, dispatch]);

    return selector ? selector(store) : store;
};

