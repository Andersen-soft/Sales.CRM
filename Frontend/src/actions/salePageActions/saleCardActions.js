// @flow

import {
    updateSale,
    deleteSale,
} from 'crm-api/saleService';
import { getEstimations, updateEstimation } from 'crm-api/saleCard/estimateServiceForSale';
import {
    apiUpdateResume,
    apiGetResumes,
} from 'crm-api/saleCard/resumeServiceForSale';
import { fetchSale } from 'crm-actions/salePageActions/salePageActions';

import {
    GET_SALE_CARD_REQUEST,
    GET_SALE_CARD_ERROR,
    UPDATE_SALE_CARD,
    EDIT_SALE_COMMENT,
    GET_RESUMES_LIST_SUCCESS_REQUEST,
    GET_ESTIMATES_LIST_SUCCESS_REQUEST,
} from 'crm-constants/salePage/saleCardConstant';
import type { Dispatch } from 'redux';
import type {
    CommonListItem,
    Contact,
} from 'crm-types/resourceDataTypes';
import type { addActivityArguments } from 'crm-api/desktopService/activityService';
import { addActivity as postActivity } from 'crm-api/desktopService/activityService';
import type {
    Responsible,
} from 'crm-components/SalePage/SaleCard/attributes/AttributeProps.flow';

export type SaleForUpdate = {
    id: number,
    companyId?: number,
    companyName: string,
    createDate: string,
    description: string,
    estimations: Array<CommonListItem>,
    name: string,
    lastActivityDate: string,
    mainContact: string,
    nextActivityDate?: ?string,
    responsible: Responsible,
    resumes: Array<CommonListItem>,
    status: string,
    nextActivityId: number,
    sourceId?: number,
};

export const fetchEstimatesList = (companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return getEstimations(companyId)
        .then((response: Array<Contact>) => {
            dispatch({
                type: GET_ESTIMATES_LIST_SUCCESS_REQUEST,
                payload: response,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const fetchResumesList = (companyId: ?number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return apiGetResumes(companyId)
        .then((response: { content: Array<Contact> }) => {
            dispatch({
                type: GET_RESUMES_LIST_SUCCESS_REQUEST,
                payload: response.content,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const fetchSaleCard = (companyId: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    try {
        dispatch(fetchResumesList(companyId));
        dispatch(fetchEstimatesList(companyId));
    } catch (error) {
        dispatch({
            type: GET_SALE_CARD_ERROR,
            payload: error,
        });

        throw new Error(error);
    }
};

export const updateSaleCard = (
    id: number, updateSaleCardRequestBody: SaleForUpdate
) => (dispatch: Dispatch, getState: Function) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    const { category } = getState().SaleCard.sale;

    return updateSale(id, {
        category,
        ...updateSaleCardRequestBody,

    })
        .then(() => {
            dispatch({
                type: UPDATE_SALE_CARD,
            });
            dispatch(fetchSaleCard(id));
            dispatch(fetchSale(id));
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const deleteSaleCard = (id: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return deleteSale(id)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_CARD,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const editComment = (comment: string) => ({
    type: EDIT_SALE_COMMENT,
    payload: comment,
});

export const updateResumeForSale = (idResume: number, idSale: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return apiUpdateResume(idResume, idSale)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_CARD,
            });
            dispatch(fetchSale(idSale));
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const updateEstimateForSale = (idEstimate: number, idSale: number) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });

    return updateEstimation(idEstimate, idSale)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_CARD,
            });
            dispatch(fetchSale(idSale));
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};

export const addActivity = (
    requestBody: addActivityArguments,
) => (dispatch: Dispatch) => {
    dispatch({
        type: GET_SALE_CARD_REQUEST,
    });
    return postActivity(requestBody)
        .then(() => {
            dispatch({
                type: UPDATE_SALE_CARD,
            });
        })
        .catch((error: Error) => {
            dispatch({
                type: GET_SALE_CARD_ERROR,
                payload: error,
            });
        });
};
