// @flow

import { getSales, getSalesCountByStatuses } from 'crm-api/desktopService/salesService';
import { updateSale } from 'crm-api/saleService';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import {
    SALES_REQUEST,
    GET_SALES_SUCCESS,
    SALES_ERROR,
    GET_SALES_COUNT_BY_STATUSES_SUCCESS,
    UPDATE_SALE_SUCCESS,
} from 'crm-constants/desktop/salesConstants';
import { REQUEST_WAS_CANCELED } from 'crm-constants/common/constants';
import type { Dispatch } from 'redux';
import type { Sale } from 'crm-types/resourceDataTypes';
import type { UpdateSalePayload } from 'crm-api/saleService';
import trimValue from 'crm-utils/trimValue';

type Params = {
    content: Array<Sale>,
    totalElements: number,
    number: number,
};

export const fetchSales = ({
    statusFilter,
    activityDate,
    search,
    size,
    page,
    userId,
}: fetchSalesArguments, canceled?: boolean) => (dispatch: Dispatch) => {
    dispatch({
        type: SALES_REQUEST,
    });
    const value = trimValue(search);

    return getSales({
        statusFilter,
        activityDate,
        search: value,
        size,
        page,
        userId,
    }, canceled)
        .then((response: Array<Params>) => {
            dispatch({
                type: GET_SALES_SUCCESS,
                payload: response,
            });
        })
        .catch((error: Error) => {
            if (error.message !== REQUEST_WAS_CANCELED) {
                dispatch({
                    type: SALES_ERROR,
                    payload: error,
                });
            }
        });
};

export const fetchSalesCount = () => (dispatch: Dispatch) => {
    dispatch({
        type: SALES_REQUEST,
    });
    return getSalesCountByStatuses()
        .then((response: { [string]: number }) => {
            dispatch({
                type: GET_SALES_COUNT_BY_STATUSES_SUCCESS,
                payload: response,
            });
        })
        .catch((error: Object) => {
            dispatch({
                type: SALES_ERROR,
                payload: error,
            });
        });
};

export const editSale = (
    saleId: number,
    editSaleBody: UpdateSalePayload,
    salesRequestParams: fetchSalesArguments
) => (dispatch: Dispatch) => {
    dispatch({
        type: SALES_REQUEST,
    });
    return updateSale(saleId, editSaleBody)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_SUCCESS,
            });
            dispatch(fetchSales(salesRequestParams));
        })
        .catch((error: Object) => {
            dispatch({
                type: SALES_ERROR,
                payload: error,
            });
        });
};
