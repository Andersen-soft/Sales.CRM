// @flow

import { getSalesWithPastActivities } from 'crm-api/desktopService/salesService';
import {
    PAST_ACTIVITIES_REQUEST,
    PAST_ACTIVITIES_ERROR,
    GET_PAST_ACTIVITIES_SUCCESS,
    UPDATE_PAST_ACTIVITIES_SUCCESS,
} from 'crm-constants/pastActivities/pastActivitiesConstants';
import { updateSale } from 'crm-api/saleService';
import type { fetchSalesArguments } from 'crm-api/desktopService/salesService';
import type { Dispatch } from 'redux';
import type { Sale } from 'crm-types/resourceDataTypes';
import type { UpdateSalePayload } from 'crm-api/saleService';
import trimValue from 'crm-utils/trimValue';

type Params = {
    content: Array<Sale>,
    totalElements: number,
    number: number,
};

export const fetchSalesWithPastActivities = ({
    activityDate,
    search,
    page,
    size,
    userId,
}: fetchSalesArguments) => (dispatch: Dispatch) => {
    dispatch({
        type: PAST_ACTIVITIES_REQUEST,
    });
    const value = trimValue(search);

    return getSalesWithPastActivities({
        activityDate,
        search: value,
        page,
        size,
        userId,
    })
        .then((response: Array<Params>) => {
            dispatch({
                type: GET_PAST_ACTIVITIES_SUCCESS,
                payload: response,
            });
        })
        .catch((error: Object) => {
            dispatch({
                type: PAST_ACTIVITIES_ERROR,
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
        type: PAST_ACTIVITIES_REQUEST,
    });
    return updateSale(saleId, editSaleBody)
        .then(() => {
            dispatch({
                type: UPDATE_PAST_ACTIVITIES_SUCCESS,
            });
            dispatch(fetchSalesWithPastActivities(salesRequestParams));
        })
        .catch((error: Object) => {
            dispatch({
                type: PAST_ACTIVITIES_ERROR,
                payload: error,
            });
        });
};
